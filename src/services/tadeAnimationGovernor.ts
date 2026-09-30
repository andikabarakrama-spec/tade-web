/**
 * TADE PUSAT ASET — ANIMATION GOVERNOR (SPRINT G13)
 * Enforces Dr. Pulse 60 FPS Guarantee.
 * Mandate: Maksimal 5 animasi aktif bersamaan.
 * Automatically de-prioritizes / pauses oldest when 6th is started.
 * Seamless Lite Mode fallback when FPS drops or low-end device detected.
 */

export interface TadeAnimationItem {
  id: string;
  name: string;
  shelf: 'KENDARAAN' | 'HEWAN' | 'ALAM' | 'MAINAN' | 'TEMA_ISLAMI' | 'BELAJAR' | 'ASY_SYIFA';
  icon: string;
  description: string;
  tags: string[];
  complexity: 'ULTRA_LIGHT' | 'LIGHT' | 'MODERATE';
  svgKey: string;
}

export const KOTAK_MAINAN_ASY_CATALOG: TadeAnimationItem[] = [
  // 1. KENDARAAN (13 Items)
  { id: 'anim-kereta', name: 'Kereta Ceria', shelf: 'KENDARAAN', icon: 'Train', description: 'Kereta uap mini berjalan menyusuri rel taman dengan kepulan asap kapas.', tags: ['Kendaraan', 'Kereta', 'Transportasi'], complexity: 'LIGHT', svgKey: 'train' },
  { id: 'anim-bus', name: 'Bus Sekolah Asy', shelf: 'KENDARAAN', icon: 'Bus', description: 'Bus sekolah kuning melaju ramah mengantar santri tersenyum.', tags: ['Bus', 'Sekolah', 'Kendaraan'], complexity: 'LIGHT', svgKey: 'bus' },
  { id: 'anim-mobil', name: 'Mobil Keluarga', shelf: 'KENDARAAN', icon: 'Car', description: 'Mobil mini berjalan halus dengan roda berputar dan lampu bersinar.', tags: ['Mobil', 'Kendaraan'], complexity: 'ULTRA_LIGHT', svgKey: 'car' },
  { id: 'anim-ambulans', name: 'Ambulans Peduli', shelf: 'KENDARAAN', icon: 'Cross', description: 'Mobil ambulans dengan sirine lampu kedip menolong sesama.', tags: ['Ambulans', 'Kesehatan', 'Peduli'], complexity: 'LIGHT', svgKey: 'ambulance' },
  { id: 'anim-pemadam', name: 'Mobil Pemadam', shelf: 'KENDARAAN', icon: 'Flame', description: 'Mobil pemadam merah tangguh dengan tangga bergerak siap siaga.', tags: ['Pemadam', 'Pahlawan', 'Kendaraan'], complexity: 'LIGHT', svgKey: 'firetruck' },
  { id: 'anim-polisi', name: 'Mobil Polisi Sahabat', shelf: 'KENDARAAN', icon: 'Shield', description: 'Mobil patroli tertib dengan lampu biru berputar damai.', tags: ['Polisi', 'Ketertiban', 'Sahabat'], complexity: 'LIGHT', svgKey: 'police' },
  { id: 'anim-traktor', name: 'Traktor Petani', shelf: 'KENDARAAN', icon: 'Tractor', description: 'Traktor hijau sentra bahan alam mengolah tanah kebun berkah.', tags: ['Traktor', 'Kebun', 'Sentra Alam'], complexity: 'LIGHT', svgKey: 'tractor' },
  { id: 'anim-kapal', name: 'Kapal Samudra', shelf: 'KENDARAAN', icon: 'Ship', description: 'Kapal uap megah mengarungi ombak biru dengan bendera berkibar.', tags: ['Kapal', 'Laut', 'Samudra'], complexity: 'LIGHT', svgKey: 'ship' },
  { id: 'anim-kapal-awan', name: 'Kapal Awan Petualangan', shelf: 'KENDARAAN', icon: 'Ship', description: 'Kapal awan empuk tersenyum ramah mengarungi samudra berkah menuju 5 pulau.', tags: ['Kapal Awan', 'Petualangan', 'G27', 'Awan'], complexity: 'LIGHT', svgKey: 'cloudship' },
  { id: 'anim-perahu', name: 'Perahu Layar Santai', shelf: 'KENDARAAN', icon: 'Sailboat', description: 'Perahu kayu kecil dengan layar putih bergoyang di riak air.', tags: ['Perahu', 'Layar', 'Air'], complexity: 'ULTRA_LIGHT', svgKey: 'boat' },
  { id: 'anim-pesawat', name: 'Pesawat Angkasa', shelf: 'KENDARAAN', icon: 'Plane', description: 'Pesawat terbang anggun membelah awan putih di langit biru.', tags: ['Pesawat', 'Langit', 'Cita-cita'], complexity: 'LIGHT', svgKey: 'plane' },
  { id: 'anim-helikopter', name: 'Helikopter Penyelamat', shelf: 'KENDARAAN', icon: 'Disc', description: 'Helikopter dengan baling-baling berputar cepat melayang di udara.', tags: ['Helikopter', 'Udara', 'Penyelamat'], complexity: 'LIGHT', svgKey: 'helicopter' },
  { id: 'anim-roket', name: 'Roket Bintang', shelf: 'KENDARAAN', icon: 'Rocket', description: 'Roket antariksa meluncur ke langit bintang dengan semburan api cerah.', tags: ['Roket', 'Bintang', 'Sains'], complexity: 'LIGHT', svgKey: 'rocket' },
  { id: 'anim-balon-udara', name: 'Balon Udara Warna', shelf: 'KENDARAAN', icon: 'Wind', description: 'Balon udara warna-warni mengapung perlahan menembus pelangi.', tags: ['Balon Udara', 'Warna', 'Langit'], complexity: 'ULTRA_LIGHT', svgKey: 'hotairballoon' },

  // 2. HEWAN (10 Items)
  { id: 'anim-kelinci', name: 'Kelinci Melompat', shelf: 'HEWAN', icon: 'Rabbit', description: 'Kelinci putih lucu melompat-lompat dengan telinga bergerak lembut.', tags: ['Kelinci', 'Hewan', 'Lucu'], complexity: 'LIGHT', svgKey: 'rabbit' },
  { id: 'anim-kucing', name: 'Kucing Manis', shelf: 'HEWAN', icon: 'Cat', description: 'Kucing berbulu halus mengedipkan mata dan mengibaskan ekor gembira.', tags: ['Kucing', 'Hewan Sahabat', 'Manis'], complexity: 'ULTRA_LIGHT', svgKey: 'cat' },
  { id: 'anim-gajah', name: 'Gajah Ceria', shelf: 'HEWAN', icon: 'Smile', description: 'Gajah besar ramah mengayunkan belalainya sambil menyemprot air.', tags: ['Gajah', 'Hewan Besar', 'Ramah'], complexity: 'LIGHT', svgKey: 'elephant' },
  { id: 'anim-jerapah', name: 'Jerapah Tinggi', shelf: 'HEWAN', icon: 'Eye', description: 'Jerapah leher panjang mengunyah dedaunan hijau dengan anggun.', tags: ['Jerapah', 'Tinggi', 'Kebun'], complexity: 'ULTRA_LIGHT', svgKey: 'giraffe' },
  { id: 'anim-burung', name: 'Burung Berkicau', shelf: 'HEWAN', icon: 'Bird', description: 'Burung kecil mengepakkan sayap dan berkicau di dahan ranting.', tags: ['Burung', 'Terbang', 'Kicau'], complexity: 'LIGHT', svgKey: 'bird' },
  { id: 'anim-lebah', name: 'Lebah Madu', shelf: 'HEWAN', icon: 'Hexagon', description: 'Lebah mungil terbang berputar mencari nektar bunga berkah.', tags: ['Lebah', 'Madu', 'Bunga'], complexity: 'LIGHT', svgKey: 'bee' },
  { id: 'anim-ikan', name: 'Ikan Berenang', shelf: 'HEWAN', icon: 'Fish', description: 'Ikan mas berenang gemulai di antara gelembung air jernih.', tags: ['Ikan', 'Kolam', 'Air'], complexity: 'ULTRA_LIGHT', svgKey: 'fish' },
  { id: 'anim-kura', name: 'Kura-kura Bijak', shelf: 'HEWAN', icon: 'Shield', description: 'Kura-kura berjalan perlahan dengan tempurung pola heksagonal indah.', tags: ['Kura-kura', 'Sabar', 'Bijak'], complexity: 'ULTRA_LIGHT', svgKey: 'turtle' },
  { id: 'anim-panda', name: 'Panda Gembira', shelf: 'HEWAN', icon: 'Smile', description: 'Panda hitam putih memeluk bambu hijau sambil tersenyum lebar.', tags: ['Panda', 'Lucu', 'Bambu'], complexity: 'LIGHT', svgKey: 'panda' },
  { id: 'anim-dino', name: 'Dinosaurus Sahabat', shelf: 'HEWAN', icon: 'Sparkles', description: 'Dino mini hijau melompat ceria dengan gigi senyum ramah anak.', tags: ['Dino', 'Purba', 'Sahabat'], complexity: 'LIGHT', svgKey: 'dino' },

  // 3. ALAM (8 Items)
  { id: 'anim-pelangi', name: 'Pelangi Lengkung Indah', shelf: 'ALAM', icon: 'SunMedium', description: 'Tujuh warna pelangi berkilau membentang di atas bukit hijau.', tags: ['Pelangi', 'Warna', 'Cahaya'], complexity: 'ULTRA_LIGHT', svgKey: 'rainbow' },
  { id: 'anim-matahari', name: 'Matahari Tersenyum', shelf: 'ALAM', icon: 'Sun', description: 'Matahari pagi bersinar memancarkan sinar hangat yang berdenyut riang.', tags: ['Matahari', 'Pagi', 'Hangat'], complexity: 'LIGHT', svgKey: 'sun' },
  { id: 'anim-awan', name: 'Awan Berarak', shelf: 'ALAM', icon: 'Cloud', description: 'Awan putih lembut melayang perlahan di langit biru cerah.', tags: ['Awan', 'Langit', 'Teduh'], complexity: 'ULTRA_LIGHT', svgKey: 'cloud' },
  { id: 'anim-layang', name: 'Layang-layang Terbang', shelf: 'ALAM', icon: 'Compass', description: 'Layang-layang belah ketupat meliuk-liuk dihembus angin sore.', tags: ['Layang-layang', 'Angin', 'Permainan'], complexity: 'LIGHT', svgKey: 'kite' },
  { id: 'anim-gelembung', name: 'Gelembung Berkilau', shelf: 'ALAM', icon: 'Circle', description: 'Gelembung sabun warna-warni melayang dan meletup lembut di udara.', tags: ['Gelembung', 'Sabun', 'Berkilau'], complexity: 'LIGHT', svgKey: 'bubbles' },
  { id: 'anim-daun', name: 'Daun Bergoyang', shelf: 'ALAM', icon: 'Leaf', description: 'Dedaunan hijau segar bergoyang pelan mengikuti irama angin kebun.', tags: ['Daun', 'Kebun', 'Hijau'], complexity: 'ULTRA_LIGHT', svgKey: 'leaves' },
  { id: 'anim-bunga', name: 'Bunga Mekar', shelf: 'ALAM', icon: 'Flower2', description: 'Kuncup bunga membuka kelopaknya perlahan memancarkan wangi.', tags: ['Bunga', 'Mekar', 'Taman'], complexity: 'LIGHT', svgKey: 'flower' },
  { id: 'anim-hujan', name: 'Rintik Hujan Berkah', shelf: 'ALAM', icon: 'CloudRain', description: 'Tetesan air hujan berkah turun menyirami bumi yang subur.', tags: ['Hujan', 'Berkah', 'Air'], complexity: 'LIGHT', svgKey: 'rain' },

  // 4. MAINAN (6 Items)
  { id: 'anim-bola', name: 'Bola Melenting', shelf: 'MAINAN', icon: 'CircleDot', description: 'Bola sepak warna-warni memantul dinamis di rumput hijau.', tags: ['Bola', 'Olahraga', 'Mainan'], complexity: 'LIGHT', svgKey: 'ball' },
  { id: 'anim-gasing', name: 'Gasing Berputar', shelf: 'MAINAN', icon: 'RotateCw', description: 'Gasing kayu tradisional berputar seimbang dengan kilatan warna.', tags: ['Gasing', 'Tradisional', 'Putar'], complexity: 'LIGHT', svgKey: 'spinningtop' },
  { id: 'anim-teddy', name: 'Teddy Bear Sahabat', shelf: 'MAINAN', icon: 'Heart', description: 'Boneka beruang cokelat lembut melambaikan tangan hangat.', tags: ['Boneka', 'Teddy Bear', 'Hangat'], complexity: 'ULTRA_LIGHT', svgKey: 'teddybear' },
  { id: 'anim-balok', name: 'Balok Susun Menara', shelf: 'MAINAN', icon: 'Boxes', description: 'Balok-balok geometri tersusun rapi membentuk istana kreatif.', tags: ['Balok', 'Sentra Balok', 'Rancang'], complexity: 'LIGHT', svgKey: 'blocks' },
  { id: 'anim-kincir', name: 'Kincir Angin Warna', shelf: 'MAINAN', icon: 'Fan', description: 'Kincir kertas berputar cepat ketika ditiup angin.', tags: ['Kincir', 'Kertas', 'Angin'], complexity: 'LIGHT', svgKey: 'pinwheel' },
  { id: 'anim-pesawat-kertas', name: 'Pesawat Kertas Meluncur', shelf: 'MAINAN', icon: 'Send', description: 'Pesawat kertas putih meluncur mulus melintasi ruang kelas.', tags: ['Pesawat Kertas', 'Lipat', 'Terbang'], complexity: 'ULTRA_LIGHT', svgKey: 'paperplane' },

  // 5. TEMA ISLAMI (5 Items)
  { id: 'anim-bulan-sabit', name: 'Bulan Sabit Emas', shelf: 'TEMA_ISLAMI', icon: 'Moon', description: 'Bulan sabit bercahaya emas berkilau menaungi malam berkah.', tags: ['Bulan Sabit', 'Emas', 'Malam'], complexity: 'ULTRA_LIGHT', svgKey: 'crescent' },
  { id: 'anim-bintang', name: 'Bintang Berpijar', shelf: 'TEMA_ISLAMI', icon: 'Star', description: 'Bintang delapan sudut berkedip memancarkan cahaya kebaikan.', tags: ['Bintang', 'Cahaya', 'Islami'], complexity: 'LIGHT', svgKey: 'islamicstar' },
  { id: 'anim-lentera', name: 'Lentera Ramadhan', shelf: 'TEMA_ISLAMI', icon: 'Flame', description: 'Lentera fanous tradisional bergoyang lembut dengan lilin hangat di dalamnya.', tags: ['Lentera', 'Ramadhan', 'Lampu'], complexity: 'LIGHT', svgKey: 'lantern' },
  { id: 'anim-masjid', name: 'Kubah Masjid Megah', shelf: 'TEMA_ISLAMI', icon: 'Building', description: 'Kubah masjid hijau zamrud bermahkotakan bulan bintang bercahaya.', tags: ['Masjid', 'Kubah', 'Ibadah'], complexity: 'ULTRA_LIGHT', svgKey: 'mosquedome' },
  { id: 'anim-quran-bercahaya', name: 'Al-Qur\'an Bercahaya', shelf: 'TEMA_ISLAMI', icon: 'BookOpen', description: 'Mushaf Al-Qur\'an di atas rehal kayu memancarkan kilau nur keimanan.', tags: ['Quran', 'Tahfidz', 'Nur'], complexity: 'LIGHT', svgKey: 'quranlight' },

  // 6. BELAJAR (5 Items)
  { id: 'anim-huruf-menari', name: 'Huruf Hijaiyah & Alfabet Menari', shelf: 'BELAJAR', icon: 'Type', description: 'Huruf Alif, Ba, Ta dan A, B, C melompat riang bergantian warna.', tags: ['Huruf', 'Hijaiyah', 'Membaca'], complexity: 'LIGHT', svgKey: 'dancingletters' },
  { id: 'anim-angka-melompat', name: 'Angka Ceria Melompat', shelf: 'BELAJAR', icon: 'Hash', description: 'Angka 1, 2, 3 melompat berirama di atas garis belajar.', tags: ['Angka', 'Berhitung', 'Matematika'], complexity: 'LIGHT', svgKey: 'jumpingnumbers' },
  { id: 'anim-pensil', name: 'Pensil Menggambar', shelf: 'BELAJAR', icon: 'PenTool', description: 'Pensil kayu warna-warni menari menggambar garis lengkung dan senyuman.', tags: ['Pensil', 'Menggambar', 'Kreatif'], complexity: 'ULTRA_LIGHT', svgKey: 'pencil' },
  { id: 'anim-buku-membuka', name: 'Buku Ilmu Membuka', shelf: 'BELAJAR', icon: 'Book', description: 'Buku cerita membuka halamannya menampakkan gambar keajaiban ilmu.', tags: ['Buku', 'Membaca', 'Perpustakaan'], complexity: 'LIGHT', svgKey: 'openingbook' },
  { id: 'anim-puzzle', name: 'Keping Puzzle Menyatu', shelf: 'BELAJAR', icon: 'Puzzle', description: 'Empat keping puzzle beraneka warna bergerak pas menyatu rapi.', tags: ['Puzzle', 'Kognitif', 'Sentra Main Peran'], complexity: 'LIGHT', svgKey: 'puzzle' },

  // 7. ASY & SYIFA (7 Items)
  { id: 'anim-asy-melambai', name: 'Dek Asy & Mbak Syifa Melambai', shelf: 'ASY_SYIFA', icon: 'Sparkles', description: 'Karakter resmi Dek Asy & Mbak Syifa melambaikan tangan menyambut santri.', tags: ['Asy & Syifa', 'Maskot Resmi', 'Menyambut'], complexity: 'LIGHT', svgKey: 'asywaving' },
  { id: 'anim-asy-tepuktangan', name: 'Asy & Syifa Tepuk Tangan', shelf: 'ASY_SYIFA', icon: 'Heart', description: 'Tepuk tangan gembira merayakan prestasi hafalan dan kebaikan santri.', tags: ['Tepuk Tangan', 'Apresiasi', 'Gembira'], complexity: 'LIGHT', svgKey: 'asyclapping' },
  { id: 'anim-asy-naikkereta', name: 'Asy & Syifa Naik Kereta Ceria', shelf: 'ASY_SYIFA', icon: 'Train', description: 'Dek Asy dan Mbak Syifa duduk di gerbong kereta mini tersenyum bahagia.', tags: ['Kereta', 'Petualangan', 'Kebersamaan'], complexity: 'MODERATE', svgKey: 'asytrain' },
  { id: 'anim-asy-naiksepeda', name: 'Asy & Syifa Bersepeda Sehat', shelf: 'ASY_SYIFA', icon: 'Activity', description: 'Bersepeda tandem roda tiga mengelilingi halaman sekolah berumput.', tags: ['Sepeda', 'Olahraga', 'Sehat'], complexity: 'LIGHT', svgKey: 'asybicycle' },
  { id: 'anim-asy-layanglayang', name: 'Bermain Layang-layang', shelf: 'ASY_SYIFA', icon: 'Compass', description: 'Asy memegang gulungan benang sambil memperhatikan layang-layang di awan.', tags: ['Layang-layang', 'Taman', 'Ceria'], complexity: 'LIGHT', svgKey: 'asykite' },
  { id: 'anim-asy-siramtanaman', name: 'Menyiram Tanaman Kebun', shelf: 'ASY_SYIFA', icon: 'Droplets', description: 'Mbak Syifa membawa ceret hijau menyirami bunga mawar dan melati.', tags: ['Menyiram Tanaman', 'Sentra Alam', 'Kasih Sayang'], complexity: 'LIGHT', svgKey: 'asywatering' },
  { id: 'anim-asy-bacabuku', name: 'Membaca Kisah Teladan', shelf: 'ASY_SYIFA', icon: 'BookOpen', description: 'Asy & Syifa duduk bersila khusyuk membaca buku kisah para Nabi.', tags: ['Membaca', 'Teladan', 'Pendidikan Islami'], complexity: 'LIGHT', svgKey: 'asyreading' },
  { id: 'anim-peta-dunia', name: 'Peta Dunia Menjelajah', shelf: 'ASY_SYIFA', icon: 'Compass', description: 'Asy & Syifa memegang kompas pelangi menatap 9 lokasi indah di peta dunia.', tags: ['Peta Dunia', 'G28', 'Kompas', 'Petualangan'], complexity: 'LIGHT', svgKey: 'worldmap' },
  { id: 'anim-sekolah-bernapas', name: 'Gerbang & Kelas Bernapas', shelf: 'ASY_SYIFA', icon: 'Sparkles', description: 'Gerbang membuka ramah, bel ceria bernada, pohon berbisik hikmah, dan kelas hidup.', tags: ['Sekolah Bernapas', 'G29', 'Gerbang', 'Bel Ceria'], complexity: 'LIGHT', svgKey: 'livingschool' },
  { id: 'anim-lorong-kenangan', name: 'Lorong Kenangan Asy & Syifa', shelf: 'ASY_SYIFA', icon: 'Heart', description: 'Bingkai kayu bergoyang lembut, kotak suara doa guru, dan kupu-kupu emas.', tags: ['Lorong Kenangan', 'G30', 'Foto Hidup', 'Kapsul Doa'], complexity: 'LIGHT', svgKey: 'livingmemoryhall' },
  { id: 'anim-keluarga-sahabat', name: 'Keluarga Sahabat Asy & Syifa', shelf: 'ASY_SYIFA', icon: 'Sun', description: 'Pagi bersama, jendela terbuka, kicau Bubu, dan cerita 15 detik penuh adab.', tags: ['Keluarga Sahabat', 'G31', 'Pagi Bersama', 'Kebiasaan Harian'], complexity: 'LIGHT', svgKey: 'livingfamily' },
  { id: 'anim-mbg-ceria', name: 'Makan Bergizi Gratis (MBG) Ceria', shelf: 'ASY_SYIFA', icon: 'Utensils', description: 'Bus MBG tersenyum tiba, klakson tuut-tuut, antri tertib, doa makan, dan makan bergizi bersama.', tags: ['MBG Ceria', 'G31', 'Bus MBG', 'Doa Makan', 'Makan Bergizi'], complexity: 'LIGHT', svgKey: 'mbgceria' },
  { id: 'anim-pagi-ceria', name: 'Pagi Ceria di Halaman TK Asy Syifa', shelf: 'ASY_SYIFA', icon: 'Sun', description: 'Kedatangan santri, salam & salim, parkir ceria, senam 20s, baris bel sekolah, dan bus MBG.', tags: ['Pagi Ceria', 'G32', 'Kedatangan', 'Salam Salim', 'Senam 20s', 'Parkir Ceria'], complexity: 'LIGHT', svgKey: 'pagiceria' },
  { id: 'anim-kelas-hidup', name: 'Kelas Hidup & Sentra Ceria PAUD', shelf: 'ASY_SYIFA', icon: 'School', description: 'Pintu kelas bismillah, sentra balok, seni hidup, bahan alam, main peran, dan lingkaran pagi.', tags: ['Kelas Hidup', 'G33', 'Sentra PAUD', 'Balok', 'Seni', 'Lingkaran Pagi'], complexity: 'LIGHT', svgKey: 'kelashidup' },
  { id: 'anim-taman-petualangan', name: 'Jam Bermain Ceria & Taman Petualangan', shelf: 'ASY_SYIFA', icon: 'TreePine', description: 'Bel istirahat ceria, ayunan awan, perosotan pelangi, 6 sahabat, kejutan taman, dan transisi MBG.', tags: ['Taman Petualangan', 'G34', 'Ayunan', 'Perosotan', 'Bermain Bersama', '6 Sahabat'], complexity: 'LIGHT', svgKey: 'tamanpetualangan' },
  { id: 'anim-pulang-ceria', name: 'Pulang Ceria & Gerbang Perpisahan', shelf: 'ASY_SYIFA', icon: 'Moon', description: 'Bel pulang lembut, jemput ayah bunda, salim perpisahan ustadzah, gerbang senja, bintang pertama, dan sampai besok.', tags: ['Pulang Ceria', 'G35', 'Bel Pulang', 'Jemput Bunda', 'Gerbang Senja', 'Bintang Pertama'], complexity: 'LIGHT', svgKey: 'pulangceria' },
  { id: 'anim-perpustakaan-ajaib', name: 'Perpustakaan Ajaib & Kereta Buku', shelf: 'ASY_SYIFA', icon: 'BookOpen', description: 'Pintu hidup, kereta buku keliling, rak buku hidup, pojok dongeng 20s, buku doa hijaiyah, dan paspor membaca.', tags: ['Perpustakaan Ajaib', 'G36', 'Kereta Buku', 'Pojok Dongeng', 'Paspor Membaca'], complexity: 'LIGHT', svgKey: 'magiclibrary' },
  { id: 'anim-aula-impian', name: 'Aula Impian & Panggung Serbaguna', shelf: 'ASY_SYIFA', icon: 'Sparkles', description: 'Pintu aula besar, karpet merah, panggung hidup 6 tema, kursi ceria, tirai pelangi, latihan pentas apresiasi, dan foto kelas.', tags: ['Aula Impian', 'G37', 'Panggung Serbaguna', 'Tirai Pelangi', 'Foto Kelas'], complexity: 'LIGHT', svgKey: 'grandhall' },
  { id: 'anim-pawai-nusantara', name: 'Pawai Nusantara & Kampung Indonesia', shelf: 'ASY_SYIFA', icon: 'Compass', description: 'Gerbang gapura batik, pawai 20s keliling nusantara, rumah adat bersapa, pakaian daerah santun, alat musik hidup, paspor cap nusantara.', tags: ['Pawai Nusantara', 'G38', 'Kampung Indonesia', 'Rumah Adat', 'Alat Musik Hidup', 'Paspor Nusantara'], complexity: 'LIGHT', svgKey: 'pawainusantara' },
  { id: 'anim-pasar-ceria', name: 'Hari Pasar Ceria & Koperasi Mini', shelf: 'ASY_SYIFA', icon: 'ShoppingBag', description: 'Gapura pasar warna-warni, 6 stan kartun hidup, kasir koperasi antre santun, keranjang ceria berjalan, cerita pasar 20s, dan kartu belanja kenangan.', tags: ['Hari Pasar Ceria', 'G39', 'Koperasi Mini', 'Stan Buah Sayur', 'Adab Antre', 'Kata Santun'], complexity: 'LIGHT', svgKey: 'pasarceria' },
  { id: 'anim-kebun-ajaib', name: 'Kebun Ajaib & Panen Berkah', shelf: 'ASY_SYIFA', icon: 'Sprout', description: 'Gerbang bambu bersuara burung, menanam 6 sayuran tanah tersenyum, menyiram gembor pelangi, panen 20s ke MBG, 4 sahabat kebun, dan buku panen kenangan.', tags: ['Kebun Ajaib', 'G40', 'Panen Berkah', 'Menanam Sayur', 'Gembor Air', 'Sahabat Kebun', 'MBG'], complexity: 'LIGHT', svgKey: 'kebunajaib' },
  { id: 'anim-masjid-barakah', name: 'Masjid Al-Barakah Hidup & Kampung Shalih', shelf: 'ASY_SYIFA', icon: 'Compass', description: 'Kubah emas berkilau, bulan sabit tersenyum, lentera bergoyang, jalan berbunga, wudhu ceria, shaf sajadah hidup, menara cahaya, halaman bernapas, dan parade Jumat 20s.', tags: ['Masjid Al-Barakah', 'G41', 'Kubah Emas', 'Wudhu Ceria', 'Shaf Sajadah', 'Menara Cahaya', 'Parade Jumat'], complexity: 'LIGHT', svgKey: 'masjidbarakah' },
  { id: 'anim-gotong-royong', name: 'Kampung Gotong Royong & Hari Bakti Ceria', shelf: 'ASY_SYIFA', icon: 'Users', description: 'Pagi kerja bakti, bersih halaman sekolah, kerja sama kebun berkah, pikul panen rute kebun-MBG-masjid-sekolah, pasar berbagi adab, pohon persatuan hidup, dan kereta kerja sama.', tags: ['Gotong Royong', 'G42', 'Hari Bakti', 'Bersih Sekolah', 'Pasar Berbagi', 'Pohon Gotong Royong', 'Kereta Ceria'], complexity: 'LIGHT', svgKey: 'gotongroyong' }
];

