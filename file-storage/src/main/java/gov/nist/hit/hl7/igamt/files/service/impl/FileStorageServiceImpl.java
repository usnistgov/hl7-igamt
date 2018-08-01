package gov.nist.hit.hl7.igamt.files.service.impl;

import java.io.InputStream;
import java.util.List;

import javax.annotation.PostConstruct;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;

import com.mongodb.client.gridfs.model.GridFSFile;

import gov.nist.hit.hl7.igamt.files.service.FileStorageService;


@Service
public class FileStorageServiceImpl implements FileStorageService {


  @Autowired
  private GridFsTemplate gridFsTemplate;

  @PostConstruct
  public void init() {}

  @Override
  public ObjectId store(InputStream inputStream, String fileName, String contentType,
      Document metaData) {
    return this.gridFsTemplate.store(inputStream, fileName, contentType, metaData);
  }

  @Override
  public com.mongodb.client.gridfs.model.GridFSFile findOne(String id) {
    return this.gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
  }

  @Override
  public GridFSFile findOneByFilename(String fileName) {
    return gridFsTemplate.findOne(new Query(Criteria.where("filename").is(fileName)));
  }


  @Override
  public List findAll() {
    return null;
  }


}
