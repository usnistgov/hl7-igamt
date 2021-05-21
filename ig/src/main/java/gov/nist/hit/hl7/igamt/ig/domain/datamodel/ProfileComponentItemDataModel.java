package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import gov.nist.hit.hl7.igamt.common.base.domain.LocationInfo;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class ProfileComponentItemDataModel implements Comparable<ProfileComponentItemDataModel>{
    String path;
    LocationInfo locationInfo;
    Set<ItemProperty> itemProperties;

    public ProfileComponentItemDataModel(String path, LocationInfo locationInfo, Set<ItemProperty> itemProperties) {
        this.path = path;
        this.locationInfo = locationInfo;
        this.itemProperties = itemProperties;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public LocationInfo getLocationInfo() {
        return locationInfo;
    }

    public void setLocationInfo(LocationInfo locationInfo) {
        this.locationInfo = locationInfo;
    }

    public Set<ItemProperty> getItemProperties() {
        return itemProperties;
    }

    public void setItemProperties(Set<ItemProperty> itemProperties) {
        this.itemProperties = itemProperties;
    }

    public int compare(ProfileComponentItemDataModel e1, ProfileComponentItemDataModel e2) {
    	if(e1.getLocationInfo() == null || e1.getLocationInfo().getPositionalPath() == null) {
    		return -1;
    	}
    	if(e2.getLocationInfo() == null || e2.getLocationInfo().getPositionalPath() == null) {
    		return 1;
    	}
    	
    	String path1 = e1.getLocationInfo().getPositionalPath();
    	String path2 = e2.getLocationInfo().getPositionalPath();
    	
    	List<Integer> table1 = transformToIntTable(path1.split("\\."));
    	List<Integer> table2 = transformToIntTable(path2.split("\\."));
    	
    int	minLength = Math.min(table1.size(),table2.size());
    int cr;
    int i;
    for(i=0; i<minLength; i++) {
    		cr = table1.get(i).compareTo(table2.get(i));
    		if(cr != 0) {
    			return cr;
    		}
    }

    			return table1.size() - table2.size();
    }
    
    public List<Integer> transformToIntTable(String[] table) {
    	List<Integer> intTable = new ArrayList<Integer>();
    	for(String s : table) {
    		intTable.add(Integer.valueOf(s));
    	}
    	return intTable;
    }

	@Override
	public int compareTo(ProfileComponentItemDataModel o) {
		return compare(this,o);
	}
    

}
