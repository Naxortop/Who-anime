function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
}
function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

let favorites = loadJSON('who_favs', []);
let historyList = loadJSON('who_history', []);
let progress = loadJSON('who_progress', {});
let soundEnabled = localStorage.getItem('who_sound') !== 'false';
let currentScheduleDay = 'الأحد';
let currentHomeList = animeDB;
let genreFilter = 'الكل';
const weekDays = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

/* ---------- صوت (AudioContext واحد) ---------- */
let audioCtx = null;
function playSound() {
    if (!soundEnabled) return;
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.04);
    } catch (e) {}
}

/* ---------- سجل وتقدم ---------- */
function addHistory(id) {
    historyList = [id, ...historyList.filter(x => x !== id)].slice(0, 50);
    saveJSON('who_history', historyList);
}
function saveProgress(animeId, seasonIdx, ep) {
    progress[animeId] = { season: seasonIdx, ep };
    saveJSON('who_progress', progress);
}

/* ---------- تشغيل ---------- */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('totalCount').innerText = animeDB.length;
    document.getElementById('favCount').innerText = favorites.length;
    renderCards('grid-home', animeDB);
    renderScheduleGrid(currentScheduleDay);
    renderCards('grid-search', animeDB);
    renderScheduleModal();
    updateSoundBtnUI();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePlayer(); closeDetails(); closeSettingsModal(); closeScheduleModal(); }
});

function nav(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + pageId).classList.add('active');
    ['home', 'latest', 'search', 'favorites', 'history'].forEach(p => {
        ['nav-', 'mob-'].forEach(pre => {
            const el = document.getElementById(pre + p);
            if (el) {
                el.classList.toggle('text-gold', p === pageId);
                el.classList.toggle('text-gray-300', p !== pageId && pre === 'nav-');
                el.classList.toggle('text-gray-400', p !== pageId && pre === 'mob-');
            }
        });
    });
    if (pageId === 'latest') renderScheduleGrid(currentScheduleDay);
    if (pageId === 'favorites') renderFavorites();
    if (pageId === 'history') renderHistory();
    if (pageId === 'search') {
        performDedicatedSearch();
        setTimeout(() => document.getElementById('dedicatedSearchInput')?.focus(), 100);
    }
    window.scrollTo(0, 0);
}

function setActiveBtn(selector, btn) {
    document.querySelectorAll(selector).forEach(b => {
        b.classList.remove('bg-gold', 'text-black', 'shadow-md');
        b.classList.add('glass-card', 'text-gray-300');
    });
    btn.classList.add('bg-gold', 'text-black', 'shadow-md');
    btn.classList.remove('glass-card', 'text-gray-300');
}

function filterSchedule(day, btn) {
    currentScheduleDay = day;
    setActiveBtn('.schedule-btn', btn);
    renderScheduleGrid(day);
}
function renderScheduleGrid(day) { renderCards('grid-latest', animeDB.filter(a => a.day === day)); }

function renderCards(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (data.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center text-gray-500 py-12">لا توجد أعمال لعرضها.</div>`;
        return;
    }
    container.innerHTML = data.map(a => {
        const isFav = favorites.includes(a.id);
        const totalEps = a.seasons.reduce((sum, s) => sum + s.eps, 0);
        return `
        <div class="anime-card group" onclick="playSound(); openDetails(${a.id})">
            <div class="relative aspect-[3/4] overflow-hidden">
                <img src="${a.img}" alt="${a.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy">
                <div class="absolute top-2 left-2 z-10">
                    <button aria-label="مفضلة" onclick="event.stopPropagation(); playSound(); toggleFavorite(${a.id})" class="w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-gold border border-gold/30">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded-lg text-gold text-[10px] font-bold">⭐ ${a.rating}</div>
            </div>
            <div class="p-3">
                <h4 class="font-bold text-xs truncate text-white group-hover:text-gold transition">${a.title}</h4>
                <span class="text-[10px] text-gray-400">${a.seasons.length} مواسم (${totalEps} حلقة)</span>
            </div>
        </div>`;
    }).join('');
}

function filterGenre(genre, btn) {
    genreFilter = genre;
    setActiveBtn('.genre-btn', btn);
    document.getElementById('sortSelect').value = 'default';
    currentHomeList = genre === 'الكل' ? animeDB : animeDB.filter(a => a.genre === genre);
    renderCards('grid-home', currentHomeList);
}

function sortAnime() {
    const by = document.getElementById('sortSelect').value;
    const base = genreFilter === 'الكل' ? animeDB : animeDB.filter(a => a.genre === genreFilter);
    currentHomeList = [...base];
    if (by === 'rating') currentHomeList.sort((a, b) => b.rating - a.rating);
    if (by === 'title') currentHomeList.sort((a, b) => a.title.localeCompare(b.title));
    renderCards('grid-home', currentHomeList);
}

