const DATA = window.ISROF_DATA;
const app = document.getElementById("app");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const toastEl = document.getElementById("toast");
const welcomeScreen = document.getElementById("welcomeScreen");
const mainApp = document.getElementById("mainApp");

const state = {
  route: "home",
  category: "all",
  query: "",
  wallet: Number(localStorage.getItem("isrofWallet") || 0),
  ecoPoints: Number(localStorage.getItem("isrofPoints") || 1280),
  acceptedTasks: JSON.parse(localStorage.getItem("isrofTasks") || "[]"),
  completedTasks: JSON.parse(localStorage.getItem("isrofCompletedTasks") || "[]"),
  favourites: JSON.parse(localStorage.getItem("isrofFavs") || "[]")
};

function money(n){
  if(n === 0) return "Bepul";
  return new Intl.NumberFormat("uz-UZ").format(n) + " so‘m";
}
function showMainApp(){
  welcomeScreen.style.display = "none";
  mainApp.classList.remove("hidden-app");
  if(!location.hash) location.hash = "home";
  syncRoute();
}
document.getElementById("startBtn").addEventListener("click", showMainApp);

function setWallet(v){
  state.wallet = v;
  localStorage.setItem("isrofWallet", String(v));
  updateWalletMini();
}
function updateWalletMini(){
  const el = document.getElementById("walletMini");
  if(el) el.textContent = money(state.wallet);
}
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(()=>toastEl.classList.remove("show"), 2600);
}
function openModal(html){
  modalContent.innerHTML = html;
  modalBackdrop.classList.add("show");
}
function closeModal(){ modalBackdrop.classList.remove("show"); }
document.getElementById("modalClose").addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", e => { if(e.target === modalBackdrop) closeModal(); });

document.getElementById("menuBtn").addEventListener("click", ()=>document.getElementById("mobileMenu").classList.toggle("show"));

document.addEventListener("click", (e)=>{
  const routeLink = e.target.closest("[data-route]");
  if(routeLink){
    e.preventDefault();
    location.hash = routeLink.dataset.route;
    document.getElementById("mobileMenu").classList.remove("show");
  }
  const categoryCard = e.target.closest("[data-category]");
  if(categoryCard && categoryCard.dataset.category){
    if(categoryCard.dataset.category === "map"){
      location.hash = "map";
    } else {
      state.category = categoryCard.dataset.category;
      location.hash = "marketplace";
      setTimeout(render, 0);
    }
  }
});

function syncRoute(){
  state.route = (location.hash || "#home").replace("#","").split("?")[0] || "home";
  render();
}
window.addEventListener("hashchange", ()=>{
  if(!mainApp.classList.contains("hidden-app")) syncRoute();
});

function listingCard(item){
  const woodClass = item.category==="wood" ? " wood" : "";
  return `
    <article class="listing-card${woodClass}">
      <div class="listing-visual">
        <span class="badge ${item.badgeType || ""}">${item.badge}</span>
        <div class="emoji">${item.icon}</div>
        <button class="ghost-btn small fav-btn" onclick="toggleFavourite(${item.id})" style="padding:8px 10px">${state.favourites.includes(item.id)?"♥":"♡"}</button>
      </div>
      <div class="listing-body">
        <div class="listing-meta"><span>${item.business}</span><span>${item.location}</span></div>
        <h3>${item.title}</h3>
        <div class="listing-desc">${item.desc}</div>
        <div class="price-row">
          <div class="price">
            ${item.oldPrice ? `<del>${money(item.oldPrice)}</del>` : ""}
            <strong>${money(item.price)}</strong>
          </div>
          <span class="badge">${item.meta}</span>
        </div>
        <div class="card-actions">
          <button class="soft-btn" onclick="viewListing(${item.id})">Batafsil</button>
          <button class="primary-btn" onclick="reserveListing(${item.id})">${item.price===0 ? "So‘rash" : "Bron qilish"}</button>
        </div>
      </div>
    </article>`;
}

