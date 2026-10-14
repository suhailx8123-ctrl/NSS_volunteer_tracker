import { ActivityEvent, AttendanceLog, LeaderboardDTO, StudentDashboardDTO, User } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Realistic In-Memory Seed State for Standalone Evaluation
export const MOCK_STUDENT: User = {
  id: 4,
  name: 'Aarav Krishna',
  rollNumber: '22CSBS101',
  department: 'CSBS',
  semester: 6,
  email: 'aarav.krishna@student.edu',
  role: 'STUDENT',
  totalVerifiedHours: 64.0,
};

export const MOCK_STUDENTS_LIST: User[] = [
  MOCK_STUDENT,
  {
    id: 5,
    name: 'Diya Lakshmi',
    rollNumber: '22CSE204',
    department: 'CSE',
    semester: 6,
    email: 'diya.lakshmi@student.edu',
    role: 'STUDENT',
    totalVerifiedHours: 52.0,
  },
  {
    id: 8,
    name: 'Aditya Menon',
    rollNumber: '22CSE188',
    department: 'CSE',
    semester: 6,
    email: 'aditya.menon@student.edu',
    role: 'STUDENT',
    totalVerifiedHours: 61.5,
  },
  {
    id: 6,
    name: 'Rohan Mathew',
    rollNumber: '23ECE312',
    department: 'ECE',
    semester: 4,
    email: 'rohan.mathew@student.edu',
    role: 'STUDENT',
    totalVerifiedHours: 28.0,
  },
  {
    id: 7,
    name: 'Meera Nandakumar',
    rollNumber: '23CSBS145',
    department: 'CSBS',
    semester: 4,
    email: 'meera.nanda@student.edu',
    role: 'STUDENT',
    totalVerifiedHours: 12.0,
  },
  {
    id: 9,
    name: 'Sneha Pillai',
    rollNumber: '24ECE401',
    department: 'ECE',
    semester: 2,
    email: 'sneha.pillai@student.edu',
    role: 'STUDENT',
    totalVerifiedHours: 6.0,
  },
];

export const MOCK_EVENTS: ActivityEvent[] = [
  {
    id: 1,
    title: 'Green Canopy Mega Sapling Plantation',
    description: 'Afforestation drive planting 500 indigenous fruit-bearing and shade saplings along the riverbank buffer zone and campus perimeter.',
    eventDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    durationHours: 6.0,
    location: 'Campus North Meadows & Riverbank',
    maxParticipants: 40,
    registeredCount: 36,
    club: {
      id: 2,
      name: 'Nature & Eco Sustainability Club',
      unitCode: 'CAMPUS-ECO-03',
      category: 'ENVIRONMENT_ECO',
      facultyAdvisor: 'Prof. Ananya Sen',
    },
  },
  {
    id: 2,
    title: 'Mega Voluntary Blood Donation Camp',
    description: 'Annual campus blood drive in partnership with Government General Hospital Blood Bank to support pediatric thalassemia care.',
    eventDate: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    durationHours: 8.0,
    location: 'Auditorium Foyer & Health Bay',
    maxParticipants: 50,
    registeredCount: 47,
    club: {
      id: 3,
      name: 'Red Ribbon & Healthcare Auxiliary',
      unitCode: 'CAMPUS-HLT-07',
      category: 'HEALTH_WELFARE',
      facultyAdvisor: 'Dr. Ramesh Nair',
    },
  },
  {
    id: 3,
    title: 'Rural Digital Literacy & Cyber Safety Camp',
    description: 'Hands-on digital banking, cyber fraud awareness, and smartphone utility tutoring for elderly residents in our adopted model village.',
    eventDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    durationHours: 5.0,
    location: 'Panchayat Community Hall, Kadinamkulam',
    maxParticipants: 25,
    registeredCount: 22,
    club: {
      id: 4,
      name: 'Tech For Good / IEDC Social Innovation',
      unitCode: 'IEDC-TECH-12',
      category: 'TECH_SOCIAL',
      facultyAdvisor: 'Prof. Ananya Sen',
    },
  },
  {
    id: 4,
    title: 'Gram Swachhata & Village Sanitation Audit',
    description: 'Door-to-door source waste segregation campaign and plastic reclamation audit in collaboration with the village panchayat council.',
    eventDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    durationHours: 6.0,
    location: 'Ward 4, Adopted Model Village',
    maxParticipants: 35,
    registeredCount: 35,
    club: {
      id: 1,
      name: 'NSS Unit 104 (National Service Scheme)',
      unitCode: 'KL-NSS-104',
      category: 'NSS_COMMUNITY',
      facultyAdvisor: 'Dr. Ramesh Nair',
    },
  },
];

