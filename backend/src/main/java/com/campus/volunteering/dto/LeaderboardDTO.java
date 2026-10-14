package com.campus.volunteering.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RankedStudent {
        private Integer rank;
        private Long id;
        private String name;
        private String rollNumber;
        private String department;
        private Integer semester;
        private Double totalVerifiedHours;
        private String tierBadge;
        private Integer verifiedEventsCount;
    }

    private List<RankedStudent> students;
    private Map<String, Double> departmentTotals;
    private String filteredDepartment;
}
