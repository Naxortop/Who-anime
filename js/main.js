import { animeDB, findAnime, loadDB } from './db.js';
import { state, toggleFav, setSound, clearAll } from './storage.js';
import { $, playSound, showToast, toggleModal, setActiveBtn, escapeHTML } from './ui.js';
import { renderCards, renderSchedule, renderFavorites, renderHistory, renderScheduleModal } from './render.js';
import { renderHome, setGenre, setSort, runSearch } from './search.js';
import { openPlayer, loadEpisode, nextEpisode, prevEpisode, closePlayer, playRandom } from './player.js';

let currentDay = 'الأحد';

function nav(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    $('sec-' + page).classList.add('active');
    ['home', 'latest', 'search', 'favorites', 'history'].forEach(p => {
        [['nav-', 'text-gray-300'], ['mob-', 'text-gray-400']].forEach(([pre, off]) => {
            const el = $(pre + p);
            if (!el) return;
            el.classList.toggle('text-gold', p === page);
            el.classList.toggle(off, p !== page);
        });
    });
    if (page === 'latest') renderSchedule(currentDay);
    if (page === 'favorites') renderFavorites();
    if (page === 'history') renderHistory();
    if (page === 'search') { runSearch(true); setTimeout(() => $('dedicatedSearchInput').focus(), 100); }
    window.scrollTo(0, 0);
}

function openDetails(id) {
    const a = findAnime(id);
    if (!a) return;
    $('detImg').src = a.img;
    $('detImg').alt = a.title;
    $('detTitle').innerText = a.title;
    $('detRating').innerHTML = `<i class="fa-solid fa-star text-gold ml-1"></i> ${a.rating}`;
    $('detGenre').innerText = a.genre;
    $('detDesc').innerText = a.desc;
    const p = state.progress[id];
    let html = '';
    if (p && a.seasons[p.season]) {
        html += `<button data-action="play" data-id="${id}" data-season="${p.season}" data-ep="${p.ep}" class="w-full bg-white/10 border border-gold/50 text-gold px-4 py-2 rounded-xl text-xs font-bold hover:bg-gold/20 transition"><i class="fa-solid fa-forward ml-1"></i> أكمل المشاهدة: ${escapeHTML(a.seasons[p.season].name)} - الحلقة ${p.ep}</button>`;
    }
    html += a.seasons.map((s, i) => `<button data-action="play" data-id="${id}" data-season="${i}" data-ep="1" class="gold-bg text-black px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition shadow"><i class="fa-solid fa-play ml-1"></i> ${escapeHTML(s.name)} (${s.eps} حلقة)</button>`).join('');
    $('seasonsContainer').innerHTML = html;
    toggleModal('detailsModal', true);
}

function refreshGrids() {
    renderHome();
    renderSchedule(currentDay);
    if ($('sec-search').classList.contains('active')) runSearch(true);
    if ($('sec-favorites').classList.contains('active')) renderFavorites();
    $('favCount').innerText = state.favorites.length;
}

function updateSoundBtn() {
    const b = $('soundToggleBtn');
    b.innerText = state.sound ? 'مفعلة' : 'معطلة';
    b.className = state.sound ? 'bg-gold text-black font-bold px-3 py-1.5 rounded-xl' : 'bg-gray-700 text-white font-bold px-3 py-1.5 rounded-xl';
}

const closeAll = () => ['detailsModal', 'settingsModal', 'scheduleModal'].forEach(m => toggleModal(m, false));
const num = v => parseInt(v, 10);

const actions = {
    'nav': el => nav(el.dataset.arg),
    'random': () => playRandom(),
    'open-details': el => openDetails(num(el.dataset.id)),
    'close-details': () => toggleModal('detailsModal', false),
    'open-schedule': () => toggleModal('scheduleModal', true),
    'close-schedule': () => toggleModal('scheduleModal', false),
    'open-settings': () => toggleModal('settingsModal', true),
    'close-settings': () => toggleModal('settingsModal', false),
    'play': el => { toggleModal('detailsModal', false); openPlayer(num(el.dataset.id), num(el.dataset.season), num(el.dataset.ep)); },
    'load-ep': el => loadEpisode(num(el.dataset.ep)),
    'next-ep': () => nextEpisode(),
    'prev-ep': () => prevEpisode(),
    'close-player': () => { closePlayer(); if ($('sec-history').classList.contains('active')) renderHistory(); },
    'filter-genre': el => { setActiveBtn('.genre-btn', el); $('sortSelect').value = 'default'; setSort('default'); setGenre(el.dataset.arg); },
    'filter-schedule': el => { currentDay = el.dataset.arg; setActiveBtn('.schedule-btn', el); renderSchedule(currentDay); },
    'toggle-fav': el => {
        const added = toggleFav(num(el.dataset.id));
        showToast(added ? 'تمت الإضافة للمفضلة' : 'تمت الإزالة من المفضلة', added ? 'fa-heart' : 'fa-heart-crack');
        refreshGrids();
    },
    'toggle-sound': () => { setSound(!state.sound); updateSoundBtn(); },
    'clear-data': () => {
        if (!confirm('هل أنت متأكد من مسح المفضلة والسجل والتقدم؟')) return;
        clearAll(); refreshGrids(); renderHistory(); toggleModal('settingsModal', false);
        showToast('تم مسح البيانات', 'fa-trash');
    }
};

document.addEventListener('click', e => {
    const overlay = e.target.dataset?.overlay;
    if (overlay) { actions[overlay]?.(e.target); return; }
    const el = e.target.closest('[data-action]');
    if (!el) return;
    if (el.dataset.action !== 'toggle-sound') playSound();
    actions[el.dataset.action]?.(el);
    if (el.dataset.action === 'toggle-sound') playSound();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePlayer(); closeAll(); }
});

async function init() {
    try {
        await loadDB();
    } catch (err) {
        document.getElementById('grid-home').innerHTML = '<div class="col-span-full text-center text-red-400 py-12">تعذر تحميل البيانات. شغّل الموقع عبر خادم (GitHub Pages أو Live Server).</div>';
        return;
    }
    $('totalCount').innerText = animeDB.length;
    $('favCount').innerText = state.favorites.length;
    $('sortSelect').addEventListener('change', e => { playSound(); setSort(e.target.value); });
    $('dedicatedSearchInput').addEventListener('input', () => runSearch());
    renderHome();
    renderSchedule(currentDay);
    renderCards('grid-search', animeDB);
    renderScheduleModal();
    updateSoundBtn();
}
init();
