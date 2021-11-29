package gov.nist.hit.hl7.igamt.bootstrap.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

  @Configuration
  @EnableRedisRepositories("gov.nist.hit.hl7.xreference.igamt")
  @ComponentScan("gov.nist.hit.hl7.igamt.xreference.model")
  public class RedisConfig {


    @Bean
    public RedisTemplate<?, ?> redisTemplate() {

      RedisTemplate<byte[], byte[]> template = new RedisTemplate<byte[], byte[]>();
      template.setConnectionFactory(jedisConnectionFactory());

      return template;
    }
    

    @Bean
    JedisConnectionFactory jedisConnectionFactory() {

        return new JedisConnectionFactory();
    }
     


    
  }