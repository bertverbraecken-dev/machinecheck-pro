import { useState, useRef, useEffect } from "react";

// ─── 19 SECTIES ──────────────────────────────────────────────────────────────
const SECTIES=[
  {id:"3.1",titel:"Besturingssysteem"},{id:"3.2",titel:"Inbedrijfstelling"},
  {id:"3.3",titel:"Stopzetten"},{id:"3.4",titel:"Noodstopknop"},
  {id:"3.5",titel:"Bescherming vallende/opspringende voorwerpen"},
  {id:"3.6",titel:"Bevestiging/stabiliteit"},{id:"3.7",titel:"Breuken – barsten"},
  {id:"3.8",titel:"Bescherming mechanische verbinding"},{id:"3.9",titel:"Verlichting"},
  {id:"3.10",titel:"Bescherming temperaturen"},{id:"3.11",titel:"Alarmsignalen"},
  {id:"3.12",titel:"Gebruik"},{id:"3.13",titel:"Onderhoudsverrichtingen"},
  {id:"3.14",titel:"Scheiding energiebron"},{id:"3.15",titel:"Waarschuwingen – signalisatie"},
  {id:"3.16",titel:"Toegankelijkheid"},{id:"3.17",titel:"Bescherming werknemers"},
  {id:"3.18",titel:"Preventie ontploffing"},{id:"3.19",titel:"Bescherming elektriciteit"},
];

