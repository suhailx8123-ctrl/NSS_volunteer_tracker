-- ============================================================================
-- STUDENT CLUB & VOLUNTEERING HOUR TRACKER - SUPABASE POSTGRESQL SCHEMA
-- Designed for College Clubs, NSS Units, IEDC, and Campus Drives
-- ============================================================================

-- 1. Create Enums if not existing (or check constraints)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('STUDENT', 'COORDINATOR', 'ADMIN');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'club_category') THEN
        CREATE TYPE club_category AS ENUM ('NSS_COMMUNITY', 'ENVIRONMENT_ECO', 'HEALTH_WELFARE', 'TECH_SOCIAL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('REGISTERED', 'PRESENT', 'ABSENT');
    END IF;
END $$;

-- 2. Drop existing tables if re-initializing cleanly
DROP TABLE IF EXISTS attendance_logs CASCADE;
DROP TABLE IF EXISTS activity_events CASCADE;
DROP TABLE IF EXISTS clubs_or_units CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 3. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    semester INTEGER CHECK (semester >= 1 AND semester <= 8),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
    total_verified_hours DOUBLE PRECISION NOT NULL DEFAULT 0.0 CHECK (total_verified_hours >= 0.0),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Clubs / Units Table
CREATE TABLE clubs_or_units (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    unit_code VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    faculty_advisor VARCHAR(255) NOT NULL,
    coordinator_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Activity Events Table
CREATE TABLE activity_events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    event_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    duration_hours DOUBLE PRECISION NOT NULL CHECK (duration_hours > 0.0),
    location VARCHAR(255) NOT NULL,
    max_participants INTEGER NOT NULL CHECK (max_participants > 0),
    registered_count INTEGER NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
    club_id BIGINT NOT NULL REFERENCES clubs_or_units(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Attendance Logs Table (with strict UNIQUE composite constraint)
CREATE TABLE attendance_logs (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES activity_events(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'REGISTERED',
    hours_awarded DOUBLE PRECISION NOT NULL DEFAULT 0.0 CHECK (hours_awarded >= 0.0),
    registered_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITHOUT TIME ZONE,
    verified_by VARCHAR(255),
    certificate_hash VARCHAR(255),
    CONSTRAINT unique_student_event UNIQUE (student_id, event_id)
);

-- 7. Performance & Search Indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_roll_number ON users(roll_number);
CREATE INDEX idx_events_date ON activity_events(event_date);
CREATE INDEX idx_events_club_id ON activity_events(club_id);
CREATE INDEX idx_logs_student_id ON attendance_logs(student_id);
CREATE INDEX idx_logs_event_id ON attendance_logs(event_id);
CREATE INDEX idx_logs_status ON attendance_logs(status);

-- 8. Enable Supabase Realtime for instant frontend synchronisation
ALTER PUBLICATION supabase_realtime ADD TABLE activity_events;
ALTER PUBLICATION supabase_realtime ADD TABLE attendance_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE users;

-- ============================================================================
-- SEED DATA: Realistic College Clubs, Drives, Coordinators & Students
-- ============================================================================

-- Insert Coordinators and Students (Passwords are BCrypt hashed for 'Password@123')
-- Hash: $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG
INSERT INTO users (name, roll_number, department, semester, email, password, role, total_verified_hours) VALUES
('Dr. Ramesh Nair', 'FAC-NSS-01', 'CSE', 0, 'ramesh.nss@campus.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG', 'COORDINATOR', 120.0),
('Prof. Ananya Sen', 'FAC-ECO-02', 'CSBS', 0, 'ananya.eco@campus.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG', 'COORDINATOR', 95.0),
('Dr. Vikramaditya Rao', 'FAC-ADM-01', 'ECE', 0, 'admin.dean@campus.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG', 'ADMIN', 150.0),
-- Top Performing Gold Scholars & Active Volunteers
('Aarav Krishna', '22CSBS101', 'CSBS', 6, 'aarav.krishna@student.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG', 'STUDENT', 64.0),
('Diya Lakshmi', '22CSE204', 'CSE', 6, 'diya.lakshmi@student.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG', 'STUDENT', 52.0),
('Rohan Mathew', '23ECE312', 'ECE', 4, 'rohan.mathew@student.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG', 'STUDENT', 28.0),
('Meera Nandakumar', '23CSBS145', 'CSBS', 4, 'meera.nanda@student.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG', 'STUDENT', 12.0),
('Aditya Menon', '22CSE188', 'CSE', 6, 'aditya.menon@student.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG', 'STUDENT', 61.5),
('Sneha Pillai', '24ECE401', 'ECE', 2, 'sneha.pillai@student.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5K1xWw3q4sO8hO9QxZlH1k3C1mG', 'STUDENT', 6.0);

-- Insert Clubs / Units
INSERT INTO clubs_or_units (name, unit_code, category, faculty_advisor, coordinator_id) VALUES
('NSS Unit 104 (National Service Scheme)', 'KL-NSS-104', 'NSS_COMMUNITY', 'Dr. Ramesh Nair', 1),
('Nature & Eco Sustainability Club', 'CAMPUS-ECO-03', 'ENVIRONMENT_ECO', 'Prof. Ananya Sen', 2),
('Red Ribbon & Healthcare Auxiliary', 'CAMPUS-HLT-07', 'HEALTH_WELFARE', 'Dr. Ramesh Nair', 1),
('Tech For Good / IEDC Social Innovation', 'IEDC-TECH-12', 'TECH_SOCIAL', 'Prof. Ananya Sen', 2);

-- Insert Activity Events
INSERT INTO activity_events (title, description, event_date, duration_hours, location, max_participants, registered_count, club_id) VALUES
('Green Canopy Mega Sapling Plantation', 'Afforestation initiative planting 500 indigenous fruit-bearing and shade saplings across the riverbank buffer zone and campus perimeter.', CURRENT_TIMESTAMP + INTERVAL '3 days', 6.0, 'Campus North Meadows & Riverbank', 40, 5, 2),
('Mega Voluntary Blood Donation Camp', 'Annual campus blood drive in partnership with Government General Hospital Blood Bank to support pediatric thalassemia care.', CURRENT_TIMESTAMP + INTERVAL '6 days', 8.0, 'Auditorium Foyer & Health Bay', 50, 4, 3),
('Rural Digital Literacy & Cyber Safety Camp', 'Hands-on basic digital banking, cyber fraud prevention, and smartphone utility tutoring for elderly villagers in adopted village.', CURRENT_TIMESTAMP + INTERVAL '10 days', 5.0, 'Panchayat Community Hall, Kadinamkulam', 25, 4, 4),
('Gram Swachhata & Waste Audit Drive', 'Village cleanliness drive, source waste segregation campaign, and plastic reclamation audit with local municipal council.', CURRENT_TIMESTAMP - INTERVAL '5 days', 6.0, 'Ward 4, Adopted Model Village', 35, 4, 1),
('Solar Lamp Assembly & Rural Outreach', 'Fabrication of low-cost solar study lamps and distribution to underprivileged high school students preparing for board exams.', CURRENT_TIMESTAMP - INTERVAL '14 days', 8.0, 'FabLab & Electrical Workshop', 30, 3, 4);

-- Insert Sample Attendance Logs
-- Aarav Krishna (Total 64 hrs -> verified in past events)
INSERT INTO attendance_logs (student_id, event_id, status, hours_awarded, registered_at, verified_at, verified_by, certificate_hash) VALUES
(4, 4, 'PRESENT', 6.0, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Dr. Ramesh Nair', 'HASH-NSS-2026-AARAV-4-SWAC'),
(4, 5, 'PRESENT', 8.0, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '14 days', 'Prof. Ananya Sen', 'HASH-IEDC-2026-AARAV-5-SOLR'),
(4, 1, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, NULL),
(4, 2, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, NULL, NULL);

-- Diya Lakshmi (Total 52 hrs)
INSERT INTO attendance_logs (student_id, event_id, status, hours_awarded, registered_at, verified_at, verified_by, certificate_hash) VALUES
(5, 4, 'PRESENT', 6.0, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Dr. Ramesh Nair', 'HASH-NSS-2026-DIYA-4-SWAC'),
(5, 1, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, NULL, NULL),
(5, 2, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, NULL),
(5, 3, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, NULL);

-- Rohan Mathew (Total 28 hrs)
INSERT INTO attendance_logs (student_id, event_id, status, hours_awarded, registered_at, verified_at, verified_by, certificate_hash) VALUES
(6, 4, 'PRESENT', 6.0, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Dr. Ramesh Nair', 'HASH-NSS-2026-ROHAN-4-SWAC'),
(6, 5, 'PRESENT', 8.0, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '14 days', 'Prof. Ananya Sen', 'HASH-IEDC-2026-ROHAN-5-SOLR'),
(6, 1, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, NULL, NULL);

-- Meera Nandakumar (Total 12 hrs)
INSERT INTO attendance_logs (student_id, event_id, status, hours_awarded, registered_at, verified_at, verified_by, certificate_hash) VALUES
(7, 4, 'PRESENT', 6.0, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Dr. Ramesh Nair', 'HASH-NSS-2026-MEERA-4-SWAC'),
(7, 1, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, NULL),
(7, 3, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, NULL);

-- Aditya Menon (Total 61.5 hrs -> Gold Scholar)
INSERT INTO attendance_logs (student_id, event_id, status, hours_awarded, registered_at, verified_at, verified_by, certificate_hash) VALUES
(8, 4, 'PRESENT', 6.0, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Dr. Ramesh Nair', 'HASH-NSS-2026-ADITYA-4-SWAC'),
(8, 5, 'PRESENT', 8.0, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '14 days', 'Prof. Ananya Sen', 'HASH-IEDC-2026-ADITYA-5-SOLR'),
(8, 2, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, NULL, NULL);

-- Sneha Pillai (Total 6 hrs -> Seedling)
INSERT INTO attendance_logs (student_id, event_id, status, hours_awarded, registered_at, verified_at, verified_by, certificate_hash) VALUES
(9, 1, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, NULL),
(9, 2, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, NULL),
(9, 3, 'REGISTERED', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, NULL);
