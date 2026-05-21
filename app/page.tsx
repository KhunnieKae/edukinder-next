"use client"
import { useState, useEffect, useRef } from "react";

const C = {
  sky:"#E8F4FD",skyMid:"#C5E4F7",skyDeep:"#76C3F0",
  blue:"#3B9FE8",blueDark:"#1A6FB5",teal:"#2ABFBF",
  white:"#FFFFFF",cloud:"#F7FBFF",slate:"#64748B",
  slateLight:"#94A3B8",dark:"#1E293B",darkMid:"#334155",
  gold:"#F59E0B",amber:"#FBBF24",rose:"#FB7185",
  violet:"#8B5CF6",green:"#22C55E",orange:"#F97316",
};

const levelData=[
  {lv:1,name:"ครูฝึกหัด",minExp:0,maxExp:200,color:"#94A3B8",emoji:"🌱"},
  {lv:2,name:"ครูขยัน",minExp:200,maxExp:500,color:"#3B9FE8",emoji:"⭐"},
  {lv:3,name:"นักจัดประสบการณ์มือโปร",minExp:500,maxExp:1000,color:"#8B5CF6",emoji:"💜"},
  {lv:4,name:"ครูพลังแสง",minExp:1000,maxExp:2000,color:"#F59E0B",emoji:"✨"},
  {lv:5,name:"Legendary Teacher",minExp:2000,maxExp:9999,color:"#FB7185",emoji:"🌟"},
];
const getLevel=(exp)=>levelData.findLast(l=>exp>=l.minExp)||levelData[0];

const statusConfig={
  draft:{label:"แบบร่าง",bg:"#F1F5F9",text:"#64748B",dot:"#CBD5E1"},
  submitted:{label:"ส่งแล้ว",bg:"#EFF6FF",text:"#3B9FE8",dot:"#3B9FE8"},
  pending_review:{label:"รอตรวจ",bg:"#FEF9C3",text:"#A16207",dot:"#EAB308"},
  approved:{label:"อนุมัติแล้ว",bg:"#DCFCE7",text:"#166534",dot:"#22C55E"},
  rejected:{label:"ตีกลับ",bg:"#FFF1F2",text:"#BE123C",dot:"#FB7185"},
  overdue:{label:"เกินกำหนด",bg:"#FFF7ED",text:"#9A3412",dot:"#F97316"},
};

const activities=[
  {key:"movement",label:"กิจกรรมเคลื่อนไหวและจังหวะ",icon:"🏃"},
  {key:"experience",label:"กิจกรรมเสริมประสบการณ์",icon:"🔍"},
  {key:"art",label:"กิจกรรมศิลปะสร้างสรรค์",icon:"🎨"},
  {key:"corner",label:"กิจกรรมเล่นตามมุม",icon:"🧩"},
  {key:"outdoor",label:"กิจกรรมกลางแจ้ง",icon:"⛅"},
  {key:"game",label:"เกมการศึกษา",icon:"🎮"},
];

const mockTeachers=[
  {id:1,name:"ครูอ้อม",classroom:"ห้อง อนุบาล 1/1",exp:1450,streak:14,reports:28,pending:2,avatarColor:"#FDE68A"},
  {id:2,name:"ครูเนย",classroom:"ห้อง อนุบาล 1/2",exp:2100,streak:22,reports:35,pending:0,avatarColor:"#BBF7D0"},
  {id:3,name:"ครูแนน",classroom:"ห้อง อนุบาล 2/1",exp:680,streak:7,reports:18,pending:3,avatarColor:"#BFDBFE"},
  {id:4,name:"ครูพลอย",classroom:"ห้อง อนุบาล 2/2",exp:320,streak:5,reports:12,pending:1,avatarColor:"#FCA5A5"},
];

const mockReports=[
  {id:1,teacher:"ครูอ้อม",classroom:"อนุบาล 1/1",unit:"ฉันและครอบครัว",date:"2026-05-13",status:"approved",images:4},
  {id:2,teacher:"ครูเนย",classroom:"อนุบาล 1/2",unit:"สัตว์เลี้ยง",date:"2026-05-13",status:"pending_review",images:6},
  {id:3,teacher:"ครูแนน",classroom:"อนุบาล 2/1",unit:"ธรรมชาติรอบตัว",date:"2026-05-12",status:"submitted",images:3},
  {id:4,teacher:"ครูพลอย",classroom:"อนุบาล 2/2",unit:"อาหารและโภชนาการ",date:"2026-05-11",status:"rejected",images:2},
  {id:5,teacher:"ครูอ้อม",classroom:"อนุบาล 1/1",unit:"สีสันสดใส",date:"2026-05-10",status:"approved",images:5},
  {id:6,teacher:"ครูแนน",classroom:"อนุบาล 2/1",unit:"ฤดูกาล",date:"2026-05-09",status:"draft",images:0},
];

