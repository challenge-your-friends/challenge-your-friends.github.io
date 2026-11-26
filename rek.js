// ---------- Neue Posen für Rekorde & Dehnen ----------
const RWALL=x=>'<rect x="'+x+'" y="4" width="8" height="96" rx="2" fill="#6b5a45" stroke="none"/>';
const RTXT=(x,y,t)=>'<text x="'+x+'" y="'+y+'" fill="var(--warn)" stroke="none" font-size="10" font-weight="700" text-anchor="middle">'+t+'</text>';
const RPOSE={
 // V-Sitz / Boot (auch Klappmesser)
 boat:{s:{h:[30,92],f:[0,-1],t:[42,96,96,97],a:[44,96,66,98,88,98],a2:[46,97,68,99,90,99],g:[96,97,126,97,158,97,162,91],g2:[96,97,124,98,156,98,160,92]},
       e:{h:[74,52],f:[.9,-.3],t:[80,62,100,96],a:[80,64,96,60,112,56],a2:[82,65,98,61,114,57],g:[100,96,120,74,140,52,145,46],g2:[100,96,118,75,138,53,143,47]}},
 // Superman: Bauchlage, Arme und Beine hoch
 superman:{s:{h:[156,92],f:[.3,.95],t:[142,96,92,97],a:[142,96,164,97,188,97],a2:[140,96,162,96,186,96],g:[92,97,62,97,34,97,30,99],g2:[92,97,60,98,32,98,28,99]},
           e:{h:[154,83],f:[.5,.85],t:[140,88,92,97],a:[140,87,163,80,186,73],a2:[138,88,161,81,184,74],g:[92,97,64,92,36,86,31,86],g2:[92,97,62,93,34,87,29,87]},d2:'<polyline points="176,58 176,46" stroke="var(--warn)" stroke-width="3"/><polyline points="40,70 40,58" stroke="var(--warn)" stroke-width="3"/>'},
 // Handstand mit dem Rücken zur Wand
 hstand:{d:RWALL(152),s:{h:[146,84],f:[-.2,1],t:[140,72,112,48],a:[140,72,140,86,140,99],a2:[137,73,137,86,137,99],g:[112,48,100,72,90,96,84,99],g2:[112,48,98,73,88,97,82,99]},
         e:{h:[136,80],f:[-1,0],t:[140,70,143,40],a:[140,70,140,85,140,99],a2:[137,71,137,85,137,99],g:[143,40,145,22,147,8,148,3],g2:[143,40,144,22,145,8,146,3]}},
 // Einbeinstand (Front), Augen zu
 balance:{fr:1,s:{h:[100,18],f:[0,0],t:[100,28,100,62],a:[100,34,90,48,88,62],a2:[100,34,110,48,112,62],g:[100,62,96,80,94,99],g2:[100,62,104,80,106,99]},
          e:{h:[100,18],f:[0,0],t:[100,28,100,62],a:[100,34,82,34,64,34],a2:[100,34,118,34,136,34],g:[98,62,92,70,92,86],g2:[101,62,103,80,103,99]},d2:RTXT(100,6,"Augen zu!")},
 // Knie-Liegestütz
 puk:{s:{h:[164,54],f:[.55,.83],t:[150,62,108,80],a:[150,62,151,80,152,99],a2:[146,63,147,81,148,99],g:[108,80,84,98,64,88,60,85],g2:[108,80,82,98,62,89,58,86]},
      e:{h:[166,76],f:[.6,.8],t:[151,84,108,92],a:[151,84,133,91,150,99],a2:[147,85,129,92,146,99],g:[108,92,84,98,64,88,60,85],g2:[108,92,82,98,62,89,58,86]}},
 // Sit-up
 situp:{s:{h:[34,90],f:[0,-1],t:[46,96,92,97],a:[46,96,54,88,50,92],a2:[48,97,56,89,52,93],g:[92,97,118,74,140,97,151,98],g2:[92,97,114,75,136,97,147,98]},
        e:{h:[78,45],f:[.95,.3],t:[81,56,92,97],a:[81,58,90,68,86,60],a2:[83,59,92,69,88,61],g:[92,97,118,74,140,97,151,98],g2:[92,97,114,75,136,97,147,98]}},
 // Rumänisches Kreuzheben (Getränkekiste / Rucksack)
 rdl:{s:{h:[100,14],f:[1,0],t:[100,24,100,58],a:[100,30,101,44,102,58],a2:[100,30,99,44,98,58],g:[100,58,102,78,103,98,114,99],g2:[100,58,98,78,97,98,108,99]},
      e:{h:[124,30],f:[1,.25],t:[115,38,86,58],a:[115,40,116,54,117,68],a2:[113,41,114,55,115,69],g:[86,58,95,78,99,98,110,99],g2:[86,58,93,78,96,98,107,99]},d2:'<rect x="104" y="68" width="26" height="16" rx="2" fill="none" stroke="var(--warn)" stroke-width="3"/>'},
 // Einbeiniges Kreuzheben
 rdl1:{s:{h:[100,14],f:[1,0],t:[100,24,100,58],a:[100,30,101,44,102,58],a2:[100,30,99,44,98,58],g:[100,58,102,78,103,98,114,99],g2:[100,58,98,78,97,98,108,99]},
       e:{h:[133,46],f:[1,.35],t:[122,50,90,58],a:[122,52,122,66,122,80],a2:[120,53,120,67,120,81],g:[90,58,97,78,99,98,110,99],g2:[90,58,68,55,46,52,42,56]}},
 // Das Dach brennt: Kniestand, Arme 90° -> V über dem Kopf
 dach:{fr:1,d:RTXT(150,96,"auf den Knien"),s:{h:[100,30],f:[0,0],t:[100,40,100,72],a:[100,46,78,46,78,26],a2:[100,46,122,46,122,26],g:[100,72,96,88,95,99],g2:[100,72,104,88,105,99]},
       e:{h:[100,30],f:[0,0],t:[100,40,100,72],a:[100,46,76,30,100,5],a2:[100,46,124,30,100,5],g:[100,72,96,88,95,99],g2:[100,72,104,88,105,99]},d2:RTXT(146,14,"Dach!")},
 // Hampelmann (Front)
 jj:{fr:1,s:{h:[100,18],f:[0,0],t:[100,28,100,62],a:[100,34,94,48,92,62],a2:[100,34,106,48,108,62],g:[100,62,97,80,96,99],g2:[100,62,103,80,104,99]},
     e:{h:[100,14],f:[0,0],t:[100,24,100,58],a:[100,30,86,16,80,4],a2:[100,30,114,16,120,4],g:[100,58,86,76,76,95],g2:[100,58,114,76,124,95]}},
 // Bergsteiger
 mc:{s:{h:[164,50],f:[.55,.83],t:[150,58,96,70],a:[150,58,151,78,152,99],a2:[146,59,147,79,148,99],g:[96,70,124,84,110,96,115,99],g2:[96,70,64,83,35,94,32,99]},
     e:{h:[164,50],f:[.55,.83],t:[150,58,96,70],a:[150,58,151,78,152,99],a2:[146,59,147,79,148,99],g:[96,70,66,82,37,93,34,99],g2:[96,70,122,85,108,97,113,99]}},
 // Burpee: Strecksprung -> Liegestützposition
 burpee:{s:{h:[100,10],f:[1,0],t:[100,20,100,54],a:[100,26,108,14,114,3],a2:[100,26,106,15,112,4],g:[100,54,102,74,103,92,113,96],g2:[100,54,98,74,97,92,107,96]},
         e:{h:[164,50],f:[.55,.83],t:[150,58,96,70],a:[150,58,151,78,152,99],a2:[146,59,147,79,148,99],g:[96,70,66,82,37,93,34,99],g2:[96,70,64,83,35,94,32,99]}},
 // --- Dehnen ---
 quad:{s:{h:[100,14],f:[1,0],t:[100,24,100,58],a:[100,30,101,44,102,58],a2:[100,30,99,44,98,58],g:[100,58,102,78,103,98,114,99],g2:[100,58,98,78,97,98,108,99]},
       e:{h:[100,14],f:[1,0],t:[100,24,100,58],a:[100,30,93,44,86,60],a2:[100,30,112,38,126,40],g:[100,58,99,80,84,64,80,60],g2:[100,58,101,78,101,98,112,99]}},
 ham:{s:{h:[62,48],f:[1,0],t:[60,60,60,96],a:[60,64,62,80,66,94],a2:[62,65,64,81,68,95],g:[60,96,92,97,124,97,128,90],g2:[60,96,90,98,122,98,126,91]},
      e:{h:[100,70],f:[.75,.65],t:[91,77,60,96],a:[91,78,108,86,124,90],a2:[93,79,110,87,126,91],g:[60,96,92,97,124,97,128,90],g2:[60,96,90,98,122,98,126,91]}},
 calfs:{d:RWALL(156),s:{h:[116,16],f:[1,0],t:[112,26,106,58],a:[112,32,132,38,154,40],a2:[112,32,130,40,152,42],g:[106,58,120,78,124,97,135,99],g2:[106,58,96,78,88,97,99,99]},
        e:{h:[130,22],f:[1,0],t:[124,32,112,62],a:[124,36,140,38,154,40],a2:[124,36,138,40,152,42],g:[112,62,130,76,130,97,141,99],g2:[112,62,96,80,80,97,91,99]}},
 child:{s:{h:[88,40],f:[1,0],t:[86,50,84,86],a:[86,54,88,70,92,84],a2:[88,55,90,71,94,85],g:[84,86,112,97,86,99,78,99],g2:[84,86,110,98,84,99,76,99]},
        e:{h:[138,92],f:[.4,.9],t:[126,90,84,86],a:[126,92,150,96,174,97],a2:[124,93,148,97,172,98],g:[84,86,112,97,86,99,78,99],g2:[84,86,110,98,84,99,76,99]}},
 cobra:{s:{h:[156,92],f:[.3,.95],t:[142,96,92,97],a:[142,96,130,94,146,99],a2:[140,96,128,95,144,99],g:[92,97,62,97,34,97,30,99],g2:[92,97,60,98,32,98,28,99]},
        e:{h:[148,56],f:[.9,-.35],t:[138,66,92,96],a:[138,66,140,82,142,99],a2:[136,67,138,83,140,99],g:[92,97,62,97,34,97,30,99],g2:[92,97,60,98,32,98,28,99]}},
 catcow:{s:{h:[154,54],f:[.9,-.4],t:[140,66,115,74,90,66],a:[140,66,140,82,140,99],a2:[136,67,136,83,137,99],g:[90,66,90,97,62,99],g2:[87,67,87,97,59,99]},
         e:{h:[150,76],f:[.4,.9],t:[140,66,115,50,90,66],a:[140,66,140,82,140,99],a2:[136,67,136,83,137,99],g:[90,66,90,97,62,99],g2:[87,67,87,97,59,99]}},
 pigeon:{s:{h:[104,44],f:[1,0],t:[102,54,100,88],a:[102,58,104,76,108,97],a2:[100,59,102,77,106,98],g:[100,88,124,96,104,99],g2:[100,90,70,97,40,98,36,99]},
         e:{h:[140,88],f:[.5,.85],t:[128,84,100,90],a:[128,86,152,94,176,97],a2:[126,87,150,95,174,98],g:[100,88,124,96,104,99],g2:[100,90,70,97,40,98,36,99]}},
 fly:{fr:1,s:{h:[100,44],f:[0,0],t:[100,54,100,90],a:[100,60,92,76,98,94],a2:[100,60,108,76,102,94],g:[98,90,74,76,98,97],g2:[102,90,126,76,102,97]},
      e:{h:[100,46],f:[0,0],t:[100,56,100,90],a:[100,62,92,78,98,94],a2:[100,62,108,78,102,94],g:[98,90,70,92,98,97],g2:[102,90,130,92,102,97]},d2:'<polyline points="66,74 66,86" stroke="var(--warn)" stroke-width="3"/><polyline points="134,74 134,86" stroke="var(--warn)" stroke-width="3"/>'},
 shoulder:{fr:1,s:{h:[100,18],f:[0,0],t:[100,28,100,62],a:[100,34,90,48,88,62],a2:[100,34,110,48,112,62],g:[100,62,96,80,94,99],g2:[100,62,104,80,106,99]},
           e:{h:[100,18],f:[0,0],t:[100,28,100,62],a:[100,36,118,38,136,38],a2:[100,36,90,50,112,40],g:[100,62,96,80,94,99],g2:[100,62,104,80,106,99]}},
 tri:{fr:1,s:{h:[100,18],f:[0,0],t:[100,28,100,62],a:[100,34,90,48,88,62],a2:[100,34,110,48,112,62],g:[100,62,96,80,94,99],g2:[100,62,104,80,106,99]},
      e:{h:[100,20],f:[0,0],t:[100,30,100,62],a:[100,34,110,6,102,24],a2:[100,34,86,22,108,7],g:[100,62,96,80,94,99],g2:[100,62,104,80,106,99]}},
 sides:{fr:1,s:{h:[100,18],f:[0,0],t:[100,28,100,62],a:[100,34,96,18,96,4],a2:[100,34,104,18,104,4],g:[100,62,96,80,94,99],g2:[100,62,104,80,106,99]},
        e:{h:[116,22],f:[0,0],t:[110,31,100,62],a:[110,36,120,20,132,10],a2:[110,36,116,18,128,6],g:[100,62,96,80,94,99],g2:[100,62,104,80,106,99]}},
 twist:{top:1,s:{h:[30,55],f:[0,0],t:[42,55,96,55],a:[44,55,46,35,48,16],a2:[44,55,46,75,48,94],g:[96,55,126,53,156,53,162,53],g2:[96,57,126,59,156,59,162,59]},
        e:{h:[30,55],f:[0,0],t:[42,55,96,55],a:[44,55,46,35,48,16],a2:[44,55,46,75,48,94],g:[96,55,126,53,156,53,162,53],g2:[96,57,116,80,140,86,146,86]}},
 deep:{s:{h:[100,14],f:[1,0],t:[100,24,100,58],a:[100,30,101,44,102,58],a2:[100,30,99,44,98,58],g:[100,58,102,78,103,98,114,99],g2:[100,58,98,78,97,98,108,99]},
       e:{h:[110,44],f:[1,0],t:[106,54,94,86],a:[106,58,118,72,112,62],a2:[104,59,116,73,110,63],g:[94,86,118,72,104,98,115,99],g2:[94,86,114,74,100,98,111,99]}}
};
Object.assign(POSE,RPOSE);
// ---------- Katalog: Rekorde & Dehnen (freiwillig, keine Punkte) ----------
// m: h = Halten (Zeit), r = Wiederholungen am Stück, r60 = Wiederholungen in 60 s, s = Dehnen
// p = Pose, st = Abzeichen-Stufe (alle st Sekunden/Wiederholungen ein neues Abzeichen)
const LIB=[
 // --- Halten ---
 {id:"plank",m:"h",p:"plank",n:"Plank",c:"Unterarme unter den Schultern, Körper eine Linie, Bauch und Po fest.",so:["Unterarme schulterbreit auf den Boden, Ellbogen unter den Schultern.","Beine lang, Zehen aufstellen, Körper eine Linie von Kopf bis Ferse.","Bauch und Po fest – halten, solange die Linie sauber bleibt."],tip:"Wenn die Hüfte durchhängt, ist der Versuch vorbei. Sauber schlägt lang."},
 {id:"push",m:"h",p:"push",n:"Liegestütz unten halten",c:"Brust eine Faust über dem Boden, Ellbogen eng. Boden aktiv wegdrücken.",so:["Liegestützposition, Hände etwas breiter als die Schultern.","Absenken, bis die Brust eine Faust über dem Boden ist.","Dort halten – nicht ablegen."],tip:"Auf den Knien zählt als eigene Variante – sag's ehrlich dazu."},
 {id:"wallsit",m:"h",p:"wallsit",n:"Wandsitzen",c:"Rücken an die Wand, Oberschenkel waagerecht, Knie über den Füßen.",so:["Rücken an die Wand, Füße etwa einen Schritt vor der Wand.","Runterrutschen, bis die Oberschenkel waagerecht sind.","Hände nicht auf die Oberschenkel stützen."],tip:"Klassiker für die Beine. Brennt ab Minute zwei richtig."},
 {id:"hollow",m:"h",p:"hollow",n:"Hollow Body",c:"Unteren Rücken in den Boden drücken, Schultern und gestreckte Beine leicht anheben.",so:["Rückenlage, Arme nach hinten lang oder neben den Körper.","Unteren Rücken fest in den Boden drücken.","Schultern und gestreckte Beine knapp über den Boden heben."],tip:"Sobald der untere Rücken abhebt, ist Schluss."},
 {id:"side",m:"h",p:"side",n:"Seitstütz",c:"Ellbogen unter der Schulter, Hüfte hoch, Körper eine Linie.",so:["Seitlage, Ellbogen genau unter der Schulter.","Hüfte hochschieben, Körper eine Linie.","Zählt die schwächere Seite – also beide testen."],tip:"Rekord gilt für die schwächere Seite. Fair ist fair."},
 {id:"bridge",m:"h",p:"bridge",n:"Glute Bridge",c:"Po hoch und fest anspannen, kein Hohlkreuz.",so:["Rückenlage, Füße hüftbreit aufstellen.","Po hochdrücken, bis Knie, Hüfte und Schultern eine Linie sind.","Po fest anspannen und halten."],tip:"Fersen in den Boden drücken – dann arbeitet der Po statt der Rücken."},
 {id:"bridge1",m:"h",p:"bridge1",n:"Einbeinige Bridge",c:"Po hoch, ein Bein gestreckt in der Luft, Hüfte gerade.",so:["Wie die Glute Bridge, dann ein Bein lang strecken.","Hüfte bleibt gerade, kippt nicht ab.","Zählt die schwächere Seite."],tip:"Die ehrliche Variante: zeigt schnell, welche Seite schwächer ist."},
 {id:"squat",m:"h",p:"squat",n:"Kniebeuge halten",c:"Po nach hinten unten, Oberschenkel waagerecht, Brust hoch.",so:["Füße schulterbreit.","Runter, bis die Oberschenkel waagerecht sind.","Arme nach vorne, Brust hoch, halten."],tip:"Wie Wandsitzen – nur ohne Wand. Deutlich fieser."},
 {id:"split",m:"h",p:"split",n:"Ausfallschritt halten",c:"Hinteres Knie knapp über dem Boden, Oberkörper aufrecht.",so:["Großer Schritt nach vorne.","Absenken, bis das hintere Knie knapp über dem Boden schwebt.","Halten. Zählt die schwächere Seite."],tip:"Vorderes Knie bleibt über dem Fuß."},
 {id:"yhold",m:"h",p:"yhold",n:"Y-Halten",c:"Bauchlage, Arme als Y, Daumen hoch, Arme und Brust leicht anheben.",so:["Bauchlage, Arme schräg nach vorne als Y.","Daumen zeigen nach oben.","Arme und Brust leicht anheben, Blick zum Boden."],tip:"Gold für die Haltung nach einem Tag am Schreibtisch."},
 {id:"table",m:"h",p:"table",n:"Reverse Plank",c:"Rückenlage auf den Unterarmen, Po hoch, Körper eine Linie.",so:["Sitzen, Beine lang, Unterarme hinter dem Körper aufstützen.","Po hochdrücken, bis der Körper eine Linie ist.","Bauch zur Decke, halten."],tip:"Die Rückseite vom Plank – trainiert Rücken, Po und Schultern."},
 {id:"dips",m:"h",p:"dips",n:"Stuhl-Dips halten",c:"Hände auf die Stuhlkante, runter auf 90 Grad, halten.",so:["Stabilen Stuhl an die Wand stellen.","Hände auf die Kante, Po vor den Stuhl.","Runter, bis die Ellbogen 90° haben – dort halten."],tip:"Nur mit stabilem Stuhl ohne Rollen!",need:"🪑 stabiler Stuhl"},
 {id:"pike",m:"h",p:"pike",n:"Pike halten",c:"Umgedrehtes V, Kopf zwischen den Armen, Schultern wegdrücken.",so:["Hände und Füße am Boden.","Po hoch wie ein umgedrehtes V.","Schultern aktiv vom Boden wegdrücken."],tip:"Vorstufe zum Handstand."},
 {id:"curl",m:"h",p:"curl",n:"Bizeps-Halten (Handtuch)",c:"Auf das Handtuch stellen, Ellbogen 90 Grad, mit voller Kraft hochziehen.",so:["Mittig auf ein Handtuch stellen, Enden greifen.","Ellbogen am Körper, Unterarme waagerecht.","Mit voller Kraft nach oben ziehen und halten."],tip:"Bizeps flexen im Club – wird vorbereitet.",need:"Handtuch"},
 {id:"calf",m:"h",p:"calf",n:"Zehenstand",c:"Hände an die Wand, ganz hoch auf die Zehenspitzen, oben halten.",so:["Hände leicht an die Wand.","Ganz hoch auf die Zehenspitzen.","Oben halten, Fersen nicht absinken lassen."],tip:"Einbeinig wird's richtig hart."},
 {id:"boat",m:"h",p:"boat",n:"V-Sitz (Boot)",c:"Auf dem Po balancieren, Beine und Oberkörper hoch, Arme nach vorne.",so:["Hinsetzen, Knie gebeugt.","Oberkörper leicht zurück, Füße vom Boden heben.","Beine so weit strecken, wie es geht. Rücken gerade, Arme nach vorne."],tip:"Leichter: Knie angewinkelt lassen. Zählt trotzdem – Hauptsache Füße oben."},
 {id:"superman",m:"h",p:"superman",n:"Superman",c:"Bauchlage, Arme und Beine gestreckt anheben und halten.",so:["Bauchlage, Arme lang nach vorne.","Arme, Brust und Beine gleichzeitig leicht anheben.","Blick zum Boden, halten."],tip:"Fliegen lernen in Bauchlage."},
 {id:"hstand",m:"h",p:"hstand",n:"Handstand an der Wand",c:"Hände schulterbreit vor die Wand, Beine hoch, Arme durchgestreckt.",so:["Hände schulterbreit ca. 20 cm vor die Wand.","Ein Bein hochschwingen, das andere folgt – Fersen an die Wand.","Arme durchstrecken, Bauch fest, halten."],tip:"Nur mit freiem Platz und gesunden Schultern. Unsicher? Erst Pike halten üben.",need:"Wand"},
 {id:"balance",m:"h",p:"balance",n:"Einbeinstand – Augen zu",c:"Auf einem Bein stehen, Arme zur Seite, Augen zu. Zeit läuft, bis der Fuß aufsetzt.",so:["Auf ein Bein stellen, Arme zur Seite.","Augen schließen.","Wenn der zweite Fuß den Boden berührt: Stopp."],tip:"Klingt leicht. Ist es nicht. Platz rundherum frei machen."},
 // --- Wiederholungen am Stück ---
 {id:"pu",m:"r",p:"push",n:"Liegestütze",st:10,c:"Brust bis eine Faust über den Boden, ganz hoch drücken. Zählen, bis nichts mehr geht.",so:["Hände etwas breiter als die Schultern, Körper eine Linie.","Runter, bis die Brust eine Faust über dem Boden ist.","Ganz hoch drücken. Nur saubere Wiederholungen zählen."],tip:"Hüfte durchhängen = zählt nicht."},
 {id:"puk",m:"r",p:"puk",n:"Knie-Liegestütze",st:10,c:"Auf den Knien, Körper eine Linie von Knie bis Kopf. Runter und hoch.",so:["Knie am Boden, Hände etwas breiter als die Schultern.","Körper von Knie bis Kopf eine Linie.","Runter bis kurz über den Boden, ganz hoch drücken."],tip:"Perfekt, um auf die ersten richtigen Liegestütze hinzuarbeiten."},
 {id:"sq",m:"r",p:"squat",n:"Kniebeugen",st:10,c:"Runter bis die Oberschenkel waagerecht sind, ganz hoch. Zählen.",so:["Füße schulterbreit.","Runter, bis die Oberschenkel waagerecht sind.","Ganz hochkommen. Fersen bleiben am Boden."],tip:"Halbe Kniebeugen zählen halb – also gar nicht. 😉"},
 {id:"lunge",m:"r",p:"split",n:"Ausfallschritte",st:10,c:"Abwechselnd links und rechts, hinteres Knie knapp über den Boden. Jeder Schritt zählt.",so:["Großer Schritt nach vorne.","Hinteres Knie knapp über den Boden.","Zurück und Seite wechseln. Jeder Schritt zählt eins."],tip:"Oberkörper bleibt aufrecht."},
 {id:"situp",m:"r",p:"situp",n:"Sit-ups",st:10,c:"Füße aufgestellt, Arme vor der Brust gekreuzt, ganz hoch und wieder ablegen.",so:["Rückenlage, Füße aufstellen (gerne unters Sofa klemmen).","Arme vor der Brust kreuzen.","Ganz hochkommen und wieder ablegen."],tip:"Nicht am Kopf ziehen – Hände bleiben an der Brust."},
 {id:"vup",m:"r",p:"boat",n:"Klappmesser (V-Ups)",st:5,c:"Aus der Rückenlage Arme und Beine gleichzeitig zum V hochklappen.",so:["Rückenlage, Arme lang nach hinten.","Arme und gestreckte Beine gleichzeitig hochklappen.","Hände Richtung Füße, wieder ablegen."],tip:"Sixpack-Fabrik. Wirklich."},
 {id:"rdl",m:"r",p:"rdl",n:"Kreuzheben mit Getränkekiste",st:10,c:"Kiste mit gestreckten Armen halten, Hüfte nach hinten schieben, Rücken gerade.",so:["Volle Getränkekiste (oder schwerer Rucksack) mit gestreckten Armen vor dem Körper.","Knie leicht gebeugt, Hüfte nach hinten schieben, Oberkörper nach vorne – Rücken bleibt gerade.","Mit dem Po wieder hochdrücken."],tip:"Rumänisches Kreuzheben, Sauerländer Edition. Rundrücken = sofort Schluss.",need:"Getränkekiste oder Rucksack"},
 {id:"rdl1",m:"r",p:"rdl1",n:"Einbeiniges Kreuzheben",st:5,c:"Auf einem Bein, Oberkörper nach vorne, hinteres Bein lang nach hinten.",so:["Auf ein Bein stellen, Knie leicht gebeugt.","Oberkörper nach vorne kippen, das freie Bein lang nach hinten.","Wieder aufrichten. Zählt die schwächere Seite."],tip:"Balance + Po + hinterer Oberschenkel in einem."},
 {id:"dipsr",m:"r",p:"dips",n:"Stuhl-Dips",st:10,c:"Hände auf die Stuhlkante, runter auf 90 Grad, ganz hoch drücken.",so:["Stabilen Stuhl an die Wand.","Runter, bis die Ellbogen 90° haben.","Ganz hochdrücken."],tip:"Nur mit stabilem Stuhl ohne Rollen.",need:"🪑 stabiler Stuhl"},
 {id:"brg",m:"r",p:"bridge",n:"Hüftheben",st:10,c:"Po hoch bis zur Linie, oben kurz anspannen, ablegen.",so:["Rückenlage, Füße aufstellen.","Po hoch, oben kurz fest anspannen.","Ablegen und wieder hoch."],tip:"Einbeinig doppelt so viel Spaß."},
 {id:"calfr",m:"r",p:"calf",n:"Wadenheben",st:10,c:"Ganz hoch auf die Zehenspitzen, ganz runter.",so:["Hände leicht an die Wand.","Ganz hoch auf die Zehenspitzen.","Langsam ganz runter. Wiederholen."],tip:"Auf einer Treppenstufe noch effektiver."},
 {id:"supr",m:"r",p:"superman",n:"Superman-Heben",st:10,c:"Bauchlage, Arme und Beine anheben, kurz halten, ablegen.",so:["Bauchlage, Arme lang nach vorne.","Arme und Beine anheben, 1 Sekunde halten.","Ablegen, wiederholen."],tip:"Rücken stark, Haltung top."},
 {id:"dach",m:"r",p:"dach",n:"Das Dach brennt",u:"st",st:1,c:"Stufe für Stufe: n Liegestütze auf den Knien, dann 4 mal n Dächer. Hoch bis nichts mehr geht.",so:["Stufe 1: 1 Liegestütz (auf den Knien), dann im Kniestand 4 Dächer.","Dach = Arme 90° angewinkelt, Oberarme waagerecht – dann V-förmig hoch, Hände über dem Kopf zusammen.","Stufe 2: 2 Liegestütze + 8 Dächer, Stufe 3: 3 + 12 … Rekord = höchste komplett geschaffte Stufe."],tip:"Direkt aus dem Mannschaftstraining. Ab Stufe 6 brennt das Dach wirklich."},
 // --- In 60 Sekunden ---
 {id:"jj",m:"r60",p:"jj",n:"Hampelmann",st:10,c:"60 Sekunden so viele Hampelmänner wie möglich. Mitzählen!",so:["Beine zusammen, Arme unten.","Springen: Beine auseinander, Arme über den Kopf.","Zurück. Jeder komplette Hampelmann zählt."],tip:"Nachbarn unten? Dann auf dem Teppich."},
 {id:"mc",m:"r60",p:"mc",n:"Bergsteiger",st:10,c:"Hohe Liegestützposition, Knie abwechselnd zur Brust. Jedes Knie zählt.",so:["Hohe Liegestützposition, Hände unter den Schultern.","Abwechselnd die Knie zur Brust ziehen.","Jedes Knie zählt eins. Hüfte bleibt unten."],tip:"Puls auf 180 in 60 Sekunden."},
 {id:"burpee",m:"r60",p:"burpee",n:"Burpees",st:5,c:"Runter in den Liegestütz, Beine ran, Strecksprung. 60 Sekunden.",so:["Hände auf den Boden, Beine nach hinten in den Liegestütz.","Beine wieder ran.","Strecksprung mit Händen über dem Kopf. Zählt eins."],tip:"Der meistgehasste Sport der Welt. Zu Recht."},
 {id:"sqj",m:"r60",p:"squat",n:"Strecksprung-Kniebeugen",st:10,c:"Kniebeuge, explosiv hochspringen, weich landen. 60 Sekunden.",so:["Kniebeuge bis die Oberschenkel waagerecht sind.","Explosiv hochspringen.","Weich landen und direkt in die nächste Kniebeuge."],tip:"Weich landen schont die Knie."},
 // --- Dehnen ---
 {id:"catcow",m:"s",p:"catcow",n:"Katze-Kuh",sec:40,c:"Vierfüßlerstand. Langsam abwechselnd Rücken rund machen und durchhängen lassen.",so:["Vierfüßlerstand, Hände unter den Schultern.","Einatmen: Bauch sinkt, Blick nach vorne (Kuh).","Ausatmen: Rücken rund, Kinn zur Brust (Katze). Langsam im Wechsel."],tip:"Perfekt morgens oder nach langem Sitzen."},
 {id:"child",m:"s",p:"child",n:"Kindhaltung",sec:40,c:"Auf die Fersen setzen, Oberkörper nach vorne ablegen, Arme lang.",so:["Knien, Po auf die Fersen.","Oberkörper nach vorne ablegen, Stirn auf den Boden.","Arme lang nach vorne, ruhig atmen."],tip:"Entspannt Rücken und Schultern."},
 {id:"cobra",m:"s",p:"cobra",n:"Kobra",sec:30,c:"Bauchlage, Hände unter die Schultern, Brust sanft hochdrücken, Hüfte bleibt unten.",so:["Bauchlage, Hände neben die Schultern.","Brust langsam hochdrücken, Hüfte bleibt am Boden.","Schultern weg von den Ohren, ruhig atmen."],tip:"Nur so hoch, wie es angenehm ist."},
 {id:"pigeon",m:"s",p:"pigeon",n:"Taube",sec:40,sd:1,c:"Vorderes Bein angewinkelt vor dem Körper, hinteres lang nach hinten, Oberkörper sinkt nach vorne.",so:["Aus dem Vierfüßler ein Knie nach vorne hinter die Hand legen, Fuß Richtung andere Hand.","Hinteres Bein lang nach hinten.","Oberkörper langsam nach vorne sinken lassen."],tip:"Die beste Dehnung für den Po – und für alle, die viel sitzen."},
 {id:"hip",m:"s",p:"hip",n:"Hüftbeuger",sec:40,sd:1,ex:["hipL","hipR"],c:"Halbkniestand, Po anspannen, Hüfte leicht nach vorne schieben.",so:["Halbkniestand, ein Knie am Boden.","Po anspannen.","Hüfte leicht nach vorne schieben, Oberkörper aufrecht."],tip:"Gegenmittel Nummer 1 fürs Sitzen."},
 {id:"quad",m:"s",p:"quad",n:"Oberschenkel vorne",sec:30,sd:1,c:"Auf einem Bein stehen, Ferse zum Po ziehen, Knie zeigt nach unten.",so:["Auf ein Bein stellen, ggf. an der Wand festhalten.","Fuß greifen und die Ferse zum Po ziehen.","Knie zeigt nach unten, Po leicht anspannen."],tip:"Knie bleiben nebeneinander."},
 {id:"ham",m:"s",p:"ham",n:"Oberschenkel hinten",sec:40,c:"Sitzen, Beine lang, mit geradem Rücken nach vorne Richtung Füße.",so:["Sitzen, Beine lang nach vorne.","Rücken gerade, aus der Hüfte nach vorne beugen.","Hände Richtung Füße – nicht wippen."],tip:"Lieber gerader Rücken als Hände an den Zehen."},
 {id:"calfs",m:"s",p:"calfs",n:"Waden",sec:30,sd:1,c:"Hände an die Wand, hinteres Bein gestreckt, Ferse bleibt am Boden.",so:["Hände an die Wand, ein Bein nach hinten.","Hinteres Bein gestreckt, Ferse am Boden.","Hüfte nach vorne schieben."],tip:"Gut nach Hampelmann und Sprüngen."},
 {id:"fly",m:"s",p:"fly",n:"Schmetterling",sec:40,c:"Sitzen, Fußsohlen zusammen, Knie sanft Richtung Boden sinken lassen.",so:["Sitzen, Fußsohlen aneinander.","Füße mit den Händen halten.","Knie langsam Richtung Boden sinken lassen."],tip:"Nicht mit den Ellbogen runterdrücken."},
 {id:"twist",m:"s",p:"twist",n:"Liegende Drehung",sec:30,sd:1,c:"Rückenlage, Arme zur Seite, ein Knie über den Körper zur anderen Seite ablegen.",so:["Rückenlage, Arme seitlich als T.","Ein Knie anwinkeln und zur anderen Seite ablegen.","Beide Schultern bleiben am Boden."],tip:"Löst den unteren Rücken."},
 {id:"shoulder",m:"s",p:"shoulder",n:"Schulter",sec:30,sd:1,c:"Einen Arm vor der Brust zur anderen Seite ziehen.",so:["Einen Arm gestreckt vor die Brust.","Mit der anderen Hand am Oberarm heranziehen.","Schulter bleibt unten."],tip:"Gut nach Liegestützen und Handtuch-Übungen."},
 {id:"tri",m:"s",p:"tri",n:"Trizeps",sec:30,sd:1,c:"Einen Arm hinter den Kopf, mit der anderen Hand den Ellbogen sanft ziehen.",so:["Einen Arm hoch, Hand hinter den Kopf zwischen die Schulterblätter.","Mit der anderen Hand den Ellbogen sanft ziehen.","Kopf bleibt aufrecht."],tip:"Nach Dips Pflicht."},
 {id:"sides",m:"s",p:"sides",n:"Seitdehnung",sec:25,sd:1,c:"Beide Arme hoch, Oberkörper zur Seite neigen.",so:["Aufrecht stehen, Arme über den Kopf.","Oberkörper zur Seite neigen.","Nicht nach vorne kippen."],tip:"Atmen in die gedehnte Seite."},
 {id:"deep",m:"s",p:"deep",n:"Tiefe Hocke",sec:40,c:"Füße schulterbreit, ganz tief in die Hocke, Ellbogen drücken die Knie auseinander.",so:["Füße etwas breiter als die Schultern.","Ganz tief in die Hocke, Fersen bleiben möglichst am Boden.","Hände zusammen, Ellbogen drücken die Knie auseinander."],tip:"Fersen heben ab? Ein Buch drunter ist okay."}
];
const LIBK={};LIB.forEach(x=>LIBK[x.id]=x);
const RK_MODE={h:"⏱ Halten",r:"🔁 Am Stück",r60:"⚡ 60 Sekunden",s:"🧘 Dehnen"};
const MED=["🥉","🥈","🥇","💎","🏆","👑","🦾","🚀","🌋","🐐"];
const RT0="2026-12-27",TEST=[{id:"pu",alt:"puk"},{id:"plank"},{id:"wallsit"},{id:"hollow"}];
// Dehnübungen für den Ablauf (Sprachansage, Skizze) anmelden
LIB.filter(x=>x.m==="s"&&!x.ex).forEach(x=>{
  const reg=(k,suf,sv)=>{EX[k]={n:x.n+(suf?" – "+suf:""),c:x.c,hold:false,lib:1};SKMAP[k]=x.p;TXT["n_"+k]=x.n+(sv?", "+sv:"")+".";TXT["c_"+k]=x.c};
  if(x.sd){reg(x.id+"L","linke Seite","linke Seite");reg(x.id+"R","rechte Seite","Seitenwechsel")}else reg(x.id)});
