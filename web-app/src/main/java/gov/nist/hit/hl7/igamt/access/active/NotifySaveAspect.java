package gov.nist.hit.hl7.igamt.access.active;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.access.common.ResourceAccessInfoFetcher;
import gov.nist.hit.hl7.igamt.access.model.ResourceInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.exception.ResourceNotFoundException;
import gov.nist.hit.hl7.igamt.web.app.model.ActiveUser;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;

@Aspect
@Component
public class NotifySaveAspect {

    private final ExpressionParser parser = new SpelExpressionParser();
    @Autowired
    private ResourceAccessInfoFetcher resourceAccessInfoFetcher;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private ActiveUsersService activeUsersService;

    private static final String DOCUMENT_SESSION_ID = "Document-Session-Id";

    public static HttpServletRequest getCurrentHttpRequest(){
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes) {
            return ((ServletRequestAttributes)requestAttributes).getRequest();
        }
        return null;
    }

    public String getDocumentSessionId() throws Exception {
        HttpServletRequest request = getCurrentHttpRequest();
        if(request == null) {
            throw new Exception("No HTTP Request found");
        }
        String sessionId = request.getHeader(DOCUMENT_SESSION_ID);
        if(Strings.isNullOrEmpty(sessionId)) {
            throw new Exception("Document Session ID Header not found");
        }
        return sessionId;
    }

    public UsernamePasswordAuthenticationToken getAuthentication() throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null) {
            throw new Exception("No authentication found");
        } else if(authentication instanceof UsernamePasswordAuthenticationToken) {
            return (UsernamePasswordAuthenticationToken) authentication;
        } else {
            throw new Exception("Authentication object is not UsernamePasswordAuthenticationToken");
        }
    }

    public String getDocumentId(JoinPoint joinPoint) throws Exception {
        MethodSignature ms = (MethodSignature) joinPoint.getSignature();
        Method method = ms.getMethod();
        Object[] args = joinPoint.getArgs();
        String[] parametersName = ms.getParameterNames();
        StandardEvaluationContext standardEvaluationContext = new StandardEvaluationContext();
        for(int i = 0; i < args.length; i++) {
            standardEvaluationContext.setVariable(parametersName[i], args[i]);
        }
        NotifySave notifySave = method.getAnnotation(NotifySave.class);
        String documentId = getIgId(
                getId(notifySave.id(), standardEvaluationContext),
                getType(notifySave.type(), standardEvaluationContext)
        );
        if(Strings.isNullOrEmpty(documentId)) {
            throw new Exception("Could not resolve document Id");
        } else {
            return documentId;
        }
    }

    @After("@annotation(gov.nist.hit.hl7.igamt.access.active.NotifySave)")
    public void notifyActiveUsers(JoinPoint joinPoint) {
        try {
            String sessionId = getDocumentSessionId();
            UsernamePasswordAuthenticationToken token = getAuthentication();
            String documentId = getDocumentId(joinPoint);
            ActiveUser activeUser = this.activeUsersService.getActiveUserForIg(sessionId, documentId, token);
            simpMessagingTemplate.convertAndSend("/listeners/ig/"+ documentId +"/save", activeUser);
        } catch (Exception e) {
            System.err.println("[ERROR][NOTIFY_SAVE] " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String getId(String expression, EvaluationContext context) throws Exception {
        if(!Strings.isNullOrEmpty(expression)) {
            Object id = parser.parseExpression(expression).getValue(context);
            if(id instanceof String) {
                return (String) id;
            }
        }
        throw new Exception("Invalid expression for Id");
    }

    private Type getType(String expression, EvaluationContext context) throws Exception {
        if(!Strings.isNullOrEmpty(expression)) {
            Object type = parser.parseExpression(expression).getValue(context);
            if(type instanceof String) {
                Type value = Type.fromString((String) type);
                if(value != null) {
                    return value;
                }
            }
        }
        throw new Exception("Invalid expression for Type");
    }

    private String getIgId(String id, Type type) throws ResourceNotFoundException {
        if(resourceAccessInfoFetcher.isDocument(type)) {
            return id;
        } else {
            ResourceInfo resourceInfo = resourceAccessInfoFetcher.getResourceInfo(type, id);
            if(resourceInfo != null && resourceInfo.getDocumentInfo() != null && !Strings.isNullOrEmpty(resourceInfo.getDocumentInfo().getDocumentId())) {
                return resourceInfo.getDocumentInfo().getDocumentId();
            } else {
                throw new ResourceNotFoundException(id, type);
            }
        }
    }

}