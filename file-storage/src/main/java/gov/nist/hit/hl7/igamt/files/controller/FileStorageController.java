package gov.nist.hit.hl7.igamt.files.controller;



import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
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

import com.mongodb.client.gridfs.model.GridFSFile;

import gov.nist.hit.hl7.igamt.files.exception.UploadImageFileException;
import gov.nist.hit.hl7.igamt.files.service.FileStorageService;
import gov.nist.hit.hl7.igamt.files.util.FileStorageUtil;
import gov.nist.hit.hl7.igamt.files.util.HttpUtil;
import gov.nist.hit.hl7.igamt.files.util.UploadFileResponse;


@RestController
public class FileStorageController {

  @Autowired
  FileStorageService storageService;


  @Autowired
  private GridFsTemplate template;

  @Autowired
  private GridFsOperations operations;


  @RequestMapping(value = "/api/storage/upload", method = RequestMethod.POST,
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
  public UploadFileResponse upload(@RequestPart("file") MultipartFile part, @RequestParam(value="ig", required=false) String ig, @RequestParam(value="type", required=false) String type,@RequestParam(value="id", required=false) String id,  
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
        Document metaData = new Document();
        metaData.put("accountId", authentication.getPrincipal().toString());
        Set<String> igs= new HashSet<String>();
        igs.add(ig);
        metaData.put("igs", igs);
        Set<String> ids= new HashSet<String>();
        ids.add(id);
        metaData.put("type", type);
        metaData.put(id, ids);
        String generatedName = UUID.randomUUID().toString() + "." + extension;
        ObjectId fsFile = storageService.store(in, generatedName, part.getContentType(), metaData);
        GridFSFile dbFile = storageService.findOne(fsFile.toString());
        return new UploadFileResponse(dbFile.getFilename());
      }
      throw new UploadImageFileException("fileTypeUnsupported");

    } catch (RuntimeException e) {
      throw new UploadImageFileException(e);
    } catch (Exception e) {
      throw new UploadImageFileException(e);
    }
  }
  
  @RequestMapping(value = "/api/storage/upload/froala", method = RequestMethod.POST,
	      consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
	  public UploadFileResponse uploadFroala(@RequestPart("file") MultipartFile part, @RequestParam(value="ig", required=false) String ig, @RequestParam(value="type", required=false) String type,@RequestParam(value="id", required=false) String id,  
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
	        Document metaData = new Document();
	        metaData.put("accountId", authentication.getPrincipal().toString());
	        Set<String> igs= new HashSet<String>();
	        igs.add(ig);
	        metaData.put("igs", igs);
	        Set<String> ids= new HashSet<String>();
	        ids.add(id);
	        metaData.put("type", type);
	        metaData.put(id, ids);
	        String generatedName = UUID.randomUUID().toString() + "." + extension;
	        ObjectId fsFile = storageService.store(in, generatedName, part.getContentType(), metaData);
	        GridFSFile dbFile = storageService.findOne(fsFile.toString());
	        UploadFileResponse response= new UploadFileResponse();
	        response.setLink("/api/storage/file?name="+ dbFile.getFilename());
	        return response;
	      }
	      throw new UploadImageFileException("fileTypeUnsupported");

	    } catch (RuntimeException e) {
	      throw new UploadImageFileException(e);
	    } catch (Exception e) {
	      throw new UploadImageFileException(e);
	    }
	  }

  @ResponseBody
  @RequestMapping(value = "/api/storage/file", method = RequestMethod.GET)
  public ResponseEntity<InputStreamResource> getByName(@RequestParam("name") String filename)
      throws UploadImageFileException {
    try {
      GridFSFile dbFile = storageService.findOneByFilename(filename);
      GridFsResource resource = template.getResource(dbFile.getFilename());
      return ResponseEntity.ok().contentLength(dbFile.getLength()).body(resource);
    } catch (RuntimeException e) {
      throw new UploadImageFileException(e);
    } catch (Exception e) {
      throw new UploadImageFileException(e);
    }
  }
  
  
  @ResponseBody
  @RequestMapping(value = "/api/storage/file", method = RequestMethod.DELETE)
  public void getFile(@RequestParam("name") String filename, @RequestParam("ig") String ig, @RequestParam("type") String type,@RequestParam("id") String id)
      throws UploadImageFileException {
    try {
      GridFSFile dbFile = storageService.findOneByFilename(filename);   
      storageService.save(dbFile);
    } catch (RuntimeException e) {
      throw new UploadImageFileException(e);
    } catch (Exception e) {
      throw new UploadImageFileException(e);
    }
  }



}
