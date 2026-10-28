let activeAnime = null;
let activeEp = 1;

function openPlayer(id, epNum = 1) {
    activeAnime = animeDB.find(a => a.id === id);
    if(!activeAnime) return;
    activeEp = epNum;
    
    document.getElementById('playerTitle').innerText = `${activeAnime.title} - الحلقة ${activeEp}`;
    document.getElementById('animeIframe').src = `https://ani.megaplay.su/ani/${activeAnime.aniId}/${activeEp}/sub`;
    document.getElementById('playerModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';

    let historyList = JSON.parse(localStorage.getItem('who_history')) || [];
    if(!historyList.includes(id)) {
        historyList.unshift(id);
        localStorage.setItem('who_history', JSON.stringify(historyList));
    }

    const epList = document.getElementById('episodeList');
    epList.innerHTML = '';
    for(let i = 1; i <= activeAnime.ep; i++) {
        epList.innerHTML += `
            <div onclick="openPlayer(${id}, ${i})" style="padding: 6px 10px; margin-bottom: 4px; background: #171821; border-radius: 4px; cursor: pointer; font-size: 0.8rem; display: flex; justify-content: space-between; color: ${i === activeEp ? '#ff9800' : '#fff'}">
                <span>الحلقة ${i}</span>
                <i class="fa-solid fa-play"></i>
            </div>
        `;
    }
}

function closePlayer() {
    document.getElementById('playerModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('animeIframe').src = '';
}

function playRandomAnime() {
    const rand = animeDB[Math.floor(Math.random() * animeDB.length)];
    openPlayer(rand.id, 1);
}