const stretchSteps=(x,sec)=>{sec=sec||x.sec;const ks=x.ex||(x.sd?[x.id+"L",x.id+"R"]:[x.id]);return ks.map((k,i)=>[k,sec,i<ks.length-1?5:0])};
const ROUT=[{n:"Kurz-Dehnen",d:"Rücken, Hüfte, Beine, Schultern",l:["catcow","child","hip","ham","quad","shoulder"],sec:30},
 {n:"Komplett-Dehnen",d:"einmal alles von Kopf bis Fuß",l:["catcow","child","cobra","pigeon","hip","quad","ham","calfs","fly","twist","shoulder","tri","sides","deep"],sec:0}];

// ---------- Speicher ----------
const RX=v=>Math.max(0,Math.min(99999,Math.round(+v||0)));
function recMerge(a,b){const o=Object.assign({},a||{});Object.keys(b||{}).forEach(k=>{const x=o[k],y=b[k];if(!x){o[k]=y;return}if(!y)return;
  const f=(x.fd||"9")<=(y.fd||"9")?x:y,bb=(x.b||0)>=(y.b||0)?x:y,hm={};[...(x.h||[]),...(y.h||[])].forEach(h=>hm[h[0]+"|"+h[1]]=h);
  o[k]={b:bb.b,bd:bb.bd,f:f.f,fd:f.fd,n:Math.max(x.n||0,y.n||0),t:Math.max(x.t||0,y.t||0),h:Object.values(hm).sort((p,q)=>p[0]<q[0]?-1:1).slice(-8)}});return o}
