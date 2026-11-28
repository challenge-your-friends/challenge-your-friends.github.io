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
  if(b)b.style.display=doneCtx?"block":"none"}}
if($("bShare"))$("bShare").onclick=()=>{if(doneCtx)openShare(doneCtx.head,doneCtx.sub)};
if($("bShareRk"))$("bShareRk").onclick=()=>{if(!state.name){showLogin();return}openShare("Mein Stand 🏆","")};
if(typeof rrResult==="function"){const _r=rrResult;rrResult=function(){const X=typeof RR!=="undefined"&&RR?RR.x:null,v=typeof RR!=="undefined"&&RR?RR.v:0;
  _r.apply(this,arguments);
  try{if(X&&v&&$("rrP")&&$("rrP").textContent==="NEUER REKORD"&&$("rrB")&&!(RR&&RR.test)){const b=document.createElement("button");b.className="rrb sec";b.textContent="📤 Rekord teilen";b.style.marginTop="10px";
    b.onclick=()=>openShare("Neuer Rekord 👑",X.n+": "+fmtVL(X,v));$("rrB").appendChild(b)}}catch(e){}}}

// ---------- Gesundheitshinweis beim ersten Start ----------
function askHealth(){if(ls("hOk",0))return;
  if(!token||!state.name||running||["modal","help","login","sv","rr","rek","shr","legal"].some(i=>$(i)&&getComputedStyle($(i)).display!=="none")){setTimeout(askHealth,3000);return}
  ask("🩺 <b>Kurz zur Sicherheit</b><br><span style=\"font-size:14px;line-height:1.5;display:block;margin-top:8px;text-align:left\">CYF ist ein Spaß-Wettbewerb unter Freunden, kein medizinisches Programm. Du trainierst auf eigene Verantwortung.<br><br>• Bluthochdruck, Herzprobleme, Schwangerschaft, Verletzung oder unsicher? Vorher ärztlich abklären.<br>• Beim Halten weiteratmen – nie die Luft anhalten.<br>• Stechender Schmerz, Schwindel oder Druck auf der Brust: sofort aufhören.<br>• Krank? Pause machen. Punkte holst du wieder auf (🔁 Comeback-Mission).</span>",
   ()=>lsSet("hOk",1),()=>{},"Verstanden","Später")}
setTimeout(askHealth,2500);

// ---------- Datenschutz & Kontakt ----------
const LEGAL='<h2>Wer steckt dahinter?</h2><p>CYF – Challenge Your Friends ist ein privates, nicht kommerzielles Projekt von <b>Max Spitthoff</b> („Machermax“) für Freunde und Bekannte. Keine Werbung, kein Verkauf, kein Tracking.</p>'
 +'<p><b>Kontakt:</b> in der App unter „Mehr“ → „💬 Feedback &amp; Fragen“ oder direkt bei Max.</p>'
 +'<h2>Was wird gespeichert?</h2><ul><li><b>Benutzername</b> und <b>PIN</b> (die PIN nur verschlüsselt als Prüfwert, nicht lesbar)</li><li><b>E-Mail-Adresse</b> – nur wenn du sie einträgst, nur für Erinnerungen und Antworten auf dein Feedback</li><li><b>Trainingsdaten:</b> erledigte Tage, Challenges, Rekorde, Fitness-Test, Meilensteine, Extra-Sekunden</li><li><b>Angabe Frau/Mann</b> – nur für die faire Wertung</li><li><b>Krank / Pause</b> – nur ob und seit wann, kein Grund</li><li><b>Feedback und Umfragen</b>, die du abschickst</li></ul>'
 +'<h2>Was sehen die anderen?</h2><p>Alle Teilnehmenden sehen deinen Benutzernamen, Punkte, Serie, erledigte Tage, Challenges, Rekorde und ob du gerade pausierst. Die Rangliste ist nicht durch ein Passwort geschützt – wähl deshalb einen Benutzernamen, mit dem du dich wohlfühlst. Deine E-Mail-Adresse sieht nur Max als Betreiber, deine PIN niemand.</p>'
 +'<h2>Was bleibt nur auf deinem Handy?</h2><p>Alles unter „🔒 Meine Werte“ (Gewicht, Größe, Bauchumfang) sowie deine Einstellungen. Das wird nicht übertragen.</p>'
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

// ---------- Einhängen ----------
{const _bs=backStep;backStep=function(){
  if($("modal")&&getComputedStyle($("modal")).display!=="none")return _bs();
  for(const [o,x] of [["shr","shrX"],["legal","legalX"]]){const el=$(o);if(el&&getComputedStyle(el).display!=="none"){if($(x))$(x).click();else el.style.display="none";return true}}
  return _bs()}}
{const _rm=renderMenu;renderMenu=function(){_rm.apply(this,arguments);try{renderWho();renderExtra()}catch(e){console.error(e)}};
 const _rr=renderRank;renderRank=function(){_rr.apply(this,arguments);try{trackRank();renderWho();renderExtra()}catch(e){console.error(e)}}}
try{renderMenu()}catch(e){}
})();
