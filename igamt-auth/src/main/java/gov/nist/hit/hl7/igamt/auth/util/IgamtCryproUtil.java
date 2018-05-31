package gov.nist.hit.hl7.igamt.auth.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;

@Service
public class IgamtCryproUtil {

  public IgamtCryproUtil() {}

  public PublicKey pub(String path)
      throws FileNotFoundException, IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    byte[] cert_bytes = IOUtils.toByteArray(getClass().getResourceAsStream(path));
    X509EncodedKeySpec ks = new X509EncodedKeySpec(cert_bytes);
    KeyFactory kf = KeyFactory.getInstance("RSA");
    kf.generatePublic(ks);
    return kf.generatePublic(ks);
  }



}
