package gov.nist.hit.hl7.igamt.examples.dto.parser;

public class Point {
    private int line;
    private int column;

    public Point(int line, int column) {
        this.line = line;
        this.column = column;
    }

    public Point() {
    }

    public int getLine() {
        return line;
    }

    public void setLine(int line) {
        this.line = line;
    }

    public int getColumn() {
        return column;
    }

    public void setColumn(int column) {
        this.column = column;
    }
}
