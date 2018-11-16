/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.auth.emails.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.auth.emails.service.AccountManagmenEmailService;
import gov.nist.hit.hl7.igamt.auth.exception.AuthenticationException;

/**
 * @author ena3
 *
 */

@Service
public class AccountManagmenEmailServiceImpl implements AccountManagmenEmailService {


  @Autowired
  private SimpleMailMessage templateMessage;


  @Autowired
  private JavaMailSender mailSender;

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.auth.emails.service.AccountManagmenEmailService#sendResgistrationEmail(
   * java.lang.String, java.lang.String, java.lang.String)
   */
  @Override
  public void sendResgistrationEmail(String fullname, String username, String email)
      throws AuthenticationException {
    SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
    msg.setTo(email);
    msg.setSubject("IGAMT Registration");
    msg.setText(
        "Dear " + fullname + " \n\n" + "****" + "Welcome To the ... " + "" + "\n\n" + "IGAMT TEAM");

    try {
      this.mailSender.send(msg);
    } catch (MailException ex) {
      throw new AuthenticationException("Email Exception: " + ex.getLocalizedMessage());

    } catch (RuntimeException e) {
      throw new AuthenticationException("Runtime Exception: " + e.getLocalizedMessage());

    } catch (Exception e) {
      throw new AuthenticationException("Runtime Exception: " + e.getLocalizedMessage());

    }

  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.auth.emails.service.AccountManagmenEmailService#sendRestPasswordSuccess(
   * java.lang.String, java.lang.String, java.lang.String)
   */
  @Override
  public void sendRestPasswordSuccess(String fullname, String username, String email)
      throws AuthenticationException {
    // TODO Auto-generated method stub
    SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
    msg.setTo(email);
    msg.setSubject("IGAMT Password Reset Success Notification");
    msg.setText("Dear " + fullname + " \n\n" + "****"
        + "Your Password has been successfully reseted " + "" + "\n\n" + "IGAMT TEAM");

    try {
      this.mailSender.send(msg);
    } catch (MailException ex) {
      throw new AuthenticationException("Email Exception: " + ex.getLocalizedMessage());

    } catch (RuntimeException e) {
      throw new AuthenticationException("Runtime Exception: " + e.getLocalizedMessage());

    } catch (Exception e) {
      throw new AuthenticationException("Runtime Exception: " + e.getLocalizedMessage());

    }



  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * gov.nist.hit.hl7.igamt.auth.emails.service.AccountManagmenEmailService#sendResetTokenUrl(java.
   * lang.String, java.lang.String, java.lang.String, java.lang.String)
   */
  @Override
  public void sendResetTokenUrl(String fullname, String username, String email, String url)
      throws AuthenticationException {
    // TODO Auto-generated method stub
    SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
    msg.setTo(email);
    msg.setSubject("IGAMT Password Reset Request Notification");
    msg.setText("Dear " + username + " \n\n"
        + "**** If you have not requested a password reset, please disregard this email **** \n\n\n"
        + "You password reset request has been processed.\n"
        + "Copy and paste the following url to your browser to initiate the password change:\n"
        + url + " \n\n" + "Sincerely, " + "\n\n" + "The IGAMT Team" + "\n\n"
        + "P.S: If you need help, contact us at '" + "'");

    try {
      this.mailSender.send(msg);
    } catch (MailException ex) {
      throw new AuthenticationException("Email Exception: " + ex.getLocalizedMessage());

    } catch (RuntimeException e) {
      throw new AuthenticationException("Runtime Exception: " + e.getLocalizedMessage());

    } catch (Exception e) {
      throw new AuthenticationException("Runtime Exception: " + e.getLocalizedMessage());

    }
  }
  //
  // private void sendAccountPasswordResetRequestNotification(Account acc, String url) {
  // SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
  //
  //
  // msg.setSubject("IGAMT Password Reset Request Notification");
  // msg.setText("Dear " + acc.getUsername() + " \n\n"
  // + "**** If you have not requested a password reset, please disregard this email **** \n\n\n"
  // + "You password reset request has been processed.\n"
  // + "Copy and paste the following url to your browser to initiate the password change:\n"
  // + url + " \n\n" + "Sincerely, " + "\n\n" + "The IGAMT Team" + "\n\n"
  // + "P.S: If you need help, contact us at '" + "'");
  //
  // try {
  // this.mailSender.send(msg);
  // } catch (MailException ex) {
  // ex.printStackTrace();
  // }
  // }

}
