package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Stack;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

public class FlavorCreationDirective extends ElementChangeDirective {
	
	private String targetId;
	private Type type;

	public FlavorCreationDirective(ProfileComponent pc, ProfileComponentContext ctx) {
		super("", pc.getId() + '_' + ctx.getSourceId(), pc.getId(), new HashSet<>(), new ArrayList<>());

		this.targetId = ctx.getSourceId();
		this.type = ctx.getLevel();

		// Spread Profile Component Items
		for(ProfileComponentItem item : ctx.getProfileComponentItems()) {
			this.compute(this.pathToStack(item.getPath()), pc.getId(), children, item);
		}
		
	    // Flavor Dynamic Mapping
        if(ctx.getProfileComponentDynamicMapping() != null) {
            this.getItems().add(ctx.getProfileComponentDynamicMapping());
        }
        
		// Spread Bindings
		if(ctx.getProfileComponentBindings() != null) {
			// Flavor level bindings
			if(ctx.getProfileComponentBindings().getContextBindings() != null) {
				this.getItems().addAll(ctx.getProfileComponentBindings().getContextBindings());
			}

			// Flavor children level bindings
			if(ctx.getProfileComponentBindings().getItemBindings() != null) {
				for(ProfileComponentItemBinding item : ctx.getProfileComponentBindings().getItemBindings()) {
					this.compute(this.pathToStack(item.getPath()), pc.getId(), children, transform(item));
				}
			}
		}
	}

	ProfileComponentItem transform(ProfileComponentItemBinding binding) {
		return new ProfileComponentItem(binding.getPath(), new HashSet<>(binding.getBindings()));
	}
	
	void compute(Stack<String> path, String id, List<ElementChangeDirective> permutationsList, ProfileComponentItem item) {
		if(!path.isEmpty()) {
			String elementId = path.pop();
			String directiveId = id + "_" + elementId;
			ElementChangeDirective existing = permutationsList.stream().filter(p -> p.getTargetElementId().equals(elementId)).findAny().orElse(null);
			
			if(path.size() == 0) {
				
				if(existing != null) {
					existing.getItems().addAll(item.getItemProperties());
				} else {
					ElementChangeDirective permutation = new ElementChangeDirective(elementId, directiveId, this.getProfileComponentSourceId(), item.getItemProperties(), new ArrayList<>());
					permutationsList.add(permutation);
				}
				
			} else {
				
				if(existing != null) {
					this.compute(path, directiveId, existing.getChildren(), item);
				} else {
					List<ElementChangeDirective> permutations = new ArrayList<>();
					ElementChangeDirective permutation = new ElementChangeDirective(elementId, directiveId, this.getProfileComponentSourceId(), new HashSet<>(), permutations);
					this.compute(path, directiveId, permutations, item);
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

	public String getTargetId() {
		return targetId;
	}

	public void setTargetId(String targetId) {
		this.targetId = targetId;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}
}
