package com.campus.volunteering.controller;

import com.campus.volunteering.dto.LeaderboardDTO;
import com.campus.volunteering.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<LeaderboardDTO> getLeaderboard(
            @RequestParam(required = false, defaultValue = "ALL") String department) {
        LeaderboardDTO dto = leaderboardService.getLeaderboard(department);
        return ResponseEntity.ok(dto);
    }
}
