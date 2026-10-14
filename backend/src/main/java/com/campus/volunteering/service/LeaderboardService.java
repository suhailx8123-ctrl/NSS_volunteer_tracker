package com.campus.volunteering.service;

import com.campus.volunteering.dto.LeaderboardDTO;
import com.campus.volunteering.model.AttendanceStatus;
import com.campus.volunteering.model.Role;
import com.campus.volunteering.model.User;
import com.campus.volunteering.repository.AttendanceLogRepository;
import com.campus.volunteering.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    public LeaderboardDTO getLeaderboard(String department) {
        List<User> students;
        if (department != null && !department.isBlank() && !department.equalsIgnoreCase("ALL")) {
            students = userRepository.findAllByRoleAndDepartmentOrderByTotalVerifiedHoursDesc(Role.STUDENT, department.toUpperCase());
        } else {
            students = userRepository.findAllByRoleOrderByTotalVerifiedHoursDesc(Role.STUDENT);
        }

        AtomicInteger rankCounter = new AtomicInteger(1);
        List<LeaderboardDTO.RankedStudent> rankedList = students.stream().map(student -> {
            Double hours = student.getTotalVerifiedHours() != null ? student.getTotalVerifiedHours() : 0.0;
            String badge;
            if (hours >= 60.0) {
                badge = "Gold NSS Scholar";
            } else if (hours >= 30.0) {
                badge = "Silver Torchbearer";
            } else if (hours >= 15.0) {
                badge = "Bronze Sapling";
            } else {
                badge = "Seedling Volunteer";
            }

            int verifiedCount = attendanceLogRepository.findByStudentIdAndStatus(student.getId(), AttendanceStatus.PRESENT).size();

            return LeaderboardDTO.RankedStudent.builder()
                    .rank(rankCounter.getAndIncrement())
                    .id(student.getId())
                    .name(student.getName())
                    .rollNumber(student.getRollNumber())
                    .department(student.getDepartment())
                    .semester(student.getSemester())
                    .totalVerifiedHours(hours)
                    .tierBadge(badge)
                    .verifiedEventsCount(verifiedCount)
                    .build();
        }).collect(Collectors.toList());

        // Department Aggregates
        Map<String, Double> deptTotals = new LinkedHashMap<>();
        List<Object[]> rawAggregates = userRepository.findDepartmentAggregatedHours();
        for (Object[] row : rawAggregates) {
            String deptName = (String) row[0];
            Double totalHours = (Double) row[1];
            if (deptName != null) {
                deptTotals.put(deptName, totalHours != null ? totalHours : 0.0);
            }
        }

        // Ensure key departments are present even if 0
        for (String expectedDept : List.of("CSBS", "CSE", "ECE", "ME")) {
            deptTotals.putIfAbsent(expectedDept, 0.0);
        }

        return LeaderboardDTO.builder()
                .students(rankedList)
                .departmentTotals(deptTotals)
                .filteredDepartment((department == null || department.isBlank()) ? "ALL" : department.toUpperCase())
                .build();
    }
}