function openDetails(id) {
    const anime = animeDB.find(a => a.id === id);
    if (!anime) return;
    document.getElementById('detImg').src = anime.img;
    document.getElementById('detTitle').innerText = anime.title;
    document.getElementById('detRating').innerHTML = `<i class="fa-solid fa-star text-gold ml-1"></i> ${anime.rating}`;
    document.getElementById('detGenre').innerText = anime.genre;
    document.getElementById('detDesc').innerText = anime.desc;

    const p = progress[id];
    let html = '';
    if (p && anime.seasons[p.season]) {
        html += `<button onclick="playSound(); closeDetails(); openPlayer(${id}, ${p.season}, ${p.ep})" class="w-full bg-white/10 border border-gold/50 text-gold px-4 py-2 rounded-xl text-xs font-bold hover:bg-gold/20 transition"><i class="fa-solid fa-forward ml-1"></i> أكمل المشاهدة: ${anime.seasons[p.season].name} - الحلقة ${p.ep}</button>`;
    }
    html += anime.seasons.map((s, idx) => `
        <button onclick="playSound(); closeDetails(); openPlayer(${id}, ${idx}, 1)" class="gold-bg text-black px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition shadow">
            <i class="fa-solid fa-play ml-1"></i> ${s.name} (${s.eps} حلقة)
        </button>`).join('');
    document.getElementById('seasonsContainer').innerHTML = html;

    const modal = document.getElementById('detailsModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
function closeDetails() {
    const m = document.getElementById('detailsModal');
    m.classList.remove('flex'); m.classList.add('hidden');
}

/* ---------- بحث (يتجاهل اختلاف الأ/ا والة/ه والتشكيل) ---------- */
function normalizeAr(s) {
    return s.toLowerCase()
        .replace(/[\u064B-\u065F\u0640]/g, '')
        .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
}
let searchTimer;
function performDedicatedSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const q = normalizeAr(document.getElementById('dedicatedSearchInput').value.trim());
        const res = animeDB.filter(a => normalizeAr(`${a.title} ${a.genre} ${a.desc}`).includes(q));
        renderCards('grid-search', res);
    }, 200);
}

/* ---------- مفضلة وسجل ---------- */
function toggleFavorite(id) {
    const idx = favorites.indexOf(id);
    if (idx > -1) { favorites.splice(idx, 1); showToast('تمت الإزالة من المفضلة', 'fa-heart-crack'); }
    else { favorites.push(id); showToast('تمت الإضافة للمفضلة', 'fa-heart'); }
    saveJSON('who_favs', favorites);
    document.getElementById('favCount').innerText = favorites.length;
    renderCards('grid-home', currentHomeList);
    renderScheduleGrid(currentScheduleDay);
    if (document.getElementById('sec-search').classList.contains('active')) performDedicatedSearch();
    if (document.getElementById('sec-favorites').classList.contains('active')) renderFavorites();
}
function renderFavorites() { renderCards('grid-favorites', animeDB.filter(a => favorites.includes(a.id))); }
function renderHistory() {
    const list = historyList.map(id => animeDB.find(a => a.id === id)).filter(Boolean);
    renderCards('grid-history', list);
}

/* ---------- نوافذ ---------- */
function toggleModal(id, open) {
    const m = document.getElementById(id);
    m.classList.toggle('hidden', !open);
    m.classList.toggle('flex', open);
}
function openScheduleModal() { toggleModal('scheduleModal', true); }
function closeScheduleModal() { toggleModal('scheduleModal', false); }
function openSettingsModal() { toggleModal('settingsModal', true); }
function closeSettingsModal() { toggleModal('settingsModal', false); }

function renderScheduleModal() {
    document.getElementById('scheduleList').innerHTML = weekDays.map(d => {
        const names = animeDB.filter(a => a.day === d).map(a => a.title).join('، ') || '—';
        return `<div class="bg-dark/70 p-2.5 rounded-xl border border-dark-border flex justify-between gap-3"><span class="text-gold font-bold">${d}</span><span class="text-left">${names}</span></div>`;
    }).join('');
}

function toggleSoundSetting() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('who_sound', soundEnabled);
    updateSoundBtnUI();
}
function updateSoundBtnUI() {
    const btn = document.getElementById('soundToggleBtn');
    if (!btn) return;
    btn.innerText = soundEnabled ? 'مفعلة' : 'معطلة';
    btn.className = soundEnabled ? 'bg-gold text-black font-bold px-3 py-1.5 rounded-xl' : 'bg-gray-700 text-white font-bold px-3 py-1.5 rounded-xl';
}

function clearStorageData() {
    if (!confirm('هل أنت متأكد من مسح المفضلة والسجل؟')) return;
    ['who_favs', 'who_history', 'who_progress'].forEach(k => localStorage.removeItem(k));
    favorites = []; historyList = []; progress = {};
    document.getElementById('favCount').innerText = 0;
    renderCards('grid-home', currentHomeList);
    renderFavorites(); renderHistory();
    closeSettingsModal();
    showToast('تم مسح البيانات', 'fa-trash');
}

let toastTimer;
function showToast(msg, icon = 'fa-circle-check') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    document.getElementById('toastIcon').className = `fa-solid ${icon} text-base`;
    toast.classList.remove('translate-y-20', 'opacity-0');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}
