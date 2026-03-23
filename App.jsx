import { useState, useRef, useEffect } from "react";

// ─── KLEUREN ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#0c0e12", card:"#13161b", border:"#1e232d", yellow:"#ffd000",
  green:"#44cc88", red:"#ff3333", orange:"#ff8800", text:"#c8cdd6",
  muted:"#667", dark:"#111418",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const KINNEY_E=[{v:10,l:"Continu"},{v:6,l:"Regelmatig"},{v:3,l:"Wekelijks"},{v:2,l:"Maandelijks"},{v:1,l:"Jaarlijks"},{v:0.5,l:"Uitzonderlijk"}];
const KINNEY_P=[{v:10,l:"Zeker"},{v:6,l:"Zeer waarschijnlijk"},{v:3,l:"Mogelijk"},{v:1,l:"Weinig kans"},{v:0.5,l:"Onwaarschijnlijk"},{v:0.2,l:"Praktisch onmogelijk"}];
const KINNEY_G=[{v:100,l:"Catastrofaal – meerdere doden"},{v:40,l:"Fataal – 1 dode"},{v:15,l:"Ernstig blijvend letsel"},{v:7,l:"Ernstig tijdelijk letsel"},{v:3,l:"Licht letsel"},{v:1,l:"EHBO"}];
const kinneyLvl=s=>s>=400?{t:"CATASTROFAAL",c:"#ff3333"}:s>=200?{t:"HOOG RISICO",c:"#ff8800"}:s>=70?{t:"AANZIENLIJK",c:"#ffcc00"}:s>=20?{t:"MATIG",c:"#88cc44"}:{t:"LAAG",c:"#44cc88"};

const DOC_TYPES=[
  {key:"ce",label:"CE-markering / Typeplaatje",icon:"🏷️"},
  {key:"doc",label:"Verklaring van Overeenstemming (DoC)",icon:"📜"},
  {key:"handleiding",label:"Gebruiksaanwijzing / Handleiding",icon:"📖"},
  {key:"risico",label:"Bestaande Risicoanalyse",icon:"⚠️"},
  {key:"vik",label:"VIK – Verslag Ingebruikname Keuring",icon:"✅"},
  {key:"wik",label:"WIK – Wettelijk Inspectierapport",icon:"🔍"},
  {key:"vorig",label:"Vorig Conformiteitsverslag",icon:"📋"},
  {key:"overig",label:"Overig document",icon:"📄"},
];

const SECTIONS=[
  {id:"3.1",title:"Algemene conformiteit & CE-markering",vragen:["Is er een CE-markering aanwezig op het arbeidsmiddel?","Is de EU Verklaring van Overeenstemming (DoC) beschikbaar?","Is de gebruiksaanwijzing aanwezig in het Nederlands?","Zijn de technische constructiedossiers beschikbaar (indien van toepassing)?"]},
  {id:"3.2",title:"Beveiliging van gevaarlijke bewegende delen",vragen:["Zijn alle gevaarlijke draaiende/bewegende delen beveiligd met afschermingen?","Voldoen de afschermingen aan de veilige afstandsnormen (EN ISO 13857)?","Zijn er vergrendelde beveiligingsinrichtingen (interlocks) op beweegbare afschermingen?","Worden de beveiligingen niet omzeild of verwijderd tijdens de werking?"]},
  {id:"3.3",title:"Besturing & noodstoppen",vragen:["Is er een duidelijk zichtbare en bereikbare NOODSTOP aanwezig?","Werkt de noodstop correct (test uitgevoerd en gedocumenteerd)?","Zijn de bedieningselementen duidelijk gemarkeerd en gelabeld?","Is er een duidelijk inschakelsignaal vóór de start van het arbeidsmiddel?"]},
  {id:"3.4",title:"Brandgevaar & explosiebeveiliging",vragen:["Zijn er maatregelen tegen brandgevaar door het arbeidsmiddel?","Is het arbeidsmiddel geschikt voor de omgeving (ATEX indien van toepassing)?"]},
  {id:"3.5",title:"Emissies: stof, gas & dampen",vragen:["Is er een lokale afzuiging aanwezig voor gevaarlijke emissies?","Worden de wettelijke emissiegrenswaarden gerespecteerd?"]},
  {id:"3.6",title:"Lawaai & trillingen",vragen:["Is het geluidsniveau gemeten en gedocumenteerd?","Worden de grenswaarden voor lawaai (80/85 dB(A)) gerespecteerd?","Zijn trillingsniveaus geëvalueerd (hand-arm / lichaamstrillingen)?"]},
  {id:"3.7",title:"Verlichting op de werkpost",vragen:["Is de verlichting voldoende voor de uit te voeren taken?","Is er geen verblinding of gevaarlijke schaduwvorming?"]},
  {id:"3.8",title:"Extreme temperaturen",vragen:["Zijn hete of koude oppervlakken beveiligd of duidelijk gemarkeerd?","Zijn er maatregelen genomen tegen verbrandingsrisico?"]},
  {id:"3.9",title:"Elektrische veiligheid",vragen:["Is er een aarding aanwezig en gecontroleerd?","Is de elektrische installatie gekeurd conform AREI?","Is er een vergrendelbare isolatieschakelaar aanwezig?","Zijn kabels, leidingen en aansluitingen in goede staat?"]},
  {id:"3.10",title:"Stabiliteit & stevigheid",vragen:["Is het arbeidsmiddel stabiel opgesteld (verankerd indien nodig)?","Zijn er maatregelen tegen kantelen of ongewild verschuiven?"]},
  {id:"3.11",title:"Projectielen & vallende objecten",vragen:["Zijn er maatregelen tegen wegschietende stukken of projectielen?","Is er bescherming tegen vallende voorwerpen aanwezig?"]},
  {id:"3.12",title:"Ergonomie & gebruiksgemak",vragen:["Is de bedieningshoogte ergonomisch correct voor de gebruiker?","Worden de bedieningskrachten beperkt tot aanvaardbare niveaus?"]},
  {id:"3.13",title:"Signalisatie & markering",vragen:["Zijn alle gevaren gesignaleerd met duidelijke pictogrammen en waarschuwingen?","Is de maximale belasting/snelheid aangegeven op het toestel?"]},
  {id:"3.14",title:"Onderhoud & inspectie",vragen:["Is er een onderhoudsplan aanwezig en up-to-date?","Is veilig onderhoud mogelijk (lockout/tagout procedure beschikbaar)?","Zijn de onderhoudsintervallen en -historiek gedocumenteerd?"]},
  {id:"3.15",title:"Persoonlijke beschermingsmiddelen (PBM)",vragen:["Zijn de vereiste PBM geïdentificeerd in de risicoanalyse?","Worden de PBM correct en consequent gebruikt door de operators?","Zijn de PBM conform EN-normen en EU Verordening 2016/425?"]},
  {id:"3.16",title:"Opleiding & instructies",vragen:["Zijn de operators opgeleid voor het gebruik van het arbeidsmiddel?","Zijn de opleidingen en heropleidingen gedocumenteerd?","Zijn werkinstructies beschikbaar en leesbaar op de werkpost?"]},
  {id:"3.17",title:"Hijs- en hefwerktuigen",vragen:["Is het hijs/heftoestel gekeurd door een erkend keuringsorganisme?","Is de WLL (Working Load Limit) zichtbaar aangebracht op het toestel?","Is de periodieke keuring binnen de geldigheidsdatum?"]},
  {id:"3.18",title:"Opslag & intern transport",vragen:["Zijn de opslagcondities conform de fabrieksspecificaties?","Is het intern transport van het arbeidsmiddel veilig georganiseerd?"]},
  {id:"3.19",title:"Restrisico's & aanvullende maatregelen",vragen:["Zijn alle restrisico's geïdentificeerd en gedocumenteerd?","Zijn aanvullende maatregelen gedefinieerd voor restrisico's?","Is de risicoanalyse goedgekeurd, gedateerd en ondertekend?"]},
];
const TOTAL=SECTIONS.reduce((n,s)=>n+s.vragen.length,0);

const ACTIES_OPTIES = [
  { groep: "Afschermingen & omheiningen",  items: [
    "Plaatsen vaste afscherming conform EN 953",
    "Plaatsen beweegbare afscherming met interlock (EN 14119)",
    "Plaatsen omheining gevaarlijke zone (EN ISO 13857)",
    "Aanbrengen tunnelafscherming voor doorvoer",
    "Plaatsen transparante afscherming (polycarbonaat)",
  ]},
  { groep: "Besturing & noodstoppen", items: [
    "Installeren noodstop conform EN ISO 13850",
    "Voorzien vergrendelbare isolatieschakelaar (LOTO)",
    "Aanbrengen duidelijke start/stopbediening",
    "Installeren twee-handenbediening (EN 574)",
    "Plaatsen veiligheidsmat of lichtscherm (EN 61496)",
  ]},
  { groep: "Elektrische veiligheid", items: [
    "Uitvoeren elektrische keuring conform AREI",
    "Vervangen/herstellen beschadigde bekabeling",
    "Aardingscontrole laten uitvoeren",
    "Installeren aardlekschakelaar",
  ]},
  { groep: "Signalisatie & markering", items: [
    "Aanbrengen veiligheidsignalisatie (ISO 7010)",
    "Markeren gevaarlijke zones (geel/zwart)",
    "Aanbrengen WLL-markering op heftoestel",
    "Plaatsen verplichte PBM-signalisatie",
  ]},
  { groep: "Documentatie & opleiding", items: [
    "Opstellen/actualiseren risicoanalyse (Kinney)",
    "Aanvragen CE-markering of DoC bij fabrikant",
    "Organiseren opleiding voor operators",
    "Opstellen werkinstructies voor de werkpost",
    "Opstellen/actualiseren onderhoudsplan",
  ]},
  { groep: "Keuringen & inspecties", items: [
    "Keuring laten uitvoeren door erkend organisme",
    "Periodieke inspectie inplannen (VIK/WIK)",
    "ATEX-keuring laten uitvoeren",
    "Geluidsmeting laten uitvoeren (dB(A))",
    "Trillingmeting laten uitvoeren",
  ]},
  { groep: "PBM & persoonlijke bescherming", items: [
    "Voorzien conforme gehoorbescherming (EN 352)",
    "Voorzien veiligheidsschoenen (EN ISO 20345)",
    "Voorzien beschermende handschoenen (EN 388)",
    "Voorzien oogbescherming (EN 166)",
    "Voorzien ademhalingsbescherming (EN 140)",
  ]},
  { groep: "Andere", items: [
    "Andere maatregel (zie omschrijving)",
  ]},
];

// ─── AI HELPERS ───────────────────────────────────────────────────────────────
const SYS="Je bent een Belgische preventieadviseur niveau A, expert in Codex Welzijn op het Werk en Machinerichtlijn 2006/42/EG. Antwoord professioneel in het Nederlands.";

async function callAI(msgs, system=SYS){
  const r=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{
      "Content-Type":"application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,system,messages:msgs})
  });
  const d=await r.json();
  return d.content?.[0]?.text||"Geen antwoord.";
}

async function callAIDrawing(imgB64, vraag, context){
  const system=`Antwoord ALLEEN met JSON, geen uitleg, geen backticks.
Formaat: {"beschrijving":"NL tekst","norm":"EN-norm","kostklasse":"€ klasse","tekeningen":[...]}
Types: rect{x1,y1,x2,y2,kleur,lijndikte,label,stippel} pijl{x1,y1,x2,y2,kleur,lijndikte,label} tekst{x,y,kleur,tekst,fontgrootte} zone{x1,y1,x2,y2,kleur,alpha,label}
Coördinaten: relatief 0.0-1.0. Kleuren: gevaar=#ff3333 oplossing=#ffd000 veilig=#44cc88`;

  const smallImg = await resizeB64(imgB64, 400, 0.55);

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{
      "Content-Type":"application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body:JSON.stringify({
      model:"claude-haiku-4-5-20251001",
      max_tokens:500,
      system,
      messages:[{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:"image/jpeg",data:smallImg}},
        {type:"text",text:`Vraag:"${vraag}" Context:${context||"niet conform"} Teken de vereiste veiligheidsoplossing.`}
      ]}]
    })
  });
  const d = await r.json();
  const raw = d.content?.[0]?.text || "{}";
  try {
    return JSON.parse(raw.replace(/```json|```/g,"").trim());
  } catch(e){
    return {beschrijving:"Analyse klaar – zie tekening.",norm:"Codex Art. III.3",kostklasse:"Zie bevinding",tekeningen:[
      {type:"zone",x1:0.1,y1:0.1,x2:0.9,y2:0.9,kleur:"#ff3333",alpha:0.15,label:"Gevaarlijke zone"},
      {type:"tekst",x:0.05,y:0.06,kleur:"#ffd000",tekst:"BEVEILIGINGSMAATREGEL VEREIST",fontgrootte:14}
    ]};
  }
}

// ─── AI AUTO-INVULLEN VIA DOCUMENT ───────────────────────────────────────────
async function callAIAutoInvullen(docs) {
  const vragenLijst = SECTIONS.flatMap(s =>
    s.vragen.map((v, qi) => `"${s.id}-${qi}": [${s.id}] ${v}`)
  ).join('\n');

  const content = [];

  // Voeg alle afbeelding-docs toe (max 5 voor context window)
  const imgDocs = docs.filter(d => d.mime?.startsWith('image/'));
  for (const doc of imgDocs.slice(0, 5)) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: doc.mime, data: doc.b64.split(',')[1] }
    });
  }

  content.push({
    type: "text",
    text: `Je bent een Belgische preventieadviseur niveau A. Analyseer het/de geüploade conformiteitsverslag(en)/document(en) voor een arbeidsmiddel.

Beantwoord alle onderstaande vragen op basis van wat je in de documenten ziet/leest.
- Als iets conform is in het document: "ok"
- Als iets niet conform is: "nok"  
- Als actie vereist is: "todo"
- Als niet van toepassing: "na"
- Als onbekend/niet vermeld: laat de key weg uit JSON

Geef ALLEEN geldige JSON terug, geen uitleg, geen backticks:
{
  "3.1-0": {"value": "ok", "note": "CE-markering aanwezig op typeplaatje (foto p.1)", "wetgeving": "Machinerichtlijn 2006/42/EG Art. 16"},
  "3.1-1": {"value": "nok", "note": "DoC ontbreekt in technisch dossier", "wetgeving": "Machinerichtlijn 2006/42/EG Bijlage II"},
  ...
}

Vragen om te beantwoorden:
${vragenLijst}`
  });

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content }]
    })
  });
  const d = await r.json();
  const raw = d.content?.[0]?.text || "{}";
  try { return JSON.parse(raw.replace(/```json|```/g, "").trim()); }
  catch { return {}; }
}

