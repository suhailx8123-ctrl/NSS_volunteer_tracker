package com.campus.volunteering.controller;

import com.campus.volunteering.model.AttendanceLog;
import com.campus.volunteering.model.AttendanceStatus;
import com.campus.volunteering.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<AttendanceLog>> getEventRoster(@PathVariable Long eventId) {
        List<AttendanceLog> roster = attendanceService.getRosterByEvent(eventId);
        return ResponseEntity.ok(roster);
    }

    @PutMapping("/{logId}/verify")
    public ResponseEntity<AttendanceLog> verifySingleStudent(
            @PathVariable Long logId,
            @RequestParam AttendanceStatus status,
            @RequestParam(required = false, defaultValue = "Faculty Coordinator") String coordinatorName) {
        AttendanceLog updatedLog = attendanceService.verifyAttendance(logId, status, coordinatorName);
        return ResponseEntity.ok(updatedLog);
    }

    @PutMapping("/event/{eventId}/verify-all")
    public ResponseEntity<List<AttendanceLog>> batchVerifyEvent(
            @PathVariable Long eventId,
            @RequestParam(required = false, defaultValue = "Faculty Coordinator") String coordinatorName) {
        List<AttendanceLog> updatedLogs = attendanceService.verifyBatchPresent(eventId, coordinatorName);
        return ResponseEntity.ok(updatedLogs);
    }
}
