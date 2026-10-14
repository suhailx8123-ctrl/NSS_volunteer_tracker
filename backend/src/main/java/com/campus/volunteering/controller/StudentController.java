package com.campus.volunteering.controller;

import com.campus.volunteering.dto.StudentDashboardDTO;
import com.campus.volunteering.model.User;
import com.campus.volunteering.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/{studentId}/dashboard")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(@PathVariable Long studentId) {
        StudentDashboardDTO dashboard = studentService.getStudentDashboard(studentId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }
}
