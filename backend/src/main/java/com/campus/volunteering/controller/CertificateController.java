package com.campus.volunteering.controller;

import com.campus.volunteering.model.User;
import com.campus.volunteering.repository.UserRepository;
import com.campus.volunteering.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CertificateController {

    private final CertificateService certificateService;
    private final UserRepository userRepository;

    @GetMapping("/download/{studentId}")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable Long studentId) {
        byte[] pdfBytes = certificateService.generateOfficialCertificate(studentId);

        String rollNumber = userRepository.findById(studentId)
                .map(User::getRollNumber)
                .orElse("STUDENT");

        String filename = "Volunteering_Certificate_" + rollNumber + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(pdfBytes);
    }
}
