サーバーユーティリティ
====

POST, GETモードでのHTTPリクエストを処理するクラス

## 解説
  ke-utilityクラスを継承し、サーバーの基本的な処理を容易に組み込むことができます。
  機能
  1. 対応ポート番号はコンストラクション時に指定することができます。
  2. GETメソッドの処理はgetProcessメソッドを作成することで記述することができます。
  3. POSTメソッドの処理はpostProcessメソッドを作成することで記述することができます。
  4. curlインターフェイスでhttp送信ができます。

## 使い方
### インストール

  npm install ke-http
  npm install

### 概要

  - GETメソッドの処理はgetProcessメソッドを定義してください。（スケジュールされます）
  - POSTメソッドの処理はposetProcessメソッドを定義してください。(スケジュールされます)
  - 両メソッドともに、1st:自オブジェクト、2nd:セッションオブジェクト、3rd:データの引数が渡されます。
  - セッションオブジェクトには{URI: "",PATH: "",METHOD: "",DATA: {}}が提供されます。
  - curl(method, url, data, op)メソッドで呼び出します。
  - methodはGET/POST
  - urlは宛先のURL
  - dataはオブジェクト{key: value, ...}(POST,GETとも)
  - opはオブジェクト{debug, header, bearer, basic, type, charset}
  - debug   yes/just デバッグ時のみ指定,justは発行しません。デバッグ時はログ表示します。
  - header  追加ヘッダーを指定
  - bearer  認証情報の指定
  - basic   ベーシック認証をuser:passwordで指定
  - type    省略時はdataに応じてplain|json
  - charset 文字コード（省略時utf-8）

### サンプル

    const main=class main extends keServer {

      // オブジェクト’コンストラクション
      // @return {void}           none
      // @constructor

      constructor(op) {
        super(op);

        初期処理

      }

       // GETメソッド時の処理
       // @param  {Object} me   this object
       // @param  {Object} ss   セッションオブジェクト
       // @param  {Object} data キュエリーストリング
       // @return {Object}      返信情報
       // @method
       // @override

      getProcess(me, ss, data){

        GETによるメッセージ処理
        キュエリーストリングはdataで渡される
        return で返信情報をテキストまたはJSONで返す

      }

       // POSTメソッド時の処理
       // @param  {Object} me   this object
       // @param  {Object} ss   セッションオブジェクト
       // @param  {Object} data キュエリーストリング
       // @return {Object}      返信情報
       // @method
       // @override

      postProcess(me, ss, data){

        POSTによるメッセージ処理
        POSTデータはdataで渡される
        return で返信情報をテキストまたはJSONで返す

      }
     };
     new main({port:'8080'});

## ライセンス

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)

## 作者

[m0kimura](https://github.com/m0kimura)

