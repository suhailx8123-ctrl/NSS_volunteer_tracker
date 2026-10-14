package com.campus.volunteering.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "clubs_or_units")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubOrUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank
    @Column(name = "unit_code", nullable = false, unique = true)
    private String unitCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ClubCategory category;

    @NotBlank
    @Column(name = "faculty_advisor", nullable = false)
    private String facultyAdvisor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coordinator_id")
    @JsonIgnoreProperties({"password", "createdAt"})
    private User coordinator;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
