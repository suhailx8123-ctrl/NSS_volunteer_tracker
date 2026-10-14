package com.campus.volunteering.service;

import com.campus.volunteering.dto.StudentDashboardDTO;
import com.campus.volunteering.exception.ResourceNotFoundException;
import com.campus.volunteering.model.AttendanceLog;
import com.campus.volunteering.model.AttendanceStatus;
import com.campus.volunteering.model.User;
import com.campus.volunteering.repository.AttendanceLogRepository;
import com.campus.volunteering.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    @Value("${app.certificate.minimum-hours:60.0}")
    private Double minimumHoursRequired;

    public StudentDashboardDTO getStudentDashboard(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        Double hours = student.getTotalVerifiedHours() != null ? student.getTotalVerifiedHours() : 0.0;
        List<AttendanceLog> logs = attendanceLogRepository.findByStudentId(studentId);

        String tier;
        int stage;
        double nextMilestoneHours;

        if (hours < 15.0) {
            tier = "Seedling Volunteer";
            stage = 1;
            nextMilestoneHours = 15.0 - hours;
        } else if (hours < 30.0) {
            tier = "Active Sapling";
            stage = 2;
            nextMilestoneHours = 30.0 - hours;
        } else if (hours < 60.0) {
            tier = "Canopy Builder";
            stage = 3;
            nextMilestoneHours = 60.0 - hours;
        } else {
            tier = "NSS Gold Scholar";
            stage = 4;
            nextMilestoneHours = 0.0;
        }

        List<String> contributingClubs = logs.stream()
                .filter(log -> log.getStatus() == AttendanceStatus.PRESENT)
                .map(log -> log.getEvent().getClub().getName())
                .distinct()
                .collect(Collectors.toList());

        return StudentDashboardDTO.builder()
                .user(student)
                .totalVerifiedHours(hours)
                .milestoneTier(tier)
                .milestoneStage(stage)
                .hoursToNextMilestone(Math.max(0.0, nextMilestoneHours))
                .certificateEligible(hours >= minimumHoursRequired)
                .recentLogs(logs)
                .contributingClubs(contributingClubs)
                .build();
    }

    public List<User> getAllStudents() {
        return userRepository.findAll();
    }
}
