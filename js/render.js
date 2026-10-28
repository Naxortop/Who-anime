import { animeDB, findAnime } from './db.js';
import { state } from './storage.js';
import { $, escapeHTML } from './ui.js';

const weekDays = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export function renderCards(containerId, data) {
    const el = $(containerId);
    if (!el) return;
    if (!data.length) {
        el.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12">لا توجد أعمال لعرضها.</div>';
        return;
    }
    el.innerHTML = data.map(a => {
        const fav = state.favorites.includes(a.id);
        const total = a.seasons.reduce((s, x) => s + x.eps, 0);
        const title = escapeHTML(a.title);
        return `
        <div class="anime-card group" data-action="open-details" data-id="${a.id}">
            <div class="relative aspect-[3/4] overflow-hidden">
                <img src="${escapeHTML(a.img)}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" decoding="async">
                <div class="absolute top-2 left-2 z-10">
                    <button aria-label="مفضلة" data-action="toggle-fav" data-id="${a.id}" class="w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-gold border border-gold/30">
                        <i class="${fav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded-lg text-gold text-[10px] font-bold">⭐ ${a.rating}</div>
            </div>
            <div class="p-3">
                <h4 class="font-bold text-xs truncate text-white group-hover:text-gold transition">${title}</h4>
                <span class="text-[10px] text-gray-400">${a.seasons.length} مواسم (${total} حلقة)</span>
            </div>
        </div>`;
    }).join('');
}

export const renderSchedule = day => renderCards('grid-latest', animeDB.filter(a => a.day === day));
export const renderFavorites = () => renderCards('grid-favorites', animeDB.filter(a => state.favorites.includes(a.id)));
export const renderHistory = () => renderCards('grid-history', state.history.map(findAnime).filter(Boolean));

export function renderScheduleModal() {
    $('scheduleList').innerHTML = weekDays.map(d => {
        const names = animeDB.filter(a => a.day === d).map(a => escapeHTML(a.title)).join('، ') || '—';
        return `<div class="bg-dark/70 p-2.5 rounded-xl border border-dark-border flex justify-between gap-3"><span class="text-gold font-bold">${d}</span><span class="text-left">${names}</span></div>`;
    }).join('');
}
