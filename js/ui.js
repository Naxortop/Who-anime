import { state } from './storage.js';

export const $ = id => document.getElementById(id);

export function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

let audioCtx = null;
export function playSound() {
    if (!state.sound) return;
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
    } catch {}
}

let toastTimer;
export function showToast(msg, icon = 'fa-circle-check') {
    const toast = $('toast');
    $('toastMsg').innerText = msg;
    $('toastIcon').className = `fa-solid ${icon} text-base`;
    toast.classList.remove('translate-y-20', 'opacity-0');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

export function toggleModal(id, open) {
    const m = $(id);
    m.classList.toggle('hidden', !open);
    m.classList.toggle('flex', open);
}

export function setActiveBtn(selector, btn) {
    document.querySelectorAll(selector).forEach(b => {
        b.classList.remove('bg-gold', 'text-black', 'shadow-md');
        b.classList.add('glass-card', 'text-gray-300');
    });
    btn.classList.add('bg-gold', 'text-black', 'shadow-md');
    btn.classList.remove('glass-card', 'text-gray-300');
}
