# From neo.01.0.0 based Nango v3.10

## appversion
### 1. neo.01.0.0
#### **files**
    - Nango-neo.v01.1.0.html
    - Nango_main.v01.0.0.js
    - Nango-neo_template.v01.json


## HTML version
### 1. v01.0.0
#### 変更
        - javascript inline ->  import
        - 

## JavaScript version

## Json version
### 0. [base(v03.10)](Nango_templates\template_v03_10_v04_xx.json)
#### **文書形式**
    例+雛形
#### **項目一覧**
    - 語彙
    - 意味
    - 言葉の背景・由来
    - ニュアンス
    - 例文
    - 類義語
    - 管理用ID（自動採番されるので省略可）
    - カテゴリー（ツリー大分類）
    - よみがな（五十音ソートに使用）
    - 漢字表記
    - 英語・原語表記
    - 分野タグ（ツリー軸の切り替えに使用）
    - 時代タグ（同上）
#### **構造**
```
list  
    dict  
        - *`"id"`* (int)
        - *`"word"`* ~ *`"nuance"`* (str)  
        - *`"examples"`* (list[str...])  
        - *`"synoyms"`* (list[str...])
```
---
### 1. [v01](Nango_templates\Nango-neo_template.v01.json)

#### **文書形式**
    例

#### **構造**
```
dict
    - *`"words"`* (list)
        list  
            dict  
                - *`"id"`* (int)
                - *`"word"`* ~ *`"english"`* (str)  
                - *`"other_tags"`* (list[str...])
                - *`"meanings"`* (list[dict...])
                    list
                        dict
                            - *`"definition"`* ~ *`"nuance"`* (str)
                            - *`"examples"`* (list[str...])  
                            - *`"synoyms"`* (list[str...])
                - *`"memo"`* (str)
                - *`"gemini_note"`* (str)
```
* 拡張性を持たせるために全体をdictにいれての *`"words"`*の値として再定義  
`words以外の情報や、より大きなword分類に対応`

#### **新規項目**
* *`"meaning"`* (list)  
ひとつの単語が複数の意味合いを持っている場合にそれぞれdictを作成し、羅列する。  
以下を内包するdictのリスト *`meaning, background, nuance, examples, >synonyms`*

* *`"other_tags"`*（list）
    分野や時代だけでなく、「ステータス」「アクセシビリティ」などの細かい複数の関連タグ

* *`"memo"`* (str)  
    後述の特殊な符号,また、userのメモ、自由記述欄`言葉を知ったきっかけなど`

* *`"gemini_note"`* (str)  
    Geminiの一言。Frashmodeだとmemoに自分の一言を書き始めるので追加したが、存外悪くないので維持

---
### 2. [v02](Nango_templates\Nango-neo_template.v02.json)

#### **構造**
```
dict
    - *`"\\"`* (str)  $words全体指示
    - *`"words"`* (list[dict...])
        list  
            dict  
                - *`"id"`* (int)
                - *`"word"`* ~ *`"english"`* (str)  
                - *`"other_tags"`* (list[str...])
                - *`"meanings"`* (list[str,dict...])
                    list
                        dict
                            - *`"\\"`* (str)  $meaningsの条件指示
                            - *`"definition"`* ~ *`"nuance"`* (str)
                            - *`"examples"`* (list[str...])  
                            - *`"synoyms"`* (list[str...])
                - *`"column"`* (str)
                - *`"memo"`* (str)
                - *`"\\"`* (str)  $memoの条件指示
                - *`"gemini_note"`* (str)
```
* 拡張性を持たせるために全体をdictにいれての *`"words"`*の値として再定義  
`words以外の情報や、より大きなword分類に対応`

#### **文書形式**
    雛形

#### **新規項目**
* *`"column"`* (str)  
言葉にまつわる豆知識や、さらに深掘りしたエピソード

* *`"\\"`* (str)  
AIへの指示文。単語の性質による条件分岐やJavaScriptでは`"\\"`で始まるキーを無視する。