function tstMerge(a,b){const o=Object.assign({},a||{});Object.keys(b||{}).forEach(k=>{o[k]=Object.assign({},b[k]||{},o[k]||{})});return o}
function myRec(){state.ch=state.ch||{};const m=recMerge(ls("rek",{}),state.ch.rec);state.ch.rec=m;return m}
function myTst(){state.ch=state.ch||{};const m=tstMerge(ls("rekT",{}),state.ch.tst);state.ch.tst=m;return m}
function rekSave(){lsSet("rek",state.ch.rec||{});lsSet("rekT",state.ch.tst||{});save()}
const fmtV=(x,v)=>x.m==="h"?fmtS(v):v+(x.u==="st"?"":" ×");
const fmtVL=(x,v)=>x.m==="h"?fmtS(v):x.u==="st"?"Stufe "+v:v+" Wdh.";
function fmtS(s){s=RX(s);return s<60?s+" s":Math.floor(s/60)+":"+String(s%60).padStart(2,"0")+" min"}
const stp=x=>x.m==="h"?30:(x.st||10);
const tier=(x,v)=>Math.floor((v||0)/stp(x));
const badge=(x,n)=>n>0?MED[Math.min(n-1,MED.length-1)]+" "+(x.m==="h"?(n*30)+" s":x.u==="st"?"Stufe "+n:(n*stp(x))+"×"):"";
function badgeCount(rec){let n=0;Object.keys(rec||{}).forEach(k=>{if(LIBK[k])n+=tier(LIBK[k],rec[k].b)});return n}
function pct(a,b){return a>0?Math.round((b-a)/a*100):null}

