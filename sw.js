/* ACK Group dashboard - service worker. Halaman selalu dicoba dari jaringan dulu. */
var CACHE='ack-inti-v1';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(['./','index.html','config.js','manifest.json','icons/icon-192.png'].map(function(u){return c.add(new Request(u,{cache:'reload'})).catch(function(){})}))}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var u=new URL(req.url);
  if(u.origin!==location.origin)return;           /* data ke Apps Script tidak pernah lewat cache */
  e.respondWith(fetch(req,{cache:'no-cache'}).then(function(res){
    if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(req,cp)})}
    return res;
  }).catch(function(){return caches.match(req,{ignoreSearch:true}).then(function(h){return h||caches.match('./')})}));
});
