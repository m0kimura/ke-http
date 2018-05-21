'use strict';
const Hp=require('http');
const Ur=require('url');
const Cp=require('child_process');
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
  /**
   * Curlインターフェイス
   * @param  {String} method メソッド GET/POST
   * @param  {String} url    url(https://abc.com)
   * @param  {Object} data   データオブジェクト受け渡しデータ
   * @param  {Object} op     オプション{debug: yes/just, header: , bearer: , basic:, type:}
   * @return {Object}        返信
   * @method
   */
  curl(method, url, path, data, op){
    let ix, iy, b, c, cmd='curl -X '+method;
    op=op||{}; op.charset=op.charset||'utf-8';
    if(!op.type){
      if(typeof(data)=='object'){op.type='json/application';}
      else{op.type='text/plain';}
    }
    cmd+=' -H "'+'Content-Type: '+op.type+'; charset='+op.charset+'"';
    for(ix in op){
      switch(ix){
      case 'header':
        for(iy in op[ix]){
          cmd+=' -H "'+op[ix][iy]+'"';
        }
        break;
      case 'bearer':
        cmd+=' -H "authorization: Bearer '+op[ix]+'"';
        break;
      case 'basic':
        b=new Buffer(op[ix]);
        cmd+=' -H "Authorization:Basic '+b.toString('base64')+'"';
        break;
      }
    }
    if(method=='POST'){
      if(typeof(data)=='object'){
        cmd+=' -d \''+JSON.stringify(data)+'\'';
      }else{
        cmd+=' -d \''+data+'\'';
      }
    }
    op.path=op.path||'/';
    cmd+=' '+url+op.path;
    if(method=='GET'){
      if(typeof(data)=='object'){
        c='?'; for(ix in data){cmd+=c+ix+'='+data[ix]; c='&';}
      }else{
        cmd+=data;
      }
    }
    if(op.debug){console.log('cmd='+cmd);}
    if(op.debug!='just'){
      try{return Cp.execSync(cmd);}
      catch(err){console.log('err='+err); return false;}
    }
  }
};