// ---------- Gruppe ----------
function people(){return others.filter(u=>u.name!==state.name).concat(state.name?[{name:state.name,start:state.start,days:state.days,ch:state.ch,me:true}]:[])}
function crowns(){const best={};people().forEach(u=>{const r=(u.ch&&u.ch.rec)||{};Object.keys(r).forEach(k=>{const v=r[k].b||0;if(!v||!LIBK[k])return;if(!best[k]||v>best[k].v)best[k]={v,names:[u.name]};else if(v===best[k].v)best[k].names.push(u.name)})});return best}

// ---------- Zeit unter Spannung ----------
const WSEC={};["A","B","K"].forEach(w=>WSEC[w]=W[w].s.reduce((a,x)=>a+x[1],0));
const CHS=c=>c?c.sec*c.sets*(Array.isArray(c.ex)?c.ex.length:1):0;
function tut(u,from){const days=u.days||{},ch=u.ch||{},st=u.start||START;let s=0;
  Object.keys(days).forEach(k=>{const d=days[k];if(!d||!d.done||k<st||(from&&k<from))return;const w=planFor(k)||"K";s+=Math.round(WSEC[w]*(d.e?.72:1))});
  Object.keys(ch).forEach(k=>{const c=ch[k];if(!c||c.failed||!c.at||(from&&c.at<from))return;const p=k.slice(0,2);
    if(p==="e:")s+=120;else if(p==="d:")s+=CHS(DAILY.find(x=>x.n===c.n));else if(k.slice(0,3)==="wd:")s+=CHS(weeklyFor(weekKey(k.slice(3))))});
  const r=ch.rec||{};if(!from)Object.keys(r).forEach(k=>s+=r[k].t||0);
  return s}
