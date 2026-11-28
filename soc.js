// CYF – Gruppe & Teilen: „Wer fehlt heute?“, Überholt-Hinweis, Anstupsen, Comeback-Banner,
// Teilen-Karte (Bild), Gesundheitshinweis beim ersten Start, Datenschutz & Kontakt.
// Läuft komplett im Handy – braucht keine Änderung am Server.
(function(){
const SITE="https://challenge-your-friends.github.io/";
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const css=document.createElement("style");
css.textContent=".who{padding:14px 16px}.who .wh{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:8px}.who .wh b{font-size:15px}.who .wh span{font-size:13px;color:var(--mut);white-space:nowrap}"
 +".who .bar{margin:0 0 10px}.who p{font-size:14px;line-height:1.45;color:#ddd}.who p.me{color:var(--warn);font-weight:700}.who .chip{width:100%;margin-top:10px}"
 +".banner .bx{float:right;margin-left:8px;cursor:pointer;opacity:.7;font-weight:700}"
 +"#shr,#legal{display:none;position:fixed;inset:0;background:var(--bg);overflow:auto;padding:20px;z-index:12}#shr img{display:block;width:100%;max-width:340px;margin:0 auto 14px;border-radius:16px;box-shadow:0 6px 24px rgba(0,0,0,.6)}"
 +"#legal h2{font-size:18px;margin:18px 0 6px;color:var(--acc)}#legal p,#legal li{font-size:14px;line-height:1.5;color:#ddd;margin-bottom:6px}#legal ul{padding-left:20px}";
document.head.appendChild(css);

// ---------- Wer fehlt heute? ----------
function nameList(a,max){const n=a.slice(0,max).map(E).join(", ");return a.length>max?n+" +"+(a.length-max):n}
function shareText(text){
  if(navigator.share){navigator.share({text}).catch(()=>{});return}
  window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank")}
function confetti(){if(document.getElementById("cft"))return;const c=document.createElement("canvas");c.id="cft";c.style.cssText="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60";
  const W=c.width=innerWidth,H=c.height=innerHeight,x=c.getContext("2d");document.body.appendChild(c);
  const col=["#3ddc84","#ffb020","#4aa3ff","#ff5c5c","#f2f2f2","#c77dff"],P=[];
  for(let i=0;i<140;i++)P.push({x:Math.random()*W,y:-20-Math.random()*H*.6,vx:(Math.random()-.5)*3,vy:2+Math.random()*4,s:5+Math.random()*7,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:col[i%col.length]});
  const t0=Date.now(),D=4200;
  (function step(){const e=Date.now()-t0;x.clearRect(0,0,W,H);x.globalAlpha=e>D-800?Math.max(0,(D-e)/800):1;
    P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.03;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()});
    if(e<D)requestAnimationFrame(step);else c.remove()})()}
function renderWho(){const el=$("whoBox");if(!el)return;
  const t=todayK(),gn=$("grpNote");
  {const h=document.querySelector("#tab-rank .card h3");if(h&&others.length){const inn=ALLU.filter(u=>u.G.in).length,out=ALLU.filter(u=>!u.G.in&&!u.G.never).length;
    h.innerHTML='🏆 Ranking <span style="font-size:12px;color:var(--mut);font-weight:400;margin-left:6px">👥 '+inn+(t>=CH_START?' im Rennen':' dabei')+(t>=CH_START?' · 💀 '+out+' raus':'')+'</span>'}}
  if(gn)gn.innerHTML=t>=CH_START&&others.length?"🏅 <b>Gruppenpunkte: "+GP+"</b> – Tage, an denen alle Aktiven durch waren. Im Ranking steht, wer ab 1.12. mindestens ein Workout gemacht hat. 7 Tage ohne Training = Warnung, 14 Tage = raus (außer „🤒 Krank / Pause“ unter „Mehr“).":"";
  if(!others.length||!state.name||t<MYS()){el.innerHTML="";return}
  const act=RK.filter(r=>r.cnt),done=act.filter(r=>r.today),miss=act.filter(r=>!r.today),me=act.find(r=>r.me);
  const gp=t>=CH_START?'<span>🏅 Gruppenpunkte: <b style="color:var(--fg)">'+GP+'</b></span>':'<span>'+(done.length?nameList(done.map(r=>r.me?"Du":r.name),3):"")+'</span>';
  if(act.length<2){el.innerHTML=t>=CH_START&&MYG.cnt?'<div class="card who"><div class="wh"><b>👥 Die Gruppe füllt sich</b>'+gp+'</div><p>Noch ist kaum jemand aktiv. Dabei ist, wer ab 1.12. sein erstes Workout gemacht hat.</p></div>':"";return}
  if(isRest(t)){el.innerHTML=done.length?'<div class="card who"><div class="wh"><b>😴 Ruhetag</b>'+gp+'</div><p>Freiwillig trainiert: '+nameList(done.map(r=>r.me?"Du":r.name),8)+' – Respekt. 💪</p></div>':"";return}
  const pc=Math.round(100*done.length/act.length),iMiss=!!(me&&!me.today);
  let txt,cls="";
  if(!miss.length){txt="🎉 Alle durch – "+(t>=CH_START?"Gruppenpunkt geholt!":"starke Truppe!");
    if(ls("cfDay","")!==t&&!running){lsSet("cfDay",t);setTimeout(confetti,400)}}
  else if(iMiss&&miss.length===1){txt="😬 Alle anderen sind durch – nur du fehlst noch"+(t>=CH_START?" für den Gruppenpunkt!":"!");cls="me"}
  else if(iMiss&&done.length){txt="Du fehlst noch! Außerdem offen: "+nameList(miss.filter(r=>!r.me).map(r=>r.name),6);cls="me"}
  else if(iMiss)txt="Noch keiner durch – sei heute der oder die Erste. Offen: Du, "+nameList(miss.filter(r=>!r.me).map(r=>r.name),6);
  else txt="Es fehlen noch: "+nameList(miss.map(r=>r.name),8);
  const nudge=!iMiss&&miss.length;
  el.innerHTML='<div class="card who"><div class="wh"><b>👥 Heute durch: '+done.length+' von '+act.length+'</b>'+gp+'</div>'
   +'<div class="bar"><div style="width:'+pc+'%"></div></div><p class="'+cls+'">'+txt+'</p>'
   +(nudge?'<button class="chip" id="whoNudge">📣 Die Fehlenden anstupsen (WhatsApp)</button>':'')+'</div>';
  const b=$("whoNudge");if(b)b.onclick=()=>shareText("📣 CYF: Heute sind schon "+done.length+" von "+act.length+" durch. Es fehlen noch: "+miss.map(r=>r.name).join(", ")+". Ohne euch kein Gruppenpunkt 💪\n"+SITE)}

// ---------- Aktive Gruppe: Warnung, raus, Krank / Pause ----------
const fmtD=k=>k.split("-").reverse().slice(0,2).join(".")+".";
function grpHtml(){const t=todayK();if(t<CH_START||!state.name||!token)return"";const G=MYG;
  if(G.pz){const z=(state.ch.pz||[]).filter(r=>r&&!r[1]).pop();return '<div class="banner info" style="background:#2a2e37;color:#ddd">⏸ <b>Pause aktiv</b>'+(z?" seit "+fmtD(z[0]):"")+'. Du bleibst in der Gruppe und zählst nicht bei „Wer fehlt“. Die −3 pro verpasstem Tag laufen weiter. Die Pause endet mit deinem nächsten Workout. <a id="pzEnd" style="text-decoration:underline;cursor:pointer">Pause jetzt beenden</a></div>'}
  if(G.never)return '<div class="banner info" style="background:#1d2a3a;color:#bcd8ff">👋 <b>Noch nicht im Ranking.</b> Mach dein erstes Workout – dann bist du in der Gruppe dabei.</div>';
  if(!G.in)return '<div class="banner bad">🚪 <b>Du bist raus aus Ranking und Gruppe</b> – '+G.idle+' Tage ohne Training. Mit dem nächsten Workout bist du sofort wieder drin.</div>';
  if(G.idle>7){const left=15-G.idle;return '<div class="banner bad">⚠️ <b>'+G.idle+' Tage ohne Training.</b> Noch '+left+' Tag'+(left===1?"":"e")+', dann fliegst du aus Ranking und Gruppe. Jetzt trainieren – oder bei Krankheit unter „Mehr“ → „🤒 Krank / Pause“ drücken.</div>'}
  return""}
async function pzPush(){const r=await api("save",{token,data:{days:state.days,ms:state.ms,ch:state.ch,bx:(typeof bonus==="number"?bonus:0),g:state.g||undefined}});if(!r.ok)throw new Error(r.err||"save");
  const m=await api("me",{token});if(!m.ok)throw new Error("me");return m}
async function pzSet(on){const t=todayK(),old=JSON.stringify(state.ch.pz||null);
  if(!navigator.onLine){toast("Keine Verbindung – bitte später nochmal");return}
  const z=Array.isArray(state.ch.pz)?state.ch.pz.slice(-9):[];
  let z2=z;if(on)z2.push([t,""]);else z2=z.filter(r=>r&&(r[1]||r[0]<t)).map(r=>r[1]?r:[r[0],addDays(t,-1)]);
  state.ch.pz=z2;lsSet("state",state);renderMenu();
  try{const m=await pzPush(),kept=JSON.stringify((m.data&&m.data.ch&&m.data.ch.pz)||null)===JSON.stringify(z2)||(!z2.length&&!(m.data&&m.data.ch&&m.data.ch.pz));
    if(!kept){const o=JSON.parse(old);if(o)state.ch.pz=o;else delete state.ch.pz;lsSet("state",state);renderMenu();
      ask("🛠️ <b>„Krank / Pause“ wird gerade freigeschaltet.</b><br>Bitte in Kürze nochmal versuchen. Keine Sorge: Vor Mitte Dezember fliegt niemand raus.",()=>{},null,"Okay","Schließen");return}
    toast(on?"⏸ Pause aktiv – gute Besserung!":"▶ Pause beendet – willkommen zurück!");loadRank()}
  catch(e){const o=JSON.parse(old);if(o)state.ch.pz=o;else delete state.ch.pz;lsSet("state",state);renderMenu();toast("Speichern fehlgeschlagen – bitte später nochmal")}}
function pzAsk(){if(!token){showLogin();return}
  if(todayK()<CH_START){ask("🤒 <b>Krank / Pause</b><br>Gibt es ab dem Challenge-Start am 1.12. In der Testphase fliegt niemand raus.",()=>{},null,"Okay","Schließen");return}
  if(MYG.pz){ask("▶ <b>Pause beenden?</b><br>Dann zählst du wieder ganz normal bei „Wer fehlt“ und beim Gruppenpunkt.",()=>pzSet(false),null,"Pause beenden","Abbrechen");return}
  ask("🤒 <b>Krank / Pause aktivieren?</b><br><span style=\"font-size:14px;line-height:1.5;display:block;margin-top:8px;text-align:left\">• Du fliegst <b>nicht</b> aus Ranking und Gruppe – auch nach 14 Tagen nicht.<br>• Du zählst nicht bei „Wer fehlt“ und beim Gruppenpunkt.<br>• Die <b>−3 pro verpasstem Tag laufen weiter</b>. Hart bleibt hart – Punkte holst du über Challenges und die Comeback-Mission auf.<br>• Die Pause endet automatisch mit deinem nächsten Workout.</span>",()=>pzSet(true),null,"Pause aktivieren","Abbrechen")}
if($("bPz"))$("bPz").onclick=pzAsk;

// ---------- Überholt / überholt worden ----------
function trackRank(){const t=todayK();
  if(!others.length||!state.name||t<MYS())return;
  const me=RK.find(r=>r.me);if(!me)return;
  const all=RK.map(r=>r.name),ahead=RK.filter(r=>r.pl<me.pl).map(r=>r.name),snap=ls("rkSnap",null);
  if(snap&&snap.u===state.name&&Array.isArray(snap.all)){
    const over=ahead.filter(n=>snap.all.includes(n)&&!snap.ahead.includes(n));
    const got=snap.ahead.filter(n=>{const r=RK.find(x=>x.name===n);return r&&r.pl>me.pl});
    if(over.length||got.length){const old=ls("rkNews",null),o=(old&&old.d===t&&old.u===state.name)?old:{d:t,u:state.name,over:[],got:[]};
      over.forEach(n=>{if(!o.over.includes(n))o.over.push(n);o.got=o.got.filter(x=>x!==n)});
      got.forEach(n=>{if(!o.got.includes(n))o.got.push(n);o.over=o.over.filter(x=>x!==n)});
      o.x=0;lsSet("rkNews",o)}}
  lsSet("rkSnap",{u:state.name,all,ahead})}
function newsHtml(){const t=todayK(),n=ls("rkNews",null),me=RK.find(r=>r.me);
  if(!n||n.d!==t||n.u!==state.name||n.x||!me||!others.length)return"";
  const still=n.over.filter(x=>{const r=RK.find(y=>y.name===x);return r&&r.pl<me.pl}),beh=n.got.filter(x=>{const r=RK.find(y=>y.name===x);return r&&r.pl>me.pl});
  let h="";
  if(still.length)h+='<div class="banner bad"><span class="bx" data-nx="1">✕</span>⚡ <b>'+nameList(still,3)+'</b> '+(still.length>1?"haben":"hat")+' dich überholt – du bist jetzt auf Platz '+me.pl+'. Hol dir den Platz zurück!</div>';
  if(beh.length)h+='<div class="banner good"><span class="bx" data-nx="1">✕</span>🚀 Du hast <b>'+nameList(beh,3)+'</b> überholt – jetzt Platz '+me.pl+'!</div>';
  return h}
function cbHtml(){const st=compute();if(!st.cb||!st.cb.on||todayK()<MYS())return"";
  const left=3-st.cb.n;
  return '<div class="banner info" style="background:#1d2a3a;color:#bcd8ff">🔁 <b>Comeback-Mission:</b> '+st.cb.n+' von 3. Noch '+left+' Workout'+(left===1?"":"s")+' in Folge, dann gibt\'s <b>+3 zurück</b>.</div>'}
function renderExtra(){const b=$("banners");if(!b)return;
  b.querySelectorAll(".socx").forEach(x=>x.remove());
  if($("bPzS"))$("bPzS").textContent=MYG.pz?"⏸ Pause ist aktiv – antippen zum Beenden":"länger krank oder im Urlaub? Dann fliegst du nicht aus der Gruppe";
  const h=grpHtml()+newsHtml()+cbHtml();if(!h)return;
  const w=document.createElement("div");w.className="socx";w.innerHTML=h;b.appendChild(w);
  w.querySelectorAll("[data-nx]").forEach(x=>x.onclick=()=>{const n=ls("rkNews",null);if(n){n.x=1;lsSet("rkNews",n)}renderExtra()});
  const pe=$("pzEnd");if(pe)pe.onclick=pzAsk}

// ---------- Teilen-Karte ----------
const SPR=["Ausreden gibt's keine.","Dein Sofa vermisst dich nicht.","Mitmachen oder zugucken?","Wer fehlt, verliert Punkte.","Kurz halten, lange angeben.","10 Minuten. Jeden Tag. Fertig.","Zittern ist nur Applaus von innen.","Heute gehalten, morgen stolz."];
let shr=null;
function wrap(ctx,text,x,y,maxW,lh,maxL){const ws=String(text).split(" ");let line="",n=0;
  for(let i=0;i<ws.length;i++){const tst=line?line+" "+ws[i]:ws[i];
    if(ctx.measureText(tst).width>maxW&&line){n++;if(n>=maxL){ctx.fillText(line.replace(/.{0,2}$/,"…"),x,y);return y+lh}ctx.fillText(line,x,y);y+=lh;line=ws[i]}else line=tst}
  if(line){ctx.fillText(line,x,y);y+=lh}return y}
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function drawCard(o,icon){const W=1080,H=1350,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  const F=(w,s)=>w+" "+s+'px system-ui,-apple-system,"Segoe UI",Roboto,"Apple Color Emoji","Noto Color Emoji",sans-serif';
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#0f1115");g.addColorStop(1,"#12301f");x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle="rgba(61,220,132,.10)";x.beginPath();x.arc(W-120,160,300,0,7);x.fill();
  // Kopf
  let bx=80;if(icon){try{x.save();rr(x,80,80,130,130,30);x.clip();x.drawImage(icon,80,80,130,130);x.restore();bx=240}catch(e){}}
  x.textBaseline="alphabetic";x.fillStyle="#3ddc84";x.font=F(800,84);x.fillText("CYF",bx,150);
  x.fillStyle="#f2f2f2";x.font=F(600,38);x.fillText("Challenge Your Friends",bx,200);
  // Überschrift
  x.fillStyle="#f2f2f2";x.font=F(800,82);let y=wrap(x,o.head,80,390,W-160,96,3);
  if(o.sub){x.fillStyle="#9aa0aa";x.font=F(500,42);y=wrap(x,o.sub,80,y+6,W-160,54,2)}
  // Name
  x.fillStyle="#3ddc84";x.font=F(800,64);x.fillText(o.name.length>18?o.name.slice(0,17)+"…":o.name,80,Math.max(y+70,680));
  // Werte
  const bw=(W-160-2*24)/3,by=760;
  o.stats.forEach((s,i)=>{const X=80+i*(bw+24);x.fillStyle="#1a1d24";rr(x,X,by,bw,230,28);x.fill();
    x.textAlign="center";x.fillStyle=s.c||"#f2f2f2";x.font=F(800,s.v.length>4?72:92);x.fillText(s.v,X+bw/2,by+125);
    x.fillStyle="#9aa0aa";x.font=F(500,34);x.fillText(s.l,X+bw/2,by+190);x.textAlign="left"});
  // Spruch
  x.fillStyle="#f2f2f2";x.font=F(700,50);wrap(x,"„"+o.spr+"“",80,1100,W-160,62,2);
  // Fuß
  x.fillStyle="#3ddc84";rr(x,80,1215,W-160,84,42);x.fill();x.fillStyle="#000";x.font=F(800,36);x.textAlign="center";x.fillText("Mach mit: challenge-your-friends.github.io",W/2,1269);x.textAlign="left";
  return c}
function loadIcon(){return new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src="icon-192.png";setTimeout(()=>res(null),2500)})}
function myLine(){const st=compute(),me=RK.find(r=>r.me),n=others.length?RK.length:0;
  return {name:state.name||"Ich",pl:me&&n?me.pl:0,n,pts:st.pts,streak:st.streak}}