const mockActivityDetail=[
  {icon:"🏃",label:"กิจกรรมเคลื่อนไหวและจังหวะ",objective:"พัฒนาทักษะการเคลื่อนไหวตามจังหวะดนตรี",result:"เด็กส่วนใหญ่เคลื่อนไหวตามจังหวะได้ดี",passed:"18 คน",failed:"2 คน",problem:"เด็ก 2 คนยังควบคุมจังหวะไม่ได้",solution:"ฝึกซ้ำในกิจกรรมเช้า"},
  {icon:"🔍",label:"กิจกรรมเสริมประสบการณ์",objective:"สำรวจและเรียนรู้เรื่องสมาชิกในครอบครัว",result:"เด็กบอกชื่อสมาชิกในครอบครัวได้ถูกต้อง",passed:"19 คน",failed:"1 คน",problem:"เด็ก 1 คนขาดเรียน",solution:"ติดตามเนื้อหาวันถัดไป"},
  {icon:"🎨",label:"กิจกรรมศิลปะสร้างสรรค์",objective:"วาดภาพครอบครัวด้วยสีเทียน",result:"เด็กทุกคนมีส่วนร่วม",passed:"20 คน",failed:"0 คน",problem:"ไม่มี",solution:"ไม่มี"},
  {icon:"🧩",label:"กิจกรรมเล่นตามมุม",objective:"ส่งเสริมทักษะสังคมและจินตนาการ",result:"เด็กเล่นร่วมกันได้ดี",passed:"18 คน",failed:"2 คน",problem:"เด็ก 2 คนทะเลาะกัน",solution:"สอนการแบ่งปัน"},
  {icon:"⛅",label:"กิจกรรมกลางแจ้ง",objective:"พัฒนากล้ามเนื้อใหญ่",result:"เด็กออกกำลังกายสนุกสนาน",passed:"20 คน",failed:"0 คน",problem:"ไม่มี",solution:"ไม่มี"},
  {icon:"🎮",label:"เกมการศึกษา",objective:"จับคู่รูปภาพสมาชิกในครอบครัว",result:"เด็กส่วนใหญ่จับคู่ได้ถูกต้อง",passed:"17 คน",failed:"3 คน",problem:"สับสนระหว่างปู่-ตา",solution:"ทบทวนโดยใช้รูปภาพจริง"},
];

const monthlyData=[
  {month:"ม.ค.",v:42},{month:"ก.พ.",v:38},{month:"มี.ค.",v:55},{month:"เม.ย.",v:48},{month:"พ.ค.",v:62},
];

const feedItems=[
  {id:1,msg:"ครูอ้อม ส่งรายงานครบแล้ว",sub:"+25 EXP 🎉",time:"5 นาทีที่แล้ว",color:C.blue},
  {id:2,msg:"ครูเนย เลเวลอัปเป็น LV.5! 🌟",sub:"Legendary Teacher",time:"1 ชั่วโมงที่แล้ว",color:C.gold},
  {id:3,msg:"ครูแนน ได้รับ Badge ใหม่!",sub:"🏅 ส่งตรงเวลา 7 วัน",time:"3 ชั่วโมงที่แล้ว",color:C.violet},
  {id:4,msg:"ครูพลอย ส่งรายงานสัปดาห์นี้ครบ",sub:"+15 EXP ✨",time:"เมื่อวาน",color:C.teal},
];

const demoAccounts=[
  {email:"teacher@edukinder.th",password:"1234",role:"teacher",name:"ครูอ้อม",classroom:"ห้อง อนุบาล 1/1",avatarColor:"#FDE68A"},
  {email:"admin@edukinder.th",password:"1234",role:"admin",name:"ผอ.สมชาย",classroom:"ผู้บริหารโรงเรียน",avatarColor:"#BFDBFE"},
];

