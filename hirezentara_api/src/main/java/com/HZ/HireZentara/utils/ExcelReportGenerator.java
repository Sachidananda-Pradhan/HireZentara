package com.HZ.HireZentara.utils;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
@Component
public class ExcelReportGenerator {


    public byte[] createExcelReport(List<String> headers, List<List<Object>> data, String jobTitle, String jobId) {
            try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                Sheet sheet = workbook.createSheet("Applied Candidates");

                // Title row
                Row titleRow = sheet.createRow(0);
                Cell titleCell = titleRow.createCell(0);
                titleCell.setCellValue("Applied Candidates for Job: " + jobTitle + " (ID: " + jobId + ")");
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headers.size() - 1));

                // Header row
                Row headerRow = sheet.createRow(2); // Leave one row empty after title
                for (int i = 0; i < headers.size(); i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers.get(i));
                }

                // Data rows
                for (int i = 0; i < data.size(); i++) {
                    Row dataRow = sheet.createRow(i + 3); // Start after header
                    List<Object> rowData = data.get(i);
                    for (int j = 0; j < rowData.size(); j++) {
                        Cell cell = dataRow.createCell(j);
                        Object value = rowData.get(j);
                        if (value instanceof String) {
                            cell.setCellValue((String) value);
                        } else if (value instanceof Number) {
                            cell.setCellValue(((Number) value).doubleValue());
                        } else if (value != null) {
                            cell.setCellValue(value.toString());
                        }
                    }
                }

                // Auto-size columns
                for (int i = 0; i < headers.size(); i++) {
                    sheet.autoSizeColumn(i);
                }

                workbook.write(out);
                return out.toByteArray();
            } catch (IOException e) {
                throw new RuntimeException("Failed to generate Excel report", e);
            }
        }
}
