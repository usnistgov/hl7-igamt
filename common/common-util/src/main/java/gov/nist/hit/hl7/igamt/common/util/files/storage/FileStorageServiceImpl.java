package gov.nist.hit.hl7.igamt.common.util.files.storage;

import java.io.InputStream;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;

import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;


@Service
public class FileStorageServiceImpl implements FileStorageService {


  @Autowired
  private GridFsTemplate gridFsTemplate;

  @PostConstruct
  public void init() {}

  public GridFSFile store(InputStream inputStream, String fileName, String contentType,
      DBObject metaData) {
    return this.gridFsTemplate.store(inputStream, fileName, contentType, metaData);
  }

  public GridFSDBFile findOne(String id) {
    return this.gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
  }

  public GridFSDBFile findOneByFilename(String fileName) {
    return gridFsTemplate.findOne(new Query(Criteria.where("filename").is(fileName)));
  }


  public List findAll() {
    return gridFsTemplate.find(null);
  }


}
