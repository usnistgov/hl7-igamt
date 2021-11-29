package gov.nist.hit.hl7.igamt.common.change.entity.domain;

import java.util.Date;

public class ChangeReason {
    private String reason;
    private Date date;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