async function openShare(head,sub){const m=myLine();
  const o={head,sub:sub||"",name:m.name,spr:SPR[Math.floor(Math.random()*SPR.length)],stats:[
    {v:m.pl?m.pl+".":"–",l:m.n?"Platz von "+m.n:"Platz"},{v:String(m.pts),l:Math.abs(m.pts)===1?"Punkt":"Punkte",c:m.pts<0?"#ff5c5c":"#3ddc84"},{v:m.streak>=3?m.streak+"🔥":String(m.streak),l:"Serie"}]};
  const text="💪 "+m.name+" bei CYF – "+head.replace(/[✅🏆👑⚡]/g,"").trim()+(m.pl?" · Platz "+m.pl+" von "+m.n:"")+" · "+m.pts+" Punkte"+(m.streak>=3?" · Serie "+m.streak+"🔥":"")+"\nMach mit: "+SITE;
  const c=drawCard(o,await loadIcon());
  let el=$("shr");if(!el){el=document.createElement("div");el.id="shr";document.body.appendChild(el)}
  el.innerHTML='<div style="max-width:480px;margin:0 auto"><div class="row" style="justify-content:space-between;margin-bottom:12px"><h1>📤 Teilen</h1><button class="chip" id="shrX">Schließen ✕</button></div>'
   +'<img id="shrI" alt="Teilen-Karte"><button class="wbtn" id="shrGo" style="text-align:center;background:var(--acc);color:#000"><b style="margin:0">📤 Bild teilen</b></button>'
   +'<div class="row"><button class="chip" id="shrDl" style="flex:1">⬇️ Bild speichern</button><button class="chip" id="shrWa" style="flex:1">💬 Nur Text (WhatsApp)</button></div>'
   +'<p class="note" id="shrMsg" style="margin-top:12px;text-align:center">Tipp: In WhatsApp als Status oder direkt in die Gruppe – so kommen neue Mitspieler dazu.</p></div>';
  $("shrI").src=c.toDataURL("image/png");
  shr={text,file:null,url:c.toDataURL("image/png")};
  c.toBlob(b=>{try{if(b&&shr)shr.file=new File([b],"cyf-"+todayK()+".png",{type:"image/png"})}catch(e){}},"image/png");
  const dl=()=>{const a=document.createElement("a");a.href=shr.url;a.download="cyf-"+todayK()+".png";document.body.appendChild(a);a.click();a.remove();$("shrMsg").textContent="✅ Bild gespeichert – jetzt in WhatsApp oder Instagram hochladen."};
  $("shrX").onclick=()=>{el.style.display="none";shr=null};
  $("shrDl").onclick=dl;
  $("shrWa").onclick=()=>window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank");
  $("shrGo").onclick=async()=>{const f=shr&&shr.file;
    try{if(f&&navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text});return}}catch(e){if(e&&e.name==="AbortError")return}
    dl()};
  el.style.display="block";el.scrollTop=0;if(typeof backGuard==="function")backGuard()}

