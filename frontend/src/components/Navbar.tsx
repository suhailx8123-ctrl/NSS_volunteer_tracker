'use client';

import React from 'react';
import { Compass, HeartHandshake, ShieldCheck, Sparkles, UserCheck, ScrollText } from 'lucide-react';
import { User } from '@/types';
import { MOCK_STUDENTS_LIST } from '@/lib/api';

interface NavbarProps {
  activeTab: 'student' | 'events' | 'coordinator' | 'leaderboard';
  setActiveTab: (tab: 'student' | 'events' | 'coordinator' | 'leaderboard') => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  onOpenCertificate: () => void;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  onOpenCertificate,
  isBackendConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-campus-border/80 bg-campus-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-campus-emerald to-campus-goldDark p-0.5 shadow-lg shadow-campus-emerald/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-campus-bg">
              <HeartHandshake className="h-6 w-6 text-campus-emerald" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-campus-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-campus-gold"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">CampusImpact</span>
              <span className="rounded-full bg-campus-emeraldDark/60 px-2 py-0.5 text-[10px] font-semibold text-campus-emerald border border-campus-emerald/30">
                NSS & IEDC Tracker
              </span>
            </div>
            <p className="text-xs text-slate-400">Volunteering Hours & Academic Honors Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center rounded-xl border border-campus-border bg-campus-card/80 p-1">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'student'
                ? 'bg-gradient-to-r from-campus-emeraldDark to-emerald-900 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-campus-emerald" />
            <span>Student Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-campus-emeraldDark to-emerald-900 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-campus-cyan" />
            <span>Events Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('coordinator')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'coordinator'
                ? 'bg-gradient-to-r from-campus-emeraldDark to-emerald-900 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-campus-gold" />
            <span>Coordinator Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-campus-emeraldDark to-emerald-900 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </button>
        </nav>

        {/* Right Actions: Certificate Vault & Profile Switcher */}
        <div className="flex items-center space-x-3">
          {/* Certificate Button */}
          <button
            onClick={onOpenCertificate}
            className={`group relative flex items-center space-x-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-md ${
              currentUser.totalVerifiedHours >= 60.0
                ? 'bg-gradient-to-r from-campus-gold to-amber-600 text-slate-950 hover:brightness-110 shadow-amber-500/20'
                : 'border border-campus-gold/30 bg-campus-card text-amber-300 hover:border-campus-gold/60'
            }`}
          >
            <ScrollText className="h-4 w-4" />
            <span className="hidden sm:inline">Official Certificate</span>
            <span className="flex h-5 items-center justify-center rounded-full bg-slate-950/40 px-1.5 text-[11px] font-bold text-amber-200">
              {currentUser.totalVerifiedHours.toFixed(1)}h
            </span>
          </button>

          {/* Persona Switcher for Quick Evaluation */}
          <div className="flex items-center space-x-2 rounded-xl border border-campus-border bg-campus-card px-2.5 py-1.5">
            <span className="text-[11px] font-medium text-slate-400 hidden lg:inline">Active:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = MOCK_STUDENTS_LIST.find((s) => s.id === Number(e.target.value));
                if (selected) setCurrentUser(selected);
              }}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              {MOCK_STUDENTS_LIST.map((s) => (
                <option key={s.id} value={s.id} className="bg-campus-bg text-slate-200">
                  {s.name} ({s.department} • {s.totalVerifiedHours.toFixed(1)}h)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
