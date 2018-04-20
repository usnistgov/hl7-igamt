package gov.nist.hit.hl7.auth.crypto;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;

import java.security.spec.X509EncodedKeySpec;

@Service
public class CryptoUtilImpl implements CryptoUtil {

	public CryptoUtilImpl() {	
}
	
	@Override
	public PublicKey pub() throws FileNotFoundException, IOException, NoSuchAlgorithmException, InvalidKeySpecException{
		byte[] cert_bytes = IOUtils.toByteArray(new FileInputStream("~/hl7-igamt/auth/KeyPair/publicKey.txt"));
	    X509EncodedKeySpec ks = new X509EncodedKeySpec(cert_bytes);
	    KeyFactory kf = KeyFactory.getInstance("RSA");
	    kf.generatePublic(ks);
	    return     kf.generatePublic(ks);
	}
	
	
	
	@Override
	public PrivateKey priv() throws FileNotFoundException, IOException, NoSuchAlgorithmException, InvalidKeySpecException {
		byte[] bytes = IOUtils.toByteArray(new FileInputStream("~/hl7-igamt/auth/KeyPair/privateKey.txt"));
		PKCS8EncodedKeySpec ks = new PKCS8EncodedKeySpec(bytes);
		KeyFactory kf = KeyFactory.getInstance("RSA");
		
		return  kf.generatePrivate(ks);
	}

	
	


}