import { deviceCapabilityEngine } from './deviceCapabilityEngine';

export const MAX_CONCURRENT_ANIMATIONS = 5;

class TadeAnimationGovernor {
  private static instance: TadeAnimationGovernor | null = null;
  private activeAnimationIds: Set<string> = new Set();
  private animationActivationOrder: string[] = [];
  private listeners: ((activeIds: string[], count: number) => void)[] = [];
  private isLiteMode: boolean = false;

  public static getInstance(): TadeAnimationGovernor {
    if (!TadeAnimationGovernor.instance) {
      TadeAnimationGovernor.instance = new TadeAnimationGovernor();
    }
    return TadeAnimationGovernor.instance;
  }

  /**
   * Retrieves dynamically adaptive max concurrent animation budget based on device capability
   */
  public getMaxConcurrentBudget(): number {
    try {
      const capSnap = deviceCapabilityEngine.getSnapshot();
      return Math.min(MAX_CONCURRENT_ANIMATIONS, capSnap.maxConcurrentAnimations);
    } catch {
      return MAX_CONCURRENT_ANIMATIONS;
    }
  }

  public subscribe(listener: (activeIds: string[], count: number) => void): () => void {
    this.listeners.push(listener);
    listener(Array.from(this.activeAnimationIds), this.activeAnimationIds.size);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const list = Array.from(this.activeAnimationIds);
    this.listeners.forEach(fn => fn(list, list.length));
  }

