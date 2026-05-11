import { useState, useRef, useCallback, useEffect } from "react";

// ─── 19 SECTIES RICHTLIJN WERKUITRUSTING ─────────────────────────────────────
const SECTIES=[
  {id:"3.1", titel:"Besturingssysteem"},
  {id:"3.2", titel:"Inbedrijfstelling"},
  {id:"3.3", titel:"Stopzetten"},
  {id:"3.4", titel:"Noodstopknop"},
  {id:"3.5", titel:"Bescherming vallende/opspringende voorwerpen"},
  {id:"3.6", titel:"Bevestiging/stabiliteit"},
  {id:"3.7", titel:"Breuken – barsten"},
  {id:"3.8", titel:"Bescherming mechanische verbinding"},
  {id:"3.9", titel:"Verlichting"},
  {id:"3.10",titel:"Bescherming temperaturen"},
  {id:"3.11",titel:"Alarmsignalen"},
  {id:"3.12",titel:"Gebruik"},
  {id:"3.13",titel:"Onderhoudsverrichtingen"},
  {id:"3.14",titel:"Scheiding energiebron"},
  {id:"3.15",titel:"Waarschuwingen – signalisatie"},
  {id:"3.16",titel:"Toegankelijkheid"},
  {id:"3.17",titel:"Bescherming werknemers"},
  {id:"3.18",titel:"Preventie ontploffing"},
  {id:"3.19",titel:"Bescherming elektriciteit"},
];