// Knöpfe: nach dem Workout, im Ranking, bei neuem Rekord
let doneCtx=null;
{const _f=finish;finish=function(){const k=curW,ch=k==="C"?curChal:null,np=noPts,p0=compute().pts;
  _f.apply(this,arguments);
  const gain=compute().pts-p0,b=$("bShare");
  doneCtx=(k==="X"||np)?null:ch?{head:(ch.id[0]==="e"?"Dauer-Plank geschafft 🤪":"Challenge geschafft ⚡"),sub:ch.n}:{head:"Workout geschafft ✅",sub:(W[k]?W[k].t:"")+(gain>0?" · +"+gain+" Punkte":"")};
  if(b)b.style.display=doneCtx?"block":"none";
  if(CHEERS.length){const u=[...new Set(CHEERS)];$("doneTxt").insertAdjacentHTML("beforeend",'<br>📣 Angefeuert von: <b class="chby"></b>');const x=$("doneTxt").querySelector(".chby");if(x)x.textContent=u.join(", ")}
  setTimeout(ping,500);
  const nb=$("bNext");if(nb){const n=(k==="X"||np)?null:nextUp();
    if(n&&!n.fin&&n.k==="c"){nb.style.display="block";$("bNextT").textContent="Weiter: "+n.lab;$("bNextS").textContent=n.sub;nb.onclick=()=>{$("done").style.display="none";goNext(n)}}
    else if(n&&!n.fin&&/nachholen/.test(n.lab)){nb.style.display="block";nb.className="wbtn today";$("bNextT").textContent="Weiter: "+n.lab;$("bNextS").textContent=n.sub;nb.onclick=()=>{$("done").style.display="none";goNext(n)}}
    else nb.style.display="none"}}}
if($("bShare"))$("bShare").onclick=()=>{if(doneCtx)openShare(doneCtx.head,doneCtx.sub)};
const invite=()=>{shareText("Ich mache bei der CYF Challenge mit – jeden Tag ein kurzes Workout. Bist du auch dabei? 💪\n"+SITE)};
for(const id of ["bInvM","bInvR"])if($(id))$(id).onclick=invite;
if($("bShareRk"))$("bShareRk").onclick=()=>{if(!state.name){showLogin();return}openShare("Mein Stand 🏆","")};
if(typeof rrResult==="function"){const _r=rrResult;rrResult=function(){const X=typeof RR!=="undefined"&&RR?RR.x:null,v=typeof RR!=="undefined"&&RR?RR.v:0;
  _r.apply(this,arguments);
  try{if(X&&v&&$("rrP")&&$("rrP").textContent==="NEUER REKORD"&&$("rrB")&&!(RR&&RR.test)){const b=document.createElement("button");b.className="rrb sec";b.textContent="📤 Rekord teilen";b.style.marginTop="10px";
    b.onclick=()=>openShare("Neuer Rekord 👑",X.n+": "+fmtVL(X,v));$("rrB").appendChild(b)}}catch(e){}}}

// ---------- Gesundheitshinweis beim ersten Start ----------
function askHealth(){if(ls("hOk",0))return;
  if(!token||!state.name||running||["modal","help","login","sv","rr","rek","shr","legal"].some(i=>$(i)&&getComputedStyle($(i)).display!=="none")){setTimeout(askHealth,3000);return}
  lsSet("hOk",1);
  ask("🩺 <b>Kurz zur Sicherheit</b><br><span style=\"font-size:14px;line-height:1.5;display:block;margin-top:8px;text-align:left\">CYF ist ein Spaß-Wettbewerb unter Freunden, kein medizinisches Programm. Du trainierst auf eigene Verantwortung.<br><br>• Bluthochdruck, Herzprobleme, Schwangerschaft, Verletzung oder unsicher? Vorher ärztlich abklären.<br>• Beim Halten weiteratmen – nie die Luft anhalten.<br>• Stechender Schmerz, Schwindel oder Druck auf der Brust: sofort aufhören.<br>• Krank? Pause machen. Punkte holst du wieder auf (🔁 Comeback-Mission).</span>",
   ()=>{},null,"Verstanden","Schließen")}
setTimeout(askHealth,2500);

// ---------- Datenschutz & Kontakt ----------
const LEGAL='<h2>Wer steckt dahinter?</h2><p>CYF – Challenge Your Friends ist ein privates, nicht kommerzielles Projekt von <b>Max Spitthoff</b> („Machermax“) für Freunde und Bekannte. Keine Werbung, kein Verkauf, kein Tracking.</p>'
 +'<p><b>Kontakt:</b> in der App unter „Mehr“ → „💬 Feedback &amp; Fragen“ oder direkt bei Max.</p>'
 +'<h2>Was wird gespeichert?</h2><ul><li><b>Benutzername</b> und <b>PIN</b> (die PIN nur verschlüsselt als Prüfwert, nicht lesbar)</li><li><b>E-Mail-Adresse</b> – nur wenn du sie einträgst, nur für Erinnerungen und Antworten auf dein Feedback</li><li><b>Trainingsdaten:</b> erledigte Tage, Challenges, Rekorde, Fitness-Test, Meilensteine, Extra-Sekunden</li><li><b>Angabe Frau/Mann</b> – nur für die faire Wertung</li><li><b>Krank / Pause</b> – nur ob und seit wann, kein Grund</li><li><b>Feedback und Umfragen</b>, die du abschickst</li></ul>'
 +'<h2>Was sehen die anderen?</h2><p>Alle Teilnehmenden sehen deinen Benutzernamen, Punkte, Serie, erledigte Tage, Challenges, Rekorde und ob du gerade pausierst. Die Rangliste ist nicht durch ein Passwort geschützt – wähl deshalb einen Benutzernamen, mit dem du dich wohlfühlst. Deine E-Mail-Adresse sieht nur Max als Betreiber, deine PIN niemand.</p>'
 +'<h2>Was bleibt nur auf deinem Handy?</h2><p>Alles unter „🔒 Meine Werte“ (Gewicht, Größe, Bauchumfang) sowie deine Einstellungen. Das wird nicht übertragen.</p>'
 +'<h2>Chat</h2><p>Nachrichten im Gruppenchat sehen alle Teilnehmenden, Einzelnachrichten nur ihr beide. Alle Nachrichten liegen <b>unverschlüsselt</b> in der Google-Tabelle von Max – er könnte sie als Betreiber technisch lesen. Schreib dort also nichts, was niemand außer deinem Gegenüber wissen darf. Gemeldete Nachrichten schaut sich Max an und kann sie löschen.</p>'
 +'<h2>Wo liegen die Daten?</h2><ul><li>Die App-Seite liegt bei <b>GitHub Pages</b> (GitHub Inc., USA). Beim Aufruf verarbeitet GitHub technisch deine IP-Adresse.</li><li>Konto- und Trainingsdaten liegen in einer <b>Google-Tabelle</b> im Google-Konto von Max; Erinnerungs-Mails werden über Google verschickt (Google Ireland Ltd. / Google LLC, USA).</li></ul>'
 +'<p>Es gibt keine Cookies zu Werbe- oder Analysezwecken. Die App merkt sich nur deine Anmeldung und Einstellungen im Speicher deines Browsers.</p>'
 +'<h2>Warum und wie lange?</h2><p>Grundlage ist deine Einwilligung bei der Registrierung (Art. 6 Abs. 1 a DSGVO). Die Daten bleiben gespeichert, solange du mitmachst. Du kannst jederzeit widerrufen: Dann wird dein Konto mit allen Daten gelöscht.</p>'
 +'<h2>Deine Rechte</h2><p>Auskunft, Berichtigung, Löschung, Einschränkung und Widerruf – einfach bei Max melden. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren.</p>'
 +'<h2>Gesundheit</h2><p>CYF ersetzt keine ärztliche Beratung. Training auf eigene Verantwortung; bei Vorerkrankungen vorher ärztlich abklären, bei Schmerzen oder Schwindel aufhören.</p>'
 +'<p class="note" style="margin-top:14px">Stand: 28.11.2026</p>';
function openLegal(){let el=$("legal");if(!el){el=document.createElement("div");el.id="legal";document.body.appendChild(el);
  el.innerHTML='<div style="max-width:480px;margin:0 auto"><div class="row" style="justify-content:space-between"><h1>📄 Datenschutz &amp; Kontakt</h1><button class="chip" id="legalX">Schließen ✕</button></div>'+LEGAL+'<button class="wbtn" id="legalX2" style="text-align:center;margin-top:16px"><b style="margin:0">Schließen</b></button></div>';
  $("legalX").onclick=$("legalX2").onclick=()=>{el.style.display="none"}}
  el.style.display="block";el.scrollTop=0;if(typeof backGuard==="function")backGuard()}
{const acc=$("bAcc");if(acc){const b=document.createElement("button");b.className="wbtn";b.id="bLegal";b.style.cssText="text-align:center;padding:12px";
  b.innerHTML='<b style="font-size:16px;margin:0">📄 Datenschutz &amp; Kontakt</b><span>Was gespeichert wird, wer es sieht, wie du löschen lässt</span>';acc.insertAdjacentElement("afterend",b);b.onclick=openLegal}
 if($("lgLegal"))$("lgLegal").onclick=openLegal}

