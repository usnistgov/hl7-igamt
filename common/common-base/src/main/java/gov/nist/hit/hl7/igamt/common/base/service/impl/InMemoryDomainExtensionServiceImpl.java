package gov.nist.hit.hl7.igamt.common.base.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import de.undercouch.bson4jackson.BsonFactory;
import de.undercouch.bson4jackson.BsonGenerator;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.service.InMemoryDomainExtensionService;

@Service
public class InMemoryDomainExtensionServiceImpl implements InMemoryDomainExtensionService {
	private final ConcurrentMap<String, List<String>> tokenRegistry;
	private final ConcurrentMap<String, InMemoryResource> resources;
	private static ObjectMapper mapper;
	{
		BsonFactory fac = new BsonFactory();
		fac.enable(BsonGenerator.Feature.ENABLE_STREAMING);
		mapper = new ObjectMapper(fac);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	}

	public InMemoryDomainExtensionServiceImpl() {
		super();
		tokenRegistry = new ConcurrentHashMap<>();
		resources = new ConcurrentHashMap<>();
	}
	
	@Override
	public <T extends Resource> T findById(String id, Class<T> as) {
		try {
			InMemoryResource resource = resources.get(id);
			if(resource != null && resource.getType().equals(as)) {
				return deserialize(resource, as);
			} else {
				return null;
			}
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	private static <T extends Resource> T deserialize(InMemoryResource resource, Class<T> as) throws IOException {
		ByteArrayInputStream bais = new ByteArrayInputStream(resource.bytes);
		return mapper.readValue(bais, as);
	}

	private static <T extends Resource> InMemoryResource serialize(T resource) throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ObjectMapper mapper = new ObjectMapper(new BsonFactory());
		mapper.writeValue(baos, resource);
		return new InMemoryResource(resource.getId(), baos.toByteArray(), resource.getClass());
	}

	public static <T extends Resource> T clone(T resource) throws IOException {
		return (T) deserialize(serialize(resource), resource.getClass());
	}
	
	@Override
	public <T extends Resource> List<T> getAll(Class<T> as) {
		return resources.values()
				.stream()
				.filter((x) -> x.getType().equals(as))
				.map(x -> this.findById(x.getId(), as))
				.filter(Objects::nonNull)
				.collect(Collectors.toList());
	}
	
	@Override
	public String getToken() {
		return UUID.randomUUID().toString();
	}

	public <T extends Resource> void put(String token, T resource) throws IOException {
		if(Strings.isNullOrEmpty(resource.getId())) {
			resource.setId(this.getToken());
		}
		InMemoryResource transform = this.serialize(resource);
		this.resources.put(resource.getId(), transform);
		this.tokenRegistry.putIfAbsent(token, new ArrayList<>());
		this.tokenRegistry.get(token).add(resource.getId());
	}
	
	@Override
	public <T extends Resource> void put(String token, List<T> resources) {
		resources.forEach((resource) -> {
			try {
				this.put(token, resource);
			} catch (IOException e) {
				e.printStackTrace();
			}
		});
	}
	
	@Override
	public void clear(String token) {
		if(!Strings.isNullOrEmpty(token) && this.tokenRegistry.containsKey(token)) {
			for(String id : this.tokenRegistry.get(token)) {
				this.resources.remove(id);
			}
			this.tokenRegistry.remove(token);
		}
	}

	@Override
	public String put(DataExtension extension) {
		String token = this.getToken();
		this.put(token, extension.getResources());
		return token;
	}

	@Override
	public String put(DataExtension extension, Resource context) {
		String token = this.getToken();
		List<Resource> resources = new ArrayList<>(extension.getResources());
		resources.add(context);
		this.put(token, resources);
		return token;
	}

	
}
