package gov.nist.hit.hl7.igamt.segment.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableContent;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableGroup;
import gov.nist.hit.hl7.igamt.coconstraints.domain.IgnoreCell;
import gov.nist.hit.hl7.igamt.coconstraints.repository.CoConstraintRepository;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;
import gov.nist.hit.hl7.igamt.segment.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.segment.verification.CoConstraintVerifyService;

@Service
public class CoConstraintServiceImpl implements CoConstraintService {

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  private CoConstraintRepository repo;
  @Autowired
  private SegmentService segmentService;
  @Autowired
  private CoConstraintVerifyService verifyService;

  @Override
  public CoConstraintTable getCoConstraintForSegment(String id) {
	  return repo.findById(id).get();
  }

  @Override
  public Map<String, String> references(CoConstraintTable cc) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public CoConstraintTable saveCoConstraintForSegment(String id, CoConstraintTable cc, String user)
      throws CoConstraintSaveException {
    Segment segment = segmentService.findById(id);
    if (segment == null) {
      throw new CoConstraintSaveException(Maps.newHashMap(ImmutableMap.<String, String>builder()
          .put("Segment", "Segment " + id + " does not exists").build()));
    } else if (segment.getDomainInfo().getScope().equals(Scope.HL7STANDARD)) {
      throw new CoConstraintSaveException(Maps.newHashMap(ImmutableMap.<String, String>builder()
          .put("Segment", "Segment " + id + " scope is HL7 Standard").build()));
    } else if (!segment.getUsername().equals(user)) {
      throw new CoConstraintSaveException(Maps.newHashMap(ImmutableMap.<String, String>builder()
          .put("Segment", "Segment " + id + " does not belong to authenticated user : " + user)
          .build()));
    } else {
      Map<String, String> verify = this.verifyService.verify(cc, segment);
      if (verify.keySet().size() > 0) {
        throw new CoConstraintSaveException(verify);
      } else {
        cc.setId(segment.getId());
        this.repo.save(cc);
        return cc;
      }
    }
  }

  @Override
  public CoConstraintTable clone(Map<String, String> datatypes,
      Map<String, String> valueSets, String segmentId, CoConstraintTable cc) {
    CoConstraintTable clone = cc.clone();
    clone.setId(segmentId);
    this.replaceId(clone.getContent(), datatypes);
    return clone;
  }

  private void replaceId(CoConstraintTableContent content, Map<String, String> datatypes) {
    if (content.getFree() != null) {
      List<IgnoreCell> flavorCells = content.getFree().stream().map(row -> {
        return row.getCells().entrySet().stream().filter(cell -> {
          return cell.getValue() instanceof IgnoreCell;
        }).map(ignore -> {
          return (IgnoreCell) ignore.getValue();
        }).collect(Collectors.toList());
      }).reduce(new ArrayList<IgnoreCell>(), (x, y) -> {
        x.addAll(y);
        return x;
      });

      for (IgnoreCell cell : flavorCells) {
        if (datatypes.containsKey(cell.getValue())) {
          cell.setValue(datatypes.get(cell.getValue()));
        }
      }
    }

    if (content.getGroups() != null) {
      for (CoConstraintTableGroup group : content.getGroups()) {
        this.replaceId(group.getContent(), datatypes);
      }
    }
  }



}
