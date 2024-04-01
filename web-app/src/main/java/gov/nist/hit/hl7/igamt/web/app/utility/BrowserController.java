package gov.nist.hit.hl7.igamt.web.app.utility;

import gov.nist.hit.hl7.igamt.web.app.model.BrowserScope;
import gov.nist.hit.hl7.igamt.web.app.model.BrowserTreeNode;
import gov.nist.hit.hl7.igamt.web.app.model.CodeSetBrowserScope;
import gov.nist.hit.hl7.igamt.web.app.model.CodeSetBrowserTreeNode;
import gov.nist.hit.hl7.igamt.web.app.service.impl.EntityBrowserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class BrowserController {

    @Autowired
    EntityBrowserService browserService;

    @RequestMapping(value = "/api/browser/{scope}", method = RequestMethod.GET, produces = { "application/json" })
    @ResponseBody
    public List<BrowserTreeNode> getBrowserTree(
            Authentication authentication,
            @PathVariable("scope") BrowserScope scope
    ) throws Exception {
        String username = authentication.getPrincipal().toString();
        return browserService.getBrowserTreeNodeByScope(scope, username);
    }

    @RequestMapping(value = "/api/browser/codesets/{scope}", method = RequestMethod.GET, produces = { "application/json" })
    @ResponseBody
    public List<CodeSetBrowserTreeNode> getCodeSetBrowserTree(
            Authentication authentication,
            @PathVariable("scope") CodeSetBrowserScope scope
    ) throws Exception {
        String username = authentication.getPrincipal().toString();
        return browserService.getCodeSetTreeNodeByScope(scope, username);
    }
}