// Startseite: Gruppenkasten unter den großen Knopf (vor Rekorde)
{const w=$("whoBox"),n=$("lvlNote");if(w&&n)n.insertAdjacentElement("afterend",w)}
// Meine Werte: Ergebnis des Fitness-Tests (auf der Startseite verschwindet der Kasten nach dem Test)
if(typeof pvRender==="function"){const _pv=pvRender;pvRender=function(){_pv.apply(this,arguments);
  try{let el=$("pvTst");if(!el){el=document.createElement("div");el.id="pvTst";$("pvSum").insertAdjacentElement("afterend",el)}
    const T=typeof myTst==="function"?myTst():{},d=typeof tstDone==="function"&&(tstDone(T.t0)||tstDone(T.t1));
    el.innerHTML=d?tstHtml(true):'<div class="card"><h3>📏 Fitness-Test</h3><p class="note" style="margin:0">Noch nicht gemacht. Du findest ihn auf der Startseite – danach steht dein Ergebnis hier.</p></div>';
    if(d&&typeof tstBind==="function")tstBind(el)}catch(e){console.error(e)}}}

// ---------- Reaktionen & Kommentare auf die Ansage vom Spitzenreiter ----------
const RXE=["👍","🔥","😂","💪","💀","👑"];window.RX=window.RX||[];
css.textContent+=".rxb{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.rxb button{border:1px solid #ffffff30;background:#00000030;color:var(--fg);border-radius:16px;padding:3px 9px;font-size:15px;cursor:pointer}.rxb button.on{background:#ffb02040;border-color:var(--warn)}.rxb button small{font-size:12px;margin-left:3px;color:#ddd}"
 +".rxc{margin-top:10px;font-size:14px;line-height:1.4}.rxc div{padding:4px 0;border-top:1px solid #ffffff18}.rxc b{color:var(--warn)}.rxc a{color:var(--mut);margin-left:6px;cursor:pointer;font-size:12px}.rxi{display:flex;gap:6px;margin-top:8px}.rxi input{flex:1;min-width:0;padding:8px 10px;border-radius:10px;border:1px solid #333;background:#0f1115;color:#fff;font-size:15px}.rxi button{border:0;border-radius:10px;padding:8px 12px;background:var(--warn);color:#000;font-weight:700}";
function curMsg(){const lead=RK.filter(r=>r.pl===1&&r.msg&&r.msg.t&&r.msg.ts).sort((a,b)=>(b.msg.ts||"").localeCompare(a.msg.ts||""));return lead[0]||null}
async function rxSend(m,body,msgEl){if(!token){showLogin();return}
  try{const r=await api("react",Object.assign({token,to:m.name,ts:m.msg.ts},body));
    if(!r.ok){toast(r.err==="unbekannte Aktion"?"Kommt gleich – bitte in ein paar Minuten nochmal":(r.err||"Fehler"));await loadRank();return false}
    await loadRank();return true}catch(e){toast("Keine Verbindung");return false}}
function renderRx(){const m=curMsg();if(!m)return;const me=state.name,L=(window.RX||[]).filter(x=>x.o===m.name),em={},mine={};
  L.filter(x=>x.a==="e").forEach(x=>{em[x.t]=(em[x.t]||0)+1;if(x.von===me)mine[x.t]=1});
  const com=L.filter(x=>x.a==="c").sort((a,b)=>(a.z||"").localeCompare(b.z||""));
  const bar='<div class="rxb">'+RXE.map(e=>'<button data-e="'+e+'" class="'+(mine[e]?"on":"")+'">'+e+(em[e]?'<small>'+em[e]+'</small>':'')+'</button>').join("")+'</div>';
  // Ranking: alles · Startseite: nur Emojis + Anzahl Kommentare
  const full=$("bossBox")&&$("bossBox").querySelector(".boss"),mini=$("bossBox2")&&$("bossBox2").querySelector(".boss");
  if(full){const sh=com.slice(-30);full.insertAdjacentHTML("beforeend",bar+'<div class="rxc">'+sh.map(c=>'<div><b></b> <span></span>'+(c.von===me||me==="machermax"?'<a data-d="'+E(c.id)+'">✕</a>':'')+'</div>').join("")+'</div>'+
      '<div class="rxi"><input maxlength="140" placeholder="Kommentieren …"><button>Senden</button></div>');
    full.querySelectorAll(".rxc div").forEach((d,i)=>{d.querySelector("b").textContent=sh[i].von;d.querySelector("span").textContent=sh[i].t});
    const inp=full.querySelector(".rxi input"),go=async()=>{const t=inp.value.trim();if(!t)return;inp.disabled=true;if(await rxSend(m,{kind:"c",t}))inp.value="";inp.disabled=false};
    full.querySelector(".rxi button").onclick=go;inp.onkeydown=e=>{if(e.key==="Enter")go()};
    full.querySelectorAll("a[data-d]").forEach(a=>a.onclick=()=>ask("Kommentar löschen?",()=>rxSend(m,{kind:"d",id:a.dataset.d}),null,"Löschen","Abbrechen"))}
  if(mini){mini.insertAdjacentHTML("beforeend",bar+(com.length?'<div class="note" style="margin-top:8px;cursor:pointer" class="rxgo">💬 '+com.length+' Kommentar'+(com.length===1?"":"e")+' – im Ranking ansehen</div>':'<div class="note rxgo" style="margin-top:8px;cursor:pointer">💬 Kommentieren – im Ranking</div>'));
    mini.querySelectorAll(".note").forEach(n=>n.onclick=()=>document.querySelector('#menu .tabs button[data-t="rank"]').click())}
  [full,mini].forEach(b=>b&&b.querySelectorAll(".rxb button").forEach(x=>x.onclick=async()=>{x.disabled=true;await rxSend(m,{kind:"e",e:x.dataset.e});x.disabled=false}))}
loadRank=async function(){try{const r=await api("list");if(r.ok){others=r.users||[];window.RX=r.rx||[];window.DU=r.du||[];renderRank()}}catch(e){}};

// ---------- Online-Status & Anfeuern ----------
let ONL={},CHEERS=[],pingBusy=false;
css.textContent+=".onb{font-size:12px;font-weight:700;margin-left:6px;white-space:nowrap}.cheer{margin-left:6px;padding:4px 10px;font-size:13px;border-radius:14px;border:1px solid var(--warn);background:transparent;color:var(--warn);cursor:pointer}#chBan{position:fixed;left:50%;top:18px;transform:translateX(-50%);background:var(--warn);color:#000;font-weight:800;padding:12px 18px;border-radius:16px;z-index:70;box-shadow:0 6px 24px rgba(0,0,0,.5);font-size:17px;text-align:center;max-width:90vw;transition:opacity .4s}";
async function ping(){if(!token||pingBusy||!navigator.onLine)return;pingBusy=true;
  try{const r=await api("ping",{token,st:running?"run":"app"});if(r&&r.ok){ONL=r.on||{};(r.ch||[]).forEach(gotCheer);paintOnline();chatCv(r.cv)}}catch(e){}pingBusy=false}
function gotCheer(c){const n=String(c.von||"Jemand");CHEERS.push(n);confetti();
  let b=$("chBan");if(!b){b=document.createElement("div");b.id="chBan";document.body.appendChild(b)}b.textContent="📣 "+n+" feuert dich an – gib alles!";b.style.opacity="1";clearTimeout(b._t);b._t=setTimeout(()=>b.style.opacity="0",4500);
  chQ.push(n);if(!chT)chT=setInterval(chTick,400);chT0=chT0||Date.now()}
// Ansage nur, wenn der Coach gerade nicht spricht und auch nicht gleich etwas ansagt (sonst überschneidet es sich)
let chQ=[],chT=null,chT0=0;
function busyVoice(){try{if(typeof speechSynthesis!=="undefined"&&(speechSynthesis.speaking||speechSynthesis.pending))return true}catch(e){}try{if(cur)return true}catch(e){}return false}
function calmWindow(){if(!running)return true;if(paused)return false;const st=steps[idx];if(!st||st.type==="prep")return false;
  const el=total-remain;if(el<4||remain<13)return false;
  if(st.type==="work"&&total>=20&&Math.abs(remain-total/2)<6)return false;
  if(st.type==="work"&&[90,30].some(x=>total>x+5&&Math.abs(remain-x)<6))return false;
  if(st.type==="work"&&total>=25&&el<7)return false;
  if(st.type==="rest"&&st.gl&&remain>st.gl-1&&remain-st.gl<8)return false;
  return true}
function chTick(){if(!chQ.length){clearInterval(chT);chT=null;chT0=0;return}
  if(Date.now()-chT0>120000){chQ=[];return}
  if(busyVoice()||!calmWindow())return;
  const u=[...new Set(chQ)];chQ=[];chT0=0;
  const txt=(u.length>1?u.slice(0,-1).join(", ")+" und "+u[u.length-1]+" feuern":u[0]+" feuert")+" dich an! Gib alles!";
  if(typeof quiet!=="undefined"&&quiet){try{beep(1500,.15);setTimeout(()=>beep(1800,.2),180)}catch(e){}return}
  try{const v=typeof pickVoice==="function"?pickVoice():null,x=new SpeechSynthesisUtterance(txt);x.lang=v?v.lang:"de-DE";if(v)x.voice=v;x.rate=typeof rate==="number"?rate:1.1;
    x.onstart=()=>{try{setDuck(true)}catch(e){}};x.onend=x.onerror=()=>{try{setDuck(false)}catch(e){}};speechSynthesis.speak(x)}catch(e){try{beep(1500,.2)}catch(e2){}}}