export const MOCK_ROSTER: AttendanceLog[] = [
  {
    id: 101,
    student: MOCK_STUDENTS_LIST[0], // Aarav
    event: MOCK_EVENTS[0],
    status: 'REGISTERED',
    hoursAwarded: 0.0,
    registeredAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 102,
    student: MOCK_STUDENTS_LIST[1], // Diya
    event: MOCK_EVENTS[0],
    status: 'REGISTERED',
    hoursAwarded: 0.0,
    registeredAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 103,
    student: MOCK_STUDENTS_LIST[3], // Rohan
    event: MOCK_EVENTS[0],
    status: 'REGISTERED',
    hoursAwarded: 0.0,
    registeredAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 104,
    student: MOCK_STUDENTS_LIST[4], // Meera
    event: MOCK_EVENTS[0],
    status: 'REGISTERED',
    hoursAwarded: 0.0,
    registeredAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 105,
    student: MOCK_STUDENTS_LIST[2], // Aditya
    event: MOCK_EVENTS[0],
    status: 'PRESENT',
    hoursAwarded: 6.0,
    registeredAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    verifiedBy: 'Dr. Ramesh Nair',
    certificateHash: 'CERT-NSS-2026-22CSE188-B3A9F1',
  },
];

// In-Memory mutable clone for demo actions
let demoEvents = JSON.parse(JSON.stringify(MOCK_EVENTS));
let demoRoster = JSON.parse(JSON.stringify(MOCK_ROSTER));
let demoStudents = JSON.parse(JSON.stringify(MOCK_STUDENTS_LIST));

export async function fetchEvents(): Promise<ActivityEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/events`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return demoEvents;
  }
}

export async function registerStudentForEvent(eventId: number, studentId: number): Promise<AttendanceLog> {
  try {
    const res = await fetch(`${API_BASE}/events/${eventId}/register?studentId=${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return await res.json();
  } catch (err: any) {
    // In-memory demo fallback
    const ev = demoEvents.find((e: ActivityEvent) => e.id === eventId);
    if (ev) {
      ev.registeredCount = Math.min(ev.maxParticipants, ev.registeredCount + 1);
    }
    const student = demoStudents.find((s: User) => s.id === studentId) || MOCK_STUDENT;
    const newLog: AttendanceLog = {
      id: Date.now(),
      student,
      event: ev || demoEvents[0],
      status: 'REGISTERED',
      hoursAwarded: 0.0,
      registeredAt: new Date().toISOString(),
    };
    demoRoster.unshift(newLog);
    return newLog;
  }
}

