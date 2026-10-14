package com.campus.volunteering.controller;

import com.campus.volunteering.dto.EventCreateRequest;
import com.campus.volunteering.model.ActivityEvent;
import com.campus.volunteering.model.AttendanceLog;
import com.campus.volunteering.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<ActivityEvent>> getAllEvents() {
        List<ActivityEvent> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityEvent> getEventById(@PathVariable Long id) {
        ActivityEvent event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping
    public ResponseEntity<ActivityEvent> createEvent(@Valid @RequestBody EventCreateRequest request) {
        ActivityEvent createdEvent = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<AttendanceLog> registerStudent(
            @PathVariable Long eventId,
            @RequestParam Long studentId) {
        AttendanceLog log = eventService.registerStudentForEvent(eventId, studentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(log);
    }
}
