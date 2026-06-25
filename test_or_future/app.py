import os
import json
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__)

DATA_FILE = 'data.json'

# データの読み込み関数
def load_data():
    if not os.path.exists(DATA_FILE):
        initial_data = {"words": []}
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(initial_data, f, ensure_ascii=False, indent=2)
        return initial_data
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {"words": []}

# データの保存関数
def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# 1. 画面の配信（ブラウザでアクセスした時にビューアーを表示する）
@app.route('/')
def index():
    return send_from_directory('.', 'viewer.html')

# 2. 全単語データの取得 API
@app.route('/api/words', methods=['GET'])
def get_words():
    return jsonify(load_data())

# 3. 単語データの上書き保存 API（編集画面などからの保存用）
@app.route('/api/words', methods=['POST'])
def save_words():
    data = request.json
    if not data or "words" not in data:
        return jsonify({"status": "error", "message": "不適切なデータ形式です"}), 400
    
    # 保存前に念のためIDを上から再配置（単語の順番として扱う仕様）
    for idx, w in enumerate(data["words"]):
        w["id"] = idx + 1
        
    save_data(data)
    return jsonify({"status": "success", "message": "サーバーに保存しました"})

# 4. 複数JSONの一括インポート・マージ API
@app.route('/api/words/import', methods=['POST'])
def import_words():
    import_data = request.json
    if not import_data or "words" not in import_data:
        return jsonify({"status": "error", "message": "不適切なデータ形式です"}), 400
    
    current_data = load_data()
    current_words = current_data.get("words", [])
    new_words = import_data.get("words", [])
    
    # 重複判定用のマップを作成（単語名をキーにする ※外来語のスペル判定にする場合はここを調整）
    word_map = {w["word"]: w for w in current_words}
    conflicts = []  # ユーザー確認が必要な競合データを入れるリスト
    
    for new_w in new_words:
        w_name = new_w.get("word")
        
        # 既存にない単語はそのまま追加
        if w_name not in word_map:
            current_words.append(new_w)
            word_map[w_name] = new_w
            continue
            
        # 既存にある（重複している）場合の処理
        exist_w = word_map[w_name]
        
        # ① meaning リストのマージ（重複していない意味だけ追加）
        exist_meanings = [m.get("meaning") for m in exist_w.get("meaning", [])]
        for m in new_w.get("meaning", []):
            if m.get("meaning") not in exist_meanings:
                exist_w.setdefault("meaning", []).append(m)
                
        # ② other_tags のマージ
        exist_tags = set(exist_w.get("other_tags", []))
        for t in new_w.get("other_tags", []):
            if t not in exist_tags:
                exist_w.setdefault("other_tags", []).append(t)
                
        # ③ その他の項目（memo, gemini_note, column）の競合チェック
        for field in ["memo", "gemini_note", "column"]:
            new_val = new_w.get(field, "")
            exist_val = exist_w.get(field, "")
            
            if new_val and not exist_val:
                # 既存が空で、新しいデータがあるなら追加
                exist_w[field] = new_val
            elif new_val and exist_val and new_val != exist_val:
                # 両方値があり、内容が異なる場合は「競合」として記録
                conflicts.append({
                    "word": w_name,
                    "field": field,
                    "current": exist_val,
                    "imported": new_val
                })
                
    # 読み込み後にすべてのIDを再設定（単語の順番として扱う仕様）
    for idx, w in enumerate(current_words):
        w["id"] = idx + 1
        
    current_data["words"] = current_words
    save_data(current_data)
    
    return jsonify({
        "status": "success",
        "message": "インポート処理が完了しました",
        "conflicts": conflicts  # 競合があればフロントに返す
    })

if __name__ == '__main__':
    # ローカル環境でデバッグモードで起動 (ポート5000)
    app.run(debug=True, port=5000)