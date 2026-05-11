import { useState, useRef, useCallback, useEffect } from "react";

// ─── ARGEX INSTALLATIELIJST — KLEURGROEPEN UIT XLSX ──────────────────────────
// Zelfde kleur = 1 installatie (analyse-eenheid)
const ARGEX_INSTALLATIES = [
  // ► KLEIVOORBEREIDING
  { id:'KVB-PB1', ref:"1.21.01+05+80", naam:"Platenband 1 + Haspel 1 + Auto. Smering", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-PB2', ref:"1.21.02+06", naam:"Platenband 2 + Haspel 2", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-PB3', ref:"1.21.03+07", naam:"Platenband 3 + Haspel 3", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-PB4', ref:"1.21.04+08", naam:"Platenband 4 + Haspel 4", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-PB5', ref:"1.21.09", naam:"Platenband 5 + Haspel 5", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-TS1', ref:"1.21.11+88", naam:"Tonstar 1 + Vrijmaker", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-TS2', ref:"1.21.13+89", naam:"Tonstar 2 + Vrijmaker", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-TS3', ref:"1.21.15+93", naam:"Tonstar 3 + Vrijmaker", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-TS4', ref:"1.21.17+94", naam:"Tonstar 4 + Vrijmaker", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-KG', ref:"1.21.35+37+38", naam:"Kollergang + Oliepomp + Oliekoeler", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#FFCC99" },
  { id:'KVB-TB', ref:"1.21.41→59", naam:"Transportbanden 41-59 + Weeg + Metaaldet.", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#CCFFCC" },
  { id:'KVB-DB1', ref:"1.21.60+62+84", naam:"Doseerband 1 + Triller + Weegtoestel", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#66FFFF" },
  { id:'KVB-DB2', ref:"1.21.61", naam:"Doseerband 2 + Haspel DB2", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#66FFFF" },
  { id:'KVB-VENT', ref:"1.21.90", naam:"Dak- & Muurventilatoren KVB", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#FFCCFF" },
  { id:'KVB-RB', ref:"1.21.91+92", naam:"Rolbrug Elektrisch + Mechanisch KVB", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#FFFFCC" },
  { id:'KVB-LS', ref:"LS", naam:"Laagspanning / Krachtkasten Tonstars", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#fff" },
  { id:'KVB-BUITEN', ref:"1.21.65-68", naam:"Uit dienst: Vijs + Elevator 1 + Band 31-32", afd:"Kleigebouw", groep:"Kleivoorbereiding", kleur:"#FFFF00" },
  // ► OVENINSTALLATIE & BRANDSTOF
  { id:'OV-DROOG', ref:"1.31.01+05+07+09", naam:"Droogoven + Oliepomp + Pendel + Hulpmotor", afd:"Oven", groep:"Oveninstallatie", kleur:"#F4B183" },
  { id:'OV-BRAND', ref:"1.31.15+19+21", naam:"Brandoven + Koelvent. + Pendel + Hulpmotor", afd:"Oven", groep:"Oveninstallatie", kleur:"#BDD7EE" },
  { id:'OV-SMER', ref:"1.31.25", naam:"Smering Stootschijven + Tandkrans (beide ovens)", afd:"Oven", groep:"Oveninstallatie", kleur:"#FFD966" },
  { id:'OV-HDV', ref:"1.31.31", naam:"Hogedrukventilator Brander", afd:"Oven", groep:"Oveninstallatie", kleur:"#fff" },
  { id:'OV-KOEL', ref:"1.31.33", naam:"Ventilator Koeling Ovenkop", afd:"Oven", groep:"Oveninstallatie", kleur:"#fff" },
  { id:'OV-FUEL', ref:"1.31.38", naam:"Pomp Fueltank 2", afd:"Brandstof", groep:"Oveninstallatie", kleur:"#fff" },
  { id:'OV-BROK', ref:"1.31.50", naam:"Pomp Brokkenval", afd:"Oven", groep:"Oveninstallatie", kleur:"#fff" },
  { id:'OV-KWP', ref:"1.31.70+71", naam:"Koelwaterpompen 1 + 2", afd:"Oven", groep:"Oveninstallatie", kleur:"#C5E0B4" },
  { id:'OV-PILL', ref:"—", naam:"Pillard Brander 25MW + Toebehoren", afd:"Oven", groep:"Oveninstallatie", kleur:"#D9E2F3" },
  { id:'OV-BRUG', ref:"—", naam:"Loopbrug naar Oven + Stelling", afd:"Oven", groep:"Oveninstallatie", kleur:"#fff" },
  { id:'OV-CAM', ref:"—", naam:"Camerasysteem Ovenproces — on hold", afd:"Oven", groep:"Oveninstallatie", kleur:"#FFD966" },
  { id:'OV-BKCOMP', ref:"—", naam:"Compressor Bruinkool Backup", afd:"Brandstof", groep:"Oveninstallatie", kleur:"#fff" },
  { id:'OV-BKSILO', ref:"—", naam:"Opslagsilo Bruinkool 250 ton", afd:"Brandstof", groep:"Oveninstallatie", kleur:"#E2EFDA" },
  { id:'OV-AIRDOS', ref:"—", naam:"Doseerinstallatie Airdos (Bruinkool)", afd:"Brandstof", groep:"Oveninstallatie", kleur:"#E2EFDA" },
  { id:'OV-BIO', ref:"—", naam:"Biomassa Installatie (volledig)", afd:"Brandstof", groep:"Oveninstallatie", kleur:"#E2EFDA" },
  { id:'OV-TANKS', ref:"—", naam:"2× Opslagtanks 30.000L + Verdeel", afd:"Brandstof", groep:"Oveninstallatie", kleur:"#E2EFDA" },
  { id:'OV-ARGON', ref:"—", naam:"Inertisering Installatie Argon", afd:"Brandstof", groep:"Oveninstallatie", kleur:"#fff" },
  // ► ELECTROFILTER & STOFAFVOER
  { id:'EF-K123', ref:"1.32.05+06+07", naam:"Electrofilter Kamers 1-3", afd:"Electrofilter", groep:"Electrofilter", kleur:"#F4B183" },
  { id:'EF-RED', ref:"1.32.16", naam:"Redler 2", afd:"Electrofilter", groep:"Electrofilter", kleur:"#BDD7EE" },
  { id:'EF-CEL', ref:"1.32.17", naam:"Cellenrad EF", afd:"Electrofilter", groep:"Electrofilter", kleur:"#C5E0B4" },
  { id:'EF-MENG', ref:"1.32.18", naam:"Mengvijs", afd:"Electrofilter", groep:"Electrofilter", kleur:"#FFD966" },
  { id:'EF-SPIR', ref:"1.32.19", naam:"Spiraalvijs", afd:"Electrofilter", groep:"Electrofilter", kleur:"#E2EFDA" },
  { id:'EF-B55', ref:"1.32.35", naam:"Band 55", afd:"Electrofilter", groep:"Electrofilter", kleur:"#fff" },
  { id:'EF-ROER', ref:"1.32.42", naam:"Roerder", afd:"Electrofilter", groep:"Electrofilter", kleur:"#F8CBAD" },
  { id:'EF-BOX', ref:"1.32.43", naam:"Boxerpomp", afd:"Electrofilter", groep:"Electrofilter", kleur:"#D6DCE4" },
  { id:'EF-TREK', ref:"—", naam:"Trekventilator Schouw + Freq.sturing", afd:"Electrofilter", groep:"Electrofilter", kleur:"#D9E2F3" },
  { id:'EF-ABB', ref:"—", naam:"ABB Emissiemeting + Rekenaar", afd:"Electrofilter", groep:"Electrofilter", kleur:"#D9E2F3" },
  // ► KOELER & TRANSPORT
  { id:'KT-FAN1', ref:"1.33.01", naam:"Koellucht Fan", afd:"Koeler", groep:"Koeler & Transport", kleur:"#fff" },
  { id:'KT-FAN2', ref:"1.33.02", naam:"Recup Lucht Fan", afd:"Koeler", groep:"Koeler & Transport", kleur:"#fff" },
  { id:'KT-FAN3', ref:"1.33.03", naam:"Overmaat Lucht Fan + Koelvent.", afd:"Koeler", groep:"Koeler & Transport", kleur:"#fff" },
  { id:'KT-C13', ref:"1.33.15+17", naam:"Cellenraden 1 + 3", afd:"Koeler", groep:"Koeler & Transport", kleur:"#C5E0B4" },
  { id:'KT-BR1', ref:"1.33.27", naam:"Breker 1", afd:"Koeler", groep:"Koeler & Transport", kleur:"#F4B183" },
  { id:'KT-BAND', ref:"1.33.30-38", naam:"Banden 61-67 (7 stuks)", afd:"Transport", groep:"Koeler & Transport", kleur:"#BDD7EE" },
  { id:'KT-EL23', ref:"1.33.35+36", naam:"Elevator 2 + 3", afd:"Transport", groep:"Koeler & Transport", kleur:"#E2EFDA" },
  { id:'KT-TAK', ref:"1.33.66", naam:"Takel Koelkelder Rijwerk", afd:"Koeler", groep:"Koeler & Transport", kleur:"#fff" },
  { id:'KT-LUSH', ref:"1.33.76", naam:"Hoofdvent. Ontstoffing Luscher", afd:"Transport", groep:"Koeler & Transport", kleur:"#fff" },
  // ► ZEEFAFDELING
  { id:'ZF-ZIFT', ref:"1.41.01-05", naam:"Ziften 1-5 DANO", afd:"Zeefafd.", groep:"Zeefafdeling", kleur:"#fff" },
  { id:'ZF-EL45', ref:"1.41.10-11", naam:"Elevators 4-5", afd:"Zeefafd.", groep:"Zeefafdeling", kleur:"#fff" },
  { id:'ZF-BREK', ref:"1.41.15-18", naam:"Brekers 1A, 1B, 2A, 2B", afd:"Zeefafd.", groep:"Zeefafdeling", kleur:"#fff" },
  { id:'ZF-BAND', ref:"1.41.20-28", naam:"Banden 81-89 (9 stuks)", afd:"Zeefafd.", groep:"Zeefafdeling", kleur:"#fff" },
  { id:'ZF-TRIL', ref:"1.41.35-39", naam:"Trillers 1-5 onder Stock", afd:"Zeefafd.", groep:"Zeefafdeling", kleur:"#fff" },
  { id:'ZF-VENT', ref:"1.41.46", naam:"Hoofdvent. Ontstoffing DANO", afd:"Zeefafd.", groep:"Zeefafdeling", kleur:"#fff" },
  { id:'ZF-VIJS', ref:"1.41.50-51", naam:"Vijzen 1-2", afd:"Zeefafd.", groep:"Zeefafdeling", kleur:"#fff" },
  { id:'ZF-LIFT', ref:"1.41.90", naam:"Personenlift OTIS", afd:"Zeefafd.", groep:"Zeefafdeling", kleur:"#fff" },
  { id:'ZF-VOL', ref:"1.43.01-19", naam:"Volumemeters 1-18 + Vijs 0/2", afd:"Zeefafd.", groep:"Zeefafdeling", kleur:"#fff" },
  // ► ALGEMEEN
  { id:'ALG-ZAAG', ref:"2.12.45", naam:"Steenzaagmachine Ovensteen", afd:"Algemeen", groep:"Algemeen", kleur:"#fff" },
  { id:'ALG-RB', ref:"2.12.75", naam:"Rolbrug Takel Koelkelder", afd:"Algemeen", groep:"Algemeen", kleur:"#fff" },
  { id:'ALG-STOF', ref:"2.12.87", naam:"Mobiele Stofzuiger Industrieel", afd:"Algemeen", groep:"Algemeen", kleur:"#fff" },
  { id:'ALG-COMP', ref:"4.11.41", naam:"Hoofdcompressor ALUP + Koeldroger + Drukvat", afd:"Algemeen", groep:"Algemeen", kleur:"#fff" },
  // ► HS-CABINES
  { id:'HS-KVB', ref:"—", naam:"HS-cabine Kleivoorbereiding", afd:"Elektriciteit", groep:"HS-cabines", kleur:"#fff" },
  { id:'HS-OV', ref:"—", naam:"HS-cabine Ovens", afd:"Elektriciteit", groep:"HS-cabines", kleur:"#fff" },
  { id:'HS-BR', ref:"—", naam:"HS-cabine Brandstofinstallatie", afd:"Elektriciteit", groep:"HS-cabines", kleur:"#fff" },
  { id:'HS-ZF', ref:"—", naam:"HS-cabine Zeefafdeling", afd:"Elektriciteit", groep:"HS-cabines", kleur:"#fff" },
];

// ─── KLEUREN & HELPERS ───────────────────────────────────────────────────────
const C={bg:'#0a0c08',card:'#12140e',border:'#2a2d22',text:'#e8e5d8',muted:'#888a7a',yellow:'#d4a017',green:'#4CAF50',red:'#e74c3c',navy:'#1F3864',blue:'#1a73e8'};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const pad2=n=>String(n).padStart(2,'0');
const datumNu=()=>{const d=new Date();return`${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`;};
const tijdNu=()=>{const d=new Date();return`${pad2(d.getHours())}:${pad2(d.getMinutes())}`;};

const KleurDot=({kleur})=>kleur&&kleur!=='#fff'?(<span style={{display:'inline-block',width:10,height:10,borderRadius:2,background:kleur,border:'1px solid rgba(0,0,0,0.15)',flexShrink:0}}/>):null;

// ─── PDF EXPORT ──────────────────────────────────────────────────────────────
function exportRondgangPDF(rondgang){
  const {datum,inspecteur,site,bevindingen}=rondgang;
  const perInst={};
  bevindingen.forEach(b=>{
    const key=b.installatieId||b.installatieNaam;
    if(!perInst[key])perInst[key]={naam:b.installatieNaam,ref:b.installatieRef,kleur:b.kleur,items:[]};
    perInst[key].items.push(b);
  });
  let body='';
  Object.values(perInst).forEach(inst=>{
    body+=`<div style="page-break-inside:avoid;margin-bottom:20px;border:1px solid #ccc;border-radius:4px;overflow:hidden;">
      <div style="background:${C.navy};color:white;padding:10px 14px;font-size:12pt;font-weight:bold;display:flex;align-items:center;gap:8px;">
        ${inst.kleur&&inst.kleur!=='#fff'?`<span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${inst.kleur};border:1px solid rgba(255,255,255,0.3);"></span>`:''}
        <span>${inst.ref&&inst.ref!=='—'?`[${inst.ref}] `:''}${inst.naam}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:10pt;">
        <thead><tr style="background:#f0f0f0;">
          <th style="border:1px solid #ccc;padding:5px;width:36px;">#</th>
          <th style="border:1px solid #ccc;padding:5px;">Notitie</th>
          <th style="border:1px solid #ccc;padding:5px;width:50px;">Tijd</th>
          <th style="border:1px solid #ccc;padding:5px;width:200px;">Foto</th>
        </tr></thead><tbody>
          ${inst.items.map((item,idx)=>`<tr style="vertical-align:top;">
            <td style="border:1px solid #ccc;padding:5px;text-align:center;font-weight:bold;">${idx+1}</td>
            <td style="border:1px solid #ccc;padding:5px;white-space:pre-wrap;">${item.notitie||'<em style="color:#999;">—</em>'}</td>
            <td style="border:1px solid #ccc;padding:5px;text-align:center;color:#666;font-size:9pt;">${item.tijd||''}</td>
            <td style="border:1px solid #ccc;padding:4px;">${item.fotos?.length>0?item.fotos.map(f=>`<img src="${f}" style="max-width:185px;max-height:140px;display:block;margin:2px auto;border-radius:2px;"/>`).join(''):'<em style="color:#999;text-align:center;display:block;">—</em>'}</td>
          </tr>`).join('')}
        </tbody></table></div>`;
  });
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Rondgang ${datum}</title>
<style>@page{size:A4;margin:14mm;}body{font-family:Calibri,Arial,sans-serif;color:#222;margin:0;}@media print{.no-print{display:none!important;}}</style>
</head><body>
<div style="background:${C.navy};color:white;padding:14px;font-size:15pt;font-weight:bold;text-align:center;margin-bottom:4px;">RONDGANG — VEILIGHEIDSINSPECTIE</div>
<table style="width:100%;font-size:10pt;border-collapse:collapse;margin-bottom:14px;">
  <tr><td style="border:1px solid #ccc;padding:5px;width:110px;background:#f5f5f5;font-weight:bold;">Datum</td><td style="border:1px solid #ccc;padding:5px;">${datum}</td>
  <td style="border:1px solid #ccc;padding:5px;width:110px;background:#f5f5f5;font-weight:bold;">Site</td><td style="border:1px solid #ccc;padding:5px;">${site}</td></tr>
  <tr><td style="border:1px solid #ccc;padding:5px;background:#f5f5f5;font-weight:bold;">Inspecteur</td><td style="border:1px solid #ccc;padding:5px;" colspan="3">${inspecteur}</td></tr>
  <tr><td style="border:1px solid #ccc;padding:5px;background:#f5f5f5;font-weight:bold;">Bevindingen</td><td style="border:1px solid #ccc;padding:5px;">${bevindingen.length}</td>
  <td style="border:1px solid #ccc;padding:5px;background:#f5f5f5;font-weight:bold;">Installaties</td><td style="border:1px solid #ccc;padding:5px;">${Object.keys(perInst).length}</td></tr>
</table>${body}
<div style="margin-top:16px;font-size:8pt;color:#999;text-align:center;">MachineCheck Pro — Rondgang · ${datum}</div>
<div class="no-print" style="text-align:center;margin:20px;"><button onclick="window.print()" style="padding:12px 28px;font-size:13pt;background:${C.navy};color:white;border:none;border-radius:6px;cursor:pointer;">🖨️ Afdrukken / Opslaan als PDF</button></div>
</body></html>`;
  const w=window.open('','_blank');
  if(w){w.document.write(html);w.document.close();}else alert('Pop-up geblokkeerd.');
}

// ─── RONDGANG COMPONENT ──────────────────────────────────────────────────────
export default function RondgangModule({onTerug}){
  const [stap,setStap]=useState('start');
  const [inspecteur,setInspecteur]=useState('Bert Verbraecken');
  const [site,setSite]=useState('Argex – Kleigebouw Burcht-Zwijndrecht-Beveren');
  const [bevindingen,setBevindingen]=useState([]);
  const [zoek,setZoek]=useState('');
  const [groepFilter,setGroepFilter]=useState('Alle');
  const [showCustom,setShowCustom]=useState(false);
  const [customNaam,setCustomNaam]=useState('');
  const [customRef,setCustomRef]=useState('');
  const [activeInstallatie,setActiveInstallatie]=useState(null);
  const [notitie,setNotitie]=useState('');
  const [fotos,setFotos]=useState([]);
  const fotoRef=useRef();

  // Autosave
  useEffect(()=>{
    const s=localStorage.getItem('rondgang_v2');
    if(s){try{const d=JSON.parse(s);if(d.bevindingen?.length){setBevindingen(d.bevindingen);setInspecteur(d.inspecteur||'');setSite(d.site||'');setStap('rondgang');}}catch(e){}}
  },[]);
  useEffect(()=>{
    if(bevindingen.length>0)localStorage.setItem('rondgang_v2',JSON.stringify({bevindingen,inspecteur,site}));
  },[bevindingen,inspecteur,site]);

  const groepen=['Alle',...new Set(ARGEX_INSTALLATIES.map(i=>i.groep))];
  const gefilterd=ARGEX_INSTALLATIES.filter(i=>{
    if(groepFilter!=='Alle'&&i.groep!==groepFilter)return false;
    if(zoek){const z=zoek.toLowerCase();return i.naam.toLowerCase().includes(z)||i.ref.toLowerCase().includes(z)||i.afd.toLowerCase().includes(z);}
    return true;
  });

  const handleFoto=useCallback(e=>{
    Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>setFotos(prev=>[...prev,ev.target.result]);r.readAsDataURL(file);});
    e.target.value='';
  },[]);

  const voegToe=()=>{
    if(!activeInstallatie||(!notitie.trim()&&fotos.length===0))return;
    setBevindingen(prev=>[...prev,{
      id:uid(),installatieId:activeInstallatie.id||activeInstallatie.naam,
      installatieNaam:activeInstallatie.naam,installatieRef:activeInstallatie.ref||'',
      kleur:activeInstallatie.kleur||'#fff',
      notitie:notitie.trim(),fotos:[...fotos],tijd:tijdNu(),datum:datumNu(),
    }]);
    setNotitie('');setFotos([]);
  };

  const verwijder=id=>setBevindingen(prev=>prev.filter(b=>b.id!==id));
  const startNieuw=()=>{localStorage.removeItem('rondgang_v2');setBevindingen([]);setStap('start');};

  // Styles
  const sBtn=(v='default')=>({
    padding:'10px 18px',border:'none',borderRadius:6,cursor:'pointer',fontWeight:700,fontSize:13,fontFamily:'sans-serif',transition:'all .15s',
    ...(v==='yellow'?{background:C.yellow,color:'#000'}:v==='green'?{background:C.green,color:'#fff'}:v==='red'?{background:C.red,color:'#fff'}:v==='blue'?{background:C.blue,color:'#fff'}:v==='ghost'?{background:'transparent',border:`1px solid ${C.border}`,color:C.muted}:{background:C.card,border:`1px solid ${C.border}`,color:C.text}),
  });
  const sInput={background:'#1a1c14',border:`1px solid ${C.border}`,borderRadius:6,padding:'10px 12px',color:C.text,fontSize:14,fontFamily:'sans-serif',width:'100%',boxSizing:'border-box',outline:'none'};

  // ─── START ──────────────────────────────────────────────────────────────
  if(stap==='start')return(
    <div style={{background:C.bg,minHeight:'100vh',fontFamily:'sans-serif',color:C.text}}>
      <div style={{background:'#14160f',borderBottom:`1px solid ${C.border}`,padding:'14px 18px',display:'flex',alignItems:'center',gap:12}}>
        <button onClick={onTerug} style={sBtn('ghost')}>← Terug</button>
        <div style={{fontSize:16,fontWeight:800}}>🚶 Rondgang</div>
      </div>
      <div style={{maxWidth:560,margin:'0 auto',padding:'28px 16px'}}>
        <div style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:6}}>Nieuwe Rondgang</div>
        <p style={{fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:24}}>
          Loop langs installaties, noteer bevindingen met foto's, genereer een PDF-rapport.
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
        {bevindingen.length>0&&(
          <div style={{marginTop:16,padding:12,background:'#1a1c0e',border:`1px solid ${C.yellow}33`,borderRadius:6,fontSize:12,color:C.yellow}}>
            ⚠️ Lopende rondgang: {bevindingen.length} bevinding(en)
            <button onClick={()=>setStap('rondgang')} style={{...sBtn('yellow'),marginTop:8,width:'100%',padding:'8px'}}>Hervat</button>
          </div>
        )}
      </div>
    </div>
  );

  // ─── OVERZICHT ──────────────────────────────────────────────────────────
  if(stap==='overzicht'){
    const perInst={};
    bevindingen.forEach(b=>{const key=b.installatieId||b.installatieNaam;if(!perInst[key])perInst[key]={naam:b.installatieNaam,ref:b.installatieRef,kleur:b.kleur,items:[]};perInst[key].items.push(b);});
    return(
      <div style={{background:C.bg,minHeight:'100vh',fontFamily:'sans-serif',color:C.text}}>
        <div style={{background:'#14160f',borderBottom:`1px solid ${C.border}`,padding:'14px 18px',display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>setStap('rondgang')} style={sBtn('ghost')}>← Terug</button>
          <div style={{fontSize:16,fontWeight:800}}>📋 Overzicht</div>
        </div>
        <div style={{maxWidth:640,margin:'0 auto',padding:'20px 16px'}}>
          <div style={{display:'flex',gap:12,marginBottom:20}}>
            {[[bevindingen.length,'BEVINDINGEN',C.yellow],[Object.keys(perInst).length,'INSTALLATIES',C.green],[bevindingen.filter(b=>b.fotos?.length>0).length,'MET FOTO',C.blue]].map(([n,l,c])=>(
              <div key={l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:'14px 18px',flex:1,textAlign:'center'}}>
                <div style={{fontSize:28,fontWeight:800,color:c}}>{n}</div><div style={{fontSize:10,color:C.muted}}>{l}</div>
              </div>
            ))}
          </div>
          {Object.values(perInst).map(inst=>(
            <div key={inst.ref||inst.naam} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,marginBottom:12,overflow:'hidden'}}>
              <div style={{background:C.navy,color:'#fff',padding:'8px 14px',fontSize:13,fontWeight:700,display:'flex',alignItems:'center',gap:8}}>
                <KleurDot kleur={inst.kleur}/><span style={{flex:1}}>{inst.ref&&inst.ref!=='—'?`[${inst.ref}] `:''}{inst.naam}</span><span style={{opacity:.7}}>{inst.items.length}×</span>
              </div>
              {inst.items.map((item,idx)=>(
                <div key={item.id} style={{padding:'10px 14px',borderBottom:`1px solid ${C.border}`,display:'flex',gap:10,alignItems:'flex-start'}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.yellow,minWidth:22}}>{idx+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{item.notitie||'—'}</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:4}}>{item.tijd}</div>
                    {item.fotos?.length>0&&<div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>{item.fotos.map((f,i)=><img key={i} src={f} style={{width:60,height:60,objectFit:'cover',borderRadius:4,border:`1px solid ${C.border}`}}/>)}</div>}
                  </div>
                  <button onClick={()=>verwijder(item.id)} style={{background:'none',border:'none',color:C.red,cursor:'pointer',fontSize:16}}>✕</button>
                </div>
              ))}
            </div>
          ))}
          <div style={{display:'flex',gap:10,marginTop:20}}>
            <button onClick={()=>exportRondgangPDF({datum:datumNu(),inspecteur,site,bevindingen})} style={{...sBtn('green'),flex:1,padding:14,fontSize:15}}>📄 Exporteer PDF</button>
            <button onClick={startNieuw} style={{...sBtn('red'),padding:14}}>🗑️ Nieuw</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RONDGANG ACTIEF ────────────────────────────────────────────────────
  return(
    <div style={{background:C.bg,minHeight:'100vh',fontFamily:'sans-serif',color:C.text}}>
      {/* TOPBAR */}
      <div style={{background:'#14160f',borderBottom:`1px solid ${C.border}`,padding:'10px 14px',display:'flex',alignItems:'center',gap:10,position:'sticky',top:0,zIndex:100}}>
        <button onClick={onTerug} style={{...sBtn('ghost'),padding:'6px 10px',fontSize:11}}>← Menu</button>
        <div style={{fontSize:14,fontWeight:800}}>🚶 Rondgang</div>
        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {bevindingen.length>0&&<div style={{background:C.yellow,color:'#000',borderRadius:12,padding:'3px 10px',fontSize:11,fontWeight:800}}>{bevindingen.length}</div>}
          <button onClick={()=>setStap('overzicht')} style={{...sBtn('green'),padding:'6px 12px',fontSize:11}}>📋 Overzicht</button>
        </div>
      </div>

      <div style={{maxWidth:640,margin:'0 auto',padding:'14px 12px'}}>

        {/* ACTIEVE INSTALLATIE */}
        {activeInstallatie&&(
          <div style={{background:'#1a1c0e',border:`2px solid ${C.yellow}`,borderRadius:10,padding:16,marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <KleurDot kleur={activeInstallatie.kleur}/>
                <div>
                  <div style={{fontSize:10,color:C.yellow,fontWeight:700,letterSpacing:1}}>ACTIEVE INSTALLATIE</div>
                  <div style={{fontSize:14,fontWeight:800,color:'#fff',marginTop:2}}>
                    {activeInstallatie.ref&&activeInstallatie.ref!=='—'?`[${activeInstallatie.ref}] `:''}{activeInstallatie.naam}
                  </div>
                </div>
              </div>
              <button onClick={()=>{setActiveInstallatie(null);setNotitie('');setFotos([]);}} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:18}}>✕</button>
            </div>

            <textarea value={notitie} onChange={e=>setNotitie(e.target.value)} placeholder="Notitie... (wat valt op? gevaar? actie nodig?)" style={{...sInput,minHeight:70,resize:'vertical',marginBottom:10}}/>

            {fotos.length>0&&(
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}>
                {fotos.map((f,i)=>(
                  <div key={i} style={{position:'relative'}}>
                    <img src={f} style={{width:68,height:68,objectFit:'cover',borderRadius:6,border:`1px solid ${C.border}`}}/>
                    <button onClick={()=>setFotos(prev=>prev.filter((_,j)=>j!==i))} style={{position:'absolute',top:-6,right:-6,width:20,height:20,borderRadius:10,background:C.red,color:'#fff',border:'none',cursor:'pointer',fontSize:11,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{display:'flex',gap:8}}>
              <input ref={fotoRef} type="file" accept="image/*" capture="environment" multiple onChange={handleFoto} style={{display:'none'}}/>
              <button onClick={()=>fotoRef.current?.click()} style={{...sBtn('blue'),flex:1}}>📷 Foto</button>
              <button onClick={()=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=true;i.onchange=handleFoto;i.click();}} style={{...sBtn(),flex:1}}>🖼️ Galerij</button>
              <button onClick={voegToe} disabled={!notitie.trim()&&fotos.length===0} style={{...sBtn('yellow'),flex:1.5,opacity:(!notitie.trim()&&fotos.length===0)?.4:1}}>✓ Opslaan</button>
            </div>
          </div>
        )}

        {/* ZOEK & FILTER */}
        <div style={{marginBottom:10}}>
          <input value={zoek} onChange={e=>setZoek(e.target.value)} placeholder="🔍 Zoek installatie..." style={{...sInput,marginBottom:8}}/>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {groepen.map(g=><button key={g} onClick={()=>setGroepFilter(g)} style={{padding:'5px 10px',borderRadius:14,fontSize:10,fontWeight:700,cursor:'pointer',border:groepFilter===g?`2px solid ${C.yellow}`:`1px solid ${C.border}`,background:groepFilter===g?'#1a1c0e':C.card,color:groepFilter===g?C.yellow:C.muted}}>{g}</button>)}
          </div>
        </div>

        {/* VRIJ INVULLEN */}
        <div style={{marginBottom:12}}>
          {!showCustom?<button onClick={()=>setShowCustom(true)} style={{...sBtn('ghost'),width:'100%',fontSize:11}}>+ Niet in lijst? Handmatig toevoegen</button>:(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
              <div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:8}}>HANDMATIG</div>
              <input value={customNaam} onChange={e=>setCustomNaam(e.target.value)} placeholder="Naam *" style={{...sInput,marginBottom:6}}/>
              <input value={customRef} onChange={e=>setCustomRef(e.target.value)} placeholder="Ref (optioneel)" style={{...sInput,marginBottom:8}}/>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{if(!customNaam.trim())return;setActiveInstallatie({id:'c-'+uid(),naam:customNaam.trim(),ref:customRef.trim(),kleur:'#fff'});setShowCustom(false);setCustomNaam('');setCustomRef('');}} disabled={!customNaam.trim()} style={{...sBtn('green'),flex:1,opacity:customNaam.trim()?1:.4}}>Selecteer</button>
                <button onClick={()=>{setShowCustom(false);setCustomNaam('');setCustomRef('');}} style={sBtn('ghost')}>Annuleer</button>
              </div>
            </div>
          )}
        </div>

        {/* INSTALLATIELIJST */}
        <div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1,fontWeight:700}}>INSTALLATIES ({gefilterd.length})</div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {gefilterd.map(inst=>{
            const n=bevindingen.filter(b=>b.installatieId===inst.id).length;
            const act=activeInstallatie?.id===inst.id;
            return(
              <div key={inst.id} onClick={()=>{setActiveInstallatie(inst);setNotitie('');setFotos([]);}}
                style={{background:act?'#1a1c0e':C.card,border:act?`2px solid ${C.yellow}`:`1px solid ${C.border}`,borderRadius:8,padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:10}}>
                <KleurDot kleur={inst.kleur}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:act?C.yellow:C.text}}>{inst.naam}</div>
                  <div style={{fontSize:10,color:C.muted}}>{inst.ref} · {inst.afd}</div>
                </div>
                {n>0&&<div style={{background:C.yellow,color:'#000',borderRadius:10,padding:'2px 8px',fontSize:10,fontWeight:800}}>{n}</div>}
              </div>
            );
          })}
        </div>

        {/* RECENT */}
        {bevindingen.length>0&&(
          <div style={{marginTop:20}}>
            <div style={{fontSize:10,color:C.muted,marginBottom:8,letterSpacing:1,fontWeight:700}}>RECENT TOEGEVOEGD</div>
            {[...bevindingen].reverse().slice(0,5).map(b=>(
              <div key={b.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:'8px 12px',marginBottom:4,display:'flex',gap:8,alignItems:'center'}}>
                <KleurDot kleur={b.kleur}/>
                {b.fotos?.length>0&&<img src={b.fotos[0]} style={{width:36,height:36,objectFit:'cover',borderRadius:4}}/>}
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.text}}>{b.installatieNaam}</div>
                  <div style={{fontSize:10,color:C.muted}}>{b.notitie?.slice(0,50)}{b.notitie?.length>50?'...':''}</div>
                </div>
                <div style={{fontSize:9,color:C.muted}}>{b.tijd}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{height:80}}/>
      </div>

      {/* FLOATING */}
      {bevindingen.length>0&&(
        <div style={{position:'fixed',bottom:16,left:'50%',transform:'translateX(-50%)',zIndex:100}}>
          <button onClick={()=>setStap('overzicht')} style={{...sBtn('green'),padding:'12px 24px',fontSize:14,boxShadow:'0 4px 20px rgba(0,0,0,0.5)',borderRadius:24}}>
            📄 Overzicht & PDF ({bevindingen.length})
          </button>
        </div>
      )}
    </div>
  );
}
