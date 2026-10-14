'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Stamp,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { AttendanceLog, AttendanceStatus } from '@/types';

interface CoordinatorLedgerProps {
  roster: AttendanceLog[];
  onVerify: (logId: number, status: AttendanceStatus) => Promise<void>;
  onBatchVerify: () => Promise<void>;
  coordinatorName?: string;
}

export const CoordinatorLedger: React.FC<CoordinatorLedgerProps> = ({
  roster,
  onVerify,
  onBatchVerify,
  coordinatorName = 'Dr. Ramesh Nair',
}) => {
  const [activeStampingId, setActiveStampingId] = useState<number | null>(null);
  const [stampedTokens, setStampedTokens] = useState<{ id: number; hours: number }[]>([]);
  const [isBatchStamping, setIsBatchStamping] = useState(false);

  const handleSingleStamp = async (logId: number, status: AttendanceStatus, hours: number) => {
    setActiveStampingId(logId);
    if (status === 'PRESENT') {
      setStampedTokens((prev) => [...prev, { id: logId, hours }]);
      setTimeout(() => {
        setStampedTokens((prev) => prev.filter((t) => t.id !== logId));
      }, 1500);
    }
    await onVerify(logId, status);
    setTimeout(() => setActiveStampingId(null), 400);
  };

  const handleBatchStampCascade = async () => {
    if (isBatchStamping) return;
    setIsBatchStamping(true);
    await onBatchVerify();
    setTimeout(() => setIsBatchStamping(false), 800);
  };

  const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
  const totalHoursAwarded = roster
    .filter((r) => r.status === 'PRESENT')
    .reduce((acc, curr) => acc + (curr.hoursAwarded || curr.event?.durationHours || 6.0), 0);

  return (
    <div className="rounded-2xl border border-campus-border bg-campus-card shadow-2xl overflow-hidden">
      {/* Ledger Header with Academic Seal */}
      <div className="border-b border-campus-border bg-gradient-to-r from-slate-900 via-campus-card to-slate-900 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-campus-gold animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-campus-gold">
              Official University Ledger
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center space-x-2">
            <span>Faculty Verification & Stamping Desk</span>
            <span className="text-xs font-normal text-slate-400">({coordinatorName})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically signed attendance records, service hour distribution & instant audit log
          </p>
        </div>

        {/* Ledger Control Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-xl bg-slate-900/80 border border-campus-border px-3.5 py-2 text-xs">
            <span className="text-slate-400">Verified:</span>
            <span className="font-bold text-campus-emerald font-mono">
              {presentCount} / {roster.length}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Impact Hours:</span>
            <span className="font-bold text-campus-gold font-mono">+{totalHoursAwarded.toFixed(1)}h</span>
          </div>

          <button
            onClick={handleBatchStampCascade}
            disabled={isBatchStamping || presentCount === roster.length}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-campus-emerald to-emerald-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Stamp className="h-4 w-4" />
            <span>{isBatchStamping ? 'Stamping All...' : 'Stamp All Present (Domino)'}</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-campus-border bg-slate-900/60 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Volunteer Student</th>
              <th className="py-3 px-4">Dept / Roll No</th>
              <th className="py-3 px-4">Target Activity Drive</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4 text-center">Verification Stamp</th>
              <th className="py-3 px-4 text-right">Ledger Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-campus-border/60 font-medium">
            {roster.map((log, index) => {
              const isPresent = log.status === 'PRESENT';
              const isAbsent = log.status === 'ABSENT';
              const isStampingThis = activeStampingId === log.id;
              const hasFlyingToken = stampedTokens.some((t) => t.id === log.id);

              return (
                <motion.tr
                  key={log.id}
                  className={`group relative hover:bg-slate-800/40 transition-colors ${
                    isPresent ? 'bg-emerald-950/10' : ''
                  }`}
                  animate={
                    isBatchStamping && !isPresent
                      ? {
                          backgroundColor: ['rgba(16, 185, 129, 0.25)', 'transparent'],
                        }
                      : {}
                  }
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  {/* Student Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 font-bold text-campus-emerald border border-slate-700">
                        {log.student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-amber-200 transition-colors">
                          {log.student.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{log.student.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Dept / Roll No */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-200 font-bold">{log.student.rollNumber}</div>
                    <div className="text-[11px] text-slate-400">
                      {log.student.department} • Sem {log.student.semester || 4}
                    </div>
                  </td>

                  {/* Activity Event */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 truncate max-w-xs">{log.event.title}</div>
                    <div className="text-[11px] text-campus-gold font-bold">
                      +{log.event.durationHours.toFixed(1)} Hours Allocated
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {isPresent ? (
                      <span className="inline-flex items-center space-x-1.5 rounded-full bg-campus-emeraldDark/40 px-2.5 py-0.5 text-[10px] font-bold text-campus-emerald border border-campus-emerald/30">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>VERIFIED PRESENT</span>
                      </span>
                    ) : isAbsent ? (
                      <span className="inline-flex items-center space-x-1.5 rounded-full bg-rose-950/40 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                        <XCircle className="h-3 w-3" />
                        <span>RECORDED ABSENT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-700">
                        <Clock className="h-3 w-3 text-amber-400" />
                        <span>PENDING STAMP</span>
                      </span>
                    )}
                  </td>

                  {/* The Physical Rubber-Stamp Ink Seal */}
                  <td className="py-3.5 px-4 text-center relative">
                    <div className="flex items-center justify-center min-h-[44px]">
                      {isPresent && (
                        <motion.div
                          initial={
                            isStampingThis
                              ? { scale: 2.2, rotate: -14, opacity: 0 }
                              : false
                          }
                          animate={{ scale: 1, rotate: -5, opacity: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 18,
                          }}
                          className="relative inline-flex flex-col items-center justify-center rounded border-2 border-dashed border-campus-emerald bg-emerald-950/70 px-3 py-1 shadow-md shadow-emerald-950/60"
                        >
                          <span className="text-[11px] font-black tracking-widest text-campus-emerald font-mono">
                            VERIFIED • +{log.hoursAwarded || log.event.durationHours}H
                          </span>
                          <span className="text-[9px] text-emerald-400/90 font-mono">
                            {log.certificateHash ? log.certificateHash.slice(0, 14) + '...' : 'SEALED'}
                          </span>

                          {/* Ink Splatter Shockwave */}
                          {isStampingThis && (
                            <motion.span
                              className="absolute inset-0 rounded border-2 border-campus-emerald"
                              initial={{ scale: 0.8, opacity: 1 }}
                              animate={{ scale: 1.8, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            />
                          )}
                        </motion.div>
                      )}

                      {/* Flying Golden Hour Token Animation */}
                      <AnimatePresence>
                        {hasFlyingToken && (
                          <motion.div
                            initial={{ y: 0, opacity: 1, scale: 0.6 }}
                            animate={{ y: -45, opacity: 0, scale: 1.3 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="absolute -top-3 flex items-center space-x-1 rounded-full bg-gradient-to-r from-campus-gold to-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950 shadow-lg pointer-events-none"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>+{log.event.durationHours.toFixed(1)} HRS</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {!isPresent ? (
                        <button
                          onClick={() =>
                            handleSingleStamp(log.id, 'PRESENT', log.event.durationHours)
                          }
                          className="flex items-center space-x-1.5 rounded-lg bg-campus-emerald px-3 py-1.5 text-[11px] font-bold text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-sm"
                        >
                          <Stamp className="h-3.5 w-3.5" />
                          <span>Stamp Present</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSingleStamp(log.id, 'ABSENT', 0)}
                          title="Mistake Correction (Revert Hours)"
                          className="flex items-center space-x-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-rose-300 hover:border-rose-500/50 hover:bg-rose-950/20 transition-all"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
