package gov.nist.hit.hl7.igamt.common.util.files.storage;



import java.io.InputStream;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.gridfs.model.GridFSFile;


@RestController
@RequestMapping(FileStorageUtil.root)
public class FileStorageController {

  @Autowired
  FileStorageService storageService;

  @Autowired
  GridFsOperations operations;



  @RequestMapping(value = FileStorageUtil.UPLOAD_URL, method = RequestMethod.POST,
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
  public UploadFileResponse upload(@RequestPart("file") MultipartFile part,
      HttpServletRequest request, Authentication authentication) throws UploadImageFileException {
    try {

      String mime = part.getContentType();
      String filename = part.getOriginalFilename();
      String extension = FilenameUtils.getExtension(filename);
      if (((mime.equals("text/plain") || (mime.equals("application/msword"))
          || (mime.equals("text/xml")) || (mime.equals("application/x-pdf"))
          || (mime.equals("application/pdf"))) || (mime.equals("image/jpeg"))
          || (mime.equals("image/gif")) || (mime.equals("image/png")))
          && FileStorageUtil.allowedExtensions.contains(extension.toLowerCase())) {

        if (part.getSize() >= 1024 * 1024 * 10) {
          throw new UploadImageFileException("fileSizeTooBig");
        }
        InputStream in = part.getInputStream();
        DBObject metaData = new BasicDBObject();
        metaData.put("accountId", authentication.getPrincipal().toString());
        String generatedName = UUID.randomUUID().toString() + "." + extension;
        ObjectId fsFile = storageService.store(in, generatedName, part.getContentType(), metaData);
        GridFSFile dbFile = storageService.findOne(fsFile.toString());
        return new UploadFileResponse(
            HttpUtil.getImagesRootUrl(request) + "/file?name=" + dbFile.getFilename());
      }
      throw new UploadImageFileException("fileTypeUnsupported");

    } catch (RuntimeException e) {
      throw new UploadImageFileException(e);
    } catch (Exception e) {
      throw new UploadImageFileException(e);
    }
  }

  @ResponseBody
  @RequestMapping(value = "/file", method = RequestMethod.GET)
  public ResponseEntity<InputStreamResource> getByName(@RequestParam("name") String filename)
      throws UploadImageFileException {
    try {
      GridFSFile dbFile = storageService.findOneByFilename(filename);

      if (dbFile != null) {
        return ResponseEntity.ok().contentLength(dbFile.getLength())
            .contentType(MediaType.parseMediaType(dbFile.getContentType()))
            .body(operations.getResource(filename));
      }
    } catch (RuntimeException e) {
      throw new UploadImageFileException(e);
    } catch (Exception e) {
      throw new UploadImageFileException(e);
    }
    return null;
  }

}
