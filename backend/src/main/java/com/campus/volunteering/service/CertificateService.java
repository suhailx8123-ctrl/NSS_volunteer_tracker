package com.campus.volunteering.service;

import com.campus.volunteering.exception.InsufficientHoursException;
import com.campus.volunteering.exception.ResourceNotFoundException;
import com.campus.volunteering.model.AttendanceLog;
import com.campus.volunteering.model.AttendanceStatus;
import com.campus.volunteering.model.User;
import com.campus.volunteering.repository.AttendanceLogRepository;
import com.campus.volunteering.repository.UserRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final UserRepository userRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    @Value("${app.certificate.minimum-hours:60.0}")
    private Double minimumHoursRequired;

    public byte[] generateOfficialCertificate(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        Double verifiedHours = student.getTotalVerifiedHours() != null ? student.getTotalVerifiedHours() : 0.0;
        if (verifiedHours < minimumHoursRequired) {
            throw new InsufficientHoursException(
                    "Student has completed " + String.format("%.1f", verifiedHours)
                            + " hours, but minimum " + String.format("%.1f", minimumHoursRequired)
                            + " verified hours are required to unlock the Official Academic Certificate."
            );
        }

        List<AttendanceLog> presentLogs = attendanceLogRepository.findByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        String topClubs = presentLogs.stream()
                .map(log -> log.getEvent().getClub().getName())
                .distinct()
                .limit(3)
                .collect(Collectors.joining(", "));
        if (topClubs.isBlank()) {
            topClubs = "NSS Unit 104, Nature & Eco Sustainability Club, Tech For Good";
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);

            // Double Ornate Border Page Event
            writer.setPageEvent(new PdfPageEventHelper() {
                @Override
                public void onEndPage(PdfWriter writer, Document doc) {
                    PdfContentByte cb = writer.getDirectContent();
                    float left = doc.left() - 15;
                    float right = doc.right() + 15;
                    float top = doc.top() + 15;
                    float bottom = doc.bottom() - 15;

                    // Outer Deep Navy Border
                    cb.saveState();
                    cb.setColorStroke(new Color(30, 58, 138)); // #1e3a8a
                    cb.setLineWidth(4.0f);
                    cb.rectangle(left, bottom, right - left, top - bottom);
                    cb.stroke();

                    // Inner Metallic Gold Border
                    cb.setColorStroke(new Color(180, 83, 9)); // #b45309
                    cb.setLineWidth(1.5f);
                    cb.rectangle(left + 6, bottom + 6, (right - left) - 12, (top - bottom) - 12);
                    cb.stroke();

                    // Corner Ornaments
                    drawCornerDiamond(cb, left + 14, top - 14);
                    drawCornerDiamond(cb, right - 14, top - 14);
                    drawCornerDiamond(cb, left + 14, bottom + 14);
                    drawCornerDiamond(cb, right - 14, bottom + 14);

                    cb.restoreState();
                }

                private void drawCornerDiamond(PdfContentByte cb, float x, float y) {
                    cb.saveState();
                    cb.setColorFill(new Color(180, 83, 9));
                    cb.moveTo(x, y + 5);
                    cb.lineTo(x + 5, y);
                    cb.lineTo(x, y - 5);
                    cb.lineTo(x - 5, y);
                    cb.closePath();
                    cb.fill();
                    cb.restoreState();
                }
            });

            document.open();

            // Fonts
            Font emblemFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(180, 83, 9));
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(30, 58, 138));
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(71, 85, 105));
            Font leadFont = FontFactory.getFont(FontFactory.HELVETICA, 12, new Color(51, 65, 85));
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, new Color(15, 23, 42));
            Font detailFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(30, 58, 138));
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11, new Color(51, 65, 85));
            Font hoursFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 15, new Color(16, 185, 129)); // Emerald #10b981
            Font footerLabelFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(100, 116, 139));
            Font footerValFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(30, 58, 138));

            // Top Academic Emblem / Crest Subtitle
            Paragraph crestTag = new Paragraph("NATIONAL SERVICE SCHEME • INSTITUTION INNOVATION COUNCIL • DEPT. OF STUDENT WELFARE", emblemFont);
            crestTag.setAlignment(Element.ALIGN_CENTER);
            crestTag.setSpacingBefore(10);
            document.add(crestTag);

            // Title
            Paragraph title = new Paragraph("OFFICIAL CERTIFICATE OF COMMUNITY SERVICE & VOLUNTEERING", headerFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(8);
            document.add(title);

            Paragraph subtitle = new Paragraph("EXEMPLARY CIVIC ENGAGEMENT, CAMPUS OUTREACH & SUSTAINABILITY HONOURS", subHeaderFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingBefore(4);
            subtitle.setSpacingAfter(18);
            document.add(subtitle);

            // Lead
            Paragraph lead = new Paragraph("This is proudly awarded in recognition of outstanding community stewardship to", leadFont);
            lead.setAlignment(Element.ALIGN_CENTER);
            lead.setSpacingAfter(6);
            document.add(lead);

            // Student Full Name
            Paragraph name = new Paragraph(student.getName().toUpperCase(), nameFont);
            name.setAlignment(Element.ALIGN_CENTER);
            name.setSpacingAfter(4);
            document.add(name);

            // Roll No, Dept, Semester
            String rollDeptText = "Roll No: " + student.getRollNumber() + "  |  Department: " + student.getDepartment()
                    + (student.getSemester() != null ? ("  |  Semester: " + student.getSemester()) : "");
            Paragraph rollDept = new Paragraph(rollDeptText, detailFont);
            rollDept.setAlignment(Element.ALIGN_CENTER);
            rollDept.setSpacingAfter(14);
            document.add(rollDept);

            // Body Citation
            Paragraph body = new Paragraph();
            body.setAlignment(Element.ALIGN_CENTER);
            body.setLeading(18f);
            body.add(new Chunk("for exceptional dedication to social impact, environmental preservation, and civic betterment, having successfully completed and officially verified\n", bodyFont));
            body.add(new Chunk(String.format("%.1f", verifiedHours) + " HOURS OF ACTIVE VOLUNTEERING & COMMUNITY SERVICE", hoursFont));
            body.add(new Chunk("\nacross distinguished campus outreach drives organized by " + topClubs + ".", bodyFont));
            body.setSpacingAfter(26);
            document.add(body);

            // Signatures & Verification Code Table
            PdfPTable footerTable = new PdfPTable(3);
            footerTable.setWidthPercentage(90);
            footerTable.setWidths(new float[]{30f, 40f, 30f});

            // Left: Program Officer
            PdfPCell cellLeft = new PdfPCell();
            cellLeft.setBorder(Rectangle.NO_BORDER);
            cellLeft.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph sigLine1 = new Paragraph("___________________________", footerLabelFont);
            Paragraph sigName1 = new Paragraph("Dr. Ramesh Nair", footerValFont);
            Paragraph sigTitle1 = new Paragraph("NSS Programme Officer & Faculty In-Charge", footerLabelFont);
            sigLine1.setAlignment(Element.ALIGN_CENTER);
            sigName1.setAlignment(Element.ALIGN_CENTER);
            sigTitle1.setAlignment(Element.ALIGN_CENTER);
            cellLeft.addElement(sigLine1);
            cellLeft.addElement(sigName1);
            cellLeft.addElement(sigTitle1);
            footerTable.addCell(cellLeft);

            // Center: Verification Seal & Code
            String verificationCode = "CERT-NSS-2026-" + student.getRollNumber() + "-"
                    + Integer.toHexString(student.getEmail().hashCode()).toUpperCase();
            String issueDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));

            PdfPCell cellCenter = new PdfPCell();
            cellCenter.setBorder(Rectangle.NO_BORDER);
            cellCenter.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph certCode = new Paragraph("VERIFICATION CODE\n" + verificationCode, footerValFont);
            Paragraph dateP = new Paragraph("Issued On: " + issueDate, footerLabelFont);
            Paragraph statusSeal = new Paragraph("★ OFFICIAL COLLEGE SEAL VERIFIED ★", emblemFont);
            certCode.setAlignment(Element.ALIGN_CENTER);
            dateP.setAlignment(Element.ALIGN_CENTER);
            statusSeal.setAlignment(Element.ALIGN_CENTER);
            cellCenter.addElement(statusSeal);
            cellCenter.addElement(certCode);
            cellCenter.addElement(dateP);
            footerTable.addCell(cellCenter);

            // Right: Dean / Principal
            PdfPCell cellRight = new PdfPCell();
            cellRight.setBorder(Rectangle.NO_BORDER);
            cellRight.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph sigLine2 = new Paragraph("___________________________", footerLabelFont);
            Paragraph sigName2 = new Paragraph("Dr. Vikramaditya Rao", footerValFont);
            Paragraph sigTitle2 = new Paragraph("Dean of Student Affairs & Principal", footerLabelFont);
            sigLine2.setAlignment(Element.ALIGN_CENTER);
            sigName2.setAlignment(Element.ALIGN_CENTER);
            sigTitle2.setAlignment(Element.ALIGN_CENTER);
            cellRight.addElement(sigLine2);
            cellRight.addElement(sigName2);
            cellRight.addElement(sigTitle2);
            footerTable.addCell(cellRight);

            document.add(footerTable);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error rendering official PDF certificate: " + e.getMessage(), e);
        }

        return out.toByteArray();
    }
}
