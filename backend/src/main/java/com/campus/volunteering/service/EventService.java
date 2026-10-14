package com.campus.volunteering.service;

import com.campus.volunteering.dto.EventCreateRequest;
import com.campus.volunteering.exception.DuplicateRegistrationException;
import com.campus.volunteering.exception.EventFullException;
import com.campus.volunteering.exception.ResourceNotFoundException;
import com.campus.volunteering.model.ActivityEvent;
import com.campus.volunteering.model.AttendanceLog;
import com.campus.volunteering.model.AttendanceStatus;
import com.campus.volunteering.model.ClubOrUnit;
import com.campus.volunteering.model.User;
import com.campus.volunteering.repository.ActivityEventRepository;
import com.campus.volunteering.repository.AttendanceLogRepository;
import com.campus.volunteering.repository.ClubOrUnitRepository;
import com.campus.volunteering.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final ActivityEventRepository eventRepository;
    private final AttendanceLogRepository attendanceLogRepository;
    private final ClubOrUnitRepository clubRepository;
    private final UserRepository userRepository;

    public List<ActivityEvent> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateDesc();
    }

    public ActivityEvent getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity event not found with ID: " + eventId));
    }

    @Transactional
    public ActivityEvent createEvent(EventCreateRequest request) {
        ClubOrUnit club = clubRepository.findById(request.getClubId())
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with ID: " + request.getClubId()));

        ActivityEvent event = ActivityEvent.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .durationHours(request.getDurationHours())
                .location(request.getLocation())
                .maxParticipants(request.getMaxParticipants())
                .registeredCount(0)
                .club(club)
                .createdAt(LocalDateTime.now())
                .build();

        return eventRepository.save(event);
    }

    @Transactional
    public AttendanceLog registerStudentForEvent(Long eventId, Long studentId) {
        ActivityEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity event not found with ID: " + eventId));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        // 1. Check if already registered
        if (attendanceLogRepository.existsByStudentIdAndEventId(studentId, eventId)) {
            throw new DuplicateRegistrationException("Student (" + student.getName() + " - " + student.getRollNumber()
                    + ") is already registered for '" + event.getTitle() + "'");
        }

        // 2. Check if event is full
        if (event.getRegisteredCount() >= event.getMaxParticipants()) {
            throw new EventFullException("Event capacity reached (" + event.getMaxParticipants() + "/" + event.getMaxParticipants() + " volunteers registered)");
        }

        // 3. Atomically increment registration count
        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        // 4. Create and save AttendanceLog
        AttendanceLog log = AttendanceLog.builder()
                .student(student)
                .event(event)
                .status(AttendanceStatus.REGISTERED)
                .hoursAwarded(0.0)
                .registeredAt(LocalDateTime.now())
                .build();

        return attendanceLogRepository.save(log);
    }
}
