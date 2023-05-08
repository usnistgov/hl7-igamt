package gov.nist.hit.hl7.igamt.access.active;

import gov.nist.hit.hl7.igamt.access.model.AccessLevel;
import gov.nist.hit.hl7.igamt.access.security.AccessControlService;
import gov.nist.hit.hl7.igamt.common.base.domain.SharePermission;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.web.app.model.ActiveUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActiveUsersService {

    @Autowired
    private AccessControlService accessControlService;

    Map<String, Set<ActiveUser>> activeUsers = new HashMap<>();

    public ActiveUser getActiveUserForIg(String session, String igId, UsernamePasswordAuthenticationToken token) throws Exception {
        Set<AccessLevel> permissions = this.accessControlService.getDocumentAccessPermission(Type.IGDOCUMENT, igId, token);
        if(permissions != null && !permissions.isEmpty()) {
            SharePermission mode = permissions.contains(AccessLevel.ALL) || permissions.contains(AccessLevel.WRITE) ? SharePermission.WRITE : SharePermission.READ;
            return new ActiveUser(session, token.getName(), mode);
        } else {
            throw new Exception("User does not have permission to access resource");
        }
    }

    public void open(String session, String igId, UsernamePasswordAuthenticationToken token) throws Exception {
        activeUsers.computeIfAbsent(igId, (k) -> new HashSet<>());
        ActiveUser activeUser = getActiveUserForIg(session, igId, token);
        activeUsers.get(igId).add(activeUser);
    }

    public void close(String session, String igId, String username) {
        activeUsers.computeIfPresent(igId, (k, v) -> v.stream()
                .filter((au) -> !au.getId().equals(session))
                .collect(Collectors.toSet())
        );
    }

    public Set<String> terminate(String session) {
        Set<String> igs = new HashSet<>();
        activeUsers.keySet().forEach((igId) -> {
            activeUsers.computeIfPresent(igId, (k, v) -> v.stream()
                    .peek((au) -> {
                        if(au.getId().equals(session)) {
                            igs.add(k);
                        }
                    })
                    .filter((au) -> !au.getId().equals(session))
                    .collect(Collectors.toSet())
            );
        });
        return igs;
    }

    public Set<ActiveUser> getActiveUsers(String ig) {
        activeUsers.computeIfAbsent(ig, (k) -> new HashSet<>());
        return activeUsers.get(ig);
    }
}