const fmtH=s=>{s=Math.round(s/60);return s<60?s+" Min.":Math.floor(s/60)+":"+String(s%60).padStart(2,"0")+" Std."};

// ---------- Oberfläche ----------
document.head.insertAdjacentHTML("beforeend",'<style>'+
 '#rek,#rekd,#rr{display:none;position:fixed;inset:0;background:var(--bg);overflow:auto;padding:20px;z-index:9}#rekd{z-index:10}#rr{z-index:11;text-align:center}'+
 '.rkl{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rkl>div{background:var(--card);border-radius:12px;padding:8px;text-align:center;font-size:13px;cursor:pointer;position:relative}'+
 '.rkl b{display:block;font-size:14px}.rkl small{display:block;color:var(--mut);font-size:12px;margin-top:2px}.rkl .cr{position:absolute;top:6px;right:8px;font-size:16px}'+
 '.rkt{display:flex;gap:6px;overflow-x:auto;margin:0 0 12px;padding-bottom:4px}.rkt .chip{white-space:nowrap;font-size:14px;padding:7px 12px}'+
 '.bdg{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.bdg span{background:#22262e;border-radius:16px;padding:5px 10px;font-size:13px}.bdg span.off{opacity:.35}'+
 '#rrT{font-size:96px;font-weight:800;font-variant-numeric:tabular-nums;line-height:1;margin:14px 0 6px}#rrP{font-size:16px;letter-spacing:2px;font-weight:700;color:var(--warn)}'+
 '#rr.go #rrP{color:var(--acc)}#rrN{font-size:26px;font-weight:800;margin:8px 0 4px}#rrC{color:var(--mut);font-size:15px;min-height:40px;padding:0 6px}#rrI{color:var(--warn);font-size:15px;min-height:22px;margin:4px 0 12px}'+
 '.rrb{width:100%;padding:18px;border:0;border-radius:14px;font-size:19px;font-weight:800;cursor:pointer;background:var(--acc);color:#000;margin-bottom:10px}.rrb.sec{background:#2a2e37;color:var(--fg);font-size:16px;padding:13px}'+
 '.cnt{display:flex;align-items:center;justify-content:center;gap:12px;margin:10px 0 16px}.cnt button{width:64px;height:64px;border-radius:50%;border:0;background:#2a2e37;color:#fff;font-size:30px;font-weight:800;cursor:pointer}.cnt input{width:120px;text-align:center;font-size:44px;font-weight:800;background:#0f1115;color:#fff;border:1px solid #333;border-radius:12px;padding:6px}'+
 '.tst{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #2a2e37;font-size:15px}.tst:last-child{border:0}.tst small{color:var(--mut)}'+
 '.tutb{display:flex;gap:8px}.tutb div{flex:1;background:#22262e;border-radius:10px;padding:8px;text-align:center}.tutb b{display:block;font-size:18px}.tutb span{font-size:11px;color:var(--mut)}'+
'</style>');
document.body.insertAdjacentHTML("beforeend",
 '<div id="rek"><div style="max-width:480px;margin:0 auto"><div class="row" style="justify-content:space-between"><h1>🏆 Rekorde &amp; Dehnen</h1><button class="chip" id="rekX">Schließen ✕</button></div>'+
 '<p class="sub" id="rekSub" style="margin-bottom:10px"></p><div class="rkt" id="rekTabs"></div><div id="rekBody"></div></div></div>'+
 '<div id="rekd"><div style="max-width:480px;margin:0 auto"><div class="row" style="justify-content:space-between"><span class="note" id="rekdM"></span><button class="chip" id="rekdX">Zurück ✕</button></div><div id="rekdB"></div></div></div>'+
 '<div id="rr"><div style="max-width:480px;margin:0 auto"><div id="rrP"></div><div id="rrN"></div><svg id="rrSk" class="sk" viewBox="0 0 200 110"></svg><div id="rrC"></div><div id="rrT">0</div><div id="rrI"></div><div id="rrB"></div></div></div>');