function paintOnline(){const rows=$("rankList")&&$("rankList").querySelectorAll(".rk");if(!rows)return;
  rows.forEach((el,i)=>{const r=RK[i];if(!r)return;el.querySelectorAll(".onb,.cheer").forEach(x=>x.remove());const st=ONL[r.name];if(!st)return;
    const b=el.querySelector(".nm b");if(b)b.insertAdjacentHTML("afterend",st==="run"?'<span class="onb" style="color:var(--warn)">🏋️ trainiert gerade</span>':'<span class="onb" style="color:var(--acc)">🟢 online</span>');
    if(st==="run"&&!r.me){const btn=document.createElement("button");btn.className="cheer";btn.textContent="📣 Anfeuern";el.querySelector(".nm").appendChild(btn);
      btn.onclick=async()=>{if(!token){showLogin();return}btn.disabled=true;try{const x=await api("cheer",{token,to:r.name});toast(x.ok?"📣 "+r.name+" wird angefeuert!":(x.err==="unbekannte Aktion"?"Kommt gleich – bitte in ein paar Minuten nochmal":x.err||"Fehler"));if(x.ok){btn.textContent="✅ Angefeuert";confetti()}else btn.disabled=false}catch(e){toast("Keine Verbindung");btn.disabled=false}}}});
  const w=$("whoBox"),now=Object.keys(ONL).filter(n=>ONL[n]==="run"&&n!==state.name);
  if(w){w.querySelectorAll(".onl").forEach(x=>x.remove());if(now.length){const c=w.querySelector(".card")||w;c.insertAdjacentHTML("beforeend",'<p class="onl" style="margin-top:8px;cursor:pointer;color:var(--warn)">🏋️ Trainiert gerade: <b></b> – im Ranking anfeuern 📣</p>');
    const p=c.querySelector(".onl");p.querySelector("b").textContent=now.join(", ");p.onclick=()=>document.querySelector('#menu .tabs button[data-t="rank"]').click()}}}
setInterval(()=>{if(document.visibilityState==="visible")ping()},20000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")setTimeout(ping,500)});
setTimeout(ping,2500);
{const _st=start;start=async function(){CHEERS=[];const r=await _st.apply(this,arguments);setTimeout(ping,800);return r}}
{const _sp=stop;stop=function(){const r=_sp.apply(this,arguments);setTimeout(ping,300);return r}}

// ---------- Duelle: im Ranking auf einen Namen tippen → Übung wählen → vorlegen; der Gegner hat 24 Std. zum Kontern ----------
window.DU=window.DU||[];let DUEL=null;const duSeen={};
css.textContent+="#duelO{display:none;position:fixed;inset:0;background:var(--bg);overflow:auto;padding:20px;z-index:12}.dug{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0 16px}.dug button{min-height:46px;border-radius:12px;border:1px solid #2a2e37;background:var(--card);color:var(--fg);font-size:14px;font-weight:600;padding:6px 8px;text-align:left}.dug button small{display:block;color:var(--mut);font-weight:400;font-size:12px}"
 +".dui{padding:10px 0;border-top:1px solid #ffffff14;font-size:14px;line-height:1.45}.dui:first-child{border-top:0}.dui .row{margin-top:6px;gap:6px;flex-wrap:wrap}.dui .chip{padding:6px 12px;font-size:13px}.rk{cursor:pointer}.dutag{display:inline-block;font-size:12px;padding:1px 7px;border-radius:9px;background:#ffb02030;color:var(--warn);margin:2px 4px 0 0}";
const duX=id=>(typeof LIBK!=="undefined"&&LIBK[id])||null;
const duV=(id,v)=>{const x=duX(id);return x&&typeof fmtVL==="function"?fmtVL(x,v):String(v)};
function duWins(){const w={};(window.DU||[]).filter(d=>d.st==="done"&&d.w).sort((a,b)=>a.z-b.z).forEach(d=>{w[d.w]=w[d.w]||{};w[d.w][d.ex]=(w[d.w][d.ex]||0)+1});return w}
function duOverlay(){let el=$("duelO");if(!el){el=document.createElement("div");el.id="duelO";document.body.appendChild(el)}return el}
function duClose(){const el=$("duelO");if(el)el.style.display="none"}
function openDuel(name){if(!token){showLogin();return}if(name===state.name)return;
  const open=(window.DU||[]).find(d=>d.st==="open"&&((d.von===name&&d.an===state.name)||(d.an===name&&d.von===state.name)));
  if(open){if(open.an===state.name)duAccept(open);else toast("⚔️ Euer Duell läuft schon – "+name+" ist dran");return}
  const me=RK.find(r=>r.me),him=RK.find(r=>r.name===name),tie=me&&him&&me.pts===him.pts;
  const H=LIB.filter(x=>x.m==="h"),Rp=LIB.filter(x=>x.m==="r"||x.m==="r60"),el=duOverlay(),rec=myRec();
  const btn=x=>'<button data-x="'+x.id+'">'+E(x.n)+'<small>'+(rec[x.id]?"Dein Rekord: "+E(fmtVL(x,rec[x.id].b)):"noch kein Rekord")+'</small></button>';
  el.innerHTML='<div style="max-width:480px;margin:0 auto"><div class="row" style="justify-content:space-between"><h1>⚔️ Duell gegen <span id="duN"></span></h1><button class="chip" id="duX">✕</button></div>'
   +'<p class="note" style="margin:8px 0 12px">So läuft\'s: Du wählst eine Übung und legst jetzt vor. <b id="duN2"></b> sieht dein Ergebnis und hat 24 Std., um es zu schlagen. Wer gewinnt, bekommt ein Abzeichen (z. B. „Plank #1“).'+(tie?'<br><b style="color:var(--warn)">Ihr seid gerade punktgleich – der Sieger bekommt +1 Extrapunkt (1× pro Woche).</b>':'')+'</p>'
   +'<h3>⏱ Halten – wer länger hält</h3><div class="dug">'+H.map(btn).join("")+'</div><h3>🔥 Wiederholungen am Stück</h3><div class="dug">'+Rp.map(btn).join("")+'</div></div>';
  $("duN").textContent=name;$("duN2").textContent=name;$("duX").onclick=duClose;
  el.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{const x=duX(b.dataset.x);
    ask('⚔️ <b>'+E(x.n)+'</b> gegen <b>'+E(name)+'</b><br><span style="font-size:14px">Jetzt dein Versuch – danach geht die Herausforderung raus.</span>',()=>{duClose();DUEL={mode:"new",to:name,x};rrStart(x)},null,"Los geht's","Abbrechen")});
  el.style.display="block";el.scrollTop=0;if(typeof backGuard==="function")backGuard()}
function duAccept(d){const x=duX(d.ex);if(!x){toast("Diese Übung kennt deine App noch nicht – bitte App neu laden");return}
  ask('⚔️ <b>'+E(d.von)+'</b> fordert dich heraus!<br><b>'+E(x.n)+'</b> – vorgelegt: <b>'+E(duV(d.ex,d.v1))+'</b>. Schlag das!'+(d.tie?'<br><span style="color:var(--warn)">Es geht um +1 Extrapunkt.</span>':'')+'<br><span style="font-size:13px;color:var(--mut)">Zeit bis '+new Date(d.z+864e5).toLocaleString("de-DE",{weekday:"short",hour:"2-digit",minute:"2-digit"})+' Uhr</span>',
    ()=>{DUEL={mode:"answer",d,x};rrStart(x)},null,"Annehmen & loslegen","Später")}
async function duAct(body,ok){try{const r=await api("duel",Object.assign({token},body));if(r.ok){if(ok)ok(r)}else toast(r.err==="unbekannte Aktion"?"Duelle werden gerade freigeschaltet – gleich nochmal":r.err||"Fehler");await loadRank();return r}catch(e){toast("Keine Verbindung");return null}}
const SSPI={s:"✂️",t:"🪨",p:"📄"},SSPN={s:"Schere",t:"Stein",p:"Papier"};
const sspBtns=attr=>'<div class="row" style="gap:8px;margin-top:6px">'+Object.keys(SSPI).map(k=>'<button class="chip" style="font-size:22px;padding:8px 14px" '+attr+'="'+k+'" title="'+SSPN[k]+'">'+SSPI[k]+'</button>').join("")+'</div>';
function duDecline(d){if(d.tie){const el=duOverlay();
  el.innerHTML='<div style="max-width:480px;margin:0 auto"><div class="row" style="justify-content:space-between"><h1>Duell ablehnen?</h1><button class="chip" id="duX">✕</button></div><p class="note" style="margin:8px 0 14px">Es geht um den Extrapunkt. Statt zu kämpfen kannst du das Glück entscheiden lassen – <b id="duV"></b> muss zustimmen.</p>'
   +'<button class="wbtn" id="duCoin" style="text-align:center"><b style="margin:0">🪙 Münzwurf vorschlagen</b><span>50 : 50, entschieden sobald zugestimmt</span></button>'
   +'<div class="card" style="margin-top:10px"><h3>✂️🪨📄 Schere-Stein-Papier</h3><p class="note" style="margin:0">Wähl jetzt geheim – der andere sieht deine Wahl nicht. Bei Gleichstand geht es in die nächste Runde.</p>'+sspBtns("data-sh")+'</div>'
   +'<button class="chip" id="duNo" style="margin-top:14px">Nur ablehnen (niemand bekommt den Punkt)</button></div>';
  $("duV").textContent=d.von;$("duX").onclick=duClose;
  $("duCoin").onclick=()=>{duClose();duAct({do:"decline",id:d.id,coin:1},()=>toast("🪙 Münzwurf vorgeschlagen"))};
  $("duNo").onclick=()=>{duClose();duAct({do:"decline",id:d.id},()=>toast("Duell abgelehnt"))};
  el.querySelectorAll("[data-sh]").forEach(b=>b.onclick=()=>{duClose();duAct({do:"decline",id:d.id,ssp:b.dataset.sh},()=>toast(SSPI[b.dataset.sh]+" gewählt – wartet auf "+d.von))});
  el.style.display="block";el.scrollTop=0;return}
  else ask("Duell gegen "+E(d.von)+" ablehnen?",()=>duAct({do:"decline",id:d.id},()=>toast("Duell abgelehnt")),null,"Ablehnen","Abbrechen")}
