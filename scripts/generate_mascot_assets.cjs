const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

['public/assets/mascot/asy', 'public/assets/mascot/syifa', 'src/assets/mascot/asy', 'src/assets/mascot/syifa'].forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

const asySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="800" height="1200">
  <defs>
    <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#000000" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="skinGrad" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="#FFDFCC"/>
      <stop offset="50%" stop-color="#F5C5A8"/>
      <stop offset="100%" stop-color="#E09F7B"/>
    </linearGradient>
    <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF7070" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#FF7070" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="peciGrad" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#383838"/>
      <stop offset="25%" stop-color="#1F1F1F"/>
      <stop offset="80%" stop-color="#0F0F0F"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="peciEmblem" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="50%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="creamUniform" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#FFFBF0"/>
      <stop offset="60%" stop-color="#F7EED3"/>
      <stop offset="100%" stop-color="#E6D3A7"/>
    </linearGradient>
    <linearGradient id="orangeTrim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF8C00"/>
      <stop offset="50%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
    <linearGradient id="brownShorts" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#8C5638"/>
      <stop offset="60%" stop-color="#61381E"/>
      <stop offset="100%" stop-color="#3D210F"/>
    </linearGradient>
    <linearGradient id="shoeOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="70%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#9A3412"/>
    </linearGradient>
    <linearGradient id="shoeSole" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <radialGradient id="eyeIris" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#78350F"/>
      <stop offset="50%" stop-color="#451A03"/>
      <stop offset="100%" stop-color="#1C0A00"/>
    </radialGradient>
  </defs>
  <ellipse cx="200" cy="565" rx="110" ry="22" fill="url(#floorShadow)" />
  <g id="asy-master-body">
    <g id="left-leg">
      <rect x="152" y="420" width="32" height="80" rx="16" fill="url(#skinGrad)" />
      <path d="M150 480 h36 v22 h-36 z" fill="#FFFBF0" />
      <path d="M150 495 h36 v5 h-36 z" fill="#EA580C" />
      <path d="M135 500 c10 -15 35 -15 50 0 c5 10 8 30 -5 40 c-20 8 -45 5 -50 -5 c-5 -12 0 -25 5 -35 z" fill="url(#shoeOrange)" />
      <path d="M132 532 c15 5 40 5 55 0 c3 5 -2 12 -10 12 h-38 c-8 0 -10 -7 -7 -12 z" fill="url(#shoeSole)" />
      <circle cx="158" cy="512" r="3" fill="#FFFFFF" />
      <circle cx="168" cy="512" r="3" fill="#FFFFFF" />
    </g>
    <g id="right-leg">
      <rect x="216" y="420" width="32" height="80" rx="16" fill="url(#skinGrad)" />
      <path d="M214 480 h36 v22 h-36 z" fill="#FFFBF0" />
      <path d="M214 495 h36 v5 h-36 z" fill="#EA580C" />
      <path d="M215 500 c10 -15 35 -15 50 0 c5 10 8 30 -5 40 c-20 8 -45 5 -50 -5 c-5 -12 0 -25 5 -35 z" fill="url(#shoeOrange)" />
      <path d="M212 532 c15 5 40 5 55 0 c3 5 -2 12 -10 12 h-38 c-8 0 -10 -7 -7 -12 z" fill="url(#shoeSole)" />
      <circle cx="238" cy="512" r="3" fill="#FFFFFF" />
      <circle cx="248" cy="512" r="3" fill="#FFFFFF" />
    </g>
    <path d="M140 330 h120 v90 c-15 10 -40 10 -55 0 l-5 -15 l-5 15 c-15 10 -40 10 -55 0 z" fill="url(#brownShorts)" />
    <path d="M140 330 h120 v12 h-120 z" fill="#451A03" />
    <path d="M130 220 c20 -20 120 -20 140 0 l15 120 c-20 15 -130 15 -170 0 z" fill="url(#creamUniform)" />
    <path d="M191 222 h18 v120 h-18 z" fill="url(#orangeTrim)" />
    <circle cx="200" cy="245" r="3.5" fill="#FFFFFF" />
    <circle cx="200" cy="275" r="3.5" fill="#FFFFFF" />
    <circle cx="200" cy="305" r="3.5" fill="#FFFFFF" />
    <path d="M148 260 h30 v30 h-30 z" fill="none" stroke="#D97706" stroke-width="2" rx="4" />
    <path d="M222 260 h30 v30 h-30 z" fill="none" stroke="#D97706" stroke-width="2" rx="4" />
    <g transform="translate(152, 268) scale(0.6)">
      <polygon points="12,2 22,9 22,21 12,28 2,21 2,9" fill="#15803D" />
      <polygon points="12,4 19,10 19,20 12,25 5,20 5,10" fill="#FBBF24" />
      <text x="12" y="17" font-size="6" font-weight="900" text-anchor="middle" fill="#064E3B">ASY</text>
    </g>
    <path d="M160 218 c15 15 25 18 40 18 c15 0 25 -3 40 -18 c-10 -10 -70 -10 -80 0 z" fill="url(#orangeTrim)" />
    <g id="left-arm">
      <path d="M132 222 c-20 30 -25 70 -20 100 c5 8 18 8 22 0 c2 -25 8 -65 18 -90 z" fill="url(#creamUniform)" />
      <path d="M110 308 c5 8 18 8 22 0 l-2 12 c-5 6 -16 6 -20 0 z" fill="url(#orangeTrim)" />
      <circle cx="120" cy="330" r="14" fill="url(#skinGrad)" />
    </g>
    <g id="right-arm">
      <path d="M268 222 c20 20 40 40 55 60 c8 10 18 -2 12 -12 c-15 -25 -38 -52 -55 -60 z" fill="url(#creamUniform)" />
      <path d="M315 272 c8 10 18 -2 12 -12 l8 -8 c5 8 -2 18 -12 12 z" fill="url(#orangeTrim)" />
      <g transform="translate(330, 260)">
        <circle cx="0" cy="0" r="15" fill="url(#skinGrad)" />
        <rect x="-10" y="-18" width="6" height="12" rx="3" fill="url(#skinGrad)" />
        <rect x="-3" y="-22" width="6" height="15" rx="3" fill="url(#skinGrad)" />
        <rect x="4" y="-20" width="6" height="13" rx="3" fill="url(#skinGrad)" />
        <rect x="10" y="-15" width="5" height="10" rx="2.5" fill="url(#skinGrad)" />
      </g>
    </g>
    <rect x="185" y="190" width="30" height="32" rx="8" fill="url(#skinGrad)" />
    <g id="head">
      <ellipse cx="200" cy="140" rx="65" ry="60" fill="url(#skinGrad)" />
      <ellipse cx="134" cy="142" rx="10" ry="14" fill="url(#skinGrad)" />
      <ellipse cx="135" cy="142" rx="5" ry="8" fill="#E09F7B" opacity="0.5" />
      <ellipse cx="266" cy="142" rx="10" ry="14" fill="url(#skinGrad)" />
      <ellipse cx="265" cy="142" rx="5" ry="8" fill="#E09F7B" opacity="0.5" />
      <circle cx="162" cy="152" r="18" fill="url(#cheekBlush)" />
      <circle cx="238" cy="152" r="18" fill="url(#cheekBlush)" />
      <g id="left-eye">
        <ellipse cx="168" cy="135" rx="16" ry="19" fill="#FFFFFF" />
        <ellipse cx="169" cy="136" rx="11" ry="13" fill="url(#eyeIris)" />
        <circle cx="166" cy="131" r="4.5" fill="#FFFFFF" />
        <circle cx="172" cy="141" r="2" fill="#FFFFFF" />
        <path d="M150 130 c8 -12 28 -12 36 0" fill="none" stroke="#271003" stroke-width="3.5" stroke-linecap="round" />
      </g>
      <g id="right-eye">
        <ellipse cx="232" cy="135" rx="16" ry="19" fill="#FFFFFF" />
        <ellipse cx="231" cy="136" rx="11" ry="13" fill="url(#eyeIris)" />
        <circle cx="228" cy="131" r="4.5" fill="#FFFFFF" />
        <circle cx="234" cy="141" r="2" fill="#FFFFFF" />
        <path d="M214 130 c8 -12 28 -12 36 0" fill="none" stroke="#271003" stroke-width="3.5" stroke-linecap="round" />
      </g>
      <path d="M152 110 c10 -6 22 -4 28 2" fill="none" stroke="#381C0D" stroke-width="3.5" stroke-linecap="round" />
      <path d="M220 112 c6 -6 18 -8 28 -2" fill="none" stroke="#381C0D" stroke-width="3.5" stroke-linecap="round" />
      <path d="M197 148 c3 3 6 3 9 0" fill="none" stroke="#D97706" stroke-width="2.5" stroke-linecap="round" />
      <path d="M180 162 c10 14 30 14 40 0" fill="none" stroke="#991B1B" stroke-width="4" stroke-linecap="round" />
      <path d="M184 163 c8 8 24 8 32 0" fill="#DC2626" opacity="0.7" />
      <path d="M138 100 c15 12 35 15 50 8 c15 -7 25 10 40 0 c15 -10 25 -5 34 -8 c-10 -20 -30 -30 -62 -30 c-32 0 -52 10 -62 30 z" fill="#1C0A00" />
      <g id="peci">
        <path d="M132 88 c0 -35 15 -48 68 -48 c53 0 68 13 68 48 c0 6 -136 6 -136 0 z" fill="url(#peciGrad)" />
        <path d="M132 88 c20 6 116 6 136 0 c0 4 -136 4 -136 0 z" fill="#000000" opacity="0.4" />
        <g transform="translate(236, 56) scale(0.7)">
          <polygon points="12,2 22,9 22,21 12,28 2,21 2,9" fill="url(#peciEmblem)" />
          <polygon points="12,5 19,10 19,19 12,24 5,19 5,10" fill="#064E3B" />
          <circle cx="12" cy="14" r="3.5" fill="#FBBF24" />
        </g>
      </g>
    </g>
  </g>
