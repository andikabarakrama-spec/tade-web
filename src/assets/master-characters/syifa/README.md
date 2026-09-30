# SYIFA (Master Character Asset Pipeline) — TADE v9.1.0-MCA1

Folder ini merupakan direktori resmi penyimpanan artefak kanon karakter **Syifa Al-Marwah (Syifa)**.

## Spesifikasi Format Berkas yang Diterima

1. **SVG Master (`syifa-master.svg`)**
   - Format: Vector SVG 1.1 / 2.0
   - Canvas: 160 x 200 px (atau 1024 x 1280 px)
   - Color Profile: sRGB, Palette Syifa (#FDA4AF Hijab Rosy, #047857 Gamis Syar'i, #FDE047 Brooch, #1E293B Mata Berbinar)
   - Layers: `head`, `hijab-frame`, `hijab-chest`, `eyes`, `eyebrows`, `mouth`, `torso`, `left-arm`, `right-arm`, `feet`

2. **PNG 4K Lossless (`syifa-4k.png`)**
   - Resolusi: 3840 x 4800 px (300 DPI Transparent Background)
   - Digunakan untuk: Cetak buku panduan wali murid, banner tahfidz, piagam santriwati berprestasi.

3. **WebP Optimized (`syifa.webp`)**
   - Resolusi: 512 x 640 px (Lossy/Lossless Alpha, Target < 45 KB)
   - Digunakan untuk: Mobile production rendering di pelosok tanpa hambatan bandwidth.

4. **Sprite Sheet (`syifa-spritesheet.json` + `syifa-spritesheet.png`)**
   - Format: TexturePacker JSON Array
   - State Frame: `idle_01..12`, `wave_01..12`, `butterfly_01..16`, `read_iqro_01..16`

## Konstitusi Kanon & Larangan
- **DILARANG** menambahkan maskot perempuan alternatif selain Syifa.
- **DILARANG** membuka hijab atau menampilkan helai rambut (wajib syar'i menutup dada).
- **DILARANG** mengubah proporsi 2.5 kepala (Chibi Islamic Aesthetic).
- Setiap pembaruan berkas wajib divalidasi melalui `MasterCharacterGuard.ts`.
