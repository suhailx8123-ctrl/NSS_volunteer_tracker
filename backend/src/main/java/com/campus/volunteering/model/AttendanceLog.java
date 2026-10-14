package com.campus.volunteering.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "attendance_logs",
    uniqueConstraints = {
        @UniqueConstraint(name = "unique_student_event", columnNames = {"student_id", "event_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"password", "createdAt"})
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private ActivityEvent event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private AttendanceStatus status = AttendanceStatus.REGISTERED;

    @Column(name = "hours_awarded", nullable = false)
    @Builder.Default
    private Double hoursAwarded = 0.0;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "certificate_hash")
    private String certificateHash;

    @PrePersist
    protected void onCreate() {
        if (this.registeredAt == null) {
            this.registeredAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = AttendanceStatus.REGISTERED;
        }
        if (this.hoursAwarded == null) {
            this.hoursAwarded = 0.0;
        }
    }
}
