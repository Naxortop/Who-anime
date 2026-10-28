import { animeDB } from './db.js';
import { $ } from './ui.js';
import { renderCards } from './render.js';

/* ---- الرئيسية: تصنيف + ترتيب ---- */
let genre = 'الكل';
let sortBy = 'default';

export function homeList() {
    const list = genre === 'الكل' ? [...animeDB] : animeDB.filter(a => a.genre === genre);
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
}
export function renderHome() { renderCards('grid-home', homeList()); }
export function setGenre(g) { genre = g; renderHome(); }
export function setSort(s) { sortBy = s; renderHome(); }

/* ---- البحث ---- */
export function normalizeAr(s) {
    return s.toLowerCase()
        .replace(/[\u064B-\u065F\u0640]/g, '')
        .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
}
let timer;
export function runSearch(immediate = false) {
    clearTimeout(timer);
    const go = () => {
        const q = normalizeAr($('dedicatedSearchInput').value.trim());
        renderCards('grid-search', animeDB.filter(a => normalizeAr(`${a.title} ${a.genre} ${a.desc}`).includes(q)));
    };
    immediate ? go() : (timer = setTimeout(go, 200));
}
