let favorites = JSON.parse(localStorage.getItem('who_favs')) || [];
let historyList = JSON.parse(localStorage.getItem('who_history')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('favCount')) {
        document.getElementById('favCount').innerText = favorites.length;
    }
    renderCards('grid-home', animeDB);
    renderCards('grid-latest', animeDB);
});

function nav(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('sec-' + pageId);
    if(target) target.classList.add('active');

    ['home', 'latest', 'favorites', 'history'].forEach(p => {
        const el = document.getElementById('nav-' + p);
        if(el) el.classList.toggle('active', p === pageId);
    });

    if(pageId === 'favorites') renderFavorites();
    if(pageId === 'history') renderHistory();
    window.scrollTo(0, 0);
}

function renderCards(containerId, data) {
    const container = document.getElementById(containerId);
    if(!container) return;
    if(data.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #777; padding: 2rem;">لا توجد أعمال لعرضها.</div>`;
        return;
    }
    container.innerHTML = data.map(a => {
        const isFav = favorites.includes(a.id);
        return `
            <div class="anime-card" onclick="openPlayer(${a.id}, 1)">
                <div class="card-img-wrapper">
                    <img src="${a.img}" alt="${a.title}" loading="lazy">
                    <div class="card-badge">⭐ ${a.rating}</div>
                    <div style="position: absolute; bottom: 8px; left: 8px;" onclick="event.stopPropagation(); toggleFavorite(${a.id})">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart" style="color: ${isFav ? '#ef4444' : '#fff'}; font-size: 1.1rem; cursor: pointer;"></i>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-title">${a.title}</div>
                    <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 4px;">${a.ep} حلقة</div>
                </div>
            </div>
        `;
    }).join('');
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
    if(document.getElementById('sec-favorites').classList.contains('active')) renderFavorites();
}

function renderFavorites() {
    renderCards('grid-favorites', animeDB.filter(a => favorites.includes(a.id)));
}

function renderHistory() {
    renderCards('grid-history', animeDB.filter(a => historyList.includes(a.id)));
}
