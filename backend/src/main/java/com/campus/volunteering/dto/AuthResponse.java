package com.campus.volunteering.dto;

import com.campus.volunteering.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String name;
    private String rollNumber;
    private String department;
    private Integer semester;
    private String email;
    private Role role;
    private Double totalVerifiedHours;
}