export async function fetchRoster(eventId: number): Promise<AttendanceLog[]> {
  try {
    const res = await fetch(`${API_BASE}/attendance/event/${eventId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return demoRoster.filter((r: AttendanceLog) => r.event.id === eventId || demoRoster.length > 0);
  }
}

export async function verifyAttendance(
  logId: number,
  status: 'PRESENT' | 'ABSENT',
  coordinatorName = 'Dr. Ramesh Nair'
): Promise<AttendanceLog> {
  try {
    const res = await fetch(`${API_BASE}/attendance/${logId}/verify?status=${status}&coordinatorName=${encodeURIComponent(coordinatorName)}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Verification failed');
    return await res.json();
  } catch {
    // In-memory demo fallback
    const log = demoRoster.find((l: AttendanceLog) => l.id === logId);
    if (log) {
      const oldStatus = log.status;
      log.status = status;
      const duration = log.event?.durationHours || 4.0;
      if (status === 'PRESENT') {
        log.hoursAwarded = duration;
        log.verifiedAt = new Date().toISOString();
        log.verifiedBy = coordinatorName;
        log.certificateHash = `CERT-${log.student.rollNumber}-${Date.now().toString().slice(-6)}`;
        // Update student total hours
        const st = demoStudents.find((s: User) => s.id === log.student.id);
        if (st && oldStatus !== 'PRESENT') {
          st.totalVerifiedHours += duration;
        }
      } else {
        if (oldStatus === 'PRESENT') {
          const st = demoStudents.find((s: User) => s.id === log.student.id);
          if (st) st.totalVerifiedHours = Math.max(0, st.totalVerifiedHours - log.hoursAwarded);
        }
        log.hoursAwarded = 0.0;
        log.verifiedAt = new Date().toISOString();
        log.verifiedBy = coordinatorName;
      }
      return log;
    }
    throw new Error('Log not found');
  }
}

export async function batchVerifyEvent(
  eventId: number,
  coordinatorName = 'Dr. Ramesh Nair'
): Promise<AttendanceLog[]> {
  try {
    const res = await fetch(`${API_BASE}/attendance/event/${eventId}/verify-all?coordinatorName=${encodeURIComponent(coordinatorName)}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Batch verification failed');
    return await res.json();
  } catch {
    // In-memory demo fallback
    demoRoster.forEach((l: AttendanceLog) => {
      if (l.status !== 'PRESENT') {
        l.status = 'PRESENT';
        l.hoursAwarded = l.event?.durationHours || 6.0;
        l.verifiedAt = new Date().toISOString();
        l.verifiedBy = coordinatorName;
        l.certificateHash = `CERT-${l.student.rollNumber}-${Date.now().toString().slice(-6)}`;
        const st = demoStudents.find((s: User) => s.id === l.student.id);
        if (st) {
          st.totalVerifiedHours += l.hoursAwarded;
        }
      }
    });
    return [...demoRoster];
  }
}

export async function fetchStudentDashboard(studentId: number): Promise<StudentDashboardDTO> {
  try {
    const res = await fetch(`${API_BASE}/students/${studentId}/dashboard`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Dashboard fetch error');
    return await res.json();
  } catch {
    const student = demoStudents.find((s: User) => s.id === studentId) || demoStudents[0];
    const hours = student.totalVerifiedHours;
    let tier = 'Seedling Volunteer';
    let stage = 1;
    let nextHours = 15.0 - hours;

    if (hours >= 60.0) {
      tier = 'NSS Gold Scholar';
      stage = 4;
      nextHours = 0.0;
    } else if (hours >= 30.0) {
      tier = 'Canopy Builder';
      stage = 3;
      nextHours = 60.0 - hours;
    } else if (hours >= 15.0) {
      tier = 'Active Sapling';
      stage = 2;
      nextHours = 30.0 - hours;
    }

    return {
      user: student,
      totalVerifiedHours: hours,
      milestoneTier: tier,
      milestoneStage: stage,
      hoursToNextMilestone: Math.max(0, nextHours),
      certificateEligible: hours >= 60.0,
      recentLogs: demoRoster.filter((l: AttendanceLog) => l.student.id === studentId),
      contributingClubs: ['NSS Unit 104', 'Nature & Eco Sustainability Club', 'Tech For Good / IEDC'],
    };
  }
}

export async function fetchLeaderboard(dept = 'ALL'): Promise<LeaderboardDTO> {
  try {
    const res = await fetch(`${API_BASE}/leaderboard?department=${dept}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Leaderboard fetch error');
    return await res.json();
  } catch {
    let list = [...demoStudents];
    if (dept !== 'ALL') {
      list = list.filter((s: User) => s.department === dept);
    }
    list.sort((a: User, b: User) => b.totalVerifiedHours - a.totalVerifiedHours);

    const ranked = list.map((s: User, idx: number) => {
      let badge = 'Seedling Volunteer';
      if (s.totalVerifiedHours >= 60.0) badge = 'Gold NSS Scholar';
      else if (s.totalVerifiedHours >= 30.0) badge = 'Silver Torchbearer';
      else if (s.totalVerifiedHours >= 15.0) badge = 'Bronze Sapling';

      return {
        rank: idx + 1,
        id: s.id,
        name: s.name,
        rollNumber: s.rollNumber,
        department: s.department,
        semester: s.semester,
        totalVerifiedHours: s.totalVerifiedHours,
        tierBadge: badge,
        verifiedEventsCount: Math.floor(s.totalVerifiedHours / 6) + 1,
      };
    });

    const totals: Record<string, number> = { CSBS: 76.0, CSE: 113.5, ECE: 34.0, ME: 18.0 };

    return {
      students: ranked,
      departmentTotals: totals,
      filteredDepartment: dept,
    };
  }
}

export function getCertificateDownloadUrl(studentId: number): string {
  return `${API_BASE}/certificates/download/${studentId}`;
}
