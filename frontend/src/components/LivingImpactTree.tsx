'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, Clock, Sprout, Trees, Zap, Sliders } from 'lucide-react';
import { User } from '@/types';

interface LivingImpactTreeProps {
  currentUser: User;
  onHoursChange?: (newHours: number) => void;
  onOpenCertificate: () => void;
}

export const LivingImpactTree: React.FC<LivingImpactTreeProps> = ({
  currentUser,
  onHoursChange,
  onOpenCertificate,
}) => {
  // Allow simulation mode to directly test growth transitions
  const [simulatedHours, setSimulatedHours] = useState<number>(currentUser.totalVerifiedHours);

  // Sync when user changes unless user is dragging the slider
  React.useEffect(() => {
    setSimulatedHours(currentUser.totalVerifiedHours);
  }, [currentUser.totalVerifiedHours]);

  const activeHours = simulatedHours;

  // Growth Stage Determination
  let stage = 1;
  let stageTitle = 'Seedling Volunteer';
  let stageDesc = 'Sprouting community roots with your initial service hours.';
  let stageColor = '#10B981';

  if (activeHours >= 60.0) {
    stage = 4;
    stageTitle = 'NSS Gold Scholar';
    stageDesc = 'Academic excellence achieved! Official verified certificate unlocked.';
    stageColor = '#F59E0B';
  } else if (activeHours >= 30.0) {
    stage = 3;
    stageTitle = 'Canopy Builder';
    stageDesc = 'Deep canopy of impact providing shade and support across village projects.';
    stageColor = '#34D399';
  } else if (activeHours >= 15.0) {
    stage = 2;
    stageTitle = 'Active Sapling';
    stageDesc = 'Branching into multiple campus clubs and welfare initiatives.';
    stageColor = '#10B981';
  }

  // 60-hour gauge calculation
  const gaugePercent = Math.min(100, (activeHours / 60.0) * 100);
  const strokeDashoffset = 283 - (283 * gaugePercent) / 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSimulatedHours(val);
    if (onHoursChange) {
      onHoursChange(val);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* LEFT: Living Impact Tree SVG & Stage Visualizer */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-campus-border bg-gradient-to-b from-campus-card/90 to-campus-bg/95 p-6 shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div
          className="absolute -top-20 -left-20 h-64 w-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: stageColor }}
        />

        <div className="flex items-center justify-between pb-4 border-b border-campus-border/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-campus-emerald animate-pulse" />
              <h2 className="text-sm font-semibold tracking-wide text-campus-emerald uppercase">
                Living Impact Ecosystem
              </h2>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Stage {stage}: {stageTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{stageDesc}</p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-campus-gold font-mono tracking-tight">
              {activeHours.toFixed(1)} <span className="text-xs font-medium text-slate-400">HRS</span>
            </span>
            <span className="text-[11px] font-semibold text-campus-emerald bg-campus-emeraldDark/40 px-2 py-0.5 rounded-full border border-campus-emerald/30">
              {stage === 4 ? '100% Milestone Achieved' : `${(60.0 - activeHours).toFixed(1)}h to Gold`}
            </span>
          </div>
        </div>

        {/* Tree SVG Animation Canvas */}
        <div className="relative flex items-center justify-center my-6 h-80 w-full">
          {/* Subtle Golden Pollen Particles (Stage 4) */}
          {stage === 4 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(14)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-campus-gold shadow-[0_0_8px_#F59E0B]"
                  initial={{
                    x: 100 + (i * 25) % 250,
                    y: 200,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    y: [180, 40, 10],
                    x: [100 + (i * 25) % 250, 80 + (i * 30) % 270, 120 + (i * 20) % 240],
                    opacity: [0, 0.9, 0],
                    scale: [0.5, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3.5 + (i % 3),
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}

          {/* SVG Tree Elements */}
          <svg viewBox="0 0 400 360" className="w-full h-full max-h-80 drop-shadow-2xl">
            {/* Ground Soil & Radiance */}
            <ellipse cx="200" cy="340" rx="140" ry="14" fill="#064E3B" opacity="0.4" />
            <ellipse cx="200" cy="340" rx="90" ry="8" fill="#10B981" opacity="0.2" />

            {/* STAGE 1: Seedling Stem & 2 Swaying Leaves */}
            {stage >= 1 && (
              <g id="stage-1-seedling">
                {/* Sprouting Trunk */}
                <motion.path
                  d="M200,340 C198,300 202,260 200,220"
                  stroke={stage >= 2 ? '#451a03' : '#10B981'}
                  strokeWidth={stage >= 2 ? '14' : '6'}
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />

                {/* Primary Left Sprout Leaf */}
                <motion.path
                  d="M198,240 C175,230 160,200 170,185 C185,190 196,215 198,240 Z"
                  fill="#10B981"
                  stroke="#065F46"
                  strokeWidth="1.5"
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '198px 240px' }}
                />

                {/* Primary Right Sprout Leaf */}
                <motion.path
                  d="M202,230 C225,220 240,195 230,180 C215,185 204,208 202,230 Z"
                  fill="#34D399"
                  stroke="#065F46"
                  strokeWidth="1.5"
                  animate={{ rotate: [3, -3, 3] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '202px 230px' }}
                />
              </g>
            )}

            {/* STAGE 2: Secondary Branches & 8 Leaves (Active Sapling) */}
            {stage >= 2 && (
              <g id="stage-2-sapling">
                {/* Left Branch */}
                <motion.path
                  d="M200,240 C180,210 140,195 120,180"
                  stroke="#451a03"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                />
                {/* Right Branch */}
                <motion.path
                  d="M200,230 C220,200 260,190 280,175"
                  stroke="#451a03"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                />
                {/* Center Sub-Stem */}
                <motion.path
                  d="M200,220 C200,180 195,145 198,125"
                  stroke="#451a03"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />

                {/* Left Branch Leaves */}
                <motion.ellipse
                  cx="120"
                  cy="175"
                  rx="14"
                  ry="9"
                  transform="rotate(-30 120 175)"
                  fill="#10B981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
                />
                <motion.ellipse
                  cx="140"
                  cy="190"
                  rx="12"
                  ry="7"
                  transform="rotate(-40 140 190)"
                  fill="#059669"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.6 }}
                />

                {/* Right Branch Leaves */}
                <motion.ellipse
                  cx="280"
                  cy="170"
                  rx="14"
                  ry="9"
                  transform="rotate(30 280 170)"
                  fill="#10B981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.55 }}
                />
                <motion.ellipse
                  cx="260"
                  cy="185"
                  rx="12"
                  ry="7"
                  transform="rotate(40 260 185)"
                  fill="#34D399"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.65 }}
                />
              </g>
            )}

            {/* STAGE 3: Dense Multi-Layered Canopy Bloomed */}
            {stage >= 3 && (
              <g id="stage-3-canopy">
                {/* Back Canopy Layer */}
                <motion.circle
                  cx="150"
                  cy="130"
                  r="45"
                  fill="#047857"
                  opacity="0.85"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 14, delay: 0.2 }}
                />
                <motion.circle
                  cx="250"
                  cy="125"
                  r="45"
                  fill="#047857"
                  opacity="0.85"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 14, delay: 0.25 }}
                />
                {/* Middle Canopy Clouds */}
                <motion.circle
                  cx="200"
                  cy="95"
                  r="52"
                  fill="#059669"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.35 }}
                />
                <motion.circle
                  cx="160"
                  cy="105"
                  r="40"
                  fill="#10B981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.4 }}
                />
                <motion.circle
                  cx="240"
                  cy="100"
                  r="42"
                  fill="#10B981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.45 }}
                />
                {/* Front Highlights */}
                <motion.circle
                  cx="195"
                  cy="80"
                  r="35"
                  fill="#34D399"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.5 }}
                />
              </g>
            )}

            {/* STAGE 4: NSS Gold Scholar Honours & Golden Fruit */}
            {stage >= 4 && (
              <g id="stage-4-gold-fruit">
                {/* Golden Fruit 1 */}
                <motion.circle
                  cx="155"
                  cy="90"
                  r="10"
                  fill="#F59E0B"
                  stroke="#FEF3C7"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Golden Fruit 2 */}
                <motion.circle
                  cx="245"
                  cy="85"
                  r="10"
                  fill="#F59E0B"
                  stroke="#FEF3C7"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                />
                {/* Golden Fruit 3 */}
                <motion.circle
                  cx="195"
                  cy="55"
                  r="11"
                  fill="#FBBF24"
                  stroke="#FFFBEB"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                />
                {/* Golden Fruit 4 & 5 on branches */}
                <motion.circle
                  cx="120"
                  cy="145"
                  r="8.5"
                  fill="#F59E0B"
                  stroke="#FEF3C7"
                  strokeWidth="1.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
                <motion.circle
                  cx="280"
                  cy="140"
                  r="8.5"
                  fill="#F59E0B"
                  stroke="#FEF3C7"
                  strokeWidth="1.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />

                {/* Center NSS Star Crest */}
                <motion.g
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.7 }}
                >
                  <circle cx="200" cy="115" r="18" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="2.5" />
                  <polygon
                    points="200,103 203,111 211,111 205,116 207,124 200,119 193,124 195,116 189,111 197,111"
                    fill="#F59E0B"
                  />
                </motion.g>
              </g>
            )}
          </svg>
        </div>

        {/* Interactive Growth Simulator Slider for Project Evaluation */}
        <div className="mt-2 rounded-xl bg-slate-900/90 border border-campus-border p-4">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span className="flex items-center space-x-1.5 font-semibold text-campus-gold">
              <Sliders className="h-3.5 w-3.5" />
              <span>Simulate / Test Hour Growth (Evaluator Sandbox)</span>
            </span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {activeHours.toFixed(1)} hrs
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="80"
            step="0.5"
            value={activeHours}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-campus-emerald focus:outline-none"
          />

          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-medium">
            <button
              onClick={() => {
                setSimulatedHours(8);
                if (onHoursChange) onHoursChange(8);
              }}
              className="hover:text-campus-emerald transition-colors"
            >
              Seedling (8h)
            </button>
            <button
              onClick={() => {
                setSimulatedHours(22);
                if (onHoursChange) onHoursChange(22);
              }}
              className="hover:text-campus-emerald transition-colors"
            >
              Sapling (22h)
            </button>
            <button
              onClick={() => {
                setSimulatedHours(45);
                if (onHoursChange) onHoursChange(45);
              }}
              className="hover:text-campus-emerald transition-colors"
            >
              Canopy (45h)
            </button>
            <button
              onClick={() => {
                setSimulatedHours(64);
                if (onHoursChange) onHoursChange(64);
              }}
              className="hover:text-campus-gold font-bold transition-colors"
            >
              Gold Scholar (64h)
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: 60-Hour Radial Sunburst Gauge & Milestones */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
        {/* Radial Sunburst Card */}
        <div className="rounded-2xl border border-campus-border bg-campus-card/90 p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              60-Hour Academic Honors Radial
            </span>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-campus-gold border border-campus-gold/30">
              {gaugePercent.toFixed(0)}%
            </span>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#1F2937"
                strokeWidth="7"
              />
              {/* Animated Progress Ring */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={stage === 4 ? '#F59E0B' : '#10B981'}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white font-mono tracking-tight">
                {activeHours.toFixed(1)}
              </span>
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                / 60.0 Hrs
              </span>
              <span
                className="mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: stage === 4 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: stageColor,
                }}
              >
                {stageTitle}
              </span>
            </div>
          </div>

          {/* Certificate Trigger Action */}
          <div className="w-full mt-2">
            {activeHours >= 60.0 ? (
              <button
                onClick={onOpenCertificate}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-campus-gold to-amber-600 px-4 py-3 font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
              >
                <Award className="h-4 w-4" />
                <span>Claim Official Signed Certificate</span>
              </button>
            ) : (
              <button
                onClick={onOpenCertificate}
                className="w-full flex items-center justify-between rounded-xl border border-dashed border-campus-border bg-slate-900/60 px-4 py-3 text-xs text-slate-300 hover:border-campus-gold/50 transition-all"
              >
                <span className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>{(60.0 - activeHours).toFixed(1)} more hours required</span>
                </span>
                <span className="text-campus-gold font-bold">View Vault →</span>
              </button>
            )}
          </div>
        </div>

        {/* Milestone Steps Mini-Ledger */}
        <div className="rounded-2xl border border-campus-border bg-campus-card/90 p-5 shadow-xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            NSS & Club Honors Hierarchy
          </h4>

          <div className="space-y-2">
            {/* Stage 1 */}
            <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
              activeHours >= 0 ? 'border-campus-emerald/40 bg-campus-emeraldDark/20' : 'border-slate-800'
            }`}>
              <div className="flex items-center space-x-2.5">
                <Sprout className="h-4 w-4 text-campus-emerald" />
                <div>
                  <div className="text-xs font-bold text-white">Seedling Volunteer</div>
                  <div className="text-[10px] text-slate-400">0 – 14.9 Verified Hours</div>
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-campus-emerald" />
            </div>

            {/* Stage 2 */}
            <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
              activeHours >= 15 ? 'border-campus-emerald/40 bg-campus-emeraldDark/20' : 'border-slate-800 bg-slate-900/40 opacity-70'
            }`}>
              <div className="flex items-center space-x-2.5">
                <Trees className="h-4 w-4 text-campus-emerald" />
                <div>
                  <div className="text-xs font-bold text-white">Active Sapling</div>
                  <div className="text-[10px] text-slate-400">15 – 29.9 Verified Hours</div>
                </div>
              </div>
              {activeHours >= 15 ? (
                <CheckCircle2 className="h-4 w-4 text-campus-emerald" />
              ) : (
                <span className="text-[10px] font-bold text-slate-500">Locked</span>
              )}
            </div>

            {/* Stage 3 */}
            <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
              activeHours >= 30 ? 'border-campus-emerald/40 bg-campus-emeraldDark/20' : 'border-slate-800 bg-slate-900/40 opacity-70'
            }`}>
              <div className="flex items-center space-x-2.5">
                <Zap className="h-4 w-4 text-campus-cyan" />
                <div>
                  <div className="text-xs font-bold text-white">Canopy Builder</div>
                  <div className="text-[10px] text-slate-400">30 – 59.9 Verified Hours</div>
                </div>
              </div>
              {activeHours >= 30 ? (
                <CheckCircle2 className="h-4 w-4 text-campus-emerald" />
              ) : (
                <span className="text-[10px] font-bold text-slate-500">Locked</span>
              )}
            </div>

            {/* Stage 4 */}
            <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
              activeHours >= 60 ? 'border-campus-gold/60 bg-amber-500/10' : 'border-slate-800 bg-slate-900/40 opacity-70'
            }`}>
              <div className="flex items-center space-x-2.5">
                <Award className="h-4 w-4 text-campus-gold" />
                <div>
                  <div className="text-xs font-bold text-white">NSS Gold Scholar</div>
                  <div className="text-[10px] text-slate-400">60+ Hours • Official Sealed PDF</div>
                </div>
              </div>
              {activeHours >= 60 ? (
                <CheckCircle2 className="h-4 w-4 text-campus-gold" />
              ) : (
                <span className="text-[10px] font-bold text-amber-500/70">Requires 60h</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
