package gov.nist.hit.hl7.igamt.examples.service;

import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.examples.domain.ExampleMessage;
import gov.nist.hit.hl7.igamt.examples.domain.MessageSnippet;
import gov.nist.hit.hl7.igamt.examples.dto.SnippetRenderResult;
import gov.nist.hit.hl7.igamt.examples.dto.SnippetValidationInfo;
import gov.nist.hit.hl7.igamt.examples.dto.parser.MessageElement;
import gov.nist.hit.hl7.igamt.examples.dto.parser.MessageModel;
import gov.nist.hit.hl7.igamt.examples.dto.parser.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SnippetRenderService {

    private static final Logger logger = LoggerFactory.getLogger(SnippetRenderService.class);

    @Autowired
    private ExampleMessagesService exampleMessagesService;

    @Autowired
    private MessageParserService messageParserService;

    /**
     * Render a snippet: parse the message, find referenced elements,
     * extract the relevant segment lines, and return the rendered result.
     *
     * @param igId      the IG document id
     * @param messageId the example message id
     * @param snippetId the snippet id
     * @return rendered snippet result with extracted content and highlights
     */
    public SnippetRenderResult renderSnippet(String igId, String messageId, String snippetId) throws Exception {
        ExampleMessage exampleMessage;
        try {
            exampleMessage = exampleMessagesService.getExampleMessage(igId, messageId);
        } catch (ResourceNotFoundException e) {
            // Message itself was deleted — let the exception propagate so the controller returns 404
            throw e;
        }

        SnippetRenderResult result = new SnippetRenderResult();
        result.setSnippetId(snippetId);
        result.setMessageId(messageId);
        result.setMessageName(exampleMessage.getName());
        result.setFullMessage(exampleMessage.getMessage());

        // Find the snippet — if deleted, return full message with a warning
        MessageSnippet snippet = exampleMessage.getSnippets() != null
                ? exampleMessage.getSnippets().stream()
                    .filter(s -> s.getId().equals(snippetId))
                    .findFirst()
                    .orElse(null)
                : null;

        if (snippet == null) {
            result.setSnippetNotFound(true);
            result.getWarnings().add("The message may have changed since this snippet was created. The snippet could not be highlighted.");
            result.setRenderedContent(exampleMessage.getMessage());
            return result;
        }

        result.setSnippetName(snippet.getName());
        result.setSnippetDescription(snippet.getDescription());

        if (exampleMessage.getMessage() == null || exampleMessage.getMessage().isEmpty()) {
            result.setRenderedContent("");
            return result;
        }

        // Parse the message tree
        MessageModel parsed;
        try {
            parsed = messageParserService.parseMessage(igId, exampleMessage.getProfileId(), exampleMessage.getMessage());
        } catch (Exception e) {
            logger.warn("Failed to parse message for snippet rendering: {}", e.getMessage());
            // Fall back: return full message if parsing fails
            result.setRenderedContent(exampleMessage.getMessage());
            return result;
        }

        String[] allLines = exampleMessage.getMessage().split("\n", -1);

        // Process each messageReference in the snippet
        Set<String> references = snippet.getMessageReferences();
        if (references == null || references.isEmpty()) {
            result.setRenderedContent(exampleMessage.getMessage());
            return result;
        }

        // Collect all parts and merge line ranges
        TreeSet<Integer> allLineNumbers = new TreeSet<>();

        // First pass: find all referenced elements and collect their line ranges
        List<MessageElement> targets = new ArrayList<>();
        List<String> targetPaths = new ArrayList<>();
        boolean hasBrokenPaths = false;
        for (String positionalPath : references) {
            MessageElement target = findByPositionalPath(parsed, positionalPath);
            if (target == null || target.getStart() == null || target.getEnd() == null) {
                hasBrokenPaths = true;
                continue;
            }
            targets.add(target);
            targetPaths.add(positionalPath);

            int startLine = target.getStart().getLine();
            int endLine = target.getEnd().getLine();
            int fromIdx = Math.max(0, startLine - 1);
            int toIdx = Math.min(allLines.length - 1, endLine - 1);
            for (int i = fromIdx; i <= toIdx; i++) {
                allLineNumbers.add(i);
            }
        }

        // If any paths could not be resolved, add a single warning
        if (hasBrokenPaths) {
            result.getWarnings().add("The message may have changed since this snippet was created. The snippet could not be highlighted.");
        }

        // If no targets could be resolved at all, fall back to full message
        if (targets.isEmpty()) {
            result.setRenderedContent(exampleMessage.getMessage());
            return result;
        }

        // Build the combined rendered content and create a mapping from
        // original 0-based line index to 1-based line number in the rendered output
        Map<Integer, Integer> originalToRenderedLine = new HashMap<>();
        if (!allLineNumbers.isEmpty()) {
            StringBuilder rendered = new StringBuilder();
            int renderedLineNum = 1;
            for (int lineIdx : allLineNumbers) {
                if (rendered.length() > 0) {
                    rendered.append("\n");
                }
                if (lineIdx < allLines.length) {
                    rendered.append(allLines[lineIdx]);
                }
                originalToRenderedLine.put(lineIdx, renderedLineNum);
                renderedLineNum++;
            }
            result.setRenderedContent(rendered.toString());
        } else {
            result.setRenderedContent(exampleMessage.getMessage());
        }

        // Second pass: build parts with correct highlight coordinates
        for (int idx = 0; idx < targets.size(); idx++) {
            MessageElement target = targets.get(idx);
            String positionalPath = targetPaths.get(idx);

            int startLine = target.getStart().getLine();
            int endLine = target.getEnd().getLine();
            int fromIdx = Math.max(0, startLine - 1);
            int toIdx = Math.min(allLines.length - 1, endLine - 1);

            // Build part
            SnippetRenderResult.SnippetPart part = new SnippetRenderResult.SnippetPart();
            part.setPositionalPath(positionalPath);
            part.setHl7Path(target.getHl7Path());
            part.setElementName(target.getName());
            part.setElementType(target.getType() != null ? target.getType().name() : null);
            part.setStartLine(startLine);
            part.setEndLine(endLine);

            // Extract the lines for this part
            StringBuilder partContent = new StringBuilder();
            for (int i = fromIdx; i <= toIdx; i++) {
                if (partContent.length() > 0) {
                    partContent.append("\n");
                }
                partContent.append(allLines[i]);
            }
            part.setContent(partContent.toString());

            // Compute highlight coordinates relative to the combined rendered content
            // Map the original line numbers to the rendered line numbers
            int renderedStartLine = originalToRenderedLine.getOrDefault(startLine - 1, 1);
            int renderedEndLine = originalToRenderedLine.getOrDefault(endLine - 1, 1);
            part.setHighlightStart(new Point(renderedStartLine, target.getStart().getColumn()));
            part.setHighlightEnd(new Point(renderedEndLine, target.getEnd().getColumn()));

            result.getParts().add(part);
        }


        return result;
    }

    /**
     * Render a snippet directly from positional paths (without requiring a saved snippet).
     * Useful for ad-hoc rendering from front-end selections.
     */
    public SnippetRenderResult renderFromPaths(String igId, String messageId, List<String> positionalPaths) throws Exception {
        ExampleMessage exampleMessage = exampleMessagesService.getExampleMessage(igId, messageId);

        SnippetRenderResult result = new SnippetRenderResult();
        result.setMessageId(messageId);
        result.setMessageName(exampleMessage.getName());
        result.setFullMessage(exampleMessage.getMessage());

        if (exampleMessage.getMessage() == null || exampleMessage.getMessage().isEmpty() || positionalPaths == null || positionalPaths.isEmpty()) {
            result.setRenderedContent(exampleMessage.getMessage() != null ? exampleMessage.getMessage() : "");
            return result;
        }

        MessageModel parsed;
        try {
            parsed = messageParserService.parseMessage(igId, exampleMessage.getProfileId(), exampleMessage.getMessage());
        } catch (Exception e) {
            logger.warn("Failed to parse message for path rendering: {}", e.getMessage());
            result.setRenderedContent(exampleMessage.getMessage());
            return result;
        }

        String[] allLines = exampleMessage.getMessage().split("\n", -1);
        TreeSet<Integer> allLineNumbers = new TreeSet<>();

        // First pass: find all referenced elements and collect their line ranges
        List<MessageElement> targets = new ArrayList<>();
        List<String> targetPathsList = new ArrayList<>();
        boolean hasBrokenPaths = false;
        for (String positionalPath : positionalPaths) {
            MessageElement target = findByPositionalPath(parsed, positionalPath);
            if (target == null || target.getStart() == null || target.getEnd() == null) {
                hasBrokenPaths = true;
                continue;
            }
            targets.add(target);
            targetPathsList.add(positionalPath);

            int startLine = target.getStart().getLine();
            int endLine = target.getEnd().getLine();
            int fromIdx = Math.max(0, startLine - 1);
            int toIdx = Math.min(allLines.length - 1, endLine - 1);
            for (int i = fromIdx; i <= toIdx; i++) {
                allLineNumbers.add(i);
            }
        }

        // If any paths could not be resolved, add a single warning
        if (hasBrokenPaths) {
            result.getWarnings().add("The message may have changed since this snippet was created. The snippet could not be highlighted.");
        }

        // Build the combined rendered content and mapping from original to rendered lines
        Map<Integer, Integer> originalToRenderedLine = new HashMap<>();
        if (!allLineNumbers.isEmpty()) {
            StringBuilder rendered = new StringBuilder();
            int renderedLineNum = 1;
            for (int lineIdx : allLineNumbers) {
                if (rendered.length() > 0) {
                    rendered.append("\n");
                }
                if (lineIdx < allLines.length) {
                    rendered.append(allLines[lineIdx]);
                }
                originalToRenderedLine.put(lineIdx, renderedLineNum);
                renderedLineNum++;
            }
            result.setRenderedContent(rendered.toString());
        } else {
            result.setRenderedContent(exampleMessage.getMessage());
        }

        // Second pass: build parts with correct highlight coordinates
        for (int idx = 0; idx < targets.size(); idx++) {
            MessageElement target = targets.get(idx);
            String positionalPath = targetPathsList.get(idx);

            int startLine = target.getStart().getLine();
            int endLine = target.getEnd().getLine();
            int fromIdx = Math.max(0, startLine - 1);
            int toIdx = Math.min(allLines.length - 1, endLine - 1);

            SnippetRenderResult.SnippetPart part = new SnippetRenderResult.SnippetPart();
            part.setPositionalPath(positionalPath);
            part.setHl7Path(target.getHl7Path());
            part.setElementName(target.getName());
            part.setElementType(target.getType() != null ? target.getType().name() : null);
            part.setStartLine(startLine);
            part.setEndLine(endLine);

            StringBuilder partContent = new StringBuilder();
            for (int i = fromIdx; i <= toIdx; i++) {
                if (partContent.length() > 0) {
                    partContent.append("\n");
                }
                partContent.append(allLines[i]);
            }
            part.setContent(partContent.toString());

            int renderedStartLine = originalToRenderedLine.getOrDefault(startLine - 1, 1);
            int renderedEndLine = originalToRenderedLine.getOrDefault(endLine - 1, 1);
            part.setHighlightStart(new Point(renderedStartLine, target.getStart().getColumn()));
            part.setHighlightEnd(new Point(renderedEndLine, target.getEnd().getColumn()));

            result.getParts().add(part);
        }


        return result;
    }

    /**
     * Validate all snippets of a message against its current (or new) content.
     * Returns a list of validation results — one per snippet.
     * Snippets with all references resolved will have an empty brokenPaths list.
     */
    public List<SnippetValidationInfo> validateSnippets(String igId, ExampleMessage exampleMessage) {
        List<SnippetValidationInfo> results = new ArrayList<>();
        if (exampleMessage.getSnippets() == null || exampleMessage.getSnippets().isEmpty()) {
            return results;
        }
        if (exampleMessage.getMessage() == null || exampleMessage.getMessage().isEmpty()) {
            // No message content — all snippet references are broken
            for (MessageSnippet snippet : exampleMessage.getSnippets()) {
                SnippetValidationInfo info = new SnippetValidationInfo(snippet.getId(), snippet.getName());
                Set<String> refs = snippet.getMessageReferences();
                info.setTotalReferences(refs != null ? refs.size() : 0);
                info.setResolvedReferences(0);
                if (refs != null) {
                    info.getBrokenPaths().addAll(refs);
                }
                results.add(info);
            }
            return results;
        }

        // Try to parse the message
        MessageModel parsed = null;
        try {
            parsed = messageParserService.parseMessage(igId, exampleMessage.getProfileId(), exampleMessage.getMessage());
        } catch (Exception e) {
            logger.warn("Failed to parse message for snippet validation: {}", e.getMessage());
            // Can't parse — mark all references as broken
            for (MessageSnippet snippet : exampleMessage.getSnippets()) {
                SnippetValidationInfo info = new SnippetValidationInfo(snippet.getId(), snippet.getName());
                Set<String> refs = snippet.getMessageReferences();
                info.setTotalReferences(refs != null ? refs.size() : 0);
                info.setResolvedReferences(0);
                if (refs != null) {
                    info.getBrokenPaths().addAll(refs);
                }
                results.add(info);
            }
            return results;
        }

        // Validate each snippet
        for (MessageSnippet snippet : exampleMessage.getSnippets()) {
            SnippetValidationInfo info = new SnippetValidationInfo(snippet.getId(), snippet.getName());
            Set<String> refs = snippet.getMessageReferences();
            int total = refs != null ? refs.size() : 0;
            int resolved = 0;
            info.setTotalReferences(total);

            if (refs != null) {
                for (String path : refs) {
                    MessageElement target = findByPositionalPath(parsed, path);
                    if (target != null && target.getStart() != null && target.getEnd() != null) {
                        resolved++;
                    } else {
                        info.getBrokenPaths().add(path);
                    }
                }
            }
            info.setResolvedReferences(resolved);
            results.add(info);
        }

        return results;
    }

    /**
     * Recursively find a MessageElement by its positionalPath in the parsed tree.
     */
    private MessageElement findByPositionalPath(MessageModel model, String positionalPath) {
        if (model == null || model.getChildren() == null) {
            return null;
        }
        for (MessageElement child : model.getChildren()) {
            MessageElement found = findByPositionalPath(child, positionalPath);
            if (found != null) {
                return found;
            }
        }
        return null;
    }

    private MessageElement findByPositionalPath(MessageElement element, String positionalPath) {
        if (element == null) {
            return null;
        }
        if (positionalPath.equals(element.getPositionalPath())) {
            return element;
        }
        if (element.getChildren() != null) {
            for (MessageElement child : element.getChildren()) {
                MessageElement found = findByPositionalPath(child, positionalPath);
                if (found != null) {
                    return found;
                }
            }
        }
        return null;
    }
}