// ── Micro components ───────────────────────────────────────
function Badge({status}){
  const cfg=statusConfig[status]||statusConfig.draft;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600,background:cfg.bg,color:cfg.text,whiteSpace:"nowrap"}}><span style={{width:7,height:7,borderRadius:"50%",background:cfg.dot,display:"inline-block"}}/>{cfg.label}</span>;
}
function Av({name,color="#E0F2FE",size=38}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.42,fontWeight:700,color:C.darkMid,flexShrink:0}}>{name?.charAt(0)||"?"}</div>;
}
function ExpBar({exp}){
  const lv=getLevel(exp);const nx=levelData[lv.lv]||lv;
  const pct=Math.min(100,((exp-lv.minExp)/(nx.maxExp-lv.minExp))*100);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12,color:C.slate}}><span>{lv.emoji} {lv.name}</span><span>{exp}/{nx.maxExp} EXP</span></div>
      <div style={{height:8,background:C.skyMid,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,borderRadius:99,background:`linear-gradient(90deg,${lv.color},${C.teal})`}}/></div>
    </div>
  );
}
function Card({children,style={}}){
  return <div style={{background:C.white,borderRadius:16,padding:"20px 22px",boxShadow:"0 2px 12px rgba(59,159,232,0.08)",border:`1px solid ${C.skyMid}`,...style}}>{children}</div>;
}
function Stat({icon,label,value,color=C.blue,sub}){
  return(
    <Card style={{display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:48,height:48,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:color+"20",fontSize:22}}>{icon}</div>
      <div><div style={{fontSize:22,fontWeight:800,color:C.dark,lineHeight:1}}>{value}</div><div style={{fontSize:13,color:C.slate,marginTop:3}}>{label}</div>{sub&&<div style={{fontSize:11,color,marginTop:2,fontWeight:600}}>{sub}</div>}</div>
    </Card>
  );
}
function MiniBar({data}){
  const mx=Math.max(...data.map(d=>d.v));
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:6,height:60}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{width:"100%",borderRadius:"6px 6px 0 0",height:`${(d.v/mx)*52}px`,background:i===data.length-1?`linear-gradient(180deg,${C.blue},${C.teal})`:C.skyMid}}/>
          <span style={{fontSize:9,color:C.slateLight}}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ── ReportRow ──────────────────────────────────────────────
function ReportRow({r,onOpen,onDelete}){
  const [confirmDel,setConfirmDel]=useState(false);
  const handleDel=(e)=>{
    e.stopPropagation();
    if(confirmDel){onDelete?.(r.id);setConfirmDel(false);}
    else{setConfirmDel(true);setTimeout(()=>setConfirmDel(false),3000);}
  };
  return(
    <div onClick={()=>onOpen(r)}
      style={{background:C.white,borderRadius:14,padding:"14px 18px",border:`1px solid ${confirmDel?C.rose+"60":C.skyMid}`,display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"all 0.15s"}}
      onMouseEnter={e=>{if(!confirmDel){e.currentTarget.style.background=C.sky;e.currentTarget.style.boxShadow=`0 4px 16px rgba(59,159,232,0.15)`;} }}
      onMouseLeave={e=>{e.currentTarget.style.background=C.white;e.currentTarget.style.boxShadow="none";}}>
      <div style={{width:42,height:42,borderRadius:12,background:C.sky,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📄</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,color:C.dark,fontSize:14}}>{r.unit}</div>
        <div style={{fontSize:11,color:C.slateLight,marginTop:2}}>{r.teacher} · {r.classroom} · {r.date} · 📸{r.images||0} รูป</div>
      </div>
      <Badge status={r.status}/>
      <button onClick={handleDel} style={{padding:confirmDel?"6px 12px":"6px 10px",borderRadius:8,border:"none",background:confirmDel?C.rose:`${C.rose}15`,color:confirmDel?"#fff":C.rose,fontSize:confirmDel?12:14,fontWeight:700,cursor:"pointer",flexShrink:0,transition:"all 0.2s",whiteSpace:"nowrap"}}>
        {confirmDel?"ยืนยันลบ?":"🗑️"}
      </button>
      <span style={{fontSize:20,color:C.blue,fontWeight:700,flexShrink:0}}>›</span>
    </div>
  );
}

