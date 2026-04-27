package com.integrahelp.integrahelp_backend.service;

import com.integrahelp.integrahelp_backend.model.Ticket;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.time.format.DateTimeFormatter;

@Service
public class ExcelAuditService {
    private static final String FILE = "audit/integrahelp_audit.xlsx";
    private static final DateTimeFormatter FMT =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public synchronized void logToExcel(Ticket t) {
        try {
            Path p = Path.of(FILE);
            Files.createDirectories(p.getParent());
            XSSFWorkbook wb;
            XSSFSheet sheet;
            if (Files.exists(p)) {
                wb = new XSSFWorkbook(Files.newInputStream(p));
                sheet = wb.getSheetAt(0);
            } else {
                wb = new XSSFWorkbook();
                sheet = wb.createSheet("Audit Log");
                XSSFRow h = sheet.createRow(0);
                String[] cols = {"Ticket No","Department","Issue",
                    "Status","Raised By","Assigned To","Created","Updated","Anonymous"};
                for (int i = 0; i < cols.length; i++)
                    h.createCell(i).setCellValue(cols[i]);
            }
            int r = sheet.getLastRowNum() + 1;
            XSSFRow row = sheet.createRow(r);
            row.createCell(0).setCellValue(t.getTicketNumber());
            row.createCell(1).setCellValue(t.getDepartment() != null ? t.getDepartment().getName() : "");
            row.createCell(2).setCellValue(t.getIssueType());
            row.createCell(3).setCellValue(t.getStatus().name());
            row.createCell(4).setCellValue(t.isAnonymous() ? "ANONYMOUS" :
                (t.getRaisedBy() != null ? t.getRaisedBy().getUsername() : ""));
            row.createCell(5).setCellValue(t.getAssignedTo() != null ? t.getAssignedTo().getUsername() : "");
            row.createCell(6).setCellValue(t.getCreatedAt() != null ? t.getCreatedAt().format(FMT) : "");
            row.createCell(7).setCellValue(t.getUpdatedAt() != null ? t.getUpdatedAt().format(FMT) : "");
            row.createCell(8).setCellValue(t.isAnonymous() ? "Yes" : "No");
            wb.write(Files.newOutputStream(p));
            wb.close();
        } catch (IOException e) { e.printStackTrace(); }
    }
}