// ─── AI BULK FOTO ANALYSE PER SECTIE ─────────────────────────────────────────
async function callAIBulkFotoSectie(fotos, sectie, contextDocs=[]) {
  const content = [];

  // Voeg context-docs toe (vorig verslag als referentie)
  const ctxImgs = contextDocs.filter(d => d.mime?.startsWith('image/')).slice(0, 2);
  for (const doc of ctxImgs) {
    content.push({ type: "image", source: { type: "base64", media_type: doc.mime, data: doc.b64.split(',')[1] } });
  }

  // Voeg alle foto's toe (max 20, verkleind voor snelheid)
  for (const foto of fotos.slice(0, 20)) {
    const b64 = foto.split(',')[1] || foto;
    const small = await resizeB64(b64, 600, 0.65);
    content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: small } });
  }

  const vragenLijst = sectie.vragen.map((v, qi) => `${qi}: ${v}`).join('\n');

  content.push({
    type: "text",
    text: `Je bent een Belgische preventieadviseur niveau A. Analyseer de ${fotos.length} foto's van het arbeidsmiddel voor sectie "${sectie.id} – ${sectie.title}".

Beoordeel elke vraag op basis van WAT JE ZIET op de foto's.
Beschrijf concreet wat je ziet (welke foto, wat is zichtbaar, wat ontbreekt).

Geef ALLEEN geldige JSON terug, geen uitleg, geen backticks:
{
  "0": {"value": "ok|nok|todo|na", "note": "concreet wat je ziet op de foto's", "wetgeving": "Codex artikel / EN-norm"},
  "1": {...}
}

Vragen voor sectie ${sectie.id}:
${vragenLijst}`
  });

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content }]
    })
  });
  const d = await r.json();
  const raw = d.content?.[0]?.text || "{}";
  try { return JSON.parse(raw.replace(/```json|```/g, "").trim()); }
  catch { return {}; }
}

async function resizeB64(b64, MAX, quality=0.6){
  return new Promise(res=>{
    const img=new Image();
    img.onload=()=>{
      let w=img.width,h=img.height;
      if(w>MAX){h=h*MAX/w;w=MAX;}
      if(h>MAX){w=w*MAX/h;h=MAX;}
      const cv=document.createElement("canvas");
      cv.width=w;cv.height=h;
      cv.getContext("2d").drawImage(img,0,0,w,h);
      res(cv.toDataURL("image/jpeg",quality).split(",")[1]);
    };
    img.src=b64.startsWith("data:")?b64:"data:image/jpeg;base64,"+b64;
  });
}

async function resizeImg(file,MAX=600){
  return new Promise(res=>{
    const rd=new FileReader();
    rd.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width,h=img.height;
        if(w>MAX){h=h*MAX/w;w=MAX;}
        if(h>MAX){w=w*MAX/h;h=MAX;}
        const cv=document.createElement("canvas");
        cv.width=w;cv.height=h;
        cv.getContext("2d").drawImage(img,0,0,w,h);
        res(cv.toDataURL("image/jpeg",0.68));
      };
      img.src=e.target.result;
    };
    rd.readAsDataURL(file);
  });
}

async function fileToBase64(file){
  return new Promise(res=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.readAsDataURL(file);});
}

// ─── TEKEN FUNCTIES ───────────────────────────────────────────────────────────
function tekenOpCanvas(ctx, W, H, tekeningen){
  tekeningen.forEach(t=>{
    ctx.save();
    const {kleur="#ffd000",lijndikte=2}=t;
    ctx.strokeStyle=kleur;
    ctx.fillStyle=kleur;
    ctx.lineWidth=lijndikte;
    if(t.type==="rect"){
      const x=t.x1*W, y=t.y1*H, w=(t.x2-t.x1)*W, h=(t.y2-t.y1)*H;
      if(t.stippel){ctx.setLineDash([12,6]);}
      ctx.strokeRect(x,y,w,h);
      ctx.setLineDash([]);
      if(t.label){
        ctx.font=`bold 13px monospace`;
        ctx.strokeStyle="#000";ctx.lineWidth=3;
        ctx.strokeText(t.label,x+5,y-6);
        ctx.fillStyle=kleur;ctx.fillText(t.label,x+5,y-6);
      }
    }
    else if(t.type==="pijl"){
      const x1=t.x1*W,y1=t.y1*H,x2=t.x2*W,y2=t.y2*H;
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
      const angle=Math.atan2(y2-y1,x2-x1);
      const hs=18;
      ctx.beginPath();
      ctx.moveTo(x2,y2);
      ctx.lineTo(x2-hs*Math.cos(angle-0.4),y2-hs*Math.sin(angle-0.4));
      ctx.lineTo(x2-hs*Math.cos(angle+0.4),y2-hs*Math.sin(angle+0.4));
      ctx.closePath();ctx.fill();
      if(t.label){
        ctx.font="bold 12px monospace";
        ctx.strokeStyle="#000";ctx.lineWidth=3;
        ctx.strokeText(t.label,(x1+x2)/2+5,(y1+y2)/2-5);
        ctx.fillStyle=kleur;ctx.fillText(t.label,(x1+x2)/2+5,(y1+y2)/2-5);
      }
    }
    else if(t.type==="tekst"){
      const x=t.x*W,y=t.y*H;
      ctx.font=`bold ${t.fontgrootte||14}px monospace`;
      const padding=6;
      const metrics=ctx.measureText(t.tekst||"");
      ctx.fillStyle="rgba(0,0,0,0.6)";
      ctx.fillRect(x-padding,y-(t.fontgrootte||14)-padding/2,metrics.width+padding*2,(t.fontgrootte||14)+padding);
      ctx.fillStyle=kleur;
      ctx.fillText(t.tekst||"",x,y);
    }
    else if(t.type==="zone"){
      const x=t.x1*W,y=t.y1*H,w=(t.x2-t.x1)*W,h=(t.y2-t.y1)*H;
      ctx.fillStyle=kleur+(Math.round((t.alpha||0.2)*255).toString(16).padStart(2,"0"));
      ctx.fillRect(x,y,w,h);
      ctx.setLineDash([8,4]);ctx.strokeRect(x,y,w,h);ctx.setLineDash([]);
      if(t.label){
        ctx.font="bold 12px monospace";
        ctx.strokeStyle="#000";ctx.lineWidth=3;
        ctx.strokeText(t.label,x+6,y+18);
        ctx.fillStyle=kleur;ctx.fillText(t.label,x+6,y+18);
      }
    }
    ctx.restore();
  });
}