</svg>`;

const syifaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="800" height="1200">
  <defs>
    <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#000000" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="skinGrad" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="#FFDFCC"/>
      <stop offset="50%" stop-color="#F5C5A8"/>
      <stop offset="100%" stop-color="#E09F7B"/>
    </linearGradient>
    <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF5577" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#FF5577" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hijabGrad" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#FF9800"/>
      <stop offset="40%" stop-color="#F57C00"/>
      <stop offset="85%" stop-color="#E65100"/>
      <stop offset="100%" stop-color="#BF360C"/>
    </linearGradient>
    <linearGradient id="hijabFold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE0B2"/>
      <stop offset="100%" stop-color="#F57C00"/>
    </linearGradient>
    <linearGradient id="creamUniform" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#FFFBF0"/>
      <stop offset="60%" stop-color="#F7EED3"/>
      <stop offset="100%" stop-color="#E6D3A7"/>
    </linearGradient>
    <linearGradient id="orangeSkirt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF8C00"/>
      <stop offset="50%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
    <linearGradient id="shoeOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="70%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#9A3412"/>
    </linearGradient>
    <linearGradient id="shoeSole" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <radialGradient id="eyeIris" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#78350F"/>
      <stop offset="50%" stop-color="#451A03"/>
      <stop offset="100%" stop-color="#1C0A00"/>
    </radialGradient>
  </defs>
  <ellipse cx="200" cy="565" rx="110" ry="22" fill="url(#floorShadow)" />
  <g id="syifa-master-body">
    <g id="legs">
      <rect x="156" y="460" width="28" height="40" rx="14" fill="url(#skinGrad)" />
      <rect x="216" y="460" width="28" height="40" rx="14" fill="url(#skinGrad)" />
      <path d="M154 482 h32 v18 h-32 z" fill="#FFFBF0" />
      <path d="M154 492 h32 v4 h-32 z" fill="#EC4899" />
      <path d="M214 482 h32 v18 h-32 z" fill="#FFFBF0" />
      <path d="M214 492 h32 v4 h-32 z" fill="#EC4899" />
      <path d="M138 498 c10 -15 35 -15 48 0 c5 10 8 30 -5 40 c-20 8 -45 5 -48 -5 c-5 -12 0 -25 5 -35 z" fill="url(#shoeOrange)" />
      <path d="M135 530 c15 5 38 5 52 0 c3 5 -2 12 -10 12 h-35 c-8 0 -10 -7 -7 -12 z" fill="url(#shoeSole)" />
      <path d="M218 498 c10 -15 35 -15 48 0 c5 10 8 30 -5 40 c-20 8 -45 5 -48 -5 c-5 -12 0 -25 5 -35 z" fill="url(#shoeOrange)" />
      <path d="M215 530 c15 5 38 5 52 0 c3 5 -2 12 -10 12 h-35 c-8 0 -10 -7 -7 -12 z" fill="url(#shoeSole)" />
    </g>
    <path d="M140 310 c20 -5 100 -5 120 0 l30 160 c-30 15 -120 15 -180 0 z" fill="url(#orangeSkirt)" />
    <path d="M140 310 c20 8 100 8 120 0 v12 c-20 8 -100 8 -120 0 z" fill="#9A3412" opacity="0.4" />
    <path d="M130 220 c20 -20 120 -20 140 0 l15 100 c-20 15 -130 15 -170 0 z" fill="url(#creamUniform)" />
    <path d="M191 222 h18 v98 h-18 z" fill="url(#orangeSkirt)" />
    <circle cx="200" cy="245" r="3.5" fill="#FFFFFF" />
    <circle cx="200" cy="275" r="3.5" fill="#FFFFFF" />
    <circle cx="200" cy="300" r="3.5" fill="#FFFFFF" />
    <g transform="translate(152, 255) scale(0.6)">
      <polygon points="12,2 22,9 22,21 12,28 2,21 2,9" fill="#15803D" />
      <polygon points="12,4 19,10 19,20 12,25 5,20 5,10" fill="#FBBF24" />
      <text x="12" y="17" font-size="5.5" font-weight="900" text-anchor="middle" fill="#064E3B">SYIFA</text>
    </g>
    <g id="left-arm">
      <path d="M132 222 c-20 30 -25 70 -20 100 c5 8 18 8 22 0 c2 -25 8 -65 18 -90 z" fill="url(#creamUniform)" />
      <path d="M110 308 c5 8 18 8 22 0 l-2 12 c-5 6 -16 6 -20 0 z" fill="url(#orangeSkirt)" />
      <circle cx="120" cy="330" r="13" fill="url(#skinGrad)" />
    </g>
    <g id="right-arm">
      <path d="M268 222 c20 20 35 45 48 65 c8 10 18 -2 12 -12 c-15 -25 -32 -52 -48 -62 z" fill="url(#creamUniform)" />
      <path d="M308 276 c8 10 18 -2 12 -12 l8 -8 c5 8 -2 18 -12 12 z" fill="url(#orangeSkirt)" />
      <circle cx="325" cy="275" r="13" fill="url(#skinGrad)" />
    </g>
    <path d="M125 180 c15 40 40 50 75 50 c35 0 60 -10 75 -50 c15 35 25 70 5 95 c-20 20 -140 20 -160 0 c-20 -25 -10 -60 5 -95 z" fill="url(#hijabGrad)" />
    <path d="M140 210 c20 20 100 20 120 0 c-10 15 -110 15 -120 0 z" fill="url(#hijabFold)" opacity="0.7" />
    <g id="head">
      <ellipse cx="200" cy="125" rx="72" ry="68" fill="url(#hijabGrad)" />
      <ellipse cx="200" cy="135" rx="54" ry="50" fill="url(#skinGrad)" />
      <circle cx="164" cy="146" r="17" fill="url(#cheekBlush)" />
      <circle cx="236" cy="146" r="17" fill="url(#cheekBlush)" />
      <g id="left-eye">
        <ellipse cx="168" cy="130" rx="15" ry="18" fill="#FFFFFF" />
        <ellipse cx="169" cy="131" rx="10.5" ry="12.5" fill="url(#eyeIris)" />
        <circle cx="166" cy="126" r="4" fill="#FFFFFF" />
        <circle cx="172" cy="136" r="1.8" fill="#FFFFFF" />
        <path d="M150 125 c8 -12 28 -12 36 0" fill="none" stroke="#271003" stroke-width="3.5" stroke-linecap="round" />
      </g>
      <g id="right-eye">
        <ellipse cx="232" cy="130" rx="15" ry="18" fill="#FFFFFF" />
        <ellipse cx="231" cy="131" rx="10.5" ry="12.5" fill="url(#eyeIris)" />
        <circle cx="228" cy="126" r="4" fill="#FFFFFF" />
        <circle cx="234" cy="136" r="1.8" fill="#FFFFFF" />
        <path d="M214 125 c8 -12 28 -12 36 0" fill="none" stroke="#271003" stroke-width="3.5" stroke-linecap="round" />
      </g>
      <path d="M152 106 c10 -6 22 -4 28 2" fill="none" stroke="#381C0D" stroke-width="3" stroke-linecap="round" />
      <path d="M220 108 c6 -6 18 -8 28 -2" fill="none" stroke="#381C0D" stroke-width="3" stroke-linecap="round" />
      <path d="M197 143 c3 3 6 3 9 0" fill="none" stroke="#D97706" stroke-width="2.2" stroke-linecap="round" />
      <path d="M182 156 c10 13 26 13 36 0" fill="none" stroke="#991B1B" stroke-width="3.8" stroke-linecap="round" />
      <path d="M185 157 c7 7 21 7 28 0" fill="#DC2626" opacity="0.7" />
      <path d="M146 125 c-5 -30 20 -48 54 -48 c34 0 59 18 54 48 c-10 -20 -98 -20 -108 0 z" fill="url(#hijabGrad)" />
      <g id="flower-clip" transform="translate(150, 95)">
        <ellipse cx="0" cy="-8" rx="6" ry="9" fill="#F472B6" />
        <ellipse cx="-7" cy="4" rx="6" ry="9" transform="rotate(-60 -7 4)" fill="#F472B6" />
        <ellipse cx="7" cy="4" rx="6" ry="9" transform="rotate(60 7 4)" fill="#F472B6" />
        <circle cx="0" cy="0" r="5" fill="#FBBF24" stroke="#D97706" stroke-width="1.5" />
      </g>
    </g>
  </g>
</svg>`;

fs.writeFileSync('public/assets/mascot/asy/ASY_MASTER.svg', asySvg);
fs.writeFileSync('public/assets/mascot/syifa/SYIFA_MASTER.svg', syifaSvg);
fs.writeFileSync('src/assets/mascot/asy/ASY_MASTER.svg', asySvg);
fs.writeFileSync('src/assets/mascot/syifa/SYIFA_MASTER.svg', syifaSvg);

try {
  execSync('convert -background none -density 300 public/assets/mascot/asy/ASY_MASTER.svg public/assets/mascot/asy/ASY_MASTER.png');
  execSync('convert -background none -density 300 public/assets/mascot/syifa/SYIFA_MASTER.svg public/assets/mascot/syifa/SYIFA_MASTER.png');
  execSync('convert -background none -density 300 src/assets/mascot/asy/ASY_MASTER.svg src/assets/mascot/asy/ASY_MASTER.png');
  execSync('convert -background none -density 300 src/assets/mascot/syifa/SYIFA_MASTER.svg src/assets/mascot/syifa/SYIFA_MASTER.png');
  console.log('Raster PNG conversion complete.');
} catch (err) {
  console.error('Error during convert:', err.message);
}
