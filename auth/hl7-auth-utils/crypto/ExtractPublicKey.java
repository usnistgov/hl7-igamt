package gov.nist.hit.hl7.auth.crypto;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;

/**
 * This class is capable of extracting a public key from a X.509 certficate 
 * and returning the PublicKey representation from a referenced byte array.
 * 
 */
public class ExtractPublicKey {
	

//	openssl genrsa -out rsaprivkey.pem 1024

	//Generates the public key in DER format.

	//openssl rsa -in rsaprivkey.pem -pubout -outform DER -out rsapubkey.der

  // Certificate Filename (Including Path Info)
  private static final String certFilename = "cacert.pem";

  // Public Key Filename (Including Path Info)
  private static final String pubKeyFilename = "rsapublic.key";

  public static PublicKey generatePublicKey(byte[] encodedKey)
      throws NoSuchAlgorithmException, InvalidKeySpecException {

    X509EncodedKeySpec pubSpec = new X509EncodedKeySpec(encodedKey);
    boolean isSupportedKey = false;
    KeyFactory factory;
    PublicKey retKey = null;

    //first try the DSA alg
    try {
      factory = KeyFactory.getInstance("DSA");
      retKey = factory.generatePublic(pubSpec);
      isSupportedKey = true;
    } catch (InvalidKeySpecException e) {
      System.out.println("Could not create DSA Public Key: " + e.toString());      
    }

    //if DSA didnt work, then try RSA    
    if (!isSupportedKey) {
      try {
        factory = KeyFactory.getInstance("RSA");
        retKey = factory.generatePublic(pubSpec);
        isSupportedKey = true;
      } catch (InvalidKeySpecException e) {
        System.out.println("Could not create RSA Public Key: " + e.toString());
      }      
    }

    // if not DSA or RSA
    if (!isSupportedKey) {
      throw new InvalidKeySpecException("Unsupported key spec: Not RSA or DSA");
    }

    return retKey;
  }   

}