// ─── BASIS UI ─────────────────────────────────────────────────────────────────
const Topbar=({title,sub,right})=>(
  <div style={{background:C.dark,borderBottom:`2px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:200}}>
    <div>
      <div style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:C.yellow,letterSpacing:2}}>{title}</div>
      {sub&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{sub}</div>}
    </div>
    {right&&<div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>{right}</div>}
  </div>
);
const Card=({children,yellow=false,style={}})=>(
  <div style={{background:C.card,border:`1px solid ${yellow?C.yellow:C.border}`,borderRadius:6,padding:20,marginBottom:14,...style}}>{children}</div>
);
const Btn=({children,onClick,disabled,variant="primary",style={}})=>{
  const v={
    primary:{background:C.yellow,color:"#000"},
    ghost:{background:"transparent",color:"#889",border:`1px solid ${C.border}`},
    danger:{background:C.red,color:"#fff"},
    blue:{background:"#162440",color:"#88bbff",border:"1px solid #2255aa44"},
    purple:{background:"#1a1040",color:"#bb99ff",border:"1px solid #6644aa44"},
  };
  return <button style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",border:"none",borderRadius:4,fontFamily:"sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.38:1,transition:"opacity .15s",...v[variant],...style}} onClick={disabled?undefined:onClick} disabled={disabled}>{children}</button>;
};
const Tag=({children,color="yellow"})=>{
  const m={yellow:{bg:C.yellow,c:"#000"},green:{bg:C.green,c:"#000"},dark:{bg:"#1e232d",c:C.yellow,border:`1px solid ${C.yellow}33`}};
  const s=m[color]||m.yellow;
  return <span style={{display:"inline-block",fontSize:9,fontWeight:800,letterSpacing:2,padding:"3px 9px",borderRadius:3,textTransform:"uppercase",fontFamily:"monospace",background:s.bg,color:s.c,border:s.border||"none"}}>{children}</span>;
};
const Field=({label,children})=>(
  <div style={{marginBottom:14}}>
    <label style={{display:"block",fontSize:10,color:"#556",letterSpacing:1,textTransform:"uppercase",marginBottom:5,fontFamily:"monospace"}}>{label}</label>
    {children}
  </div>
);
const Inp=({value,onChange,placeholder})=>(
  <input value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",background:C.bg,border:"1px solid #252a35",borderRadius:4,color:C.text,padding:"9px 13px",fontSize:13,fontFamily:"sans-serif",outline:"none",boxSizing:"border-box"}}/>
);
const Txa=({value,onChange,placeholder,rows=3,style={}})=>(
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{width:"100%",background:C.bg,border:"1px solid #252a35",borderRadius:4,color:C.text,padding:"9px 13px",fontSize:13,fontFamily:"sans-serif",outline:"none",resize:"vertical",boxSizing:"border-box",...style}}/>
);
const Sel=({value,onChange,children})=>(
  <select value={value} onChange={onChange} style={{width:"100%",background:C.bg,border:"1px solid #252a35",borderRadius:4,color:C.text,padding:"8px 12px",fontSize:12,fontFamily:"sans-serif",outline:"none",cursor:"pointer"}}>{children}</select>
);
const AIBox=({label,children})=>(
  <div style={{background:"#071410",border:"1px solid #1a4030",borderRadius:4,padding:13,marginTop:10,fontSize:12,color:"#7abfa0",lineHeight:1.75,whiteSpace:"pre-wrap"}}>
    <span style={{fontFamily:"monospace",fontSize:10,color:C.yellow,fontWeight:700,display:"block",marginBottom:7}}>▸ {label}</span>
    {children}
  </div>
);

// ─── CANVAS ANNOTATIE IN ACHTERGROND ─────────────────────────────────────────
async function tekenAnnotatieOpAfbeelding(src, tekeningen){
  return new Promise(res=>{
    const img=new Image();
    img.onload=()=>{
      const cv=document.createElement("canvas");
      cv.width=img.width; cv.height=img.height;
      const ctx=cv.getContext("2d");
      ctx.drawImage(img,0,0);
      tekenOpCanvas(ctx,cv.width,cv.height,tekeningen);
      ctx.save();
      ctx.font="bold 11px monospace";
      ctx.fillStyle="rgba(255,208,0,0.65)";
      ctx.fillText("AI BEVEILIGINGSVOORSTEL",8,cv.height-8);
      ctx.restore();
      res(cv.toDataURL("image/jpeg",0.82));
    };
    img.onerror=()=>res(src);
    img.src=src.startsWith("data:")?src:"data:image/jpeg;base64,"+src;
  });
}

// ─── PROGRESS BADGE ───────────────────────────────────────────────────────────
function ProgressBadge({seconden}){
  const [elapsed, setElapsed] = useState(0);
  const estimated = seconden || 10;
  useEffect(()=>{
    const t = setInterval(()=>setElapsed(p=>p+0.1), 100);
    return ()=>clearInterval(t);
  },[]);
  const pct = Math.min(99, Math.round((elapsed/estimated)*100));
  const resterend = Math.max(0, Math.ceil(estimated - elapsed));
  return (
    <div style={{position:"absolute",inset:0,borderRadius:4,background:"rgba(0,0,0,0.78)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
      <div style={{fontSize:16}}>⚡</div>
      <div style={{fontSize:9,fontWeight:800,color:C.yellow,letterSpacing:1}}>{pct}%</div>
      <div style={{width:54,height:3,background:"#1e232d",borderRadius:2}}>
        <div style={{height:"100%",width:pct+"%",background:C.yellow,borderRadius:2,transition:"width .1s"}}/>
      </div>
      <div style={{fontSize:8,color:"#778"}}>{resterend > 0 ? `~${resterend}s` : "bijna..."}</div>
    </div>
  );
}

// ─── AI OPLOSSING MODAL ───────────────────────────────────────────────────────
function AIOplossingModal({src, vraag, context, onSave, onClose, manueleStart=false}){
  const canvasRef=useRef();
  const [fase,setFase]=useState(manueleStart?"manueel":"start");
  const [resultaat,setResultaat]=useState(null);
  const [tekstOplossing,setTekstOplossing]=useState("");
  const [drawing,setDrawing]=useState(false);
  const [tool,setTool]=useState("pen");
  const [kleur,setKleur]=useState("#ffd000");
  const [dikte,setDikte]=useState(3);
  const lastPos=useRef(null);

  useEffect(()=>{
    if(fase==="start") return;
    const cv=canvasRef.current;
    if(!cv) return;
    const ctx=cv.getContext("2d");
    const img=new Image();
    img.onload=()=>{
      cv.width=Math.min(img.width,820);
      cv.height=cv.width*(img.height/img.width);
      ctx.drawImage(img,0,0,cv.width,cv.height);
    };
    img.src=src;
  },[src, fase==="start"?null:fase==="manueel"?"manueel":"draw"]);

  const genereerAITekening=async()=>{
    setFase("loading");
    const b64=src.split(",")[1];
    const res=await callAIDrawing(b64,vraag,context);
    setResultaat(res);
    const cv=canvasRef.current;
    const ctx=cv.getContext("2d");
    await new Promise(ok=>{
      const img=new Image();
      img.onload=()=>{ctx.drawImage(img,0,0,cv.width,cv.height);ok();};
      img.src=src;
    });
    tekenOpCanvas(ctx,cv.width,cv.height,res.tekeningen||[]);
    ctx.save();
    ctx.font="bold 11px monospace";
    ctx.fillStyle="rgba(255,208,0,0.7)";
    ctx.fillText("AI BEVEILIGINGSVOORSTEL – MachineCheck Pro",10,cv.height-10);
    ctx.restore();
    setFase("klaar");
    setTekstOplossing(`${res.beschrijving}\n\nNorm: ${res.norm||"—"}\nKostklasse: ${res.kostklasse||"—"}`);
  };

  const getPos=(e,cv)=>{
    const r=cv.getBoundingClientRect();
    const cl=e.touches?e.touches[0]:e;
    return{x:(cl.clientX-r.left)*(cv.width/r.width),y:(cl.clientY-r.top)*(cv.height/r.height)};
  };
  const startDraw=e=>{setDrawing(true);const p=getPos(e,canvasRef.current);lastPos.current=p;};
  const moveDraw=e=>{
    if(!drawing)return;
    const cv=canvasRef.current;const ctx=cv.getContext("2d");const p=getPos(e,cv);
    if(tool==="pen"){
      ctx.beginPath();ctx.moveTo(lastPos.current.x,lastPos.current.y);ctx.lineTo(p.x,p.y);
      ctx.strokeStyle=kleur;ctx.lineWidth=dikte;ctx.lineCap="round";ctx.stroke();
    }else if(tool==="gum"){
      ctx.clearRect(p.x-15,p.y-15,30,30);
    }
    lastPos.current=p;
  };
  const endDraw=e=>{
    if(!drawing)return;setDrawing(false);
    const cv=canvasRef.current;const ctx=cv.getContext("2d");const p=getPos(e,cv);
    if(tool==="pijl"&&lastPos.current){
      const from=lastPos.current;
      ctx.strokeStyle=kleur;ctx.fillStyle=kleur;ctx.lineWidth=dikte+1;
      ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(p.x,p.y);ctx.stroke();
      const a=Math.atan2(p.y-from.y,p.x-from.x),hs=16+dikte;
      ctx.beginPath();ctx.moveTo(p.x,p.y);
      ctx.lineTo(p.x-hs*Math.cos(a-0.4),p.y-hs*Math.sin(a-0.4));
      ctx.lineTo(p.x-hs*Math.cos(a+0.4),p.y-hs*Math.sin(a+0.4));
      ctx.closePath();ctx.fill();
    }else if(tool==="rect"&&lastPos.current){
      const from=lastPos.current;
      ctx.strokeStyle=kleur;ctx.lineWidth=dikte+1;
      ctx.setLineDash([10,5]);ctx.strokeRect(from.x,from.y,p.x-from.x,p.y-from.y);ctx.setLineDash([]);
    }
    if(tool==="tekst"){
      const t=prompt("Label toevoegen:");
      if(t){
        ctx.font=`bold ${12+dikte*2}px monospace`;
        ctx.strokeStyle="#000";ctx.lineWidth=3;ctx.strokeText(t,p.x,p.y);
        ctx.fillStyle=kleur;ctx.fillText(t,p.x,p.y);
      }
    }
  };

  const TOOLS=[{v:"pen",l:"✏️"},{v:"pijl",l:"➡️"},{v:"rect",l:"⬜"},{v:"tekst",l:"🔤"},{v:"gum",l:"🧹"}];
  const KLEUREN=["#ffd000","#ff3333","#ff8800","#44cc88","#4488ff","#ffffff"];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:500,display:"flex",flexDirection:"column",alignItems:"center",padding:16,overflowY:"auto"}}>
      <div style={{background:C.dark,border:`1px solid ${C.yellow}`,borderRadius:6,padding:"10px 20px",marginBottom:10,width:"100%",maxWidth:860,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <span style={{fontFamily:"monospace",fontSize:12,color:C.yellow,fontWeight:700,letterSpacing:2}}>AI OPLOSSING GENERATOR</span>
          <span style={{fontSize:11,color:C.muted,marginLeft:12}}>{vraag?.substring(0,60)}...</span>
        </div>
        <button onClick={onClose} style={{background:"transparent",border:"none",color:"#889",fontSize:18,cursor:"pointer"}}>✕</button>
      </div>
      {fase==="start"&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:28,textAlign:"center",maxWidth:500,width:"100%",marginBottom:10}}>
          <div style={{fontSize:36,marginBottom:12}}>🤖</div>
          <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:8}}>AI tekent de oplossing op uw foto</div>
          <p style={{fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:20}}>
            De AI analyseert de foto en tekent automatisch:<br/>
            <strong style={{color:C.yellow}}>omheiningen · gevaarlijke zones · pijlen · labels · markeringen</strong>
          </p>
          <div style={{marginBottom:16}}>
            <Field label="Extra context / beschrijving (optioneel)">
              <Txa value={tekstOplossing||""} placeholder="bv. Draaiende as zonder afscherming..." rows={2}
                onChange={e=>setTekstOplossing(e.target.value)}/>
            </Field>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <Btn onClick={genereerAITekening} style={{padding:"12px 24px",fontSize:12}}>⚡ AI Oplossing (~5-10s)</Btn>
            <Btn variant="ghost" onClick={()=>setFase("manueel")}>✏️ Zelf tekenen</Btn>
          </div>
        </div>
      )}
      {fase==="manueel"&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 14px",marginBottom:8,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",width:"100%",maxWidth:860}}>
          {TOOLS.map(t=>(
            <button key={t.v} onClick={()=>setTool(t.v)}
              style={{padding:"5px 10px",borderRadius:3,fontSize:14,cursor:"pointer",background:tool===t.v?C.yellow:"#1e232d",color:tool===t.v?"#000":C.text,border:"none",minWidth:36}}>
              {t.l}
            </button>
          ))}
          <span style={{fontSize:11,color:C.muted,marginLeft:4}}>Kleur:</span>
          {KLEUREN.map(col=>(
            <div key={col} onClick={()=>setKleur(col)}
              style={{width:22,height:22,borderRadius:"50%",background:col,cursor:"pointer",border:kleur===col?"3px solid white":"2px solid #333",flexShrink:0}}/>
          ))}
          <input type="range" min={1} max={8} value={dikte} onChange={e=>setDikte(+e.target.value)} style={{width:60}}/>
        </div>
      )}
      {fase==="loading"&&(
        <div style={{width:"100%",maxWidth:860,marginBottom:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:20,textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:8}}>⚡</div>
          <div style={{fontSize:12,color:C.yellow,fontWeight:700,marginBottom:4}}>AI analyseert en tekent beveiligingsoplossing...</div>
          <div style={{fontSize:11,color:C.muted}}>~5-10 seconden</div>
        </div>
      )}
      {fase!=="start"&&(
        <>
          <canvas ref={canvasRef}
            style={{display:"block",width:"100%",maxWidth:860,borderRadius:6,border:`1px solid ${C.border}`,cursor:fase==="manueel"?"crosshair":"default",touchAction:"none",opacity:fase==="loading"?0.3:1,transition:"opacity .3s"}}
            onMouseDown={fase==="manueel"?startDraw:undefined}
            onMouseMove={fase==="manueel"?moveDraw:undefined}
            onMouseUp={fase==="manueel"?endDraw:undefined}
            onMouseLeave={fase==="manueel"?endDraw:undefined}
            onTouchStart={fase==="manueel"?e=>{e.preventDefault();startDraw(e);}:undefined}
            onTouchMove={fase==="manueel"?e=>{e.preventDefault();moveDraw(e);}:undefined}
            onTouchEnd={fase==="manueel"?endDraw:undefined}
          />
          {resultaat&&(
            <div style={{background:"#071410",border:"1px solid #1a4030",borderRadius:4,padding:13,marginTop:8,width:"100%",maxWidth:860}}>
              <span style={{fontFamily:"monospace",fontSize:10,color:C.yellow,fontWeight:700,display:"block",marginBottom:7}}>▸ AI BEVINDINGEN & NORM</span>
              <div style={{fontSize:12,color:"#7abfa0",lineHeight:1.7}}>
                <strong>Oplossing:</strong> {resultaat.beschrijving}<br/>
                <strong>Norm:</strong> {resultaat.norm||"—"} &nbsp;|&nbsp; <strong>Kostklasse:</strong> {resultaat.kostklasse||"—"}
              </div>
            </div>
          )}
          <div style={{width:"100%",maxWidth:860,marginTop:8}}>
            <Txa value={tekstOplossing} onChange={e=>setTekstOplossing(e.target.value)}
              placeholder="Extra toelichting bij de oplossing..." rows={2}/>
          </div>
          <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap",justifyContent:"center"}}>
            {fase==="klaar"&&<Btn variant="ghost" onClick={genereerAITekening}>🔄 Opnieuw genereren</Btn>}
            {fase==="klaar"&&<Btn variant="ghost" onClick={()=>setFase("manueel")}>✏️ Zelf aanpassen</Btn>}
            {fase==="manueel"&&<Btn variant="ghost" onClick={()=>setFase("start")}>← Terug</Btn>}
            <Btn onClick={()=>onSave(canvasRef.current.toDataURL("image/jpeg",0.88), tekstOplossing)}>
              💾 Opslaan in verslag
            </Btn>
            <Btn variant="ghost" onClick={onClose}>✕ Annuleren</Btn>
          </div>
        </>
      )}
    </div>
  );
}

// ─── HANDMATIGE SCHETS TOOL ───────────────────────────────────────────────────
function SchetsTool({onSave,onClose}){
  const canvasRef=useRef();
  const [drawing,setDrawing]=useState(false);
  const [tool,setTool]=useState("pen");
  const [kleur,setKleur]=useState("#ffd000");
  const [dikte,setDikte]=useState(2);
  const [aiDesc,setAiDesc]=useState("");
  const [aiLoad,setAiLoad]=useState(false);
  const last=useRef(null);

  useEffect(()=>{
    const cv=canvasRef.current;cv.width=800;cv.height=500;
    const ctx=cv.getContext("2d");
    ctx.fillStyle="#111418";ctx.fillRect(0,0,800,500);
    ctx.strokeStyle="#1e232d";ctx.lineWidth=1;
    for(let x=0;x<800;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,500);ctx.stroke();}
    for(let y=0;y<500;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(800,y);ctx.stroke();}
    ctx.fillStyle="#1e232d";ctx.font="11px monospace";
    ctx.fillText("TECHNISCHE SCHETS / PLATTEGROND",10,20);
  },[]);

  const getPos=(e,cv)=>{const r=cv.getBoundingClientRect();const cl=e.touches?e.touches[0]:e;return{x:(cl.clientX-r.left)*(cv.width/r.width),y:(cl.clientY-r.top)*(cv.height/r.height)};};
  const start=e=>{setDrawing(true);last.current=getPos(e,canvasRef.current);};
  const move=e=>{
    if(!drawing)return;
    const cv=canvasRef.current;const ctx=cv.getContext("2d");const p=getPos(e,cv);
    if(tool==="pen"){ctx.beginPath();ctx.moveTo(last.current.x,last.current.y);ctx.lineTo(p.x,p.y);ctx.strokeStyle=kleur;ctx.lineWidth=dikte;ctx.lineCap="round";ctx.stroke();}
    else if(tool==="gum"){ctx.fillStyle="#111418";ctx.fillRect(p.x-15,p.y-15,30,30);}
    last.current=p;
  };
  const end=e=>{
    if(!drawing)return;setDrawing(false);
    const cv=canvasRef.current;const ctx=cv.getContext("2d");const p=getPos(e,cv);
    if(tool==="pijl"&&last.current){
      const from=last.current;ctx.strokeStyle=kleur;ctx.fillStyle=kleur;ctx.lineWidth=dikte+1;
      ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(p.x,p.y);ctx.stroke();
      const a=Math.atan2(p.y-from.y,p.x-from.x),hs=14+dikte;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-hs*Math.cos(a-0.4),p.y-hs*Math.sin(a-0.4));ctx.lineTo(p.x-hs*Math.cos(a+0.4),p.y-hs*Math.sin(a+0.4));ctx.closePath();ctx.fill();
    }else if(tool==="rect"&&last.current){
      ctx.strokeStyle=kleur;ctx.lineWidth=dikte+1;ctx.setLineDash([10,5]);
      ctx.strokeRect(last.current.x,last.current.y,p.x-last.current.x,p.y-last.current.y);ctx.setLineDash([]);
    }else if(tool==="tekst"){
      const t=prompt("Label:");if(t){
        ctx.font=`bold ${12+dikte*2}px monospace`;ctx.strokeStyle="#000";ctx.lineWidth=3;
        ctx.strokeText(t,p.x,p.y);ctx.fillStyle=kleur;ctx.fillText(t,p.x,p.y);
      }
    }
  };

  const genAI=async()=>{
    setAiLoad(true);
    const imgData=canvasRef.current.toDataURL("image/jpeg",0.85);
    const t=await callAI([{role:"user",content:[
      {type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgData.split(",")[1]}},
      {type:"text",text:"Dit is een technische schets van een beveiligingsoplossing. Geef:\n1. Beschrijving van de beveiligingsmaatregel\n2. Toepasselijke norm (EN 953, EN ISO 13857, EN 14120)\n3. Aanbevolen materialen en specificaties\n4. Installatieadvies"}
    ]}]);
    setAiDesc(t);setAiLoad(false);
  };

  const TOOLS=[{v:"pen",l:"✏️"},{v:"pijl",l:"➡️"},{v:"rect",l:"⬜"},{v:"tekst",l:"🔤"},{v:"gum",l:"🧹"}];
  const KLEUREN=["#ffd000","#ff3333","#ff8800","#44cc88","#4488ff","#fff","#888"];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:400,display:"flex",flexDirection:"column",alignItems:"center",padding:16,overflowY:"auto"}}>
      <div style={{background:C.dark,border:`1px solid ${C.yellow}`,borderRadius:6,padding:"8px 16px",marginBottom:10,width:"100%",maxWidth:840,textAlign:"center"}}>
        <span style={{fontFamily:"monospace",fontSize:12,color:C.yellow,fontWeight:700,letterSpacing:2}}>SCHETS TOOL</span>
        <span style={{fontSize:11,color:C.muted,marginLeft:10}}>Teken plattegrond, omheining, beveiligingszone...</span>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 14px",marginBottom:8,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",width:"100%",maxWidth:840}}>
        {TOOLS.map(t=><button key={t.v} onClick={()=>setTool(t.v)} style={{padding:"4px 10px",borderRadius:3,fontSize:13,cursor:"pointer",background:tool===t.v?C.yellow:"#1e232d",color:tool===t.v?"#000":C.text,border:"none",minWidth:34}}>{t.l}</button>)}
        <span style={{fontSize:11,color:C.muted,marginLeft:4}}>Kleur:</span>
        {KLEUREN.map(col=><div key={col} onClick={()=>setKleur(col)} style={{width:22,height:22,borderRadius:"50%",background:col,cursor:"pointer",border:kleur===col?"3px solid white":"2px solid #333",flexShrink:0}}/>)}
        <input type="range" min={1} max={8} value={dikte} onChange={e=>setDikte(+e.target.value)} style={{width:60}}/>
        <button onClick={()=>{const cv=canvasRef.current;const ctx=cv.getContext("2d");ctx.fillStyle="#111418";ctx.fillRect(0,0,cv.width,cv.height);}} style={{padding:"4px 10px",borderRadius:3,fontSize:11,cursor:"pointer",background:"#2a0a0a",color:"#ff6666",border:"1px solid #ff333333",fontFamily:"sans-serif"}}>🗑️ Wis</button>
      </div>
      <canvas ref={canvasRef} style={{display:"block",width:"100%",maxWidth:840,borderRadius:6,border:`1px solid ${C.border}`,cursor:"crosshair",touchAction:"none"}}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={e=>{e.preventDefault();start(e);}} onTouchMove={e=>{e.preventDefault();move(e);}} onTouchEnd={end}
      />
      {aiDesc&&<AIBox label="AI ANALYSE SCHETS">{aiDesc}</AIBox>}
      <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap",justifyContent:"center"}}>
        <Btn variant="blue" onClick={genAI} disabled={aiLoad}>{aiLoad?"⏳ Analyseren...":"🤖 AI Analyseer schets"}</Btn>
        <Btn onClick={()=>onSave(canvasRef.current.toDataURL("image/jpeg",0.85),aiDesc)}>💾 Opslaan in verslag</Btn>
        <Btn variant="ghost" onClick={onClose}>✕ Sluiten</Btn>
      </div>
    </div>
  );
}

// ─── FOTO UPLOADER ────────────────────────────────────────────────────────────
function FotoUploader({fotos=[],onAdd,onRemove,onAIoplossing,onManueel,aiJobs={}}){
  const refCamera=useRef();
  const refLibrary=useRef();
  const handle=async e=>{const imgs=await Promise.all(Array.from(e.target.files).map(f=>resizeImg(f)));onAdd(imgs);e.target.value="";};
  return (
    <div style={{marginTop:10}}>
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        <button onClick={()=>refCamera.current.click()}
          style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",background:"#0d1a0d",border:"1px solid #44cc8844",borderRadius:4,color:"#44cc88",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>
          📷 Foto nemen
        </button>
        <button onClick={()=>refLibrary.current.click()}
          style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",background:"#0d1020",border:"1px solid #4488ff44",borderRadius:4,color:"#88aaff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif"}}>
          🖼️ Uit bibliotheek
        </button>
      </div>
      <input ref={refCamera} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handle}/>
      <input ref={refLibrary} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handle}/>
      {fotos.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:9}}>
          {fotos.map((src,i)=>{
            const job=aiJobs[i];
            const klaar=job==="klaar";
            return (
              <div key={i} style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{position:"relative",width:80,height:80}}>
                  <img src={src} style={{width:80,height:80,objectFit:"cover",borderRadius:4,border:`1px solid ${klaar?"#44cc8888":"#252a35"}`,display:"block"}} alt=""/>
                  {job&&job!=="klaar"&&<ProgressBadge seconden={job.estimated||10}/>}
                  {klaar&&<div style={{position:"absolute",top:3,left:3,background:"#44cc88",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>✓</div>}
                </div>
                {!job&&(
                  <div style={{display:"flex",gap:3}}>
                    <button onClick={()=>onAIoplossing&&onAIoplossing(i)}
                      style={{flex:1,padding:"3px 4px",fontSize:8,fontWeight:700,background:"#162440",color:"#88bbff",border:"1px solid #2255aa44",borderRadius:3,cursor:"pointer",fontFamily:"sans-serif",whiteSpace:"nowrap"}}>
                      ⚡ AI
                    </button>
                    <button onClick={()=>onManueel&&onManueel(i)}
                      style={{flex:1,padding:"3px 4px",fontSize:8,fontWeight:700,background:"#1a1a2a",color:"#aaa",border:"1px solid #33333444",borderRadius:3,cursor:"pointer",fontFamily:"sans-serif",whiteSpace:"nowrap"}}>
                      ✏️
                    </button>
                  </div>
                )}
                {klaar&&<div style={{width:80,textAlign:"center",fontSize:9,color:"#44cc88",fontWeight:700}}>✓ Klaar</div>}
                {job&&job!=="klaar"&&<div style={{width:80,textAlign:"center",fontSize:9,color:C.yellow}}>⚡ Bezig...</div>}
                <button onClick={()=>onRemove(i)} style={{position:"absolute",top:-5,right:-5,background:C.red,color:"#fff",border:"none",borderRadius:"50%",width:17,height:17,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontWeight:800}}>×</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── KINNEY PICKER ────────────────────────────────────────────────────────────
function KinneyPicker({value={},onChange}){
  const score=value.E&&value.P&&value.G?value.E*value.P*value.G:null;
  const lvl=score?kinneyLvl(score):null;
  return (
    <div style={{marginTop:12}}>
      <div style={{fontSize:10,color:C.yellow,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8,fontFamily:"monospace"}}>Kinney Risicoanalyse</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[{k:"E",l:"Blootstelling (E)",opts:KINNEY_E},{k:"P",l:"Kans (P)",opts:KINNEY_P},{k:"G",l:"Ernst (G)",opts:KINNEY_G}].map(({k,l,opts})=>(
          <Field key={k} label={l}>
            <Sel value={value[k]||""} onChange={e=>onChange({...value,[k]:parseFloat(e.target.value)||""})}>
              <option value="">— kies —</option>
              {opts.map(o=><option key={o.v} value={o.v}>{o.l} ({o.v})</option>)}
            </Sel>
          </Field>
        ))}
        {score&&(
          <div style={{gridColumn:"span 3",display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:4,background:lvl.c+"18",border:`1px solid ${lvl.c}44`}}>
            <div style={{fontSize:26,fontWeight:800,fontFamily:"monospace",color:lvl.c}}>{score}</div>
            <div><div style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:lvl.c}}>{lvl.t}</div><div style={{fontSize:10,color:"#445",marginTop:2}}>E × P × G = Risicoscore</div></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DOCUMENT UPLOADER ────────────────────────────────────────────────────────
function DocumentUploader({docs=[],onAdd,onRemove,onAnalyze}){
  const ref=useRef();
  const [type,setType]=useState("ce");
  const [analyzing,setAnalyzing]=useState(null);
  const handle=async e=>{
    const files=Array.from(e.target.files);
    for(const file of files){
      const b64=await fileToBase64(file);
      onAdd({id:Date.now()+Math.random(),type,label:DOC_TYPES.find(d=>d.key===type)?.label,name:file.name,size:file.size,b64,mime:file.type,aiAnalysis:""});
    }
    e.target.value="";
  };
  const analyse=async(doc,idx)=>{
    setAnalyzing(idx);
    let content;
    if(doc.mime?.startsWith("image/")){
      content=[{type:"image",source:{type:"base64",media_type:doc.mime,data:doc.b64.split(",")[1]}},{type:"text",text:`Dit is een "${doc.label}" document. Analyseer en geef:\n1. Samenvatting inhoud\n2. Relevante conformiteitsinfo\n3. Aandachtspunten voor veiligheidsinspectie`}];
    }else{
      content=`Document "${doc.name}" van type "${doc.label}" geüpload. Beschrijf wat dit document typisch bevat en welke conformiteitsaspecten relevant zijn.`;
    }
    const t=await callAI([{role:"user",content}]);
    onAnalyze(idx,t);setAnalyzing(null);
  };
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:1,minWidth:200}}><Sel value={type} onChange={e=>setType(e.target.value)}>{DOC_TYPES.map(d=><option key={d.key} value={d.key}>{d.icon} {d.label}</option>)}</Sel></div>
        <Btn variant="ghost" style={{fontSize:10,padding:"8px 14px"}} onClick={()=>ref.current.click()}>📎 Uploaden</Btn>
        <input ref={ref} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" multiple style={{display:"none"}} onChange={handle}/>
      </div>
      {docs.length>0&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {docs.map((doc,i)=>{
            const dt=DOC_TYPES.find(d=>d.key===doc.type);
            return (
              <div key={doc.id} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:18}}>{dt?.icon||"📄"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.name}</div>
                    <div style={{fontSize:10,color:C.muted}}>{doc.label} · {(doc.size/1024).toFixed(0)} KB</div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <Btn variant="blue" style={{fontSize:9,padding:"4px 10px"}} disabled={analyzing===i} onClick={()=>analyse(doc,i)}>{analyzing===i?"⏳":"🤖"} Analyseer</Btn>
                    <Btn variant="danger" style={{fontSize:9,padding:"4px 10px"}} onClick={()=>onRemove(i)}>✕</Btn>
                  </div>
                </div>
                {doc.mime?.startsWith("image/")&&<img src={doc.b64} style={{maxWidth:"100%",maxHeight:120,marginTop:8,borderRadius:3,display:"block"}} alt=""/>}
                {doc.aiAnalysis&&<AIBox label="AI DOCUMENT ANALYSE">{doc.aiAnalysis}</AIBox>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ACTIE KEUZEMENU ─────────────────────────────────────────────────────────
function ActieKeuzeMenu({value, onChange}){
  const [open, setOpen] = useState(false);
  const [vrijeTekst, setVrijeTekst] = useState(false);
  const selecteer = (item) => {
    if(item === "Andere maatregel (zie omschrijving)"){setVrijeTekst(true);onChange("");}
    else{setVrijeTekst(false);onChange(item);}
    setOpen(false);
  };
  const isAnder = vrijeTekst || (value && !ACTIES_OPTIES.flatMap(g=>g.items).includes(value));
  return (
    <div style={{position:"relative"}}>
      {!isAnder&&(
        <div onClick={()=>setOpen(!open)}
          style={{width:"100%",background:C.bg,border:`1px solid ${open?"#ffd000":"#252a35"}`,borderRadius:4,color:value?C.text:"#445",padding:"9px 36px 9px 13px",fontSize:13,cursor:"pointer",boxSizing:"border-box",position:"relative",userSelect:"none"}}>
          {value||"— Selecteer een maatregel —"}
          <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"#556",fontSize:10}}>{open?"▲":"▼"}</span>
        </div>
      )}
      {isAnder&&(
        <div style={{display:"flex",gap:6}}>
          <Txa value={value} onChange={e=>onChange(e.target.value)} rows={2} placeholder="Beschrijf de vereiste maatregel..."/>
          <button onClick={()=>{setVrijeTekst(false);onChange("");}}
            style={{padding:"0 8px",background:"#1e232d",border:`1px solid ${C.border}`,borderRadius:4,color:"#778",cursor:"pointer",fontSize:11,alignSelf:"flex-start",marginTop:2}}>
            ← lijst
          </button>
        </div>
      )}
      {open&&!isAnder&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#13161b",border:`1px solid ${C.yellow}44`,borderRadius:4,zIndex:300,maxHeight:320,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.6)"}}>
          {ACTIES_OPTIES.map(groep=>(
            <div key={groep.groep}>
              <div style={{padding:"6px 12px",fontSize:9,fontWeight:800,color:C.yellow,letterSpacing:2,textTransform:"uppercase",fontFamily:"monospace",background:"#0d0f12",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0}}>
                {groep.groep}
              </div>
              {groep.items.map(item=>(
                <div key={item} onClick={()=>selecteer(item)}
                  style={{padding:"8px 14px",fontSize:12,color:value===item?C.yellow:C.text,cursor:"pointer",background:value===item?"#1a1f0a":"transparent",borderBottom:`1px solid ${C.border}22`}}
                  onMouseEnter={e=>e.currentTarget.style.background="#1a1e27"}
                  onMouseLeave={e=>e.currentTarget.style.background=value===item?"#1a1f0a":"transparent"}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── VRAAG ROW ────────────────────────────────────────────────────────────────
function VraagRow({vraag,sectieId,antwoord={},onUpdate}){
  const [aiAnalyseLoading,setAiAnalyseLoading]=useState(false);
  const [aiJobs,setAiJobs]=useState({});
  const [modalIdx,setModalIdx]=useState(null);
  const borderColor=antwoord.value?{ok:C.green,nok:C.red,todo:"#ffcc00",na:"#445"}[antwoord.value]:C.border;

  const runAI=async()=>{
    setAiAnalyseLoading(true);
    const fotos=antwoord.fotos||[];
    const prompt=`Codex arbeidsmiddelen – vraag: "${vraag}"\nStatus: ${antwoord.value==="nok"?"NIET CONFORM":"ACTIE VEREIST"}\nOpmerking: ${antwoord.note||"(geen)"}\n\nGeef:\n1. 📋 BEVINDING\n2. ⚖️ WETTELIJKE GRONDSLAG\n3. 🔧 AANBEVOLEN ACTIE\n4. 💶 KOSTKLASSE\n5. ⏱️ PRIORITEIT`;
    const cnt=fotos.length>0?[...fotos.map(b64=>({type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64.split(",")[1]}})),{type:"text",text:prompt}]:prompt;
    const r=await callAI([{role:"user",content:cnt}]);
    onUpdate({...antwoord,aiAnalysis:r});
    setAiAnalyseLoading(false);
  };

  const startAIOplossingAchtergrond=async(fotoIdx)=>{
    const src=antwoord.fotos?.[fotoIdx];
    if(!src) return;
    const ESTIMATED=10;
    setAiJobs(p=>({...p,[fotoIdx]:{estimated:ESTIMATED}}));
    try {
      const b64=src.split(",")[1]||src;
      const res=await callAIDrawing(b64,vraag,antwoord.note||"");
      const annotated=await tekenAnnotatieOpAfbeelding(src,res.tekeningen||[]);
      const desc=`${res.beschrijving||""}${res.norm?" | Norm: "+res.norm:""}${res.kostklasse?" | Kosten: "+res.kostklasse:""}`;
      const fotos=[...(antwoord.fotos||[])];
      const oplossingen=[...(antwoord.aiOplossingen||[])];
      fotos.push(annotated);
      oplossingen.push(desc);
      onUpdate({...antwoord,fotos,aiOplossingen:oplossingen});
      setAiJobs(p=>({...p,[fotoIdx]:"klaar"}));
    } catch(e){
      setAiJobs(p=>({...p,[fotoIdx]:"klaar"}));
    }
  };

  const slaManueelOp=(newSrc,desc)=>{
    const fotos=[...(antwoord.fotos||[])];
    const oplossingen=[...(antwoord.aiOplossingen||[])];
    fotos.push(newSrc);
    oplossingen.push(desc);
    onUpdate({...antwoord,fotos,aiOplossingen:oplossingen});
    setModalIdx(null);
  };

  return (
    <>
      {modalIdx!==null&&antwoord.fotos?.[modalIdx]&&(
        <AIOplossingModal
          src={antwoord.fotos[modalIdx]}
          vraag={vraag}
          context={antwoord.note||""}
          onSave={slaManueelOp}
          onClose={()=>setModalIdx(null)}
          manueleStart={true}
        />
      )}
      <div style={{background:C.bg,border:`1px solid ${C.border}`,borderLeft:`3px solid ${borderColor}`,borderRadius:5,padding:14,marginBottom:9}}>
        <div style={{fontSize:13,color:C.text,lineHeight:1.6,marginBottom:10}}>{vraag}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
          {[{v:"ok",l:"✅ Conform",c:C.green},{v:"nok",l:"❌ Niet conform",c:C.red},{v:"todo",l:"⚠️ Actie vereist",c:"#ffcc00"},{v:"na",l:"⚪ N.v.t.",c:"#667"}].map(({v,l,c})=>(
            <button key={v} onClick={()=>onUpdate({...antwoord,value:v})}
              style={{padding:"5px 11px",borderRadius:4,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif",background:antwoord.value===v?c+"22":"transparent",color:antwoord.value===v?c:"#556",border:`1px solid ${antwoord.value===v?c:"#33333444"}`,transition:"all .1s"}}>
              {l}
            </button>
          ))}
        </div>
        <FotoUploader
          fotos={antwoord.fotos||[]}
          aiJobs={aiJobs}
          onAdd={imgs=>onUpdate({...antwoord,fotos:[...(antwoord.fotos||[]),...imgs]})}
          onRemove={i=>{const f=[...(antwoord.fotos||[])];f.splice(i,1);setAiJobs(p=>{const n={...p};delete n[i];return n;});onUpdate({...antwoord,fotos:f});}}
          onAIoplossing={i=>startAIOplossingAchtergrond(i)}
          onManueel={i=>setModalIdx(i)}
        />
        {(antwoord.value==="nok"||antwoord.value==="todo")&&(
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
            <Field label="Opmerking / beschrijving afwijking">
              <Txa value={antwoord.note||""} onChange={e=>onUpdate({...antwoord,note:e.target.value})} placeholder="Beschrijf de afwijking of vereiste actie..."/>
            </Field>
            <KinneyPicker value={antwoord.kinney||{}} onChange={k=>onUpdate({...antwoord,kinney:k})}/>
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:8,flexWrap:"wrap"}}>
              <Btn variant="ghost" style={{fontSize:10,padding:"6px 13px"}} disabled={aiAnalyseLoading} onClick={runAI}>
                {aiAnalyseLoading?"⏳ Analyseren...":"🤖 AI Analyse & Aanbeveling"}
              </Btn>
              {aiAnalyseLoading&&(
                <span style={{fontSize:10,color:C.yellow,fontFamily:"monospace"}}>werkt op achtergrond — ga gerust verder</span>
              )}
            </div>
            {antwoord.aiAnalysis&&<AIBox label="AI ANALYSE & AANBEVELING">{antwoord.aiAnalysis}</AIBox>}
          </div>
        )}
        {antwoord.aiOplossingen?.some(d=>d)&&(
          <div style={{marginTop:8,padding:8,background:"#071410",border:"1px solid #1a4030",borderRadius:4}}>
            <div style={{fontSize:10,color:C.yellow,fontWeight:700,fontFamily:"monospace",marginBottom:6}}>▸ AI OPLOSSINGEN</div>
            {antwoord.aiOplossingen.map((d,i)=>d&&<div key={i} style={{fontSize:11,color:"#7abfa0",marginBottom:3}}>📐 {d.substring(0,100)}...</div>)}
          </div>
        )}
      </div>
    </>
  );
}

// ─── BEWERKBARE BEVINDING ─────────────────────────────────────────────────────
function BewerkbareBevinding({f, onUpdate}){
  const [bewerken,setBewerken]=useState(false);
  const [notitie,setNotitie]=useState(f.a.note||"");
  const [wetgeving,setWetgeving]=useState(f.a.wetgeving||"");
  const [actie,setActie]=useState(f.a.actie||"");
  const [regenLoading,setRegenLoading]=useState(false);
  const k=f.a.kinney||{};
  const sc=k.E&&k.P&&k.G?k.E*k.P*k.G:null;
  const lv=sc?kinneyLvl(sc):null;
  const alleFotos=[...(f.a.fotos||[])];

  const slaOp=()=>{onUpdate(f.key,{...f.a,note:notitie,wetgeving,actie});setBewerken(false);};

  const herGenereer=async()=>{
    setRegenLoading(true);
    const prompt=`Codex arbeidsmiddelen – vraag: "${f.v}"\nSectie: ${f.s.id} – ${f.s.title}\nStatus: ${f.a.value==="nok"?"NIET CONFORM":"ACTIE VEREIST"}\nOpmerking: ${notitie||"(geen)"}\n\nGeef een UITGEBREIDE analyse:\n1. 📋 BEVINDING\n2. ⚖️ WETTELIJKE GRONDSLAG (Codex artikel, EU richtlijn, EN-norm)\n3. 🔧 AANBEVOLEN ACTIE\n4. 💶 KOSTKLASSE\n5. ⏱️ PRIORITEIT & DEADLINE\n6. ✅ CONFORMITEITSBEVESTIGING`;
    const content=alleFotos.length>0?[...alleFotos.map(b64=>({type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64.split(",")[1]}})),{type:"text",text:prompt}]:prompt;
    const r=await callAI([{role:"user",content}]);
    onUpdate(f.key,{...f.a,note:notitie,wetgeving,actie,aiAnalysis:r});
    setRegenLoading(false);
  };

  return (
    <div style={{borderBottom:`1px solid ${C.border}`,paddingBottom:16,marginBottom:16}}>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",marginBottom:8}}>
        <Tag color="dark">{f.s.id}</Tag>
        <span style={{fontSize:11,color:"#556"}}>{f.s.title}</span>
        {sc&&<span style={{fontSize:9,fontWeight:800,letterSpacing:1,padding:"3px 9px",borderRadius:3,background:lv.c+"22",color:lv.c,border:`1px solid ${lv.c}44`}}>R={sc} · {lv.t}</span>}
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          <button onClick={()=>setBewerken(!bewerken)}
            style={{padding:"3px 10px",borderRadius:3,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif",background:bewerken?"#ffd00022":"#1e232d",color:bewerken?C.yellow:"#778",border:`1px solid ${bewerken?C.yellow:C.border}`}}>
            {bewerken?"✕ Sluiten":"✏️ Bewerken"}
          </button>
          <button onClick={herGenereer} disabled={regenLoading}
            style={{padding:"3px 10px",borderRadius:3,fontSize:10,fontWeight:700,cursor:regenLoading?"not-allowed":"pointer",fontFamily:"sans-serif",background:"#071410",color:"#44cc88",border:"1px solid #1a4030",opacity:regenLoading?0.5:1}}>
            {regenLoading?"⏳":"🔄"} Heranalyse
          </button>
        </div>
      </div>
      <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:8}}>{f.v}</div>
      {bewerken?(
        <div style={{background:"#0d1018",border:`1px solid ${C.yellow}33`,borderRadius:5,padding:14,marginBottom:10}}>
          <div style={{fontSize:10,color:C.yellow,fontWeight:700,fontFamily:"monospace",letterSpacing:1,marginBottom:10}}>✏️ BEWERK BEVINDING</div>
          <Field label="Opmerking / beschrijving afwijking">
            <Txa value={notitie} onChange={e=>setNotitie(e.target.value)} rows={3} placeholder="Beschrijf de afwijking..."/>
          </Field>
          <Field label="Wettelijke referentie / Codex artikel / EN-norm">
            <Inp value={wetgeving} onChange={e=>setWetgeving(e.target.value)} placeholder="bv. Codex Boek III Art. III.3-5 · EN ISO 13857:2019"/>
          </Field>
          <Field label="Vereiste actie / maatregel">
            <ActieKeuzeMenu value={actie} onChange={setActie}/>
          </Field>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn style={{fontSize:10,padding:"6px 14px"}} onClick={slaOp}>💾 Opslaan</Btn>
            <Btn variant="ghost" style={{fontSize:10,padding:"6px 14px"}} onClick={()=>setBewerken(false)}>Annuleren</Btn>
          </div>
        </div>
      ):(
        <>
          {notitie&&<div style={{fontSize:12,color:"#aab",borderLeft:`3px solid ${C.border}`,paddingLeft:10,marginBottom:6,lineHeight:1.6}}>{notitie}</div>}
          {wetgeving&&(
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#0a1828",border:"1px solid #2255aa44",borderRadius:4,padding:"5px 10px",marginBottom:6,fontSize:11,color:"#88aaff"}}>
              ⚖️ <span>{wetgeving}</span>
            </div>
          )}
          {actie&&<div style={{fontSize:12,color:"#88cc88",background:"#071410",border:"1px solid #1a4030",borderRadius:4,padding:"6px 10px",marginBottom:6}}>🔧 {actie}</div>}
        </>
      )}
      {alleFotos.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:8}}>
          {alleFotos.map((src,i)=><img key={i} src={src} style={{width:100,height:100,objectFit:"cover",borderRadius:4,border:"1px solid #252a35"}} alt=""/>)}
        </div>
      )}
      {f.a.aiAnalysis&&(
        <div style={{background:"#071410",border:"1px solid #1a4030",borderRadius:4,padding:13,marginTop:6,fontSize:12,color:"#7abfa0",lineHeight:1.75,whiteSpace:"pre-wrap"}}>
          <span style={{fontFamily:"monospace",fontSize:10,color:C.yellow,fontWeight:700,display:"block",marginBottom:7}}>▸ AI ANALYSE & WETGEVING</span>
          {f.a.aiAnalysis}
        </div>
      )}
      {f.a.aiOplossingen?.some(d=>d)&&(
        <div style={{background:"#07100a",border:"1px solid #1a3020",borderRadius:4,padding:10,marginTop:8}}>
          <span style={{fontFamily:"monospace",fontSize:10,color:C.yellow,fontWeight:700,display:"block",marginBottom:5}}>▸ AI OPLOSSINGEN OP FOTO</span>
          {f.a.aiOplossingen.map((d,i)=>d&&<div key={i} style={{fontSize:11,color:"#7abfa0",marginBottom:4,lineHeight:1.6}}>{d}</div>)}
        </div>
      )}
    </div>
  );
}

// ─── AUTO-INVULLEN PANEL ──────────────────────────────────────────────────────
function AutoInvullenPanel({ docs, onAntwoorden }) {
  const [loading, setLoading] = useState(false);
  const [voortgang, setVoortgang] = useState("");
  const [resultaat, setResultaat] = useState(null);
  const [eigenFotos, setEigenFotos] = useState([]);
  const [eigenDocs, setEigenDocs] = useState([]);
  const refFoto = useRef();
  const refDoc = useRef();

  const handleFotos = async (e) => {
    const files = Array.from(e.target.files);
    const imgs = await Promise.all(files.map(f => resizeImg(f, 800)));
    setEigenFotos(p => [...p, ...imgs]);
    e.target.value = "";
  };

  const handleDocs = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const b64 = await fileToBase64(file);
      setEigenDocs(p => [...p, { name: file.name, b64, mime: file.type, size: file.size }]);
    }
    e.target.value = "";
  };

  const analyseer = async () => {
    // Combineer alles: geüploade docs uit de documentenpagina + eigen fotos + eigen docs
    const allImgDocs = [
      ...docs.filter(d => d.mime?.startsWith('image/')),
      ...eigenDocs.filter(d => d.mime?.startsWith('image/')),
      ...eigenFotos.map((b64, i) => ({ b64, mime: 'image/jpeg', name: `foto_${i+1}.jpg` })),
    ];

    if (allImgDocs.length === 0) {
      setVoortgang("⚠️ Upload minstens 1 foto of afbeelding van het verslag/toestel.");
      return;
    }

    setLoading(true);
    setResultaat(null);
    setVoortgang(`🤖 AI analyseert ${allImgDocs.length} foto('s)/document(en)...`);
    try {
      const antw = await callAIAutoInvullen(allImgDocs);
      const count = Object.keys(antw).length;
      setResultaat({ antw, count });
      setVoortgang(`✅ ${count} vragen automatisch ingevuld!`);
    } catch(e) {
      setVoortgang("⚠️ Fout bij analyseren. Probeer opnieuw.");
    }
    setLoading(false);
  };

  const toepassen = () => {
    if (resultaat?.antw) {
      onAntwoorden(resultaat.antw);
    }
  };

  const totaalItems = docs.filter(d=>d.mime?.startsWith('image/')).length + eigenFotos.length + eigenDocs.filter(d=>d.mime?.startsWith('image/')).length;

  return (
    <div style={{background:"#0a1428",border:`2px solid ${C.yellow}`,borderRadius:8,padding:20,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <span style={{fontSize:24}}>🤖</span>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:C.yellow,letterSpacing:1}}>AUTO-INVULLEN VIA AI</div>
          <div style={{fontSize:11,color:C.muted}}>Upload foto's van het toestel of een vorig verslag → AI vult de volledige checklist automatisch in</div>
        </div>
      </div>

      {/* Upload zone */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,padding:14,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:6}}>📸</div>
          <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:4}}>Foto's van het toestel</div>
          <div style={{fontSize:10,color:C.muted,marginBottom:10}}>Max. 20 foto's · AI ziet wat conform/niet conform is</div>
          <Btn variant="blue" onClick={()=>refFoto.current.click()} disabled={loading} style={{fontSize:10,padding:"7px 14px",width:"100%",justifyContent:"center"}}>
            📷 Foto's selecteren {eigenFotos.length>0?`(${eigenFotos.length})` :""}
          </Btn>
          <input ref={refFoto} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleFotos}/>
        </div>

        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,padding:14,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:6}}>📄</div>
          <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:4}}>Foto van vorig verslag</div>
          <div style={{fontSize:10,color:C.muted,marginBottom:10}}>Foto/scan van papieren verslag · AI leest en hergebruikt</div>
          <Btn variant="ghost" onClick={()=>refDoc.current.click()} disabled={loading} style={{fontSize:10,padding:"7px 14px",width:"100%",justifyContent:"center"}}>
            🖼️ Verslag-foto {eigenDocs.length>0?`(${eigenDocs.length})`:""}
          </Btn>
          <input ref={refDoc} type="file" accept="image/*,.jpg,.jpeg,.png" multiple style={{display:"none"}} onChange={handleDocs}/>
        </div>
      </div>

      {/* Preview thumbnails */}
      {(eigenFotos.length > 0 || eigenDocs.length > 0) && (
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12,padding:10,background:C.bg,borderRadius:6}}>
          {eigenFotos.map((src,i)=>(
            <div key={i} style={{position:"relative"}}>
              <img src={src} style={{width:52,height:52,objectFit:"cover",borderRadius:4,border:`1px solid ${C.yellow}44`}} alt=""/>
              <button onClick={()=>setEigenFotos(p=>p.filter((_,j)=>j!==i))}
                style={{position:"absolute",top:-4,right:-4,background:C.red,color:"#fff",border:"none",borderRadius:"50%",width:15,height:15,fontSize:9,cursor:"pointer",fontWeight:800}}>×</button>
            </div>
          ))}
          {eigenDocs.map((d,i)=>(
            <div key={i} style={{position:"relative",width:52,height:52,background:"#1a2030",borderRadius:4,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:2}}>
              <span style={{fontSize:18}}>📄</span>
              <span style={{fontSize:7,color:C.muted,textAlign:"center",overflow:"hidden",maxWidth:48}}>{d.name.substring(0,10)}</span>
              <button onClick={()=>setEigenDocs(p=>p.filter((_,j)=>j!==i))}
                style={{position:"absolute",top:-4,right:-4,background:C.red,color:"#fff",border:"none",borderRadius:"50%",width:15,height:15,fontSize:9,cursor:"pointer",fontWeight:800}}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Info over docs die al geladen zijn */}
      {docs.filter(d=>d.mime?.startsWith('image/')).length > 0 && (
        <div style={{fontSize:10,color:"#4466aa",background:"#0a1020",border:"1px solid #2244aa33",borderRadius:4,padding:"6px 10px",marginBottom:10}}>
          ℹ️ {docs.filter(d=>d.mime?.startsWith('image/')).length} document(en) van hierboven worden ook meegestuurd
        </div>
      )}

      {/* Analyseer knop */}
      <Btn
        onClick={analyseer}
        disabled={loading || totaalItems === 0}
        style={{padding:"11px 20px",fontSize:12,width:"100%",justifyContent:"center"}}
      >
        {loading ? "⏳ AI analyseert..." : totaalItems > 0 ? `🤖 Analyseer ${totaalItems} item(s) & vul checklist in` : "📸 Upload eerst foto's hierboven"}
      </Btn>

      {/* Status */}
      {voortgang && (
        <div style={{background:voortgang.startsWith("⚠️")?"#1a0808":"#071410",border:`1px solid ${voortgang.startsWith("⚠️")?"#ff333344":"#1a4030"}`,borderRadius:4,padding:10,marginTop:10,fontSize:11,color:voortgang.startsWith("⚠️")?"#ff8888":"#7abfa0"}}>
          {loading && "⟳ "}{voortgang}
        </div>
      )}

      {/* Resultaat */}
      {resultaat && (
        <div style={{background:"#071a0f",border:"1px solid #44cc8844",borderRadius:6,padding:14,marginTop:10}}>
          <div style={{fontSize:12,fontWeight:700,color:C.green,marginBottom:10}}>
            ✅ {resultaat.count} vragen klaar om toe te passen
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12,maxHeight:80,overflow:"auto"}}>
            {Object.entries(resultaat.antw).map(([key,val])=>(
              <span key={key} style={{
                fontSize:9,fontFamily:"monospace",padding:"2px 6px",borderRadius:3,fontWeight:700,
                background:val.value==="ok"?"#0a1a0f":val.value==="nok"?"#1a0808":"#1a1400",
                color:val.value==="ok"?C.green:val.value==="nok"?C.red:"#ffcc00",
                border:`1px solid ${val.value==="ok"?C.green+"44":val.value==="nok"?C.red+"44":"#ffcc0044"}`
              }}>{key} {val.value==="ok"?"✓":val.value==="nok"?"✗":"!"}</span>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={toepassen} style={{fontSize:11,padding:"9px 20px"}}>✅ Toepassen & naar checklist</Btn>
            <Btn variant="ghost" style={{fontSize:11}} onClick={()=>{setResultaat(null);setVoortgang("");}}>Annuleren</Btn>
          </div>
          <div style={{fontSize:10,color:"#445",marginTop:8}}>U kunt daarna alles nog handmatig aanpassen per vraag</div>
        </div>
      )}
    </div>
  );
}

// ─── BULK FOTO SECTIE ANALYSE ─────────────────────────────────────────────────
function BulkFotoSectie({ sectie, contextDocs, onAntwoorden, bestaandeFotos=[] }) {
  const [open, setOpen] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voortgang, setVoortgang] = useState("");
  const ref = useRef();

  const handleFotos = async (e) => {
    const files = Array.from(e.target.files);
    const imgs = await Promise.all(files.map(f => resizeImg(f, 800)));
    setFotos(p => [...p, ...imgs]);
    e.target.value = "";
  };

  const analyseer = async () => {
    if (fotos.length === 0) return;
    setLoading(true);
    setVoortgang(`🤖 AI analyseert ${fotos.length} foto's voor sectie ${sectie.id}...`);
    try {
      const resultaat = await callAIBulkFotoSectie(fotos, sectie, contextDocs);
      // Converteer naar antwoorden-formaat met foto's
      const antwoorden = {};
      for (const [qi, val] of Object.entries(resultaat)) {
        antwoorden[`${sectie.id}-${qi}`] = {
          value: val.value,
          note: val.note || "",
          wetgeving: val.wetgeving || "",
          fotos: fotos.slice(0, 3), // Eerste 3 foto's toevoegen als bewijs
        };
      }
      onAntwoorden(antwoorden);
      setVoortgang(`✅ ${Object.keys(antwoorden).length}/${sectie.vragen.length} vragen ingevuld`);
      setOpen(false);
    } catch(e) {
      setVoortgang("⚠️ Fout bij analyseren. Probeer opnieuw.");
    }
    setLoading(false);
  };

  return (
    <div style={{marginBottom:12}}>
      <button onClick={()=>setOpen(!open)}
        style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:"#0d1a28",border:`1px solid ${C.yellow}44`,borderRadius:6,color:C.yellow,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif",width:"100%",justifyContent:"space-between"}}>
        <span>📸 Bulk foto-analyse voor deze sectie ({sectie.vragen.length} vragen automatisch beantwoorden)</span>
        <span>{open?"▲":"▼"}</span>
      </button>

      {open && (
        <div style={{background:"#0a1020",border:`1px solid ${C.yellow}33`,borderRadius:"0 0 6px 6px",padding:16,marginTop:-1}}>
          <p style={{fontSize:11,color:C.muted,marginBottom:12,lineHeight:1.6}}>
            Upload foto's van het arbeidsmiddel → AI beantwoordt alle {sectie.vragen.length} vragen van sectie {sectie.id} automatisch.<br/>
            De foto's worden ook toegevoegd als bewijs in het verslag.
          </p>

          {/* Upload knop */}
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            <Btn variant="blue" onClick={()=>ref.current.click()} disabled={loading} style={{fontSize:10}}>
              📷 Foto's toevoegen ({fotos.length})
            </Btn>
            <input ref={ref} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleFotos}/>
            {fotos.length > 0 && (
              <Btn onClick={analyseer} disabled={loading} style={{fontSize:10}}>
                {loading ? "⏳ Analyseren..." : `🤖 Analyseer ${fotos.length} foto's`}
              </Btn>
            )}
            {fotos.length > 0 && (
              <Btn variant="ghost" onClick={()=>setFotos([])} style={{fontSize:10}}>🗑️ Wis</Btn>
            )}
          </div>

          {/* Foto preview grid */}
          {fotos.length > 0 && (
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
              {fotos.map((src, i) => (
                <div key={i} style={{position:"relative"}}>
                  <img src={src} style={{width:64,height:64,objectFit:"cover",borderRadius:4,border:`1px solid ${C.border}`,display:"block"}} alt=""/>
                  <button onClick={()=>setFotos(p=>p.filter((_,j)=>j!==i))}
                    style={{position:"absolute",top:-4,right:-4,background:C.red,color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Status */}
          {voortgang && (
            <div style={{background:"#071410",border:"1px solid #1a4030",borderRadius:4,padding:8,fontSize:11,color:"#7abfa0"}}>
              {loading && "⟳ "}{voortgang}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const STORAGE_KEY = "machinecheck_toestellen";

async function laadToestellen() {
  try {
    const r = await window.storage.get(STORAGE_KEY);
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}

async function slaToestelOp(toestel) {
  try {
    const lijst = await laadToestellen();
    const bestaand = lijst.findIndex(t => t.id === toestel.id);
    if (bestaand >= 0) lijst[bestaand] = toestel;
    else lijst.push(toestel);
    await window.storage.set(STORAGE_KEY, JSON.stringify(lijst));
    return true;
  } catch { return false; }
}

async function verwijderToestel(id) {
  try {
    const lijst = await laadToestellen();
    await window.storage.set(STORAGE_KEY, JSON.stringify(lijst.filter(t => t.id !== id)));
    return true;
  } catch { return false; }
}

function berekenKostTotaal(antwoorden) {
  const klassen = { "< €500": 250, "€500–2.000": 1250, "€2.000–10.000": 6000, "> €10.000": 15000 };
  let totaal = 0;
  Object.values(antwoorden).forEach(a => {
    if (a?.aiAnalysis) {
      Object.entries(klassen).forEach(([k, v]) => { if (a.aiAnalysis.includes(k)) totaal += v; });
    }
  });
  return totaal;
}

function berekenPrioriteiten(antwoorden) {
  const result = { dringend: 0, hoog: 0, normaal: 0 };
  Object.values(antwoorden).forEach(a => {
    if (a?.aiAnalysis) {
      if (a.aiAnalysis.toLowerCase().includes("dringend")) result.dringend++;
      else if (a.aiAnalysis.toLowerCase().includes("hoog")) result.hoog++;
      else if (a.aiAnalysis.toLowerCase().includes("normaal")) result.normaal++;
    }
  });
  return result;
}

function maakToestelRecord(machine, antwoorden, mode) {
  const alle = SECTIONS.flatMap(s => s.vragen.map((v, qi) => ({
    s, v, a: antwoorden[`${s.id}-${qi}`] || {}, key: `${s.id}-${qi}`
  })));
  const bev = alle.filter(x => x.a.value === "nok" || x.a.value === "todo");
  const ok = alle.filter(x => x.a.value === "ok").length;
  const nok = alle.filter(x => x.a.value === "nok").length;
  const td = alle.filter(x => x.a.value === "todo").length;
  const pct = (ok + nok + td) > 0 ? Math.round(ok / (ok + nok + td) * 100) : 0;
  const hoogsteKinney = Math.max(0, ...Object.values(antwoorden).map(a => {
    const k = a?.kinney || {};
    return k.E && k.P && k.G ? k.E * k.P * k.G : 0;
  }));
  const sectiestatus = {};
  SECTIONS.forEach(s => {
    const secBev = s.vragen.filter((_, qi) => {
      const v = antwoorden[`${s.id}-${qi}`]?.value;
      return v === "nok" || v === "todo";
    }).length;
    const secOk = s.vragen.filter((_, qi) => antwoorden[`${s.id}-${qi}`]?.value === "ok").length;
    sectiestatus[s.id] = secBev > 0 ? "nok" : secOk === s.vragen.length ? "ok" : "open";
  });
  const openActies = bev.map(f => ({
    sectie: f.s.id, vraag: f.v, status: f.a.value,
    opmerking: f.a.note || "", wetgeving: f.a.wetgeving || "",
    kinney: f.a.kinney ? (f.a.kinney.E || 0) * (f.a.kinney.P || 0) * (f.a.kinney.G || 0) : 0,
  }));
  return {
    id: `${machine.naam}_${machine.locatie}_${Date.now()}`.replace(/\s/g, "_"),
    datum: new Date().toISOString(), mode, machine,
    conformiteitsgraad: pct, nokCount: nok, todoCount: td, hoogsteKinney,
    kostTotaal: berekenKostTotaal(antwoorden),
    prioriteiten: berekenPrioriteiten(antwoorden),
    sectiestatus, openActies,
  };
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ onTerug, onNieuweInspectie }) {
  const [toestellen, setToestellen] = useState([]);
  const [laden, setLaden] = useState(true);
  const [filter, setFilter] = useState({ site: "", prioriteit: "", sectie: "" });
  const [sorteer, setSorteer] = useState("datum");
  const [geselecteerd, setGeselecteerd] = useState(null);

  useEffect(() => { laadToestellen().then(d => { setToestellen(d); setLaden(false); }); }, []);

  const verwijder = async (id) => {
    if (!confirm("Toestel verwijderen uit overzicht?")) return;
    await verwijderToestel(id);
    setToestellen(p => p.filter(t => t.id !== id));
  };

  const exportCSV = () => {
    const rows = [
      ["Naam", "Locatie", "Datum", "Type", "Conformiteit%", "Niet-conform", "Actie vereist", "Hoogste Kinney", "Kostschatting", "Dringend", "Hoog", "Normaal"],
      ...toestellen.map(t => [
        t.machine.naam, t.machine.locatie,
        new Date(t.datum).toLocaleDateString("nl-BE"),
        t.mode === "indienstelling" ? "Indienstelling" : "Gap Analyse",
        t.conformiteitsgraad + "%", t.nokCount, t.todoCount, t.hoogsteKinney,
        "€" + t.kostTotaal.toLocaleString("nl-BE"),
        t.prioriteiten?.dringend || 0, t.prioriteiten?.hoog || 0, t.prioriteiten?.normaal || 0,
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `machinecheck_overzicht_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const gefilterd = toestellen
    .filter(t => !filter.site || t.machine.locatie.toLowerCase().includes(filter.site.toLowerCase()))
    .filter(t => !filter.prioriteit ||
      (filter.prioriteit === "dringend" && (t.prioriteiten?.dringend || 0) > 0) ||
      (filter.prioriteit === "hoog" && (t.prioriteiten?.hoog || 0) > 0) ||
      (filter.prioriteit === "normaal" && t.conformiteitsgraad >= 80)
    )
    .filter(t => !filter.sectie || t.sectiestatus?.[filter.sectie] === "nok")
    .sort((a, b) => {
      if (sorteer === "conformiteit") return a.conformiteitsgraad - b.conformiteitsgraad;
      if (sorteer === "kinney") return b.hoogsteKinney - a.hoogsteKinney;
      if (sorteer === "kosten") return b.kostTotaal - a.kostTotaal;
      return new Date(b.datum) - new Date(a.datum);
    });

  const totaalKost = gefilterd.reduce((s, t) => s + (t.kostTotaal || 0), 0);
  const gemConf = gefilterd.length > 0 ? Math.round(gefilterd.reduce((s, t) => s + t.conformiteitsgraad, 0) / gefilterd.length) : 0;
  const totaalDringend = gefilterd.reduce((s, t) => s + (t.prioriteiten?.dringend || 0), 0);
  const sites = [...new Set(toestellen.map(t => t.machine.locatie))];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "sans-serif", color: C.text }}>
      <Topbar title="Safety Dashboard" sub="Overzicht alle arbeidsmiddelen"
        right={<>
          <Btn variant="ghost" style={{ fontSize: 10 }} onClick={exportCSV}>📥 Excel/CSV</Btn>
          <Btn style={{ fontSize: 10 }} onClick={onNieuweInspectie}>+ Nieuwe inspectie</Btn>
          <Btn variant="ghost" style={{ fontSize: 10 }} onClick={onTerug}>← Terug</Btn>
        </>}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
          {[
            { v: toestellen.length, l: "Toestellen", c: C.yellow },
            { v: gemConf + "%", l: "Gem. conformiteit", c: gemConf >= 80 ? C.green : gemConf >= 50 ? "#ffcc00" : C.red },
            { v: totaalDringend, l: "Dringende acties", c: C.red },
            { v: "€" + totaalKost.toLocaleString("nl-BE"), l: "Totale kostschatting", c: C.orange },
          ].map(k => (
            <div key={k.l} style={{ background: C.card, border: `1px solid ${k.c}44`, borderRadius: 6, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace", color: k.c }}>{k.v}</div>
              <div style={{ fontSize: 9, color: "#556", letterSpacing: 1, textTransform: "uppercase", marginTop: 3 }}>{k.l}</div>
            </div>
          ))}
        </div>
        <Card style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.yellow, fontFamily: "monospace", fontWeight: 700 }}>FILTER:</span>
            <select value={filter.site} onChange={e => setFilter(p => ({ ...p, site: e.target.value }))}
              style={{ background: C.bg, border: "1px solid #252a35", borderRadius: 3, color: C.text, padding: "5px 10px", fontSize: 11 }}>
              <option value="">Alle sites</option>
              {sites.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filter.prioriteit} onChange={e => setFilter(p => ({ ...p, prioriteit: e.target.value }))}
              style={{ background: C.bg, border: "1px solid #252a35", borderRadius: 3, color: C.text, padding: "5px 10px", fontSize: 11 }}>
              <option value="">Alle prioriteiten</option>
              <option value="dringend">🔴 Dringend</option>
              <option value="hoog">🟠 Hoog</option>
              <option value="normaal">🟢 Normaal</option>
            </select>
            <select value={filter.sectie} onChange={e => setFilter(p => ({ ...p, sectie: e.target.value }))}
              style={{ background: C.bg, border: "1px solid #252a35", borderRadius: 3, color: C.text, padding: "5px 10px", fontSize: 11 }}>
              <option value="">Alle secties</option>
              {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.id} – {s.title}</option>)}
            </select>
            <span style={{ fontSize: 10, color: C.yellow, fontFamily: "monospace", fontWeight: 700, marginLeft: 8 }}>SORTEER:</span>
            {[["datum", "Datum"], ["conformiteit", "Conformiteit"], ["kinney", "Risico"], ["kosten", "Kosten"]].map(([v, l]) => (
              <button key={v} onClick={() => setSorteer(v)}
                style={{ padding: "4px 10px", borderRadius: 3, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", background: sorteer === v ? C.yellow : "#1e232d", color: sorteer === v ? "#000" : "#778", border: "none" }}>
                {l}
              </button>
            ))}
          </div>
        </Card>
        {laden ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted }}>⏳ Laden...</div>
        ) : gefilterd.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 14, color: "#fff", marginBottom: 6 }}>Nog geen toestellen opgeslagen</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Voltooi een inspectie en klik "Opslaan in overzicht" in het verslag.</div>
            <Btn onClick={onNieuweInspectie}>+ Nieuwe inspectie starten</Btn>
          </Card>
        ) : (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#111418", borderBottom: `2px solid ${C.yellow}` }}>
                    {["Toestel", "Locatie", "Datum", "Type", "Conform%", "Kinney", "Kosten", "Dringend", "Hoog", "Acties", ""].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 9, color: C.yellow, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gefilterd.map((t, i) => {
                    const conf = t.conformiteitsgraad;
                    const confC = conf >= 80 ? C.green : conf >= 50 ? "#ffcc00" : C.red;
                    const kinneyLv = t.hoogsteKinney > 0 ? kinneyLvl(t.hoogsteKinney) : null;
                    return (
                      <tr key={t.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.bg : "#0f1117", cursor: "pointer" }}
                        onClick={() => setGeselecteerd(geselecteerd?.id === t.id ? null : t)}>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: C.text }}>{t.machine.naam}</td>
                        <td style={{ padding: "10px 12px", color: C.muted }}>{t.machine.locatie}</td>
                        <td style={{ padding: "10px 12px", color: "#445", fontFamily: "monospace", fontSize: 11 }}>{new Date(t.datum).toLocaleDateString("nl-BE")}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 2, background: t.mode === "indienstelling" ? C.green + "22" : C.yellow + "22", color: t.mode === "indienstelling" ? C.green : C.yellow }}>
                            {t.mode === "indienstelling" ? "INDIENST." : "GAP"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ flex: 1, height: 6, background: "#1e232d", borderRadius: 3, minWidth: 50 }}>
                              <div style={{ height: "100%", width: conf + "%", background: confC, borderRadius: 3 }} />
                            </div>
                            <span style={{ color: confC, fontWeight: 700, fontFamily: "monospace" }}>{conf}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          {kinneyLv ? <span style={{ color: kinneyLv.c, fontFamily: "monospace", fontWeight: 700 }}>{t.hoogsteKinney}</span> : <span style={{ color: "#334" }}>—</span>}
                        </td>
                        <td style={{ padding: "10px 12px", color: C.orange, fontFamily: "monospace" }}>
                          {t.kostTotaal > 0 ? "€" + t.kostTotaal.toLocaleString("nl-BE") : "—"}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          {(t.prioriteiten?.dringend || 0) > 0 ? <span style={{ background: C.red + "22", color: C.red, borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>{t.prioriteiten.dringend}</span> : <span style={{ color: "#334" }}>—</span>}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          {(t.prioriteiten?.hoog || 0) > 0 ? <span style={{ background: C.orange + "22", color: C.orange, borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>{t.prioriteiten.hoog}</span> : <span style={{ color: "#334" }}>—</span>}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <span style={{ color: C.muted, fontFamily: "monospace" }}>{t.openActies?.length || 0}</span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <button onClick={e => { e.stopPropagation(); verwijder(t.id); }}
                            style={{ background: "transparent", border: "none", color: "#445", cursor: "pointer", fontSize: 14 }}>🗑️</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        {geselecteerd && (
          <Card yellow style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{geselecteerd.machine.naam}</div>
                <div style={{ fontSize: 11, color: "#556" }}>{geselecteerd.machine.locatie} · {geselecteerd.machine.operator || "—"}</div>
              </div>
              <button onClick={() => setGeselecteerd(null)} style={{ background: "transparent", border: "none", color: "#889", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ fontSize: 10, color: C.yellow, fontWeight: 700, fontFamily: "monospace", letterSpacing: 1, marginBottom: 8 }}>STATUS PER SECTIE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
              {SECTIONS.map(s => {
                const status = geselecteerd.sectiestatus?.[s.id] || "open";
                const col = status === "ok" ? C.green : status === "nok" ? C.red : "#445";
                return (
                  <div key={s.id} title={s.title}
                    style={{ padding: "3px 8px", borderRadius: 3, fontSize: 10, fontWeight: 700, fontFamily: "monospace", background: col + "22", color: col, border: `1px solid ${col}44` }}>
                    {s.id}
                  </div>
                );
              })}
            </div>
            {geselecteerd.openActies?.length > 0 && (
              <>
                <div style={{ fontSize: 10, color: C.yellow, fontWeight: 700, fontFamily: "monospace", letterSpacing: 1, marginBottom: 8 }}>OPENSTAANDE ACTIES ({geselecteerd.openActies.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {geselecteerd.openActies.map((a, i) => {
                    const kLv = a.kinney > 0 ? kinneyLvl(a.kinney) : null;
                    return (
                      <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderLeft: `3px solid ${a.status === "nok" ? C.red : "#ffcc00"}`, borderRadius: 4, padding: "8px 12px" }}>
                        <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 3 }}>
                          <span style={{ fontSize: 9, fontFamily: "monospace", color: C.yellow, fontWeight: 700 }}>{a.sectie}</span>
                          <span style={{ fontSize: 11, color: C.text, flex: 1 }}>{a.vraag}</span>
                          {kLv && <span style={{ fontSize: 9, color: kLv.c, fontFamily: "monospace", fontWeight: 700 }}>R={a.kinney}</span>}
                        </div>
                        {a.opmerking && <div style={{ fontSize: 11, color: "#778", marginTop: 2 }}>{a.opmerking}</div>}
                        {a.wetgeving && <div style={{ fontSize: 10, color: "#4466aa", marginTop: 2 }}>⚖️ {a.wetgeving}</div>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── RAPPORT ──────────────────────────────────────────────────────────────────
function Rapport({mode,machine,antwoorden,docs,schetsen,onTerug,onSaveToOverzicht}){
  const [samenvatting,setSamenvatting]=useState("");
  const [samBewerken,setSamBewerken]=useState(false);
  const [loading,setLoading]=useState(false);
  const [lokaalAntw,setLokaalAntw]=useState(()=>({...antwoorden}));

  const updateBevinding=(key,nieuw)=>setLokaalAntw(p=>({...p,[key]:nieuw}));

  const alle=SECTIONS.flatMap(s=>s.vragen.map((v,qi)=>({s,v,a:lokaalAntw[`${s.id}-${qi}`]||{},key:`${s.id}-${qi}`})));
  const bev=alle.filter(x=>x.a.value==="nok"||x.a.value==="todo");
  const ok=alle.filter(x=>x.a.value==="ok").length;
  const nok=alle.filter(x=>x.a.value==="nok").length;
  const td=alle.filter(x=>x.a.value==="todo").length;
  const pct=(ok+nok+td)>0?Math.round(ok/(ok+nok+td)*100):0;
  const hoog=bev.filter(x=>{const k=x.a.kinney||{};return k.E&&k.P&&k.G&&k.E*k.P*k.G>=70;});
  const stmap={ok:{l:"✅ Conform",c:C.green},nok:{l:"❌ Niet conform",c:C.red},todo:{l:"⚠️ Actie vereist",c:"#ffcc00"},na:{l:"⚪ N.v.t.",c:"#445"}};

  const genSam=async()=>{
    setLoading(true);
    const t=await callAI([{role:"user",content:
      `Schrijf een professionele managementsamenvatting (max 450 woorden) voor:\nARBEIDSMIDDEL: ${machine.naam} | LOCATIE: ${machine.locatie} | S/N: ${machine.serienr||"—"}\nDATUM: ${new Date().toLocaleDateString("nl-BE",{day:"2-digit",month:"long",year:"numeric"})}\nTYPE: ${mode==="indienstelling"?"Indienstelling":"Gap Analyse"}\nConformiteitsgraad: ${pct}% | Niet-conform: ${nok} | Actie: ${td} | Hoge risico's: ${hoog.length}\nGeüploade documenten: ${docs.map(d=>d.label).join(", ")||"Geen"}\n\nBEVINDINGEN:\n${bev.map(f=>`[${f.s.id}] ${f.v} → ${f.a.value}${f.a.note?": "+f.a.note:""}${f.a.wetgeving?" | Wetgeving: "+f.a.wetgeving:""}`).join("\n")||"Geen"}\n\nStructuur:\n1) Algemene beoordeling\n2) Geüploade documenten\n3) Prioritaire risico's met wettelijke referenties\n4) Conformiteitsstatus per sectie\n5) Aanbevelingen met tijdlijn`
    }]);
    setSamenvatting(t);setLoading(false);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh"}}>
      <Topbar title="MachineCheck Pro" sub="Conformiteitsverslag"
        right={<>
          <span style={{fontSize:10,color:"#556",fontFamily:"monospace"}}>✏️ bewerkbaar</span>
          <Btn variant="ghost" onClick={onTerug}>← Terug</Btn>
          <Btn variant="blue" style={{fontSize:10}} onClick={()=>onSaveToOverzicht&&onSaveToOverzicht(lokaalAntw)}>💾 Opslaan in dashboard</Btn>
          <Btn onClick={()=>window.print()}>🖨️ PDF</Btn>
        </>}
      />
      <div style={{maxWidth:880,margin:"0 auto",padding:"24px 18px"}}>
        <Card yellow>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontSize:11,color:C.yellow,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Conformiteitsverslag Arbeidsmiddel</div>
              <div style={{fontSize:24,fontWeight:800,color:"#fff",marginBottom:6}}>{machine.naam}</div>
              <div style={{fontSize:12,color:"#556"}}>{machine.locatie}{machine.serienr?` · S/N: ${machine.serienr}`:""}{machine.operator?` · ${machine.operator}`:""}</div>
              {machine.bouwjaar&&<div style={{fontSize:11,color:"#445",marginTop:2}}>Bouwjaar: {machine.bouwjaar}{machine.categorie?` · ${machine.categorie}`:""}</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <Tag color={mode==="indienstelling"?"green":"yellow"}>{mode==="indienstelling"?"INDIENSTELLING":"GAP ANALYSE"}</Tag>
              <div style={{fontSize:11,color:"#445",marginTop:8}}>{new Date().toLocaleDateString("nl-BE",{day:"2-digit",month:"long",year:"numeric"})}</div>
            </div>
          </div>
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
          {[{v:`${pct}%`,l:"Conformiteitsgraad",c:pct>=80?C.green:pct>=50?"#ffcc00":C.red},{v:nok,l:"Niet-conform",c:C.red},{v:td,l:"Actie vereist",c:"#ffcc00"},{v:hoog.length,l:"Hoge risico's",c:C.orange}].map(k=>(
            <div key={k.l} style={{background:C.card,border:`1px solid ${k.c}44`,borderRadius:5,padding:14,textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:800,fontFamily:"monospace",color:k.c}}>{k.v}</div>
              <div style={{fontSize:9,color:"#556",letterSpacing:1,textTransform:"uppercase",marginTop:3}}>{k.l}</div>
            </div>
          ))}
        </div>
        {docs.length>0&&(
          <Card>
            <div style={{fontSize:12,fontWeight:700,color:C.yellow,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Geüploade Documenten ({docs.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
              {docs.map((doc,i)=>{const dt=DOC_TYPES.find(d=>d.key===doc.type);return <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:10}}><div style={{fontSize:16,marginBottom:4}}>{dt?.icon||"📄"}</div><div style={{fontSize:11,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.name}</div><div style={{fontSize:10,color:C.muted}}>{doc.label}</div></div>;})}
            </div>
          </Card>
        )}
        {schetsen.length>0&&(
          <Card>
            <div style={{fontSize:12,fontWeight:700,color:C.yellow,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Technische Schetsen ({schetsen.length})</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {schetsen.map((s,i)=>(
                <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:8,maxWidth:280}}>
                  <img src={s.img} style={{width:"100%",borderRadius:3,display:"block"}} alt=""/>
                  {s.desc&&<div style={{fontSize:11,color:"#7abfa0",marginTop:6,lineHeight:1.5}}>{s.desc.substring(0,120)}...</div>}
                </div>
              ))}
            </div>
          </Card>
        )}
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:12,fontWeight:700,color:C.yellow,letterSpacing:2,textTransform:"uppercase"}}>Managementsamenvatting</div>
            <div style={{display:"flex",gap:7}}>
              {samenvatting&&(
                <button onClick={()=>setSamBewerken(!samBewerken)}
                  style={{padding:"4px 11px",borderRadius:3,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif",background:samBewerken?"#ffd00022":"#1e232d",color:samBewerken?C.yellow:"#778",border:`1px solid ${samBewerken?C.yellow:C.border}`}}>
                  {samBewerken?"✕ Sluiten":"✏️ Bewerken"}
                </button>
              )}
              <Btn style={{fontSize:10}} onClick={genSam} disabled={loading}>
                {loading?"⏳ Genereren...":(samenvatting?"🔄 Hergeneer":"🤖 Genereer")}
              </Btn>
            </div>
          </div>
          {loading&&(
            <div style={{background:"#071410",border:"1px solid #1a4030",borderRadius:4,padding:14,textAlign:"center"}}>
              <div style={{fontSize:12,color:"#44cc88",marginBottom:6}}>⏳ AI genereert samenvatting...</div>
            </div>
          )}
          {!loading&&samenvatting&&samBewerken&&(
            <Txa value={samenvatting} onChange={e=>setSamenvatting(e.target.value)} rows={14}
              style={{fontSize:13,lineHeight:1.8,color:"#c0c8d0",width:"100%",background:"#0d1018",border:`1px solid ${C.yellow}44`,borderRadius:4,padding:12,fontFamily:"sans-serif",resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
          )}
          {!loading&&samenvatting&&!samBewerken&&(
            <div style={{fontSize:13,lineHeight:1.8,color:"#c0c8d0",whiteSpace:"pre-wrap"}}>{samenvatting}</div>
          )}
          {!loading&&!samenvatting&&(
            <div style={{fontSize:12,color:"#334",fontStyle:"italic"}}>Klik "Genereer" voor AI-samenvatting met exacte Codex-artikels en EN-normen.</div>
          )}
        </Card>
        {bev.length>0&&(
          <Card>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:700,color:C.yellow,letterSpacing:2,textTransform:"uppercase"}}>Bevindingen & Actiepunten ({bev.length})</div>
              <div style={{fontSize:10,color:"#556",fontFamily:"monospace"}}>✏️ klik "Bewerken" per rij · 🔄 heranalyse</div>
            </div>
            {bev.map(f=>(
              <BewerkbareBevinding key={f.key} f={f} onUpdate={updateBevinding}/>
            ))}
          </Card>
        )}
        <Card>
          <div style={{fontSize:12,fontWeight:700,color:C.yellow,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Volledige Checklijst</div>
          {SECTIONS.map(s=>(
            <div key={s.id} style={{marginBottom:16}}>
              <div style={{background:"#111418",borderLeft:`3px solid ${C.yellow}`,padding:"8px 14px",borderRadius:"0 4px 4px 0",marginBottom:7,display:"flex",alignItems:"center"}}>
                <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:C.yellow}}>{s.id}</span>
                <span style={{fontSize:12,fontWeight:600,color:C.text,marginLeft:10}}>{s.title}</span>
              </div>
              {s.vragen.map((v,qi)=>{
                const a=lokaalAntw[`${s.id}-${qi}`]||{};
                const st=stmap[a.value];
                return(
                  <div key={qi} style={{display:"flex",gap:8,padding:"4px 0",borderBottom:"1px solid #0e1016",alignItems:"flex-start"}}>
                    <span style={{minWidth:100,fontSize:10,fontFamily:"monospace",color:st?.c||"#334",flexShrink:0,marginTop:2}}>{st?.l||"— Niet ingevuld"}</span>
                    <div style={{flex:1}}>
                      <span style={{fontSize:11,color:"#667"}}>{v}</span>
                      {a.wetgeving&&<div style={{fontSize:10,color:"#4466aa",marginTop:2}}>⚖️ {a.wetgeving}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── INSTALLATIE GIDS ─────────────────────────────────────────────────────────
function InstallatieGids({onClose}){
  const [tab,setTab]=useState("artifact");
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.card,border:`1px solid ${C.yellow}`,borderRadius:8,width:"100%",maxWidth:640,maxHeight:"90vh",overflow:"auto"}}>
        <div style={{background:C.dark,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontFamily:"monospace",fontSize:13,color:C.yellow,fontWeight:700,letterSpacing:2}}>HOE GEBRUIKEN?</span>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#889",fontSize:18,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`}}>
          {[{v:"artifact",l:"▶️ Direct gebruiken"},{v:"vercel",l:"🚀 Vercel"},{v:"apikey",l:"🔑 API sleutel"}].map(t=>(
            <button key={t.v} onClick={()=>setTab(t.v)} style={{flex:1,padding:"10px 8px",background:tab===t.v?"#1a1f28":"transparent",color:tab===t.v?C.yellow:"#556",border:"none",borderBottom:tab===t.v?`2px solid ${C.yellow}`:"2px solid transparent",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"sans-serif"}}>{t.l}</button>
          ))}
        </div>
        <div style={{padding:24}}>
          {tab==="artifact"&&(
            <div>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:12}}>✅ Direct gebruiken in Claude.ai</div>
              <p style={{fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:16}}>Dit artifact werkt direct hier — geen installatie nodig.</p>
              {["1️⃣  Kies Indienstelling of Gap Analyse","2️⃣  Vul de machinegegevens in","3️⃣  Loop door de 19 secties","4️⃣  Voeg foto's toe → klik ⚡ AI per foto","5️⃣  Genereer het verslag → 🖨️ PDF"].map((s,i)=>(
                <div key={i} style={{fontSize:12,color:C.text,marginBottom:6,lineHeight:1.6}}>{s}</div>
              ))}
            </div>
          )}
          {tab==="apikey"&&(
            <div>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:12}}>🔑 Anthropic API Sleutel</div>
              {[
                {t:"1. Ga naar console.anthropic.com",d:"Log in of maak een account aan"},
                {t:"2. API Keys → Create Key",d:"Naam: 'MachineCheck Pro'"},
                {t:"3. Kopieer de sleutel (sk-ant-...)",d:"⚠️ U ziet hem maar 1 keer!"},
                {t:"4. Laad tegoed op",d:"Settings → Billing → min. $5"},
                {t:"5. Vercel env variable",d:"VITE_ANTHROPIC_API_KEY"},
              ].map((s,i)=>(
                <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:12,marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:4}}>{s.t}</div>
                  <div style={{fontSize:11,color:C.muted}}>{s.d}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HOOFDAPP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [stap,setStap]=useState("welkom");
  const [modus,setModus]=useState(null);
  const [machine,setMachine]=useState({naam:"",locatie:"",serienr:"",bouwjaar:"",operator:"",categorie:""});
  const [antwoorden,setAntwoorden]=useState({});
  const [activeSec,setActiveSec]=useState(0);
  const [docs,setDocs]=useState([]);
  const [schetsen,setSchetsen]=useState([]);
  const [showSchets,setShowSchets]=useState(false);
  const [showGids,setShowGids]=useState(false);
  const [video,setVideo]=useState(null);
  const [videoRes,setVideoRes]=useState("");
  const [videoLoad,setVideoLoad]=useState(false);
  const [autoIngevuld,setAutoIngevuld]=useState(0);
  const videoRef=useRef();

  const setAntw=(key,val)=>setAntwoorden(p=>({...p,[key]:val}));
  const beantwoord=Object.values(antwoorden).filter(a=>a?.value).length;
  const voortgang=Math.round(beantwoord/TOTAL*100);

  const resetAlles=()=>{
    setModus(null);
    setMachine({naam:"",locatie:"",serienr:"",bouwjaar:"",operator:"",categorie:""});
    setAntwoorden({});setActiveSec(0);setDocs([]);setSchetsen([]);
    setVideo(null);setVideoRes("");setAutoIngevuld(0);
  };

  const verwerkAutoAntwoorden=(nieuweAntw)=>{
    setAntwoorden(prev=>{
      const merged={...prev};
      for(const [key,val] of Object.entries(nieuweAntw)){
        merged[key]={...(prev[key]||{}), ...val};
      }
      return merged;
    });
    setAutoIngevuld(Object.keys(nieuweAntw).length);
    setTimeout(()=>{setActiveSec(0);setStap("checklist");},1200);
  };

  const slaOpInOverzicht=async(antwoordenFinaal)=>{
    const record=maakToestelRecord(machine,antwoordenFinaal,modus);
    const ok=await slaToestelOp(record);
    if(ok) alert(`✅ "${machine.naam}" opgeslagen in het overzicht!`);
    else alert("⚠️ Opslaan mislukt. Probeer opnieuw.");
  };

  const analyseVideo=async()=>{
    if(!video)return;setVideoLoad(true);
    const t=await callAI([{role:"user",content:`Video: "${video.name}" (${(video.size/1024/1024).toFixed(1)} MB). Analyseer als industriële machine:\n1. Veiligheidsrisico's\n2. Ontbrekende afschermingen\n3. Prioritaire actiepunten\n4. Oplossingen met prijsklasse`}]);
    setVideoRes(t);setVideoLoad(false);
  };

  if(stap==="welkom") return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"sans-serif",color:C.text}}>
      {showGids&&<InstallatieGids onClose={()=>setShowGids(false)}/>}
      <Topbar title="MachineCheck Pro" sub="Codex Welzijn op het Werk · Arbeidsmiddelen"
        right={<>
          <button onClick={()=>setShowGids(true)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:4,color:"#889",fontSize:11,padding:"6px 12px",cursor:"pointer",fontFamily:"sans-serif",fontWeight:700}}>❓ Hoe gebruiken</button>
          <Btn variant="blue" style={{fontSize:10}} onClick={()=>setStap("dashboard")}>📊 Dashboard</Btn>
          <Tag>HEIDELBERG MATERIALS</Tag>
        </>}
      />
      <div style={{maxWidth:720,margin:"0 auto",padding:"32px 20px"}}>
        <div style={{marginBottom:8}}><Tag color="dark">PREVENTIETOOL BELGIË</Tag></div>
        <div style={{fontSize:30,fontWeight:800,color:"#fff",letterSpacing:-1,lineHeight:1.15,marginBottom:10}}>Conformiteit<br/>Arbeidsmiddelen</div>
        <p style={{fontSize:13,color:"#778",lineHeight:1.7,marginBottom:26}}>
          AI-gestuurde inspectietool · 19 secties · {TOTAL} vragen · Kinney risicoanalyse<br/>
          📷 Foto-annotatie · 🤖 AI tekent oplossing op foto · 📐 Schets tool · 📊 Centraal overzicht
        </p>
        <div style={{fontSize:10,color:C.yellow,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Selecteer type analyse</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:26}}>
          {[{v:"indienstelling",ico:"🔧",ttl:"Indienstelling",dsc:"Nieuw arbeidsmiddel in gebruik nemen. Volledige conformiteitscheck vóór eerste gebruik conform art. III.1-2."},{v:"gap",ico:"📊",ttl:"Gap Analyse",dsc:"Bestaand arbeidsmiddel evalueren. Identificeer afwijkingen t.o.v. actuele wetgeving en normen."}].map(m=>(
            <div key={m.v} onClick={()=>setModus(m.v)} style={{background:modus===m.v?"#161a0d":C.card,border:`2px solid ${modus===m.v?C.yellow:C.border}`,borderRadius:8,padding:22,cursor:"pointer",transition:"all .15s"}}>
              <div style={{fontSize:26,marginBottom:10}}>{m.ico}</div>
              <div style={{fontSize:15,fontWeight:700,color:modus===m.v?C.yellow:C.text,marginBottom:5}}>{m.ttl}</div>
              <div style={{fontSize:11,color:"#445",lineHeight:1.6}}>{m.dsc}</div>
            </div>
          ))}
        </div>
        <Btn style={{padding:"12px 26px",fontSize:12}} disabled={!modus} onClick={()=>setStap("machine")}>START INSPECTIE →</Btn>
      </div>
    </div>
  );

  if(stap==="machine") return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"sans-serif",color:C.text}}>
      <Topbar title="MachineCheck Pro" right={<Tag color={modus==="indienstelling"?"green":"yellow"}>{modus==="indienstelling"?"INDIENSTELLING":"GAP ANALYSE"}</Tag>}/>
      <div style={{maxWidth:680,margin:"0 auto",padding:"28px 18px"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.yellow,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Gegevens Arbeidsmiddel</div>
        <Card>
          {[["naam","Naam / omschrijving *","bv. Draaibank Optimum D240 · Bandzaag · Pelletpers"],["locatie","Locatie / site *","bv. Argex Kleigebouw – Burcht · Heidelberg Zwijndrecht"],["serienr","Serienummer / inventarisnummer","bv. SN-2024-001"],["bouwjaar","Bouwjaar","bv. 2018"],["operator","Verantwoordelijke / operator","bv. Johan Van Laeken"],["categorie","Machinerichtlijn categorie","bv. Annex IV"]].map(([k,l,p])=>(
            <Field key={k} label={l}><Inp value={machine[k]} onChange={e=>setMachine({...machine,[k]:e.target.value})} placeholder={p}/></Field>
          ))}
        </Card>
        <Card>
          <div style={{fontSize:12,fontWeight:700,color:C.yellow,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Documenten uploaden</div>
          <p style={{fontSize:12,color:"#667",marginBottom:12}}>CE, DoC, handleidingen, risicoanalyses, VIK, WIK, eerdere verslagen</p>
          <DocumentUploader docs={docs} onAdd={d=>setDocs(p=>[...p,d])} onRemove={i=>{const nd=[...docs];nd.splice(i,1);setDocs(nd);}} onAnalyze={(i,t)=>{const nd=[...docs];nd[i]={...nd[i],aiAnalysis:t};setDocs(nd);}}/>
        </Card>

        {/* AUTO-INVULLEN PANEL */}
        <AutoInvullenPanel
          docs={docs}
          onAntwoorden={verwerkAutoAntwoorden}
        />

        {autoIngevuld>0&&(
          <div style={{background:"#071a0f",border:"1px solid #44cc8844",borderRadius:6,padding:12,marginBottom:14,fontSize:12,color:C.green,fontWeight:700}}>
            ✅ {autoIngevuld} vragen automatisch ingevuld — checklist wordt geopend...
          </div>
        )}
        <Card>
          <div style={{fontSize:12,fontWeight:700,color:C.yellow,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Videoanalyse (optioneel)</div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <Btn variant="ghost" style={{fontSize:10}} onClick={()=>videoRef.current.click()}>🎥 {video?video.name:"Video selecteren"}</Btn>
            <input ref={videoRef} type="file" accept="video/*" style={{display:"none"}} onChange={e=>setVideo(e.target.files[0])}/>
            {video&&<Btn style={{fontSize:10}} onClick={analyseVideo} disabled={videoLoad}>{videoLoad?"⏳ Analyseren...":"🤖 Analyseer"}</Btn>}
          </div>
          {videoRes&&<AIBox label="VIDEO ANALYSE">{videoRes}</AIBox>}
        </Card>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          <Btn variant="ghost" onClick={()=>setStap("welkom")}>← Terug</Btn>
          <Btn disabled={!machine.naam||!machine.locatie} onClick={()=>{setActiveSec(0);setStap("checklist");}}>START VRAGENLIJST →</Btn>
        </div>
      </div>
    </div>
  );

  if(stap==="checklist"){
    const sec=SECTIONS[activeSec];
    const secBeantwoord=sec.vragen.filter((_,qi)=>antwoorden[`${sec.id}-${qi}`]?.value).length;
    const isLaatste=activeSec===SECTIONS.length-1;
    return (
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:"sans-serif",color:C.text}}>
        {showSchets&&<SchetsTool onSave={(img,desc)=>{setSchetsen(p=>[...p,{img,desc}]);setShowSchets(false);}} onClose={()=>setShowSchets(false)}/>}
        <Topbar title="MachineCheck Pro" sub={`${machine.naam} · ${machine.locatie}`}
          right={<>
            <span style={{fontFamily:"monospace",fontSize:11,color:C.yellow}}>{beantwoord}/{TOTAL}</span>
            <Btn variant="blue" style={{fontSize:10}} onClick={()=>setShowSchets(true)}>📐 Schets</Btn>
            <Btn style={{fontSize:10}} onClick={()=>setStap("rapport")}>📋 Rapport</Btn>
          </>}
        />
        <div style={{maxWidth:760,margin:"0 auto",padding:"22px 18px"}}>
          <div style={{height:3,background:"#1e232d",borderRadius:2,marginBottom:18,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${voortgang}%`,background:C.yellow,borderRadius:2,transition:"width .4s"}}/>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:18}}>
            {SECTIONS.map((s,i)=>{
              const alleDone=s.vragen.every((_,qi)=>antwoorden[`${s.id}-${qi}`]?.value);
              const heeftNok=s.vragen.some((_,qi)=>["nok","todo"].includes(antwoorden[`${s.id}-${qi}`]?.value));
              let bg="#13161b",col="#445",border="1px solid #252a35";
              if(i===activeSec){bg=C.yellow;col="#000";border=`1px solid ${C.yellow}`;}
              else if(heeftNok){bg="#1a0808";col="#ff6666";border="1px solid #ff333333";}
              else if(alleDone){bg="#0a1a0f";col="#44cc88";border="1px solid #44cc8833";}
              return <button key={s.id} onClick={()=>setActiveSec(i)} style={{padding:"4px 9px",borderRadius:3,fontSize:10,fontWeight:700,fontFamily:"monospace",cursor:"pointer",background:bg,color:col,border,transition:"all .1s"}}>{s.id}</button>;
            })}
          </div>
          <div style={{background:"#111418",borderLeft:`3px solid ${C.yellow}`,padding:"9px 14px",borderRadius:"0 4px 4px 0",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center"}}>
              <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:C.yellow}}>{sec.id}</span>
              <span style={{fontSize:13,fontWeight:600,color:C.text,marginLeft:10}}>{sec.title}</span>
            </div>
            <span style={{fontSize:10,color:"#445",fontFamily:"monospace"}}>{secBeantwoord}/{sec.vragen.length}</span>
          </div>

          {/* BULK FOTO ANALYSE PER SECTIE */}
          <BulkFotoSectie
            sectie={sec}
            contextDocs={docs}
            bestaandeFotos={[]}
            onAntwoorden={(nieuweAntw)=>{
              setAntwoorden(prev=>{
                const merged={...prev};
                for(const [key,val] of Object.entries(nieuweAntw)){
                  merged[key]={...(prev[key]||{}), ...val};
                }
                return merged;
              });
            }}
          />
          {sec.vragen.map((v,qi)=>(
            <VraagRow key={`${sec.id}-${qi}`} vraag={v} sectieId={sec.id} antwoord={antwoorden[`${sec.id}-${qi}`]||{}} onUpdate={val=>setAntw(`${sec.id}-${qi}`,val)}/>
          ))}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:18,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
            <Btn variant="ghost" disabled={activeSec===0} onClick={()=>setActiveSec(p=>p-1)}>← Vorige</Btn>
            <span style={{fontFamily:"monospace",fontSize:11,color:"#334"}}>{activeSec+1} / {SECTIONS.length}</span>
            {isLaatste?<Btn onClick={()=>setStap("rapport")}>📋 Rapport →</Btn>:<Btn onClick={()=>setActiveSec(p=>p+1)}>Volgende →</Btn>}
          </div>
        </div>
      </div>
    );
  }

  if(stap==="rapport") return (
    <Rapport
      mode={modus} machine={machine} antwoorden={antwoorden}
      docs={docs} schetsen={schetsen}
      onTerug={()=>setStap("checklist")}
      onSaveToOverzicht={slaOpInOverzicht}
    />
  );

  if(stap==="dashboard") return (
    <Dashboard
      onTerug={()=>setStap("welkom")}
      onNieuweInspectie={()=>{resetAlles();setStap("welkom");}}
    />
  );

  return null;
}
