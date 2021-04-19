package gov.nist.hit.hl7.igamt.common.base.service.impl;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;

import java.util.*;
import java.util.stream.Collectors;

public class DataExtension {
    protected Map<Class<? extends Resource>, Map<String, Resource>> resources;

    public DataExtension() {
        resources = new HashMap<>();
    }

    public <T extends Resource> T get(String id, Class<T> as) {
        Resource existing = this.resources
                .getOrDefault(as, new HashMap<>())
                .get(id);
        return existing != null? as.cast(existing) : null;
    }

    public <T extends Resource> boolean contains(String id, Class<T> as) {
        return this.resources.containsKey(as) && this.resources.get(as).containsKey(id);
    }

    public void put(Resource resource) {
        this.resources.putIfAbsent(resource.getClass(), new HashMap<>());
        this.resources.get(resource.getClass()).put(resource.getId(), resource);
    }

    public <T extends Resource> T remove(String id, Class<T> as) {
        if(this.contains(id, as)) {
            Resource v = this.resources.get(as).remove(id);
            if(this.resources.get(as).size() == 0) {
                this.resources.remove(as);
            }
            return as.cast(v);
        } else {
            return null;
        }
    }

    public List<Resource> getResources() {
        return this.resources.values()
                .stream()
                .flatMap((vMap) -> vMap.values().stream())
                .collect(Collectors.toList());
    }

}
