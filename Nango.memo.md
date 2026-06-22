# Nango.memo



## db処理
```mermaid
flowchart TB
S(start import) --> stp[user chose=que]
stp --> |que|imp_pr[[imp_func]]
imp_pr --- Feros[(formatEROs)]
--- EROpop[形式エラー\nformatEROs]---log[(logs)]
EROpop --> pop-up
imp_pr --- Ndb[(dicts)] 
Odb[(既存のDB)] -.- Ncur_db[(view_DB)]
Ndb --- Ncur_db
--> リロード


Sfuc_1(imp_func) --> 
que0[queの0番を選択] --> |dict|dict
que0 --> |list| dictsにばらす
dictsにばらす --> dict
dict --> chec{形式確認}
chec --> |good|Gdicts[(dicts)] 
chec --> |bad|Bdicts[(formatEROs)]
chec --> |lack|補完
tmp[(dir\njson形式)]-.- 補完
--> Gdicts
Gdicts --> last[queの0番を削除]
Bdicts --> last
last --> serv_qu{残りqueを確認}
serv_qu --> |残り有|que0
serv_qu --> |残り無|Efuc_1(return\ndicts\nformatEROs)
```
### import時
* idはそのまま使用せず、単語の順番として扱う。
	* 読み込み後にimportした単語のidを設定
### 重複dataの処理
#### 内容の比較
->完全一致は無視。
　差分については、追加を採択。
　競合する内容はユーザーが確認。

	1. 重複とは単語名が同じもの(ただし外来語はスペルで判定。)
	2. meaning,other tagsなどのリストは競合でなければ追加。
	3. そのほかはユーザーが確認。

### ユーザー編集機能

	* 意味単位での削除機能を実装(競合処理の補助)

### 保存形式
	Name = `NangoDB_project-version`
