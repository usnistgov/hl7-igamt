package gov.nist.hit.hl7.igamt.ig.configuration;

import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongodConfig;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import java.io.IOException;

@Service
public class EmbeddedMongoDB {

	private final MongodProcess mongod;
	private final MongodExecutable executable;
	private final int port;

	public EmbeddedMongoDB() throws IOException {
		MongodStarter starter = MongodStarter.getDefaultInstance();
		port = Network.getFreeServerPort();
		MongodConfig mongodConfig = MongodConfig.builder()
		                                        .version(Version.V4_2_22)
		                                        .net(new Net(port, Network.localhostIsIPv6()))
		                                        .build();
		executable = starter.prepare(mongodConfig);
		mongod = executable.start();
	}

	public int getPort() {
		return port;
	}

	@PreDestroy
	public void close() {
		if(executable != null) {
			executable.stop();
		}
	}
}
