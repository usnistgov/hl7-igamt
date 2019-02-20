package gov.nist.hit.hl7.igamt.common.base.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtentionService;

@Service
public class InMemoryDomainExtentionServiceImpl implements InMemoryDomainExtentionService {
	
	public static class DataFragment<T extends Resource> {
		private T payload;
		private DataExtention context;
		
		
		public DataFragment(T payload, DataExtention context) {
			super();
			this.payload = payload;
			this.context = context;
		}
		public T getPayload() {
			return payload;
		}
		public void setPayload(T payload) {
			this.payload = payload;
		}
		public DataExtention getContext() {
			return context;
		}
		public void setContext(DataExtention context) {
			this.context = context;
		}
	}
	
	public static class DataExtention {
		protected Map<Class<? extends Resource>, List<Resource>> resources;

		public DataExtention() {
			resources = new HashMap<>();
		}
		
		public <T extends Resource> T cloneAndAddIfNotPresent(T resource, Class<T> as) {
			if(!this.resources.containsKey(as)){
				this.resources.put(as, new ArrayList<>());
			}
			
			Resource existing = this.resources.get(as).stream().filter(d -> d.getId().equals(resource.getId())).findAny().orElse(null);
			if(existing != null) {
				return as.cast(existing);
			}
			else {
				T clone = cloneAndCast(resource, as);
				clone.setId(UUID.randomUUID().toString());
				this.resources.get(as).add(clone);
				return clone;
			}
		}
		
	}
	
	private ConcurrentMap<String, List<String>> refs;
	private ConcurrentMap<String, Resource> resources;

	public InMemoryDomainExtentionServiceImpl() {
		super();
		refs = new ConcurrentHashMap<>();
		resources = new ConcurrentHashMap<>();
	}
	
	private static <T extends Resource> T cloneAndCast(Resource r, Class<T> as) {
		try {
			return as.cast(as.cast(r).clone());
		}
		catch(Exception e) {
			return null;
		}
	}
	
	@Override
	public <T extends Resource> T findById(String id, Class<T> as) {
		Resource resource = resources.get(id);
		return resource != null ? this.cloneAndCast(resource, as) : null;
	}
	
	@Override
	public <T extends Resource> List<T> getAll(Class<T> as) {
		return resources.values().stream().map(x -> this.cloneAndCast(x, as)).filter(x -> x != null).collect(Collectors.toList());
	}
	
	@Override
	public String getToken() {
		return UUID.randomUUID().toString();
	}
	
	@Override
	public <T extends Resource> void put(String token, List<T> resources) {
		if(resources.size() > 0) {
			refs.putIfAbsent(token, new ArrayList<>());
			resources.forEach(d -> {
				if(d.getId() == null && d.getId().isEmpty())
					d.setId(this.getToken());
				this.resources.putIfAbsent(d.getId(), d);
			});
			refs.get(token).addAll(resources.stream().map(d -> d.getId()).collect(Collectors.toList()));
		}		
	}
	
	@Override
	public void clear(String token) {
		if(this.refs.containsKey(token)) {
			for(String id : this.refs.get(token)) {
				this.resources.remove(id);
			}
			this.refs.remove(token);
		}
	}

	@Override
	public String put(DataExtention extention) {
		String token = this.getToken();
		
		for(Class<? extends Resource> clazz : extention.resources.keySet()) {
			this.put(token, extention.resources.get(clazz));
		}
		
		return token;
	}

	
}
