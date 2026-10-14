package com.campus.volunteering.dto;

import com.campus.volunteering.model.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceVerifyRequest {

    @NotNull
    private AttendanceStatus status;

    private String coordinatorName;
}
