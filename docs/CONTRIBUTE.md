# Nango_v3.10-neo

## 開発手順,進捗

- [ ] server構築 `with python`
  - [ ] データ管理システムの構築 server side
    - [ ] jsonfileのimport,dbとの結合
      - [x] imported fileの形式検査(クレンジング) with mod(`json`,`jsonschema`)
      - [ ] imported fileの重複項目処理 with mod `DeepDiff`
        - [ ] [onetime] jsonFMT>rootに`additional`を追加
      - [ ] 複数ファイルimportへの対応
    - [ ] JavaScriptとへのデータ送信`fetch API`
- [ ] pageの作成 `with JavaScript,HTML`
  - [ ] serverとのやり取り `JavaScript` mod `Ajax`
  - [ ] 画面描画の作成 `JavaScript,HTML`

## 開発ルール

### バージョン

#### 命名規則

| 種類 | ファイル名                      |
| ---- | ------------------------------- |
| HTML | `Nango-neo.vMM_m_P.html`        |
| JS   | `Nango_main.vMM.m.p.js`         |
| Json | `Nango-neo_template.vMM.p.json` |
| Pack | `Nango_v3.10-neo.MM.m.p.zip`    |

ただし、使用可能でない場合はPackのバージョンを上げないでください

| 部分 | 意味               | 上げるタイミング                             |
| ---- | ------------------ | -------------------------------------------- |
| `MM` | メジャーバージョン | 大きなレイアウト変更・データ構造の変更       |
| `m`  | マイナーバージョン | 互換性を保ったままでの機能追加や中規模な変更 |
| `P`  | パッチバージョン   | バグ修正・小機能追加                         |

例: `v03_10` → `v03_11`（バグ修正） / `v04_00`（レイアウト刷新）

#### version変更記録の形式

毎回必須ではありません。パック更新時はお願いします。

[neo-versions.md](C:\Users\Ariku\OneDrive\Documents\Nango\neo-versions.md)
に記録します。

> ## ファイルの種類はh2
>
> ### ファイルのメジャーバージョンはh3
>
> #### 構造,変更など
>
> > ## マイナーバージョンはクオーテーション内h2
> >
> > ### パッチバージョンはh3
