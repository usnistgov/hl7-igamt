package gov.nist.hit.hl7.igamt.common.util.files.storage;

import java.io.InputStream;
import java.util.List;

import javax.annotation.PostConstruct;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;

import com.mongodb.DBObject;
import com.mongodb.client.gridfs.model.GridFSFile;


@Service
public class FileStorageServiceImpl implements FileStorageService {


  @Autowired
  private GridFsTemplate gridFsTemplate;

  @Autowired
  GridFsOperations operations;

  @PostConstruct
  public void init() {}

  @Override
  public ObjectId store(InputStream inputStream, String fileName, String contentType,
      DBObject metaData) {
    return this.gridFsTemplate.store(inputStream, fileName, contentType, metaData);
  }

  @Override
  public GridFSFile findOne(String id) {
    return this.gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
  }

  @Override
  public GridFSFile findOneByFilename(String fileName) {
    return gridFsTemplate.findOne(new Query(Criteria.where("filename").is(fileName)));
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.common.util.files.storage.FileStorageService#findAll()
   */
  @Override
  public List findAll() {
    // TODO Auto-generated method stub
    return null;
  }



}
