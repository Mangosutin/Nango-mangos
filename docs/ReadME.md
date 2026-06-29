# Nango-neo

## ファイル構造

```powershell
Nango
├─.venv
│  ├─Include
│  ├─Lib
│  │  └─...
│  └─Scripts
├─.vscode
│      settings.json
│
├─docs
│      CONTRIBUTE.md
│      Gemini_first_talk.md
│      Nango.memo.md
│      neo-versions.md
│      ReadME.md
│      Where am I drifting to.md
│
├─Nango_v3.10-neo.01.0.0
│  │  Nango-neo.v01.1.0.html
│  │  Nango_main.v01.0.0.js
│  │
│  └─DTformats
│          Nango-neo_DTinstruction.v03.10.txt
│          Nango-neo_DTtemplate.v03.10.json
│
├─Nango_v3.10-neo_archives
│      Nango_v3.10-neo.01.0.0.zip
│
└─test_or_future
        app.py
```

## DB

保存形式:`JSON`
形式設定:`JSON schema Draft 2020-12`
保存場所:未決定 `flask`によるpythonサーバーの作成をしながら決めます。

詳細なFMTは`Nango_v3.10-neo.xx.x.x\DTformats\`を確認してください。

### 操作

python module

|用途|module名|備考|
|---|---|---|
|jsonの読み込み|json(標準)||
|FMTチェック|jsonschema|Draft2020-12に対応しているv4.0.0以降|
|差分抽出(重複時)|DeepDiff||

### `additional data`について

本プロジェクトにおいて、JSONのデータファイルに規定されていない項目を保存することは認めています。そしてそれは、`JSON>root`の`"additional":iterable`内に`string`で収納してください。

これは、`DeepDiff module`の仕様によって、重複処理をする際に`words`のデータの`key`が大きく変わることは避ける必要があるためです。
