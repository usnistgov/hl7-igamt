package gov.nist.hit.hl7.auth;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nist.hit.hl7.auth.converter.OldAccount;
import gov.nist.hit.hl7.auth.converter.OldUser;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args ) throws JsonParseException, JsonMappingException, FileNotFoundException, IOException
    {
        System.out.println( "Hello World!" );
        
   
        File UserFile = new ClassPathResource("User.json").getFile();
        
        File AccountFile = new ClassPathResource("Account.json").getFile();

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        List<OldUser> users = objectMapper.readValue(new FileInputStream(UserFile), new TypeReference<List<OldUser>>(){});
        Map<String, OldUser> usersMap= users.stream().collect(
        		
                Collectors.groupingBy(OldUser::getUsername, Collectors.collectingAndThen(Collectors.toList(), x -> {
                		return x.get(0);
                }))              // returns a LinkedHashMap, keep order
                
        		);
        	
        
        List<OldAccount> accounts = objectMapper.readValue(new FileInputStream( AccountFile), new TypeReference<List<OldAccount>>(){});
        Map<String, OldAccount> accountsMap= accounts.stream().collect(
        		
                Collectors.groupingBy(OldAccount::getUsername, Collectors.collectingAndThen(Collectors.toList(), x -> {
                		return x.get(0);
                }))              // returns a LinkedHashMap, keep order
                
        		);
       
        
        


        
    }
}
