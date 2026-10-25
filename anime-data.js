const baseAnime = [
    { id: 1, title: "Attack on Titan", aniId: 16498, genre: "أكشن", rating: 9.9, ep: 25, img: "https://cdn.myanimelist.net/images/anime/10/47347.jpg", desc: "صراع البشرية الأخير ضد العمالقة العملاقة وكشف أسرار العالم خلف الجدران." },
    { id: 2, title: "Solo Leveling", aniId: 151807, genre: "أكشن", rating: 9.8, ep: 12, img: "https://cdn.myanimelist.net/images/anime/1543/139020.jpg", desc: "قصة الصياد الأضعف سونغ جين وو الذي يكتسب قدرة فريدة للارتقاء بمستواه بلا حدود." },
    { id: 3, title: "Jujutsu Kaisen", aniId: 113415, genre: "خيال", rating: 9.7, ep: 24, img: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg", desc: "طلاب ثانوية السحر يقاتلون اللعنات الخارقة لحماية العالم من الدمار." },
    { id: 4, title: "Demon Slayer", aniId: 101922, genre: "أكشن", rating: 9.6, ep: 26, img: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg", desc: "تانجيرو ينضم لفيلق قتلة الشياطين للانتقام لعائلته وإعادة أخته لحالتها البشرية." },
    { id: 5, title: "One Piece", aniId: 21, genre: "مغامرة", rating: 9.9, ep: 1080, img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg", desc: "مغامرة لوفي وطاقمه الأسطوري للبحث عن الكنز الأعظم ونيل لقب ملك القراصنة." },
    { id: 6, title: "Chainsaw Man", aniId: 127230, genre: "دراما", rating: 9.4, ep: 12, img: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg", desc: "دينجي الذي يدمج روحه مع شيطان المنشار ليخوض معارك دموية وصاخبة." },
    { id: 7, title: "My Hero Academia", aniId: 21459, genre: "أكشن", rating: 9.2, ep: 25, img: "https://cdn.myanimelist.net/images/anime/10/78745.jpg", desc: "ميدوريا الفتى الخالي من القوى يورث قوة الأسطورة أولمايت ليصبح البطل الأعظم." },
    { id: 8, title: "Hunter x Hunter", aniId: 11061, genre: "مغامرة", rating: 9.8, ep: 148, img: "https://cdn.myanimelist.net/images/anime/1337/99013.jpg", desc: "غون فريكس ينطلق في رحلة خطيرة ليصبح صائداً محترفاً ويعثر على أبيه." },
    { id: 9, title: "Death Note", aniId: 1535, genre: "غموض", rating: 9.7, ep: 37, img: "https://cdn.myanimelist.net/images/anime/9/9453.jpg", desc: "لايت ياجامي يعثر على دفتر الموت ويحاول تطهير العالم بصفته الإله الجديد." },
    { id: 10, title: "Haikyuu!!", aniId: 20583, genre: "رياضي", rating: 9.5, ep: 25, img: "https://cdn.myanimelist.net/images/anime/7/76014.jpg", desc: "شويو هيناتا يسعى لتحقيق حلمه في الكرة الطائرة وتجاوز العقبات الصعبة." },
    { id: 11, title: "Spy x Family", aniId: 140960, genre: "مغامرة", rating: 9.5, ep: 25, img: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg", desc: "جاسوس وقاتلة ومخاطبة عقول يشكلون عائلة مزيفة لأهداف سرية كبرى." },
    { id: 12, title: "Tokyo Revengers", aniId: 124280, genre: "دراما", rating: 9.0, ep: 24, img: "https://cdn.myanimelist.net/images/anime/1830/118337.jpg", desc: "تاكيميتشي يعود بالزمن لإنقاذ حياة حبيبته عبر السيطرة على عصابات طوكيو." },
    { id: 13, title: "Bleach", aniId: 269, genre: "أكشن", rating: 9.3, ep: 366, img: "https://cdn.myanimelist.net/images/anime/3/40451.jpg", desc: "إيتشيغو كوروسو يكتسب قوى الشينيغامي لحماية العالم من الهولو والشرور." },
    { id: 14, title: "Naruto Shippuden", aniId: 1735, genre: "أكشن", rating: 9.5, ep: 500, img: "https://cdn.myanimelist.net/images/anime/5/17407.jpg", desc: "رحلة ناروتو أوزوماكي الطويلة لتحقيق حلمه بأن يصبح الهوكاجي وحماية أصدقائه." },
    { id: 15, title: "Vinland Saga", aniId: 37521, genre: "دراما", rating: 9.6, ep: 24, img: "https://cdn.myanimelist.net/images/anime/1500/103005.jpg", desc: "قصة ملحمية عن الانتقام والشرف في عصر الفايكنج وعالم قاسٍ." },
    { id: 16, title: "Fullmetal Alchemist: Brotherhood", aniId: 5114, genre: "خيال", rating: 9.9, ep: 64, img: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg", desc: "الأخوان إلريك يخوضان مغامرة كبرى لاستعادة أجسادهما بعد تجسيد بشري محرم." },
    { id: 17, title: "Steins;Gate", aniId: 9253, genre: "غموض", rating: 9.7, ep: 24, img: "https://cdn.myanimelist.net/images/anime/5/73199.jpg", desc: "مجموعة من العلماء يكتشفون طريقة لإرسال رسائل عبر الزمن لتغيير المستقبل." },
    { id: 18, title: "Code Geass", aniId: 1575, genre: "أكشن", rating: 9.3, ep: 25, img: "https://cdn.myanimelist.net/images/anime/5/50331.jpg", desc: "لولوش يستخدم قوة الجياس للإطاحة بإمبراطورية بريطانيا العظمى." },
    { id: 19, title: "Mob Psycho 100", aniId: 32182, genre: "خيال", rating: 9.4, ep: 12, img: "https://cdn.myanimelist.net/images/anime/8/80401.jpg", desc: "فتى يمتلك قدرات نفسية خارقة يحاول العيش حياة طبيعية وكبح مشاعره." },
    { id: 20, title: "Dr. Stone", aniId: 38691, genre: "مغامرة", rating: 9.1, ep: 24, img: "https://cdn.myanimelist.net/images/anime/1613/102559.jpg", desc: "سينكو العبقري يستخدم العلم لإعادة بناء الحضارة البشرية بعد تحجر البشر." }
];

const animeDB = [...baseAnime];
const extraGenres = ["أكشن", "خيال", "مغامرة", "دراما", "رياضي", "غموض", "رعب"];
for(let i = 21; i <= 2000; i++) {
    let base = baseAnime[(i - 1) % baseAnime.length];
    animeDB.push({
        id: i,
        title: `${base.title} - الموسم ${Math.floor(i / 20) + 1}`,
        aniId: base.aniId + i,
        genre: extraGenres[i % extraGenres.length],
        rating: +(Math.min(9.9, base.rating - (i % 5) * 0.1)).toFixed(1),
        ep: 12 + (i % 15),
        img: base.img,
        desc: `النسخة الموسعة والمليارية من عمل ${base.title} مع أحداث حماسية متواصلة ومغامرات جديدة كلياً.`
    });
}
