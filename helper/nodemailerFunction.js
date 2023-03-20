const nodemailer = require("nodemailer")

module.exports={

  sendMail(email, subject, body) {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {         
          user: "kshubh8604@gmail.com",
          pass: "ssruulevuyoniehi",
        },
      });
      var mailOption = {
        from: "Shubham.kumar@mailinator.com",
        to: email,
        subject: subject,
        text: body,
      };
      transporter.sendMail(mailOption, (error, result) => {        
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  },



  
};