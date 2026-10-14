'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LivingImpactTree } from '@/components/LivingImpactTree';
import { CampusPassCard } from '@/components/CampusPassCard';
import { CoordinatorLedger } from '@/components/CoordinatorLedger';
import { CertificateModal } from '@/components/CertificateModal';
import { Leaderboard } from '@/components/Leaderboard';
import {
  ActivityEvent,
  AttendanceLog,
  AttendanceStatus,
  LeaderboardDTO,
  User,
} from '@/types';
import {
  fetchEvents,
  fetchLeaderboard,
  fetchRoster,
  registerStudentForEvent,
  verifyAttendance,
  batchVerifyEvent,
  MOCK_STUDENT,
  MOCK_EVENTS,
  MOCK_ROSTER,
} from '@/lib/api';
import { supabase } from '@/lib/supabase';
import {
  TreePine,
  CheckCircle2,
  Compass,
  HeartHandshake,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'student' | 'events' | 'coordinator' | 'leaderboard'>('student');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_STUDENT);
  const [events, setEvents] = useState<ActivityEvent[]>(MOCK_EVENTS);
  const [roster, setRoster] = useState<AttendanceLog[]>(MOCK_ROSTER);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardDTO>({
    students: [],
    departmentTotals: { CSBS: 76.0, CSE: 113.5, ECE: 34.0, ME: 18.0 },
    filteredDepartment: 'ALL',
  });
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Data Load
  const loadInitialData = async () => {
    try {
      const evs = await fetchEvents();
      setEvents(evs);

      const ros = await fetchRoster(1);
      setRoster(ros);

      const lb = await fetchLeaderboard('ALL');
      setLeaderboardData(lb);
    } catch (e) {
      console.log('Using default mock state', e);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Supabase Realtime Channel
    try {
      const channel = supabase
        .channel('campus-live-updates')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'attendance_logs' },
          (payload) => {
            console.log('Realtime log update received:', payload);
            loadInitialData();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'activity_events' },
          (payload) => {
            console.log('Realtime event update received:', payload);
            loadInitialData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.log('Supabase Realtime passive standby:', err);
    }
  }, []);

  // Event Registration Handler
  const handleRegisterEvent = async (eventId: number) => {
    try {
      const log = await registerStudentForEvent(eventId, currentUser.id);
      setRoster((prev) => [log, ...prev]);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, registeredCount: Math.min(e.maxParticipants, e.registeredCount + 1) }
            : e
        )
      );
      showToast(`Pass confirmed for '${log.event.title}'!`);
    } catch (err: any) {
      showToast(err.message || 'Registration issue');
    }
  };

  // Single Attendance Verification Handler
  const handleVerifyAttendance = async (logId: number, status: AttendanceStatus) => {
    try {
      const updated = await verifyAttendance(logId, status, 'Dr. Ramesh Nair');
      setRoster((prev) => prev.map((l) => (l.id === logId ? updated : l)));

      // If updating current active student, refresh hours
      if (updated.student.id === currentUser.id) {
        setCurrentUser((prev) => ({
          ...prev,
          totalVerifiedHours:
            status === 'PRESENT'
              ? prev.totalVerifiedHours + (updated.event?.durationHours || 6.0)
              : Math.max(0, prev.totalVerifiedHours - (updated.hoursAwarded || 6.0)),
        }));
      }

      // Refresh leaderboard data
      const lb = await fetchLeaderboard('ALL');
      setLeaderboardData(lb);

      showToast(
        status === 'PRESENT'
          ? `Verified! Stamped +${updated.hoursAwarded || 6.0} hours.`
          : 'Attendance marked absent (reverted hours).'
      );
    } catch (e: any) {
      showToast(e.message || 'Verification update error');
    }
  };

  // Batch Verification Handler
  const handleBatchVerify = async () => {
    try {
      const updatedRoster = await batchVerifyEvent(1, 'Dr. Ramesh Nair');
      setRoster(updatedRoster);

      // Check if current user is in roster
      const userLog = updatedRoster.find((l) => l.student.id === currentUser.id);
      if (userLog && userLog.status === 'PRESENT') {
        setCurrentUser((prev) => ({
          ...prev,
          totalVerifiedHours: prev.totalVerifiedHours + (userLog.event?.durationHours || 6.0),
        }));
      }

      const lb = await fetchLeaderboard('ALL');
      setLeaderboardData(lb);

      showToast('Staggered domino batch stamp completed successfully!');
    } catch (e: any) {
      showToast(e.message || 'Batch verification error');
    }
  };

  // Filter Events by Category
  const filteredEvents =
    selectedCategory === 'ALL'
      ? events
      : events.filter((e) => e.club.category === selectedCategory);

  return (
    <div className="min-h-screen bg-campus-bg text-campus-parchment flex flex-col justify-between">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-2xl border border-campus-emerald/40 bg-slate-900/95 px-4 py-3 text-xs font-bold text-white shadow-2xl shadow-emerald-950/80 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-campus-emerald" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        isBackendConnected={true}
      />

      {/* Main Workspace Canvas */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {/* TAB 1: STUDENT HUB (Living Tree & 60-Hour Gauge) */}
        {activeTab === 'student' && (
          <div className="space-y-8">
            {/* Student Welcome Banner */}
            <div className="rounded-2xl border border-campus-border bg-gradient-to-r from-slate-900 via-campus-card to-slate-900 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-campus-emerald">
                  <TreePine className="h-4 w-4" />
                  <span>Student Service Stewardship Hub</span>
                </div>
                <h1 className="text-2xl font-black text-white mt-1">
                  Welcome back, {currentUser.name}!
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Department of {currentUser.department} • Roll No: {currentUser.rollNumber} • Semester {currentUser.semester || 6}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="rounded-xl border border-campus-border bg-slate-900/80 px-4 py-2 text-xs">
                  <span className="text-slate-400">Accredited Units:</span>
                  <div className="font-bold text-white mt-0.5">NSS 104 • Eco Club • IEDC</div>
                </div>

                <button
                  onClick={() => setIsCertificateOpen(true)}
                  className="rounded-xl bg-gradient-to-r from-campus-gold to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 transition-all"
                >
                  View Certificate Vault
                </button>
              </div>
            </div>

            {/* Living Impact Tree & Sunburst Gauge */}
            <LivingImpactTree
              currentUser={currentUser}
              onHoursChange={(newHours) => {
                setCurrentUser((prev) => ({ ...prev, totalVerifiedHours: newHours }));
              }}
              onOpenCertificate={() => setIsCertificateOpen(true)}
            />

            {/* Recent Verified Activities Log */}
            <div className="rounded-2xl border border-campus-border bg-campus-card p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-campus-border">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Recent Verified Campus Activities & Drives
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official timestamps, approving faculty advisors, and cryptographic certificate hashes
                  </p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-mono font-bold text-campus-emerald border border-slate-700">
                  {roster.filter((r) => r.status === 'PRESENT').length} Completed
                </span>
              </div>

              <div className="divide-y divide-campus-border/60 mt-2">
                {roster.slice(0, 4).map((log) => (
                  <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{log.event.title}</span>
                        <span className="text-[10px] font-mono text-campus-gold font-bold">
                          +{log.event.durationHours.toFixed(1)} HRS
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {log.event.club.name} • {log.event.location}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      {log.status === 'PRESENT' ? (
                        <div className="text-right">
                          <span className="text-campus-emerald font-bold font-mono">
                            VERIFIED • {log.verifiedBy || 'Dr. Ramesh Nair'}
                          </span>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {log.certificateHash ? log.certificateHash.slice(0, 18) + '...' : 'SEALED'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">Pending Verification</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTS RADAR (Perforated Campus Passes) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-campus-cyan">
                  <Compass className="h-4 w-4" />
                  <span>Events & Drives Radar</span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">Upcoming Campus Volunteering Opportunities</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Claim your official perforated volunteer pass to secure hours towards the 60h academic honor
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-campus-border bg-campus-card p-1">
                {[
                  { id: 'ALL', label: 'All Drives' },
                  { id: 'ENVIRONMENT_ECO', label: '🌱 Eco Club' },
                  { id: 'HEALTH_WELFARE', label: '❤️ Health / Blood' },
                  { id: 'TECH_SOCIAL', label: '⚡ IEDC Tech' },
                  { id: 'NSS_COMMUNITY', label: '🏛️ NSS Unit' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-campus-emerald text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Passes Grid */}
            <div className="grid grid-cols-1 gap-6">
              {filteredEvents.map((event) => (
                <CampusPassCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegisterEvent}
                  isRegistered={roster.some((r) => r.event.id === event.id && r.student.id === currentUser.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COORDINATOR DESK (Ledger & Rubber-Stamp) */}
        {activeTab === 'coordinator' && (
          <div className="space-y-6">
            <CoordinatorLedger
              roster={roster}
              onVerify={handleVerifyAttendance}
              onBatchVerify={handleBatchVerify}
              coordinatorName="Dr. Ramesh Nair"
            />
          </div>
        )}

        {/* TAB 4: LEADERBOARD (LayoutGroup Gliding Ranks) */}
        {activeTab === 'leaderboard' && (
          <Leaderboard initialData={leaderboardData} />
        )}
      </main>

      {/* Official Certificate Vault Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        currentUser={currentUser}
      />

      {/* Global Academic Footer */}
      <footer className="w-full border-t border-campus-border/60 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="h-4 w-4 text-campus-emerald" />
            <span className="font-semibold text-slate-400">CampusImpact System</span>
            <span>• Java Spring Boot 3.x + Supabase Realtime + Next.js 14</span>
          </div>
          <div>
            Adheres to National Service Scheme (NSS) Higher Education Volunteering Guidelines
          </div>
        </div>
      </footer>
    </div>
  );
}