function duSsp(d,h,ok){duAct({do:"ssp",id:d.id,h,ok:ok?1:0},r=>{if(!ok)return;if(r.wait)toast(SSPI[h]+" gewählt – wartet auf den anderen");else if(r.draw&&r.coin){if(r.sieger===state.name)confetti();ask("🤝 Wieder beide "+SSPI[h]+" – 2× Unentschieden!<br>🪙 Der Münzwurf entscheidet:<br><b style=\"font-size:20px\">"+E(r.sieger)+" bekommt den Extrapunkt!</b>",()=>{},null,"Ok","Schließen")}else if(r.draw)ask("🤝 Beide "+SSPI[h]+" "+SSPN[h]+" – Unentschieden!<br>Nächste Runde: bitte neu wählen.",()=>{},null,"Ok","Schließen");else{if(r.sieger===state.name)confetti();ask(E(d.von)+": "+SSPI[r.v]+" · "+E(d.an)+": "+SSPI[r.a]+"<br><b style=\"font-size:20px\">"+E(r.sieger)+" gewinnt den Extrapunkt!</b>",()=>{},null,"Ok","Schließen")}})}
function duCoin(d,ok){duAct({do:"coin",id:d.id,ok:ok?1:0},r=>{if(ok){confetti();ask("🪙 Münzwurf …<br><b style=\"font-size:20px\">"+E(r.sieger)+" gewinnt den Extrapunkt!</b>",()=>{},null,"Ok","Schließen")}})}
{const _r=rrResult;rrResult=function(){const D0=DUEL,v=RR&&RR.v;_r.apply(this,arguments);if(!D0)return;DUEL=null;if(!v)return;
  const box=$("rrI");if(box)box.insertAdjacentHTML("beforeend",'<br><span id="duRes" style="color:var(--warn)">⚔️ Duell wird übertragen …</span>');
  const put=t=>{const e=$("duRes");if(e)e.textContent=t};
  if(D0.mode==="new")duAct({do:"new",to:D0.to,ex:D0.x.id,exn:D0.x.n,art:D0.x.u==="st"?"st":D0.x.m==="h"?"h":"r",v},r=>put("⚔️ Herausforderung an "+D0.to+" ist raus"+(r.tie?" – es geht um +1 Extrapunkt!":"! Er/sie hat 24 Std. zum Kontern.")));
  else duAct({do:"answer",id:D0.d.id,v},r=>{if(r.sieger===state.name){confetti();put("🏆 Du hast das Duell gewonnen"+(r.extra?" – +1 Extrapunkt!":"!"))}else if(r.sieger)put("😤 "+r.sieger+" bleibt vorne ("+duV(D0.d.ex,r.v1)+"). Revanche im Ranking!");else put("🤝 Unentschieden – genau gleich!")})}}
{const _q=rrQuit;rrQuit=function(){DUEL=null;return _q.apply(this,arguments)}}
function renderDuels(){const rl=$("rankList");if(!rl)return;const me=state.name,L=window.DU||[];
  rl.querySelectorAll(".rk").forEach((el,i)=>{const r=RK[i];if(!r||r.me)return;el.onclick=e=>{if(e.target.closest("button"))return;openProfile(r.name)}});
  const W=duWins();rl.querySelectorAll(".rk").forEach((el,i)=>{const r=RK[i];if(!r)return;el.querySelectorAll(".dutag").forEach(x=>x.remove());const w=W[r.name];if(!w)return;
    const sm=el.querySelector(".nm small");if(sm)Object.keys(w).forEach(k=>{const t=document.createElement("span");t.className="dutag";t.textContent="⚔️ "+((duX(k)||{}).n||k)+" #"+w[k];sm.after(t)})});
  let card=$("duelCard");if(!card){card=document.createElement("div");card.className="card";card.id="duelCard";const rc=rl.closest(".card");if(rc)rc.after(card);else return}
  const mine=me?L.filter(d=>d.an===me&&d.st==="open"):[],coin=me?L.filter(d=>d.von===me&&d.st==="coin"):[],ssp=me?L.filter(d=>d.st==="ssp"&&((d.von===me&&!d.sv)||(d.an===me&&!d.sa))):[],sspW=me?L.filter(d=>d.st==="ssp"&&((d.von===me&&d.sv)||(d.an===me&&d.sa))):[],wait=me?L.filter(d=>(d.von===me&&d.st==="open")||(d.an===me&&d.st==="coin")):[],done=L.filter(d=>["done","coindone","sspdone","sspcoin"].includes(d.st)).sort((a,b)=>b.z-a.z).slice(0,6);
  const line=d=>{const x=duX(d.ex),n=x?x.n:d.exn;return '<b>'+E(d.von)+'</b> ⚔️ <b>'+E(d.an)+'</b> · '+E(n)+(d.tie?' · 🏅 um 1 Punkt':'')};
  let h='<h3>⚔️ Duelle</h3><p class="note" style="margin:-4px 0 8px">Tippe im Ranking auf einen Namen, um ihn herauszufordern, als Freund hinzuzufügen oder anzuschreiben.</p>';
  mine.forEach(d=>h+='<div class="dui">🔔 '+line(d)+'<br>Vorgelegt: <b>'+E(duV(d.ex,d.v1))+'</b> – du bist dran!<div class="row"><button class="chip" data-acc="'+E(d.id)+'" style="border-color:var(--acc);color:var(--acc)">Annehmen & loslegen</button><button class="chip" data-dec="'+E(d.id)+'">Ablehnen</button></div></div>');
  coin.forEach(d=>h+='<div class="dui">🪙 '+E(d.an)+' schlägt einen Münzwurf um den Extrapunkt vor ('+E((duX(d.ex)||{}).n||d.exn)+').<div class="row"><button class="chip" data-cy="'+E(d.id)+'" style="border-color:var(--acc);color:var(--acc)">Einverstanden – werfen</button><button class="chip" data-cn="'+E(d.id)+'">Nein</button></div></div>');
  ssp.forEach(d=>h+='<div class="dui">✂️🪨📄 '+(d.von===me?E(d.an)+' will Schere-Stein-Papier um den Extrapunkt ('+E((duX(d.ex)||{}).n||d.exn)+'). Einverstanden? Dann wähl geheim:':'Runde '+d.rd+' Schere-Stein-Papier gegen '+E(d.von)+' – wähl geheim:')+sspBtns('data-sp="'+E(d.id)+'" data-h')+(d.von===me&&d.rd<=1?'<div class="row"><button class="chip" data-sn="'+E(d.id)+'">Nein, kein Glücksspiel</button></div>':'')+'</div>');
  sspW.forEach(d=>h+='<div class="dui">⏳ Schere-Stein-Papier gegen '+E(d.von===me?d.an:d.von)+' (Runde '+d.rd+') – du hast gewählt, wartet auf die andere Seite.</div>');
  wait.forEach(d=>h+='<div class="dui">⏳ '+line(d)+(d.st==="coin"?'<br>Münzwurf vorgeschlagen – wartet auf '+E(d.von)+'.':'<br>Du hast <b>'+E(duV(d.ex,d.v1))+'</b> vorgelegt – wartet auf '+E(d.an)+'.')+'</div>');
  done.forEach(d=>h+='<div class="dui">'+(d.w?'🏆 <b>'+E(d.w)+'</b> gewinnt':'🤝 Unentschieden')+' · '+line(d)+(d.st==="coindone"?'<br>per Münzwurf':d.st==="sspdone"?'<br>per Schere-Stein-Papier: '+E(d.von)+' '+(SSPI[d.sv]||'')+' · '+E(d.an)+' '+(SSPI[d.sa]||''):d.st==="sspcoin"?'<br>2× Schere-Stein-Papier unentschieden, dann Münzwurf':'<br>'+E(d.von)+': '+E(duV(d.ex,d.v1))+' · '+E(d.an)+': '+E(duV(d.ex,d.v2)))+(me&&d.w&&d.w!==me&&(d.von===me||d.an===me)?'<div class="row"><button class="chip" data-rev="'+E(d.w)+'">🔁 Revanche</button></div>':'')+'</div>');
  if(!mine.length&&!coin.length&&!ssp.length&&!sspW.length&&!wait.length&&!done.length)h+='<p class="note" style="margin:0">Noch keine Duelle. Wer traut sich zuerst?</p>';
  card.innerHTML=h;
  card.querySelectorAll("[data-acc]").forEach(b=>b.onclick=()=>duAccept(L.find(d=>d.id===b.dataset.acc)));
  card.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>duDecline(L.find(d=>d.id===b.dataset.dec)));
  card.querySelectorAll("[data-cy]").forEach(b=>b.onclick=()=>duCoin(L.find(d=>d.id===b.dataset.cy),true));
  card.querySelectorAll("[data-cn]").forEach(b=>b.onclick=()=>duCoin(L.find(d=>d.id===b.dataset.cn),false));
  card.querySelectorAll("[data-sp]").forEach(b=>b.onclick=()=>duSsp(L.find(d=>d.id===b.dataset.sp),b.dataset.h,true));
  card.querySelectorAll("[data-sn]").forEach(b=>b.onclick=()=>duSsp(L.find(d=>d.id===b.dataset.sn),"s",false));
  card.querySelectorAll("[data-rev]").forEach(b=>b.onclick=()=>openDuel(b.dataset.rev));
  // Startseite: Hinweis + einmaliges Pop-up für neue Herausforderungen
  const w=$("whoBox");if(w){w.querySelectorAll(".duh").forEach(x=>x.remove());const n=mine.length+coin.length+ssp.length;if(n){const c=w.querySelector(".card")||w;c.insertAdjacentHTML("beforeend",'<p class="duh" style="margin-top:8px;cursor:pointer;color:var(--warn)">⚔️ '+(mine.length?E(mine.map(d=>d.von).join(", "))+" hat dich herausgefordert":ssp.length?"Schere-Stein-Papier wartet auf dich":"Münzwurf wartet auf dich")+' – im Ranking antworten</p>');
    c.querySelector(".duh").onclick=()=>document.querySelector('#menu .tabs button[data-t="rank"]').click()}}
  duPop(mine,coin,ssp)}
