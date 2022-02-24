package gov.nist.hit.hl7.igamt.serialization.util;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ValuesetDataModel;
import org.springframework.stereotype.Service;

@Service
public class SerializationTools {

    public String extractVs(List<DisplayElement> valuesets){
        String result = "";
        if(valuesets != null){
            for(int i =0; i< valuesets.size(); i++){
                result += valuesets.get(i).getVariableName();
                if(i != valuesets.size()-1){
                    result += " ,";
                }
            }
        }

        return result;
    }
    public String extractLocations(Set<Integer> locations){
        Integer[] array = locations.toArray( new Integer[locations.size()] );

        String result = "";
        if(array != null){
            for(int i =0; i< array.length; i++){
                result += array[i].toString();
                if(i != array.length-1){
                    result += " ,";
                }
            }
        }
        return result;
    }
    
    public String extractPredicateUsages(Map<String, Predicate> predicateMap , String keyId){
    	String result ="C(A/B)";
        for(String key : predicateMap.keySet()) {
        	if(key.equals(keyId)) {
        		return  "C("+ predicateMap.get(key).getTrueUsage().name() + "/" + predicateMap.get(key).getFalseUsage().name()+")"; 
        	}
        }
        return result;
    }
}

//	public Set<Link> sortValuesetSet(Set<ValuesetDataModel> set){
//		 return set.stream()
//		  .sorted(Comparator.comparing(Link::getTitle)).collect(Collectors.toList());
//		
//	}
//}
