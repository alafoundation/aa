/* =====================================================================
   AL-AMANAH FOUNDATION — shared site script
   Loaded on every page. Every block checks that its target element(s)
   exist before running, so one file safely serves all pages.
===================================================================== */

/* ---------- DARK MODE (all pages) ---------- */
(function(){
  const btn = document.getElementById('dark-toggle');
  if(btn){
    btn.addEventListener('click', ()=> document.documentElement.classList.toggle('dark'));
  }
})();

/* ---------- SEARCH TOGGLE (all pages) ---------- */
(function(){
  const searchToggle = document.getElementById('search-toggle');
  const searchPanel = document.getElementById('search-panel');
  if(searchToggle && searchPanel){
    searchToggle.addEventListener('click', ()=>{
      const open = searchPanel.classList.toggle('open');
      searchToggle.setAttribute('aria-expanded', open);
      if(open) searchPanel.querySelector('input').focus();
    });
  }
})();

/* ---------- MOBILE NAV (all pages) ---------- */
(function(){
  const mobileNav = document.getElementById('mobile-nav');
  const burger = document.getElementById('burger-toggle');
  const closeBtn = document.getElementById('mobile-close');
  if(mobileNav && burger && closeBtn){
    burger.addEventListener('click', ()=> mobileNav.classList.add('open'));
    closeBtn.addEventListener('click', ()=> mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> mobileNav.classList.remove('open')));
  }
})();

/* ---------- REVEAL ON SCROLL (all pages) ---------- */
(function(){
  const revealEls = document.querySelectorAll('.reveal');
  if(!revealEls.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        if(e.target.classList.contains('stat-card')) animateCounters();
      }
    });
  },{threshold:.2});
  revealEls.forEach(el=> io.observe(el));
})();

/* ---------- ANIMATED COUNTERS (home page) ---------- */
let countersStarted = false;
function animateCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length || countersStarted) return;
  countersStarted = true;
  counters.forEach(el=>{
    const target = parseInt(el.dataset.count,10);
    const suffix = el.dataset.suffix||'';
    const dur = 1600; const start = performance.now();
    function step(now){
      const p = Math.min(1,(now-start)/dur);
      const eased = 1-Math.pow(1-p,3);
      el.textContent = Math.floor(eased*target).toLocaleString()+suffix;
      if(p<1) requestAnimationFrame(step); else el.textContent = target.toLocaleString()+suffix;
    }
    requestAnimationFrame(step);
  });
}

/* ---------- I18N (all pages, per-page dictionary lives in each file as window.pageDict) ---------- */
(function(){
  const select = document.getElementById('lang-select');
  if(!select) return;
  const baseDict = {
    en:{brand:'Al-Amanah<small>Foundation</small>', nav_home:'Home', nav_about:'About', nav_programs:'Programs', nav_campaigns:'Campaigns', nav_donate:'Donate', nav_news:'News', nav_gallery:'Gallery', nav_faq:'FAQ', nav_contact:'Contact', nav_donate_btn:'Donate Now'},
    ar:{brand:'مؤسسة<small>الأمانة</small>', nav_home:'الرئيسية', nav_about:'من نحن', nav_programs:'برامجنا', nav_campaigns:'حملاتنا', nav_donate:'تبرع', nav_news:'الأخبار', nav_gallery:'معرض الصور', nav_faq:'الأسئلة', nav_contact:'تواصل معنا', nav_donate_btn:'تبرع الآن'},
    bn:{brand:'আল-আমানাহ<small>ফাউন্ডেশন</small>', nav_home:'হোম', nav_about:'আমাদের সম্পর্কে', nav_programs:'কর্মসূচি', nav_campaigns:'ক্যাম্পেইন', nav_donate:'দান করুন', nav_news:'সংবাদ', nav_gallery:'গ্যালারি', nav_faq:'প্রশ্নাবলী', nav_contact:'যোগাযোগ', nav_donate_btn:'এখনই দান করুন'}
  };
  select.addEventListener('change', (e)=>{
    const lang = e.target.value;
    const pageDict = (window.pageDict && window.pageDict[lang]) || {};
    const d = Object.assign({}, baseDict[lang], pageDict);
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.dataset.i18n;
      if(d[key]) el.innerHTML = d[key];
    });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang==='ar' ? 'rtl' : 'ltr';
  });
})();

