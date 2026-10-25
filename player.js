// ==========================================================
// WHO ANIME - PLAYER MODULE 2026
// ==========================================================
let activeAnime = null;
let activeEp = 1;
let activeMode = 'sub';

const playerModal = document.getElementById('playerModal');
const iframe = document.getElementById('animeIframe');

function openPlayer(id, episodeNum = 1) {
    activeAnime = animeDB.find(a => a.id === id);
    if(!activeAnime) return;
    activeEp = episodeNum;

    let historyList = JSON.parse(localStorage.getItem('who_history')) || [];
    if(!historyList.includes(id)) {
        historyList.unshift(id);
        if(historyList.length > 15) historyList.pop();
        localStorage.setItem('who_history', JSON.stringify(historyList));
    }

    document.getElementById('playerTitle').innerText = activeAnime.title;
    loadAnimeStream(activeAnime.aniId, activeEp, activeMode);

    playerModal.classList.remove('hidden');
    playerModal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    const epList = document.getElementById('episodeList');
    epList.innerHTML = '';
    for(let i = 1; i <= activeAnime.ep; i++) {
        const isSelected = i === episodeNum;
        epList.innerHTML += `
            <div onclick="selectEpisode(this, ${i})" class="ep-item flex justify-between items-center p-2.5 rounded-xl bg-dark/50 hover:bg-gold/15 border border-transparent hover:border-gold/40 cursor-pointer transition text-xs ${isSelected ? 'bg-gold/20 border-gold/50 text-gold font-bold' : 'text-gray-300'}">
                <span>الحلقة ${i}</span>
                <i class="fa-solid fa-play text-[10px]"></i>
            </div>
        `;
    }
    document.getElementById('currentEpLabel').innerText = `الحلقة ${episodeNum}`;
}

function loadAnimeStream(aniId, ep, mode) {
    iframe.src = `https://ani.megaplay.su/ani/${aniId}/${ep}/${mode}`;
}

function selectEpisode(el, epNum) {
    document.querySelectorAll('.ep-item').forEach(item => { 
        item.classList.remove('bg-gold/20', 'border-gold/50', 'text-gold', 'font-bold'); 
        item.classList.add('text-gray-300'); 
    });
    el.classList.remove('text-gray-300'); 
    el.classList.add('bg-gold/20', 'border-gold/50', 'text-gold', 'font-bold');
    document.getElementById('currentEpLabel').innerText = `الحلقة ${epNum}`;
    activeEp = epNum;
    if(activeAnime) loadAnimeStream(activeAnime.aniId, activeEp, activeMode);
}

function changeMode(mode) {
    activeMode = mode;
    document.getElementById('btnSub').className = mode === 'sub' ? 'gold-bg text-black px-3.5 py-1.5 rounded-xl font-bold shadow' : 'glass-card text-gray-300 hover:text-gold px-3.5 py-1.5 rounded-xl font-bold';
    document.getElementById('btnDub').className = mode === 'dub' ? 'gold-bg text-black px-3.5 py-1.5 rounded-xl font-bold shadow' : 'glass-card text-gray-300 hover:text-gold px-3.5 py-1.5 rounded-xl font-bold';
    if(activeAnime) loadAnimeStream(activeAnime.aniId, activeEp, activeMode);
    showToast(mode === 'sub' ? 'تم التبديل إلى سيرفر الترجمة' : 'تم التبديل إلى سيرفر الدبلجة', 'fa-closed-captioning');
}

function closePlayer() { 
    playerModal.classList.remove('flex'); 
    playerModal.classList.add('hidden'); 
    document.body.style.overflow = 'auto'; 
    iframe.src = ''; 
}

function playRandomAnime() {
    const random = animeDB[Math.floor(Math.random() * animeDB.length)];
    openPlayer(random.id, 1);
    showToast(`تشغيل عشوائي: ${random.title}`, 'fa-dice');
}
