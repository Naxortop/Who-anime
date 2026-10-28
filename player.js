let currentAnime = null, currentSeasonIdx = 0, currentEp = 1;

function openPlayer(animeId, seasonIdx = 0, epNum = 1) {
    currentAnime = animeDB.find(a => a.id === animeId);
    if (!currentAnime) return;
    currentSeasonIdx = seasonIdx;
    const modal = document.getElementById('playerModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    buildEpisodeList();
    loadEpisode(epNum);
    addHistory(animeId);
}

function buildEpisodeList() {
    const s = currentAnime.seasons[currentSeasonIdx];
    let html = '';
    for (let i = 1; i <= s.eps; i++) {
        html += `<div data-ep="${i}" onclick="playSound(); loadEpisode(${i})" class="ep-item p-2 rounded-xl cursor-pointer text-xs flex justify-between items-center transition text-gray-300 hover:bg-gold/20"><span>الحلقة ${i}</span><i class="fa-solid fa-play text-[10px]"></i></div>`;
    }
    document.getElementById('episodeList').innerHTML = html;
}

function loadEpisode(ep) {
    const s = currentAnime.seasons[currentSeasonIdx];
    if (ep < 1 || ep > s.eps) return;
    currentEp = ep;
    document.getElementById('playerTitle').innerText = `${currentAnime.title} - ${s.name} (الحلقة ${ep})`;
    document.getElementById('animeIframe').src = `https://ani.megaplay.su/ani/${s.aniId}/${ep}/sub`;
    document.getElementById('currentEpLabel').innerText = `الحلقة ${ep}`;
    document.querySelectorAll('#episodeList .ep-item').forEach(el => {
        const active = +el.dataset.ep === ep;
        el.classList.toggle('active-ep', active);
        if (active) el.scrollIntoView({ block: 'nearest' });
    });
    document.getElementById('prevEpBtn').disabled = ep <= 1;
    document.getElementById('nextEpBtn').disabled = ep >= s.eps;
    saveProgress(currentAnime.id, currentSeasonIdx, ep);
}

function nextEpisode() { loadEpisode(currentEp + 1); }
function prevEpisode() { loadEpisode(currentEp - 1); }

function closePlayer() {
    const modal = document.getElementById('playerModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('animeIframe').src = '';
    if (document.getElementById('sec-history').classList.contains('active')) renderHistory();
}

function playRandomAnime() {
    const a = animeDB[Math.floor(Math.random() * animeDB.length)];
    openPlayer(a.id, 0, 1);
    showToast(`تشغيل عشوائي: ${a.title}`, 'fa-dice');
}