/* ---------- PROGRAMS GRID (programs.html, teaser on home) ---------- */
(function(){
  const programsGrid = document.getElementById('programs-grid');
  if(!programsGrid) return;
  const full = programsGrid.dataset.mode !== 'teaser';
  const programs = [
    {t:'Zakat Distribution', d:'Precise, Sharia-compliant Zakat delivery to eligible recipients.'},
    {t:'Sadaqah Projects', d:'Flexible voluntary giving directed to urgent, everyday needs.'},
    {t:'Waqf Initiatives', d:'Endowments that fund wells, schools and clinics for generations.'},
    {t:'Orphan Sponsorship', d:'Education, healthcare and family support for orphaned children.'},
    {t:'Food Assistance', d:'Emergency food parcels and community kitchens.'},
    {t:'Clean Water Projects', d:'Wells and filtration systems for underserved villages.'},
    {t:'Education Support', d:'School fees, supplies, and scholarships for children in need.'},
    {t:'Healthcare Assistance', d:'Medical camps, clinics, and treatment funding.'},
    {t:'Emergency Relief', d:'Rapid response to crises with shelter, food, and medical aid.'},
    {t:'Ramadan Campaigns', d:'Iftar meals and Zakat al-Fitr distribution during the holy month.'},
    {t:'Qurbani Projects', d:'Qurbani meat distributed to families in need worldwide.'},
    {t:'Disaster Response', d:'Search, rescue-support, and rebuilding after natural disasters.'}
  ];
  const archIcon = `<svg class="arch-ic" viewBox="0 0 48 56" fill="none"><path d="M4 54V26a20 20 0 0140 0v28" stroke="#D4AF37" stroke-width="2"/><path d="M24 6v10M18 12l6-6 6 6" stroke="#0F7A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const list = full ? programs : programs.slice(0,4);
  list.forEach(p=>{
    programsGrid.innerHTML += `<div class="prog-card reveal">${archIcon}<h4>${p.t}</h4><p>${p.d}</p><a class="more" href="donate.html">Support this →</a></div>`;
  });
})();

/* ---------- CAMPAIGNS GRID (campaigns.html, teaser on home) ---------- */
(function(){
  const campGrid = document.getElementById('camp-grid');
  if(!campGrid) return;
  const campaigns = [
    {tag:'Urgent', t:'Winter Emergency Relief', raised:68400, goal:100000},
    {tag:'Ongoing', t:'Clean Water for 10 Villages', raised:42500, goal:60000},
    {tag:'Ramadan', t:'Iftar Meals Across 3 Regions', raised:91000, goal:120000},
  ];
  campaigns.forEach(c=>{
    const pct = Math.round(c.raised/c.goal*100);
    campGrid.innerHTML += `<div class="camp-card reveal">
      <div class="camp-media"><span class="camp-tag">${c.tag}</span>
        <svg viewBox="0 0 300 170"><g stroke="#D4AF37" stroke-width="1" opacity=".6" fill="none"><circle cx="150" cy="85" r="55"/><path d="M150 30 L205 85 L150 140 L95 85 Z"/></g></svg>
      </div>
      <div class="camp-body">
        <h4>${c.t}</h4>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="camp-meta"><span><b>$${c.raised.toLocaleString()}</b> raised</span><span>${pct}% of $${c.goal.toLocaleString()}</span></div>
        <a href="donate.html" class="btn btn-emerald" style="width:100%;">Donate to this Campaign</a>
      </div>
    </div>`;
  });
})();

/* ---------- TESTIMONIALS (success-stories.html, teaser on home) ---------- */
(function(){
  const testWrap = document.getElementById('test-scroll');
  if(!testWrap) return;
  const testimonials = [
    {q:'“Because of the well the Foundation built, my daughters no longer walk four hours a day for water. They are in school now.”', n:'Amina, Community Elder', r:'East Africa'},
    {q:'“The orphan sponsorship program paid for my son’s surgery and school fees in the same year. We were never alone.”', n:'Yusuf, Guardian', r:'South Asia'},
    {q:'“After the flood, Al-Amanah reached our village within 48 hours with food and shelter — before anyone else did.”', n:'Layla, Beneficiary', r:'Middle East'},
  ];
  testimonials.forEach(t=>{
    testWrap.innerHTML += `<div class="test-card reveal"><p class="test-quote">${t.q}</p><div class="test-who"><div class="test-avatar">${t.n[0]}</div><div><b>${t.n}</b><span>${t.r}</span></div></div></div>`;
  });
})();

/* ---------- NEWS GRID (news.html, teaser on home) ---------- */
(function(){
  const newsGrid = document.getElementById('news-grid');
  if(!newsGrid) return;
  const newsItems = [
    {d:'July 12, 2026', t:'10,000 Iftar meals served this Ramadan', p:'Our community kitchens across three regions delivered daily meals throughout the holy month.'},
    {d:'June 28, 2026', t:'New water well completed in Bantu village', p:'The village’s fourth well brings clean water access to over 1,200 residents.'},
    {d:'June 5, 2026', t:'2025 Annual Transparency Report published', p:'See exactly how every dollar was allocated across our twelve programs last year.'},
  ];
  newsItems.forEach(n=>{
    newsGrid.innerHTML += `<div class="news-card reveal"><div class="news-media"></div><div class="news-body"><span class="news-date">${n.d}</span><h4>${n.t}</h4><p>${n.p}</p></div></div>`;
  });
})();

/* ---------- GALLERY GRID (gallery.html) ---------- */
(function(){
  const galleryGrid = document.getElementById('gallery-grid');
  if(!galleryGrid) return;
  const gClasses = ['b1','','b2','','','b1','',''];
  const gColors = ['#0F7A4A','#D4AF37','#0A5732','#EFE9DE','#0F7A4A','#D4AF37','#0B2A1E','#0F7A4A'];
  for(let i=0;i<8;i++){
    galleryGrid.innerHTML += `<div class="g-item ${gClasses[i]}"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="${gColors[i]}" opacity=".85"/><g stroke="#F8F5F0" stroke-width="1" opacity=".4"><circle cx="50" cy="50" r="30"/><path d="M50 20 L80 50 L50 80 L20 50 Z"/></g></svg></div>`;
  }
})();

/* ---------- FAQ ACCORDION (faq.html) ---------- */
(function(){
  const faqList = document.getElementById('faq-list');
  if(!faqList) return;
  const faqs = [
    {q:'Is my donation Sharia-compliant?', a:'Yes. All Zakat, Sadaqah and Waqf funds are managed under the guidance of a Sharia advisory board and distributed according to Islamic principles.'},
    {q:'How much of my donation reaches the field?', a:'We publish a quarterly transparency report showing program allocation versus operating costs, audited by an independent third party.'},
    {q:'Can I direct my Zakat to a specific program?', a:'Yes, you can designate your Zakat to any eligible category during checkout, including orphan sponsorship or emergency relief.'},
    {q:'Do you provide tax receipts?', a:'Yes, an official receipt is emailed immediately after every donation for your records.'},
    {q:'How can I volunteer remotely?', a:'We welcome remote volunteers for translation, content, and fundraising support — apply through our Volunteer page.'},
  ];
  faqs.forEach(f=>{
    faqList.innerHTML += `<div class="faq-item reveal"><div class="faq-q" role="button" tabindex="0" aria-expanded="false"><span>${f.q}</span><span class="plus">+</span></div><div class="faq-a"><p>${f.a}</p></div></div>`;
  });
  document.querySelectorAll('.faq-q').forEach(q=>{
    const toggle = ()=>{ const item=q.parentElement; const open=item.classList.toggle('open'); q.setAttribute('aria-expanded', open); };
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault(); toggle();} });
  });
})();

/* ---------- DONATE TABS + AMOUNT PICKERS (donate.html) ---------- */
(function(){
  const tabs = document.querySelectorAll('.tab-btn');
  if(!tabs.length) return;
  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.donate-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-'+btn.dataset.tab).classList.add('active');
    });
  });
  document.querySelectorAll('.amount-grid').forEach(grid=>{
    grid.querySelectorAll('.amount-btn').forEach(b=>{
      b.addEventListener('click', ()=>{
        grid.querySelectorAll('.amount-btn').forEach(x=>x.classList.remove('sel'));
        b.classList.add('sel');
      });
    });
  });
})();

/* ---------- ZAKAT CALCULATOR (donate.html) ---------- */
(function(){
  const calcBtn = document.getElementById('z-calc');
  if(!calcBtn) return;
  calcBtn.addEventListener('click', ()=>{
    const cash = parseFloat(document.getElementById('z-cash').value)||0;
    const gold = parseFloat(document.getElementById('z-gold').value)||0;
    const inv = parseFloat(document.getElementById('z-inv').value)||0;
    const debt = parseFloat(document.getElementById('z-debt').value)||0;
    const net = Math.max(0, cash+gold+inv-debt);
    const zakat = net*0.025;
    document.getElementById('z-amount').textContent = '$'+zakat.toLocaleString(undefined,{maximumFractionDigits:2});
    document.getElementById('z-result').style.display='block';
  });
})();
