package gov.nist.hit.hl7.igamt.mcp;

import  org.springframework.stereotype.Service;
import org.springframework.ai.tool.annotation.Tool;

@Service
public class IgamtTools {

    @Tool(description = "Ping the server and get a simple health reply")
    public String ping() {
        return "IGAMT MCP server is alive";
    }

    @Tool(description = "Echo a short message back (debug)")
    public String echo(String message) {
        return "echo: " + message;
    }

    @Tool(description = "Get the current time in a specified timezone. Use 'UTC' for Coordinated Universal Time.")
    public String getCurrentTime(String timezone) {
        // You would implement the logic here to get the time for the given timezone.
        // For simplicity, we'll just return a mock response.
        if ("UTC".equalsIgnoreCase(timezone)) {
            return "The current time is 12:30 PM UTC.";
        }
        return "The current time is 08:30 AM EST.";
    }
}