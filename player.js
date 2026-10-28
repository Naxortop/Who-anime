let currentAnime = null;
let currentSeason = null;
let currentEp = 1;

function openPlayer(animeId, seasonIdx = 0, epNum = 1) {
    currentAnime = animeDB.find(a => a.id === animeId);
    if(!currentAnime) return;
    currentSeason = currentAnime.seasons[seasonIdx];
    currentEp = epNum;

    document.getElementById('playerTitle').innerText = `${currentAnime.title} - ${currentSeason.name} (الحلقة ${currentEp})`;
    document.getElementById('animeIframe').src = `https://ani.megaplay.su/ani/${currentSeason.aniId}/${currentEp}/sub`;
    
    document.getElementById('playerModal').classList.remove('hidden');
    document.getElementById('playerModal').classList.add('flex');
    document.body.style.overflow = 'hidden';

    let history = JSON.parse(localStorage.getItem('who_history')) || [];
    if(!history.includes(animeId)) {
        history.unshift(animeId);
        localStorage.setItem('who_history', JSON.stringify(history));
    }

    const epList = document.getElementById('episodeList');
    epList.innerHTML = '';
    for(let i = 1; i <= currentSeason.eps; i++) {
        epList.innerHTML += `
            <div onclick="playSound(); openPlayer(${animeId}, ${seasonIdx}, ${i})" class="p-2 rounded-xl bg-dark/60 hover:bg-gold/20 cursor-pointer text-xs flex justify-between items-center transition ${i === currentEp ? 'bg-gold/20 text-gold font-bold border border-gold/40' : 'text-gray-300'}">
                <span>الحلقة ${i}</span>
                <i class="fa-solid fa-play text-[10px]"></i>
            </div>
        `;
    }
    document.getElementById('currentEpLabel').innerText = `الحلقة ${currentEp}`;
}

function closePlayer() {
    document.getElementById('playerModal').classList.remove('flex');
    document.getElementById('playerModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('animeIframe').src = '';
}

function playRandomAnime() {
    const randAnime = animeDB[Math.floor(Math.random() * animeDB.length)];
    openPlayer(randAnime.id, 0, 1);
    showToast(`تشغيل عشوائي: ${randAnime.title}`, 'fa-dice');
}
