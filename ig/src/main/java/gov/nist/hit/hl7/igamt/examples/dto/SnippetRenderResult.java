package gov.nist.hit.hl7.igamt.examples.dto;

import gov.nist.hit.hl7.igamt.examples.dto.parser.Point;

import java.util.ArrayList;
import java.util.List;

public class SnippetRenderResult {
    private String snippetId;
    private String snippetName;
    private String snippetDescription;
    private String messageId;
    private String messageName;
    /**
     * The full ER7 message content
     */
    private String fullMessage;
    /**
     * The extracted segment lines relevant to the snippet
     */
    private String renderedContent;
    /**
     * All rendered parts (when a snippet references multiple locations)
     */
    private List<SnippetPart> parts;
    /**
     * True if the snippet was not found in the message (e.g. deleted)
     */
    private boolean snippetNotFound;
    /**
     * Warning messages (e.g. some parts could not be resolved)
     */
    private List<String> warnings;

    public String getSnippetId() {
        return snippetId;
    }

    public void setSnippetId(String snippetId) {
        this.snippetId = snippetId;
    }

    public String getSnippetName() {
        return snippetName;
    }

    public void setSnippetName(String snippetName) {
        this.snippetName = snippetName;
    }

    public String getSnippetDescription() {
        return snippetDescription;
    }

    public void setSnippetDescription(String snippetDescription) {
        this.snippetDescription = snippetDescription;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getMessageName() {
        return messageName;
    }

    public void setMessageName(String messageName) {
        this.messageName = messageName;
    }

    public String getFullMessage() {
        return fullMessage;
    }

    public void setFullMessage(String fullMessage) {
        this.fullMessage = fullMessage;
    }

    public String getRenderedContent() {
        return renderedContent;
    }

    public void setRenderedContent(String renderedContent) {
        this.renderedContent = renderedContent;
    }

    public List<SnippetPart> getParts() {
        if (parts == null) {
            parts = new ArrayList<>();
        }
        return parts;
    }

    public void setParts(List<SnippetPart> parts) {
        this.parts = parts;
    }

    public boolean isSnippetNotFound() {
        return snippetNotFound;
    }

    public void setSnippetNotFound(boolean snippetNotFound) {
        this.snippetNotFound = snippetNotFound;
    }

    public List<String> getWarnings() {
        if (warnings == null) {
            warnings = new ArrayList<>();
        }
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    /**
     * Represents one rendered part of a snippet (a snippet can reference multiple locations)
     */
    public static class SnippetPart {
        private String positionalPath;
        private String hl7Path;
        private String elementName;
        private String elementType;
        /**
         * The extracted segment line(s) for this part
         */
        private String content;
        /**
         * 1-based start line in the full message
         */
        private int startLine;
        /**
         * 1-based end line (inclusive) in the full message
         */
        private int endLine;
        /**
         * Highlight start within the extracted content
         */
        private Point highlightStart;
        /**
         * Highlight end within the extracted content
         */
        private Point highlightEnd;

        public String getPositionalPath() {
            return positionalPath;
        }

        public void setPositionalPath(String positionalPath) {
            this.positionalPath = positionalPath;
        }

        public String getHl7Path() {
            return hl7Path;
        }

        public void setHl7Path(String hl7Path) {
            this.hl7Path = hl7Path;
        }

        public String getElementName() {
            return elementName;
        }

        public void setElementName(String elementName) {
            this.elementName = elementName;
        }

        public String getElementType() {
            return elementType;
        }

        public void setElementType(String elementType) {
            this.elementType = elementType;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public int getStartLine() {
            return startLine;
        }

        public void setStartLine(int startLine) {
            this.startLine = startLine;
        }

        public int getEndLine() {
            return endLine;
        }

        public void setEndLine(int endLine) {
            this.endLine = endLine;
        }

        public Point getHighlightStart() {
            return highlightStart;
        }

        public void setHighlightStart(Point highlightStart) {
            this.highlightStart = highlightStart;
        }

        public Point getHighlightEnd() {
            return highlightEnd;
        }

        public void setHighlightEnd(Point highlightEnd) {
            this.highlightEnd = highlightEnd;
        }
    }
}
