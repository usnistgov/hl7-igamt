package gov.nist.hit.hl7.igamt.xreference.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.redis.core.RedisHash;


@RedisHash
public class RelationShip{
  @Id
  private String id; 
  
  private ResourceInfo uses; 
  
  private ResourceInfo usedIn; 
  
  private ReferenceType referenceType; 
    
  private String path;
  
  public String getPath() {
    return path;
  }

  public RelationShip(ResourceInfo uses, ResourceInfo usedBy, ReferenceType referenceType, String path) {
    super();
    this.uses = uses;
    this.usedIn = usedBy;
    this.referenceType = referenceType;
    this.path = path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public ResourceInfo getUses() {
    return uses;
  }

  public void setUses(ResourceInfo uses) {
    this.uses = uses;
  }

  public ResourceInfo getUsedIn() {
    return usedIn;
  }

  public void setUsedIn(ResourceInfo usedBy) {
    this.usedIn = usedBy;
  } 
  

  public ReferenceType getReferenceType() {
    return referenceType;
  }

  public void setReferenceType(ReferenceType referenceType) {
    this.referenceType = referenceType;
  }
  

}
