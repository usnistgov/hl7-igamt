package gov.nist.hit.hl7.igamt.examples.service;

import gov.nist.hit.hl7.igamt.examples.dto.parser.MessageElement;
import gov.nist.hit.hl7.igamt.examples.dto.parser.MessageElementType;
import gov.nist.hit.hl7.igamt.examples.dto.parser.MessageModel;
import gov.nist.hit.hl7.igamt.examples.dto.parser.Point;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.service.XMLSerializeService;
import hl7.v2.instance.*;
import hl7.v2.profile.Profile;
import hl7.v2.profile.XMLDeserializer;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import nu.xom.Document;

import java.io.InputStream;
import java.util.ArrayList;

import scala.Option;
import scala.collection.Iterator;

@Service
public class MessageParserService {

    @Autowired
    XMLSerializeService xmlSerializeService;
    @Autowired
    IgService igService;

    public MessageModel parseMessage(String igId, String profileId, String er7Message) throws Exception {
        Ig ig = igService.findById(igId);
        IgDataModel igDataModel = igService.generateDataModel(ig);
        Document document = xmlSerializeService.serializeProfileToDoc(igDataModel);
        String xmlString = document.toXML();
        InputStream profileStream = IOUtils.toInputStream(xmlString);
        Profile profile = XMLDeserializer.deserialize(profileStream).get();
        JParser p = new JParser();
        Message message = p.jparse(er7Message, profile.getMessage(profileId));
        return parse(message);
    }

    private MessageModel parse(Message message) {
        MessageModel mm = new MessageModel();
        mm.setChildren(new ArrayList<>());
        scala.collection.immutable.List<SegOrGroup> children = message.children();
        if (children != null && !children.isEmpty()) {
            scala.collection.Iterator<SegOrGroup> it = children.iterator();
            while (it.hasNext()) {
                mm.getChildren().add(process(it.next()));
            }
        }
        return mm;
    }

    private MessageElement process(Component component) {
        MessageElement element = createMessageElement(component.location(), MessageElementType.COMPONENT);
        if(component instanceof ComplexComponent) {
            ComplexComponent complexComponent = (ComplexComponent) component;
            scala.collection.immutable.List<SimpleComponent> components = complexComponent.children();
            if (components != null && !components.isEmpty()) {
                Iterator<SimpleComponent> it = components.iterator();
                while (it.hasNext()) {
                    SimpleComponent subComponent = it.next();
                    MessageElement child = createMessageElement(subComponent.location(), MessageElementType.SUBCOMPONENT);
                    Point end = new Point(subComponent.location().line(), subComponent.location().column() + subComponent.value().raw().length());
                    child.setEnd(end);
                    element.getChildren().add(child);
                }
            }
        } else if (component instanceof SimpleComponent) {
            SimpleComponent simpleComponent = (SimpleComponent) component;
            Point end = new Point(simpleComponent.location().line(), simpleComponent.location().column() + simpleComponent.value().raw().length());
            element.setEnd(end);
        }
        return element;
    }

    private MessageElement process(Field field) {
        MessageElement element = createMessageElement(field.location(), MessageElementType.FIELD);
        Point end = new Point(field.location().line(), field.location().column() + field.rawMessageValue().length());
        element.setEnd(end);

        if(field instanceof ComplexField) {
            ComplexField complexField = (ComplexField) field;
            scala.collection.immutable.List<Component> components = complexField.children();
            if (components != null && !components.isEmpty()) {
                Iterator<Component> it = components.iterator();
                while (it.hasNext()) {
                    MessageElement child = process(it.next());
                    element.getChildren().add(child);
                }
            }
        }
        return element;
    }

    private MessageElement createMessageElement(Location location, MessageElementType messageElementType) {
        MessageElement element = new MessageElement();
        element.setType(messageElementType);
        element.setName(location.desc());
        element.setHl7Path(location.uidPath());
        element.setPositionalPath(location.instancePositionPath());
        element.setProfilePath(location.instancePath());
        Point start = new Point(location.line(),location.column());
        element.setStart(start);
        return element;
    }

    private MessageElement process(SegOrGroup segOrGroup) {
        if (segOrGroup instanceof Segment) {
            Segment segment = (Segment) segOrGroup;
            MessageElement element = createMessageElement(segment.location(), MessageElementType.SEGMENT);
            Point end = new Point(segment.location().line(), segment.location().column() + segment.rawMessageValue().length());
            element.setEnd(end);
            scala.collection.immutable.List<Field> fields = segment.children();
            if (fields != null && !fields.isEmpty()) {
                Iterator<Field> it = fields.iterator();
                while (it.hasNext()) {
                    MessageElement child = process(it.next());
                    element.getChildren().add(child);
                }
            }
            return element;
        } else if (segOrGroup instanceof Group) {
            Group group = (Group) segOrGroup;
            MessageElement element = createMessageElement(
                    group.location(),
                    MessageElementType.GROUP
            );
            scala.collection.immutable.List<SegOrGroup> segOrGroupList = group.children();
            if (segOrGroupList != null && !segOrGroupList.isEmpty()) {
                Iterator<SegOrGroup> it = segOrGroupList.iterator();
                while (it.hasNext()) {
                    MessageElement child = process(it.next());
                    if(child != null) {
                        element.getChildren().add(child);
                    }
                }
            }
            MessageElement last = element.getChildren().get(element.getChildren().size() - 1);
            element.setEnd(last.getEnd());
            return element;
        }
        return null;
    }

    public <T> T getOption(Option<T> o) {
        try {
            return o.get();
        } catch( Exception e) {
            return null;
        }
    }
}
