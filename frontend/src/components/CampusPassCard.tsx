'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Heart,
  Leaf,
  MapPin,
  Radio,
  Ticket,
  Users,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { ActivityEvent, ClubCategory } from '@/types';
import { formatDate } from '@/lib/utils';

interface CampusPassCardProps {
  event: ActivityEvent;
  onRegister: (eventId: number) => Promise<void>;
  isRegistered?: boolean;
}

export const CampusPassCard: React.FC<CampusPassCardProps> = ({
  event,
  onRegister,
  isRegistered = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(isRegistered);
  const [showStamp, setShowStamp] = useState(isRegistered);

  const capacityPercent = Math.min(100, (event.registeredCount / event.maxParticipants) * 100);

  const handleClaim = async () => {
    if (registered || loading) return;
    setLoading(true);
    try {
      await onRegister(event.id);
      setRegistered(true);
      setShowStamp(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Thematic Category Details
  const getCategoryStyles = (category: ClubCategory) => {
    switch (category) {
      case 'ENVIRONMENT_ECO':
        return {
          badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
          accent: '#10B981',
          borderHover: 'hover:border-emerald-500/60',
          gradient: 'from-emerald-900/30 via-slate-900/40 to-slate-950',
          tag: 'Nature & Climate Stewardship',
        };
      case 'HEALTH_WELFARE':
        return {
          badge: 'bg-rose-950/70 text-rose-300 border-rose-500/40',
          accent: '#F43F5E',
          borderHover: 'hover:border-rose-500/60',
          gradient: 'from-rose-950/30 via-slate-900/40 to-slate-950',
          tag: 'Blood Donation & Public Health',
        };
      case 'TECH_SOCIAL':
        return {
          badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40',
          accent: '#06B6D4',
          borderHover: 'hover:border-cyan-500/60',
          gradient: 'from-cyan-950/30 via-slate-900/40 to-slate-950',
          tag: 'Digital Literacy & IEDC Innovation',
        };
      case 'NSS_COMMUNITY':
      default:
        return {
          badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-500/40',
          accent: '#6366F1',
          borderHover: 'hover:border-indigo-500/60',
          gradient: 'from-indigo-950/30 via-slate-900/40 to-slate-950',
          tag: 'NSS Model Village Outreach',
        };
    }
  };

  const style = getCategoryStyles(event.club.category);

  return (
    <div
      className={`group relative flex flex-col md:flex-row rounded-2xl border border-campus-border bg-gradient-to-r ${style.gradient} shadow-lg transition-all duration-300 ${style.borderHover} overflow-hidden`}
    >
      {/* Category Micro-Animation Header Decorations */}
      <div className="absolute top-0 right-0 p-3 pointer-events-none opacity-40">
        {event.club.category === 'ENVIRONMENT_ECO' && (
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [-8, 8, -8] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Leaf className="h-6 w-6 text-campus-emerald" />
          </motion.div>
        )}

        {event.club.category === 'HEALTH_WELFARE' && (
          <motion.div
            animate={{ scale: [1, 1.15, 1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
          </motion.div>
        )}

        {event.club.category === 'NSS_COMMUNITY' && (
          <div className="relative flex h-6 w-6 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
            <Radio className="h-5 w-5 text-indigo-400" />
          </div>
        )}

        {event.club.category === 'TECH_SOCIAL' && (
          <motion.div
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Cpu className="h-6 w-6 text-cyan-400" />
          </motion.div>
        )}
      </div>

      {/* LEFT SECTION: Event Citation Details */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${style.badge}`}>
              {event.club.unitCode}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {event.club.name}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-[11px] text-amber-400/90 font-medium">
              Advisor: {event.club.facultyAdvisor}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
            {event.title}
          </h3>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Metadata Badges */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800/80 pt-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">{formatDate(event.eventDate)}</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-campus-gold font-bold">
            <Clock className="h-4 w-4 text-campus-gold shrink-0" />
            <span>+{event.durationHours.toFixed(1)} Verified Hrs</span>
          </div>
        </div>

        {/* Liquid Capacity Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Users className="h-3.5 w-3.5" />
              <span>Roster Capacity</span>
            </span>
            <span className="font-mono font-medium text-slate-300">
              {event.registeredCount} / {event.maxParticipants} Volunteers
            </span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor:
                  capacityPercent >= 90
                    ? '#EF4444'
                    : capacityPercent >= 70
                    ? '#F59E0B'
                    : '#10B981',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${capacityPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* DASHED PERFORATION LINE WITH NOTCHES */}
      <div className="relative flex md:flex-col items-center justify-center">
        {/* Top/Left notch */}
        <div className="hidden md:block absolute -top-3 w-6 h-6 bg-campus-bg rounded-full border-b border-campus-border" />
        {/* Dashed line */}
        <div className="w-full md:w-0 md:h-full border-t-2 md:border-t-0 md:border-l-2 border-dashed border-campus-border/80 my-2 md:my-0" />
        {/* Bottom/Right notch */}
        <div className="hidden md:block absolute -bottom-3 w-6 h-6 bg-campus-bg rounded-full border-t border-campus-border" />
      </div>

      {/* RIGHT SECTION: Physical Perforated Ticket Stub */}
      <motion.div
        className="w-full md:w-56 p-6 flex flex-col justify-between items-center bg-slate-900/60 relative overflow-hidden"
        animate={
          registered
            ? {
                rotate: 2.5,
                x: 4,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }
            : { rotate: 0, x: 0 }
        }
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <div className="text-center w-full">
          <div className="flex items-center justify-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Ticket className="h-3.5 w-3.5 text-campus-gold" />
            <span>Campus Pass Stub</span>
          </div>
          <div className="font-mono text-xs text-slate-500 mt-0.5">
            #PASS-{event.id.toString().padStart(4, '0')}
          </div>
        </div>

        {/* The Slamming Rubber Stamp Seal */}
        <div className="relative my-4 flex items-center justify-center min-h-[70px] w-full">
          <AnimatePresence>
            {showStamp ? (
              <motion.div
                initial={{ scale: 2.4, rotate: -25, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 550,
                  damping: 18,
                }}
                className="relative rounded-lg border-2 border-campus-emerald bg-emerald-950/80 px-4 py-2 text-center shadow-lg shadow-emerald-950/60"
              >
                <div className="text-xs font-black tracking-widest text-campus-emerald uppercase font-mono">
                  REGISTERED ✓
                </div>
                <div className="text-[9px] font-bold text-emerald-300/80 mt-0.5">
                  PASS ALLOCATED
                </div>
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-black font-mono text-white">
                  +{event.durationHours.toFixed(1)}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Service Credit
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Claim Ticket Action Button */}
        <div className="w-full">
          {registered ? (
            <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-campus-emerald py-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Pass Confirmed</span>
            </div>
          ) : (
            <button
              onClick={handleClaim}
              disabled={loading || event.registeredCount >= event.maxParticipants}
              className="w-full rounded-xl bg-gradient-to-r from-campus-emerald to-emerald-600 px-3 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Stamping...'
                : event.registeredCount >= event.maxParticipants
                ? 'Camp Full'
                : 'Claim Volunteer Pass'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
