package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import jxl.Cell;
import jxl.CellType;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

public class ReadFromExcel2 {

    private String inputFile;

    public void setInputFile(String inputFile) {
        this.inputFile = inputFile;
    }

    public void read() throws IOException  {
//        File inputWorkbook = new File(inputFile);
        InputStream inputWorkbook = ReadFromExcel.class.getResourceAsStream("/CoConstraintsExcelFile 2 rows simple.xlsx");  

        Workbook w;
        try {
            w = Workbook.getWorkbook(inputWorkbook);
            // Get the first sheet
            Sheet sheet = w.getSheet(0);
            // Loop over first 10 column and lines

            for (int j = 0; j < sheet.getColumns(); j++) {
                for (int i = 0; i < sheet.getRows(); i++) {
                    Cell cell = sheet.getCell(j, i);
                    CellType type = cell.getType();
                    if (type == CellType.LABEL) {
                        System.out.println("I got a label "
                                + cell.getContents());
                    }

                    if (type == CellType.NUMBER) {
                        System.out.println("I got a number "
                                + cell.getContents());
                    }

                }
            }
        } catch (BiffException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) throws IOException {
        ReadFromExcel2 test = new ReadFromExcel2();
        test.setInputFile("/Users/ynb4/hl7-igamt-v2/serialization/src/main/resources/CoConstraintsExcelFile 2 rows simple.xlsx");
        test.read();
    }

}