// Beim App-Start (und wenn neu dazukommt): offene Duelle als Pop-up, je Sitzung einmal; Ergebnisse einmalig
function duPop(mine,coin,ssp){const me=state.name,L=window.DU||[];if(!me||running||RR||getComputedStyle($("modal")).display!=="none"||($("duelO")&&$("duelO").style.display==="block"))return;
  const goRank=()=>{const b=document.querySelector('#menu .tabs button[data-t="rank"]');if(b)b.click();setTimeout(()=>{const c=$("duelCard");if(c)c.scrollIntoView({behavior:"smooth",block:"start"})},300)};
  let d=mine.find(x=>!duSeen[x.id]);if(d){duSeen[d.id]=1;duAccept(d);return}
  d=coin.find(x=>!duSeen["c"+x.id]);if(d){duSeen["c"+d.id]=1;ask("🪙 <b>"+E(d.an)+"</b> schlägt einen Münzwurf um den Extrapunkt vor ("+E((duX(d.ex)||{}).n||d.exn)+"). Einverstanden?",()=>duCoin(d,true),null,"Einverstanden – werfen","Später");return}
  d=ssp.find(x=>!duSeen["s"+x.id+"_"+x.rd]);if(d){duSeen["s"+d.id+"_"+d.rd]=1;ask("✂️🪨📄 "+(d.von===me?"<b>"+E(d.an)+"</b> will Schere-Stein-Papier um den Extrapunkt.":"Schere-Stein-Papier gegen <b>"+E(d.von)+"</b>"+(d.rd>1?" – Runde "+d.rd:"")+": du bist dran.")+"<br><span style=\"font-size:13px;color:var(--mut)\">Unentschieden auch in Runde 2? Dann entscheidet automatisch ein Münzwurf.</span>",goRank,null,"Jetzt wählen","Später");return}
  const R=L.filter(x=>["done","coindone","sspdone","sspcoin","declined"].includes(x.st)&&(x.von===me||(x.an===me&&x.st!=="done"&&x.st!=="declined"))&&!ls("duR_"+x.id,0));
  d=R[0];if(!d)return;lsSet("duR_"+d.id,1);const other=d.von===me?d.an:d.von,n=E((duX(d.ex)||{}).n||d.exn);
  let t;if(d.st==="declined")t="🙅 <b>"+E(d.an)+"</b> hat dein Duell ("+n+") abgelehnt.";
  else if(d.st==="done")t=(d.w===me?"🏆 Gewonnen! <b>"+E(other)+"</b> hat dein "+n+" nicht geknackt":d.w?"😤 <b>"+E(other)+"</b> hat dich geschlagen":"🤝 Unentschieden gegen <b>"+E(other)+"</b>")+"<br>"+n+": du "+E(duV(d.ex,d.v1))+" · "+E(other)+" "+E(duV(d.ex,d.v2))+(d.w===me&&d.tie?"<br>+1 Extrapunkt!":"");
  else t=(d.st==="sspcoin"?"✂️🪨📄 2× Unentschieden – der Münzwurf entscheidet:":d.st==="sspdone"?"✂️🪨📄 "+E(d.von)+" "+(SSPI[d.sv]||"")+" · "+E(d.an)+" "+(SSPI[d.sa]||""):"🪙 Münzwurf:")+"<br><b style=\"font-size:20px\">"+E(d.w)+" bekommt den Extrapunkt!</b>";
  if(d.w===me)confetti();ask(t,d.w&&d.w!==me&&d.st==="done"?()=>openDuel(other):()=>{},null,d.w&&d.w!==me&&d.st==="done"?"🔁 Revanche":"Ok",d.w&&d.w!==me&&d.st==="done"?"Später":"Schließen")}

// ---------- Freunde & Chat ----------
let CHAT={fr:[],inc:[],out:[],bl:[],m:[],adm:false},chCv=null,chConv=null,chBusy=false,chFirst=true;const chAsked={};
css.textContent+="#tab-chat .cl{display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid #ffffff14;cursor:pointer}#tab-chat .cl:first-of-type{border-top:0}#tab-chat .cl .tx{flex:1;min-width:0}#tab-chat .cl .tx small{display:block;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
 +".cbdg{display:inline-block;min-width:20px;padding:1px 6px;border-radius:10px;background:var(--acc);color:#000;font-size:12px;font-weight:800;text-align:center}#menu .tabs button .cbdg{position:absolute;top:3px;right:6px;font-size:11px;min-width:16px;padding:0 4px;line-height:16px}#menu .tabs button{position:relative}"
 +"#chMsgs{max-height:calc(100vh - 300px);min-height:200px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:4px 0}.bub{max-width:82%;padding:8px 11px;border-radius:14px;background:#232733;font-size:15px;line-height:1.35;white-space:pre-wrap;word-wrap:break-word;align-self:flex-start;cursor:pointer}.bub.me{align-self:flex-end;background:#1f5c3c}.bub small{display:block;color:var(--mut);font-size:11px;margin-top:2px}.bub b{display:block;font-size:12px;color:var(--warn)}.chday{align-self:center;font-size:12px;color:var(--mut);margin:6px 0}"
 +"#chIn{display:flex;gap:8px;margin-top:8px}#chIn textarea{flex:1;min-height:44px;max-height:120px;resize:none;border-radius:12px;border:1px solid #2a2e37;background:var(--card);color:var(--fg);font:inherit;padding:10px}#chIn button{border:0;border-radius:12px;background:var(--acc);color:#000;font-weight:800;padding:0 16px;font-size:18px}";
const chKey=c=>"chR_"+(c==="*"?"*":c);
const chConvOf=m=>m.an==="*"?"*":m.von===state.name?m.an:m.von;
const chUnread=c=>{const r=+ls(chKey(c),0);return CHAT.m.filter(m=>chConvOf(m)===c&&m.von!==state.name&&m.z>r).length};
const chUnreadAll=()=>["*"].concat(CHAT.fr).reduce((a,c)=>a+chUnread(c),0)+CHAT.inc.length;
const chTime=z=>{const d=new Date(z),n=new Date();return d.toDateString()===n.toDateString()?d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}):d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})+" "+d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})};
async function chAct(body,ok){try{const r=await api("chat",Object.assign({token},body));if(r.ok){if(ok)ok(r)}else toast(r.err==="unbekannte Aktion"?"Chat wird gerade freigeschaltet – gleich nochmal":r.err||"Fehler");await chatSync();return r}catch(e){toast("Keine Verbindung");return null}}
function chatCv(cv){if(cv&&cv!==chCv){chCv=cv;chatSync()}}
async function chatSync(){if(!token||chBusy)return;chBusy=true;try{const r=await api("chat",{token,do:"sync"});if(r&&r.ok){CHAT=r;if(r.cv)chCv=r.cv;renderChat();chPop()}}catch(e){}chBusy=false}
function chBadge(){const b=document.querySelector('#menu .tabs button[data-t="chat"]');if(!b)return;let s=b.querySelector(".cbdg");const n=chUnreadAll();if(!n){if(s)s.remove();return}if(!s){s=document.createElement("span");s.className="cbdg";b.appendChild(s)}s.textContent=n>99?"99+":n}
function chPop(){const me=state.name;if(!me)return;chBadge();
  const w=$("whoBox");if(w){w.querySelectorAll(".chh").forEach(x=>x.remove());const n=chUnreadAll();if(n){const c=w.querySelector(".card")||w;c.insertAdjacentHTML("beforeend",'<p class="chh" style="margin-top:8px;cursor:pointer;color:var(--acc)">💬 '+(CHAT.inc.length?CHAT.inc.length+" Freundschaftsanfrage"+(CHAT.inc.length>1?"n":"")+(n>CHAT.inc.length?" · ":""):"")+(n>CHAT.inc.length?(n-CHAT.inc.length)+" neue Nachricht"+(n-CHAT.inc.length>1?"en":""):"")+' – öffnen</p>');c.querySelector(".chh").onclick=()=>chOpenTab()}}
  if(running||RR||getComputedStyle($("modal")).display!=="none"||($("duelO")&&$("duelO").style.display==="block"))return;
  const f=CHAT.inc.find(x=>!chAsked[x]);if(f){chAsked[f]=1;ask("👋 <b>"+E(f)+"</b> möchte mit dir befreundet sein – dann könnt ihr euch Nachrichten schreiben.",()=>chAct({do:"acc",who:f},()=>toast("🤝 Ihr seid jetzt Freunde")),null,"Annehmen","Später");return}
  if(chFirst){chFirst=false;const n=chUnreadAll();if(n)toast("💬 "+n+" neue Nachricht"+(n>1?"en":"")+" im Chat")}}
function chOpenTab(c){const b=document.querySelector('#menu .tabs button[data-t="chat"]');if(c!==undefined)chConv=c;if(b)b.click()}
function openProfile(name){if(!token){showLogin();return}const el=duOverlay(),fr=CHAT.fr.includes(name),inc=CHAT.inc.includes(name),out=CHAT.out.includes(name),bl=CHAT.bl.includes(name),on=ONL[name];
  el.innerHTML='<div style="max-width:480px;margin:0 auto"><div class="row" style="justify-content:space-between"><h1 id="pfN"></h1><button class="chip" id="duX">✕</button></div><p class="note" style="margin:4px 0 14px" id="pfS"></p>'
   +'<button class="wbtn" id="pfD" style="text-align:center"><b style="margin:0">⚔️ Herausfordern</b><span>Übung wählen und vorlegen</span></button>'
   +(fr?'<button class="wbtn" id="pfC" style="text-align:center"><b style="margin:0">💬 Nachricht schreiben</b><span>Einzelchat – nur ihr beide</span></button>'
     :bl?'<button class="wbtn" id="pfU" style="text-align:center"><b style="margin:0">🔓 Blockierung aufheben</b><span>Du hast diese Person blockiert</span></button>'
     :inc?'<button class="wbtn" id="pfA" style="text-align:center;border:1px solid var(--acc)"><b style="margin:0">🤝 Freundschaft annehmen</b><span>Möchte mit dir befreundet sein</span></button>'
     :out?'<button class="wbtn" style="text-align:center;opacity:.6"><b style="margin:0">⏳ Anfrage gesendet</b><span>Wartet auf Bestätigung</span></button>'
     :'<button class="wbtn" id="pfF" style="text-align:center"><b style="margin:0">➕ Freund hinzufügen</b><span>Danach könnt ihr euch schreiben</span></button>')
   +'<button class="chip" id="pfG" style="margin-top:10px">💬 Zum Gruppenchat „Alle“</button>'+(fr?' <button class="chip" id="pfR" style="margin-top:10px">Freundschaft beenden</button>':'')+(!bl?' <button class="chip" id="pfB" style="margin-top:10px">🚫 Blockieren</button>':'')+'</div>';
  $("pfN").textContent=name;const r=RK.find(x=>x.name===name);$("pfS").textContent=(r?r.pl+". Platz · "+r.pts+" Punkte":"")+(on?(r?" · ":"")+(on==="run"?"🏋️ trainiert gerade":"🟢 online"):"")+(fr?" · 🤝 Freunde":"");
  $("duX").onclick=duClose;$("pfD").onclick=()=>{duClose();openDuel(name)};$("pfG").onclick=()=>{duClose();chOpenTab("*")};
  const b=(id,f)=>{const x=$(id);if(x)x.onclick=f};
  b("pfC",()=>{duClose();chOpenTab(name)});b("pfF",()=>{duClose();chAct({do:"req",who:name},r=>toast(r.st==="ok"?"🤝 Ihr seid jetzt Freunde":"➕ Anfrage an "+name+" gesendet"))});
  b("pfA",()=>{duClose();chAct({do:"acc",who:name},()=>toast("🤝 Ihr seid jetzt Freunde"))});b("pfU",()=>{duClose();chAct({do:"unblock",who:name},()=>toast("Blockierung aufgehoben"))});
  b("pfR",()=>ask("Freundschaft mit "+E(name)+" beenden? Euer Einzelchat ist dann gesperrt.",()=>{duClose();chAct({do:"unf",who:name})},null,"Beenden","Abbrechen"));
  b("pfB",()=>ask("<b>"+E(name)+"</b> blockieren?<br><span style=\"font-size:14px\">Du siehst keine Nachrichten mehr von dieser Person, auch nicht im Gruppenchat. Sie wird nicht benachrichtigt.</span>",()=>{duClose();chAct({do:"block",who:name},()=>toast("🚫 Blockiert"))},null,"Blockieren","Abbrechen"));
  el.style.display="block";el.scrollTop=0;if(typeof backGuard==="function")backGuard()}