// Einstieg unter den Workouts
(function(){const n=$("lvl")&&$("lvl").nextElementSibling;if(n)n.insertAdjacentHTML("afterend",'<button class="wbtn" id="bRek" style="padding:12px 16px"><b style="font-size:16px;margin:0">🏆 Rekorde &amp; Dehnen <span style="font-size:12px;color:var(--mut);font-weight:400">· freiwillig</span></b><span id="bRekS"></span></button><div id="tstBox"></div>');
  const c=$("cal")&&$("cal").closest(".card");if(c)c.insertAdjacentHTML("afterend",'<div class="card" id="tutBox"></div>');
  $("tab-rank").insertAdjacentHTML("beforeend",'<div class="card" id="rkTut"></div><div class="card" id="rkRec"></div><div class="card" id="rkTst" style="display:none"></div>');
  const h=[...document.querySelectorAll("#help h2")].find(x=>/Steigern/.test(x.textContent));
  if(h&&h.nextElementSibling)h.nextElementSibling.insertAdjacentHTML("afterend",'<h2>7. Rekorde &amp; Dehnen (freiwillig)</h2><ul><li>Unter dem Workout: <b>„🏆 Rekorde &amp; Dehnen“</b>. Über '+LIB.length+' Übungen mit Skizze – Halten auf Zeit, Wiederholungen am Stück, 60-Sekunden-Sprints und Dehnen.</li><li><b>Rekordversuch</b> jederzeit, so oft du willst. Gibt keine Punkte, nur Abzeichen: beim Halten alle 30 s (30 · 60 · 90 · 120 …), bei Wiederholungen alle 5 oder 10.</li><li>Dein erster Versuch bleibt gespeichert – so siehst du, wie viel du zugelegt hast. Wer in der Gruppe vorne liegt, bekommt die 👑.</li><li><b>Fitness-Test:</b> Liegestütze, Plank, Wandsitzen, Hollow Body – einmal zum Start, einmal ab 27.12. Im Ranking zählt nur, um wie viel Prozent du dich verbessert hast.</li><li><b>Dehnen:</b> einzeln oder als Ablauf mit Ansage – zählt nicht, tut aber gut.</li></ul>')})();
$("bRek").onclick=()=>rekOpen("h");$("rekX").onclick=()=>{$("rek").style.display="none"};
$("rekdX").onclick=()=>{$("rekd").style.display="none"};

let rekTab="h",rkLoop=0;
function rekOpen(t){rekTab=t||rekTab;$("rek").style.display="block";$("rek").scrollTop=0;rekRender()}
function animAll(sel,stopIf){cancelAnimationFrame(rkLoop);const t0=performance.now();const f=now=>{if(stopIf())return;const x=loopX(now-t0);
  document.querySelectorAll(sel).forEach(el=>{const P=POSE[el.dataset.p];if(P)el.innerHTML=skDraw(P,lerpP(P.s,P.e,x),x>.99)});rkLoop=requestAnimationFrame(f)};rkLoop=requestAnimationFrame(f)}
function rekRender(){const rec=myRec(),cr=crowns(),nb=badgeCount(rec),nr=Object.keys(rec).filter(k=>LIBK[k]).length;
  $("rekSub").innerHTML="Freiwillig, keine Punkte – nur Abzeichen und Ehre. <b>"+nr+"</b> Rekorde · <b>"+nb+"</b> Abzeichen";
  const tabs=[["h","⏱ Halten"],["r","🔁 Am Stück"],["r60","⚡ 60 s"],["s","🧘 Dehnen"],["t","📏 Test"]];
  $("rekTabs").innerHTML=tabs.map(t=>'<button class="chip'+(t[0]===rekTab?" on":"")+'" data-t="'+t[0]+'">'+t[1]+'</button>').join("");
  $("rekTabs").querySelectorAll("button").forEach(b=>b.onclick=()=>{rekTab=b.dataset.t;rekRender()});
  let h="";
  if(rekTab==="t")h=tstHtml(true);
  else{if(rekTab==="h")h+='<p class="note" style="margin:0 0 10px">Halten, so lange es sauber geht. Alle 30 s ein Abzeichen.</p>';
    if(rekTab==="r")h+='<p class="note" style="margin:0 0 10px">So viele saubere Wiederholungen wie möglich – ohne Pause. Am Ende eintragen.</p>';
    if(rekTab==="r60")h+='<p class="note" style="margin:0 0 10px">60 Sekunden Vollgas, mitzählen, am Ende eintragen.</p>';
    if(rekTab==="s")h+=ROUT.map((r,i)=>{const sec=routSteps(r).reduce((a,x)=>a+x[1]+(x[2]?14:0),0);return '<button class="wbtn" data-r="'+i+'" style="padding:12px 16px"><b style="font-size:16px;margin:0">▶ '+r.n+' · ca. '+Math.round(sec/60)+' Min.</b><span>'+r.d+' – mit Ansage, einfach mitmachen</span></button>'}).join("")+'<p class="note" style="margin:0 0 10px">Oder einzeln: Übung antippen.</p>';
    h+='<div class="rkl">'+LIB.filter(x=>x.m===rekTab).map(x=>{const r=rec[x.id],c=cr[x.id],mine=c&&r&&r.b===c.v;
      return '<div data-k="'+x.id+'">'+(mine&&others.length?'<span class="cr">👑</span>':'')+'<svg class="sk rsk" data-p="'+x.p+'" viewBox="0 0 200 110"></svg><b>'+x.n+'</b><small>'+(x.m==="s"?(x.sd?x.sec+" s pro Seite":x.sec+" s"):r?(badge(x,tier(x,r.b))||"")+" · Rekord "+fmtV(x,r.b):"noch kein Rekord")+'</small></div>'}).join("")+'</div>'}
  $("rekBody").innerHTML=h;
  $("rekBody").querySelectorAll(".rkl>div").forEach(el=>el.onclick=()=>rekDetail(el.dataset.k));
  $("rekBody").querySelectorAll("button[data-r]").forEach(b=>b.onclick=()=>routStart(ROUT[+b.dataset.r]));
  tstBind($("rekBody"));
  animAll("#rek .rsk",()=>$("rek").style.display==="none"||$("rekd").style.display==="block"||$("rr").style.display==="block")}
function routSteps(r){const s=[];r.l.forEach(id=>stretchSteps(LIBK[id],r.sec||LIBK[id].sec).forEach(x=>s.push(x.slice())));s.forEach((x,i)=>x[2]=i===s.length-1?0:5);return s}
function routStart(r){W.X={t:r.n,s:routSteps(r),dt:"🧘 "+r.n+" geschafft – zählt nicht für Punkte, aber dein Körper sagt danke."};$("rek").style.display="none";$("rekd").style.display="none";startChk("X")}
function rekDetail(id){const x=LIBK[id],rec=myRec(),r=rec[id],cr=crowns()[id];
  let h='<h2 style="font-size:22px;margin:4px 0 6px">'+x.n+'</h2><svg class="sk rsk2" data-p="'+x.p+'" viewBox="0 0 200 110"></svg>';
  if(x.need)h+='<p class="note" style="text-align:center">Du brauchst: '+x.need+'</p>';
  if(x.m!=="s"){
    h+='<div class="card" style="margin-top:10px">';
    if(r){const g=pct(r.f,r.b);h+='<div class="tutb"><div><b>'+fmtV(x,r.b)+'</b><span>Rekord ('+r.bd.split("-").reverse().slice(0,2).join(".")+'.)</span></div><div><b>'+fmtV(x,r.f)+'</b><span>Erster Versuch</span></div><div><b>'+(g>0?"+"+g+" %":"–")+'</b><span>Steigerung</span></div></div>'}
    else h+='<p class="note" style="margin:0">Noch kein Versuch – der erste Versuch ist dein Startwert.</p>';
    if(cr&&others.length)h+='<p class="note" style="margin:8px 0 0">👑 Gruppenrekord: <b>'+fmtVL(x,cr.v)+'</b> – '+cr.names.map(esc).join(", ")+'</p>';
    const n=Math.max(tier(x,r&&r.b)+2,4);let bd="";for(let i=1;i<=n;i++)bd+='<span class="'+(r&&tier(x,r.b)>=i?"":"off")+'">'+badge(x,i)+'</span>';
    h+='<div class="bdg">'+bd+'</div><button class="rrb" id="rdGo">▶ Rekordversuch starten</button></div>'}
  else h+='<button class="rrb" id="rdGo" style="margin-top:10px">▶ Dehnen starten · '+(x.sd?x.sec+" s pro Seite":x.sec+" s")+'</button>';
  h+='<h4 style="color:var(--acc);margin:14px 0 6px">So geht\'s</h4><ol style="padding-left:20px">'+x.so.map(s=>'<li style="font-size:15px;line-height:1.5;color:#ddd;margin-bottom:4px">'+s+'</li>').join("")+'</ol><div class="banner info" style="margin-top:12px">💡 '+x.tip+'</div>';
  if(r&&r.h&&r.h.length>1)h+='<h4 style="color:var(--acc);margin:14px 0 6px">Letzte Versuche</h4><p class="note">'+r.h.slice().reverse().map(e=>e[0].split("-").reverse().slice(0,2).join(".")+". "+fmtV(x,e[1])).join(" · ")+'</p>';
  $("rekdM").textContent=RK_MODE[x.m];$("rekd").dataset.k=id;$("rekdB").innerHTML=h;$("rekd").style.display="block";$("rekd").scrollTop=0;
  $("rdGo").onclick=()=>{if(x.m==="s"){W.X={t:x.n,s:stretchSteps(x),dt:"🧘 Gedehnt – zählt nicht für Punkte, tut aber gut."};$("rek").style.display="none";$("rekd").style.display="none";startChk("X")}else rrStart(x)};
  animAll("#rekd .rsk2",()=>$("rekd").style.display==="none"||$("rr").style.display==="block")}
