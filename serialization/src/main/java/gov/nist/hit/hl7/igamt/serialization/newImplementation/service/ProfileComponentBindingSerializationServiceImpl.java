package gov.nist.hit.hl7.igamt.serialization.newImplementation.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.ig.domain.datamodel.ProfileComponentItemDataModel;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertySingleCode;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.PropertyValueSet;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;
import nu.xom.Attribute;
import nu.xom.Element;

@Service
public class ProfileComponentBindingSerializationServiceImpl implements ProfileComponentBindingSerializationService{

	@Autowired
	private ValuesetService valuesetService;
	
	@Override
	public Element serializeProfileComponentValuesetBindings(
			List<ProfileComponentItemDataModel> profileComponentItemDataModelList) {
		
		
		Element valuesetbindingsElement = new Element("valuesetbindingsElement");
		for(ProfileComponentItemDataModel profileComponentItemDataModel : profileComponentItemDataModelList) {
			if(profileComponentItemDataModel != null) {
				ItemProperty itemProperty = profileComponentItemDataModel.getItemProperties().stream().filter((item) -> {
					return item instanceof PropertyValueSet;
				}).findAny().get();
			Element valuesetbindingElement = new Element("ValuesetBinding");
			valuesetbindingElement.addAttribute(
    				new Attribute("name", profileComponentItemDataModel.getLocationInfo() != null ? profileComponentItemDataModel.getLocationInfo().getName() : "")
			);
			valuesetbindingElement.addAttribute(
    				new Attribute("Position2", profileComponentItemDataModel.getLocationInfo() != null ? profileComponentItemDataModel.getLocationInfo().getHl7Path() : "")
			);
			valuesetbindingElement.addAttribute(
    				new Attribute("positionalPath", profileComponentItemDataModel.getLocationInfo() != null ? profileComponentItemDataModel.getLocationInfo().getPositionalPath() : "")
			);
			valuesetbindingElement.addAttribute(
    				new Attribute("name", ((PropertyValueSet) itemProperty).getValuesetBindings()!= null  && !createValueSetList(((PropertyValueSet) itemProperty).getValuesetBindings()).isEmpty() ? createValueSetList(((PropertyValueSet) itemProperty).getValuesetBindings()).toString() : "")
			);
			valuesetbindingElement.addAttribute(
    				new Attribute("strength", (((PropertyValueSet) itemProperty).getValuesetBindings() != null && !((PropertyValueSet) itemProperty).getValuesetBindings().isEmpty())  ? ((PropertyValueSet) itemProperty).getValuesetBindings().iterator().next().getStrength().name() : "")
			);
			valuesetbindingElement.addAttribute(
    				new Attribute("locations", (((PropertyValueSet) itemProperty).getValuesetBindings() != null && !((PropertyValueSet) itemProperty).getValuesetBindings().isEmpty() && !createBindingLocation(((PropertyValueSet) itemProperty).getValuesetBindings().iterator().next().getValuesetLocations(),profileComponentItemDataModel.getLocationInfo().getHl7Path()).isEmpty()) ? createBindingLocation(((PropertyValueSet) itemProperty).getValuesetBindings().iterator().next().getValuesetLocations(), profileComponentItemDataModel.getLocationInfo().getHl7Path()).toString() : "")
			);
			if(valuesetbindingElement != null && ((PropertyValueSet) itemProperty).getValuesetBindings() != null) {
				valuesetbindingsElement.appendChild(valuesetbindingElement);
			}
		}
	}
		return valuesetbindingsElement;
	}

	private List<String> createBindingLocation(Set<Integer> valuesetLocations, String hl7Path) {
		List<String> bindingLocations = new ArrayList<String>();
		for(Integer location : valuesetLocations) {
			String bindingLocation = hl7Path +"."+location;
			bindingLocations.add(bindingLocation);
		}
		return bindingLocations;
	}

	public List<String> createValueSetList(Set<ValuesetBinding> valuesetBindings) {
		List<String> vsList = new ArrayList<String>();
		for(ValuesetBinding valuesetBinding : valuesetBindings) {
			for(String vs : valuesetBinding.getValueSets()) {
				Valueset valueset = valuesetService.findById(vs);
				vsList.add(valueset.getLabel());
			}
		}
		return vsList;
	}

	@Override
	public Element serializeProfileComponentSingleCodes(
			List<ProfileComponentItemDataModel> profileComponentItemDataModelList) {

		
		Element internalSingleCode = new Element("InternalSingleCode");
		for(ProfileComponentItemDataModel profileComponentItemDataModel : profileComponentItemDataModelList) {
			if(profileComponentItemDataModel != null) {
				ItemProperty itemProperty = profileComponentItemDataModel.getItemProperties().stream().filter((item) -> {
					return item instanceof PropertySingleCode;
				}).findAny().get();
				internalSingleCode.addAttribute(
    				new Attribute("internalSingleCodeLocation", profileComponentItemDataModel.getLocationInfo() != null ? profileComponentItemDataModel.getLocationInfo().getHl7Path() : "")
			);
				internalSingleCode.addAttribute(
    				new Attribute("internalSingleCodeId", ((PropertySingleCode) itemProperty).getInternalSingleCode() != null ? ((PropertySingleCode) itemProperty).getInternalSingleCode().getCode() : "")
			);
				internalSingleCode.addAttribute(
    				new Attribute("internalSingleCodeSystem", ((PropertySingleCode) itemProperty).getInternalSingleCode() != null ?((PropertySingleCode) itemProperty).getInternalSingleCode().getCodeSystem() : "")
			);
		}
	}
		return internalSingleCode;
	
	}

}
