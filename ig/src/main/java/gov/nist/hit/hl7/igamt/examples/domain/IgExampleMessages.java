package gov.nist.hit.hl7.igamt.examples.domain;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

@Document
public class IgExampleMessages {
    @Id
    private String id;
    private List<ExampleMessage> exampleMessages;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<ExampleMessage> getExampleMessages() {
        if(exampleMessages == null) {
            this.exampleMessages = new ArrayList<>();
        }
        return exampleMessages;
    }

    public void setExampleMessages(List<ExampleMessage> exampleMessages) {
        this.exampleMessages = exampleMessages;
    }
}
