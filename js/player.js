import { findAnime } from './db.js';
import { addHistory, saveProgress } from './storage.js';
import { $, toggleModal, showToast } from './ui.js';
import { animeDB } from './db.js';

let anime = null, seasonIdx = 0, ep = 1;

export function openPlayer(animeId, season = 0, epNum = 1) {
    anime = findAnime(animeId);
    if (!anime) return;
    seasonIdx = season;
    toggleModal('playerModal', true);
    document.body.style.overflow = 'hidden';
    buildEpisodeList();
    loadEpisode(epNum);
    addHistory(animeId);
}

function buildEpisodeList() {
    const s = anime.seasons[seasonIdx];
    let html = '';
    for (let i = 1; i <= s.eps; i++) {
        html += `<div data-action="load-ep" data-ep="${i}" class="ep-item p-2 rounded-xl cursor-pointer text-xs flex justify-between items-center transition text-gray-300 hover:bg-gold/20"><span>الحلقة ${i}</span><i class="fa-solid fa-play text-[10px]"></i></div>`;
    }
    $('episodeList').innerHTML = html;
}

export function loadEpisode(n) {
    const s = anime.seasons[seasonIdx];
    if (n < 1 || n > s.eps) return;
    ep = n;
    $('playerTitle').innerText = `${anime.title} - ${s.name} (الحلقة ${n})`;
    $('animeIframe').src = `https://ani.megaplay.su/ani/${s.aniId}/${n}/sub`;
    $('currentEpLabel').innerText = `الحلقة ${n}`;
    document.querySelectorAll('#episodeList .ep-item').forEach(el => {
        const on = +el.dataset.ep === n;
        el.classList.toggle('active-ep', on);
        if (on) el.scrollIntoView({ block: 'nearest' });
    });
    $('prevEpBtn').disabled = n <= 1;
    $('nextEpBtn').disabled = n >= s.eps;
    saveProgress(anime.id, seasonIdx, n);
}

export const nextEpisode = () => loadEpisode(ep + 1);
export const prevEpisode = () => loadEpisode(ep - 1);

export function closePlayer() {
    toggleModal('playerModal', false);
    document.body.style.overflow = 'auto';
    $('animeIframe').src = '';
}

export function playRandom() {
    const a = animeDB[Math.floor(Math.random() * animeDB.length)];
    openPlayer(a.id, 0, 1);
    showToast(`تشغيل عشوائي: ${a.title}`, 'fa-dice');
}
