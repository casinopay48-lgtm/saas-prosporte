const https = require('https');
function req(options, body){ return new Promise((res,rej)=>{ const r=https.request(options, (resp)=>{ let d=''; resp.on('data',c=>d+=c); resp.on('end',()=>res({status:resp.statusCode, headers:resp.headers, body:d})); }); r.on('error',rej); if(body) r.write(body); r.end(); })}
(async ()=>{
 try{
  const post = await req({method:'POST', hostname:'api.prosporte.com.br', path:'/api/v1/auth/login', headers:{'Content-Type':'application/json'}}, JSON.stringify({email:'admin@saasportes.com', password:'Admin@123'}));
  console.log('LOGIN', post.status, post.body);
  const token = JSON.parse(post.body).token;
  const get = await req({method:'GET', hostname:'api.prosporte.com.br', path:'/api/v1/auth/me', headers:{ Authorization: `Bearer ${token}` }});
  console.log('ME', get.status, get.body);
 }catch(e){ console.error('ERR', e.toString()); process.exit(1) }
})();
