# コントリビューションガイド

難語ビューアーへの改善・機能追加を歓迎します。  
このドキュメントでは、コードの構造・拡張ポイント・変更時の注意点をまとめています。

---

## ファイル構成

本プロジェクトは **単一のHTMLファイル** で完結しています。

```
Nango_vXX_YY.html
│
├── <style>        CSS変数によるテーマ定義、全UIスタイル
├── <body>         HTMLマークアップ（ツールバー、サイドバー、メインペイン）
└── <script>
    ├── wordData[]           デフォルトデータ（配列）
    ├── アプリ状態変数         currentIndex, searchQuery, sortType, currentHierarchy ...
    └── 関数群（番号付きセクション）
        ├── 1. 初期化         initApp(), refreshOpenState(), saveToLocalStorage()
        ├── 2. 検索・ソート    handleSearch(), setSort(), setHierarchyStructure(), getProcessedWords()
        ├── 3. サイドバー     renderSidebarTree()
        ├── 4. 詳細表示       showViewMode()
        ├── 5. 編集フォーム   showEditForm(), showNewForm(), cancelEdit(), saveWord(), deleteCurrentWord()
        ├── 6. タグ管理       showManagePanel(), closeManagePanel(), renderTagManagementTables(), renameTag()
        └── 7. データ管理     triggerImport(), importJSON(), exportJSON(), resetToDefault()
```

---

## 開発ルール

### バージョン命名規則

ファイル名は `Nango_vMM_PP.html` の形式にしてください。

| 部分 | 意味 | 上げるタイミング |
|------|------|-----------------|
| `MM` | メジャーバージョン | 大きなレイアウト変更・データ構造の変更 |
| `PP` | パッチバージョン | バグ修正・小機能追加 |

例: `v03_10` → `v03_11`（バグ修正） / `v04_00`（レイアウト刷新）

### コーディングスタイル

- インデントは **スペース4つ**
- 関数はセクション番号付きコメントでグループ化する  
  例: `// 8. ○○機能`
- CSSの色・サイズはすべて `:root` の **CSS変数** で定義し、直書きしない
- グローバル変数は `<script>` 冒頭の「アプリケーション状態」ブロックにまとめる

---

## データ構造を変更するとき

`wordData` 配列の各オブジェクトにフィールドを追加する場合、以下の箇所をすべて確認・修正してください。

1. **デフォルトデータ** — スクリプト冒頭の `wordData` サンプルに新フィールドを追加
2. **詳細表示** — `showViewMode()` に表示ロジックを追加
3. **編集フォーム** — `showEditForm()` / `showNewForm()` にフォーム要素を追加
4. **保存処理** — `saveWord()` で新フィールドの値を読み取って保存
5. **インポート** — `importJSON()` の後処理で新フィールドのデフォルト値補完を追加
6. **JSONスキーマコメント** — コード内のデータ構造コメントを更新

タグ系フィールド（`fieldTag`, `eraTag` のような分類軸）を追加する場合は、さらに以下も必要です。

7. **CSS変数** — 新タグ用の背景色・文字色を `:root` に追加
8. **階層切り替え** — `setHierarchyStructure()` と `getProcessedWords()` に新軸を追加
9. **タグ管理パネル** — `renderTagManagementTables()` と `renameTag()` に新タグ処理を追加

---

## 新機能を追加するときのチェックリスト

- [ ] 新しい関数はセクションコメント（`// N. 機能名`）内にまとめる
- [ ] UIボタンはツールバー（`.toolbar`）またはサイドバー（`.sidebar`）の適切な位置に配置
- [ ] 状態変数が必要なら、スクリプト冒頭の「アプリケーション状態」ブロックに宣言する
- [ ] データを変更する処理の最後に `saveToLocalStorage()` を呼ぶ
- [ ] サイドバーの再描画が必要なら `renderSidebarTree()` を呼ぶ
- [ ] `README.md` のバージョン履歴にエントリを追加する

---

## よくある改修ポイント

### カードの表示セクションを増やしたい

`showViewMode()` 内の `innerHTML` テンプレートに新しいセクションブロックを追加するだけで対応できます。

```javascript
// 例: 「参考文献」セクションを追加
const referencesHtml = data.references
    ? `<div class="section-title">参考文献</div>
       <div class="text-content">${data.references}</div>`
    : '';

// innerHTML テンプレートの末尾付近に ${referencesHtml} を挿入
```

### ソート軸を増やしたい

`getProcessedWords()` 内の `switch(sortType)` に新しい `case` を追加し、ツールバーのボタン要素とその `onclick` も追加してください。

### エクスポートのファイル名を変えたい

`exportJSON()` 内の `a.download` の値を変更してください。

```javascript
// 例: 日付を含むファイル名
const today = new Date().toISOString().slice(0, 10);
a.download = `難語データ_${today}.json`;
```

---

## よくあるバグのパターン

| 症状 | 原因 | 確認箇所 |
|------|------|----------|
| 編集後にサイドバーが更新されない | `renderSidebarTree()` の呼び出し漏れ | `saveWord()` の末尾 |
| インポート後にフィールドが `undefined` になる | 新フィールドのデフォルト値補完漏れ | `importJSON()` の正規化処理 |
| タグ変更が一部の単語にしか反映されない | `renameTag()` のフィールド指定ミス | `renameTag()` 内の条件分岐 |
| リセット後もデータが残る | localStorage のキー名のミス | `resetToDefault()` と `saveToLocalStorage()` |
