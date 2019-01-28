package gov.nist.hit.hl7.igamt.segment.verification.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.coconstraints.domain.CellType;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTable;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableCell;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableContent;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableGroup;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableHeader;
import gov.nist.hit.hl7.igamt.coconstraints.domain.CoConstraintTableHeaders;
import gov.nist.hit.hl7.igamt.coconstraints.domain.DataElementHeader;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.verification.CoConstraintVerifyService;

@Service
public class CoConstraintVerifyServiceImpl implements CoConstraintVerifyService {


  @Autowired
  private DatatypeService datatypeService;

  @Override
  public Map<String, String> verify(CoConstraintTable cc, Segment segment) {
    Map<String, String> errors = new HashMap<>();
    CoConstraintTableHeaders headers = cc.getHeaders();
    List<CoConstraintTableHeader> headersList = new ArrayList<>();
    headersList.addAll(headers.getData());
    headersList.addAll(headers.getSelectors());

    for (CoConstraintTableHeader header : headersList) {
      Datatype datatype = this.checkHeaderExists(errors, header.getContent(), segment);
      this.checkHeaderData(errors, header, datatype);

      if (datatype != null) {
        List<CoConstraintTableCell> cells = cellsForId(cc.getContent(), header.getId());
        checkCells(errors, datatype, header, cells);
      }
    }

    return errors;
  }


  private List<CoConstraintTableCell> cellsForId(CoConstraintTableContent cc, String id) {
    List<CoConstraintTableCell> free = cc.getFree().stream().filter(x -> {
      return x.getCells().containsKey(id) && x.getCells().get(id) != null;
    }).map(x -> {
      return x.get(id);
    }).collect(Collectors.toList());
    if (cc.getGroups() != null) {
      for (CoConstraintTableGroup group : cc.getGroups()) {
        if (group.getContent() != null) {
          free.addAll(cellsForId(group.getContent(), id));
        }
      }
    }
    return free;
  }


  private Datatype checkHeaderExists(Map<String, String> acc, DataElementHeader s,
      Segment segment) {
    Datatype datatype = this.getDatatypeAtPath(segment, s.getPath().split("\\."));
    if (datatype == null) {
      acc.put("Header " + s.getPath(), "Path not found in segment");
    }
    return datatype;
  }

  private boolean checkHeaderData(Map<String, String> acc, CoConstraintTableHeader header,
      Datatype datatype) {
    boolean errors = false;
    boolean complex = datatype instanceof ComplexDatatype;
    boolean coded = datatype.getName().matches("^C[N|W]?E$");
    boolean varies = datatype.getName().equals("VARIES");
    if (header.getContent().getType() == CellType.Ignore)
      return false;
    if (header.getContent().isCoded() != coded || header.getContent().isComplex() != complex
        || header.getContent().isVaries() != varies) {
      errors = true;
      acc.put("Header " + header.getContent().getPath(),
          "Element metadata is invalid or has changed");
    }

    return errors;
  }

  private void checkCells(Map<String, String> acc, Datatype datatype,
      CoConstraintTableHeader header, List<CoConstraintTableCell> cell) {
    List<CoConstraintTableCell> cells = cell.stream().filter(x -> {
      return header.getContent().getType() != x.getType()
          && header.getContent().getType() != CellType.Ignore;
    }).collect(Collectors.toList());

    for (CoConstraintTableCell c : cells) {
      acc.put("One cell of " + header.getContent().getPath(), "Incompatible data with header");
    }
  }


  private Datatype getDatatypeAtPath(Segment segment, String[] path) {
    if (path.length == 0) {
      return null;
    }

    int id = getFirstId(path);

    Field field = segment.getChildren().stream().filter(x -> {
      return x.getPosition() == id;
    }).findFirst().orElse(null);

    if (field != null) {
      Datatype dt = datatypeService.findById(field.getRef().getId());
      return path.length == 1 ? dt
          : getDatatypeAtPath(dt, Arrays.copyOfRange(path, 1, path.length));
    } else {
      return null;
    }
  }

  private Datatype getDatatypeAtPath(Datatype datatype, String[] path) {
    if (path.length == 0 || !(datatype instanceof ComplexDatatype)) {
      return null;
    }

    int id = getFirstId(path);
    ComplexDatatype asComplex = (ComplexDatatype) datatype;

    Component component = asComplex.getComponents().stream().filter(x -> {
      return x.getPosition() == id;
    }).findFirst().orElse(null);

    if (component != null) {
      Datatype dt = datatypeService.findById(component.getRef().getId());
      if (path.length == 1) {
        return datatypeService.findById(component.getRef().getId());
      } else {
        return getDatatypeAtPath(dt, Arrays.copyOfRange(path, 1, path.length));
      }
    } else {
      return null;
    }
  }

  private int getFirstId(String[] path) {
    String piece = path[0];
    return Integer.parseInt(piece.split("\\[")[0]);
  }


}
