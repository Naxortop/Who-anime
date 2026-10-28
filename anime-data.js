const baseAnime = [
    { id: 1, title: "Attack on Titan", aniId: 16498, genre: "أكشن", rating: 9.9, ep: 25, img: "https://cdn.myanimelist.net/images/anime/10/47347.jpg", desc: "صراع البشرية ضد العمالقة." },
    { id: 2, title: "Solo Leveling", aniId: 151807, genre: "أكشن", rating: 9.8, ep: 12, img: "https://cdn.myanimelist.net/images/anime/1543/139020.jpg", desc: "رحلة الصياد الأضعف نحو القمة." },
    { id: 3, title: "Jujutsu Kaisen", aniId: 113415, genre: "خيال", rating: 9.7, ep: 24, img: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg", desc: "صراع السحرة ضد اللعنات." },
    { id: 4, title: "Demon Slayer", aniId: 101922, genre: "أكشن", rating: 9.6, ep: 26, img: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg", desc: "رحلة تانجيرو للانتقام." },
    { id: 5, title: "One Piece", aniId: 21, genre: "مغامرة", rating: 9.9, ep: 1080, img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg", desc: "مغامرات طاقم قبعة القش." },
    { id: 6, title: "Chainsaw Man", aniId: 127230, genre: "دراما", rating: 9.4, ep: 12, img: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg", desc: "مغامرات دينجي الدموية." }
];

const animeDB = [...baseAnime];
for(let i = 7; i <= 500; i++) {
    let base = baseAnime[(i - 1) % baseAnime.length];
    animeDB.push({
        id: i,
        title: `${base.title} - الموسم ${Math.floor(i / 6) + 1}`,
        aniId: base.aniId + i,
        genre: base.genre,
        rating: base.rating,
        ep: base.ep,
        img: base.img,
        desc: base.desc
    });
}