function renderChat(){chBadge();const tc=$("tab-chat");if(!tc||tc.style.display==="none")return;const me=state.name;
  if(!token){tc.innerHTML='<div class="card"><p>Bitte zuerst anmelden.</p></div>';return}
  if(chConv!==null&&chConv!=="*"&&!CHAT.fr.includes(chConv))chConv=null;
  if(chConv===null){const last=c=>{const l=CHAT.m.filter(m=>chConvOf(m)===c);return l[l.length-1]};
    const row=(c,title,sub)=>{const l=last(c),u=chUnread(c);return '<div class="cl" data-c="'+E(c)+'"><div style="font-size:24px">'+(c==="*"?"👥":"🙂")+'</div><div class="tx"><b>'+E(title)+'</b><small>'+(l?E((l.von===me?"Du":l.von)+": "+l.t):E(sub))+'</small></div>'+(u?'<span class="cbdg">'+u+'</span>':l?'<small style="color:var(--mut)">'+chTime(l.z)+'</small>':'')+'</div>'};
    const all=(typeof others!=="undefined"?others:[]).map(u=>u.name).filter(n=>n&&n!==me&&!CHAT.fr.includes(n)&&!CHAT.inc.includes(n)&&!CHAT.out.includes(n)&&!CHAT.bl.includes(n)).sort((a,b)=>a.localeCompare(b));
    let h='<div class="card"><h3>💬 Chats</h3>'+row("*","Alle (Gruppenchat)","Für alle in der Challenge sichtbar")
      +CHAT.fr.slice().sort((a,b)=>((last(b)||{}).z||0)-((last(a)||{}).z||0)).map(f=>row(f,f,"Noch keine Nachrichten – sag Hallo 👋")).join("")
      +(CHAT.fr.length?'':'<p class="note" style="margin:8px 0 0">Einzelchats gehen mit Freunden. Füg unten jemanden hinzu – oder tipp im Ranking auf einen Namen.</p>')+'</div>';
    if(CHAT.inc.length)h+='<div class="card"><h3>👋 Freundschaftsanfragen</h3>'+CHAT.inc.map(n=>'<div class="dui"><b>'+E(n)+'</b> möchte mit dir befreundet sein<div class="row"><button class="chip" data-acc="'+E(n)+'" style="border-color:var(--acc);color:var(--acc)">Annehmen</button><button class="chip" data-dec="'+E(n)+'">Ablehnen</button></div></div>').join("")+'</div>';
    h+='<div class="card"><h3>➕ Freunde finden</h3>'+(CHAT.out.length?'<p class="note" style="margin:0 0 6px">⏳ Angefragt: '+E(CHAT.out.join(", "))+'</p>':'')
      +(all.length?'<div class="row" style="flex-wrap:wrap;gap:6px">'+all.map(n=>'<button class="chip" data-req="'+E(n)+'">➕ '+E(n)+'</button>').join("")+'</div>':'<p class="note" style="margin:0">Alle sind schon deine Freunde 🎉</p>')
      +(CHAT.bl.length?'<p class="note" style="margin:10px 0 0">🚫 Blockiert: '+CHAT.bl.map(n=>'<a href="#" data-unb="'+E(n)+'">'+E(n)+'</a>').join(", ")+' (antippen zum Aufheben)</p>':'')+'</div>';
    tc.innerHTML=h;
    tc.querySelectorAll("[data-c]").forEach(x=>x.onclick=()=>{chConv=x.dataset.c;renderChat()});
    tc.querySelectorAll("[data-acc]").forEach(x=>x.onclick=()=>chAct({do:"acc",who:x.dataset.acc},()=>toast("🤝 Ihr seid jetzt Freunde")));
    tc.querySelectorAll("[data-dec]").forEach(x=>x.onclick=()=>chAct({do:"dec",who:x.dataset.dec}));
    tc.querySelectorAll("[data-req]").forEach(x=>x.onclick=()=>chAct({do:"req",who:x.dataset.req},r=>toast(r.st==="ok"?"🤝 Ihr seid jetzt Freunde":"➕ Anfrage gesendet")));
    tc.querySelectorAll("[data-unb]").forEach(x=>x.onclick=e=>{e.preventDefault();chAct({do:"unblock",who:x.dataset.unb})});return}
  const c=chConv,L=CHAT.m.filter(m=>chConvOf(m)===c),keep=$("chTxt")?$("chTxt").value:"",old=$("chMsgs"),atEnd=!old||old.scrollHeight-old.scrollTop-old.clientHeight<60;
  let h='<div class="card"><div class="row" style="justify-content:space-between;align-items:center"><button class="chip" id="chBack">←</button><h3 style="margin:0;flex:1;text-align:center">'+(c==="*"?"👥 Alle":"🙂 "+E(c))+'</h3>'+(c==="*"?'<span style="width:40px"></span>':'<button class="chip" id="chProf">⋯</button>')+'</div>'
   +(c==="*"?'<p class="note" style="margin:6px 0 0;text-align:center">Gruppenchat – alle in der Challenge lesen mit</p>':'')+'<div id="chMsgs">';
  let day="";L.forEach(m=>{const d=new Date(m.z).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"});if(d!==day){day=d;h+='<div class="chday">'+d+'</div>'}
    const mine=m.von===state.name;h+='<div class="bub'+(mine?' me':'')+'" data-id="'+E(m.id)+'">'+(!mine&&c==="*"?'<b>'+E(m.von)+'</b>':'')+E(m.t)+'<small>'+new Date(m.z).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})+'</small></div>'});
  if(!L.length)h+='<p class="note" style="text-align:center;margin:20px 0">Noch keine Nachrichten. Fang an! 💪</p>';
  h+='</div><div id="chIn"><textarea id="chTxt" maxlength="500" placeholder="Nachricht …"></textarea><button id="chSend">➤</button></div></div>';
  tc.innerHTML=h;const box=$("chMsgs"),ta=$("chTxt");ta.value=keep;if(atEnd)box.scrollTop=box.scrollHeight;
  const last=L.length?L[L.length-1].z:0;if(last>+ls(chKey(c),0))lsSet(chKey(c),last);chBadge();
  $("chBack").onclick=()=>{chConv=null;renderChat()};if($("chProf"))$("chProf").onclick=()=>openProfile(c);
  const send=()=>{const t=ta.value.trim();if(!t)return;ta.value="";const tmp={id:"tmp"+Date.now(),z:Date.now(),von:state.name,an:c,t};CHAT.m.push(tmp);renderChat();chAct({do:"send",to:c,t})};
  $("chSend").onclick=send;ta.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey&&window.innerWidth>700){e.preventDefault();send()}};
  box.querySelectorAll(".bub").forEach(b=>b.onclick=()=>{const m=L.find(x=>x.id===b.dataset.id);if(!m||/^tmp/.test(m.id))return;
    if(m.von===state.name||CHAT.adm)ask("Nachricht löschen?<br><span style=\"font-size:14px\">„"+E(m.t.slice(0,80))+"“</span>",()=>chAct({do:"del",id:m.id},()=>toast("Gelöscht")),null,"Löschen","Abbrechen");
    else ask("Nachricht von <b>"+E(m.von)+"</b> melden?<br><span style=\"font-size:14px\">Max schaut sie sich an.</span>",()=>chAct({do:"report",id:m.id},()=>toast("Gemeldet – danke")),null,"Melden","Abbrechen")})}
setInterval(()=>{if(document.visibilityState==="visible"&&chConv!==null&&$("tab-chat")&&$("tab-chat").style.display!=="none")ping()},8000);
window.renderChat=renderChat;
setTimeout(chatSync,3000);

// ---------- Einhängen ----------
{const _bs=backStep;backStep=function(){
  if($("modal")&&getComputedStyle($("modal")).display!=="none")return _bs();
  for(const [o,x] of [["shr","shrX"],["legal","legalX"]]){const el=$(o);if(el&&getComputedStyle(el).display!=="none"){if($(x))$(x).click();else el.style.display="none";return true}}
  return _bs()}}
{const _rm=renderMenu;renderMenu=function(){_rm.apply(this,arguments);try{renderWho();renderExtra();paintOnline()}catch(e){console.error(e)}};
 const _rr=renderRank;renderRank=function(){_rr.apply(this,arguments);try{trackRank();renderWho();renderExtra();renderRx();paintOnline();renderDuels()}catch(e){console.error(e)}}}
try{renderMenu()}catch(e){}
})();
