# ASY (Master Character Asset Pipeline) — TADE v9.1.0-MCA1

Folder ini merupakan direktori resmi penyimpanan artefak kanon karakter **Asy-Syatibi Al-Muaddib (Asy)**.

## Spesifikasi Format Berkas yang Diterima

1. **SVG Master (`asy-master.svg`)**
   - Format: Vector SVG 1.1 / 2.0
   - Canvas: 160 x 200 px (atau 1024 x 1280 px)
   - Color Profile: sRGB, Palette Asy (#059669 Zamrud, #FFFBF5 Koko, #F97316 Oranye, #0F172A Peci Onyx)
   - Layers: `head`, `peci`, `eyes`, `eyebrows`, `mouth`, `torso`, `left-arm`, `right-arm`, `feet`

2. **PNG 4K Lossless (`asy-4k.png`)**
   - Resolusi: 3840 x 4800 px (300 DPI Transparent Background)
   - Digunakan untuk: Cetak spanduk, banner akreditasi, dan materi publikasi resmi yayasan.

3. **WebP Optimized (`asy.webp`)**
   - Resolusi: 512 x 640 px (Lossy/Lossless Alpha, Target < 45 KB)
   - Digunakan untuk: Mobile production rendering di pelosok tanpa kompresi berat.

4. **Sprite Sheet (`asy-spritesheet.json` + `asy-spritesheet.png`)**
   - Format: TexturePacker JSON Array
   - State Frame: `idle_01..12`, `wave_01..12`, `read_iqro_01..16`, `swing_feet_01..12`

## Konstitusi Kanon & Larangan
- **DILARANG** menambahkan maskot alternatif selain Asy.
- **DILARANG** mendegradasi proporsi dari 2.5 kepala (Chibi Islamic Aesthetic).
- **DILARANG** menempatkan placeholder murah atau gambar kartun tanpa peci hitam dan busana koko syar'i.
- Setiap pembaruan berkas wajib divalidasi melalui `MasterCharacterGuard.ts`.
