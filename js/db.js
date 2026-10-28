// المصدر الوحيد لبيانات الأنمي. تُحمَّل مرة واحدة من data/anime.json
export const animeDB = [];

export async function loadDB() {
    const res = await fetch('data/anime.json');
    if (!res.ok) throw new Error('تعذر تحميل البيانات');
    animeDB.push(...await res.json());
}
export const findAnime = id => animeDB.find(a => a.id === id);
