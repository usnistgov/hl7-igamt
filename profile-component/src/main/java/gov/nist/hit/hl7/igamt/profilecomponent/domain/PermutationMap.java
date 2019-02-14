package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Stack;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent.Level;

public class PermutationMap extends Permutation {
	
	public String targetId;
	public Level type;

	public PermutationMap(ProfileComponent pc) {
		super(pc.getId(), 0, null, new HashSet<>(), new ArrayList<>());
		this.targetId = pc.getSourceId();
		this.type = pc.getLevel();
		for(ProfileComponentItem item : pc.getProfileComponentItems()) {
			this.compute(this.pathToStack(item.getPath()), pc.getId(), permutations, item);
		}
	}
	
	void compute(Stack<Integer> path, String id, List<Permutation> permutationsList, ProfileComponentItem item) {
		if(!path.isEmpty()) {
			int i = path.pop();
			String nId = id+"_"+i;
			Permutation existing = permutationsList.stream().filter(p -> p.getPosition() == i).findAny().orElse(null);
			
			if(path.size() == 0) {
				
				if(existing != null) {
					existing.getItems().addAll(item.getDeltaObjects());
				} else {
					Permutation permutation = new Permutation(nId, i, null, item.getDeltaObjects(), new ArrayList<>());
					permutationsList.add(permutation);
				}
				
			} else {
				
				if(existing != null) {
					this.compute(path, nId, existing.getPermutations(), item);
				} else {
					List<Permutation> permutations = new ArrayList<>();
					Permutation permutation = new Permutation(nId, i, null, new HashSet<>(), permutations);
					this.compute(path, nId, permutations, item);
					permutationsList.add(permutation);
				}
				
			}
			
		}
	}
	
	private Stack<Integer> pathToStack(String path) {
		String[] nodes = path.split("\\.");
		Stack<Integer> stack = new Stack<>();
		for(int i = nodes.length - 1; i >= 0; i--) {
			stack.push(Integer.parseInt(nodes[i]));
		}
		return stack;
	}

}
