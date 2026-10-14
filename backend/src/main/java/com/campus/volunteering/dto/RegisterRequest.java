package com.campus.volunteering.dto;

import com.campus.volunteering.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String rollNumber;

    @NotBlank
    private String department;

    private Integer semester;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private Role role;
}
