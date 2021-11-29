package gov.nist.hit.hl7.igamt.datatypeLibrary.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.datatypeLibrary.exceptions.DatatypeLibraryConverterException;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.AddDatatypeResponseDisplay;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.DatatypeLibraryDisplay;
import gov.nist.hit.hl7.igamt.datatypeLibrary.model.TreeNode;
import gov.nist.hit.hl7.igamt.datatypeLibrary.wrappers.AddDatatypeResponseObject;

/**
 * @author ena3
 *
 */
@Service
public interface DatatypeLibraryDisplayConverterService {

  public DatatypeLibraryDisplay convertDomainToModel(DatatypeLibrary lib)
      throws DatatypeLibraryConverterException;


  public List<TreeNode> getDatatypesNodes(Set<Datatype> datatypes);


  public TreeNode createDatatypeNode(Datatype elm, int position);


  public TreeNode createNarrativeNode(TextSection s);


  public Set<TextSection> convertTocToDomain(List<TreeNode> toc);

  public AddDatatypeResponseDisplay convertDatatypeResponseToDisplay(
      AddDatatypeResponseObject objects);



}