const esc=s=>String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

// ---------- Rekordversuch ----------
let RR=null;
function rrSay(t){say([{t}],true)}
async function rrStart(x,test){await unlockAudio();lock();
  RR={x,test,ph:"prep",t0:Date.now()+10000,best:((myRec()[x.id]||{}).b)||0,saidRec:false,lastTier:0,v:0};
  $("rr").className="";$("rr").style.display="block";$("rrN").textContent=x.n;$("rrC").textContent=x.c;$("rrI").textContent=RR.best?"Dein Rekord: "+fmtVL(x,RR.best):"Erster Versuch – das wird dein Startwert.";
  rrSay("Rekordversuch: "+x.n+". "+x.c+(x.m==="h"?" Die Zeit läuft, bis du Stopp drückst.":x.m==="r60"?" Sechzig Sekunden. Mitzählen!":" Mitzählen! Am Ende trägst du die Zahl ein.")+" Geh in Position.");
  $("rrB").innerHTML='<button class="rrb sec" id="rrQ">Abbrechen</button>';$("rrQ").onclick=rrQuit;
  clearInterval(RR.iv);RR.iv=setInterval(rrTick,100);rrTick();
  const P=POSE[x.p],t0=performance.now();cancelAnimationFrame(rkLoop);
  const f=now=>{if(!RR||$("rr").style.display==="none")return;let w;if(RR.ph==="prep"&&(RR.t0-Date.now())>4000)w=loopX(now-t0);else w=x.m==="h"?1:loopX(now-t0);$("rrSk").innerHTML=skDraw(P,lerpP(P.s,P.e,w),w>.99);rkLoop=requestAnimationFrame(f)};rkLoop=requestAnimationFrame(f)}
function rrTick(){if(!RR)return;const x=RR.x,now=Date.now();
  if(RR.ph==="prep"){const r=Math.ceil((RR.t0-now)/1000);$("rrP").textContent="GLEICH GEHT'S LOS";$("rrT").textContent=Math.max(0,r);
    if(r<=3&&r>0&&RR.cd!==r){RR.cd=r;beep(700,.12);if(!quiet)rrSay(String(r))}
    if(now>=RR.t0){RR.ph="go";RR.s0=now;$("rr").className="go";beep(1200,.3);rrSay(x.m==="h"?"Los! Halten!":"Los!");
      $("rrB").innerHTML='<button class="rrb" id="rrS">'+(x.m==="r60"?"⏹ Vorzeitig beenden":"🏁 Stopp – fertig")+'</button>';$("rrS").onclick=rrStop}
    return}
  if(RR.ph!=="go")return;const el=(now-RR.s0)/1000;
  if(x.m==="r60"){const r=Math.max(0,60-el);$("rrP").textContent="MITZÄHLEN!";$("rrT").textContent=Math.ceil(r);
    if(r<=30.05&&!RR.m30){RR.m30=1;rrSay("Noch dreißig Sekunden!")}if(r<=10.05&&!RR.m10){RR.m10=1;rrSay("Noch zehn! Vollgas!")}
    if(r<=0){rrStop();return}return}
  const s=Math.floor(el);$("rrT").textContent=x.m==="h"?(s<60?s:Math.floor(s/60)+":"+String(s%60).padStart(2,"0")):s;
  $("rrP").textContent=x.m==="h"?"HALTEN!":"ZÄHLEN!";
  if(x.m==="h"){const tr=Math.floor(s/30);
    if(RR.best&&s>RR.best&&!RR.saidRec){RR.saidRec=true;beep(1500,.2);rrSay("Neuer Rekord! Weiter!");$("rrI").textContent="🎉 Neuer Rekord läuft!"}
    else if(tr>RR.lastTier){RR.lastTier=tr;beep(1000,.15);rrSay(tr*30+" Sekunden!"+(tr>tier(x,RR.best)?" Neues Abzeichen!":""));if(!RR.saidRec)$("rrI").textContent=badge(x,tr)+" geschafft"}}}
function rrQuit(){if(!RR)return;clearInterval(RR.iv);RR=null;$("rr").style.display="none";say([],true);try{if(wl){wl.release();wl=null}}catch(e){}if($("rekd").style.display==="block")rekDetail($("rekd").dataset.k);else if($("rek").style.display==="block")rekRender()}
function rrStop(){const x=RR.x,el=(Date.now()-RR.s0)/1000;RR.ph="end";RR.el=el;clearInterval(RR.iv);beep(500,.3);
  $("rr").className="";
  if(x.m==="h"){RR.v=Math.floor(el);rrResult()}
  else{$("rrP").textContent=x.m==="r60"?"ZEIT!":"FERTIG";rrSay(x.m==="r60"?"Zeit! Wie viele hast du geschafft?":"Stark! Wie viele hast du geschafft?");
    $("rrT").textContent="";$("rrI").textContent=x.u==="st"?"Höchste komplett geschaffte Stufe:":"Wie viele saubere Wiederholungen?";
    const st0=RR.best||0;$("rrB").innerHTML='<div class="cnt"><button id="rrM">−</button><input id="rrV" inputmode="numeric" maxlength="4" value="'+(x.u==="st"?Math.max(1,st0):0)+'"><button id="rrPl">+</button></div><button class="rrb" id="rrOk">Eintragen</button><button class="rrb sec" id="rrQ">Verwerfen</button>';
    const v=$("rrV");$("rrM").onclick=()=>{v.value=Math.max(0,RX(v.value)-1)};$("rrPl").onclick=()=>{v.value=RX(v.value)+1};
    $("rrOk").onclick=()=>{RR.v=RX(v.value);if(!RR.v){rrQuit();return}rrResult()};$("rrQ").onclick=rrQuit}}
function rrResult(){const x=RR.x,v=RR.v,rec=myRec(),old=rec[x.id],t=todayK();
  if(!v){$("rrT").textContent="0";$("rrB").innerHTML='<button class="rrb sec" id="rrQ">Schließen</button>';$("rrQ").onclick=rrQuit;return}
  const isRec=!old||v>old.b,isFirst=!old,t0=tier(x,old&&old.b),t1=tier(x,v),sec=x.m==="h"?v:x.m==="r60"?60:Math.min(RX(RR.el),600);
  rec[x.id]={b:isRec?v:old.b,bd:isRec?t:old.bd,f:old?old.f:v,fd:old?old.fd:t,n:(old?old.n:0)+1,t:(old?old.t||0:0)+sec,h:[...((old&&old.h)||[]),[t,v]].slice(-8)};
  if(RR.test)tstSet(RR.test,x.id,v);
  state.ch.rec=rec;rekSave();
  const g=old?pct(old.f,v):null,nb=t1>t0?badge(x,t1):"";
  $("rrP").textContent=isFirst?"STARTWERT":isRec?"NEUER REKORD":"GESCHAFFT";$("rrT").textContent=fmtV(x,v).replace(" min","").replace(" s","s");
  $("rrI").innerHTML=(nb?'<span style="font-size:22px">'+nb.split(" ")[0]+'</span> <b>Neues Abzeichen: '+nb+'</b><br>':'')+(isFirst?"Dein erster Wert ist gespeichert. Ab jetzt geht's nur noch hoch.":isRec?"Alter Rekord: "+fmtVL(x,old.b)+(g>0?" · seit dem ersten Versuch +"+g+" %":""):"Rekord bleibt bei "+fmtVL(x,old.b)+". Nächstes Mal!");
  rrSay(isFirst?"Startwert gespeichert!":isRec?"Neuer Rekord! "+(nb?"Und ein neues Abzeichen!":"Stark!"):"Gut gemacht. Rekord bleibt stehen.");if(isRec)beep(1500,.4);
  const cr=crowns()[x.id];if(isRec&&others.length&&cr&&cr.names.includes(state.name))$("rrI").innerHTML+='<br>👑 Gruppenrekord!';
  $("rrB").innerHTML='<button class="rrb" id="rrQ">'+(RR.test?"Weiter zum Test":"Fertig")+'</button>';
  $("rrQ").onclick=()=>{const tt=RR&&RR.test;clearInterval(RR&&RR.iv);RR=null;$("rr").style.display="none";try{if(wl){wl.release();wl=null}}catch(e){}renderMenu();
    if(tt){rekTab="t";rekOpen("t")}else if($("rekd").style.display==="block")rekDetail(x.id);else if($("rek").style.display==="block")rekRender()}}

