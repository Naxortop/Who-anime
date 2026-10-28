// ==========================================================
// WHO ANIME - APP LOGIC & INTERACTION MODULE 2026
// ==========================================================
let favorites = JSON.parse(localStorage.getItem('who_favs')) || [];
let historyList = JSON.parse(localStorage.getItem('who_history')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('totalCount')) {
        document.getElementById('totalCount').innerText = animeDB.length;
        document.getElementById('countAll').innerText = animeDB.length;
    }
    if(document.getElementById('favCount')) {
        document.getElementById('favCount').innerText = favorites.length;
    }
    renderCards('grid-home', animeDB);
    renderCards('grid-latest', animeDB);
});

function nav(pageId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const targetSec = document.getElementById('sec-' + pageId);
    if(targetSec) targetSec.classList.add('active');

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
    if(data.length === 0) { 
        container.innerHTML = `<div class="col-span-full text-center text-gray-500 py-12">لا توجد نتائج مطابقة.</div>`; 
        return; 
    }
    container.innerHTML = data.slice(0, 60).map(a => {
        const isFav = favorites.includes(a.id);
        return `
            <div class="glass-card rounded-2xl overflow-hidden card-hover cursor-pointer group relative shadow-lg">
                <div class="absolute top-2 left-2 z-20">
                    <button onclick="event.stopPropagation(); toggleFavorite(${a.id})" class="w-7 h-7 rounded-full bg-black/75 flex items-center justify-center text-gold border border-gold/30 hover:scale-110 transition shadow text-xs">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="relative overflow-hidden aspect-[3/4]" onclick="openDetails(${a.id})">
                    <img src="${a.img}" alt="${a.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy">
                    <div class="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded-lg text-gold text-[10px] font-bold border border-gold/30">
                        <i class="fa-solid fa-star ml-1"></i>${a.rating}
                    </div>
                </div>
                <div class="p-3 relative z-10 -mt-8" onclick="openDetails(${a.id})">
                    <h4 class="font-bold text-xs mb-1 truncate text-white group-hover:text-gold transition">${a.title}</h4>
                    <div class="flex justify-between text-[10px] text-gray-400">
                        <span>${a.ep} حلقة</span>
                        <span class="text-gold font-bold">1080p HD</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterGenre(genre, btn) {
    document.querySelectorAll('.genre-btn').forEach(b => {
        b.classList.remove('bg-gold', 'text-black', 'shadow-md');
        b.classList.add('glass-card', 'text-gray-300');
    });
    btn.classList.add('bg-gold', 'text-black', 'shadow-md');
    btn.classList.remove('glass-card', 'text-gray-300');
    let filtered = genre === 'الكل' ? animeDB : animeDB.filter(a => a.genre === genre);
    renderCards('grid-home', filtered);
}

function sortAnime() {
    const sortBy = document.getElementById('sortSelect').value;
    let sorted = [...animeDB];
    if(sortBy === 'rating') sorted.sort((a,b) => b.rating - a.rating);
    if(sortBy === 'episodes') sorted.sort((a,b) => b.ep - a.ep);
    renderCards('grid-home', sorted);
}

function searchAnime() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = animeDB.filter(a => a.title.toLowerCase().includes(query) || a.desc.toLowerCase().includes(query));
    renderCards('grid-home', filtered);
}

function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if(index > -1) { 
        favorites.splice(index, 1); 
        showToast('تمت الإزالة من المفضلة', 'fa-heart-crack'); 
    } else { 
        favorites.push(id); 
        showToast('تمت الإضافة للمفضلة بنجاح', 'fa-heart'); 
    }
    localStorage.setItem('who_favs', JSON.stringify(favorites));
    if(document.getElementById('favCount')) {
        document.getElementById('favCount').innerText = favorites.length;
    }
    renderCards('grid-home', animeDB);
    if(document.getElementById('sec-favorites').classList.contains('active')) renderFavorites();
}

function renderFavorites() { renderCards('grid-favorites', animeDB.filter(a => favorites.includes(a.id))); }
function renderHistory() { renderCards('grid-history', animeDB.filter(a => historyList.includes(a.id))); }

const detailsModal = document.getElementById('detailsModal');
function openDetails(id) {
    const anime = animeDB.find(a => a.id === id);
    if(!anime) return;
    document.getElementById('detImg').src = anime.img;
    document.getElementById('detTitle').innerText = anime.title;
    document.getElementById('detRating').innerHTML = `<i class="fa-solid fa-star text-gold ml-1"></i> ${anime.rating}`;
    document.getElementById('detEp').innerText = `${anime.ep} حلقة`;
    document.getElementById('detGenre').innerText = anime.genre;
    document.getElementById('detDesc').innerText = anime.desc;
    document.getElementById('detPlayBtn').setAttribute('onclick', `closeDetails(); openPlayer(${id}, 1)`);
    detailsModal.classList.remove('hidden'); 
    detailsModal.classList.add('flex');
}
function closeDetails() { 
    detailsModal.classList.remove('flex'); 
    detailsModal.classList.add('hidden'); 
}

const requestModal = document.getElementById('requestModal');
function openRequestModal() { requestModal.classList.remove('hidden'); requestModal.classList.add('flex'); }
function closeRequestModal() { requestModal.classList.remove('flex'); requestModal.classList.add('hidden'); }
function submitAnimeRequest() {
    const val = document.getElementById('reqAnimeInput').value.trim();
    if(!val) { showToast('الرجاء كتابة اسم الأنمي أولاً', 'fa-triangle-exclamation'); return; }
    closeRequestModal();
    document.getElementById('reqAnimeInput').value = '';
    showToast('تم إرسال طلب الأنمي بنجاح!', 'fa-paper-plane');
}

function showToast(msg, icon = 'fa-circle-check') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    document.getElementById('toastIcon').className = `fa-solid ${icon}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    if (body.classList.contains('dark')) {
        body.classList.remove('dark'); 
        body.classList.add('light', 'bg-gray-50', 'text-gray-900');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        body.classList.remove('light', 'bg-gray-50', 'text-gray-900'); 
        body.classList.add('dark', 'bg-dark', 'text-gray-100');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}
