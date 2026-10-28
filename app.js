let favorites = JSON.parse(localStorage.getItem('who_favs')) || [];
let historyList = JSON.parse(localStorage.getItem('who_history')) || [];

// نظام المؤثرات الصوتية التفاعلية (Sound Effects)
function playSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('favCount')) document.getElementById('favCount').innerText = favorites.length;
    renderCards('grid-home', animeDB);
    renderCards('grid-latest', animeDB);
    renderCards('grid-search', animeDB);
});

function nav(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + pageId).classList.add('active');
    ['home', 'latest', 'search', 'favorites', 'history'].forEach(p => {
        const el = document.getElementById('nav-' + p);
        const mobEl = document.getElementById('mob-' + p);
        if(el) el.classList.toggle('text-gold', p === pageId);
        if(mobEl) mobEl.classList.toggle('text-gold', p === pageId);
    });
    if(pageId === 'favorites') renderFavorites();
    if(pageId === 'history') renderHistory();
    if(pageId === 'search') renderCards('grid-search', animeDB);
    window.scrollTo(0, 0);
}

function renderCards(containerId, data) {
    const container = document.getElementById(containerId);
    if(!container) return;
    if(data.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center text-gray-500 py-12">لا توجد أعمال لعرضها.</div>`;
        return;
    }
    container.innerHTML = data.map(a => {
        const isFav = favorites.includes(a.id);
        const totalEps = a.seasons.reduce((sum, s) => sum + s.eps, 0);
        return `
            <div class="anime-card group" onclick="playSound(); openDetails(${a.id})">
                <div class="relative aspect-[3/4] overflow-hidden">
                    <img src="${a.img}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy">
                    <div class="absolute top-2 left-2 z-10">
                        <button onclick="playSound(); event.stopPropagation(); toggleFavorite(${a.id})" class="w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-gold border border-gold/30">
                            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                    <div class="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded-lg text-gold text-[10px] font-bold">
                        ⭐ ${a.rating}
                    </div>
                </div>
                <div class="p-3">
                    <h4 class="font-bold text-xs truncate text-white group-hover:text-gold transition">${a.title}</h4>
                    <span class="text-[10px] text-gray-400">${a.seasons.length} مواسم (${totalEps} حلقة)</span>
                </div>
            </div>
        `;
    }).join('');
}

function openDetails(id) {
    const anime = animeDB.find(a => a.id === id);
    if(!anime) return;
    document.getElementById('detImg').src = anime.img;
    document.getElementById('detTitle').innerText = anime.title;
    document.getElementById('detRating').innerHTML = `<i class="fa-solid fa-star text-gold ml-1"></i> ${anime.rating}`;
    document.getElementById('detGenre').innerText = anime.genre;
    document.getElementById('detDesc').innerText = anime.desc;

    const seasonsContainer = document.getElementById('seasonsContainer');
    seasonsContainer.innerHTML = anime.seasons.map((s, idx) => `
        <button onclick="playSound(); closeDetails(); openPlayer(${anime.id}, ${idx}, 1)" class="gold-bg text-black px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition shadow">
            <i class="fa-solid fa-play ml-1"></i> ${s.name} (${s.eps} حلقة)
        </button>
    `).join('');

    const modal = document.getElementById('detailsModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeDetails() {
    const modal = document.getElementById('detailsModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

// التوجه التلقائي لصفحة البحث عند الكتابة في الهيدر
function handleSearchInput() {
    const q = document.getElementById('searchInput').value;
    if(q.trim().length > 0) {
        nav('search');
        document.getElementById('dedicatedSearchInput').value = q;
        performDedicatedSearch();
    }
}

function performDedicatedSearch() {
    const q = document.getElementById('dedicatedSearchInput').value.toLowerCase();
    const filtered = animeDB.filter(a => a.title.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q));
    renderCards('grid-search', filtered);
}

function toggleFavorite(id) {
    const idx = favorites.indexOf(id);
    if(idx > -1) favorites.splice(idx, 1);
    else favorites.push(id);
    localStorage.setItem('who_favs', JSON.stringify(favorites));
    document.getElementById('favCount').innerText = favorites.length;
    renderCards('grid-home', animeDB);
    if(document.getElementById('sec-favorites').classList.contains('active')) renderFavorites();
}

function renderFavorites() { renderCards('grid-favorites', animeDB.filter(a => favorites.includes(a.id))); }
function renderHistory() { renderCards('grid-history', animeDB.filter(a => historyList.includes(a.id))); }

function openScheduleModal() { document.getElementById('scheduleModal').classList.remove('hidden'); document.getElementById('scheduleModal').classList.add('flex'); }
function closeScheduleModal() { document.getElementById('scheduleModal').classList.remove('flex'); document.getElementById('scheduleModal').classList.add('hidden'); }

function openRequestModal() { document.getElementById('requestModal').classList.remove('hidden'); document.getElementById('requestModal').classList.add('flex'); }
function closeRequestModal() { document.getElementById('requestModal').classList.remove('flex'); document.getElementById('requestModal').classList.add('hidden'); }
function submitAnimeRequest() {
    closeRequestModal();
    alert('تم إرسال طلب الأنمي بنجاح!');
}