// ---------- Fitness-Test ----------
function tstPhase(){const T=myTst();return todayK()>=RT0&&tstDone(T.t0)?"t1":"t0"}
const tstDone=o=>!!(o&&TEST.every(e=>o[e.id]!==undefined));
function tstSet(ph,id,v){const T=myTst();T[ph]=T[ph]||{};T[ph][id==="puk"?"pu":id]=v;if(id==="puk"||id==="pu")T[ph].k=id==="puk"?1:0;if(!T[ph].d)T[ph].d=todayK();state.ch.tst=T}
function tstHtml(full){const T=myTst(),ph=tstPhase(),o=T[ph]||{},t=todayK(),done=tstDone(o);
  if(!full&&done)return "";
  if(!full)return '<div class="banner info" id="tstOpen" style="cursor:pointer;margin-bottom:10px">📏 <b>'+(ph==="t0"?"Starttest":"Abschlusstest")+'</b> (freiwillig, ca. 8 Min.) – '+(ph==="t0"?"wie fit bist du am Start? ":"wie viel hat der Dezember gebracht? ")+'<b>'+TEST.filter(e=>o[e.id]!==undefined).length+'/4</b> ›</div>';
  let h='<div class="card"><h3 style="margin-bottom:4px">📏 '+(ph==="t0"?"Starttest":"Abschlusstest")+' <span style="font-size:12px;color:var(--mut);font-weight:400">freiwillig · ca. 8 Min.</span></h3>';
  h+='<p class="note" style="margin:0 0 6px">'+(ph==="t0"?(done?"✅ Starttest erledigt. Am <b>27.12.</b> wird der Abschlusstest freigeschaltet – dann siehst du, um wie viel Prozent du besser geworden bist."+(t<="2026-12-07"?" Bis 7.12. kannst du einzelne Tests noch wiederholen.":""):"4 Übungen, jeweils bis nichts mehr geht. Dazwischen so lange Pause, wie du brauchst. Am 27.12. kommt derselbe Test nochmal – im Ranking zählt nur, um wie viel Prozent du dich verbessert hast."):"Derselbe Test wie am Anfang. Jetzt zeigt sich, was der Dezember gebracht hat!")+'</p>';
  const kk=ph==="t1"?(T.t0&&T.t0.k):o.k;
  TEST.forEach(e=>{const id=e.id==="pu"&&kk?"puk":e.id,x=LIBK[id],v=o[e.id],v0=T.t0&&T.t0[e.id],open=ph==="t1"||v===undefined||t<="2026-12-07";
    const nm=e.id==="pu"?"Liegestütze am Stück"+(kk&&(v!==undefined||ph==="t1")?" (Knie)":""):x.n;
    let sub="";if(ph==="t1"&&v0!==undefined)sub='Start: '+fmtVL(x,v0)+(v!==undefined?" → "+fmtVL(x,v)+" ("+(pct(v0,v)>=0?"+":"")+pct(v0,v)+" %)":"");else if(v!==undefined)sub=fmtVL(x,v);
    h+='<div class="tst"><div>'+(v!==undefined?"✅":"⬜")+' '+nm+(sub?'<br><small>'+sub+'</small>':'')+'</div>'+(open?'<button class="chip" data-tx="'+e.id+'">'+(v!==undefined?"↻":"▶ Start")+'</button>':'')+'</div>'});
  if(ph==="t1"&&done)h+='<p style="margin-top:10px;font-size:17px"><b>Gesamt: '+(tstScore(T)>=0?"+":"")+tstScore(T)+' %</b> gegenüber dem Starttest 💪</p>';
  return h+'</div>'}
function tstScore(T){const a=TEST.map(e=>pct(T.t0[e.id],T.t1[e.id])).filter(v=>v!==null);return a.length?Math.round(a.reduce((p,q)=>p+q,0)/a.length):0}
function tstBind(el){el.querySelectorAll("button[data-tx]").forEach(b=>b.onclick=()=>{const id=b.dataset.tx,ph=tstPhase(),T=myTst();
  if(id==="pu"){if(ph==="t1"){rrStart(LIBK[T.t0.k?"puk":"pu"],ph);return}
    ask("💪 <b>Liegestütze am Stück</b><br>Normal oder auf den Knien? Beim Abschlusstest machst du dieselbe Variante.",()=>rrStart(LIBK.pu,ph),()=>rrStart(LIBK.puk,ph),"Normal","Auf den Knien");return}
  rrStart(LIBK[id],ph)})}

// ---------- Ranking & Startseite ----------
function rekMenu(){const rec=myRec();myTst();const nb=badgeCount(rec),nr=Object.keys(rec).filter(k=>LIBK[k]).length;
  if($("bRekS"))$("bRekS").textContent=LIB.length+" Übungen · Rekordversuch jederzeit · "+(nr?nr+" Rekorde, "+nb+" Abzeichen":"noch keine Rekorde");
  if($("tstBox")){$("tstBox").innerHTML=tstHtml(false);const o=$("tstOpen");if(o)o.onclick=()=>rekOpen("t")}
  const me={days:state.days,ch:state.ch,start:state.start},m0=todayK().slice(0,8)+"01",all=people().reduce((a,u)=>a+tut(u),0);
  if($("tutBox"))$("tutBox").innerHTML='<h3>⏱ Zeit unter Spannung</h3><div class="tutb"><div><b>'+fmtH(tut(me,m0))+'</b><span>diesen Monat</span></div><div><b>'+fmtH(tut(me))+'</b><span>insgesamt</span></div><div><b>'+fmtH(all)+'</b><span>ganze Gruppe</span></div></div><p class="note" style="margin-top:8px">Alle Sekunden, in denen du gehalten, gedrückt oder gezählt hast – Workouts, Challenges und Rekordversuche (Pausen zählen nicht).</p>'}
function rekRank(){if(!$("rkTut"))return;const P=people(),rows=P.map(u=>({n:u.name,me:!!u.me,s:tut(u)})).sort((a,b)=>b.s-a.s),all=rows.reduce((a,r)=>a+r.s,0);
  $("rkTut").innerHTML='<h3>⏱ Zeit unter Spannung</h3><p class="sub" style="margin-bottom:6px">Zusammen schon <b>'+fmtH(all)+'</b> gehalten 💪</p>'+rows.map(r=>'<div class="tst"'+(r.me?' style="color:var(--acc)"':'')+'><span>'+esc(r.n)+'</span><b>'+fmtH(r.s)+'</b></div>').join("");
  const cr=crowns(),ks=LIB.filter(x=>cr[x.id]);
  $("rkRec").innerHTML='<h3>👑 Rekorde der Gruppe</h3>'+(ks.length?ks.map(x=>'<div class="tst" data-k="'+x.id+'" style="cursor:pointer"><span>'+x.n+'<br><small>'+cr[x.id].names.map(esc).join(", ")+'</small></span><b>'+fmtVL(x,cr[x.id].v)+'</b></div>').join(""):'<p class="note">Noch keine Rekorde. Unter „Training“ → „🏆 Rekorde &amp; Dehnen“ den ersten aufstellen!</p>');
  $("rkRec").querySelectorAll("[data-k]").forEach(el=>el.onclick=()=>{rekOpen(LIBK[el.dataset.k].m);rekDetail(el.dataset.k)});
  const ts=P.map(u=>({n:u.name,me:!!u.me,T:(u.ch&&u.ch.tst)||{}})).filter(u=>tstDone(u.T.t0));
  const el=$("rkTst");if(!ts.length){el.style.display="none";return}el.style.display="block";
  const fin=ts.filter(u=>tstDone(u.T.t1)).map(u=>Object.assign(u,{p:tstScore(u.T)})).sort((a,b)=>b.p-a.p);
  el.innerHTML='<h3>📏 Fitness-Test: Verbesserung</h3>'+(fin.length?fin.map((u,i)=>'<div class="tst"'+(u.me?' style="color:var(--acc)"':'')+'><span>'+(["🥇","🥈","🥉"][i]||i+1+".")+" "+esc(u.n)+'</span><b>'+(u.p>=0?"+":"")+u.p+' %</b></div>').join(""):'')+
    '<p class="note" style="margin-top:6px">Starttest gemacht: '+ts.map(u=>esc(u.n)).join(", ")+'. '+(fin.length?"":"Ab 27.12. zählt hier nur die Verbesserung in Prozent – nicht, wer am fittesten ist.")+'</p>'}
{const _rm=renderMenu;renderMenu=function(){_rm.apply(this,arguments);try{rekMenu()}catch(e){console.error(e)}};
 const _rr=renderRank;renderRank=function(){_rr.apply(this,arguments);try{rekRank();rekMenu()}catch(e){console.error(e)}}}
try{renderMenu()}catch(e){}