// ─── ARGEX INSTALLATIES ──────────────────────────────────────────────────────
const ARGEX=[
  {id:'KVB-PB1',ref:"1.21.01+05+80",naam:"Platenband 1 + Haspel 1 + Auto. Smering",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-PB2',ref:"1.21.02+06",naam:"Platenband 2 + Haspel 2",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-PB3',ref:"1.21.03+07",naam:"Platenband 3 + Haspel 3",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-PB4',ref:"1.21.04+08",naam:"Platenband 4 + Haspel 4",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-PB5',ref:"1.21.09",naam:"Platenband 5 + Haspel 5",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-TS1',ref:"1.21.11+88",naam:"Tonstar 1 + Vrijmaker",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-TS2',ref:"1.21.13+89",naam:"Tonstar 2 + Vrijmaker",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-TS3',ref:"1.21.15+93",naam:"Tonstar 3 + Vrijmaker",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-TS4',ref:"1.21.17+94",naam:"Tonstar 4 + Vrijmaker",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-KG',ref:"1.21.35+37+38",naam:"Kollergang + Oliepomp + Oliekoeler",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#FFCC99"},
  {id:'KVB-TB',ref:"1.21.41-59",naam:"Transportbanden 41-59 + Weeg + Metaaldet.",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#CCFFCC"},
  {id:'KVB-DB1',ref:"1.21.60+62+84",naam:"Doseerband 1 + Triller + Weegtoestel",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#66FFFF"},
  {id:'KVB-DB2',ref:"1.21.61",naam:"Doseerband 2 + Haspel DB2",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#66FFFF"},
  {id:'KVB-VENT',ref:"1.21.90",naam:"Dak- & Muurventilatoren KVB",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#FFCCFF"},
  {id:'KVB-RB',ref:"1.21.91+92",naam:"Rolbrug Elektrisch + Mechanisch KVB",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#FFFFCC"},
  {id:'KVB-LS',ref:"LS",naam:"Laagspanning / Krachtkasten Tonstars",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#fff"},
  {id:'KVB-BUITEN',ref:"1.21.65-68",naam:"Uit dienst: Vijs + Elevator 1 + Band 31-32",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#FFFF00"},
  {id:'OV-DROOG',ref:"1.31.01+05+07+09",naam:"Droogoven + Oliepomp + Pendel + Hulpmotor",afd:"Oven",groep:"Oveninstallatie",kleur:"#F4B183"},
  {id:'OV-BRAND',ref:"1.31.15+19+21",naam:"Brandoven + Koelvent. + Pendel + Hulpmotor",afd:"Oven",groep:"Oveninstallatie",kleur:"#BDD7EE"},
  {id:'OV-SMER',ref:"1.31.25",naam:"Smering Stootschijven + Tandkrans",afd:"Oven",groep:"Oveninstallatie",kleur:"#FFD966"},
  {id:'OV-HDV',ref:"1.31.31",naam:"Hogedrukventilator Brander",afd:"Oven",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'OV-KOEL',ref:"1.31.33",naam:"Ventilator Koeling Ovenkop",afd:"Oven",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'OV-FUEL',ref:"1.31.38",naam:"Pomp Fueltank 2",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'OV-BROK',ref:"1.31.50",naam:"Pomp Brokkenval",afd:"Oven",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'OV-KWP',ref:"1.31.70+71",naam:"Koelwaterpompen 1 + 2",afd:"Oven",groep:"Oveninstallatie",kleur:"#C5E0B4"},
  {id:'OV-PILL',ref:"Pillard",naam:"Pillard Brander 25MW + Toebehoren",afd:"Oven",groep:"Oveninstallatie",kleur:"#D9E2F3"},
  {id:'OV-BRUG',ref:"Brug",naam:"Loopbrug naar Oven + Stelling",afd:"Oven",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'OV-CAM',ref:"Cam",naam:"Camerasysteem Ovenproces",afd:"Oven",groep:"Oveninstallatie",kleur:"#FFD966"},
  {id:'OV-BKCOMP',ref:"BK-Comp",naam:"Compressor Bruinkool Backup",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'OV-BKSILO',ref:"BK-Silo",naam:"Opslagsilo Bruinkool 250t",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#E2EFDA"},
  {id:'OV-AIRDOS',ref:"Airdos",naam:"Doseerinstallatie Airdos",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#E2EFDA"},
  {id:'OV-BIO',ref:"Bio",naam:"Biomassa Installatie",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#E2EFDA"},
  {id:'OV-TANKS',ref:"Tanks",naam:"2x Opslagtanks 30.000L + Verdeel",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#E2EFDA"},
  {id:'OV-ARGON',ref:"Argon",naam:"Inertisering Installatie Argon",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'EF-K123',ref:"1.32.05+06+07",naam:"Electrofilter Kamers 1-3",afd:"Electrofilter",groep:"Electrofilter",kleur:"#F4B183"},
  {id:'EF-RED',ref:"1.32.16",naam:"Redler 2",afd:"Electrofilter",groep:"Electrofilter",kleur:"#BDD7EE"},
  {id:'EF-CEL',ref:"1.32.17",naam:"Cellenrad EF",afd:"Electrofilter",groep:"Electrofilter",kleur:"#C5E0B4"},
  {id:'EF-MENG',ref:"1.32.18",naam:"Mengvijs",afd:"Electrofilter",groep:"Electrofilter",kleur:"#FFD966"},
  {id:'EF-SPIR',ref:"1.32.19",naam:"Spiraalvijs",afd:"Electrofilter",groep:"Electrofilter",kleur:"#E2EFDA"},
  {id:'EF-B55',ref:"1.32.35",naam:"Band 55",afd:"Electrofilter",groep:"Electrofilter",kleur:"#fff"},
  {id:'EF-ROER',ref:"1.32.42",naam:"Roerder",afd:"Electrofilter",groep:"Electrofilter",kleur:"#F8CBAD"},
  {id:'EF-BOX',ref:"1.32.43",naam:"Boxerpomp",afd:"Electrofilter",groep:"Electrofilter",kleur:"#D6DCE4"},
  {id:'EF-TREK',ref:"Schouw",naam:"Trekventilator Schouw",afd:"Electrofilter",groep:"Electrofilter",kleur:"#D9E2F3"},
  {id:'EF-ABB',ref:"ABB",naam:"ABB Emissiemeting",afd:"Electrofilter",groep:"Electrofilter",kleur:"#D9E2F3"},
  {id:'KT-FAN1',ref:"1.33.01",naam:"Koellucht Fan",afd:"Koeler",groep:"Koeler & Transport",kleur:"#fff"},
  {id:'KT-FAN2',ref:"1.33.02",naam:"Recup Lucht Fan",afd:"Koeler",groep:"Koeler & Transport",kleur:"#fff"},
  {id:'KT-FAN3',ref:"1.33.03",naam:"Overmaat Lucht Fan + Koelvent.",afd:"Koeler",groep:"Koeler & Transport",kleur:"#fff"},
  {id:'KT-C13',ref:"1.33.15+17",naam:"Cellenraden 1 + 3",afd:"Koeler",groep:"Koeler & Transport",kleur:"#C5E0B4"},
  {id:'KT-BR1',ref:"1.33.27",naam:"Breker 1",afd:"Koeler",groep:"Koeler & Transport",kleur:"#F4B183"},
  {id:'KT-BAND',ref:"1.33.30-38",naam:"Banden 61-67 (7 stuks)",afd:"Transport",groep:"Koeler & Transport",kleur:"#BDD7EE"},
  {id:'KT-EL23',ref:"1.33.35+36",naam:"Elevator 2 + 3",afd:"Transport",groep:"Koeler & Transport",kleur:"#E2EFDA"},
  {id:'KT-TAK',ref:"1.33.66",naam:"Takel Koelkelder Rijwerk",afd:"Koeler",groep:"Koeler & Transport",kleur:"#fff"},
  {id:'KT-LUSH',ref:"1.33.76",naam:"Hoofdvent. Ontstoffing Luscher",afd:"Transport",groep:"Koeler & Transport",kleur:"#fff"},
  {id:'ZF-ZIFT',ref:"1.41.01-05",naam:"Ziften 1-5 DANO",afd:"Zeefafd.",groep:"Zeefafdeling",kleur:"#fff"},
  {id:'ZF-EL45',ref:"1.41.10-11",naam:"Elevators 4-5",afd:"Zeefafd.",groep:"Zeefafdeling",kleur:"#fff"},
  {id:'ZF-BREK',ref:"1.41.15-18",naam:"Brekers 1A-2B",afd:"Zeefafd.",groep:"Zeefafdeling",kleur:"#fff"},
  {id:'ZF-BAND',ref:"1.41.20-28",naam:"Banden 81-89 (9 stuks)",afd:"Zeefafd.",groep:"Zeefafdeling",kleur:"#fff"},
  {id:'ZF-TRIL',ref:"1.41.35-39",naam:"Trillers 1-5",afd:"Zeefafd.",groep:"Zeefafdeling",kleur:"#fff"},
  {id:'ZF-VENT',ref:"1.41.46",naam:"Hoofdvent. Ontstoffing DANO",afd:"Zeefafd.",groep:"Zeefafdeling",kleur:"#fff"},
  {id:'ZF-VIJS',ref:"1.41.50-51",naam:"Vijzen 1-2",afd:"Zeefafd.",groep:"Zeefafdeling",kleur:"#fff"},
  {id:'ZF-LIFT',ref:"1.41.90",naam:"Personenlift OTIS",afd:"Zeefafd.",groep:"Zeefafdeling",kleur:"#fff"},
  {id:'ZF-VOL',ref:"1.43.01-19",naam:"Volumemeters 1-18",afd:"Zeefafd.",groep:"Zeefafdeling",kleur:"#fff"},
  {id:'ALG-ZAAG',ref:"2.12.45",naam:"Steenzaagmachine Ovensteen",afd:"Algemeen",groep:"Algemeen",kleur:"#fff"},
  {id:'ALG-RB',ref:"2.12.75",naam:"Rolbrug Takel Koelkelder",afd:"Algemeen",groep:"Algemeen",kleur:"#fff"},
  {id:'ALG-STOF',ref:"2.12.87",naam:"Mobiele Stofzuiger Industrieel",afd:"Algemeen",groep:"Algemeen",kleur:"#fff"},
  {id:'ALG-COMP',ref:"4.11.41",naam:"Hoofdcompressor ALUP + Drukvat",afd:"Algemeen",groep:"Algemeen",kleur:"#fff"},
  {id:'HS-KVB',ref:"HS-KVB",naam:"HS-cabine Kleivoorbereiding",afd:"Elektriciteit",groep:"HS-cabines",kleur:"#fff"},
  {id:'HS-OV',ref:"HS-OV",naam:"HS-cabine Ovens",afd:"Elektriciteit",groep:"HS-cabines",kleur:"#fff"},
  {id:'HS-BR',ref:"HS-BR",naam:"HS-cabine Brandstof",afd:"Elektriciteit",groep:"HS-cabines",kleur:"#fff"},
  {id:'HS-ZF',ref:"HS-ZF",naam:"HS-cabine Zeefafdeling",afd:"Elektriciteit",groep:"HS-cabines",kleur:"#fff"},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const C={bg:'#0a0c08',card:'#12140e',border:'#2a2d22',text:'#e8e5d8',muted:'#888a7a',yellow:'#d4a017',green:'#4CAF50',red:'#e74c3c',navy:'#1F3864',blue:'#1a73e8'};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const pad2=n=>String(n).padStart(2,'0');
const datumNu=()=>{const d=new Date();return`${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`;};
const tijdNu=()=>{const d=new Date();return`${pad2(d.getHours())}:${pad2(d.getMinutes())}`;};
const KleurDot=({kleur})=>kleur&&kleur!=='#fff'?<span style={{display:'inline-block',width:10,height:10,borderRadius:2,background:kleur,border:'1px solid rgba(0,0,0,.15)',flexShrink:0}}/>:null;

// ─── FOTO RESIZE ─────────────────────────────────────────────────────────────
function resizeImage(file,maxW=1200){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error('Leesfout'));
    reader.onload=e=>{
      const img=new Image();
      img.onerror=()=>reject(new Error('Ongeldig formaat'));
      img.onload=()=>{
        let w=img.width,h=img.height;
        if(w>maxW){h=Math.round(h*(maxW/w));w=maxW;}
        const c=document.createElement('canvas');c.width=w;c.height=h;
        c.getContext('2d').drawImage(img,0,0,w,h);
        resolve(c.toDataURL('image/jpeg',0.8));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─── WORD HTML BUILDER ───────────────────────────────────────────────────────
// KEY FIX: foto's worden BUITEN de tabel geplaatst als losse <p><img> blokken
// Word/MSO embedded HTML toont base64 <img> alleen betrouwbaar buiten tabellen
function buildReportHtml(data){
  const {datum,inspecteur,site,installaties}=data;
  const filled=Object.values(installaties).filter(inst=>
    Object.values(inst.secties||{}).some(s=>s.notitie||s.fotos?.length>0)
  );
  if(!filled.length)return null;

  let body='';
  filled.forEach((inst,idx)=>{
    const ref=inst.ref?`[${inst.ref}] `:'';
    // Installatie header
    body+=`${idx>0?'<br clear="all" style="page-break-before:always"/>':''}
<table style="width:100%;border-collapse:collapse;margin-bottom:4px">
<tr><td style="background:#1F3864;color:white;padding:10px 14px;font-size:13pt;font-weight:bold;border:1px solid #1F3864">${ref}${inst.naam}</td></tr>
</table>`;

    // Per sectie met data
    SECTIES.forEach(sec=>{
      const s=inst.secties?.[sec.id];
      if(!s||(!s.notitie&&(!s.fotos||!s.fotos.length)))return;

      // Sectie header + notitie in mini-tabel
      body+=`
<table style="width:100%;border-collapse:collapse;margin-top:8px">
<tr>
  <td style="width:55px;border:1px solid #bbb;padding:5px 8px;font-weight:bold;font-size:10pt;background:#f0f4ff;text-align:center;vertical-align:top">${sec.id}</td>
  <td style="width:160px;border:1px solid #bbb;padding:5px 8px;font-size:10pt;background:#f0f4ff;font-weight:bold;vertical-align:top">${sec.titel}</td>
  <td style="border:1px solid #bbb;padding:5px 8px;font-size:10pt;vertical-align:top">${s.notitie||'—'}</td>
</tr>
</table>`;

      // FOTO'S — als losse <p><img> BUITEN de tabel (Word toont dit betrouwbaar)
      if(s.fotos&&s.fotos.length>0){
        s.fotos.forEach((foto,fi)=>{
          body+=`
<p style="text-align:center;margin:8px 0 4px 0">
  <img src="${foto}" width="500" height="" style="border:1px solid #ccc"/>
</p>
<p style="text-align:center;font-size:8pt;color:#666;margin:0 0 12px 0">${sec.id} — Foto ${fi+1}</p>`;
        });
      }
    });
  });

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"/>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>
@page{size:A4;margin:2cm 1.5cm;}
body{font-family:Calibri,Arial,sans-serif;color:#222;font-size:10pt;}
table{border-collapse:collapse;width:100%;}
img{max-width:500px;}
p{margin:4px 0;}
</style>
</head><body>
<div style="text-align:center;margin-bottom:10px">
<div style="background:#1F3864;color:white;padding:14px;font-size:16pt;font-weight:bold;letter-spacing:1px">RONDGANG — VEILIGHEIDSINSPECTIE</div>
</div>
<table style="margin-bottom:16px"><tr>
<td style="border:1px solid #bbb;padding:5px 8px;width:110px;background:#f5f5f5;font-weight:bold">Datum</td><td style="border:1px solid #bbb;padding:5px 8px">${datum}</td>
<td style="border:1px solid #bbb;padding:5px 8px;width:110px;background:#f5f5f5;font-weight:bold">Site</td><td style="border:1px solid #bbb;padding:5px 8px">${site}</td>
</tr><tr>
<td style="border:1px solid #bbb;padding:5px 8px;background:#f5f5f5;font-weight:bold">Inspecteur</td><td style="border:1px solid #bbb;padding:5px 8px" colspan="3">${inspecteur}</td>
</tr><tr>
<td style="border:1px solid #bbb;padding:5px 8px;background:#f5f5f5;font-weight:bold">Installaties</td><td style="border:1px solid #bbb;padding:5px 8px">${filled.length}</td>
<td style="border:1px solid #bbb;padding:5px 8px;background:#f5f5f5;font-weight:bold">Gegenereerd</td><td style="border:1px solid #bbb;padding:5px 8px">MachineCheck Pro</td>
</tr></table>
${body}
</body></html>`;
}

function downloadWord(html,filename){
  const blob=new Blob(['\ufeff',html],{type:'application/msword'});
  const u=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=u;a.download=filename;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(u),5000);
}

function downloadPdf(html){
  const w=window.open('','_blank');
  if(!w){alert('Pop-up geblokkeerd — sta pop-ups toe.');return;}
  w.document.write(html);w.document.close();
  setTimeout(()=>w.print(),600);
}

// ─── INDEXEDDB ───────────────────────────────────────────────────────────────
const DB='rondgang_db';const DBV=2;
function openDB(){return new Promise((ok,no)=>{
  const r=indexedDB.open(DB,DBV);
  r.onupgradeneeded=e=>{const db=e.target.result;if(!db.objectStoreNames.contains('data'))db.createObjectStore('data');if(!db.objectStoreNames.contains('archief'))db.createObjectStore('archief',{keyPath:'id'});};
  r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);
});}
const dbPut=async(s,v,k)=>{const db=await openDB();return new Promise((ok,no)=>{const t=db.transaction(s,'readwrite');if(k!==undefined)t.objectStore(s).put(v,k);else t.objectStore(s).put(v);t.oncomplete=()=>ok();t.onerror=()=>no(t.error);});};
const dbGet=async(s,k)=>{const db=await openDB();return new Promise((ok,no)=>{const t=db.transaction(s,'readonly');const r=t.objectStore(s).get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});};
const dbAll=async(s)=>{const db=await openDB();return new Promise((ok,no)=>{const r=db.transaction(s,'readonly').objectStore(s).getAll();r.onsuccess=()=>ok(r.result||[]);r.onerror=()=>no(r.error);});};
const dbDel=async(s,k)=>{const db=await openDB();return new Promise((ok,no)=>{const t=db.transaction(s,'readwrite');t.objectStore(s).delete(k);t.oncomplete=()=>ok();t.onerror=()=>no(t.error);});};
const dbClr=async(s)=>{const db=await openDB();return new Promise((ok,no)=>{const t=db.transaction(s,'readwrite');t.objectStore(s).clear();t.oncomplete=()=>ok();t.onerror=()=>no(t.error);});};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function RondgangModule({onTerug}){
  const [stap,setStap]=useState('start');
  const [inspecteur,setInspecteur]=useState('Bert Verbraecken');
  const [site,setSite]=useState('Argex – Kleigebouw Burcht-Zwijndrecht-Beveren');
  const [inst,setInst]=useState({});
  const [zoek,setZoek]=useState('');
  const [groepF,setGroepF]=useState('Alle');
  const [showAdd,setShowAdd]=useState(false);
  const [addNaam,setAddNaam]=useState('');
  const [addRef,setAddRef]=useState('');
  const [actId,setActId]=useState(null);
  const [actMeta,setActMeta]=useState(null);
  const [openS,setOpenS]=useState(null);
  const [saved,setSaved]=useState(false);
  const [fBusy,setFBusy]=useState(false);
  const [archief,setArchief]=useState([]);

  // Laden
  useEffect(()=>{(async()=>{
    try{const d=await dbGet('data','state');if(d&&Object.keys(d.inst||{}).length){setInst(d.inst);setInspecteur(d.insp||'');setSite(d.site||'');setStap('rondgang');}}catch(e){}
    try{setArchief(await dbAll('archief'));}catch(e){}
  })();},[]);

  const loadArchief=async()=>{try{setArchief(await dbAll('archief'));}catch(e){}};
  const saveDB=async(i)=>{try{await dbPut('data',{inst:i||inst,insp:inspecteur,site},'state');}catch(e){}};

  // Autosave
  useEffect(()=>{if(!Object.keys(inst).length)return;const t=setTimeout(()=>saveDB(),8000);return()=>clearTimeout(t);},[inst,inspecteur,site]);

  // Helpers
  const sel=(i)=>{setActId(i.id);setActMeta({naam:i.naam,ref:i.ref,kleur:i.kleur});setOpenS(null);};
  const cur=actId?inst[actId]:null;
  const nSec=(id)=>{const i=inst[id];if(!i)return 0;return Object.values(i.secties||{}).filter(s=>s.notitie||s.fotos?.length>0).length;};
  const nFoto=(id)=>{const i=inst[id];if(!i)return 0;return Object.values(i.secties||{}).reduce((t,s)=>t+(s.fotos?.length||0),0);};
  const totaal=Object.keys(inst).filter(k=>nSec(k)>0).length;
  const groepen=['Alle',...new Set(ARGEX.map(i=>i.groep))];
  const gefilterd=ARGEX.filter(i=>{
    if(groepF!=='Alle'&&i.groep!==groepF)return false;
    if(zoek){const z=zoek.toLowerCase();return i.naam.toLowerCase().includes(z)||i.ref.toLowerCase().includes(z)||i.afd.toLowerCase().includes(z);}
    return true;
  });

  // Sectie update
  const updSec=(secId,field,val)=>{
    setInst(prev=>{
      if(!actId)return prev;
      const m=actMeta||{naam:'',ref:'',kleur:'#fff'};
      const i=prev[actId]||{naam:m.naam,ref:m.ref,kleur:m.kleur,secties:{}};
      const s=i.secties[secId]||{notitie:'',fotos:[]};
      return{...prev,[actId]:{...i,secties:{...i.secties,[secId]:{...s,[field]:val}}}};
    });
  };

  // Foto's verwerken
  const addFotos=async(secId,files)=>{
    if(!actId||!files?.length)return;
    setFBusy(true);
    try{
      const res=[];
      for(const f of files){
        try{res.push(await resizeImage(f,1200));}
        catch(e){
          const raw=await new Promise((ok,no)=>{const r=new FileReader();r.onload=ev=>ok(ev.target.result);r.onerror=()=>no();r.readAsDataURL(f);});
          res.push(raw);
        }
      }
      setInst(prev=>{
        const m=actMeta||{naam:'',ref:'',kleur:'#fff'};
        const i=prev[actId]||{naam:m.naam,ref:m.ref,kleur:m.kleur,secties:{}};
        const s=i.secties[secId]||{notitie:'',fotos:[]};
        return{...prev,[actId]:{...i,secties:{...i.secties,[secId]:{...s,fotos:[...s.fotos,...res]}}}};
      });
    }catch(e){alert('Fout: '+e.message);}
    finally{setFBusy(false);}
  };

  const rmFoto=(secId,idx)=>{
    setInst(prev=>{
      const i=prev[actId];if(!i)return prev;
      const s=i.secties[secId];if(!s)return prev;
      return{...prev,[actId]:{...i,secties:{...i.secties,[secId]:{...s,fotos:s.fotos.filter((_,j)=>j!==idx)}}}};
    });
  };

  // Export + archiveren
  const doExport=async(subset)=>{
    const datum=datumNu();const tijd=tijdNu();
    const html=buildReportHtml({datum,inspecteur,site,installaties:subset});
    if(!html){alert('Geen data.');return;}
    const fn=`Rondgang_${datum.replace(/\//g,'-')}_${tijd.replace(':','')}.doc`;
    downloadWord(html,fn);
    // Archiveer
    const filled=Object.values(subset).filter(i=>Object.values(i.secties||{}).some(s=>s.notitie||s.fotos?.length>0));
    const nf=filled.reduce((t,i)=>t+Object.values(i.secties||{}).reduce((ft,s)=>ft+(s.fotos?.length||0),0),0);
    try{
      await dbPut('archief',{id:uid(),datum,tijd,inspecteur,site,filename:fn,nInst:filled.length,nFotos:nf,namen:filled.map(i=>i.naam).join(', '),html});
      await loadArchief();
    }catch(e){}
  };

  const bevestig=async()=>{await saveDB();setSaved(true);setTimeout(()=>setSaved(false),2500);};
  const nieuw=async()=>{if(!confirm('Rondgang wissen? Archief blijft bewaard.'))return;await dbClr('data');setInst({});setStap('start');setActId(null);};
  const delDoc=async(id)=>{if(!confirm('Document verwijderen?'))return;await dbDel('archief',id);await loadArchief();};

  // Styles
  const sBtn=(v='default')=>({padding:'10px 18px',border:'none',borderRadius:6,cursor:'pointer',fontWeight:700,fontSize:13,fontFamily:'sans-serif',
    ...(v==='yellow'?{background:C.yellow,color:'#000'}:v==='green'?{background:C.green,color:'#fff'}:v==='red'?{background:C.red,color:'#fff'}:v==='blue'?{background:C.blue,color:'#fff'}:v==='ghost'?{background:'transparent',border:`1px solid ${C.border}`,color:C.muted}:{background:C.card,border:`1px solid ${C.border}`,color:C.text})});
  const sI={background:'#1a1c14',border:`1px solid ${C.border}`,borderRadius:6,padding:'10px 12px',color:C.text,fontSize:14,fontFamily:'sans-serif',width:'100%',boxSizing:'border-box',outline:'none'};

  // ═══════════════════════════════════════════════════════════════════════
  // ARCHIEF SCHERM
  // ═══════════════════════════════════════════════════════════════════════
  if(stap==='archief'){
    const sorted=[...archief].sort((a,b)=>(b.datum+b.tijd).localeCompare(a.datum+a.tijd));
    return(
      <div style={{background:C.bg,minHeight:'100vh',fontFamily:'sans-serif',color:C.text}}>
        <div style={{background:'#14160f',borderBottom:`1px solid ${C.border}`,padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>setStap(Object.keys(inst).length?'rondgang':'start')} style={sBtn('ghost')}>← Terug</button>
          <div style={{fontSize:16,fontWeight:800}}>📁 Documenten</div>
          <div style={{marginLeft:'auto',fontSize:11,color:C.muted}}>{archief.length} documenten</div>
        </div>
        <div style={{maxWidth:640,margin:'0 auto',padding:'16px 12px'}}>
          {!sorted.length&&<div style={{textAlign:'center',padding:40,color:C.muted}}>Nog geen documenten.<br/>Exporteer een rondgang om hier te verschijnen.</div>}
          {sorted.map(doc=>(
            <div key={doc.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:'#fff'}}>{doc.filename}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>{doc.datum} {doc.tijd} · {doc.inspecteur}</div>
                  <div style={{fontSize:11,color:C.muted}}>{doc.nInst} installatie(s) · {doc.nFotos} foto's</div>
                  {doc.namen&&<div style={{fontSize:10,color:C.yellow,marginTop:4}}>{doc.namen.length>80?doc.namen.slice(0,80)+'…':doc.namen}</div>}
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>downloadWord(doc.html,doc.filename)} style={{...sBtn('green'),flex:1,padding:'10px',fontSize:12}}>📄 Word</button>
                <button onClick={()=>downloadPdf(doc.html)} style={{...sBtn('blue'),flex:1,padding:'10px',fontSize:12}}>🖨️ PDF</button>
                <button onClick={()=>delDoc(doc.id)} style={{...sBtn('ghost'),padding:'10px',fontSize:12,color:C.red}}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // START SCHERM
  // ═══════════════════════════════════════════════════════════════════════
  if(stap==='start')return(
    <div style={{background:C.bg,minHeight:'100vh',fontFamily:'sans-serif',color:C.text}}>
      <div style={{background:'#14160f',borderBottom:`1px solid ${C.border}`,padding:'14px 18px',display:'flex',alignItems:'center',gap:12}}>
        <button onClick={onTerug} style={sBtn('ghost')}>← Terug</button>
        <div style={{fontSize:16,fontWeight:800}}>🚶 Rondgang</div>
      </div>
      <div style={{maxWidth:560,margin:'0 auto',padding:'28px 16px'}}>
        <div style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:6}}>Nieuwe Rondgang</div>
        <p style={{fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:24}}>Kies installatie → vul per sectie opmerkingen + foto's in → exporteer als Word/PDF.</p>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:C.yellow,marginBottom:6,letterSpacing:1}}>INSPECTEUR</div>
          <input value={inspecteur} onChange={e=>setInspecteur(e.target.value)} style={sI}/>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,color:C.yellow,marginBottom:6,letterSpacing:1}}>SITE</div>
          <input value={site} onChange={e=>setSite(e.target.value)} style={sI}/>
        </div>
        <button onClick={()=>setStap('rondgang')} style={{...sBtn('yellow'),width:'100%',padding:'14px',fontSize:16}}>🚶 Start Rondgang</button>

        {totaal>0&&<div style={{marginTop:16,padding:12,background:'#1a1c0e',border:`1px solid ${C.yellow}33`,borderRadius:6,fontSize:12,color:C.yellow}}>
          ⚠️ Lopende rondgang: {totaal} installatie(s)
          <button onClick={()=>setStap('rondgang')} style={{...sBtn('yellow'),marginTop:8,width:'100%',padding:'8px'}}>Hervat</button>
        </div>}

        {archief.length>0&&<button onClick={()=>setStap('archief')} style={{...sBtn('blue'),width:'100%',marginTop:16,padding:'12px',fontSize:14}}>📁 Documenten ({archief.length})</button>}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // RONDGANG
  // ═══════════════════════════════════════════════════════════════════════
  return(
    <div style={{background:C.bg,minHeight:'100vh',fontFamily:'sans-serif',color:C.text}}>
      {/* TOPBAR */}
      <div style={{background:'#14160f',borderBottom:`1px solid ${C.border}`,padding:'10px 14px',display:'flex',alignItems:'center',gap:8,position:'sticky',top:0,zIndex:100}}>
        <button onClick={onTerug} style={{...sBtn('ghost'),padding:'6px 10px',fontSize:11}}>← Menu</button>
        <div style={{fontSize:14,fontWeight:800,flex:1}}>🚶 Rondgang</div>
        {totaal>0&&<div style={{background:C.yellow,color:'#000',borderRadius:12,padding:'3px 10px',fontSize:11,fontWeight:800}}>{totaal}</div>}
        <button onClick={()=>{loadArchief();setStap('archief');}} style={{...sBtn('blue'),padding:'6px 10px',fontSize:11}}>📁 {archief.length||''}</button>
        <button onClick={()=>doExport(inst)} disabled={!totaal} style={{...sBtn('green'),padding:'6px 10px',fontSize:11,opacity:totaal?1:.4}}>📄</button>
        <button onClick={nieuw} style={{...sBtn('ghost'),padding:'6px 10px',fontSize:11,color:C.red}}>🗑️</button>
      </div>

      <div style={{maxWidth:640,margin:'0 auto',padding:'14px 12px'}}>

        {/* ACTIEVE INSTALLATIE */}
        {actId&&(
          <div style={{background:'#1a1c0e',border:`2px solid ${C.yellow}`,borderRadius:10,marginBottom:16,overflow:'hidden'}}>
            <div style={{padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <KleurDot kleur={actMeta?.kleur}/>
                <div>
                  <div style={{fontSize:10,color:C.yellow,fontWeight:700,letterSpacing:1}}>ACTIEVE INSTALLATIE</div>
                  <div style={{fontSize:14,fontWeight:800,color:'#fff',marginTop:2}}>{actMeta?.ref?`[${actMeta.ref}] `:''}{actMeta?.naam}</div>
                </div>
              </div>
              <button onClick={()=>{setActId(null);setActMeta(null);setOpenS(null);}} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:18}}>✕</button>
            </div>

            {fBusy&&<div style={{padding:'8px 16px',background:'#1a2a1a',borderTop:`1px solid ${C.green}`,fontSize:12,color:C.green,textAlign:'center'}}>⏳ Foto's verwerken...</div>}

            <div style={{borderTop:`1px solid ${C.border}`}}>
              {SECTIES.map(sec=>{
                const sd=cur?.secties?.[sec.id]||{notitie:'',fotos:[]};
                const isO=openS===sec.id;
                const has=sd.notitie||sd.fotos?.length>0;
                return(
                  <div key={sec.id} style={{borderBottom:`1px solid ${C.border}`}}>
                    <div onClick={()=>setOpenS(isO?null:sec.id)} style={{padding:'10px 16px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',background:isO?'#161a0d':'transparent'}}>
                      <div style={{fontSize:12,fontWeight:800,color:C.yellow,minWidth:32}}>{sec.id}</div>
                      <div style={{flex:1,fontSize:12,color:C.text,fontWeight:has?700:400}}>{sec.titel}</div>
                      {has&&<div style={{display:'flex',gap:4,alignItems:'center'}}>
                        {sd.fotos?.length>0&&<span style={{fontSize:10,color:C.blue}}>📷{sd.fotos.length}</span>}
                        {sd.notitie&&<span style={{fontSize:10,color:C.green}}>✎</span>}
                      </div>}
                      <span style={{fontSize:10,color:C.muted}}>{isO?'▲':'▼'}</span>
                    </div>
                    {isO&&(
                      <div style={{padding:'10px 16px',background:'#12140e'}}>
                        <textarea value={sd.notitie||''} onChange={e=>updSec(sec.id,'notitie',e.target.value)}
                          placeholder={`Opmerking bij ${sec.id}...`}
                          style={{...sI,minHeight:60,resize:'vertical',marginBottom:8,fontSize:13}}/>
                        {sd.fotos?.length>0&&(
                          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
                            {sd.fotos.map((f,i)=>(
                              <div key={i} style={{position:'relative'}}>
                                <img src={f} style={{width:90,height:90,objectFit:'cover',borderRadius:6,border:`1px solid ${C.border}`}}/>
                                <button onClick={e=>{e.stopPropagation();rmFoto(sec.id,i);}} style={{position:'absolute',top:-6,right:-6,width:22,height:22,borderRadius:11,background:C.red,color:'#fff',border:'none',cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{display:'flex',gap:8}}>
                          <div style={{flex:1,position:'relative'}}>
                            <input type="file" accept="image/*" capture="environment" multiple
                              onChange={e=>{if(e.target.files?.length)addFotos(sec.id,Array.from(e.target.files));e.target.value='';}}
                              style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0,cursor:'pointer',zIndex:2}}/>
                            <div style={{...sBtn('blue'),width:'100%',textAlign:'center',padding:'10px',fontSize:13,boxSizing:'border-box'}}>📷 Camera</div>
                          </div>
                          <div style={{flex:1,position:'relative'}}>
                            <input type="file" accept="image/*" multiple
                              onChange={e=>{if(e.target.files?.length)addFotos(sec.id,Array.from(e.target.files));e.target.value='';}}
                              style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0,cursor:'pointer',zIndex:2}}/>
                            <div style={{...sBtn(),width:'100%',textAlign:'center',padding:'10px',fontSize:13,boxSizing:'border-box'}}>🖼️ Galerij</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* OPSLAAN + EXPORT */}
            <div style={{padding:'12px 16px',borderTop:`2px solid ${C.border}`,background:'#10120c'}}>
              {saved&&<div style={{background:'#1a3a1a',border:`1px solid ${C.green}`,borderRadius:6,padding:'8px 12px',fontSize:12,color:C.green,textAlign:'center',fontWeight:700,marginBottom:8}}>✅ Opgeslagen! ({nFoto(actId)} foto's bewaard)</div>}
              <div style={{display:'flex',gap:8}}>
                <button onClick={bevestig} style={{...sBtn('yellow'),flex:1,padding:'12px',fontSize:14}}>💾 Opslaan</button>
                <button onClick={()=>doExport({[actId]:inst[actId]})} disabled={!nSec(actId)} style={{...sBtn('green'),flex:1,padding:'12px',fontSize:14,opacity:nSec(actId)?1:.4}}>📄 Word</button>
              </div>
              <div style={{fontSize:10,color:C.muted,textAlign:'center',marginTop:6}}>{nSec(actId)}/19 secties · {nFoto(actId)} foto's</div>
            </div>
          </div>
        )}

        {/* ZOEK & FILTER */}
        <div style={{marginBottom:10}}>
          <input value={zoek} onChange={e=>setZoek(e.target.value)} placeholder="🔍 Zoek installatie..." style={{...sI,marginBottom:8}}/>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {groepen.map(g=><button key={g} onClick={()=>setGroepF(g)} style={{padding:'5px 10px',borderRadius:14,fontSize:10,fontWeight:700,cursor:'pointer',border:groepF===g?`2px solid ${C.yellow}`:`1px solid ${C.border}`,background:groepF===g?'#1a1c0e':C.card,color:groepF===g?C.yellow:C.muted}}>{g}</button>)}
          </div>
        </div>

        {/* HANDMATIG */}
        <div style={{marginBottom:12}}>
          {!showAdd?<button onClick={()=>setShowAdd(true)} style={{...sBtn('ghost'),width:'100%',fontSize:11}}>+ Handmatig toevoegen</button>:(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
              <input value={addNaam} onChange={e=>setAddNaam(e.target.value)} placeholder="Naam *" style={{...sI,marginBottom:6}}/>
              <input value={addRef} onChange={e=>setAddRef(e.target.value)} placeholder="Ref (optioneel)" style={{...sI,marginBottom:8}}/>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{if(!addNaam.trim())return;sel({id:'c-'+uid(),naam:addNaam.trim(),ref:addRef.trim(),kleur:'#fff'});setShowAdd(false);setAddNaam('');setAddRef('');}} disabled={!addNaam.trim()} style={{...sBtn('green'),flex:1,opacity:addNaam.trim()?1:.4}}>Selecteer</button>
                <button onClick={()=>{setShowAdd(false);setAddNaam('');setAddRef('');}} style={sBtn('ghost')}>Annuleer</button>
              </div>
            </div>
          )}
        </div>

        {/* LIJST */}
        <div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1,fontWeight:700}}>INSTALLATIES ({gefilterd.length})</div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {gefilterd.map(i=>{
            const n=nSec(i.id),nf=nFoto(i.id),act=actId===i.id;
            return(
              <div key={i.id} onClick={()=>sel(i)} style={{background:act?'#1a1c0e':C.card,border:act?`2px solid ${C.yellow}`:`1px solid ${C.border}`,borderRadius:8,padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:10}}>
                <KleurDot kleur={i.kleur}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:act?C.yellow:C.text}}>{i.naam}</div>
                  <div style={{fontSize:10,color:C.muted}}>{i.ref} · {i.afd}</div>
                </div>
                {n>0&&<div style={{display:'flex',gap:4,alignItems:'center'}}>
                  {nf>0&&<span style={{fontSize:10,color:C.blue}}>📷{nf}</span>}
                  <div style={{background:C.green,color:'#fff',borderRadius:10,padding:'2px 8px',fontSize:10,fontWeight:800}}>{n}/19</div>
                </div>}
              </div>
            );
          })}
        </div>
        <div style={{height:80}}/>
      </div>

      {totaal>0&&!actId&&(
        <div style={{position:'fixed',bottom:16,left:'50%',transform:'translateX(-50%)',zIndex:100}}>
          <button onClick={()=>doExport(inst)} style={{...sBtn('green'),padding:'12px 24px',fontSize:14,boxShadow:'0 4px 20px rgba(0,0,0,.5)',borderRadius:24}}>📄 Export ({totaal} installaties)</button>
        </div>
      )}
    </div>
  );
}
