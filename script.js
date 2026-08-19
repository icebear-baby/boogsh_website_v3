// BOOGSH V2 — stickers, draggable desktop windows, guestbook, gallery, playlist

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

const stickerTypes = {
  cd:{file:"cd.png", w:70, h:70, label:"pink CD"},
  guitar:{file:"guitar.png", w:125, h:62, label:"pink star guitar"},
  vinyl:{file:"vinyl.png", w:80, h:80, label:"vinyl record"},
  camera:{file:"camera.png", w:85, h:68, label:"cute digital camera"},
  phone:{file:"phone.png", w:55, h:118, label:"flip phone"},
  star:{file:"star.png", w:58, h:68, label:"silver star"},
  player:{file:"player.png", w:90, h:80, label:"music player"},
  boombox:{file:"boombox.png", w:85, h:68, label:"boombox"},
  question:{file:"question.png", w:62, h:80, label:"question sticker"},
  parental:{file:"parental.png", w:145, h:92, label:"parental advisory"},
  note:{file:"note.png", w:48, h:86, label:"music note"},
  sunglasses:{file:"sunglasses.png", w:130, h:58, label:"sunglasses"},
  bigstar:{file:"bigstar.png", w:125, h:70, label:"chrome star"}
};

// Many stickers — intentionally crowded like a 2000s scrapbook desktop.
const placements = [
  ["cd",3,9,-8],["guitar",17,7,7],["vinyl",5,29,-3],["camera",78,14,5],
  ["phone",25,54,-7],["star",51,25,9],["player",79,34,12],["boombox",36,64,-3],
  ["question",2,76,-5],["parental",63,73,-1],["note",89,67,7],["sunglasses",9,88,-4],
  ["bigstar",48,87,5],["cd",91,3,12],["camera",2,44,-6],["star",92,46,5],
  ["phone",72,56,10],["vinyl",88,83,3],["guitar",4,65,-8],["boombox",69,4,-7],
  ["player",14,16,8],["question",44,5,-4],["note",31,91,11],["sunglasses",72,91,3],
  ["star",30,3,-12],["cd",55,10,5],["camera",47,43,-4],["phone",94,25,6],
  ["bigstar",76,78,-7],["parental",18,72,3],["vinyl",58,61,4],["guitar",78,61,-9],
  ["star",38,78,8],["cd",3,93,4],["camera",93,91,-3],["note",58,92,-7]
];

const layer = $("#stickerLayer");
const activeDrags = new WeakMap();

function createSticker(type,x,y,rot,index){
  const t=stickerTypes[type];
  const el=document.createElement("div");
  el.className="real-sticker "+(index%3===0?"float":"wiggle");
  el.dataset.type=type;
  el.title=`click or drag: ${t.label}`;
  el.style.width=t.w+"px";
  el.style.height=t.h+"px";
  el.style.left=x+"vw";
  el.style.top=y+"vh";
  el.style.setProperty("--rot",rot+"deg");
  el.style.transform=`rotate(${rot}deg)`;
  el.style.backgroundImage=`url("stickers/${t.file}")`;
  layer.appendChild(el);
  makeDraggable(el);
  el.addEventListener("click",()=>{
    el.classList.remove("clicked"); void el.offsetWidth; el.classList.add("clicked");
    burst(window.innerWidth*(x/100)+t.w/2, window.innerHeight*(y/100)+t.h/2);
    toast(`${t.label} activated! ✦`);
  });
}
placements.forEach((p,i)=>createSticker(p[0],p[1],p[2],p[3],i));

function makeDraggable(el){
  let dragging=false,startX=0,startY=0,startLeft=0,startTop=0,moved=false;
  el.addEventListener("pointerdown",e=>{
    dragging=true;moved=false;el.setPointerCapture(e.pointerId);
    const r=el.getBoundingClientRect(); startX=e.clientX;startY=e.clientY;startLeft=r.left;startTop=r.top;
    el.style.animation="none";el.style.zIndex=150;
  });
  el.addEventListener("pointermove",e=>{
    if(!dragging)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(Math.abs(dx)+Math.abs(dy)>5)moved=true;
    el.style.left=(startLeft+dx)+"px";el.style.top=(startTop+dy)+"px";
  });
  el.addEventListener("pointerup",e=>{
    dragging=false;el.releasePointerCapture(e.pointerId);
    if(!moved) return;
    el.style.animation="";
  });
}

function burst(x,y){
  const chars=["★","✦","♥","✿","+","☆"];
  for(let i=0;i<8;i++){
    const s=document.createElement("span");s.className="spark";s.textContent=chars[Math.floor(Math.random()*chars.length)];
    s.style.left=x+"px";s.style.top=y+"px";
    s.style.setProperty("--dx",(Math.random()*140-70)+"px");s.style.setProperty("--dy",(Math.random()*140-70)+"px");
    document.body.appendChild(s);setTimeout(()=>s.remove(),850);
  }
}