// ── PDF Preview ────────────────────────────────────────────
function PDFPreview({report,onClose}){
  const PAGE_W=794;
  const containerRef=useRef(null);
  const [zoom,setZoom]=useState(1);
  useEffect(()=>{
    const fit=()=>{const w=containerRef.current?.clientWidth||window.innerWidth;setZoom(parseFloat(Math.min(1,(w-48)/PAGE_W).toFixed(2)));};
    fit();window.addEventListener("resize",fit);return()=>window.removeEventListener("resize",fit);
  },[]);
  const actData=mockActivityDetail;
  return(
    <div style={{position:"fixed",inset:0,zIndex:999999,background:"rgba(15,23,42,0.92)",display:"flex",flexDirection:"column"}}>
      <div style={{background:"#0F172A",padding:"10px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <button onClick={onClose} style={{padding:"7px 14px",borderRadius:8,border:"1.5px solid rgba(255,255,255,0.2)",background:"transparent",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>← กลับ</button>
        <div style={{flex:1,fontSize:13,fontWeight:700,color:"#fff"}}>📄 {report.unit}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"4px 8px"}}>
          <button onClick={()=>setZoom(z=>Math.max(0.3,parseFloat((z-0.1).toFixed(1))))} style={{width:28,height:28,borderRadius:6,border:"none",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
          <span style={{fontSize:12,color:"#94A3B8",minWidth:40,textAlign:"center",fontWeight:600}}>{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(1.5,parseFloat((z+0.1).toFixed(1))))} style={{width:28,height:28,borderRadius:6,border:"none",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
          <button onClick={()=>{const w=containerRef.current?.clientWidth||window.innerWidth;setZoom(parseFloat(Math.min(1,(w-48)/PAGE_W).toFixed(2)));}} style={{padding:"0 8px",height:28,borderRadius:6,border:"none",background:"rgba(59,159,232,0.2)",color:"#76C3F0",fontSize:11,fontWeight:700,cursor:"pointer"}}>FIT</button>
        </div>
        <button onClick={()=>window.print()} style={{padding:"8px 14px",borderRadius:8,border:"1.5px solid #3B9FE8",background:"transparent",color:"#3B9FE8",fontSize:13,fontWeight:700,cursor:"pointer"}}>🖨️ พิมพ์</button>
        <button onClick={()=>window.print()} style={{padding:"8px 16px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#3B9FE8,#2ABFBF)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>⬇️ PDF</button>
      </div>
      <div ref={containerRef} style={{flex:1,overflowY:"auto",overflowX:"auto",background:"#1E293B",padding:"28px 16px 60px",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:PAGE_W*zoom,minHeight:1123*zoom,flexShrink:0,position:"relative"}}>
          <div style={{width:PAGE_W,background:"white",boxShadow:"0 8px 48px rgba(0,0,0,0.5)",borderRadius:4,padding:"44px 48px",position:"absolute",top:0,left:0,transformOrigin:"top left",transform:`scale(${zoom})`}}>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) rotate(-30deg)",fontSize:80,fontWeight:800,color:"rgba(59,159,232,0.04)",whiteSpace:"nowrap",pointerEvents:"none",userSelect:"none"}}>EduKinder</div>
            <div style={{display:"flex",alignItems:"flex-start",gap:18,marginBottom:20,position:"relative"}}>
              <div style={{width:72,height:72,borderRadius:14,background:"linear-gradient(135deg,#3B9FE8,#2ABFBF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0}}>🌟</div>
              <div style={{flex:1,textAlign:"center"}}>
                <div style={{fontSize:10,color:"#94A3B8",marginBottom:2}}>กรมส่งเสริมการปกครองท้องถิ่น</div>
                <div style={{fontSize:17,fontWeight:800,color:"#1E293B"}}>โรงเรียนเทศบาล ๑ (วัดเกาะ)</div>
                <div style={{fontSize:13,fontWeight:700,color:"#3B9FE8",marginTop:4}}>แบบบันทึกหลังการจัดประสบการณ์การเรียนรู้ระดับปฐมวัย</div>
                <div style={{fontSize:11,color:"#64748B",marginTop:2}}>ภาคเรียนที่ 1 ปีการศึกษา 2569</div>
              </div>
              <div style={{width:66,height:66,borderRadius:"50%",border:`3px solid ${report.status==="approved"?"#22C55E":"#94A3B8"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <div style={{fontSize:9,fontWeight:800,color:report.status==="approved"?"#22C55E":"#94A3B8",textAlign:"center",lineHeight:1.5}}>{report.status==="approved"?"อนุมัติ\nแล้ว":"รอ\nตรวจ"}</div>
                <div style={{fontSize:14,color:report.status==="approved"?"#22C55E":"#94A3B8"}}>{report.status==="approved"?"✓":"○"}</div>
              </div>
            </div>
            <div style={{height:2,background:"linear-gradient(90deg,#3B9FE8,#2ABFBF,#3B9FE8)",borderRadius:2,marginBottom:16}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:18}}>
              {[["👩‍🏫 ครูผู้สอน",report.teacher],["🏫 ชั้นเรียน",report.classroom],["📅 วันที่",report.date],["📖 หน่วยการเรียนรู้",report.unit]].map(([l,v])=>(
                <div key={l} style={{background:"#F7FBFF",border:"1px solid #C5E4F7",borderRadius:8,padding:"8px 10px"}}>
                  <div style={{fontSize:9,color:"#94A3B8",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:11,fontWeight:700,color:"#1E293B"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:18}}>
              {[["👧","นักเรียนทั้งหมด","20 คน","#EFF6FF","#93C5FD","#3B9FE8"],["✅","ผ่านเกณฑ์รวม","112 ครั้ง","#DCFCE7","#86EFAC","#22C55E"],["📋","ต้องพัฒนา","8 ครั้ง","#FFF1F2","#FDA4AF","#FB7185"],["📸","รูปภาพ",`${report.imgs?.length||report.images||0} รูป`,"#FEF9C3","#FDE047","#F59E0B"]].map(([ic,l,v,bg,bd,col])=>(
                <div key={l} style={{flex:1,background:bg,border:`1px solid ${bd}`,borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16}}>{ic}</span>
                  <div><div style={{fontSize:9,color:"#64748B"}}>{l}</div><div style={{fontSize:14,fontWeight:800,color:col}}>{v}</div></div>
                </div>
              ))}
            </div>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:800,color:"#1E293B",marginBottom:8}}>📋 บันทึกกิจกรรม 6 กิจกรรมหลัก</div>
              <div style={{display:"grid",gridTemplateColumns:"155px 1fr 1fr 50px 50px",background:"linear-gradient(135deg,#3B9FE8,#2ABFBF)",borderRadius:"8px 8px 0 0",padding:"7px 8px"}}>
                {["กิจกรรม","จุดประสงค์ / ผลการจัด","ปัญหา / แนวทางแก้ไข","ผ่าน","ไม่ผ่าน"].map((h,i)=>(
                  <div key={i} style={{fontSize:10,fontWeight:700,color:"white",textAlign:i>=3?"center":"left",padding:"0 5px"}}>{h}</div>
                ))}
              </div>
              {actData.map((a,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"155px 1fr 1fr 50px 50px",background:i%2===0?"#F7FBFF":"white",borderLeft:"1px solid #C5E4F7",borderRight:"1px solid #C5E4F7",borderBottom:i===actData.length-1?"1px solid #C5E4F7":"1px solid #E8F4FD",padding:"8px"}}>
                  <div style={{padding:"0 5px",display:"flex",alignItems:"flex-start",gap:4}}><span style={{fontSize:13,flexShrink:0}}>{a.icon}</span><div style={{fontSize:10,fontWeight:700,color:"#1E293B",lineHeight:1.5}}>{a.label}</div></div>
                  <div style={{padding:"0 6px"}}><div style={{fontSize:9,color:"#94A3B8",marginBottom:1}}>จุดประสงค์</div><div style={{fontSize:10,color:"#1E293B",marginBottom:4,lineHeight:1.5}}>{a.objective}</div><div style={{fontSize:9,color:"#94A3B8",marginBottom:1}}>ผลการจัดกิจกรรม</div><div style={{fontSize:10,color:"#1E293B",lineHeight:1.5}}>{a.result}</div></div>
                  <div style={{padding:"0 6px"}}><div style={{fontSize:9,color:"#94A3B8",marginBottom:1}}>ปัญหาอุปสรรค</div><div style={{fontSize:10,color:"#1E293B",marginBottom:4,lineHeight:1.5}}>{a.problem}</div><div style={{fontSize:9,color:"#94A3B8",marginBottom:1}}>แนวทางแก้ไข</div><div style={{fontSize:10,color:"#1E293B",lineHeight:1.5}}>{a.solution}</div></div>
                  <div style={{textAlign:"center",paddingTop:4}}><div style={{fontSize:15,fontWeight:800,color:"#22C55E"}}>{typeof a.passed==="string"?a.passed.replace(" คน",""):a.passed}</div><div style={{fontSize:8,color:"#64748B"}}>คน</div></div>
                  <div style={{textAlign:"center",paddingTop:4}}><div style={{fontSize:15,fontWeight:800,color:a.failed!=="0 คน"&&a.failed!==0?"#FB7185":"#94A3B8"}}>{typeof a.failed==="string"?a.failed.replace(" คน",""):a.failed}</div><div style={{fontSize:8,color:"#64748B"}}>คน</div></div>
                </div>
              ))}
              <div style={{height:3,background:"linear-gradient(90deg,#3B9FE8,#2ABFBF)",borderRadius:"0 0 6px 6px"}}/>
            </div>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:800,color:"#1E293B",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span>📸 รูปภาพประกอบกิจกรรม</span><span style={{fontSize:9,fontWeight:600,color:"#94A3B8"}}>{report.imgs?.length||report.images||0} / 6 รูป</span></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {Array.from({length:6}).map((_,i)=>{
                  const img=report.imgs?.[i];
                  const labels=["กิจกรรมเคลื่อนไหว","กิจกรรมเสริมประสบการณ์","กิจกรรมศิลปะ","กิจกรรมเล่นตามมุม","กิจกรรมกลางแจ้ง","เกมการศึกษา"];
                  return(
                    <div key={i} style={{aspectRatio:"4/3",borderRadius:8,overflow:"hidden",border:"1px solid #C5E4F7",position:"relative",background:"#F7FBFF"}}>
                      {img?<img src={img.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#E8F4FD,#C5E4F7)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}><span style={{fontSize:18,opacity:0.4}}>🖼️</span><div style={{fontSize:7,color:"#94A3B8",textAlign:"center",padding:"0 4px",lineHeight:1.4}}>{labels[i]}</div></div>}
                      <div style={{position:"absolute",top:4,left:4,width:16,height:16,borderRadius:"50%",background:img?"rgba(59,159,232,0.85)":"rgba(148,163,184,0.6)",color:"#fff",fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{borderTop:"1px solid #E8F4FD",paddingTop:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
                {[{label:"ลงชื่อครูผู้สอน",name:report.teacher,role:`ครูชั้น${report.classroom}`,p1:"M 10 30 C 30 10, 50 35, 70 20 C 90 5, 110 30, 130 20 L 150 25",p2:"M 40 32 C 45 28, 52 34, 58 30"},
                  {label:"ลงชื่อผู้บริหาร",name:"นายสมชาย ใจดี",role:"ผู้อำนวยการโรงเรียน",p1:"M 8 25 C 25 8, 45 32, 65 18 C 85 4, 105 28, 125 15 C 135 9, 145 20, 152 18",p2:"M 60 30 C 68 24, 78 32, 86 27"}
                ].map((s,i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{fontSize:11,color:"#64748B",marginBottom:6}}>{s.label}</div>
                    <div style={{height:50,borderBottom:"1.5px solid #334155",marginBottom:8,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:4}}>
                      <svg viewBox="0 0 160 40" width="140" height="36"><path d={s.p1} fill="none" stroke="#1A6FB5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d={s.p2} fill="none" stroke="#1A6FB5" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:"#1E293B"}}>{s.name}</div>
                    <div style={{fontSize:10,color:"#64748B"}}>{s.role}</div>
                    <div style={{fontSize:10,color:"#94A3B8",marginTop:2}}>วันที่ {report.date}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{marginTop:18,paddingTop:10,borderTop:"1px dashed #C5E4F7",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:9,color:"#94A3B8"}}>สร้างโดยระบบ EduKinder · {new Date().toLocaleDateString("th-TH",{year:"numeric",month:"long",day:"numeric"})}</div>
              <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:12,borderRadius:3,background:"linear-gradient(135deg,#3B9FE8,#2ABFBF)",fontSize:6,display:"flex",alignItems:"center",justifyContent:"center"}}>🌟</div><span style={{fontSize:9,color:"#94A3B8",fontWeight:600}}>EduKinder</span></div>
              <div style={{fontSize:9,color:"#94A3B8"}}>หน้า 1 / 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────
function Modal({report,onClose,isAdmin,onStatusChange,onDelete}){
  const [note,setNote]=useState("");
  const [st,setSt]=useState(report.status);
  const [showPDF,setShowPDF]=useState(false);
  const [mode,setMode]=useState("view");
  const [confirmDel,setConfirmDel]=useState(false);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [editForm,setEditForm]=useState({unit:report.unit,teacher:report.teacher,date:report.date,classroom:report.classroom});
  const [editActs,setEditActs]=useState(mockActivityDetail.map(a=>({...a})));
  const [editNote,setEditNote]=useState("");

  const changeStatus=(newSt)=>{setSt(newSt);onStatusChange?.(report.id,newSt);};
  const handleSaveEdit=async(andSubmit=false)=>{
    setSaving(true);await new Promise(r=>setTimeout(r,800));
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2000);
    if(andSubmit)changeStatus("submitted");
    setMode("view");
  };
  const iSt={width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${C.skyMid}`,fontSize:12,background:"white",fontFamily:"inherit",boxSizing:"border-box",color:C.dark,outline:"none"};

  if(showPDF) return <PDFPreview report={{...report,status:st}} onClose={()=>setShowPDF(false)}/>;

  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:99999,background:"rgba(15,23,42,0.65)",display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"24px 12px 40px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:20,width:"100%",maxWidth:700,boxShadow:"0 32px 80px rgba(0,0,0,0.3)",flexShrink:0}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${C.blue},${C.teal})`,padding:"22px 24px",borderRadius:"20px 20px 0 0"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginBottom:4}}>{mode==="edit"?"✏️ กำลังแก้ไขรายงาน":"รายงานหลังจัดประสบการณ์"}</div>
              <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{mode==="edit"?(editForm.unit||"ยังไม่ระบุหน่วย"):report.unit}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.85)",marginTop:6}}>{report.teacher} · {report.classroom} · {report.date}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
              <button onClick={onClose} style={{width:34,height:34,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.25)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              <Badge status={st}/>
            </div>
          </div>
        </div>

        <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
          {saved&&<div style={{background:"#DCFCE7",border:"1.5px solid #86EFAC",borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>✅</span><div style={{fontSize:13,fontWeight:700,color:"#166534"}}>บันทึกเรียบร้อยแล้ว!</div></div>}
          {!isAdmin&&st==="rejected"&&mode==="view"&&<div style={{background:"#FFF1F2",border:"1.5px solid #FDA4AF",borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:24}}>❌</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:"#BE123C"}}>รายงานถูกตีกลับ</div><div style={{fontSize:13,color:"#9F1239"}}>กรุณาแก้ไขตามข้อเสนอแนะ แล้วส่งกลับใหม่</div></div></div>}

          {/* VIEW MODE */}
          {mode==="view"&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[["📅 วันที่",report.date],["🏫 ชั้นเรียน",report.classroom],["📸 รูปภาพ",`${report.imgs?.length||report.images||0} รูป`]].map(([l,v])=>(
                  <div key={l} style={{padding:"10px 14px",background:C.sky,borderRadius:12}}><div style={{fontSize:11,color:C.slateLight}}>{l}</div><div style={{fontSize:13,fontWeight:700,color:C.dark}}>{v}</div></div>
                ))}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>📸 รูปภาพกิจกรรม <span style={{fontSize:11,color:C.slateLight,fontWeight:400}}>{report.imgs?.length||report.images||0}/6</span></div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {Array.from({length:6}).map((_,i)=>{
                    const img=report.imgs?.[i];
                    return(
                      <div key={i} style={{aspectRatio:"4/3",borderRadius:12,overflow:"hidden",border:`1px solid ${C.skyMid}`,position:"relative",background:C.sky}}>
                        {img?<img src={img.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.skyMid,opacity:0.5,gap:4}}><span style={{fontSize:22}}>🖼️</span><span style={{fontSize:9,color:C.slateLight}}>รูปที่ {i+1}</span></div>}
                        <div style={{position:"absolute",top:5,left:5,width:16,height:16,borderRadius:"50%",background:img?`${C.blue}CC`:"rgba(148,163,184,0.5)",color:"#fff",fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>📋 สรุปกิจกรรม 6 กิจกรรม</div>
                {mockActivityDetail.map((a,i)=>(
                  <div key={i} style={{borderRadius:14,border:`1px solid ${C.skyMid}`,overflow:"hidden",marginBottom:10}}>
                    <div style={{padding:"10px 16px",background:C.sky,display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:18}}>{a.icon}</span><span style={{fontSize:13,fontWeight:700,color:C.dark,flex:1}}>{a.label}</span>
                      <span style={{fontSize:12,color:C.green,fontWeight:600}}>✓ {a.passed}</span>
                      {a.failed!=="0 คน"&&<span style={{fontSize:12,color:C.rose,fontWeight:600}}>✗ {a.failed}</span>}
                    </div>
                    <div style={{padding:"12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      {[["จุดประสงค์",a.objective],["ผลการจัดกิจกรรม",a.result],["ปัญหาอุปสรรค",a.problem],["แนวทางแก้ไข",a.solution]].map(([l,v])=>(
                        <div key={l}><div style={{fontSize:10,color:C.slateLight,marginBottom:2}}>{l}</div><div style={{fontSize:12,color:C.dark,lineHeight:1.5}}>{v}</div></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* EDIT MODE */}
          {mode==="edit"&&(
            <>
              <div style={{background:`${C.blue}06`,border:`1.5px solid ${C.skyMid}`,borderRadius:14,padding:16}}>
                <div style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:12}}>📌 ข้อมูลทั่วไป</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[{label:"หน่วยการเรียนรู้",key:"unit",type:"text"},{label:"วันที่",key:"date",type:"date"},{label:"ครูผู้สอน",key:"teacher",type:"text"},{label:"ชั้นเรียน",key:"classroom",type:"text"}].map(f=>(
                    <div key={f.key}><label style={{fontSize:11,fontWeight:700,color:C.slate,display:"block",marginBottom:5}}>{f.label}</label><input type={f.type} value={editForm[f.key]} onChange={e=>setEditForm(p=>({...p,[f.key]:e.target.value}))} style={iSt}/></div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>📋 แก้ไขกิจกรรม 6 รายการ</div>
                {editActs.map((a,ai)=>(
                  <div key={ai} style={{borderRadius:14,border:`1px solid ${C.skyMid}`,overflow:"hidden",marginBottom:10}}>
                    <div style={{padding:"10px 16px",background:C.sky,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{a.icon}</span><span style={{fontSize:13,fontWeight:700,color:C.dark}}>{a.label}</span></div>
                    <div style={{padding:"12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      {[{key:"objective",label:"จุดประสงค์"},{key:"result",label:"ผลการจัดกิจกรรม"},{key:"passed",label:"เด็กที่ผ่าน"},{key:"failed",label:"เด็กที่ไม่ผ่าน"},{key:"problem",label:"ปัญหาอุปสรรค"},{key:"solution",label:"แนวทางแก้ไข"}].map(f=>(
                        <div key={f.key}><label style={{fontSize:10,fontWeight:700,color:C.slateLight,display:"block",marginBottom:4}}>{f.label}</label><textarea value={a[f.key]||""} rows={2} onChange={e=>setEditActs(prev=>prev.map((act,i)=>i===ai?{...act,[f.key]:e.target.value}:act))} style={{...iSt,resize:"none",fontSize:11}}/></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div><label style={{fontSize:12,fontWeight:700,color:C.slate,display:"block",marginBottom:6}}>📝 หมายเหตุ / สิ่งที่แก้ไข</label><textarea value={editNote} onChange={e=>setEditNote(e.target.value)} rows={2} placeholder="ระบุสิ่งที่แก้ไขหรือหมายเหตุเพิ่มเติม..." style={{...iSt,resize:"none"}}/></div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setMode("view")} style={{flex:1,padding:10,borderRadius:10,border:`1.5px solid ${C.skyMid}`,background:"white",color:C.slate,fontSize:13,fontWeight:600,cursor:"pointer"}}>← ยกเลิก</button>
                <button onClick={()=>handleSaveEdit(false)} disabled={saving} style={{flex:1,padding:10,borderRadius:10,border:"none",background:`${C.blue}20`,color:C.blue,fontSize:13,fontWeight:700,cursor:"pointer"}}>{saving?"⏳...":"💾 บันทึก"}</button>
                <button onClick={()=>handleSaveEdit(true)} disabled={saving} style={{flex:2,padding:10,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.green},${C.teal})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{saving?"⏳ กำลังส่ง...":"📤 บันทึกและส่งใหม่"}</button>
              </div>
            </>
          )}

          {/* Admin review */}
          {isAdmin&&mode==="view"&&(
            <div style={{padding:16,borderRadius:14,background:`${C.blue}08`,border:`1.5px solid ${C.blue}30`}}>
              <div style={{fontSize:13,fontWeight:700,color:C.dark,marginBottom:10}}>✍️ ข้อเสนอแนะจากผู้บริหาร</div>
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="เขียนข้อเสนอแนะสำหรับครู..." rows={3} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${C.skyMid}`,fontSize:13,background:C.cloud,fontFamily:"inherit",resize:"none",marginBottom:12,boxSizing:"border-box"}}/>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>changeStatus("approved")} style={{flex:1,padding:10,borderRadius:10,border:"none",background:st==="approved"?C.green:`${C.green}20`,color:st==="approved"?"#fff":C.green,fontSize:13,fontWeight:700,cursor:"pointer"}}>{st==="approved"?"✅ อนุมัติแล้ว":"✓ อนุมัติ"}</button>
                <button onClick={()=>changeStatus("rejected")} style={{flex:1,padding:10,borderRadius:10,border:"none",background:st==="rejected"?C.rose:`${C.rose}20`,color:st==="rejected"?"#fff":C.rose,fontSize:13,fontWeight:700,cursor:"pointer"}}>{st==="rejected"?"❌ ตีกลับแล้ว":"✗ ตีกลับ"}</button>
                <button onClick={()=>setShowPDF(true)} style={{padding:"10px 18px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.blue},${C.teal})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>📄 PDF</button>
              </div>
            </div>
          )}

          {/* Teacher footer */}
          {!isAdmin&&mode==="view"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",gap:10}}>
                <button onClick={onClose} style={{flex:1,padding:10,borderRadius:10,border:`1.5px solid ${C.skyMid}`,background:"white",color:C.slate,fontSize:13,fontWeight:600,cursor:"pointer"}}>← ย้อนกลับ</button>
                <button onClick={()=>setMode("edit")} style={{flex:1,padding:10,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.gold},${C.amber})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(245,158,11,0.3)"}}>✏️ แก้ไขรายงาน</button>
                <button onClick={()=>setShowPDF(true)} style={{flex:1,padding:10,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.blue},${C.teal})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>📄 PDF</button>
              </div>
              {(st==="draft"||st==="rejected")&&(
                <button onClick={()=>{if(confirmDel){onDelete?.(report.id);onClose();}else{setConfirmDel(true);setTimeout(()=>setConfirmDel(false),3000);}}} style={{width:"100%",padding:10,borderRadius:10,border:"none",background:confirmDel?C.rose:`${C.rose}12`,color:confirmDel?"#fff":C.rose,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}>
                  {confirmDel?"⚠️ กดอีกครั้งเพื่อยืนยันลบ":"🗑️ ลบรายงานนี้"}
                </button>
              )}
            </div>
          )}
          {isAdmin&&mode==="view"&&(
            <button onClick={()=>{if(confirmDel){onDelete?.(report.id);onClose();}else{setConfirmDel(true);setTimeout(()=>setConfirmDel(false),3000);}}} style={{width:"100%",padding:10,borderRadius:10,border:"none",background:confirmDel?C.rose:`${C.rose}12`,color:confirmDel?"#fff":C.rose,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>
              {confirmDel?"⚠️ ยืนยันลบรายงาน?":"🗑️ ลบรายงาน"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}export