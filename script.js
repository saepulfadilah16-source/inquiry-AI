const stages = [
  {icon:"👁️", name:"Amati"},
  {icon:"❓", name:"Tanyakan"},
  {icon:"📚", name:"Cari Bukti"},
  {icon:"📊", name:"Analisis"},
  {icon:"🤖", name:"Dialog AI"},
  {icon:"💡", name:"Keputusan"},
  {icon:"🧠", name:"Refleksi"}
];

let current = 0;
const student = {name:"", className:""};
const answers = {observe:"", question:"", evidence:[], analysis:"", ai:"", decision:"", decisionWhy:"", reflection:""};

const stageContent = document.getElementById("stageContent");
const stepper = document.getElementById("stepper");
const progressLine = document.getElementById("progressLine");
const aiMessage = document.getElementById("aiMessage");
const miniStatus = document.getElementById("miniStatus");
const toast = document.getElementById("toast");

function escapeHTML(str=""){
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function showToast(msg){
  toast.textContent = msg; toast.classList.add("show");
  clearTimeout(showToast.t); showToast.t=setTimeout(()=>toast.classList.remove("show"),2200);
}
function renderStepper(){
  stepper.innerHTML = stages.map((s,i)=>`
    <div class="step ${i===current?'active':''} ${i<current?'done':''}">
      <div class="step-circle">${i<current?'✓':s.icon}</div><div>${i+1}. ${s.name}</div>
    </div>`).join("");
  const pct = current/6;
  progressLine.style.background = `linear-gradient(90deg,#1769e0 ${pct*100}%,#dfe6f2 ${pct*100}%)`;
  document.querySelectorAll(".side-btn").forEach((b,i)=>b.classList.toggle("active",i===current));
  miniStatus.textContent = `Tahap ${current+1} dari 7`;
  document.querySelectorAll(".mini-bars i").forEach((el,i)=>el.classList.toggle("on",i<=current));
}
function next(){ if(current<6){ current++; render(); } }
function prev(){ if(current>0){ current--; render(); } }

function render(){
  renderStepper();
  const views = [viewObserve,viewAsk,viewEvidence,viewAnalysis,viewAI,viewDecision,viewReflection];
  stageContent.innerHTML = views[current]();
  bindStage();
  window.scrollTo({top:0,behavior:"smooth"});
}
function navButtons(){
  return `<div class="action-row">
    ${current>0?'<button class="secondary" id="backBtn" type="button">← Kembali</button>':''}
    ${current<6?'<button class="primary" id="nextBtn" type="button">Lanjut ke Tahap '+(current+2)+' →</button>':''}
  </div>`;
}

function viewObserve(){
 return `<div class="stage">
  <div class="stage-head"><div><h2 class="stage-title"><span>1.</span> IDENTITAS & AMATI</h2><p class="stage-sub">Kenali dirimu terlebih dahulu, lalu amati fenomena sebelum membuat kesimpulan.</p></div><span>🔎</span></div>
  <div class="student-form">
    <div><label for="studentName">Nama Siswa</label><input id="studentName" type="text" maxlength="80" placeholder="Contoh: Ahmad Fauzan" value="${escapeHTML(student.name)}"></div>
    <div><label for="studentClass">Kelas</label><input id="studentClass" type="text" maxlength="20" placeholder="Contoh: VII-A" value="${escapeHTML(student.className)}"></div>
  </div>
  <div class="observation-grid">
    <div class="obs"><div class="ico">🌧️</div><b>Curah hujan</b><small>Hujan deras dapat meningkatkan volume air dalam waktu singkat.</small></div>
    <div class="obs"><div class="ico">🗑️</div><b>Sampah</b><small>Sampah yang menutup saluran dapat menghambat aliran air.</small></div>
    <div class="obs"><div class="ico">🏗️</div><b>Perubahan lahan</b><small>Pembangunan dapat mengurangi area yang menyerap air.</small></div>
    <div class="obs free-idea"><div class="ico">💡</div><b>Alasan lain menurut saya</b><small>Punya dugaan sendiri? Tuliskan satu alasan lain yang menurutmu dapat menyebabkan banjir.</small></div>
  </div>
  <div class="prompt-box"><b>Pertanyaan pengamatan:</b> Apa yang kamu lihat dari fenomena tersebut? Pilih salah satu dugaan di atas, atau gunakan alasanmu sendiri. Jangan takut memiliki dugaan yang berbeda.</div>
  <textarea id="observeInput" maxlength="600" placeholder="Tulis hasil pengamatanmu dan, jika punya, alasan lain menurutmu...">${escapeHTML(answers.observe)}</textarea>
  <div class="hint">Tip: jangan hanya memilih jawaban yang tersedia. Coba pikirkan satu kemungkinan lain berdasarkan pengalaman atau pengamatanmu sendiri.</div>${navButtons()}</div>`;
}
function viewAsk(){
 return `<div class="stage">
  <h2 class="stage-title"><span>2.</span> TANYAKAN</h2><p class="stage-sub">Ubah rasa ingin tahu menjadi pertanyaan yang dapat diselidiki.</p>
  <div class="prompt-box">Contoh: “Apakah sampah merupakan penyebab utama banjir di lingkungan saya?”<br><b>Jangan puas dengan pertanyaan “apa”. Coba gunakan “mengapa”, “bagaimana”, atau “seberapa besar”.</b></div>
  <textarea id="questionInput" maxlength="500" placeholder="Tuliskan pertanyaan penyelidikanmu...">${escapeHTML(answers.question)}</textarea>
  <div class="ai-tip"><b>🤖 AI memberi pemantik:</b><p>“Pertanyaanmu sudah mengarah ke masalah. Bukti apa yang perlu kamu cari agar pertanyaan itu bisa diuji?”</p></div>
  ${navButtons()}</div>`;
}
function viewEvidence(){
 return `<div class="stage">
  <h2 class="stage-title"><span>3.</span> CARI BUKTI</h2><p class="stage-sub">Pilih informasi yang paling berguna untuk menguji dugaanmu.</p>
  <div class="choice-grid">
   ${[
    ["A","Data curah hujan","Data hujan membantu melihat apakah kejadian banjir berkaitan dengan intensitas hujan."],
    ["B","Kondisi saluran","Foto/observasi saluran membantu melihat adanya sumbatan atau kapasitas yang tidak memadai."],
    ["C","Perubahan tutupan lahan","Data penggunaan lahan membantu melihat perubahan area resapan."],
    ["D","Komentar media sosial","Bisa menjadi petunjuk awal, tetapi perlu diverifikasi dengan sumber lain."]
   ].map(x=>`<button class="choice ${answers.evidence.includes(x[0])?'selected':''}" data-evidence="${x[0]}" type="button"><b>${x[0]}. ${x[1]}</b><small>${x[2]}</small></button>`).join("")}
  </div>
  <div class="hint">Pilih minimal 2 bukti. Ingat: informasi yang menarik belum tentu informasi yang kuat.</div>${navButtons()}</div>`;
}
function viewAnalysis(){
 return `<div class="stage">
  <h2 class="stage-title"><span>4.</span> ANALISIS</h2><p class="stage-sub">Hubungkan bukti dengan dugaan. Cari kemungkinan lain agar tidak terburu-buru menyimpulkan.</p>
  <div class="prompt-box"><b>Dugaan awal:</b> “Banjir terjadi karena sampah.”<br><br><b>Uji:</b> Apakah bukti yang kamu pilih cukup untuk menyatakan sampah sebagai satu-satunya penyebab? Apa faktor lain yang perlu dipertimbangkan?</div>
  <textarea id="analysisInput" maxlength="700" placeholder="Jelaskan hubungan antara bukti dan dugaanmu...">${escapeHTML(answers.analysis)}</textarea>
  <div class="ai-tip"><b>🤖 Tantangan AI:</b><p>“Coba cari satu bukti yang bisa membuat dugaanmu menjadi lebih kuat dan satu bukti yang mungkin membantahnya.”</p></div>
  ${navButtons()}</div>`;
}
function viewAI(){
 return `<div class="stage">
  <h2 class="stage-title"><span>5.</span> DIALOG AI</h2><p class="stage-sub">Sekarang AI menjadi partner dialog. Kamu tetap pemilik keputusan.</p>
  <div class="ai-message" id="chatBox"><b>🤖 AI:</b> Berdasarkan prosesmu, saya melihat kamu mempertimbangkan sampah, curah hujan, dan kondisi lahan. Menurutmu, faktor mana yang paling kuat dan apa buktinya?</div>
  <div class="prompt-box">Ketik jawabanmu. AI demo ini akan memberi umpan balik berdasarkan kualitas alasanmu.</div>
  <textarea id="aiInput" maxlength="700" placeholder="Jawab pertanyaan AI...">${escapeHTML(answers.ai)}</textarea>
  <div class="action-row"><button class="primary" id="askAI" type="button">🤖 Minta Umpan Balik AI</button></div>
  <div id="feedback" class="hint"></div>${navButtons()}</div>`;
}
function viewDecision(){
 return `<div class="stage">
  <h2 class="stage-title"><span>6.</span> KEPUTUSAN</h2><p class="stage-sub">Gunakan bukti untuk memilih solusi yang paling masuk akal dan dapat dilakukan.</p>
  <div class="choice-grid">
   ${[
    ["1","Membersihkan dan menjaga saluran air","Fokus pada pencegahan sumbatan dan pemeliharaan rutin."],
    ["2","Menambah area resapan","Mengurangi limpasan air dengan ruang terbuka, biopori, atau vegetasi."],
    ["3","Edukasi dan perubahan kebiasaan","Mengurangi sampah dan membangun kebiasaan warga yang lebih bertanggung jawab."],
    ["4","Kombinasi solusi","Menggabungkan beberapa tindakan karena penyebab banjir biasanya tidak tunggal."]
   ].map(x=>`<button class="choice ${answers.decision===x[0]?'selected':''}" data-decision="${x[0]}" type="button"><b>${x[0]}. ${x[1]}</b><small>${x[2]}</small></button>`).join("")}
  </div>
  <textarea id="decisionWhy" maxlength="500" placeholder="Jelaskan mengapa pilihanmu paling masuk akal...">${escapeHTML(answers.decisionWhy||"")}</textarea>
  ${navButtons()}</div>`;
}
function viewReflection(){
 return `<div class="stage">
  <h2 class="stage-title"><span>7.</span> REFLEKSI</h2><p class="stage-sub">Berhenti sejenak. Apa yang berubah dalam cara berpikirmu?</p>
  <textarea id="reflectionInput" maxlength="700" placeholder="Apa pemahaman baru yang kamu dapat? Apa yang akan kamu lakukan berbeda setelah belajar?">${escapeHTML(answers.reflection)}</textarea>
  <div class="result">
    <div><small>HASIL PROSES BELAJAR</small><div class="score">88/100</div><b>Inquiry lengkap — seluruh tahapan telah diselesaikan.</b></div>
    <div class="result-grid">
      <div class="metric"><b>✓</b><small>Mengamati<br>10/10</small></div>
      <div class="metric"><b>✓</b><small>Bertanya<br>13/15</small></div>
      <div class="metric"><b>✓</b><small>Bukti<br>18/20</small></div>
      <div class="metric"><b>✓</b><small>Analisis<br>18/20</small></div>
      <div class="metric"><b>✓</b><small>Dialog AI<br>14/15</small></div>
      <div class="metric"><b>✓</b><small>Keputusan & Refleksi<br>15/20</small></div>
    </div>
  </div>
  <div class="deep-narrative">
    <div class="narrative-badge">🧠 MAKNA HASIL BELAJAR</div>
    <p><b>88/100 — Pemahaman Mendalam Berkembang Sangat Baik.</b></p>
    <p>Siswa telah mampu mengamati fenomena, merumuskan pertanyaan, menggunakan bukti untuk menguji dugaan, serta berdialog dengan AI secara kritis. Proses belajar menunjukkan bahwa siswa tidak sekadar menemukan jawaban, tetapi mulai mampu menjelaskan <b>alasan, hubungan sebab-akibat, dan pilihan solusi</b> berdasarkan informasi yang diperoleh.</p>
    <p>Selanjutnya, siswa perlu terus memperkuat kemampuan <b>mengevaluasi kualitas bukti, mempertimbangkan sudut pandang lain, dan merefleksikan dampak keputusan</b> agar pemahamannya semakin transferabel ke situasi nyata.</p>
  </div>
  <div class="certificate-mini">
    <div>🏆</div><b>APRESIASI SISWA</b><span>Setelah tombol ditekan, sertifikat digital akan tampil dengan nama dan kelasmu.</span>
  </div>
  <div class="action-row"><button class="primary" id="finishBtn" type="button">🎉 Selesaikan & Tampilkan Apresiasi</button></div>
 </div>`;
}

function showAppreciation(){
  saveCurrent();
  const name = student.name.trim() || "Peserta Didik";
  const cls = student.className.trim() || "Kelas —";
  stageContent.innerHTML = `<div class="appreciation">
    <div class="confetti">✦ ✧ ✦ ✧ ✦</div>
    <div class="appreciation-kicker">🎉 SELAMAT!</div>
    <h2>Inquiry Selesai</h2>
    <p class="appreciation-lead">Kamu telah menyelesaikan seluruh rangkaian <b>AI Deep Inquiry Lab</b>.</p>
    <div class="certificate">
      <div class="cert-orbit">✦</div><div class="cert-orbit cert-orbit-2">✧</div>
      <div class="cert-pattern">◆ &nbsp; ◇ &nbsp; ◆ &nbsp; ◇ &nbsp; ◆</div>
      <div class="certificate-kicker">IPS FUTURE CLASS</div>
      <div class="certificate-title">CERTIFICATE OF LEARNING</div>
      <div class="certificate-subtitle">AI DEEP INQUIRY LAB</div>
      <div class="cert-divider"></div>
      <p>Diberikan kepada</p>
      <div class="certificate-name">${escapeHTML(name)}</div>
      <div class="certificate-class">${escapeHTML(cls)}</div>
      <p>telah menyelesaikan pembelajaran mendalam berbasis AI dengan tema</p>
      <div class="certificate-theme">“Mengapa Banjir Semakin Sering Terjadi di Lingkungan Kita?”</div>
      <div class="certificate-score"><span>INQUIRY SCORE</span><strong>88/100</strong><b>CRITICAL THINKER</b></div>
      <div class="certificate-meaning">“Mampu menghubungkan pengamatan, pertanyaan, bukti, analisis, dialog dengan AI, keputusan, dan refleksi untuk membangun pemahaman yang bermakna.”</div>
      <div class="cert-sign">
        <div><span>Guru Pembimbing</span><b>Saepul Fadilah</b><small>Guru Pengampu IPS</small></div>
        <div><span>Program</span><b>IPS FUTURE CLASS</b><small>AI & Pembelajaran Mendalam</small></div>
      </div>
      <div class="cert-footer">Designed by Saepul Fadilah • Enhanced with AI</div>
    </div>
    <div class="appreciation-actions">
      <button class="secondary" id="backResultBtn" type="button">← Kembali ke Hasil</button>
      <button class="secondary" id="printCertificateBtn" type="button">🖨️ Print / Cetak</button>
      <button class="primary" id="downloadCertificateBtn" type="button">⬇️ Download Sertifikat</button>
      <button class="primary" id="restartBtn" type="button">🔄 Ulangi Simulasi</button>
    </div>
  </div>`;
  document.querySelectorAll(".side-btn").forEach(b=>b.classList.remove("active"));
  aiMessage.textContent = `Selamat ${name}! Kamu telah menyelesaikan inquiry. Ingat: kualitas belajar terlihat dari proses berpikir, bukan sekadar jawaban akhir.`;
  document.querySelectorAll(".mini-bars i").forEach(el=>el.classList.add("on"));
  document.getElementById("backResultBtn").addEventListener("click", render);
  document.getElementById("printCertificateBtn").addEventListener("click", printCertificate);
  document.getElementById("downloadCertificateBtn").addEventListener("click", downloadCertificate);
  document.getElementById("restartBtn").addEventListener("click", ()=>{
    current=0; student.name=""; student.className="";
    Object.assign(answers,{observe:"",question:"",evidence:[],analysis:"",ai:"",decision:"",decisionWhy:"",reflection:""});
    render();
  });
}

function bindStage(){
  const back=document.getElementById("backBtn"); if(back) back.addEventListener("click",prev);
  const nextBtn=document.getElementById("nextBtn"); if(nextBtn) nextBtn.addEventListener("click",()=>{
    saveCurrent();
    if(validateCurrent()) next();
  });
  const studentName=document.getElementById("studentName"); if(studentName) studentName.addEventListener("input",e=>student.name=e.target.value);
  const studentClass=document.getElementById("studentClass"); if(studentClass) studentClass.addEventListener("input",e=>student.className=e.target.value);
  const obs=document.getElementById("observeInput"); if(obs) obs.addEventListener("input",e=>answers.observe=e.target.value);
  const q=document.getElementById("questionInput"); if(q) q.addEventListener("input",e=>answers.question=e.target.value);
  const an=document.getElementById("analysisInput"); if(an) an.addEventListener("input",e=>answers.analysis=e.target.value);
  const ref=document.getElementById("reflectionInput"); if(ref) ref.addEventListener("input",e=>answers.reflection=e.target.value);
  document.querySelectorAll("[data-evidence]").forEach(btn=>btn.addEventListener("click",()=>{
    const id=btn.dataset.evidence;
    answers.evidence=answers.evidence.includes(id)?answers.evidence.filter(x=>x!==id):[...answers.evidence,id];
    btn.classList.toggle("selected",answers.evidence.includes(id));
  }));
  document.querySelectorAll("[data-decision]").forEach(btn=>btn.addEventListener("click",()=>{
    answers.decision=btn.dataset.decision;
    document.querySelectorAll("[data-decision]").forEach(x=>x.classList.remove("selected")); btn.classList.add("selected");
  }));
  const why=document.getElementById("decisionWhy"); if(why) why.addEventListener("input",e=>answers.decisionWhy=e.target.value);
  const ask=document.getElementById("askAI"); if(ask) ask.addEventListener("click",aiFeedback);
  const finish=document.getElementById("finishBtn"); if(finish) finish.addEventListener("click",()=>{
    saveCurrent();
    if(!student.name.trim() || !student.className.trim()){showToast("Isi nama siswa dan kelas terlebih dahulu."); current=0; render(); return;}
    showAppreciation();
  });
}
function saveCurrent(){
  const ids=["observeInput","questionInput","analysisInput","aiInput","decisionWhy","reflectionInput"];
  ids.forEach(id=>{const el=document.getElementById(id); if(el){if(id==="aiInput") answers.ai=el.value; else if(id==="decisionWhy") answers.decisionWhy=el.value; else if(id==="reflectionInput") answers.reflection=el.value; else if(id==="observeInput") answers.observe=el.value; else if(id==="questionInput") answers.question=el.value; else if(id==="analysisInput") answers.analysis=el.value;}});
}
function validateCurrent(){
  if(current===0 && !student.name.trim()){showToast("Isi nama siswa terlebih dahulu.");return false}
  if(current===0 && !student.className.trim()){showToast("Isi kelas terlebih dahulu.");return false}
  if(current===0 && answers.observe.trim().length<15){showToast("Tulis pengamatanmu dulu (minimal 15 karakter).");return false}
  if(current===1 && answers.question.trim().length<10){showToast("Tulis satu pertanyaan penyelidikan.");return false}
  if(current===2 && answers.evidence.length<2){showToast("Pilih minimal 2 bukti yang relevan.");return false}
  if(current===3 && answers.analysis.trim().length<20){showToast("Jelaskan alasan analisismu terlebih dahulu.");return false}
  if(current===4 && answers.ai.trim().length<10){showToast("Jawab pertanyaan AI terlebih dahulu.");return false}
  if(current===5 && !answers.decision){showToast("Pilih satu keputusan/solusi.");return false}
  return true;
}
function aiFeedback(){
  const input=document.getElementById("aiInput"); const feedback=document.getElementById("feedback");
  answers.ai=input.value;
  if(answers.ai.trim().length<10){feedback.textContent="AI: Coba berikan alasan dan bukti, bukan hanya satu kata.";return}
  const hasEvidence=/bukti|data|observasi|saluran|hujan|lahan|sampah/i.test(answers.ai);
  const hasReason=/karena|sebab|sehingga|menunjukkan|menurut/i.test(answers.ai);
  let msg;
  if(hasEvidence && hasReason){
    msg="AI: Bagus. Jawabanmu sudah menghubungkan alasan dengan bukti. Sekarang coba tanyakan: apakah ada faktor lain yang bisa menghasilkan kesimpulan berbeda?";
  }else if(hasEvidence){
    msg="AI: Kamu sudah menyebut bukti. Tambahkan alasan mengapa bukti tersebut mendukung dugaanmu.";
  }else{
    msg="AI: Ide awalmu menarik. Sekarang tambahkan bukti atau data yang dapat digunakan untuk menguji ide tersebut.";
  }
  feedback.textContent=msg; aiMessage.textContent=msg.replace("AI: ","");
}
function jump(i){
  if(i>current && !validateCurrent()) return;
  saveCurrent(); current=i; render();
}
document.querySelectorAll(".side-btn").forEach((b,i)=>b.addEventListener("click",()=>jump(i)));
render();


function printCertificate(){
  const cert = document.querySelector(".certificate");
  if(!cert){ showToast("Sertifikat belum tersedia."); return; }
  const name = student.name.trim() || "Peserta Didik";
  const printWindow = window.open("", "_blank", "width=1200,height=900");
  if(!printWindow){ showToast("Izinkan pop-up browser untuk mencetak sertifikat."); return; }
  printWindow.document.write(`<!doctype html><html lang="id"><head><meta charset="UTF-8"><title>Sertifikat - ${escapeHTML(name)}</title><style>@page{size:A4 landscape;margin:0}body{margin:0;background:#fff;font-family:Arial,sans-serif}.print-wrap{width:100vw;min-height:100vh;display:grid;place-items:center}.certificate{box-sizing:border-box;width:94vw;min-height:90vh;margin:0 auto;padding:31px 34px 25px;background:radial-gradient(circle at 12% 15%,#e8f7ff 0 9%,transparent 10%),radial-gradient(circle at 90% 85%,#f0eaff 0 11%,transparent 12%),linear-gradient(135deg,#fff,#f5f8ff);border:5px solid #d8e4f4;border-radius:20px;box-shadow:inset 0 0 0 2px #fff,inset 0 0 0 8px #eaf0fa;position:relative;overflow:hidden;text-align:center}.certificate:after{content:"";position:absolute;inset:16px;border:1px solid #c8d7ec;border-radius:13px;pointer-events:none}.cert-pattern{font-size:11px;color:#8a9bb5;letter-spacing:5px;margin-bottom:13px}.certificate-kicker{position:relative;font-size:10px;letter-spacing:2px;font-weight:900;color:#1769e0}.certificate-title{position:relative;font-size:29px;font-weight:950;color:#10245b;letter-spacing:1px;margin:5px 0}.certificate-subtitle{position:relative;font-size:12px;font-weight:800;color:#6b46e8;letter-spacing:1.5px}.cert-divider{width:120px;height:2px;background:#7aa7e8;margin:12px auto}.certificate>p{position:relative;font-size:11px;color:#6c7890;margin:6px}.certificate-name{position:relative;font-family:Georgia,serif;font-size:30px;font-weight:700;color:#17233f;margin:4px 0}.certificate-class{position:relative;display:inline-block;background:#eef4ff;border-radius:999px;padding:5px 12px;color:#1769e0;font-size:11px;font-weight:900}.certificate-theme{position:relative;max-width:610px;margin:9px auto;font-size:13px;font-weight:850;line-height:1.45;color:#29466f}.certificate-score{position:relative;display:inline-flex;align-items:center;gap:12px;margin:12px auto;padding:9px 13px;border-radius:999px;background:#eef4ff;border:1px solid #d5e3f8;color:#4a607f;font-size:10px}.certificate-score strong{font-size:18px;color:#1769e0}.certificate-score b{color:#6b46e8}.certificate-meaning{position:relative;max-width:600px;margin:4px auto 15px;padding:10px 14px;background:#fff;border-radius:11px;border:1px solid #e0e8f3;color:#536681;font-size:11px;line-height:1.5;font-style:italic}.cert-sign{position:relative;display:flex;justify-content:center;gap:65px;margin-top:13px}.cert-sign>div{min-width:170px;border-top:1px solid #b8c5d9;padding-top:7px}.cert-sign span,.cert-sign small{display:block;color:#7c899d;font-size:9px}.cert-sign b{display:block;margin:3px 0;color:#17233f;font-family:Georgia,serif;font-size:14px}.cert-footer{position:relative;margin-top:17px;color:#8a98ad;font-size:8px;letter-spacing:.3px}.cert-orbit{position:absolute;left:-25px;top:70px;font-size:70px;color:#cfe1f8;opacity:.7}.cert-orbit-2{left:auto;right:-20px;top:auto;bottom:85px;color:#e2d8fb}@media print{.print-wrap{min-height:100vh}.certificate{width:94vw;min-height:90vh;box-shadow:none}}</style></head><body><div class="print-wrap">${cert.outerHTML}</div></body></html>`);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(()=>printWindow.print(),350);
}

function downloadCertificate(){
  const name = (student.name || document.getElementById("studentName")?.value || "Siswa").trim();
  const kelas = (student.className || document.getElementById("studentClass")?.value || "").trim();
  const certificate = `<!doctype html><html lang="id"><head><meta charset="UTF-8">
<title>Sertifikat - ${escapeHTML(name)}</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#eef3f8;font-family:Arial,sans-serif}
.cert{width:1120px;max-width:94vw;margin:30px auto;padding:70px 75px;min-height:790px;
background:radial-gradient(circle at 15% 15%,rgba(59,130,246,.16),transparent 28%),
radial-gradient(circle at 85% 85%,rgba(16,185,129,.14),transparent 28%),#fff;
border:12px solid #173b67;outline:3px solid #d5a84a;outline-offset:-25px;text-align:center;
position:relative;overflow:hidden}
h1{font-size:42px;letter-spacing:3px;margin:35px 0 8px;color:#173b67}
h2{font-size:22px;letter-spacing:2px;margin:0 0 45px;color:#d5a84a}
.label{font-size:16px;color:#607089}.name{font-size:38px;font-weight:700;margin:18px 0;color:#14243a}
.class{font-size:20px;font-weight:600;color:#35516f;margin-bottom:32px}
.theme{font-size:19px;font-weight:600;max-width:780px;margin:0 auto 30px;line-height:1.5}
.score{font-size:25px;font-weight:700;color:#173b67}.predicate{display:inline-block;margin:15px;padding:9px 22px;border-radius:999px;background:#e9f7ef;color:#18794e;font-weight:700}
.note{max-width:760px;margin:15px auto 55px;line-height:1.55;color:#526276}
.sign{margin-top:30px}.sign strong{font-size:19px}.footer{margin-top:45px;font-size:13px;color:#6b7788}
@media print{body{background:#fff}.cert{width:100%;max-width:none;margin:0;min-height:100vh;page-break-after:always}}
</style></head><body><section class="cert">
<div class="label">IPS FUTURE CLASS</div><h1>CERTIFICATE OF LEARNING</h1><h2>AI DEEP INQUIRY LAB</h2>
<div class="label">Diberikan kepada</div><div class="name">${escapeHTML(name)}</div>
<div class="class">${escapeHTML(kelas)}</div>
<div class="theme">Tema: “Mengapa Banjir Semakin Sering Terjadi di Lingkungan Kita?”</div>
<div class="score">Inquiry Score 88/100</div><div class="predicate">CRITICAL THINKER</div>
<div class="note">Telah menyelesaikan proses pembelajaran berbantuan AI melalui pengamatan, pertanyaan, pencarian bukti, analisis, dialog kritis, pengambilan keputusan, dan refleksi.</div>
<div class="sign">Guru Pembimbing: <strong>Saepul Fadilah</strong><br>Guru Pengampu IPS</div>
<div class="footer">AI &amp; Pembelajaran Mendalam • Designed by Saepul Fadilah • Enhanced with AI</div>
</section></body></html>`;
  const blob = new Blob([certificate], {type:"text/html;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Sertifikat-AI-Deep-Inquiry-Lab-" + (name.replace(/[^a-z0-9]+/gi,"-") || "Siswa") + ".html";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
