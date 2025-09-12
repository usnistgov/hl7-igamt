//package gov.nist.hit.hl7.igamt.bootstrap.configuration;
//
//import gov.nist.hit.hl7.igamt.mcp.IgamtTools;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.ai.tool.ToolCallback;
//import org.springframework.ai.support.ToolCallbacks;
//
//import java.util.List;
//
///**
// * Registers MCP tools for the Spring AI MCP server (WebMVC).
// *
// * This converts all @Tool-annotated methods on IgamtMcpTools into ToolCallback(s)
// * and exposes them as a bean. The spring-ai MCP server starter will pick these up.
// */
//@Configuration
//public class McpToolsConfig {
//
//    /**
//     * Exactly like the screenshot pattern:
//     * return a List<ToolCallback> built from your tool holder object(s).
//     *
//     * You can add more objects with @Tool methods (comma-separate more ToolCallbacks.from(...)).
//     */
//    @Bean
//    public List<ToolCallback> tools(IgamtTools igamtMcpTools) {
//        return List.of(
//            ToolCallbacks.from(igamtMcpTools)
//            // , ToolCallbacks.from(otherServiceWithAtToolMethods)
//        );
//    }
//}