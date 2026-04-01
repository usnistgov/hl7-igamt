package gov.nist.hit.hl7.igamt.web.app.account;

import gov.nist.hit.hl7.igamt.common.base.model.DownloadFile;
import gov.nist.hit.hl7.igamt.common.base.model.ResponseMessage;
import gov.nist.hit.hl7.igamt.minidump.service.MiniDumpService;
import java.io.IOException;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/account/mini-dump")
public class MiniDumpController {

  private final MiniDumpService miniDumpService;

  @Autowired
  public MiniDumpController(MiniDumpService miniDumpService) {
    this.miniDumpService = miniDumpService;
  }

  @GetMapping
  @PreAuthorize("isAuthenticated()")
  public void exportMiniDump(Authentication authentication,
                             javax.servlet.http.HttpServletResponse response,
                             @RequestParam(name = "format", defaultValue = "BOTH") MiniDumpService.ExportFormat format,
                             @RequestParam(name = "archiveName", required = false) String archiveName) throws IOException {
    String username = authentication.getName();
    DownloadFile file = miniDumpService.exportUserData(username, format, archiveName);
    response.setContentType(file.getContentType());
    response.setHeader("Content-Disposition", "attachment; filename=" + file.getFileName());
    FileCopyUtils.copy(file.getStream(), response.getOutputStream());
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("isAuthenticated()")
  public ResponseMessage<String> importMiniDump(Authentication authentication,
                                                @RequestPart("file") MultipartFile file,
                                                @RequestParam(name = "mode", defaultValue = "OVERRIDE") MiniDumpService.ImportMode mode) throws IOException {
    String username = authentication.getName();
    miniDumpService.importUserData(username, file.getInputStream(), mode);
    return new ResponseMessage<>(ResponseMessage.Status.SUCCESS, "Mini dump imported", null, null, new Date());
  }
}
