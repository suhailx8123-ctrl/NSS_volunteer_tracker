package com.campus.volunteering.repository;

import com.campus.volunteering.model.AttendanceLog;
import com.campus.volunteering.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {

    List<AttendanceLog> findByStudentId(Long studentId);

    List<AttendanceLog> findByEventId(Long eventId);

    Optional<AttendanceLog> findByStudentIdAndEventId(Long studentId, Long eventId);

    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);

    List<AttendanceLog> findByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    List<AttendanceLog> findByEventIdAndStatusNot(Long eventId, AttendanceStatus status);

    List<AttendanceLog> findByEventIdOrderByRegisteredAtAsc(Long eventId);
}