// ─── ARGEX INSTALLATIELIJST — KLEURGROEPEN ───────────────────────────────────
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
  {id:'KVB-TB',ref:"1.21.41→59",naam:"Transportbanden 41-59 + Weeg + Metaaldet.",afd:"Kleigebouw",groep:"Kleivoorbereiding",kleur:"#CCFFCC"},
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
  {id:'OV-PILL',ref:"—",naam:"Pillard Brander 25MW + Toebehoren",afd:"Oven",groep:"Oveninstallatie",kleur:"#D9E2F3"},
  {id:'OV-BRUG',ref:"—",naam:"Loopbrug naar Oven + Stelling",afd:"Oven",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'OV-CAM',ref:"—",naam:"Camerasysteem Ovenproces — on hold",afd:"Oven",groep:"Oveninstallatie",kleur:"#FFD966"},
  {id:'OV-BKCOMP',ref:"—",naam:"Compressor Bruinkool Backup",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'OV-BKSILO',ref:"—",naam:"Opslagsilo Bruinkool 250t",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#E2EFDA"},
  {id:'OV-AIRDOS',ref:"—",naam:"Doseerinstallatie Airdos",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#E2EFDA"},
  {id:'OV-BIO',ref:"—",naam:"Biomassa Installatie",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#E2EFDA"},
  {id:'OV-TANKS',ref:"—",naam:"2× Opslagtanks 30.000L + Verdeel",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#E2EFDA"},
  {id:'OV-ARGON',ref:"—",naam:"Inertisering Installatie Argon",afd:"Brandstof",groep:"Oveninstallatie",kleur:"#fff"},
  {id:'EF-K123',ref:"1.32.05+06+07",naam:"Electrofilter Kamers 1-3",afd:"Electrofilter",groep:"Electrofilter",kleur:"#F4B183"},
  {id:'EF-RED',ref:"1.32.16",naam:"Redler 2",afd:"Electrofilter",groep:"Electrofilter",kleur:"#BDD7EE"},
  {id:'EF-CEL',ref:"1.32.17",naam:"Cellenrad EF",afd:"Electrofilter",groep:"Electrofilter",kleur:"#C5E0B4"},
  {id:'EF-MENG',ref:"1.32.18",naam:"Mengvijs",afd:"Electrofilter",groep:"Electrofilter",kleur:"#FFD966"},
  {id:'EF-SPIR',ref:"1.32.19",naam:"Spiraalvijs",afd:"Electrofilter",groep:"Electrofilter",kleur:"#E2EFDA"},
  {id:'EF-B55',ref:"1.32.35",naam:"Band 55",afd:"Electrofilter",groep:"Electrofilter",kleur:"#fff"},
  {id:'EF-ROER',ref:"1.32.42",naam:"Roerder",afd:"Electrofilter",groep:"Electrofilter",kleur:"#F8CBAD"},
  {id:'EF-BOX',ref:"1.32.43",naam:"Boxerpomp",afd:"Electrofilter",groep:"Electrofilter",kleur:"#D6DCE4"},
  {id:'EF-TREK',ref:"—",naam:"Trekventilator Schouw",afd:"Electrofilter",groep:"Electrofilter",kleur:"#D9E2F3"},
  {id:'EF-ABB',ref:"—",naam:"ABB Emissiemeting",afd:"Electrofilter",groep:"Electrofilter",kleur:"#D9E2F3"},
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
  {id:'HS-KVB',ref:"—",naam:"HS-cabine Kleivoorbereiding",afd:"Elektriciteit",groep:"HS-cabines",kleur:"#fff"},
  {id:'HS-OV',ref:"—",naam:"HS-cabine Ovens",afd:"Elektriciteit",groep:"HS-cabines",kleur:"#fff"},
  {id:'HS-BR',ref:"—",naam:"HS-cabine Brandstof",afd:"Elektriciteit",groep:"HS-cabines",kleur:"#fff"},
  {id:'HS-ZF',ref:"—",naam:"HS-cabine Zeefafdeling",afd:"Elektriciteit",groep:"HS-cabines",kleur:"#fff"},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const C={bg:'#0a0c08',card:'#12140e',border:'#2a2d22',text:'#e8e5d8',muted:'#888a7a',yellow:'#d4a017',green:'#4CAF50',red:'#e74c3c',navy:'#1F3864',blue:'#1a73e8'};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const pad2=n=>String(n).padStart(2,'0');
const datumNu=()=>{const d=new Date();return`${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`;};
const KleurDot=({kleur})=>kleur&&kleur!=='#fff'?<span style={{display:'inline-block',width:10,height:10,borderRadius:2,background:kleur,border:'1px solid rgba(0,0,0,0.15)',flexShrink:0}}/>:null;

// ─── WORD EXPORT (.doc HTML) — grote foto's per sectie ───────────────────────
function exportToWord(data){
  const {datum,inspecteur,site,installaties}=data;
  const filled=Object.values(installaties).filter(inst=>
    Object.values(inst.secties||{}).some(s=>s.notitie||s.fotos?.length>0)
  );
  let instHtml='';
  filled.forEach(inst=>{
    const refTxt=inst.ref&&inst.ref!=='—'?`[${inst.ref}] `:'';
    let secRows='';
    SECTIES.forEach(sec=>{
      const d=inst.secties?.[sec.id];
      if(!d||(!d.notitie&&(!d.fotos||d.fotos.length===0)))return;
      // Notitie-rij
      secRows+=`<tr>
        <td style="width:55px;border:1px solid #bbb;padding:6px 8px;font-weight:bold;font-size:10pt;vertical-align:top;background:#f0f4ff;text-align:center">${sec.id}</td>
        <td style="width:160px;border:1px solid #bbb;padding:6px 8px;font-size:10pt;vertical-align:top;background:#f0f4ff;font-weight:bold">${sec.titel}</td>
        <td style="border:1px solid #bbb;padding:8px 10px;font-size:10pt;vertical-align:top">
          ${d.notitie?`<div style="white-space:pre-wrap">${d.notitie}</div>`:'<span style="color:#999">—</span>'}
        </td>
      </tr>`;
      // Foto-rij(en): elke foto krijgt een eigen volle-breedte rij → groot en duidelijk in Word
      (d.fotos||[]).forEach((f,fi)=>{
        secRows+=`<tr>
          <td colspan="3" style="border:1px solid #bbb;padding:10px;text-align:center">
            <img src="${f}" width="500" style="border:1px solid #ccc;display:block;margin:0 auto"/>
            <div style="font-size:8pt;color:#666;margin-top:4px">${sec.id} — Foto ${fi+1}</div>
          </td>
        </tr>`;
      });
    });
    instHtml+=`<div style="page-break-before:always;margin-bottom:24px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td colspan="3" style="background:#1F3864;color:white;padding:10px 14px;font-size:13pt;font-weight:bold;border:1px solid #1F3864">
          ${refTxt}${inst.naam}
        </td></tr>
        <tr style="background:#ddd">
          <th style="border:1px solid #bbb;padding:5px;font-size:9pt;width:55px">Sectie</th>
          <th style="border:1px solid #bbb;padding:5px;font-size:9pt;width:160px">Onderwerp</th>
          <th style="border:1px solid #bbb;padding:5px;font-size:9pt">Opmerkingen & Foto's</th>
        </tr>
        ${secRows}
      </table>
    </div>`;
  });

  const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"/><title>Rondgang ${datum}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>@page{size:A4;margin:1.5cm;}body{font-family:Calibri,Arial,sans-serif;color:#222;font-size:10pt;}table{border-collapse:collapse;width:100%;}img{max-width:500px;}</style>
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
  <td style="border:1px solid #bbb;padding:5px 8px;background:#f5f5f5;font-weight:bold">Datum export</td><td style="border:1px solid #bbb;padding:5px 8px">${datum}</td>
</tr></table>
${instHtml}
<div style="margin-top:16px;font-size:8pt;color:#999;text-align:center">MachineCheck Pro — Rondgang Module</div>
</body></html>`;

  const blob=new Blob(['\ufeff',html],{type:'application/msword'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=`Rondgang_${datum.replace(/\//g,'-')}.doc`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function RondgangModule({onTerug}){
  const [stap,setStap]=useState('start');
  const [inspecteur,setInspecteur]=useState('Bert Verbraecken');
  const [site,setSite]=useState('Argex – Kleigebouw Burcht-Zwijndrecht-Beveren');
  const [installaties,setInstallaties]=useState({});
  const [zoek,setZoek]=useState('');
  const [groepFilter,setGroepFilter]=useState('Alle');
  const [showCustom,setShowCustom]=useState(false);
  const [customNaam,setCustomNaam]=useState('');
  const [customRef,setCustomRef]=useState('');
  const [activeInst,setActiveInst]=useState(null);
  const [openSec,setOpenSec]=useState(null);
  const [saved,setSaved]=useState(false);

  // Export single installatie als Word
  const exportSingleInst=(inst)=>{
    if(!inst)return;
    const singleData={[inst.id]:installaties[inst.id]};
    exportToWord({datum:datumNu(),inspecteur,site,installaties:singleData});
  };

  // Opslaan bevestiging (localStorage wordt al auto-opgeslagen via useEffect)
  const bevestigOpslaan=()=>{
    localStorage.setItem('rondgang_v3',JSON.stringify({installaties,inspecteur,site}));
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  useEffect(()=>{
    const s=localStorage.getItem('rondgang_v3');
    if(s){try{const d=JSON.parse(s);if(Object.keys(d.installaties||{}).length){setInstallaties(d.installaties);setInspecteur(d.inspecteur||'');setSite(d.site||'');setStap('rondgang');}}catch(e){}}
  },[]);
  useEffect(()=>{
    if(Object.keys(installaties).length>0)localStorage.setItem('rondgang_v3',JSON.stringify({installaties,inspecteur,site}));
  },[installaties,inspecteur,site]);

  const groepen=['Alle',...new Set(ARGEX.map(i=>i.groep))];
  const gefilterd=ARGEX.filter(i=>{
    if(groepFilter!=='Alle'&&i.groep!==groepFilter)return false;
    if(zoek){const z=zoek.toLowerCase();return i.naam.toLowerCase().includes(z)||i.ref.toLowerCase().includes(z)||i.afd.toLowerCase().includes(z);}
    return true;
  });

  const telIngevuld=instId=>{
    const inst=installaties[instId];if(!inst)return 0;
    return Object.values(inst.secties||{}).filter(s=>s.notitie||s.fotos?.length>0).length;
  };

  const updateSec=(secId,field,value)=>{
    if(!activeInst)return;
    setInstallaties(prev=>{
      const inst=prev[activeInst.id]||{naam:activeInst.naam,ref:activeInst.ref,kleur:activeInst.kleur,secties:{}};
      const sec=inst.secties[secId]||{notitie:'',fotos:[]};
      return{...prev,[activeInst.id]:{...inst,secties:{...inst.secties,[secId]:{...sec,[field]:value}}}};
    });
  };

  const addFoto=(secId,base64)=>{
    if(!activeInst)return;
    setInstallaties(prev=>{
      const inst=prev[activeInst.id]||{naam:activeInst.naam,ref:activeInst.ref,kleur:activeInst.kleur,secties:{}};
      const sec=inst.secties[secId]||{notitie:'',fotos:[]};
      return{...prev,[activeInst.id]:{...inst,secties:{...inst.secties,[secId]:{...sec,fotos:[...sec.fotos,base64]}}}};
    });
  };

  const removeFoto=(secId,idx)=>{
    if(!activeInst)return;
    setInstallaties(prev=>{
      const inst=prev[activeInst.id];if(!inst)return prev;
      const sec=inst.secties[secId];if(!sec)return prev;
      return{...prev,[activeInst.id]:{...inst,secties:{...inst.secties,[secId]:{...sec,fotos:sec.fotos.filter((_,i)=>i!==idx)}}}};
    });
  };

  const handleFoto=useCallback((secId,e)=>{
    Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>addFoto(secId,ev.target.result);r.readAsDataURL(file);});
    e.target.value='';
  },[activeInst]);

  const startNieuw=()=>{localStorage.removeItem('rondgang_v3');setInstallaties({});setStap('start');setActiveInst(null);};
  const totaal=Object.keys(installaties).filter(k=>telIngevuld(k)>0).length;

  const sBtn=(v='default')=>({
    padding:'10px 18px',border:'none',borderRadius:6,cursor:'pointer',fontWeight:700,fontSize:13,fontFamily:'sans-serif',
    ...(v==='yellow'?{background:C.yellow,color:'#000'}:v==='green'?{background:C.green,color:'#fff'}:v==='red'?{background:C.red,color:'#fff'}:v==='blue'?{background:C.blue,color:'#fff'}:v==='ghost'?{background:'transparent',border:`1px solid ${C.border}`,color:C.muted}:{background:C.card,border:`1px solid ${C.border}`,color:C.text}),
  });
  const sInput={background:'#1a1c14',border:`1px solid ${C.border}`,borderRadius:6,padding:'10px 12px',color:C.text,fontSize:14,fontFamily:'sans-serif',width:'100%',boxSizing:'border-box',outline:'none'};

  if(stap==='start')return(
    <div style={{background:C.bg,minHeight:'100vh',fontFamily:'sans-serif',color:C.text}}>
      <div style={{background:'#14160f',borderBottom:`1px solid ${C.border}`,padding:'14px 18px',display:'flex',alignItems:'center',gap:12}}>
        <button onClick={onTerug} style={sBtn('ghost')}>← Terug</button>
        <div style={{fontSize:16,fontWeight:800}}>🚶 Rondgang</div>
      </div>
      <div style={{maxWidth:560,margin:'0 auto',padding:'28px 16px'}}>
        <div style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:6}}>Nieuwe Rondgang</div>
        <p style={{fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:24}}>
          Kies een installatie → vul per sectie (3.1–3.19) opmerkingen + foto's in → exporteer als Word met grote foto's.
        </p>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:C.yellow,marginBottom:6,letterSpacing:1}}>INSPECTEUR</div>
          <input value={inspecteur} onChange={e=>setInspecteur(e.target.value)} style={sInput}/>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,color:C.yellow,marginBottom:6,letterSpacing:1}}>SITE</div>
          <input value={site} onChange={e=>setSite(e.target.value)} style={sInput}/>
        </div>
        <button onClick={()=>setStap('rondgang')} style={{...sBtn('yellow'),width:'100%',padding:'14px',fontSize:16}}>🚶 Start Rondgang</button>
        {totaal>0&&(
          <div style={{marginTop:16,padding:12,background:'#1a1c0e',border:`1px solid ${C.yellow}33`,borderRadius:6,fontSize:12,color:C.yellow}}>
            ⚠️ Lopende rondgang: {totaal} installatie(s)
            <button onClick={()=>setStap('rondgang')} style={{...sBtn('yellow'),marginTop:8,width:'100%',padding:'8px'}}>Hervat</button>
          </div>
        )}
      </div>
    </div>
  );

  const curInst=activeInst?installaties[activeInst.id]:null;

  return(
    <div style={{background:C.bg,minHeight:'100vh',fontFamily:'sans-serif',color:C.text}}>
      <div style={{background:'#14160f',borderBottom:`1px solid ${C.border}`,padding:'10px 14px',display:'flex',alignItems:'center',gap:10,position:'sticky',top:0,zIndex:100}}>
        <button onClick={onTerug} style={{...sBtn('ghost'),padding:'6px 10px',fontSize:11}}>← Menu</button>
        <div style={{fontSize:14,fontWeight:800}}>🚶 Rondgang</div>
        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {totaal>0&&<div style={{background:C.yellow,color:'#000',borderRadius:12,padding:'3px 10px',fontSize:11,fontWeight:800}}>{totaal}</div>}
          <button onClick={()=>exportToWord({datum:datumNu(),inspecteur,site,installaties})}
            disabled={!totaal} style={{...sBtn('green'),padding:'6px 12px',fontSize:11,opacity:totaal?1:.4}}>📄 Word</button>
          <button onClick={startNieuw} style={{...sBtn('ghost'),padding:'6px 10px',fontSize:11,color:C.red}}>🗑️</button>
        </div>
      </div>

      <div style={{maxWidth:640,margin:'0 auto',padding:'14px 12px'}}>

        {activeInst&&(
          <div style={{background:'#1a1c0e',border:`2px solid ${C.yellow}`,borderRadius:10,marginBottom:16,overflow:'hidden'}}>
            <div style={{padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <KleurDot kleur={activeInst.kleur}/>
                <div>
                  <div style={{fontSize:10,color:C.yellow,fontWeight:700,letterSpacing:1}}>ACTIEVE INSTALLATIE</div>
                  <div style={{fontSize:14,fontWeight:800,color:'#fff',marginTop:2}}>
                    {activeInst.ref&&activeInst.ref!=='—'?`[${activeInst.ref}] `:''}{activeInst.naam}
                  </div>
                </div>
              </div>
              <button onClick={()=>{setActiveInst(null);setOpenSec(null);}} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:18}}>✕</button>
            </div>

            <div style={{borderTop:`1px solid ${C.border}`}}>
              {SECTIES.map(sec=>{
                const sd=curInst?.secties?.[sec.id]||{notitie:'',fotos:[]};
                const isOpen=openSec===sec.id;
                const heeft=sd.notitie||sd.fotos?.length>0;
                return(
                  <div key={sec.id} style={{borderBottom:`1px solid ${C.border}`}}>
                    <div onClick={()=>setOpenSec(isOpen?null:sec.id)}
                      style={{padding:'10px 16px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',background:isOpen?'#161a0d':'transparent'}}>
                      <div style={{fontSize:12,fontWeight:800,color:C.yellow,minWidth:32}}>{sec.id}</div>
                      <div style={{flex:1,fontSize:12,color:C.text,fontWeight:heeft?700:400}}>{sec.titel}</div>
                      {heeft&&<div style={{display:'flex',gap:4,alignItems:'center'}}>
                        {sd.fotos?.length>0&&<span style={{fontSize:10,color:C.blue}}>📷{sd.fotos.length}</span>}
                        {sd.notitie&&<span style={{fontSize:10,color:C.green}}>✎</span>}
                      </div>}
                      <span style={{fontSize:10,color:C.muted}}>{isOpen?'▲':'▼'}</span>
                    </div>

                    {isOpen&&(
                      <div style={{padding:'10px 16px',background:'#12140e'}}>
                        <textarea value={sd.notitie||''} onChange={e=>updateSec(sec.id,'notitie',e.target.value)}
                          placeholder={`Opmerking bij ${sec.id} ${sec.titel}...`}
                          style={{...sInput,minHeight:60,resize:'vertical',marginBottom:8,fontSize:13}}/>

                        {sd.fotos?.length>0&&(
                          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
                            {sd.fotos.map((f,i)=>(
                              <div key={i} style={{position:'relative'}}>
                                <img src={f} style={{width:90,height:90,objectFit:'cover',borderRadius:6,border:`1px solid ${C.border}`}}/>
                                <button onClick={()=>removeFoto(sec.id,i)}
                                  style={{position:'absolute',top:-6,right:-6,width:20,height:20,borderRadius:10,background:C.red,color:'#fff',border:'none',cursor:'pointer',fontSize:11,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={{display:'flex',gap:8}}>
                          <button onClick={()=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.capture='environment';i.multiple=true;i.onchange=e=>handleFoto(sec.id,e);i.click();}}
                            style={{...sBtn('blue'),flex:1,fontSize:12,padding:'8px 12px'}}>📷 Foto</button>
                          <button onClick={()=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=true;i.onchange=e=>handleFoto(sec.id,e);i.click();}}
                            style={{...sBtn(),flex:1,fontSize:12,padding:'8px 12px'}}>🖼️ Galerij</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* OPSLAAN & EXPORT KNOPPEN */}
            <div style={{padding:'12px 16px',borderTop:`1px solid ${C.border}`,display:'flex',flexDirection:'column',gap:8}}>
              {saved&&<div style={{background:'#1a3a1a',border:`1px solid ${C.green}`,borderRadius:6,padding:'8px 12px',fontSize:12,color:C.green,textAlign:'center',fontWeight:700}}>✅ Opgeslagen! (incl. alle foto's)</div>}
              <div style={{display:'flex',gap:8}}>
                <button onClick={bevestigOpslaan}
                  style={{...sBtn('yellow'),flex:1,padding:'12px',fontSize:13}}>💾 Opslaan</button>
                <button onClick={()=>exportSingleInst(activeInst)}
                  disabled={!telIngevuld(activeInst?.id)}
                  style={{...sBtn('green'),flex:1,padding:'12px',fontSize:13,opacity:telIngevuld(activeInst?.id)?1:.4}}>📄 Word export</button>
              </div>
              <div style={{fontSize:10,color:C.muted,textAlign:'center'}}>
                {telIngevuld(activeInst?.id)}/19 secties ingevuld · {Object.values(curInst?.secties||{}).reduce((t,s)=>t+(s.fotos?.length||0),0)} foto's
              </div>
            </div>
          </div>
        )}

        <div style={{marginBottom:10}}>
          <input value={zoek} onChange={e=>setZoek(e.target.value)} placeholder="🔍 Zoek installatie..." style={{...sInput,marginBottom:8}}/>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {groepen.map(g=><button key={g} onClick={()=>setGroepFilter(g)} style={{padding:'5px 10px',borderRadius:14,fontSize:10,fontWeight:700,cursor:'pointer',border:groepFilter===g?`2px solid ${C.yellow}`:`1px solid ${C.border}`,background:groepFilter===g?'#1a1c0e':C.card,color:groepFilter===g?C.yellow:C.muted}}>{g}</button>)}
          </div>
        </div>

        <div style={{marginBottom:12}}>
          {!showCustom?<button onClick={()=>setShowCustom(true)} style={{...sBtn('ghost'),width:'100%',fontSize:11}}>+ Niet in lijst? Handmatig toevoegen</button>:(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
              <input value={customNaam} onChange={e=>setCustomNaam(e.target.value)} placeholder="Naam *" style={{...sInput,marginBottom:6}}/>
              <input value={customRef} onChange={e=>setCustomRef(e.target.value)} placeholder="Ref (optioneel)" style={{...sInput,marginBottom:8}}/>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{if(!customNaam.trim())return;setActiveInst({id:'c-'+uid(),naam:customNaam.trim(),ref:customRef.trim(),kleur:'#fff'});setShowCustom(false);setCustomNaam('');setCustomRef('');setOpenSec(null);}}
                  disabled={!customNaam.trim()} style={{...sBtn('green'),flex:1,opacity:customNaam.trim()?1:.4}}>Selecteer</button>
                <button onClick={()=>{setShowCustom(false);setCustomNaam('');setCustomRef('');}} style={sBtn('ghost')}>Annuleer</button>
              </div>
            </div>
          )}
        </div>

        <div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1,fontWeight:700}}>INSTALLATIES ({gefilterd.length})</div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {gefilterd.map(inst=>{
            const n=telIngevuld(inst.id);
            const act=activeInst?.id===inst.id;
            return(
              <div key={inst.id} onClick={()=>{setActiveInst(inst);setOpenSec(null);}}
                style={{background:act?'#1a1c0e':C.card,border:act?`2px solid ${C.yellow}`:`1px solid ${C.border}`,borderRadius:8,padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:10}}>
                <KleurDot kleur={inst.kleur}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:act?C.yellow:C.text}}>{inst.naam}</div>
                  <div style={{fontSize:10,color:C.muted}}>{inst.ref} · {inst.afd}</div>
                </div>
                {n>0&&<div style={{background:C.green,color:'#fff',borderRadius:10,padding:'2px 8px',fontSize:10,fontWeight:800}}>{n}/19</div>}
              </div>
            );
          })}
        </div>
        <div style={{height:80}}/>
      </div>

      {totaal>0&&(
        <div style={{position:'fixed',bottom:16,left:'50%',transform:'translateX(-50%)',zIndex:100}}>
          <button onClick={()=>exportToWord({datum:datumNu(),inspecteur,site,installaties})}
            style={{...sBtn('green'),padding:'12px 24px',fontSize:14,boxShadow:'0 4px 20px rgba(0,0,0,0.5)',borderRadius:24}}>
            📄 Export Word ({totaal} installaties)
          </button>
        </div>
      )}
    </div>
  );
}
