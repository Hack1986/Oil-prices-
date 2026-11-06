const fuels=[
 {id:'g95',name:'แก๊สโซฮอล์ 95',type:'GASOHOL 95',price:39.95,change:0.00,mark:'G95'},
 {id:'g91',name:'แก๊สโซฮอล์ 91',type:'GASOHOL 91',price:39.58,change:0.00,mark:'G91'},
 {id:'e20',name:'แก๊สโซฮอล์ E20',type:'E20',price:37.74,change:0.00,mark:'E20'},
 {id:'e85',name:'แก๊สโซฮอล์ E85',type:'E85',price:35.89,change:0.00,mark:'E85'},
 {id:'benzine',name:'เบนซิน 95',type:'GASOLINE 95',price:48.64,change:0.00,mark:'B95'},
 {id:'diesel',name:'ดีเซล',type:'DIESEL',price:32.94,change:0.00,mark:'DSL'},
 {id:'premium',name:'ดีเซลพรีเมียม',type:'PREMIUM DIESEL',price:44.94,change:0.00,mark:'P-D'},
 {id:'premium95',name:'พรีเมียม 95',type:'PREMIUM GASOHOL',price:49.84,change:0.00,mark:'P95'}
];
fuels[6].price=44.94;
const fmt=n=>Number(n).toFixed(2);
function render(list=fuels){document.getElementById('fuelGrid').innerHTML=list.map(f=>`<article class="fuel-card"><div class="fuel-top"><span class="fuel-name">${f.name}</span><span class="fuel-type">${f.type}</span></div><div class="price">${fmt(f.price)} <small>฿/L</small></div><div class="change ${f.change>0?'up':f.change<0?'down':''}">${f.change>0?'▲ +':f.change<0?'▼ ':''}${fmt(Math.abs(f.change))} บาท · ${f.change===0?'ยังไม่มีข้อมูลการเปลี่ยนแปลง':'เทียบรอบก่อน'}</div><span class="fuel-mark">${f.mark}</span></article>`).join('')}
render();
const watch=document.getElementById('watchList');
watch.innerHTML=fuels.map(f=>`<label class="watch-item"><input type="checkbox" checked value="${f.id}">${f.name}</label>`).join('');
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
document.getElementById('refreshBtn').onclick=async()=>{await loadFeed();toast('ตรวจสอบแหล่งข้อมูลแล้ว')};
document.getElementById('saveWatch').onclick=()=>{localStorage.setItem('oilpulse-watch',JSON.stringify([...watch.querySelectorAll('input:checked')].map(x=>x.value)));toast('บันทึกรายการติดตามแล้ว')};
const saved=JSON.parse(localStorage.getItem('oilpulse-watch')||'null');if(saved)watch.querySelectorAll('input').forEach(x=>x.checked=saved.includes(x.value));
document.getElementById('upBtn').onclick=()=>filter(1);document.getElementById('downBtn').onclick=()=>filter(-1);
document.querySelector('.segmented button').onclick=()=>{document.querySelectorAll('.segmented button').forEach(x=>x.classList.remove('active'));document.querySelector('.segmented button').classList.add('active');render()};
function filter(v){document.querySelectorAll('.segmented button').forEach(x=>x.classList.remove('active'));(v===1?document.getElementById('upBtn'):document.getElementById('downBtn')).classList.add('active');render(fuels.filter(f=>Math.sign(f.change)===v))}
document.getElementById('notifyBtn').onclick=async()=>{if(!('Notification'in window)){toast('เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน');return}const p=await Notification.requestPermission();toast(p==='granted'?'เปิดสิทธิ์แจ้งเตือนแล้ว':'ยังไม่ได้อนุญาตการแจ้งเตือน')};
// Optional JSON feed: set OILPULSE_FEED_URL in app.js to a public HTTPS JSON endpoint.
const OILPULSE_FEED_URL='';
async function loadFeed(){if(!OILPULSE_FEED_URL){document.getElementById('connection').textContent='DEMO MODE';return}
 try{const r=await fetch(OILPULSE_FEED_URL,{cache:'no-store'});if(!r.ok)throw Error('feed');const data=await r.json();if(!Array.isArray(data.prices))throw Error('schema');
 data.prices.forEach(p=>{const f=fuels.find(x=>x.id===p.id);if(f&&Number.isFinite(Number(p.price))){const old=f.price;f.price=Number(p.price);f.change=Number.isFinite(Number(p.change))?Number(p.change):f.price-old}});
 render();document.getElementById('connection').textContent='FEED CONNECTED';document.getElementById('updatedAt').textContent='อัปเดตล่าสุด '+new Date().toLocaleString('th-TH');document.getElementById('announcementText').textContent=data.announcement||'ไม่มีประกาศใหม่';}
 catch(e){document.getElementById('connection').textContent='FEED ERROR';toast('เชื่อมต่อแหล่งข้อมูลไม่สำเร็จ')}}
loadFeed();setInterval(loadFeed,15*60*1000);
function drawChart(){const c=document.getElementById('chart'),ctx=c.getContext('2d'),w=c.clientWidth,h=c.clientHeight,dpr=devicePixelRatio||1;c.width=w*dpr;c.height=h*dpr;ctx.scale(dpr,dpr);const pts=Array.from({length:24},(_,i)=>.55+Math.sin(i*.48)*.12+Math.cos(i*.19)*.08+(Math.random()-.5)*.05);ctx.strokeStyle='#53e5df';ctx.lineWidth=2;ctx.beginPath();pts.forEach((v,i)=>{const x=i/(pts.length-1)*w,y=(1-v)*h*.78+12;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#53e5df30');grad.addColorStop(1,'#53e5df00');ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=grad;ctx.fill();ctx.strokeStyle='#23364a';ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,h*i/4);ctx.lineTo(w,h*i/4);ctx.stroke()}}
window.addEventListener('resize',drawChart);drawChart();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
