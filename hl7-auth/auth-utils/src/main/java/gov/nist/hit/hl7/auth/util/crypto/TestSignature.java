package gov.nist.hit.hl7.auth.util.crypto;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

public class TestSignature {

	public TestSignature() {
		// TODO Auto-generated constructor stub
	}

	public static void main(String[] args) throws ExpiredJwtException, UnsupportedJwtException, MalformedJwtException, SignatureException, IllegalArgumentException, FileNotFoundException, NoSuchAlgorithmException, InvalidKeySpecException, IOException {
		// TODO Auto-generated method stub
//			String token="eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ3YWtpbGkiLCJleHAiOjE1MjQ0OTE1OTYsInJvbGVzIjpbeyJyb2xlIjoiVVNFUiIsImlkIjoiNWFiZTk2OThlMjgxM2YxYzRlNzAwYTY5IiwiYXV0aG9yaXR5IjoiVVNFUiJ9XX0.BCAkHmSVpybA6bB0iEEJNAKEpkUYeNgu-wAuhaMzoKIatp0CCrXnIr8cU7u9D1jY7utAplBMaY0Qq525Li3iEjl-V--xkJpBy5WxcRXSW9ICb2SuVLoC_VzONKOKT38VvoTC8ja_HruJHksb2fe09NmIB93utycGMv6tZM8WKW4";
//			CryptoUtilImpl crypto= new CryptoUtilImpl();
//			
//			Claims claims = Jwts.parser().setSigningKey(crypto.priv()).parseClaimsJws(token).getBody();
//			String username= claims.getSubject();
//			System.out.println(username);
//			ArrayList<Map<String,String>> roles = (ArrayList<Map<String, String>>) claims.get("roles");
//			
//			
//			Collection<GrantedAuthority> authorities = new ArrayList<>();
//			roles.forEach(r ->{
//				
//				authorities.add(new SimpleGrantedAuthority(r.get("authority")));
//				
			//});
	}

}