let toastTimer;
function toast(text){
  const t=$("#toast");t.textContent=text;t.classList.add("toast-show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("toast-show"),2200);
}
$$("[data-toast]").forEach(b=>b.addEventListener("click",()=>toast(b.dataset.toast)));

// Gallery
const grid=$("#galleryGrid");
for(let i=1;i<=30;i++){
  const c=document.createElement("div");c.className="gallery-card";
  c.style.transform=`rotate(${(Math.random()*6-3).toFixed(1)}deg)`;
  c.innerHTML=`<img src="images/photo-${String(i).padStart(2,"0")}.jpg" onerror="this.style.display='none'"><span class="gallery-label">PHOTO ${String(i).padStart(2,"0")}</span>`;
  c.addEventListener("click",()=>{c.animate([{transform:"scale(1.08) rotate(0)"},{transform:"scale(1) rotate(0)"}],{duration:300});toast(`photo slot #${String(i).padStart(2,"0")} selected ★`)});
  grid.appendChild(c);
}

// Scroll links
$$("[data-scroll]").forEach(b=>b.addEventListener("click",()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"})));
$$("a[href^='#']").forEach(a=>a.addEventListener("click",e=>{const t=document.querySelector(a.getAttribute("href"));if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth"})}}));

// Search
$("#searchBtn").addEventListener("click",searchSite);
$("#search").addEventListener("keydown",e=>{if(e.key==="Enter")searchSite()});
function searchSite(){
  const q=$("#search").value.trim().toLowerCase();
  if(!q)return toast("type something first ★");
  const match=$$("h2,p,.titlebar,.crew-row,.playlist button").find(el=>el.textContent.toLowerCase().includes(q));
  if(match){match.scrollIntoView({behavior:"smooth",block:"center"});toast(`found "${q}" ✦`)}
  else toast(`no results for "${q}"`);
}

// Clock
function clock(){ $("#clock").textContent=new Date().toLocaleTimeString([],{hour12:false});}
clock();setInterval(clock,1000);

// Draggable desktop popups and modal
function makeWindowDraggable(win, handle){
  const bar=handle||$(".pop-title",win); if(!bar)return;
  let dragging=false,ox=0,oy=0;
  bar.addEventListener("pointerdown",e=>{
    if(e.target.closest("button"))return;
    dragging=true;bar.setPointerCapture(e.pointerId);
    const r=win.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;
    win.style.zIndex=180;
  });
  bar.addEventListener("pointermove",e=>{
    if(!dragging)return;
    win.style.left=(e.clientX-ox)+"px";win.style.top=(e.clientY-oy)+"px";
    win.style.right="auto";win.style.bottom="auto";
  });
  bar.addEventListener("pointerup",()=>dragging=false);
}
$$("[data-drag]").forEach(w=>makeWindowDraggable(w));
const modal=$("#messageModal"), modalWin=$(".modal-window",modal);
makeWindowDraggable(modalWin,$("[data-drag-handle]",modalWin));

// Pop-up close buttons
$$(".pop-close").forEach(b=>b.addEventListener("click",e=>{
  const win=b.closest(".draggable-window");
  if(win===modalWin){modal.classList.remove("open");}
  else if(win)win.style.display="none";
}));

$$("[data-open='messageModal']").forEach(b=>b.addEventListener("click",()=>{
  modal.classList.add("open");
  modalWin.style.left="50%";modalWin.style.top="50%";modalWin.style.right="auto";modalWin.style.bottom="auto";
  modalWin.style.transform="translate(-50%,-50%)";
  $("#guestName").focus();
}));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});

// Guestbook with localStorage
const KEY="boogshMessagesV2";
function messages(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function renderMessages(){
  const m=messages();$("#messageCount").textContent=m.length;
  $("#messages").innerHTML=m.length?m.slice().reverse().map(x=>`<div class="message-entry"><b>${esc(x.name)}</b> ★ ${esc(x.time)}<br>${esc(x.text)}</div>`).join(""):`<div class="message-entry">♡ no messages yet — be the first internet bestie!</div>`;
}
$("#sendMessage").addEventListener("click",()=>{
  const name=$("#guestName").value.trim()||"anonymous";
  const text=$("#guestMessage").value.trim();
  if(!text)return toast("write something first ♥");
  const m=messages();m.push({name,text,time:new Date().toLocaleString()});localStorage.setItem(KEY,JSON.stringify(m));
  $("#guestName").value="";$("#guestMessage").value="";modal.classList.remove("open");renderMessages();toast("message posted! ♥");
});
renderMessages();

// Playlist
let song=0;const songs=["sugar rush","pink pixels","dial-up love","glitter floor","after school"];
const pBtns=$$("#playlist button");
function setSong(){pBtns.forEach((b,i)=>b.classList.toggle("active",i===song));$("#songName").textContent=`boogsh mix // ${songs[song]}`;}
$("#next").addEventListener("click",()=>{song=(song+1)%songs.length;setSong();toast(`now playing: ${songs[song]} ♪`)});
$("#prev").addEventListener("click",()=>{song=(song-1+songs.length)%songs.length;setSong();toast(`now playing: ${songs[song]} ♪`)});
$("#play").addEventListener("click",()=>toast(`♫ playing ${songs[song]} ♫`));
pBtns.forEach((b,i)=>b.addEventListener("click",()=>{song=i;setSong()}));setSong();

// Surprise sticker
$("#surprise").addEventListener("click",()=>{
  const ss=$$(".real-sticker");const s=ss[Math.floor(Math.random()*ss.length)];
  s.scrollIntoView({behavior:"smooth",block:"center"});s.classList.add("clicked");s.dispatchEvent(new Event("click"));toast("surprise sticker! ✦ drag it anywhere");
});

// Clicking blank desktop space creates tiny sparkle.
document.addEventListener("click",e=>{
  if(e.target.closest("button,a,input,textarea,.real-sticker,.draggable-window"))return;
  burst(e.clientX,e.clientY);
});
