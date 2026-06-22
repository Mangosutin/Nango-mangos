# Nango.memo



## db処理
### 保存方法（検討）
1. 保存、上書き保存の形態で保存(ユーザーがファイルを選択)  
   とりまこれ
2. ローカルでサーバーを立てる。
	* javascript
	* python
### **import process**
```mermaid
flowchart TB
S(start import) --> stp[user chose=que]
stp --> |que|fuc0[[import_func]]
fuc0 --- Feros[(formatEROs)]
 --> pop-up
fuc0 --- Ndb[(dicts)] 
Ndb --- fuc1[[Duplicate_func]]
---Ncur_db[(view_DB)]
--- us{user_check\npop-up}
-->|ok| Lok[リロード]
Odb[(既存のDB)] -.- Ncur_db
us --> |no| Lno[破棄]
Lno --> fin_main(end)
Lok --> fin_main

	Sfuc0(import_func) --> que0
	Sfuc0 o-.-o fuc0
	que0[queの0番を選択] --> |dict|dict
	que0 --> |list| dictsにばらす
	dictsにばらす --> dict
	dict --> chec{形式確認}
	chec --> |good|Gdicts[(dicts)] 
	chec --> |bad|Bdicts[(formatEROs)]
	chec --> |lack|補完
	tmp[(dir\njson形式)]-.- 補完
	--> Gdicts
	Gdicts --> Lfunc0[queの0番を削除]
	Bdicts --> Lfunc0
	Lfunc0 --> serv_qu{残りqueを確認}
	serv_qu --> |残り有|que0
	serv_qu --> |残り無|fin_fuc0(return\ndicts\nformatEROs)

	Sfuc1(Duplicate_func) --> ls0[dists-listのi番を選択]
	fuc1 o-.-o Sfuc1
	ls0 --- sr_same{同単語の有無\n完全一致}
	Odb -.- sr_same
	Ndb -.- sr_same
	sr_same --- |same-in-dicts-list| 要素を削除 --> conf[競合処理]
	sr_same --> |same-in-only-old| conf
	sr_same --> |no-same| Lfunc1{i+=1\nlen>i}
	conf --> 差分抽出 --> cnf{統合可能}
	cnf --> |No|ask_cnf[\"user ask conflict"\]-->mix
	cnf --> |Yes|mix[統合\n登録順最速へ]
	mix--> Lfunc1
	Lfunc1 --> |len>i|ls0
	Lfunc1 --> |len==i|fin_fuc1(return db)

```
#### memo
* idはそのまま使用せず、単語の順番として扱う。
	* 読み込み後にimportした単語のidを設定
### 重複dataの処理
#### 内容の比較
->完全一致は無視。  
　**とりあえず、項目単位で完全一致以外は競合判定**
　差分については、追加を採択。  
　競合する内容はユーザーが確認。  
1. 重複とは単語名が同じもの(ただし外来語はスペルで判定。)
2. meaning,other tagsなどのリストは競合でなければ追加。
3. そのほかはユーザーが確認。

#### someday
*  format ERRORのpop-upからの形式即時修正、ユーザー主体
*  重複確認の単語、カッコ内のえいごなども・・・



### ユーザー編集機能
	* 意味単位での削除機能を実装(競合処理の補助)

### 保存形式
	Name = `NangoDB_project-version`
