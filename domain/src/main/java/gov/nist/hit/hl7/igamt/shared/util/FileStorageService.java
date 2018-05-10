package gov.nist.hit.hl7.igamt.shared.util;

import java.io.InputStream;
import java.util.List;
import java.util.Set;

import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;

public interface FileStorageService {


  public GridFSFile store(InputStream inputStream, String fileName, String contentType,
      DBObject metaData);

  public GridFSDBFile findOne(String id);

  public GridFSDBFile findOneByFilename(String filename);

  public List findAll();
}
