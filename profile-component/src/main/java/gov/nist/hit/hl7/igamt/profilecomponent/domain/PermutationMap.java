package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Stack;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext.Level;

public class PermutationMap extends Permutation {
	
	public String targetId;
	public Type type;

	public PermutationMap(ProfileComponentContext pc) {
		super(pc.getId(), "", null, new HashSet<>(), new ArrayList<>());
		this.targetId = pc.getSourceId();
		this.type = pc.getLevel();
		for(ProfileComponentItem item : pc.getProfileComponentItems()) {
			this.compute(this.pathToStack(item.getPath()), pc.getId(), permutations, item);
		}
	}
	
	void compute(Stack<String> path, String id, List<Permutation> permutationsList, ProfileComponentItem item) {
		if(!path.isEmpty()) {
			String elementId = path.pop();
			String nId = id+"_"+elementId;
			Permutation existing = permutationsList.stream().filter(p -> p.getElementId().equals(elementId)).findAny().orElse(null);
			
			if(path.size() == 0) {
				
				if(existing != null) {
					existing.getItems().addAll(item.getItemProperties());
				} else {
					Permutation permutation = new Permutation(nId, elementId, null, item.getItemProperties(), new ArrayList<>());
					permutationsList.add(permutation);
				}
				
			} else {
				
				if(existing != null) {
					this.compute(path, nId, existing.getPermutations(), item);
				} else {
					List<Permutation> permutations = new ArrayList<>();
					Permutation permutation = new Permutation(nId, elementId, null, new HashSet<>(), permutations);
					this.compute(path, nId, permutations, item);
					permutationsList.add(permutation);
				}
				
			}
			
		}
	}
	
	private Stack<String> pathToStack(String path) {
		String[] nodes = path.split("-");
		Stack<String> stack = new Stack<>();
		for(int i = nodes.length - 1; i >= 0; i--) {
			stack.push(nodes[i]);
		}
		return stack;
	}

}
