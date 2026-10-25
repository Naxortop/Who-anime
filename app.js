// إدارة التنقل، البحث، المفضلة، والتفاعل الكامل للموقع
let favorites = JSON.parse(localStorage.getItem('who_favs')) || [];
let historyList = JSON.parse(localStorage.getItem('who_history')) || [];

function nav(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + pageId).classList.add('active');
    ['home', 'latest', 'favorites', 'history'].forEach(p => {
        const el = document.getElementById('nav-' + p);
        const mobEl = document.getElementById('mob-' + p);
        if(el) el.classList.toggle('text-gold', p === pageId);
        if(mobEl) mobEl.classList.toggle('text-gold', p === pageId);
    });
    if(pageId === 'favorites') renderFavorites();
    if(pageId === 'history') renderHistory();
    window.scrollTo(0, 0);
}

function renderCards(containerId, data) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = data.slice(0, 40).map(a => {
        let isFav = favorites.includes(a.id);
        return `
            <div class="glass-card rounded-2xl overflow-hidden card-hover cursor-pointer relative shadow-lg" onclick="openPlayer(${a.id}, 1)">
                <div class="absolute top-2 left-2 z-20">
                    <button onclick="event.stopPropagation(); toggleFavorite(${a.id})" class="w-7 h-7 rounded-full bg-black/75 flex items-center justify-center text-gold border border-gold/30">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="aspect-[3/4] overflow-hidden"><img src="${a.img}" class="w-full h-full object-cover"></div>
                <div class="p-3"><h4 class="font-bold text-xs text-white truncate">${a.title}</h4><span class="text-[10px] text-gold">${a.ep} حلقة</span></div>
            </div>
        `;
    }).join('');
}

renderCards('grid-home', animeDB);
renderCards('grid-latest', animeDB);

function filterGenre(genre, btn) {
    document.querySelectorAll('.genre-btn').forEach(b => {
        b.classList.remove('bg-gold', 'text-black');
        b.classList.add('glass-card', 'text-gray-300');
    });
    btn.classList.add('bg-gold', 'text-black');
    btn.classList.remove('glass-card', 'text-gray-300');
    let filtered = genre === 'الكل' ? animeDB : animeDB.filter(a => a.genre === genre);
    renderCards('grid-home', filtered);
}

function searchAnime() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    renderCards('grid-home', animeDB.filter(a => a.title.toLowerCase().includes(q)));
}

function toggleFavorite(id) {
    const idx = favorites.indexOf(id);
    if(idx > -1) favorites.splice(idx, 1);
    else favorites.push(id);
    localStorage.setItem('who_favs', JSON.stringify(favorites));
    document.getElementById('favCount').innerText = favorites.length;
    renderCards('grid-home', animeDB);
}

function renderFavorites() { renderCards('grid-favorites', animeDB.filter(a => favorites.includes(a.id))); }
function renderHistory() { renderCards('grid-history', animeDB.filter(a => historyList.includes(a.id))); }

function openRequestModal() { document.getElementById('requestModal').classList.remove('hidden'); document.getElementById('requestModal').classList.add('flex'); }
function closeRequestModal() { document.getElementById('requestModal').classList.remove('flex'); document.getElementById('requestModal').classList.add('hidden'); }
function submitAnimeRequest() {
    closeRequestModal();
    showToast('تم إرسال طلب الأنمي بنجاح!');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    showToast('تم تبديل النمط بنجاح');
}
