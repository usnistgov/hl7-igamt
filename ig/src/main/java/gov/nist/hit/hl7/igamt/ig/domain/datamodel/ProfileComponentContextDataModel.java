package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import com.google.common.base.Strings;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentContext;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponentItem;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyBinding;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyCoConstraintBindings;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyDynamicMapping;
import gov.nist.hit.hl7.igamt.service.impl.DataElementNamingService;

import java.util.*;

public class ProfileComponentContextDataModel implements Comparable< ProfileComponentContextDataModel > {
    private String id;
    private Type level;
    private String sourceId;
    private String structure;
    private int position;
    private Set<PropertyBinding> rootContextBindings;
    private Map<String, ProfileComponentItemDataModel> profileComponentItemMap;
    private PropertyDynamicMapping profileComponentDynamicMapping;
    private PropertyCoConstraintBindings profileComponentCoConstraints;
    

    public ProfileComponentContextDataModel(ProfileComponentContext profileComponentContext, DataElementNamingService namingService) {
        this.id = profileComponentContext.getId();
        this.level = profileComponentContext.getLevel();
        this.sourceId = profileComponentContext.getSourceId();
        this.structure = profileComponentContext.getStructure();
        this.position = profileComponentContext.getPosition();
        this.profileComponentDynamicMapping = profileComponentContext.getProfileComponentDynamicMapping();
        this.profileComponentCoConstraints = profileComponentContext.getProfileComponentCoConstraints();
        profileComponentItemMap = new HashMap<>();
        this.rootContextBindings = new HashSet<PropertyBinding>();
        for(ProfileComponentItem item: profileComponentContext.getProfileComponentItems()) {
            this.addToItemMap(item.getPath(), item.getItemProperties(), namingService);
        }

        if(profileComponentContext.getProfileComponentBindings() != null) {
            if(profileComponentContext.getProfileComponentBindings().getContextBindings() != null) {
                profileComponentContext
                    .getProfileComponentBindings()
                    .getContextBindings()
                    .forEach((elm) -> {
                        if(Strings.isNullOrEmpty(elm.getTarget())) {
                            rootContextBindings.add(elm);
                        } else {
                            this.addToItemMap(elm.getTarget(), new HashSet<>(Collections.singleton(elm)), namingService);
                        }
                    });
            }

            if(profileComponentContext.getProfileComponentBindings().getItemBindings() != null) {
                profileComponentContext
                    .getProfileComponentBindings()
                    .getItemBindings()
                    .forEach((profileComponentItemBinding -> {
                        profileComponentItemBinding.getBindings().forEach((binding) -> {
                            this.addToItemMap(
                                    this.append(profileComponentItemBinding.getPath(), binding.getTarget()),
                                    new HashSet<>(Collections.singleton(binding)),
                                    namingService
                            );
                        });
                    }));
            }
        }
    }

    private void addToItemMap(String path, Set<ItemProperty> properties, DataElementNamingService namingService) {
        ProfileComponentItemDataModel profileComponentItemDataModel;
        if(profileComponentItemMap.containsKey(path)) {
            profileComponentItemDataModel = profileComponentItemMap.get(path);
            profileComponentItemDataModel.getItemProperties().addAll(properties);
        } else {
            profileComponentItemDataModel = new ProfileComponentItemDataModel(path, namingService.computeLocationInfo(this.level, this.sourceId, path), properties);
            profileComponentItemMap.put(path, profileComponentItemDataModel);
        }
    }

    private String append(String source, String value) {
        if(Strings.isNullOrEmpty(source)) {
            return value;
        } else {
            return source + "-" + value;
        }
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Type getLevel() {
        return level;
    }

    public void setLevel(Type level) {
        this.level = level;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getStructure() {
        return structure;
    }

    public void setStructure(String structure) {
        this.structure = structure;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public Set<PropertyBinding> getRootContextBindings() {
        return rootContextBindings;
    }

    public void setRootContextBindings(Set<PropertyBinding> rootContextBindings) {
        this.rootContextBindings = rootContextBindings;
    }

    public Map<String, ProfileComponentItemDataModel> getProfileComponentItemMap() {
        return profileComponentItemMap;
    }

    public void setProfileComponentItemMap(Map<String, ProfileComponentItemDataModel> profileComponentItemMap) {
        this.profileComponentItemMap = profileComponentItemMap;
    }
    

	public PropertyDynamicMapping getProfileComponentDynamicMapping() {
		return profileComponentDynamicMapping;
	}

	public void setProfileComponentDynamicMapping(PropertyDynamicMapping profileComponentDynamicMapping) {
		this.profileComponentDynamicMapping = profileComponentDynamicMapping;
	}

	public PropertyCoConstraintBindings getProfileComponentCoConstraints() {
		return profileComponentCoConstraints;
	}

	public void setProfileComponentCoConstraints(PropertyCoConstraintBindings profileComponentCoConstraints) {
		this.profileComponentCoConstraints = profileComponentCoConstraints;
	}

	@Override
	public int compareTo(ProfileComponentContextDataModel o) {
        return Integer.valueOf(this.getPosition()).compareTo(o.getPosition());
	}
}
