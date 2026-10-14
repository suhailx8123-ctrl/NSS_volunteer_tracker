'use client';

import React, { useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Award, Shield, Sparkles, TrendingUp, Users } from 'lucide-react';
import { LeaderboardDTO } from '@/types';

interface LeaderboardProps {
  initialData: LeaderboardDTO;
  onDepartmentSelect?: (dept: string) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  initialData,
  onDepartmentSelect,
}) => {
  const [activeDept, setActiveDept] = useState<string>('ALL');

  const departments = ['ALL', 'CSBS', 'CSE', 'ECE', 'ME'];

  const filteredStudents =
    activeDept === 'ALL'
      ? initialData.students
      : initialData.students.filter((s) => s.department === activeDept);

  const handleDeptClick = (dept: string) => {
    setActiveDept(dept);
    if (onDepartmentSelect) onDepartmentSelect(dept);
  };

  const getTierShield = (hours: number, rank: number) => {
    if (hours >= 60.0 || rank === 1) {
      return {
        name: 'Gold NSS Scholar',
        border: 'border-amber-400/80 bg-amber-500/10 text-amber-300',
        color: '#F59E0B',
      };
    }
    if (hours >= 30.0 || rank <= 3) {
      return {
        name: 'Silver Torchbearer',
        border: 'border-slate-300/80 bg-slate-300/10 text-slate-200',
        color: '#E2E8F0',
      };
    }
    return {
      name: 'Bronze Sapling',
      border: 'border-amber-700/80 bg-amber-700/10 text-amber-500',
      color: '#B45309',
    };
  };

  return (
    <div className="space-y-6">
      {/* Department-wise Aggregated Impact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(initialData.departmentTotals).map(([dept, hours]) => (
          <div
            key={dept}
            onClick={() => handleDeptClick(dept)}
            className={`cursor-pointer rounded-2xl border p-4 transition-all ${
              activeDept === dept
                ? 'border-campus-emerald bg-campus-emeraldDark/20 shadow-lg shadow-emerald-950/40'
                : 'border-campus-border bg-campus-card/90 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold">{dept} Branch</span>
              <Users className="h-3.5 w-3.5" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-white">
              {hours.toFixed(1)} <span className="text-xs font-semibold text-slate-400">HRS</span>
            </div>
            <div className="text-[10px] text-campus-emerald font-semibold mt-1 flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>Collective Outreach Impact</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Leaderboard Card */}
      <div className="rounded-2xl border border-campus-border bg-campus-card shadow-2xl p-6">
        {/* Header and Department Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-campus-border">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-campus-gold">
              <Award className="h-4 w-4" />
              <span>Campus Service Honor Roll</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Inter-Departmental Volunteering Ranks</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Physical layout gliding smoothly promotes students as faculty verify attendance
            </p>
          </div>

          <div className="flex items-center space-x-1 rounded-xl bg-slate-900 border border-campus-border p-1">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => handleDeptClick(dept)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeDept === dept
                    ? 'bg-campus-emerald text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Live Gliding Student List wrapped in LayoutGroup */}
        <div className="mt-6">
          <LayoutGroup>
            <div className="space-y-3">
              {filteredStudents.map((student, index) => {
                const shield = getTierShield(student.totalVerifiedHours, index + 1);

                return (
                  <motion.div
                    key={student.id}
                    layout
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 25,
                    }}
                    className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                      index === 0
                        ? 'border-campus-gold/60 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                        : 'border-campus-border bg-slate-900/60 hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Rank Number & Shield */}
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center justify-center w-8 text-center">
                        <span className="font-mono text-lg font-black text-white">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Custom SVG Service Tier Shield */}
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${shield.border} shadow-inner`}
                      >
                        <Shield className="h-5 w-5" style={{ color: shield.color }} />
                      </div>

                      {/* Name & Academic Credentials */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{student.name}</span>
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                            {student.rollNumber}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {student.department} • Semester {student.semester || 6} •{' '}
                          <span className="text-slate-300 font-medium">{student.verifiedEventsCount} Drives Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Hours & Honor Badge */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-mono text-lg font-black text-campus-gold">
                          {student.totalVerifiedHours.toFixed(1)}{' '}
                          <span className="text-xs font-semibold text-slate-400">HRS</span>
                        </div>
                        <div className="text-[10px] font-bold text-campus-emerald uppercase tracking-wider">
                          {shield.name}
                        </div>
                      </div>

                      {student.totalVerifiedHours >= 60.0 && (
                        <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40" title="Gold Scholar Credential Unlocked">
                          <Sparkles className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
};
