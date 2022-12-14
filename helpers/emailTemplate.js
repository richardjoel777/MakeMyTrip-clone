var subjectLine;
var emailBody;

export default function (otp, type) {
  if (type === "reset") {
    subjectLine = "OTP: For Reset Password";
    emailBody =
      `Dear User, \n\n` +
      "OTP for Reset Password is : \n\n" +
      `${otp}\n\n` +
      "This is a auto-generated email. Please do not reply to this email.\n\n" +
      "Regards\n" +
      "Team MakeMyTrip\n\n";
  } else if (type === "login") {
    subjectLine = "OTP: For Login";
    emailBody =
      `Dear User, \n\n` +
      "OTP for your email Login is : \n\n" +
      `${otp}\n\n` +
      "This is a auto-generated email. Please do not reply to this email.\n\n" +
      "Regards\n" +
      "Team MakeMyTrip\n\n";
  } else {
    subjectLine = "OTP: For Registration";
    emailBody =
      `Dear User, \n\n` +
      "OTP for your registration is : \n\n" +
      `${otp}\n\n` +
      "This is a auto-generated email. Please do not reply to this email.\n\n" +
      "Regards\n" +
      "Team MakeMyTrip\n\n";
  }

  //   console.log(emailBody, subjectLine);

  return {
    subject: subjectLine,
    body: emailBody,
  };
}
