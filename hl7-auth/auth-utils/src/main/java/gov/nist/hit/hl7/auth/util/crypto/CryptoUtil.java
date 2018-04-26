package gov.nist.hit.hl7.auth.util.crypto;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;

public interface CryptoUtil {

	
	public PublicKey pub(String path) throws FileNotFoundException, IOException, NoSuchAlgorithmException, InvalidKeySpecException;
	public PrivateKey priv(String path) throws FileNotFoundException, IOException, NoSuchAlgorithmException, InvalidKeySpecException ;



}
