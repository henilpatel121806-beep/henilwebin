/* ================================================================
   HENIL PATEL — FPGA/RTL/VLSI Portfolio
   main.js — 100% CMS-driven from portfolio.json
   No hardcoded content. Every section rendered from JSON.
   ================================================================ */
'use strict';

let D = null;

/* ── LOAD DATA ───────────────────────────────────────────── */
async function loadData() {
  const r = await fetch('assets/data/portfolio.json');
  D = await r.json();
}

/* ── HELPERS ─────────────────────────────────────────────── */
const $  = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};
const chip = (t, type='') => `<span class="chip ${type}">${t}</span>`;
const bsm  = (label, cls, href, target='') =>
  href ? `<a href="${href}" class="btn-sm ${cls}" ${target ? 'target="_blank"' : ''} rel="noopener">${label}</a>`
       : `<button class="btn-sm ${cls}">${label}</button>`;

function statusBadges(s) {
  if (!s) return '';
  return (s.simulated            ? '<span class="badge badge-sim">Simulated</span>' : '')
       + (s.hardwareTested       ? '<span class="badge badge-hw">HW Tested</span>'  : '')
       + (s.documentationAvailable ? '<span class="badge badge-doc">Docs</span>'    : '');
}

/* ── BG CANVAS ───────────────────────────────────────────── */
function initBgCanvas() {
  const cv = $('bg-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H;

  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Animated circuit traces
  const nodes = Array.from({length: 18}, () => ({
    x: Math.random() * 1400,
    y: Math.random() * 900,
    vx: (Math.random() - .5) * .18,
    vy: (Math.random() - .5) * .18,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Grid
    ctx.strokeStyle = 'rgba(118,185,0,0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 220) {
          const alpha = (1 - dist/220) * 0.12;
          ctx.strokeStyle = `rgba(118,185,0,${alpha})`;
          ctx.lineWidth = .8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    nodes.forEach(n => {
      ctx.fillStyle = 'rgba(118,185,0,0.3)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI*2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ── FPGA SVG ANIMATION ──────────────────────────────────── */
function initFPGASVG() {
  const svg = $('fpga-svg');
  if (!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  const G = '#76B900', C = '#00D4FF', A = '#FF8C42';

  function mk(tag, attrs) {
    const e = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v));
    return e;
  }
  function box(x,y,w,h,stroke,fill,lbl,lc) {
    const g = document.createElementNS(ns,'g');
    g.appendChild(mk('rect',{x,y,width:w,height:h,rx:3,fill:fill||'rgba(118,185,0,0.06)',stroke:stroke||G,'stroke-width':1.2}));
    if (lbl) {
      const t = document.createElementNS(ns,'text');
      Object.assign(t,{});
      t.setAttribute('x',x+w/2); t.setAttribute('y',y+h/2+4);
      t.setAttribute('text-anchor','middle'); t.setAttribute('font-family','JetBrains Mono,monospace');
      t.setAttribute('font-size',9); t.setAttribute('fill',lc||G); t.setAttribute('font-weight',600);
      t.textContent=lbl; g.appendChild(t);
    }
    return g;
  }

  // Core ALU
  svg.appendChild(box(110,105,100,70,G,'rgba(118,185,0,0.07)','ALU',G));
  const sub = [
    {x:10,y:45,w:72,h:28,l:'REG A',c:G},{x:10,y:85,w:72,h:28,l:'REG B',c:G},
    {x:240,y:45,w:72,h:28,l:'FLAGS',c:A},{x:240,y:130,w:72,h:28,l:'OUT',c:G},
    {x:120,y:28,w:80,h:26,l:'CTRL',c:A},
    {x:10,y:200,w:85,h:28,l:'SW[15:0]',c:'rgba(118,185,0,0.5)'},
    {x:225,y:200,w:85,h:28,l:'LED[15:0]',c:'rgba(118,185,0,0.5)'},
    {x:100,y:242,w:120,h:26,l:'SEG[6:0]',c:'rgba(0,212,255,0.7)'},
  ];
  sub.forEach(b => svg.appendChild(box(b.x,b.y,b.w,b.h,b.c,'rgba(0,0,0,0.3)',b.l,b.c)));

  // Wires
  const wg = document.createElementNS(ns,'g');
  wg.setAttribute('stroke',G); wg.setAttribute('stroke-width',1.2); wg.setAttribute('fill','none'); wg.setAttribute('opacity',.45);
  const wireDefs = [
    'M 82 59 L 110 130','M 82 99 L 110 155',
    'M 210 145 L 240 59','M 210 155 L 240 144',
    'M 160 105 L 160 54','M 82 214 L 110 175',
    'M 225 214 L 210 175','M 160 242 L 160 175'
  ];
  const animPaths = wireDefs.map((d,i) => {
    const p = mk('path',{d,'stroke-dasharray':200,'stroke-dashoffset':200});
    wg.appendChild(p);
    return {el:p, delay:i*0.12};
  });
  svg.appendChild(wg);

  // Nodes
  const ng = document.createElementNS(ns,'g');
  [[110,130],[110,155],[210,145],[210,155],[160,105],[160,54],[110,175],[210,175],[160,175]].forEach(([x,y])=>{
    ng.appendChild(mk('circle',{cx:x,cy:y,r:2.5,fill:G,opacity:.85}));
  });
  svg.appendChild(ng);

  // Pulses
  const pg = document.createElementNS(ns,'g'); svg.appendChild(pg);
  const pulseData=[
    {x1:82,y1:59,x2:110,y2:130,c:G},{x1:210,y1:145,x2:240,y2:59,c:A},
    {x1:82,y1:214,x2:110,y2:175,c:G},{x1:225,y1:214,x2:210,y2:175,c:C},
    {x1:160,y1:105,x2:160,y2:54,c:A}
  ];
  const pulses = pulseData.map(p => {
    const g2=mk('circle',{r:6,fill:p.c,opacity:.2}), c=mk('circle',{r:3,fill:p.c,opacity:.95});
    pg.appendChild(g2); pg.appendChild(c);
    return {...p,g2,c,t:Math.random(),s:.003+Math.random()*.004};
  });

  let start=null;
  (function frame(ts){
    if(!start) start=ts;
    animPaths.forEach(pw=>{
      const prog=Math.max(0,Math.min(1,((ts-start)/1000-pw.delay)/.85));
      pw.el.setAttribute('stroke-dashoffset',200*(1-prog));
    });
    pulses.forEach(p=>{
      p.t=(p.t+p.s)%1;
      const x=p.x1+(p.x2-p.x1)*p.t, y=p.y1+(p.y2-p.y1)*p.t;
      [p.c,p.g2].forEach(e=>{e.setAttribute('cx',x);e.setAttribute('cy',y);});
    });
    requestAnimationFrame(frame);
  })(0);
}

/* ── PROJECT SVG THUMBNAILS ──────────────────────────────── */
const thumbs = {
  'alu-16bit': `<svg viewBox="0 0 340 170" xmlns="http://www.w3.org/2000/svg"><rect width="340" height="170" fill="#111827"/><rect x="118" y="40" width="104" height="88" rx="4" fill="rgba(118,185,0,0.08)" stroke="#76B900" stroke-width="1.5"/><text x="170" y="88" text-anchor="middle" fill="#76B900" font-family="monospace" font-size="14" font-weight="700">ALU</text><text x="170" y="106" text-anchor="middle" fill="rgba(118,185,0,0.5)" font-family="monospace" font-size="8">16-bit · 14 ops · 6 flags</text><rect x="16" y="52" width="74" height="22" rx="2" fill="rgba(118,185,0,0.05)" stroke="rgba(118,185,0,0.35)" stroke-width="1"/><text x="53" y="67" text-anchor="middle" fill="rgba(118,185,0,0.7)" font-family="monospace" font-size="8">REG A[15:0]</text><rect x="16" y="86" width="74" height="22" rx="2" fill="rgba(118,185,0,0.05)" stroke="rgba(118,185,0,0.35)" stroke-width="1"/><text x="53" y="101" text-anchor="middle" fill="rgba(118,185,0,0.7)" font-family="monospace" font-size="8">REG B[15:0]</text><rect x="250" y="52" width="74" height="22" rx="2" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.4)" stroke-width="1"/><text x="287" y="67" text-anchor="middle" fill="#00D4FF" font-family="monospace" font-size="8">CF ZF SF OF</text><rect x="250" y="86" width="74" height="22" rx="2" fill="rgba(118,185,0,0.05)" stroke="rgba(118,185,0,0.35)" stroke-width="1"/><text x="287" y="101" text-anchor="middle" fill="rgba(118,185,0,0.6)" font-family="monospace" font-size="8">OUT[15:0]</text><line x1="90" y1="63" x2="118" y2="76" stroke="#76B900" stroke-width="1.2" opacity=".6"/><line x1="90" y1="97" x2="118" y2="96" stroke="#76B900" stroke-width="1.2" opacity=".6"/><line x1="222" y1="76" x2="250" y2="63" stroke="#00D4FF" stroke-width="1.2" opacity=".6"/><line x1="222" y1="96" x2="250" y2="97" stroke="#76B900" stroke-width="1.2" opacity=".6"/><text x="170" y="155" text-anchor="middle" fill="rgba(118,185,0,0.35)" font-family="monospace" font-size="7.5">QUARTUS PRIME · MODELSIM · ALTERA DE2</text></svg>`,

  'whack-a-mole': `<svg viewBox="0 0 340 170" xmlns="http://www.w3.org/2000/svg"><rect width="340" height="170" fill="#111827"/><rect x="18" y="22" width="304" height="90" rx="5" fill="rgba(118,185,0,0.04)" stroke="rgba(118,185,0,0.2)" stroke-width="1"/>${[40,78,116,154,192,230,268,306].map((x,i)=>`<circle cx="${x}" cy="67" r="11" fill="${[0,3,5,7].includes(i)?'rgba(118,185,0,0.3)':'rgba(118,185,0,0.06)'}" stroke="${[0,3,5,7].includes(i)?'#76B900':'rgba(118,185,0,0.2)'}" stroke-width="1.2"/>${[0,3,5,7].includes(i)?`<circle cx="${x}" cy="67" r="4.5" fill="#76B900"/>`:''}` ).join('')}<text x="170" y="128" text-anchor="middle" fill="rgba(0,212,255,0.55)" font-family="monospace" font-size="8.5">LFSR · TIMER · SCORER · 7-SEG · LCD</text><rect x="70" y="140" width="82" height="20" rx="3" fill="rgba(118,185,0,0.06)" stroke="rgba(118,185,0,0.3)" stroke-width="1"/><text x="111" y="154" text-anchor="middle" fill="#76B900" font-family="monospace" font-size="9" font-weight="700">SCORE: 07</text><rect x="188" y="140" width="82" height="20" rx="3" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.3)" stroke-width="1"/><text x="229" y="154" text-anchor="middle" fill="#00D4FF" font-family="monospace" font-size="9" font-weight="700">TIME: 23s</text></svg>`,

  'lap-timer': `<svg viewBox="0 0 340 170" xmlns="http://www.w3.org/2000/svg"><rect width="340" height="170" fill="#111827"/><rect x="16" y="28" width="308" height="64" rx="4" fill="rgba(0,0,0,0.5)" stroke="rgba(118,185,0,0.35)" stroke-width="1.5"/><text x="28" y="70" fill="#76B900" font-family="monospace" font-size="26" font-weight="700">03:11:0141</text><text x="170" y="112" text-anchor="middle" fill="rgba(118,185,0,0.45)" font-family="monospace" font-size="8.5">C1: 00:11:01 · C2: 00:11:03</text><text x="170" y="132" text-anchor="middle" fill="rgba(0,212,255,0.4)" font-family="monospace" font-size="7.5">50MHz CLK DIV · MS/SEC/MIN COUNTERS</text><text x="170" y="150" text-anchor="middle" fill="rgba(118,185,0,0.3)" font-family="monospace" font-size="7.5">7-SEGMENT DISPLAY · 16×2 LCD CONTROLLER</text></svg>`,
};

function getThumb(id) {
  return thumbs[id] || `<svg viewBox="0 0 340 170" xmlns="http://www.w3.org/2000/svg"><rect width="340" height="170" fill="#111827"/><text x="170" y="90" text-anchor="middle" fill="rgba(118,185,0,0.3)" font-family="monospace" font-size="12">FPGA PROJECT</text></svg>`;
}

/* ══════════════════════════════════════════════════════════
   RENDER FUNCTIONS — each reads from D (portfolio.json)
══════════════════════════════════════════════════════════ */

function renderMeta() {
  document.title = D.meta.seo.title;
  document.querySelector('meta[name="description"]').content = D.meta.seo.description;
  document.querySelector('meta[name="keywords"]').content   = D.meta.seo.keywords;
}

function renderNav() {
  const nf = $('nav-first'), nl = $('nav-last');
  if (nf) nf.textContent = D.meta.firstName.toLowerCase();
  if (nl) nl.textContent = '.' + D.meta.lastName.toLowerCase();
}

function renderHero() {
  const m = D.meta;
  $('hero-first').textContent   = m.firstName;
  $('hero-last').textContent    = ' ' + m.lastName;
  $('hero-role').textContent    = D.education[0].degree + ' · ' + D.education[0].institution;
  $('hero-summary').textContent = m.heroSummary;

  const photo = $('hero-photo');
  if (photo) { photo.src = m.photo; photo.alt = m.name; }

  const resumeBtn = $('hero-resume');
  const ghBtn     = $('hero-github');
  const liBtn     = $('hero-linkedin');
  if (resumeBtn) resumeBtn.href = m.resume;
  if (ghBtn)     ghBtn.href     = m.github;
  if (liBtn)     liBtn.href     = m.linkedin;

  // Chips
  const chips = $('hero-chips');
  if (chips) {
    [...D.skills.hardware.slice(0,5), ...D.skills.eda.slice(0,2)].forEach(s => {
      const sp = document.createElement('span'); sp.className='chip hi'; sp.textContent=s; chips.appendChild(sp);
    });
    D.skills.programming.slice(0,3).forEach(s => {
      const sp = document.createElement('span'); sp.className='chip'; sp.textContent=s; chips.appendChild(sp);
    });
  }

  // Online status
  const os = $('online-status');
  if (os) os.textContent = D.availability.message;

  // GitHub profile link
  const ghProfile = $('gh-profile-link');
  if (ghProfile) ghProfile.href = m.github;
}

function renderAvailability() {
  const av = D.availability;
  const msg = $('avail-msg'), det = $('avail-detail'), chips = $('avail-chips');
  if (msg) msg.textContent = av.message;
  if (det) det.textContent = '— ' + av.detail;
  if (chips) {
    [av.since, av.location].forEach(t => {
      const sp = document.createElement('span'); sp.className='chip hi'; sp.textContent=t; chips.appendChild(sp);
    });
  }
}

function renderLearning() {
  const el = $('learn-pills');
  if (!el) return;
  D.currentLearning.forEach(s => {
    const sp = document.createElement('span'); sp.className='learn-pill'; sp.textContent=s; el.appendChild(sp);
  });
}

function renderQuickView() {
  const stats = $('qv-stats'), open = $('qv-open');
  if (!stats) return;
  const totalSkills = D.skills.hardware.length + D.skills.embedded.length + D.skills.programming.length + D.skills.eda.length;
  const rows = [
    ['B.Tech CGPA (Sem 4)', D.dashboard.btechCGPA],
    ['Diploma CGPA',        D.dashboard.diplomaCGPA],
    ['FPGA Projects',       D.projects.length + '+'],
    ['Certifications',      D.certifications.length + ''],
    ['Internships',         D.experience.length + ''],
    ['Technical Skills',    totalSkills + '+'],
    ['GitHub Repos',        D.githubRepos.length + '+'],
  ];
  rows.forEach(([l,v]) => {
    const d = document.createElement('div'); d.className='qv-stat';
    d.innerHTML = `<span class="qv-sl">${l}</span><span class="qv-sv">${v}</span>`;
    stats.appendChild(d);
  });
  if (open) {
    D.openTo.forEach(o => {
      const sp = document.createElement('span'); sp.className='chip hi'; sp.textContent=o; open.appendChild(sp);
    });
  }
}

function renderDashboard() {
  const el = $('dash-grid');
  if (!el) return;
  const m = D.meta;
  const totalSkills = D.skills.hardware.length + D.skills.embedded.length + D.skills.programming.length + D.skills.eda.length;
  const items = [
    { n: D.projects.length+'+',      l:'Total Projects',   link:'#projects',     cls:'' },
    { n: D.certifications.length+'', l:'Certifications',   link:'#certifications',cls:'' },
    { n: D.experience.length+'',     l:'Internships',      link:'#experience',    cls:'' },
    { n: totalSkills+'+',            l:'Tech Skills',      link:'#skills',        cls:'' },
    { n: D.dashboard.btechCGPA,      l:'B.Tech CGPA',      link:'#education',     cls:'' },
    { n: D.dashboard.diplomaCGPA,    l:'Diploma CGPA',     link:'#education',     cls:'' },
    { n: D.githubRepos.length+'+',   l:'GitHub Repos',     link:m.github,         cls:'', ext:true },
    { n:'↓ Resume',                  l:'Download CV',      link:m.resume,         cls:'res', dl:true },
  ];
  items.forEach(item => {
    const d = document.createElement('div'); d.className='dash-card '+item.cls;
    let inner;
    if (item.ext)
      inner = `<a href="${item.link}" target="_blank" rel="noopener" class="dash-num" style="display:block;color:var(--g);text-decoration:none;font-size:1rem">${item.n}</a>`;
    else if (item.dl)
      inner = `<a href="${item.link}" download class="dash-num" style="display:block;color:var(--c);text-decoration:none;font-size:.85rem;padding-top:.2rem">${item.n}</a>`;
    else
      inner = `<a href="${item.link}" class="dash-num" style="display:block;color:var(--g);text-decoration:none">${item.n}</a>`;
    d.innerHTML = inner + `<span class="dash-lbl">${item.l}</span>`;
    el.appendChild(d);
  });
}

function renderRecruiterHighlights() {
  const el = $('rh-grid');
  if (!el) return;
  D.recruiterHighlights.forEach(h => {
    const d = document.createElement('div'); d.className='rh-card fade-up';
    d.innerHTML = `<div class="rh-icon">${h.icon}</div><div><div class="rh-num">${h.value}</div><div class="rh-lbl">${h.label}</div></div>`;
    el.appendChild(d);
  });
}

function renderWhyHireMe() {
  const el = $('why-grid');
  if (!el) return;
  D.whyHireMe.forEach((c,i) => {
    const d = document.createElement('div'); d.className='why-card fade-up';
    d.style.transitionDelay = (i*0.05)+'s';
    d.innerHTML = `
      <div class="why-top">
        <div class="why-icon">${c.icon}</div>
        <div class="why-title">${c.title}</div>
      </div>
      <div class="why-body">${c.body}</div>
      <div class="why-proof">▸ ${c.proof}</div>`;
    el.appendChild(d);
  });
}

function renderJourney() {
  const el = $('journey-nodes');
  if (!el) return;
  D.journey.forEach(n => {
    const d = document.createElement('div'); d.className=`jnode ${n.status}`; d.title=n.description;
    d.innerHTML = `<div class="jdot">${n.icon}</div><div class="jlabel">${n.label.replace('\n','<br>')}</div><div class="jperiod">${n.period}</div>`;
    el.appendChild(d);
  });
}

function renderProjects(filter='All') {
  const el = $('proj-grid');
  if (!el) return;
  el.innerHTML = '';
  const list = filter==='All' ? D.projects : D.projects.filter(p=>p.filters.includes(filter));
  list.forEach(p => {
    const d = document.createElement('div'); d.className='proj-card fade-up';
    d.innerHTML = `
      <div class="proj-thumb">
        ${getThumb(p.id)}
        <span class="proj-cat-badge">${p.category}</span>
        <div class="proj-status-row">${statusBadges(p.status)}</div>
      </div>
      <div class="proj-body">
        <div class="proj-title">${p.title}</div>
        <div class="proj-sub">${p.subtitle}</div>
        <div class="proj-metrics">
          <div class="metric"><span class="metric-n">${p.metrics.operations}</span><span class="metric-l">Operations</span></div>
          <div class="metric"><span class="metric-n">${p.metrics.flags}</span><span class="metric-l">Flags/Mods</span></div>
          <div class="metric"><span class="metric-n">${p.metrics.board}</span><span class="metric-l">Board</span></div>
        </div>
        <div class="proj-desc">${p.summary}</div>
        <div class="proj-tags">${p.tags.slice(0,5).map(t=>`<span class="proj-tag">${t}</span>`).join('')}</div>
        <div class="proj-actions">
          <button class="btn-sm" onclick="openModal('${p.id}')">Details</button>
          ${p.report  ? `<a href="${p.report}"  download class="btn-sm dl">↓ Report</a>`          : ''}
          ${p.github  ? `<a href="${p.github}"  target="_blank" class="btn-sm gh" rel="noopener">GitHub ↗</a>` : ''}
          ${p.demoVideo ? `<a href="${p.demoVideo}" target="_blank" class="btn-sm" rel="noopener">▶ Demo</a>`  : ''}
        </div>
      </div>`;
    d.querySelector('.proj-title').addEventListener('click', () => openModal(p.id));
    el.appendChild(d);
  });
  initScrollAnimations();
}

function renderProjectFilters() {
  const el = $('proj-filters');
  if (!el) return;
  const filters = ['All', ...new Set(D.projects.flatMap(p=>p.filters))];
  filters.forEach(f => {
    const b = document.createElement('button'); b.className='filter-btn'+(f==='All'?' active':''); b.textContent=f;
    b.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderProjects(f);
    });
    el.appendChild(b);
  });
}

function renderUpcoming() {
  const el = $('upcoming-grid');
  if (!el) return;
  D.upcomingProjects.forEach(p => {
    const d = document.createElement('div'); d.className='upcoming-card fade-up';
    d.innerHTML = `<div class="upcoming-icon">${p.icon}</div><div class="upcoming-title">${p.title}</div><div class="upcoming-tags">${p.tags.map(t=>chip(t)).join('')}</div><div class="upcoming-eta">ETA: ${p.eta}</div>`;
    el.appendChild(d);
  });
}

function renderSkills() {
  const el = $('skills-grid');
  if (!el) return;
  const groups = [
    {icon:'⚡', title:'Hardware & RTL',   items:D.skills.hardware},
    {icon:'🔧', title:'Embedded Systems', items:D.skills.embedded},
    {icon:'💻', title:'Programming',      items:D.skills.programming},
    {icon:'🛠', title:'EDA Tools',        items:D.skills.eda},
  ];
  groups.forEach(g => {
    const d = document.createElement('div'); d.className='skill-group fade-up';
    d.innerHTML = `<div class="skill-icon">${g.icon}</div><div class="skill-title">${g.title}</div>${g.items.map(i=>`<div class="skill-item">${i}</div>`).join('')}`;
    el.appendChild(d);
  });

  const cw = $('cw-chips');
  if (cw) D.coursework.forEach(c=>{const sp=document.createElement('span');sp.className='chip';sp.textContent=c;cw.appendChild(sp);});
}

function renderExperience() {
  const el = $('timeline'), lbl = $('exp-count-label');
  if (!el) return;
  if (lbl) lbl.textContent = `${D.experience.length} internships — generated from experience[] in JSON`;
  D.experience.forEach(e => {
    const d = document.createElement('div'); d.className=`titem ${e.type==='community'?'community':''} fade-up`;
    d.innerHTML = `
      <div class="t-period">${e.period} · ${e.duration}</div>
      <div class="t-role">${e.role}${e.type==='community'?' <span class="chip am" style="font-size:.56rem;vertical-align:middle">New</span>':''}</div>
      <div class="t-company">${e.company} · ${e.location}</div>
      <div class="t-desc">${e.description}</div>
      <div class="t-skills">${e.skills.map(s=>chip(s,e.type==='community'?'am':'')).join('')}</div>
      ${e.projects.length ? `<div class="t-projects">${e.projects.join(' · ')}</div>` : ''}
      ${e.certificate ? `<a href="${e.certificate}" target="_blank" class="btn-sm t-cert-link" rel="noopener">View Certificate ↗</a>` : ''}`;
    el.appendChild(d);
  });
}

function renderEducation() {
  const el = $('edu-grid');
  if (!el) return;
  D.education.forEach(e => {
    const d = document.createElement('div'); d.className='edu-card fade-up';
    d.innerHTML = `
      <div class="edu-status"><span class="chip ${e.status==='current'?'cy':'hi'}">${e.status==='current'?'Current':'Completed'}</span></div>
      <div class="edu-degree">${e.degree}</div>
      <div class="edu-inst">${e.institution}</div>
      <div class="edu-period">${e.period} · ${e.batch||''}</div>
      <div class="edu-grad">🎓 Expected Graduation: <strong style="color:var(--c)">${e.expectedGraduation}</strong></div>
      <div class="edu-cgpa-row">
        <span class="edu-cgpa">⭐ CGPA: ${e.cgpa}</span>
        <span class="edu-cgpa-note">${e.cgpaNote}</span>
      </div>
      <div class="edu-desc">${e.description}</div>
      <ul class="edu-highlights">${e.highlights.map(h=>`<li>${h}</li>`).join('')}</ul>`;
    el.appendChild(d);
  });
}

function renderCertifications() {
  const el = $('cert-grid');
  if (!el) return;

  D.certifications.forEach(c => {
    const d = document.createElement('div');
    d.className = 'cert-card fade-up' + (c.id==='nptel-vlsi'?' nptel':'');
    d.innerHTML = `
      <div class="cert-img" ${c.image?`onclick="openLightbox('${c.image}')"`:''}
           title="${c.image?'Click to view certificate':''}">
        ${c.image
          ? `<img src="${c.image}" alt="${c.title}" loading="lazy"/>`
          : `<div class="cert-img-fallback"><div class="cert-img-icon">🏅</div><div>${c.organization}</div></div>`}
      </div>
      <div class="cert-body">
        <div class="cert-issuer">${c.organization} · ${c.platform}</div>
        <div class="cert-title-text">${c.title}</div>
        <div class="cert-date">${c.date}${c.duration?' · '+c.duration:''}</div>
        <div class="cert-hl">${c.highlight}</div>
        ${c.pills ? `<div class="cert-pills">${c.pills.map(p=>`<span class="cert-pill">${p}</span>`).join('')}</div>` : ''}
        ${c.rollNo ? `<div class="cert-roll">Roll No: ${c.rollNo}</div>` : ''}
        <div class="cert-actions">
          ${c.pdf   ? `<a href="${c.pdf}"   download class="btn-sm dl">↓ PDF</a>` : ''}
          ${c.image ? `<button class="btn-sm" onclick="openLightbox('${c.image}')">View ↗</button>` : ''}
        </div>
      </div>`;
    el.appendChild(d);
  });

  // Planned certifications
  D.plannedCertifications.forEach(c => {
    const d = document.createElement('div'); d.className='cert-card planned fade-up';
    d.innerHTML = `
      <div class="cert-img"><div class="cert-img-fallback"><div class="cert-img-icon">📌</div><div style="color:var(--p)">Planned</div></div></div>
      <div class="cert-body">
        <div class="cert-issuer" style="color:var(--p)">${c.organization} · Planned</div>
        <div class="cert-title-text">${c.title}</div>
        <div class="cert-date">Target: ${c.eta}</div>
        <div class="cert-hl" style="border-color:var(--p)">From plannedCertifications[] in portfolio.json</div>
        <span class="planned-badge">Planned</span>
      </div>`;
    el.appendChild(d);
  });
}

function renderAchievements() {
  const el = $('achiev-grid');
  if (!el) return;
  D.achievements.forEach(a => {
    const d = document.createElement('div'); d.className='achiev-card fade-up';
    d.innerHTML = `<div class="achiev-icon">${a.icon}</div><div class="achiev-title">${a.title}</div><div class="achiev-desc">${a.description}</div><div class="achiev-year">${a.year}</div>`;
    el.appendChild(d);
  });
}

function renderGitHub() {
  const el = $('gh-grid');
  if (!el) return;
  D.githubRepos.forEach(r => {
    const d = document.createElement('div'); d.className='gh-card fade-up';
    d.innerHTML = `
      <div class="gh-header"><div class="gh-icon-wrap">📁</div><div class="gh-name">${r.name}</div></div>
      <div class="gh-desc">${r.description}</div>
      <div class="gh-topics">${r.topics.map(t=>`<span class="gh-topic">${t}</span>`).join('')}</div>
      <div class="gh-footer">
        <span class="gh-lang">${r.language}</span>
        <div class="gh-stats"><span class="gh-stat">★ ${r.stars}</span><span class="gh-stat">⑂ ${r.forks}</span></div>
        <a href="${r.url}" target="_blank" rel="noopener" style="font-family:var(--mono);font-size:.63rem;color:var(--g)">View ↗</a>
      </div>`;
    el.appendChild(d);
  });
}

function renderLanguages() {
  const el = $('lang-grid');
  if (!el) return;
  D.languages.forEach(l => {
    const d = document.createElement('div'); d.className='lang-card fade-up';
    d.innerHTML = `<div class="lang-name">${l.name}</div><div class="lang-level">${l.level}</div><div class="lang-bar-wrap"><div class="lang-bar" style="width:0%" data-width="${l.pct}%"></div></div>`;
    el.appendChild(d);
  });
  // Animate bars on scroll
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.lang-bar').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.3});
  document.querySelectorAll('.lang-card').forEach(c => obs.observe(c));
}

function renderRoadmap() {
  const done=$('road-done'), learn=$('road-learning'), tgt=$('road-target');
  if (!done) return;
  D.roadmap.completed.forEach(i=>{const d=document.createElement('div');d.className='road-item';d.innerHTML=`<span class="road-dot"></span>${i}`;done.appendChild(d);});
  D.roadmap.learning.forEach(i=>{const d=document.createElement('div');d.className='road-item';d.innerHTML=`<span class="road-dot"></span>${i}`;learn.appendChild(d);});
  D.roadmap.target.forEach(i=>{const d=document.createElement('div');d.className='road-item';d.innerHTML=`<span class="road-dot"></span>${i}`;tgt.appendChild(d);});
}

function renderCompanies() {
  const el = $('companies-scroll');
  if (!el) return;
  D.targetCompanies.forEach(c => {
    const sp = document.createElement('span'); sp.className='company-badge'; sp.textContent=c; el.appendChild(sp);
  });
}

function renderDownloads() {
  const el = $('dl-grid');
  if (!el) return;
  D.downloads.forEach(dl => {
    const d = document.createElement('div'); d.className='dl-card fade-up';
    d.innerHTML = `<div class="dl-icon">${dl.icon}</div><div class="dl-title">${dl.title}</div><div class="dl-desc">${dl.description}</div><a href="${dl.file}" download class="dl-btn">↓ ${dl.label}</a>`;
    el.appendChild(d);
  });
}

function renderContact() {
  const m = D.meta;
  const avail = $('contact-avail');
  if (avail) avail.textContent = D.contact.availableFor;

  const links = $('contact-links');
  if (links) {
    links.className = 'contact-links-list';
    const rows = [
      {icon:'✉', label:'Email',    val:`<a href="mailto:${m.email}">${m.email}</a>`},
      {icon:'📞', label:'Phone',    val:`<a href="tel:${m.phone}">${m.phone}</a>`},
      {icon:'📍', label:'Location', val:m.location},
      {icon:'in', label:'LinkedIn', val:`<a href="${m.linkedin}" target="_blank" rel="noopener">${m.linkedin}</a>`},
      {icon:'⌥',  label:'GitHub',   val:`<a href="${m.github}"   target="_blank" rel="noopener">${m.github}</a>`},
    ];
    rows.forEach(r => {
      const d = document.createElement('div'); d.className='cinfo-row';
      d.innerHTML = `<span class="cinfo-icon">${r.icon}</span><div><span class="cinfo-label">${r.label}</span><span class="cinfo-val">${r.val}</span></div>`;
      links.appendChild(d);
    });
  }

  const soc = $('socials-row');
  if (soc) {
    D.socials.forEach(s => {
      const a = document.createElement('a'); a.className='soc-btn'; a.href=s.url; a.target='_blank'; a.rel='noopener'; a.textContent=s.label; soc.appendChild(a);
    });
    // Resume download button
    const rb = document.createElement('a'); rb.className='soc-btn'; rb.href=m.resume; rb.download=''; rb.textContent='↓ Resume'; soc.appendChild(rb);
  }
}

function renderFooter() {
  const brand = $('footer-brand'), roles = $('footer-roles'), meta = $('footer-meta');
  if (brand) brand.innerHTML = `<span class="accent">${D.meta.firstName.toLowerCase()}</span>.${D.meta.lastName.toLowerCase()} — FPGA &amp; RTL Engineer`;
  if (roles) {
    D.targetRoles.slice(0,4).forEach(r => {
      const sp = document.createElement('span'); sp.className='footer-role-tag'; sp.textContent=r; roles.appendChild(sp);
    });
  }
  if (meta) meta.textContent = `${D.education[0].institution} · ${D.education[0].period} · v${D.meta.resumeVersion} · Updated: ${D.meta.lastUpdated}`;
}

/* ── MODAL ───────────────────────────────────────────────── */
window.openModal = function(id) {
  const p = D.projects.find(x=>x.id===id);
  if (!p) return;
  $('modal-title').textContent = p.title;

  let html = `<div style="font-family:var(--mono);font-size:.7rem;color:var(--c);margin-bottom:1.25rem">${p.subtitle}</div>`;

  // Meta row
  html += `<div class="modal-meta">`;
  [['Institution',p.institution],['Date',p.date],p.collaborator?['Collaborator',p.collaborator]:null,p.supervisor?['Supervisor',p.supervisor]:null].filter(Boolean).forEach(([l,v])=>{
    html += `<div class="modal-meta-item"><span class="modal-meta-label">${l}</span><span class="modal-meta-val">${v}</span></div>`;
  });
  html += `</div>`;

  // Status badges
  html += `<div style="display:flex;gap:.4rem;margin-bottom:1.5rem">${statusBadges(p.status)}</div>`;

  const sec = (t,c) => `<div class="modal-sec"><div class="modal-sec-title">${t}</div>${c}</div>`;

  html += sec('Overview', `<p class="modal-text">${p.summary}</p>`);
  html += sec('Key Highlights', `<ul class="modal-list">${p.highlights.map(h=>`<li>${h}</li>`).join('')}</ul>`);
  html += sec('Design Methodology', `<p class="modal-text">${p.methodology}</p>`);

  if (p.operations) {
    html += sec('Operation Set', `<div style="overflow-x:auto"><table class="ops-table"><thead><tr><th>#</th><th>Operation</th><th>ALU_Sel</th></tr></thead><tbody>${p.operations.map((o,i)=>`<tr><td style="color:var(--t3)">${String(i+1).padStart(2,'0')}</td><td>${o.op}</td><td class="op-sel">${o.sel}</td></tr>`).join('')}</tbody></table></div>`);
  }
  if (p.flags) {
    html += sec('Status Flags', `<div class="flags-grid">${p.flags.map(f=>`<div class="flag-card"><div class="flag-name">${f.name}</div><div class="flag-desc">${f.desc}</div></div>`).join('')}</div>`);
  }

  html += sec('Project Metrics', `<div class="modal-metrics">${Object.entries(p.metrics).map(([k,v])=>`<div class="modal-metric"><span class="modal-metric-n">${v}</span><span class="modal-metric-l">${k}</span></div>`).join('')}</div>`);
  html += sec('Outcome & Industry Relevance', `<p class="modal-text">${p.outcome}</p>`);
  html += sec('Technology Stack', `<div style="display:flex;flex-wrap:wrap;gap:.38rem">${p.tags.map(t=>chip(t)).join('')}</div>`);

  // Links
  const linksBtns = [
    p.report    ? `<a href="${p.report}" download class="btn btn-outline">↓ Download Report</a>` : '',
    p.github    ? `<a href="${p.github}" target="_blank" class="btn btn-outline" rel="noopener">GitHub ↗</a>` : '',
    p.demoVideo ? `<a href="${p.demoVideo}" target="_blank" class="btn btn-cyan" rel="noopener">▶ Demo Video</a>` : '',
  ].filter(Boolean).join('');
  if (linksBtns) html += sec('Downloads & Links', `<div style="display:flex;flex-wrap:wrap;gap:.65rem">${linksBtns}</div>`);

  $('modal-body').innerHTML = html;
  $('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

function closeModal() {
  $('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── LIGHTBOX ────────────────────────────────────────────── */
window.openLightbox = function(src) {
  const img = $('lightbox-img');
  if (img) img.src = src;
  $('lightbox-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

function closeLightbox() {
  $('lightbox-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── CONTACT FORM ────────────────────────────────────────── */
function initContactForm() {
  const form = $('contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const sub = form.querySelector('.form-submit');
    sub.disabled=true; sub.textContent='Sending...';
    try {
      const r = await fetch(D.contact.formspreeEndpoint, {
        method:'POST', body:new FormData(form), headers:{Accept:'application/json'}
      });
      if (r.ok) {
        form.style.display='none';
        $('form-success').style.display='block';
      } else {
        sub.disabled=false; sub.textContent='Send Message ↗';
        alert('Please email directly: '+D.meta.email);
      }
    } catch {
      sub.disabled=false; sub.textContent='Send Message ↗';
    }
  });
}

/* ── NAV ─────────────────────────────────────────────────── */
function initNav() {
  const ham = $('nav-ham'), links = $('nav-links');
  if (ham && links) {
    ham.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }
  // Active link tracking
  const secs = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id);
        });
      }
    });
  }, {threshold:.35});
  secs.forEach(s => obs.observe(s));
}

/* ── SCROLL ANIMATIONS ───────────────────────────────────── */
function initScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} });
  }, {threshold:.1});
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('.dash-num').forEach(el => {
    const txt = el.textContent.trim();
    const num = parseFloat(txt);
    if (isNaN(num) || txt.includes('↓') || txt.includes('GitHub')) return;
    const suffix = txt.replace(String(num),'');
    let started = false;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        const dur = 1200, start = performance.now();
        (function step(ts) {
          const prog = Math.min((ts-start)/dur,1);
          const val  = num * prog;
          el.textContent = (num%1===0 ? Math.floor(val) : val.toFixed(2)) + suffix;
          if (prog<1) requestAnimationFrame(step);
        })(performance.now());
        obs.disconnect();
      }
    }, {threshold:.5});
    obs.observe(el.closest('.dash-card')||el);
  });
}

/* ── INIT ────────────────────────────────────────────────── */
async function init() {
  await loadData();

  renderMeta();
  renderNav();
  renderHero();
  renderAvailability();
  renderLearning();
  renderQuickView();
  renderDashboard();
  renderRecruiterHighlights();
  renderWhyHireMe();
  renderJourney();
  renderProjectFilters();
  renderProjects();
  renderUpcoming();
  renderSkills();
  renderExperience();
  renderEducation();
  renderCertifications();
  renderAchievements();
  renderGitHub();
  renderLanguages();
  renderRoadmap();
  renderCompanies();
  renderDownloads();
  renderContact();
  renderFooter();

  initBgCanvas();
  initFPGASVG();
  initNav();
  initContactForm();
  initScrollAnimations();
  setTimeout(initCounters, 400);
  setTimeout(initScrollAnimations, 500);

  // Modal
  $('modal-close').addEventListener('click', closeModal);
  $('modal-overlay').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });

  // Lightbox
  $('lightbox-close').addEventListener('click', closeLightbox);
  $('lightbox-overlay').addEventListener('click', e => { if(e.target===e.currentTarget) closeLightbox(); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') { closeModal(); closeLightbox(); }
  });
}

document.addEventListener('DOMContentLoaded', init);
