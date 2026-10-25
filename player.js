let activeAnime = null;
let activeEp = 1;
let activeMode = 'sub';

function openPlayer(id, epNum = 1) {
    activeAnime = animeDB.find(a => a.id === id);
    if(!activeAnime) return;
    activeEp = epNum;
    
    document.getElementById('playerTitle').innerText = `${activeAnime.title} - الحلقة ${activeEp}`;
    document.getElementById('animeIframe').src = `https://ani.megaplay.su/ani/${activeAnime.aniId}/${activeEp}/${activeMode}`;
    document.getElementById('playerModal').classList.remove('hidden');
    document.getElementById('playerModal').classList.add('flex');
    document.body.style.overflow = 'hidden';

    const epList = document.getElementById('episodeList');
    epList.innerHTML = '';
    for(let i = 1; i <= activeAnime.ep; i++) {
        const isSelected = i === activeEp;
        epList.innerHTML += `
            <div onclick="openPlayer(${id}, ${i})" class="p-2.5 rounded-xl bg-dark/60 hover:bg-gold/20 cursor-pointer text-xs flex justify-between items-center transition ${isSelected ? 'border border-gold/50 text-gold font-bold bg-gold/10' : 'text-gray-300'}">
                <span>الحلقة ${i}</span>
                <i class="fa-solid fa-play text-[10px]"></i>
            </div>
        `;
    }
}

function closePlayer() {
    document.getElementById('playerModal').classList.remove('flex');
    document.getElementById('playerModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('animeIframe').src = '';
}

function playRandomAnime() {
    const rand = animeDB[Math.floor(Math.random() * animeDB.length)];
    openPlayer(rand.id, 1);
}
