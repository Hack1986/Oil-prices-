const fuels=[
 {id:'g95',name:'แก๊สโซฮอล์ 95',type:'GASOHOL 95',key:'GASOLINE GASOHOL 95 (E10)',mark:'G95'},
 {id:'g91',name:'แก๊สโซฮอล์ 91',type:'GASOHOL 91',key:'GASOLINE GASOHOL 91',mark:'G91'},
 {id:'e20',name:'แก๊สโซฮอล์ E20',type:'E20',key:'GASOLINE GASOHOL 95 (E20)',mark:'E20'},
 {id:'e85',name:'แก๊สโซฮอล์ E85',type:'E85',key:'GASOLINE GASOHOL 95 (E85)',mark:'E85'},
 {id:'benzine',name:'เบนซิน 95',type:'GASOLINE 95',key:'GASOLINE ULG 95',mark:'B95'},
 {id:'diesel',name:'ดีเซล',type:'DIESEL',key:'DIESEL HSD (B7)',mark:'DSL'},
 {id:'premium',name:'ดีเซลพรีเมียม',type:'PREMIUM DIESEL',key:'DIESEL HSD PREMIUM',mark:'P-D'},
 {id:'premium95',name:'พรีเมียม 95',type:'PREMIUM GASOHOL',key:null,mark:'P95'}
];
let dataMode='sample';\nfuels.forEach(f=>{f.price=null;f.change=0});
const fmt=n=>Number(n).toFixed(2);
function render(list=fuels){
 document.getElementById('fuelGrid').innerHTML=list.map(f=>`<article class="fuel-card"><div class="fuel-top"><span class="fuel-name">${f.name}</span><span class="fuel-type">${f.type}</span></div><div class="price">${f.price==null?'—':fmt(f.price)} <small>฿/L</small></div><div class="change ${f.change>0?'up':f.change<0?'down':''}">${f.price==null?'ไม่มีข้อมูลในชุดข้อมูลอ้างอิง':f.change>0?'▲ +'+fmt(f.change)+' บาท':f.change<0?'▼ '+fmt(Math.abs(f.change))+' บาท':'ค่าเฉลี่ยรายเดือน · EPPO'}</div><span class="fuel-mark">${f.mark}</span></article>`).join('');
}
render();
const watch=document.getElementById('watchList');
watch.innerHTML=fuels.map(f=>`<label class="watch-item"><input type="checkbox" checked value="${f.id}">${f.name}</label>`).join('');
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800)}
document.getElementById('saveWatch').onclick=()=>{localStorage.setItem('oilpulse-watch',JSON.stringify([...watch.querySelectorAll('input:checked')].map(x=>x.value)));toast('บันทึกรายการติดตามแล้ว')};
const saved=JSON.parse(localStorage.getItem('oilpulse-watch')||'null');if(saved)watch.querySelectorAll('input').forEach(x=>x.checked=saved.includes(x.value));
document.getElementById('upBtn').onclick=()=>filter(1);document.getElementById('downBtn').onclick=()=>filter(-1);
document.querySelector('.segmented button').onclick=()=>{document.querySelectorAll('.segmented button').forEach(x=>x.classList.remove('active'));document.querySelector('.segmented button').classList.add('active');render()};
function filter(v){document.querySelectorAll('.segmented button').forEach(x=>x.classList.remove('active'));(v===1?document.getElementById('upBtn'):document.getElementById('downBtn')).classList.add('active');render(fuels.filter(f=>Math.sign(f.change||0)===v))}
document.getElementById('notifyBtn').onclick=async()=>{if(!('Notification'in window)){toast('เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน');return}const p=await Notification.requestPermission();toast(p==='granted'?'อนุญาตการแจ้งเตือนแล้ว':'ยังไม่ได้อนุญาตการแจ้งเตือน')};
async function loadFeed(){
 try{
  const r=await fetch('./feeds/eppo-monthly.json?ts='+Date.now(),{cache:'no-store'});
  if(!r.ok)throw Error('not-ready');
  const feed=await r.json();
  if(!Array.isArray(feed.records)||!feed.records.length)throw Error('empty');
  const rows=feed.records.slice().sort((a,b)=>(Number(a.year_en)-Number(b.year_en))||(Number(a.period_no)-Number(b.period_no)));
  const latest=rows[rows.length-1];
  fuels.forEach(f=>{const n=f.key?Number(latest[f.key]):NaN;f.price=Number.isFinite(n)?n:null;f.change=0});
  dataMode='eppo';render();
  document.getElementById('connection').textContent='EPPO DATA';
  const period=latest.period_name||'ล่าสุด';
  document.getElementById('updatedAt').textContent=`ข้อมูลอ้างอิง ${period} ${latest.year_en} · ${feed.fetched_at?new Date(feed.fetched_at).toLocaleString('th-TH'):''}`;
  document.getElementById('announcementText').textContent='ข้อมูล EPPO ชุดนี้เป็นราคาเฉลี่ยรายเดือนของกรุงเทพฯ ไม่ใช่ราคาหน้าปั๊มรายวัน และไม่มีประกาศวัน/เวลาปรับราคาล่วงหน้า';
 }catch(e){
  document.getElementById('connection').textContent='WAITING FOR FEED';
  document.getElementById('updatedAt').textContent='ยังไม่มีไฟล์ข้อมูลจาก GitHub Actions · แสดงข้อมูลทดลอง';
  document.getElementById('announcementText').textContent='ยังไม่ได้รับข้อมูลอ้างอิงจาก EPPO — โปรดอย่าใช้ตัวเลขตัวอย่างตัดสินใจเติมน้ำมัน';
 }
}
document.getElementById('refreshBtn').onclick=async()=>{await loadFeed();toast('ตรวจสอบข้อมูลล่าสุดแล้ว')};
loadFeed();setInterval(loadFeed,30*60*1000);
function drawChart(){const c=document.getElementById('chart'),ctx=c.getContext('2d'),w=c.clientWidth,h=c.clientHeight,dpr=devicePixelRatio||1;c.width=w*dpr;c.height=h*dpr;ctx.scale(dpr,dpr);const pts=Array.from({length:24},(_,i)=>.55+Math.sin(i*.48)*.12+Math.cos(i*.19)*.08);ctx.strokeStyle='#53e5df';ctx.lineWidth=2;ctx.beginPath();pts.forEach((v,i)=>{const x=i/(pts.length-1)*w,y=(1-v)*h*.78+12;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#53e5df30');grad.addColorStop(1,'#53e5df00');ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=grad;ctx.fill();ctx.strokeStyle='#23364a';ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,h*i/4);ctx.lineTo(w,h*i/4);ctx.stroke()}}
window.addEventListener('resize',drawChart);drawChart();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
