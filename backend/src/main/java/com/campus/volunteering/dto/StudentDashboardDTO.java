package com.campus.volunteering.dto;

import com.campus.volunteering.model.AttendanceLog;
import com.campus.volunteering.model.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDashboardDTO {

    private User user;
    private Double totalVerifiedHours;
    private String milestoneTier;
    private Integer milestoneStage;
    private Double hoursToNextMilestone;
    private Boolean certificateEligible;
    private List<AttendanceLog> recentLogs;
    private List<String> contributingClubs;
}
