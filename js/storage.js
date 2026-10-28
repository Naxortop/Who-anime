function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export const state = {
    favorites: load('who_favs', []),
    history: load('who_history', []),
    progress: load('who_progress', {}),
    sound: localStorage.getItem('who_sound') !== 'false'
};

export function toggleFav(id) {
    const i = state.favorites.indexOf(id);
    if (i > -1) state.favorites.splice(i, 1); else state.favorites.push(id);
    save('who_favs', state.favorites);
    return i === -1; // true = أضيفت
}
export function addHistory(id) {
    state.history = [id, ...state.history.filter(x => x !== id)].slice(0, 50);
    save('who_history', state.history);
}
export function saveProgress(id, season, ep) {
    state.progress[id] = { season, ep };
    save('who_progress', state.progress);
}
export function setSound(on) {
    state.sound = on;
    localStorage.setItem('who_sound', on);
}
export function clearAll() {
    ['who_favs', 'who_history', 'who_progress'].forEach(k => localStorage.removeItem(k));
    state.favorites = []; state.history = []; state.progress = {};
}