  public getActiveCount(): number {
    return this.activeAnimationIds.size;
  }

  public getActiveIds(): string[] {
    return Array.from(this.activeAnimationIds);
  }

  public isAnimationActive(id: string): boolean {
    return this.activeAnimationIds.has(id);
  }

  public toggleAnimation(id: string): boolean {
    if (this.activeAnimationIds.has(id)) {
      this.stopAnimation(id);
      return false;
    } else {
      return this.startAnimation(id);
    }
  }

  public startAnimation(id: string): boolean {
    if (this.activeAnimationIds.has(id)) return true;

    const budget = this.getMaxConcurrentBudget();

    // Dr. Pulse Rule: Max 5 Concurrent Animations (Adaptive down to 2-3 on LOW capability)
    if (this.activeAnimationIds.size >= budget) {
      // Remove oldest activated animation
      const oldestId = this.animationActivationOrder.shift();
      if (oldestId) {
        this.activeAnimationIds.delete(oldestId);
      }
    }

    this.activeAnimationIds.add(id);
    this.animationActivationOrder.push(id);
    this.notify();
    return true;
  }

  public stopAnimation(id: string): void {
    if (this.activeAnimationIds.has(id)) {
      this.activeAnimationIds.delete(id);
      this.animationActivationOrder = this.animationActivationOrder.filter(item => item !== id);
      this.notify();
    }
  }

  public stopAll(): void {
    this.activeAnimationIds.clear();
    this.animationActivationOrder = [];
    this.notify();
  }

  public setLiteMode(enabled: boolean): void {
    this.isLiteMode = enabled;
    if (enabled) {
      // In Lite mode, stop all running animations
      this.stopAll();
    }
  }

  public getIsLiteMode(): boolean {
    return this.isLiteMode;
  }
}

export const tadeAnimationGovernor = TadeAnimationGovernor.getInstance();
