import React, { useState, useMemo } from 'react';
import { 
  FileCheck2, 
  Stamp, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Lock, 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { 
  DigitalSignatureReadiness, 
  OfficialDocumentSeal, 
  SignatureStep 
} from '../../core/digitalGov/digitalSignatureReadiness';
import { useAuth } from '../../context/AuthContext';

export const DigitalSignatureReadinessViewer: React.FC = () => {
  const engine = useMemo(() => DigitalSignatureReadiness.getInstance(), []);
  const { activeRole, userProfile } = useAuth();
  const [documents, setDocuments] = useState<OfficialDocumentSeal[]>(() => engine.getAllDocuments());
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.documentId || '');
  const [signerRemarks, setSignerRemarks] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedDoc = useMemo(() => {
    return documents.find(d => d.documentId === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  const handleSignStep = (stepIndex: number) => {
    const signerName = userProfile?.displayName || activeRole;
    const res = engine.executeSignStep(
      selectedDoc.documentId,
      stepIndex,
      signerName,
      activeRole,
      signerRemarks
    );

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setDocuments(engine.getAllDocuments());
      setSignerRemarks('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FULLY_EXECUTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" /> FULLY EXECUTED (SAH)
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold font-mono">
            <Clock className="w-3.5 h-3.5" /> IN REVIEW
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold font-mono">
            DRAFT
          </span>
        );
    }
  };

  return (
    <div id="r772-digital-signature-readiness" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold font-mono border border-amber-500/30">
              <Stamp className="w-3.5 h-3.5" /> R772 • DIGITAL SIGNATURE READINESS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Official Document Seal & Verification Chain
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Arsitektur penandatanganan dokumen resmi institusi berbasis rantai persetujuan berjenjang dan QR seal tanpa ketergantungan provider berbayar pihak ketiga (Free First).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Official Sealed Docs</p>
              <p className="text-2xl font-black text-amber-400 font-mono">{documents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          {feedback.message}
        </div>
      )}

      {/* Main Layout: Document List & Detail Signing View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" /> Dokumen Resmi Institusi
            </h2>

            <div className="space-y-2">
              {documents.map((doc) => (
                <button
                  key={doc.documentId}
                  onClick={() => setSelectedDocId(doc.documentId)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                    selectedDoc?.documentId === doc.documentId
                      ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                      : 'bg-stone-50/70 border-stone-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {doc.documentNumber.split('/')[0]}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2">{doc.documentTitle}</h3>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                    <span>{doc.approvalChain.filter(s => s.status === 'SIGNED').length}/{doc.approvalChain.length} Ditandatangani</span>
                    <span className="font-mono">{doc.verificationStatus}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Document Signing Detail */}
        <div className="lg:col-span-8 space-y-4">
          {selectedDoc ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-200">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {selectedDoc.documentNumber}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedDoc.documentTitle}</h2>
                  <p className="text-xs text-stone-500">
                    Dibuat oleh: <strong className="text-slate-700">{selectedDoc.createdByName}</strong> • {new Date(selectedDoc.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </p>
                </div>
                <div>
                  {getStatusBadge(selectedDoc.verificationStatus)}
                </div>
              </div>

              {/* Approval Chain Workflow */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" /> Rantai Tanda Tangan & Pengesahan
                </h3>

                <div className="space-y-3">
                  {selectedDoc.approvalChain.map((step) => {
                    const canSign = (step.role === activeRole || activeRole === 'SUPER_ADMIN') && step.status === 'PENDING';

                    return (
                      <div 
                        key={step.stepIndex}
                        className={`p-4 rounded-2xl border transition space-y-3 ${
                          step.status === 'SIGNED' 
                            ? 'bg-emerald-50/50 border-emerald-200' 
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              step.status === 'SIGNED' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-stone-200 text-stone-700'
                            }`}>
                              {step.stepIndex}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{step.title}</p>
                              <p className="text-[11px] text-stone-500 font-mono">
                                Peran yang Berwenang: <strong>{step.role}</strong>
                              </p>
                            </div>
                          </div>

                          <div>
                            {step.status === 'SIGNED' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5" /> DITANDATANGANI
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                                <Clock className="w-3.5 h-3.5" /> MENUNGGU TANDA TANGAN
                              </span>
                            )}
                          </div>
                        </div>

                        {step.status === 'SIGNED' && (
                          <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs space-y-1 text-stone-600">
                            <div className="flex justify-between items-center text-[10px] font-mono text-emerald-800">
                              <span>Penandatangan: <strong>{step.assignedToName}</strong></span>
                              <span>Kode: {step.verificationCode}</span>
                            </div>
                            <p className="text-[11px] text-stone-700 italic">"{step.signerRemarks}"</p>
                            <div className="text-[9px] font-mono text-stone-400 truncate">
                              Signature Hash: {step.signatureHash}
                            </div>
                          </div>
                        )}

                        {canSign && (
                          <div className="pt-2 border-t border-stone-200 space-y-2">
                            <input
                              type="text"
                              placeholder="Catatan penandatangan (opsional)..."
                              value={signerRemarks}
                              onChange={(e) => setSignerRemarks(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                            />
                            <button
                              onClick={() => handleSignStep(step.stepIndex)}
                              className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Stamp className="w-4 h-4" />
                              Bubuhkan Tanda Tangan Resmi Sebagai {activeRole}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cryptographic Digest & QR Proofing Card */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Kedaulatan & Keaslian Dokumen</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">QR SEAL READY</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="space-y-0.5">
                    <p className="text-slate-400 text-[10px]">Content Digest (SHA-256):</p>
                    <p className="font-mono text-emerald-300 truncate">{selectedDoc.contentDigest}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-400 text-[10px]">Verification URL:</p>
                    <p className="font-mono text-slate-300 truncate">{selectedDoc.qrVerificationUrl}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-stone-400 text-xs border border-stone-200">
              Pilih dokumen untuk melihat status tanda tangan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
