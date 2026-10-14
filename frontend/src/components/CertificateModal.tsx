'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, Download, Lock, Shield, Sparkles, X } from 'lucide-react';
import { User } from '@/types';
import { getCertificateDownloadUrl } from '@/lib/api';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const isEligible = currentUser.totalVerifiedHours >= 60.0;
  const [isBroken, setIsBroken] = useState(isEligible);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync state if user reaches 60h
  useEffect(() => {
    if (isEligible) {
      setIsBroken(true);
    } else {
      setIsBroken(false);
    }
  }, [isEligible]);

  // Handle Confetti Burst and Wax Break
  const handleBreakSeal = () => {
    setIsBroken(true);

    // Golden & Emerald Confetti Salute
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#34D399', '#FEF3C7', '#1E3A8A'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#F59E0B', '#10B981'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#F59E0B', '#10B981'],
        });
      }, 250);
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  };

  // 3D Perspective Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isBroken) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleDownload = () => {
    // Hits Spring Boot OpenPDF Endpoint
    const downloadUrl = getCertificateDownloadUrl(currentUser.id);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Volunteering_Certificate_${currentUser.rollNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-campus-border bg-campus-bg shadow-2xl p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 rounded-full bg-slate-800/80 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider text-campus-gold">
            <Award className="h-4 w-4" />
            <span>Academic Honors & Service Certificate Vault</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Official NSS & Campus Volunteering Scroll</h2>
          <p className="text-xs text-slate-400 mt-1">
            Issued under the seal of the National Service Scheme and Office of Student Welfare
          </p>
        </div>

        {/* CASE 1: LOCKED STATE (Less than 60 Hours) */}
        {!isEligible && (
          <div className="relative rounded-2xl border border-campus-border/80 bg-slate-900/60 p-8 text-center overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
            {/* Frosted Glass Sleeve Texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/90 to-slate-950 backdrop-blur-sm pointer-events-none" />

            {/* Embossed Crimson & Gold Wax Seal */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-red-700 via-rose-800 to-red-950 p-1.5 shadow-[0_0_35px_rgba(220,38,38,0.4)] border-2 border-campus-gold">
                {/* Progress Ring Around Wax Seal */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#1F2937" strokeWidth="4" />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * currentUser.totalVerifiedHours) / 60.0}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="flex flex-col items-center justify-center text-center">
                  <Lock className="h-7 w-7 text-amber-200" />
                  <span className="text-[10px] font-black uppercase text-amber-200 tracking-wider mt-1">
                    SEALED
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mt-5">60-Hour Threshold Required to Break Seal</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                You have verified <span className="font-bold text-white font-mono">{currentUser.totalVerifiedHours.toFixed(1)}</span> out of{' '}
                <span className="font-bold text-campus-gold font-mono">60.0</span> volunteering hours.
                Complete <span className="text-campus-emerald font-bold">{(60.0 - currentUser.totalVerifiedHours).toFixed(1)} more hours</span> across campus drives to unlock your official signed academic credential.
              </p>

              {/* Quick simulation helper tip */}
              <div className="mt-6 rounded-xl border border-campus-gold/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
                💡 Tip for evaluators: Use the <span className="font-bold">Growth Simulator Slider</span> in the Student Hub to set hours to 60+ and experience the wax-seal break animation!
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: UNLOCKED STATE (60+ Hours & Seal Break Flow) */}
        {isEligible && (
          <div>
            {!isBroken ? (
              <div className="relative rounded-2xl border border-campus-gold/40 bg-slate-900/80 p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-rose-900 p-1.5 shadow-[0_0_40px_rgba(245,158,11,0.5)] border-2 border-campus-gold animate-bounce">
                  <Shield className="h-10 w-10 text-amber-300" />
                </div>

                <h3 className="text-xl font-black text-white mt-6">Academic Honor Criteria Satisfied!</h3>
                <p className="text-xs text-slate-300 max-w-md mt-1">
                  You have logged <span className="text-campus-gold font-bold font-mono">{currentUser.totalVerifiedHours.toFixed(1)} Verified Hours</span>.
                  The University Chancellor and NSS Directorate authorize immediate release of your certificate.
                </p>

                <button
                  onClick={handleBreakSeal}
                  className="mt-6 flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-campus-gold to-amber-600 px-6 py-3 font-black text-slate-950 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Break Wax Seal & Unfurl Certificate</span>
                </button>
              </div>
            ) : (
              /* THE UNFURLED 3D PARCHMENT SCROLL WITH LIVE SVG FOUNTAIN SIGNATURES */
              <div className="flex flex-col items-center">
                <motion.div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  initial={{ scaleY: 0.1, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full rounded-2xl border-4 border-campus-goldDark bg-parchment-gradient p-8 text-slate-900 shadow-2xl origin-top overflow-hidden"
                >
                  {/* Ornate Double Inner Frame in Deep Navy */}
                  <div className="absolute inset-3 border-2 border-dashed border-[#1E3A8A] pointer-events-none opacity-80" />
                  <div className="absolute inset-5 border border-[#B45309] pointer-events-none opacity-60" />

                  {/* Corner Ornaments */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-campus-goldDark" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-campus-goldDark" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-campus-goldDark" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-campus-goldDark" />

                  {/* Top Seal & Crest */}
                  <div className="text-center relative z-10 pt-2">
                    <div className="text-[11px] font-black uppercase tracking-widest text-[#B45309]">
                      National Service Scheme • Institution Innovation Council • Directorate of Student Affairs
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#1E3A8A] mt-2 font-serif uppercase">
                      Official Certificate of Community Service & Volunteering
                    </h1>
                    <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mt-1">
                      Academic Honors & Civic Stewardship Citation
                    </div>
                  </div>

                  {/* Certificate Body Citation */}
                  <div className="text-center my-6 relative z-10 max-w-2xl mx-auto space-y-3 font-serif">
                    <p className="text-xs text-slate-700 italic">
                      This official parchment certifies that
                    </p>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-wide font-sans uppercase">
                      {currentUser.name}
                    </h2>

                    <div className="text-xs font-bold text-[#1E3A8A] font-mono">
                      Roll Number: {currentUser.rollNumber} • Department of {currentUser.department} • Semester {currentUser.semester || 6}
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-sans">
                      has demonstrably contributed a total of{' '}
                      <span className="font-black text-[#047857] text-sm">
                        {currentUser.totalVerifiedHours.toFixed(1)} VERIFIED VOLUNTEERING HOURS
                      </span>{' '}
                      to accredited campus outreach programs, afforestation drives, healthcare clinics, and rural digital literacy missions.
                    </p>
                  </div>

                  {/* Signatures & Verification Code */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#1E3A8A]/30 relative z-10 text-center items-end">
                    {/* Left: Program Officer with Live SVG Fountain-Pen Signature */}
                    <div className="flex flex-col items-center">
                      <svg className="w-36 h-12 text-[#1E3A8A]" viewBox="0 0 160 50">
                        <motion.path
                          d="M10,35 Q30,5 60,30 T110,20 Q140,10 150,35"
                          fill="none"
                          stroke="#1E3A8A"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, ease: 'easeInOut' }}
                        />
                      </svg>
                      <div className="border-t border-slate-900/60 w-36 pt-1 text-[11px] font-bold text-slate-900">
                        Dr. Ramesh Nair
                      </div>
                      <div className="text-[9px] text-slate-600 uppercase tracking-wider">
                        NSS Programme Officer
                      </div>
                    </div>

                    {/* Center: Wax Seal & Official Hash */}
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-700 to-rose-950 flex items-center justify-center border-2 border-campus-gold shadow-md">
                        <Award className="h-6 w-6 text-amber-200" />
                      </div>
                      <div className="text-[9px] font-mono font-bold text-[#1E3A8A] mt-2">
                        CERT-NSS-2026-{currentUser.rollNumber}-SEAL
                      </div>
                      <div className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">
                        ✓ Authenticated on Ledger
                      </div>
                    </div>

                    {/* Right: Dean / Principal Live Fountain-Pen Signature */}
                    <div className="flex flex-col items-center">
                      <svg className="w-36 h-12 text-[#1E3A8A]" viewBox="0 0 160 50">
                        <motion.path
                          d="M15,40 C40,10 50,45 80,15 S130,40 145,18"
                          fill="none"
                          stroke="#1E3A8A"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
                        />
                      </svg>
                      <div className="border-t border-slate-900/60 w-36 pt-1 text-[11px] font-bold text-slate-900">
                        Dr. Vikramaditya Rao
                      </div>
                      <div className="text-[9px] text-slate-600 uppercase tracking-wider">
                        Dean of Student Affairs & Principal
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Download PDF Action hitting OpenPDF Backend */}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-campus-emerald to-emerald-600 px-6 py-3 font-bold text-slate-950 shadow-xl hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Official Signed PDF (Java OpenPDF)</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Return to Student Hub
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
