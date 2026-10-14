package com.campus.volunteering.service;

import com.campus.volunteering.exception.ResourceNotFoundException;
import com.campus.volunteering.model.ActivityEvent;
import com.campus.volunteering.model.AttendanceLog;
import com.campus.volunteering.model.AttendanceStatus;
import com.campus.volunteering.model.User;
import com.campus.volunteering.repository.ActivityEventRepository;
import com.campus.volunteering.repository.AttendanceLogRepository;
import com.campus.volunteering.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceLogRepository attendanceLogRepository;
    private final ActivityEventRepository eventRepository;
    private final UserRepository userRepository;

    public List<AttendanceLog> getRosterByEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Activity event not found with ID: " + eventId);
        }
        return attendanceLogRepository.findByEventIdOrderByRegisteredAtAsc(eventId);
    }

    @Transactional
    public AttendanceLog verifyAttendance(Long logId, AttendanceStatus newStatus, String coordinatorName) {
        AttendanceLog log = attendanceLogRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance log not found with ID: " + logId));

        AttendanceStatus oldStatus = log.getStatus();
        if (oldStatus == newStatus) {
            // Idempotent: nothing to change
            return log;
        }

        User student = log.getStudent();
        ActivityEvent event = log.getEvent();
        Double eventHours = event.getDurationHours();
        String verifier = (coordinatorName != null && !coordinatorName.isBlank()) ? coordinatorName : "Faculty Coordinator";

        if (newStatus == AttendanceStatus.PRESENT) {
            // Transitioning from REGISTERED or ABSENT -> PRESENT
            log.setStatus(AttendanceStatus.PRESENT);
            log.setHoursAwarded(eventHours);
            log.setVerifiedAt(LocalDateTime.now());
            log.setVerifiedBy(verifier);

            String hash = "CERT-" + event.getClub().getUnitCode() + "-" + student.getRollNumber() + "-"
                    + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.setCertificateHash(hash);

            Double currentHours = student.getTotalVerifiedHours() != null ? student.getTotalVerifiedHours() : 0.0;
            student.setTotalVerifiedHours(currentHours + eventHours);
            userRepository.save(student);

        } else if (newStatus == AttendanceStatus.ABSENT) {
            // Transitioning from PRESENT -> ABSENT (mistake correction)
            if (oldStatus == AttendanceStatus.PRESENT) {
                Double hoursToDeduct = log.getHoursAwarded() != null ? log.getHoursAwarded() : eventHours;
                Double currentHours = student.getTotalVerifiedHours() != null ? student.getTotalVerifiedHours() : 0.0;
                student.setTotalVerifiedHours(Math.max(0.0, currentHours - hoursToDeduct));
                userRepository.save(student);
            }
            log.setStatus(AttendanceStatus.ABSENT);
            log.setHoursAwarded(0.0);
            log.setVerifiedAt(LocalDateTime.now());
            log.setVerifiedBy(verifier);

        } else if (newStatus == AttendanceStatus.REGISTERED) {
            // Reverting to registered
            if (oldStatus == AttendanceStatus.PRESENT) {
                Double hoursToDeduct = log.getHoursAwarded() != null ? log.getHoursAwarded() : eventHours;
                Double currentHours = student.getTotalVerifiedHours() != null ? student.getTotalVerifiedHours() : 0.0;
                student.setTotalVerifiedHours(Math.max(0.0, currentHours - hoursToDeduct));
                userRepository.save(student);
            }
            log.setStatus(AttendanceStatus.REGISTERED);
            log.setHoursAwarded(0.0);
            log.setVerifiedAt(null);
            log.setVerifiedBy(null);
            log.setCertificateHash(null);
        }

        return attendanceLogRepository.save(log);
    }

    @Transactional
    public List<AttendanceLog> verifyBatchPresent(Long eventId, String coordinatorName) {
        ActivityEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity event not found with ID: " + eventId));

        List<AttendanceLog> nonPresentLogs = attendanceLogRepository.findByEventIdAndStatusNot(eventId, AttendanceStatus.PRESENT);
        List<AttendanceLog> updatedLogs = new ArrayList<>();
        String verifier = (coordinatorName != null && !coordinatorName.isBlank()) ? coordinatorName : "Faculty Coordinator";

        for (AttendanceLog log : nonPresentLogs) {
            User student = log.getStudent();
            Double eventHours = event.getDurationHours();

            log.setStatus(AttendanceStatus.PRESENT);
            log.setHoursAwarded(eventHours);
            log.setVerifiedAt(LocalDateTime.now());
            log.setVerifiedBy(verifier);

            String hash = "CERT-" + event.getClub().getUnitCode() + "-" + student.getRollNumber() + "-"
                    + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.setCertificateHash(hash);

            Double currentHours = student.getTotalVerifiedHours() != null ? student.getTotalVerifiedHours() : 0.0;
            student.setTotalVerifiedHours(currentHours + eventHours);
            userRepository.save(student);

            updatedLogs.add(attendanceLogRepository.save(log));
        }

        return updatedLogs;
    }
}
