package gov.nist.hit.hl7.igamt.xreference.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;


@RedisHash
public class RelationShip{
  @Id
  private String id; 
  
  @Indexed private ResourceInfo uses; 
  
  @Indexed private ResourceInfo usedIn; 
  
  private ReferenceType referenceType; 
    
  @Indexed private String path;
  
  public String getPath() {
    return path;
  }

  public RelationShip(ResourceInfo uses, ResourceInfo usedIn, ReferenceType referenceType, String path) {
    super();
    this.uses = uses;
    this.usedIn = usedIn;
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

  public void setUsedIn(ResourceInfo usedIn) {
    this.usedIn = usedIn;
  } 
  

  public String getId() {
	return id;
}

public void setId(String id) {
	this.id = id;
}

public ReferenceType getReferenceType() {
    return referenceType;
  }

  public void setReferenceType(ReferenceType referenceType) {
    this.referenceType = referenceType;
  }
  

}
