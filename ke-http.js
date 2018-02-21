'use strict';
const Hp=require('http');
const Ur=require('url');
let keUtility=require('ke-utility');
/**
 * @classdesc HTTPサーバークラス
 * @extends
 */
module.exports=class keServer extends keUtility {
  /**
  * オブジェクト’コンストラクション
  * @param  {object} op   環境オプションオーバーライド
  * @return {void}        none
  * @constructor
  */
  constructor(op) { // オブジェクトコンストラクション
    super();
    this.SS={};
    const me=this;
    op=op||{};
    me.info(op.group);
    for(var k in op){me.CFG[k]=op[k];}
    me.CFG.port=me.CFG.port||'8088';
    Hp.createServer(function(req, res){
      me.transaction(me, req, res);
    }).listen(me.CFG.port);
    me.infoLog('サーバーを開始しました。 port='+me.CFG.port);
  }
  /**
  * トランザクション処理
  * @param  {string} msg webhookメッセージ
  * @param  {string} msg webhookメッセージ
  * @param  {string} msg webhookメッセージ
  * @return {void}     none
  * @method
  */
  transaction(me, req, res) {
    let rc={'ok': 'write data'};
    let data='';
    let head={'Content-Type': 'text/plain', 'charset': 'utf-8'};
    me.SS.URI=Ur.parse(req.url);
    me.SS.PATH=me.SS.URI.pathname.split('/');
    me.SS.method=req.method;
    switch(req.method) {
    case 'POST':
      req.on('data', function(chunk) {
        data +=chunk;
      });
      req.on('end', function() {
        let s=data.indexOf('{');
        let x=data.substr(s);
        me.SS.DATA=JSON.parse(x);
        rc=me.postProcess(me, me.SS, me.SS.DATA);
        if(typeof(rc)=='object'){
          head={'Content-Type': 'json/application', 'charset': 'utf-8'};
          rc=JSON.stringify(rc);
        }
        res.writeHead(200, head);
        res.end(rc);
      });
      break;
    case 'GET':
      me.SS.DATA={};
      if(me.SS.URI.query){
        let a=me.SS.URI.query.split('&');
        let b, i; for(i in a){b=a[i].split('='); me.SS.DATA[b[0]]=b[1];}
      }
      rc=me.getProcess(me, me.SS, me.SS.DATA);
      if(typeof(rc)=='object'){
        head={'Content-Type': 'json/application', 'charset': 'utf-8'};
        rc=JSON.stringify(rc);
      }
      res.writeHead(200, head);
      res.end(rc);
      break;
    default:
      me.infoLog('ERROR REQUEST('+req.method + ',' + req.url+')');
      res.writeHead(404, {'Content-Type': 'text/plain', 'charset': 'utf-8'});
      res.end('ERROR url='+req.url);
    }
  }
  /**
   * GETメソッド時の処理 This should be overrided.
   * @param  {Object} me   this object
   * @param  {Object} ss   セッションオブジェクト
   * @param  {Object} data キュエリーストリング
   * @return {Object}      返信情報
   * @method
   */
  getProcess(me, ss, data){
    console.log(me, ss, data);
  }
  /**
   * POSTメソッド時の処理 This should be overrided.
   * @param  {Object} me   this object
   * @param  {Object} ss   セッションオブジェクト
   * @param  {Object} data キュエリーストリング
   * @return {Object}      返信情報
   * @method
   */
  postProcess(me, ss, data){
    console.log(me, ss, data);
  }
};