function renderHome(){
  const featured = [DATA.listings[0],DATA.listings[17],DATA.listings[9],DATA.listings[14],DATA.listings[21],DATA.listings[33]].map(listingCard).join("");
  return `
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="kicker">♻️ Circular economy • Uzbekistan</span>
        <h1>Tashlashdan oldin — <span>ISROF QILMA.</span></h1>
        <p>Ovqatni qutqar. Keraksiz buyumni sot yoki ulash. Plastikka qiymat qaytar. Bog‘dan kesilgan o‘tinni xaridorga yetkaz. Collector bo‘lib pul top. Bitta platformada odamlar, bizneslar va qayta foydalanish tarmog‘ini bog‘laymiz.</p>
        <div class="hero-actions">
          <button class="primary-btn" onclick="location.hash='marketplace'">Marketplace’ni ko‘rish</button>
          <button class="ghost-btn" onclick="location.hash='collector'">Collector bo‘lib pul topish</button>
        </div>
      </div>
      <div class="hero-card">
        <span class="live-badge"><span class="dot"></span> Platforma ko‘rsatkichlari</span>
        <h3>Chiqindi emas. Resurs.</h3>
        <p>Platformadagi joriy faollik va saqlangan resurslar.</p>
        <div class="metric-grid">
          <div class="metric"><strong>2 140 kg</strong><small>resurs qayta aylantirildi</small></div>
          <div class="metric"><strong>1 860</strong><small>porsiya ovqat saqlandi</small></div>
          <div class="metric"><strong>286</strong><small>collector profili</small></div>
          <div class="metric"><strong>2.4 mln</strong><small>so‘m qayta qiymat yaratildi</small></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="mission">
        <h2>Bu platforma kambag‘al insonlarni “qolgan narsa iste’molchisi” sifatida ko‘rsatmaydi.</h2>
        <p><strong>ISROF QILMA</strong>ning maqsadi odamlarni ajratish emas. Aksincha, yaxshi, foydalanishga yaroqli ovqat, buyum, material yoki bog‘dan chiqqan yog‘ochni chiqindiga aylanishidan oldin yana iqtisodiy aylanishga qaytarishdir. Bu <strong>tejamkorlik, ekologik mas’uliyat, resursni qadrlash va circular economy</strong> madaniyati. Platformadan talaba ham, oila ham, restoran ham, fermer ham, katta kompaniya ham foydalanadi.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>Asosiy yo‘nalishlar</h2><p>Mayda, tushunarsiz listinglar o‘rniga real foydalanish holatlari va foydasi aniq kategoriyalar.</p></div>
      </div>
      <div class="grid grid-4">
        ${DATA.categories.map(c=>`
          <article class="category-card" data-category="${c.id}">
            <div class="category-icon">${c.icon}</div>
            <h3>${c.name}</h3>
            <p>${c.desc}</p>
            <div class="count">${c.count}+ taklif →</div>
          </article>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>Hozirgi takliflardan namunalar</h2><p>Food, recycle, o‘tin, B2B va reuse bo‘limlaridan tanlangan e’lonlar.</p></div>
        <button class="ghost-btn" onclick="location.hash='marketplace'">Hammasini ko‘rish</button>
      </div>
      <div class="grid grid-3">${featured}</div>
    </div>
  </section>

  <section class="section">
    <div class="container cta">
      <div><h3>Isrofni xarajatdan qiymatga aylantiramiz.</h3><p>Marketplace, youth jobs, recycling logistics, o‘tin savdosi va B2B waste management’ni bitta platformada birlashtiramiz.</p></div>
      <button class="primary-btn" onclick="location.hash='business'">Business ko‘rinishi →</button>
    </div>
  </section>`;
}

function renderMarketplace(){
  const cats = [{id:"all",name:"Hammasi"},...DATA.categories.filter(c=>c.id!=="map").map(c=>({id:c.id,name:c.name}))];
  let items = DATA.listings.filter(x => state.category==="all" || x.category===state.category);
  if(state.query) items = items.filter(x => (x.title+x.business+x.location+x.desc).toLowerCase().includes(state.query.toLowerCase()));
  return `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><span class="kicker">Marketplace</span><h2>Keraksiz bo‘lib qolgan narsani qiymatga aylantiring.</h2><p>Food Rescue, recycling, o‘tin, reuse va B2B materiallar — barchasi tartibli kategoriyalarda.</p></div>
        <button class="primary-btn" onclick="openListingForm()">+ E’lon berish</button>
      </div>
      <div class="filter-bar">
        <div class="search-wrap">⌕ <input id="searchInput" placeholder="Mahsulot, biznes yoki hudud..." value="${state.query}" /></div>
        <select><option>Barcha hududlar</option><option>Toshkent</option><option>Samarqand</option><option>Namangan</option><option>Andijon</option><option>Buxoro</option></select>
        <select><option>Eng yaqin</option><option>Eng arzon</option><option>Yangi e’lonlar</option></select>
      </div>
      <div class="chips">${cats.map(c=>`<button class="chip ${state.category===c.id?"active":""}" onclick="setCategory('${c.id}')">${c.name}</button>`).join("")}</div>
      <div class="demo-note">E’lonlar foydalanuvchilar va hamkor bizneslar tomonidan joylashtiriladi.</div>
      <div class="hero-actions" style="margin:16px 0 4px">
        <button class="ghost-btn" onclick="location.hash='prices'">💰 Material narxlari</button>
        <button class="ghost-btn" onclick="location.hash='map'">🗺️ ISROF Map</button>
        <button class="ghost-btn" onclick="openWasteReport()">🚨 Chiqindi joyini bildirish</button>
      </div>
      <div style="height:18px"></div>
      <div class="grid grid-3">${items.length ? items.map(listingCard).join("") : `<div class="empty">Mos e’lon topilmadi.</div>`}</div>
    </div>
  </section>`;
}

function renderCollector(){
  return `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><span class="kicker">🛵 ISROF Collector</span><h2>Yig‘ing. Yetkazing. Pul toping.</h2><p>Yoshlar uchun pickup, recycling va material tashish topshiriqlari.</p></div>
        <button class="primary-btn" onclick="openCollectorJoin()">Collector bo‘lish</button>
      </div>
      <div class="stat-strip">
        <div class="stat"><strong>${money(state.wallet)}</strong><span>hamyon</span></div>
        <div class="stat"><strong>${state.acceptedTasks.length}</strong><span>qabul qilingan vazifa</span></div>
        <div class="stat"><strong>4.9 ★</strong><span>reyting</span></div>
        <div class="stat"><strong>712 kg</strong><span>yig‘ilgan material</span></div>
      </div>
      <div style="height:24px"></div>
      <div class="grid grid-3">${DATA.tasks.filter(t=>t.type==="Collector").map(taskCard).join("")}</div>
    </div>
  </section>`;
}

function taskCard(t){
  const accepted = state.acceptedTasks.includes(t.id);
  return `<article class="task-card">
    <div class="task-top"><span class="badge ${t.type==="Collector"?"blue":"purple"}">${t.type}</span><span class="task-price">${money(t.pay)}</span></div>
    <div style="font-size:2rem;margin-top:14px">${t.icon}</div>
    <h3>${t.title}</h3>
    <p>${t.desc}</p>
    <div class="task-details"><span>📍 ${t.area}</span><span>↔ ${t.distance}</span><span>⏱ ${t.time}</span></div>
    ${state.completedTasks.includes(t.id)
      ? `<button class="soft-btn" style="width:100%" disabled>Yakunlangan ✓</button>`
      : accepted
        ? `<button class="primary-btn" style="width:100%" onclick="completeTask(${t.id})">Yakunlash → ${money(t.pay)}</button>`
        : `<button class="primary-btn" style="width:100%" onclick="acceptTask(${t.id})">Vazifani olish</button>`}
  </article>`;
}

function renderEarn(){
  return `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><span class="kicker">💼 ISROF Earn</span><h2>Qisqa ishlar. Aniq to‘lov.</h2><p>Uyda o‘tirgan, talaba yoki qo‘shimcha daromad istagan yoshlar uchun micro-joblar.</p></div>
      </div>
      <div class="grid grid-3">${DATA.tasks.filter(t=>t.type==="Earn").map(taskCard).join("")}</div>
    </div>
  </section>`;
}

function renderPlatform(){
  const features = [
    ["⚡","Flash Rescue","Food Rescue narxi vaqt yaqinlashgani sari bosqichma-bosqich pasayadi."],
    ["🎁","Mystery Rescue Box","Bakery va restoran qolgan mahsulotlarni bitta arzon quti sifatida sotadi."],
    ["🪵","O‘tin bozori","Uy, bog‘ va hovlidan chiqqan quruq yog‘och va o‘tinni xaridorga ulaydi."],
    ["🚚","Pickup","Foydalanuvchi “uyimdan olib keting” deb Collector chaqiradi."],
    ["📅","Scheduled Pickup","Bizneslar uchun haftalik yoki kunlik avtomatik olib ketish jadvali."],
    ["🧭","Collector Route","Bir nechta pickup vazifasi uchun tartibli marshrut."],
    ["🔔","Waste Request","Recycler o‘zi qidirayotgan material va miqdorni e’lon qiladi."],
    ["💰","Material Prices","PET, karton, metall, o‘tin va boshqa materiallarning hamkor qabul narxlari."],
    ["🏆","Eco Rewards","Food Rescue, donate, recycle va tasklar uchun EcoPoints."],
    ["🏅","User Levels","Beginner → Saver → Green Hero → Eco Champion."],
    ["🏢","Business EcoScore","Biznesning rescue, recycling va donation natijalari."],
    ["📊","Waste Passport","QR orqali manba → Collector → Recycler zanjiri."],
    ["🏘️","Mahalla Challenge","Mahallalar o‘rtasida qayta foydalanish musobaqasi."],
    ["🏫","School Challenge","Maktablar uchun ekologik yig‘im va leaderboard."],
    ["🏢","Corporate ISROF","Katta kompaniyalarga chiqindi, mebel, e-waste va packaging boshqaruvi."],
    ["📈","Impact Dashboard","Ekologik va iqtisodiy natijalarni raqamlarda ko‘rsatish."],
    ["🚨","Illegal Waste Report","Noqonuniy chiqindi joyini rasm va lokatsiya bilan bildirish."],
    ["⭐","Rating","Collector, seller va bizneslar uchun reyting tizimi."],
    ["💬","Chat","Xaridor va sotuvchi uchun platforma ichidagi yozishma."],
    ["✅","Verification","Business va Collector uchun tasdiqlangan profil badge’i."],
    ["📸","Photo Proof","Pickup oldidan va topshirilgandan keyin surat bilan tasdiq."],
    ["▣","QR Confirmation","Pickup va recycler qabulini QR orqali qayd etish."],
    ["📦","Bulk / B2B","Kichik listingdan tonnalik biznes partiyasigacha."],
    ["♥","Favourites","Sevimli restoran, seller va e’lonlarni saqlash."],
    ["🔔","Notifications","Yaqin Food Rescue, narx o‘zgarishi va task haqida bildirishnoma."],
    ["💳","ISROF Wallet","Collector daromadi, refund va EcoPoints uchun hamyon."],
    ["💵","Payments","Mahalliy to‘lov provayderlarini ulashga tayyor checkout modeli."],
    ["🛡️","Escrow","Katta WasteTrade savdosida pulni yetkazib berish tasdiqlanguncha ushlab turish."],
    ["💼","Subscriptions","Free, Pro va Business tariflari."],
    ["📢","Promoted Listings","Biznes e’lonini marketplace tepasida reklama qilish."],
    ["🤝","Partner Network","Recycler, restoran, supermarket, maktab, mahalla va logistika hamkorlari."]
  ];
  return `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><span class="kicker">Platform Architecture</span><h2>ISROF QILMA ichidagi to‘liq funksiyalar.</h2><p>AI’siz ham ishlaydigan, real MVPga aylantirish mumkin bo‘lgan asosiy modullar.</p></div>
      </div>
      <div class="grid grid-3">${features.map(f=>`<div class="feature-card"><div class="icon">${f[0]}</div><h3>${f[1]}</h3><p>${f[2]}</p></div>`).join("")}</div>
    </div>
  </section>`;
}

function renderBusiness(){
  return `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><span class="kicker">🏢 Business Dashboard</span><h2>Chiqindini xarajat emas, boshqariladigan resursga aylantiring.</h2><p>Restoran, supermarket, ishlab chiqarish, ofis va recycler uchun yagona dashboard.</p></div>
        <button class="primary-btn" onclick="openBusinessForm()">Business profil ochish</button>
      </div>
      <div class="dashboard">
        <aside class="sidebar">
          <div class="profile"><div class="avatar">AB</div><div><strong>ABC Restaurant</strong><small style="display:block;color:#bcd1c2;margin-top:4px">Business Pro</small></div></div>
          <div class="sidebar-menu"><button class="active">Dashboard</button><button>Food Rescue</button><button>Waste pickup</button><button>WasteTrade</button><button>Reports</button><button>EcoScore</button></div>
        </aside>
        <div class="grid" style="gap:18px">
          <div class="stat-strip">
            <div class="stat"><strong>1 240</strong><span>meal rescued</span></div>
            <div class="stat"><strong>680 kg</strong><span>recycled waste</span></div>
            <div class="stat"><strong>91/100</strong><span>EcoScore</span></div>
            <div class="stat"><strong>2.1 mln</strong><span>so‘m recovered value</span></div>
          </div>
          <div class="panel">
            <h3>Shu haftadagi operatsiyalar</h3>
            <div class="table-wrap">
              <table>
                <thead><tr><th>Operatsiya</th><th>Bo‘lim</th><th>Miqdor</th><th>Qiymat</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>Mystery Bakery Box</td><td>Food</td><td>18 dona</td><td>522 000 so‘m</td><td><span class="status done">Tugadi</span></td></tr>
                  <tr><td>Karton pickup</td><td>Recycle</td><td>42 kg</td><td>50 400 so‘m</td><td><span class="status live">Yo‘lda</span></td></tr>
                  <tr><td>Used oil</td><td>Oil</td><td>70 l</td><td>140 000 so‘m</td><td><span class="status wait">Rejada</span></td></tr>
                  <tr><td>Bog‘ o‘tini</td><td>Wood</td><td>380 kg</td><td>240 000 so‘m</td><td><span class="status done">Sotildi</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head"><div><h2>Biznes tariflari</h2><p>Bizneslar uchun subscription modeli.</p></div></div>
      <div class="grid grid-3">
        <div class="panel"><span class="badge">Free</span><h2>0 so‘m</h2><p class="listing-desc">Oyiga 10 listing, basic dashboard, pickup so‘rovi.</p><button class="ghost-btn" style="width:100%">Boshlash</button></div>
        <div class="panel" style="border:2px solid var(--green)"><span class="badge green">Pro</span><h2>199 000 so‘m/oy</h2><p class="listing-desc">Unlimited listing, scheduled pickup, EcoScore, analytics, priority support.</p><button class="primary-btn" style="width:100%">Pro tanlash</button></div>
        <div class="panel"><span class="badge purple">Business</span><h2>599 000 so‘m/oy</h2><p class="listing-desc">Ko‘p filial, employee account, bulk trade, advanced reports, escrow.</p><button class="ghost-btn" style="width:100%">Business tanlash</button></div>
      </div>
    </div>
  </section>`;
}

function renderImpact(){
  return `
  <section class="section">
    <div class="container">
      <div class="impact-hero">
        <span class="kicker">📈 Impact Dashboard</span>
        <h2 style="font-size:clamp(2.4rem,5vw,4.6rem);letter-spacing:-.06em;margin:18px 0 8px">Har bir saqlangan resurs — iqtisodiy va ekologik qiymat.</h2>
        <p style="color:#526251;max-width:800px;line-height:1.7">Quyidagi raqamlar platforma uchun namunaviy ko‘rsatkichlar.</p>
        <div class="impact-grid">
          <div class="impact-card"><strong>2 140 kg</strong><span>chiqindi qayta aylanishga yuborildi</span></div>
          <div class="impact-card"><strong>1 860</strong><span>porsiya ovqat isrofdan saqlandi</span></div>
          <div class="impact-card"><strong>2.4 mln so‘m</strong><span>qayta yaratilgan qiymat</span></div>
          <div class="impact-card"><strong>286</strong><span>collector va earn profili</span></div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderMap(){
  return `
  <section class="section">
    <div class="container">
      <div class="section-head"><div><span class="kicker">🗺️ ISROF Map</span><h2>Yaqin imkoniyatlarni xaritada ko‘ring.</h2><p>Food deal, recycling point, o‘tin e’loni, donation va Collector vazifalari.</p></div></div>
      <div class="map-demo">
        <div class="pin" style="left:18%;top:24%">🍱</div>
        <div class="pin" style="left:56%;top:18%">♻️</div>
        <div class="pin" style="left:72%;top:48%">🪵</div>
        <div class="pin" style="left:36%;top:58%">🛵</div>
        <div class="pin" style="left:62%;top:72%">🏭</div>
        <div class="map-card">
          <span class="badge wood">3.2 km</span>
          <h3>380 kg bog‘ o‘tini</h3>
          <p class="listing-desc">Namangan • 240 000 so‘m • Pickup kerak</p>
          <button class="primary-btn" onclick="state.category='wood';location.hash='marketplace'">E’lonni ko‘rish</button>
        </div>
      </div>
    </div>
  </section>`;
}

function renderPrices(){
  return `
  <section class="section">
    <div class="container">
      <div class="section-head"><div><span class="kicker">💰 Material Prices</span><h2>Material va o‘tin narxlari</h2><p>Narxlar hamkorlar tomonidan yangilanadigan model sifatida ko‘rsatilgan.</p></div></div>
      <div class="price-table">${DATA.materialPrices.map(p=>`<div class="price-card"><div style="font-size:1.7rem">${p.icon}</div><div class="material">${p.name}</div><strong>${p.price}</strong><div class="delta ${p.dir}">${p.delta}</div></div>`).join("")}</div>
    </div>
  </section>`;
}

function render(){
  updateWalletMini();
  document.querySelectorAll("[data-route]").forEach(a=>a.classList.toggle("active", a.dataset.route===state.route));
  switch(state.route){
    case "marketplace": app.innerHTML = renderMarketplace(); bindMarketplace(); break;
    case "platform": app.innerHTML = renderPlatform(); break;
    case "collector": app.innerHTML = renderCollector(); break;
    case "earn": app.innerHTML = renderEarn(); break;
    case "business": app.innerHTML = renderBusiness(); break;
    case "impact": app.innerHTML = renderImpact(); break;
    case "map": app.innerHTML = renderMap(); break;
    case "prices": app.innerHTML = renderPrices(); break;
    default: app.innerHTML = renderHome();
  }
  window.scrollTo({top:0,behavior:"smooth"});
}

function bindMarketplace(){
  const input = document.getElementById("searchInput");
  if(input){
    input.addEventListener("input", e=>{
      state.query=e.target.value;
      clearTimeout(window.__sq);
      window.__sq=setTimeout(render,180);
    });
  }
}
window.setCategory = (id)=>{ state.category=id; render(); };

window.viewListing = (id)=>{
  const x = DATA.listings.find(i=>i.id===id);
  openModal(`
    <span class="badge ${x.badgeType}">${x.badge}</span>
    <div style="font-size:4rem;margin:18px 0">${x.icon}</div>
    <h2 style="font-size:2rem;letter-spacing:-.04em;margin:0 0 8px">${x.title}</h2>
    <p style="color:var(--muted);line-height:1.7">${x.desc}</p>
    <div class="grid grid-3" style="margin:20px 0">
      <div class="panel"><small>Sotuvchi</small><strong style="display:block;margin-top:6px">${x.business}</strong></div>
      <div class="panel"><small>Hudud</small><strong style="display:block;margin-top:6px">${x.location}</strong></div>
      <div class="panel"><small>Narx</small><strong style="display:block;margin-top:6px">${money(x.price)}</strong></div>
    </div>
    <div class="demo-note">E’lon tafsilotlari. Tasdiqlangan foydalanuvchilar va xavfsizlik qoidalari platforma orqali boshqariladi.</div>
    <div style="height:18px"></div>
    <button class="primary-btn" style="width:100%" onclick="reserveListing(${x.id});closeModal()">${x.price===0?"So‘rov yuborish":"Bron qilish"}</button>
  `);
};

window.reserveListing = (id)=>{
  const x = DATA.listings.find(i=>i.id===id);
  showToast(x.price===0 ? "So‘rov yuborildi ✓" : "Bron yaratildi ✓");
};

window.acceptTask = (id)=>{
  if(state.acceptedTasks.includes(id)) return;
  const t = DATA.tasks.find(t=>t.id===id);
  state.acceptedTasks.push(id);
  localStorage.setItem("isrofTasks", JSON.stringify(state.acceptedTasks));
  showToast(`Vazifa qabul qilindi: ${money(t.pay)}`);
  render();
};

window.completeTask = (id)=>{
  if(state.completedTasks.includes(id)) return;
  const t = DATA.tasks.find(t=>t.id===id);
  state.completedTasks.push(id);
  localStorage.setItem("isrofCompletedTasks", JSON.stringify(state.completedTasks));
  setWallet(state.wallet + t.pay);
  state.ecoPoints += 30;
  localStorage.setItem("isrofPoints", String(state.ecoPoints));
  showToast(`${money(t.pay)} hamyonga tushdi ✓`);
  render();
};

window.toggleFavourite = (id)=>{
  const i = state.favourites.indexOf(id);
  if(i >= 0) state.favourites.splice(i,1); else state.favourites.push(id);
  localStorage.setItem("isrofFavs", JSON.stringify(state.favourites));
  showToast(i >= 0 ? "Sevimlilardan olib tashlandi" : "Sevimlilarga qo‘shildi ♥");
  render();
};

window.openWasteReport = ()=>{
  openModal(`<h2>Noqonuniy chiqindi joyini bildirish</h2>
  <p class="listing-desc">Chiqindi joyi haqida ma’lumot yuboring.</p>
  <div class="form-grid">
    <div class="field"><label>Hudud</label><input placeholder="Masalan: Toshkent, Chilonzor"></div>
    <div class="field"><label>Chiqindi turi</label><select><option>Maishiy</option><option>Qurilish</option><option>Elektronika</option><option>Aralash</option></select></div>
    <div class="field full"><label>Izoh</label><textarea placeholder="Joy haqida qisqa izoh..."></textarea></div>
    <div class="field full"><label>Foto</label><input type="file" accept="image/*"></div>
    <div class="field full"><button class="primary-btn" onclick="closeModal();showToast('Report yuborildi ✓')">Report yuborish</button></div>
  </div>`);
};

window.openListingForm = ()=>{
  openModal(`
    <h2>E’lon berish</h2>
    <p class="listing-desc">E’lon ma’lumotlarini kiriting.</p>
    <form id="listingForm" class="form-grid">
      <div class="field"><label>Bo‘lim</label><select><option>Food Rescue</option><option>Recycle</option><option>O‘tin & Bog‘ yog‘ochi</option><option>Donate</option><option>WasteTrade</option><option>Reuse</option></select></div>
      <div class="field"><label>Hudud</label><input placeholder="Masalan: Toshkent, Chilonzor"></div>
      <div class="field full"><label>Sarlavha</label><input placeholder="Masalan: Quruq o‘tin — 400 kg"></div>
      <div class="field"><label>Narx</label><input type="number" placeholder="250000"></div>
      <div class="field"><label>Miqdor</label><input placeholder="400 kg / 1 m³ / 20 bog‘lam"></div>
      <div class="field full"><label>Izoh</label><textarea placeholder="Mahsulot yoki material haqida..."></textarea></div>
      <div class="field full"><button class="primary-btn" type="submit">E’lonni joylash</button></div>
    </form>`);
  document.getElementById("listingForm").addEventListener("submit",e=>{e.preventDefault();closeModal();showToast("E’lon yaratildi ✓");});
};

window.openCollectorJoin = ()=>{
  openModal(`<h2>Collector sifatida qo‘shilish</h2><p class="listing-desc">Shaxsni tasdiqlash, hudud va transport turini tanlash.</p>
  <div class="form-grid">
    <div class="field"><label>Ism</label><input placeholder="Ismingiz"></div>
    <div class="field"><label>Telefon</label><input placeholder="+998 90 123 45 67"></div>
    <div class="field"><label>Hudud</label><select><option>Toshkent</option><option>Samarqand</option><option>Namangan</option></select></div>
    <div class="field"><label>Transport</label><select><option>Piyoda</option><option>Velosiped</option><option>Skuter</option><option>Avtomobil</option></select></div>
    <div class="field full"><button class="primary-btn" onclick="closeModal();showToast('Collector profili yaratildi ✓')">Davom etish</button></div>
  </div>`);
};

window.openBusinessForm = ()=>{
  openModal(`<h2>Business so‘rovi</h2><p class="listing-desc">Biznes profilingizni yaratish uchun ma’lumotlarni kiriting.</p>
  <div class="form-grid">
    <div class="field"><label>Kompaniya</label><input placeholder="Kompaniya nomi"></div>
    <div class="field"><label>Yo‘nalish</label><select><option>Restoran</option><option>Supermarket</option><option>Ishlab chiqarish</option><option>Recycler</option><option>Ofis</option></select></div>
    <div class="field full"><label>Asosiy ehtiyoj</label><textarea placeholder="Food Rescue, recycling pickup, WasteTrade..."></textarea></div>
    <div class="field full"><button class="primary-btn" onclick="closeModal();showToast('Business so‘rovi qabul qilindi ✓')">So‘rov yuborish</button></div>
  </div>`);
};

document.getElementById("addListingBtn").addEventListener("click", openListingForm);
document.getElementById("walletBtn").addEventListener("click", ()=>{
  openModal(`<div class="wallet-card"><small>ISROF Wallet</small><div class="wallet-balance">${money(state.wallet)}</div><div class="wallet-actions"><button class="primary-btn">Kartaga chiqarish</button><button class="primary-btn">Tarix</button></div></div>
  <div style="height:18px"></div><div class="panel"><h3>EcoPoints</h3><strong style="font-size:2rem">${state.ecoPoints}</strong><p class="listing-desc">Food Rescue, recycle, donate va Collector vazifalari orqali yig‘iladi.</p></div>`);
});
window.closeModal = closeModal;

// On load we intentionally keep the premium welcome screen visible.
// The user enters the platform via "Boshlash".
