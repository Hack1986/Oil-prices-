const brands=['PTT','บางจาก','Shell','Caltex','PT','Susco'];
let allRows=[], activeBrand='ทั้งหมด';
const brandNames={'PTT':'PTT','BCP':'บางจาก','SHELL':'Shell','CALTEX':'Caltex','PT':'PT','SUSCO':'Susco'};
const fuelNames={'GASOHOL 95':'แก๊สโซฮอล์ 95','GASOHOL 91':'แก๊สโซฮอล์ 91','E20':'E20','E85':'E85','DIESEL':'ดีเซล','GASOLINE 95':'เบนซิน 95','DIESEL PREMIUM':'ดีเซลพรีเมียม'};
const fmt=n=>Number(n).toFixed(2);
function showRows(){
 const rows=allRows.filter(x=>activeBrand==='ทั้งหมด'||x.brand===activeBrand);
 document.getElementById('fuelGrid').innerHTML=rows.length?rows.map(x=>`<article class="fuel-card"><div class="fuel-top"><span class="fuel-name">${x.fuel}</span><span class="fuel-type">${x.brand}</span></div><div class="price">${fmt(x.price)} <small>฿/L</small></div><div class="change">${x.change==null?'ราคาจากแหล่งข้อมูลทางการ':(x.change>0?'▲ +':x.change<0?'▼ ':'')+fmt(Math.abs(x.change))+' บาท'}</div><span class="fuel-mark">${x.brand.toUpperCase()}</span></article>`).join(''):`<div class="panel" style="grid-column:1/-1;color:#91a3b8">ยังไม่มีข้อมูลราคาที่ตรวจสอบได้สำหรับตัวกรองนี้ ข้อมูลจะไม่ถูกเติมด้วยตัวเลขคาดเดา</div>`;
 document.getElementById('brandFilter').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.brand===activeBrand));
}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
async function loadFeed(){
 try{
  const r=await fetch('./feeds/live-prices.json?'+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('feed missing');
  const feed=await r.json();allRows=Array.isArray(feed.prices)?feed.prices:[];
  showRows();
  document.getElementById('connection').textContent=allRows.length?'LIVE SOURCE':'NO VERIFIED DATA';
  document.getElementById('updatedAt').textContent=feed.fetched_at?'ดึงข้อมูล '+new Date(feed.fetched_at).toLocaleString('th-TH'):'ยังไม่มีเวลาอัปเดต';
  document.getElementById('announcementText').textContent=feed.notice||'แสดงเฉพาะราคาที่อ่านได้จากแหล่งข้อมูลต้นทาง';
  document.getElementById('sourceList').innerHTML=(feed.sources||[]).map(s=>`<a href="${s.url}" target="_blank" rel="noopener">${s.name} ↗</a>`).join(' · ')||'ยังไม่มีแหล่งข้อมูลที่เชื่อมต่อ';
 }catch(e){
  allRows=[];showRows();document.getElementById('connection').textContent='WAITING FOR FEED';
  document.getElementById('updatedAt').textContent='รอ GitHub Actions ดึงข้อมูลจากแหล่งทางการ';
  document.getElementById('announcementText').textContent='ยังไม่มีข้อมูลที่ตรวจสอบได้ ระบบจะไม่แสดงราคาตัวอย่างเป็นราคาจริง';
 }
}
document.getElementById('refreshBtn').onclick=async()=>{await loadFeed();toast('ตรวจสอบข้อมูลล่าสุดแล้ว')};
document.getElementById('brandFilter').innerHTML=['ทั้งหมด',...brands].map(b=>`<button data-brand="${b}" class="${b==='ทั้งหมด'?'active':''}">${b}</button>`).join('');
document.getElementById('brandFilter').addEventListener('click',e=>{if(e.target.tagName==='BUTTON'){activeBrand=e.target.dataset.brand;showRows()}});
const watch=document.getElementById('watchList');
watch.innerHTML=['แก๊สโซฮอล์ 95','แก๊สโซฮอล์ 91','E20','E85','ดีเซล'].map(x=>`<label class="watch-item"><input type="checkbox" checked value="${x}">${x}</label>`).join('');
document.getElementById('saveWatch').onclick=()=>{localStorage.setItem('oilpulse-watch',JSON.stringify([...watch.querySelectorAll('input:checked')].map(x=>x.value)));toast('บันทึกรายการติดตามในอุปกรณ์แล้ว')};
document.getElementById('notifyBtn').onclick=async()=>{if(!('Notification'in window)){toast('เบราว์เซอร์นี้ไม่รองรับ Notification');return}const p=await Notification.requestPermission();toast(p==='granted'?'อนุญาต Notification แล้ว':'ยังไม่ได้อนุญาต')};
function drawChart(){const c=document.getElementById('chart'),ctx=c.getContext('2d'),w=c.clientWidth,h=c.clientHeight,dpr=devicePixelRatio||1;c.width=w*dpr;c.height=h*dpr;ctx.scale(dpr,dpr);ctx.strokeStyle='#294057';ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,h*i/4);ctx.lineTo(w,h*i/4);ctx.stroke()}ctx.fillStyle='#8292a8';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText('กราฟจะแสดงเมื่อมีข้อมูลย้อนหลังที่ตรวจสอบได้',w/2,h/2)}
window.addEventListener('resize',drawChart);drawChart();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
loadFeed();setInterval(loadFeed,10*60*1000);
