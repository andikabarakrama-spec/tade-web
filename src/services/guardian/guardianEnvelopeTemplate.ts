export interface EmergencyEnvelopeData {
  schoolName: string;
  generationDate: string;
  recoveryId: string;
  codes: string[]; // 10 formatted codes
  emergencyInstructions: string[];
  qrVerificationPlaceholder: string;
}

export function generateEmergencyEnvelopeData(
  recoveryId: string,
  plainTextCodes: string[],
  schoolName: string = 'TK ASY SYIFA TANGGUL - JEMBER'
): EmergencyEnvelopeData {
  return {
    schoolName,
    generationDate: new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    recoveryId,
    codes: plainTextCodes,
    emergencyInstructions: [
      'AMPLOP DARURAT GUARDIAN — SANGAT RAHASIA (CONFIDENTIAL)',
      '1. Simpan amplop ini di brankas fisik utama sekolah yang terkunci.',
      '2. Amplop ini hanya boleh dibuka saat insiden darurat kegagalan autentikasi tingkat tinggi.',
      '3. Setiap kode pemulihan hanya dapat digunakan 1 (satu) kali saja.',
      '4. Setelah kode digunakan, status akan berubah menjadi PERMANENTLY USED.',
      '5. Apabila sisa kode pemulihan mencapai kurang dari 3 kode, segera lakukan pencetakan amplop baru.',
    ],
    qrVerificationPlaceholder: `GUARDIAN_VERIFY_VAULT:${recoveryId}`,
  };
}

export function renderEmergencyEnvelopeHtml(data: EmergencyEnvelopeData): string {
  const codesListHtml = data.codes
    .map(
      (code, index) =>
        `<div style="padding: 10px; border: 1px dashed #cbd5e1; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; text-align: center; background: #f8fafc;">
          <span style="color: #64748b; font-size: 11px; display: block;">KODE #${(index + 1).toString().padStart(2, '0')}</span>
          ${code}
        </div>`
    )
    .join('');

  const instructionsHtml = data.emergencyInstructions
    .map(inst => `<li style="margin-bottom: 6px; color: #334155;">${inst}</li>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Guardian Emergency Envelope - ${data.recoveryId}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
        .header { border-bottom: 3px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; text-align: center; }
        .school-title { font-size: 20px; font-weight: bold; letter-spacing: 1px; color: #0369a1; }
        .doc-title { font-size: 16px; font-weight: 600; text-transform: uppercase; margin-top: 4px; color: #334155; }
        .meta-box { background: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; display: flex; justify-content: space-between; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 28px; }
        .instructions { background: #fffbebf8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
        .instructions h4 { margin: 0 0 10px 0; color: #92400e; font-size: 14px; text-transform: uppercase; }
        .instructions ul { margin: 0; padding-left: 20px; font-size: 12px; }
        .footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-title">${data.schoolName}</div>
        <div class="doc-title">GUARDIAN EMERGENCY RECOVERY ENVELOPE</div>
      </div>
      <div class="meta-box">
        <div><strong>VAULT ID:</strong> ${data.recoveryId}</div>
        <div><strong>DITERBITKAN:</strong> ${data.generationDate}</div>
      </div>
      <div class="grid">
        ${codesListHtml}
      </div>
      <div class="instructions">
        <h4>PROTOKOL PENGGUNAAN DARURAT</h4>
        <ul>${instructionsHtml}</ul>
      </div>
      <div class="footer">
        SECURITY CHECKSUM: ${data.qrVerificationPlaceholder} | DOKUMEN RESMI SISTEM RA/TK ASY SYIFA DIGITAL ECOSYSTEM
      </div>
    </body>
    </html>
  `;
}
