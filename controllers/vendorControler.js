const userModel = require("../model/user");
const nodemailerFunction = require("../helper/nodemailerFunction");

const nodemailer = require("nodemailer");
const otp = require("../helper/common");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";
const bcrypt = require("bcrypt");
const { hashSync } = require("bcrypt");
const Joi = require("joi");

module.exports = {
  vendorCreate: async (req, res) => {
    const schema = Joi.object().keys({
      vendorName: Joi.string().min(3).max(30).required(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] },
      }),
      address: Joi.string().min(3).max(50).required(),
      pincode: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
      mobileNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
      userType: Joi.string().min(3).max(10).required(),
    });
    schema.validateAsync(req.body);
    try {
      const userData = await userModel.findOne({ email: req.body.email });
      if (userData) {
        // return res.send(errorCode.Internal_Server_Error());
        // console.log(userData);
        return res.status(200).send({
          responseMessage: "This vendor is already exist..",
          responseCode: 200,
        });
      } else {
        req.body.otp = otp.generateOTP();

        /* Adding Curent Time for OTP Verification...*/
        req.body.otpTime = Date.now() + 180000;

        let subject = "Vendor signup successfully";
        let body = "Thank You For contacting us. We will back Soon.";
        let send = await nodemailerFunction.sendMail(
          req.body.email,
          subject,
          body
        );

        if (send) {
          const vendorData = await userModel({
            vendorName: req.body.vendorName,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            address: req.body.address,
            image: req.files.path,
            pincode: req.body.pincode,
            userType: req.body.userType,
            otp: req.body.otp,
            otpTime: req.body.otpTime,
          });

          const user_data = await vendorData.save();
          if (user_data) {
            return res.status(200).send({
              responseMessage: "Vendor Created Successfully",
              responseCode: 200,
              data: user_data,
            });
          } else {
            // console.log(err1);
            return res.status(500).send({
              responseMessage: "Internal server error",
              responseCode: 500,
              error: [],
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(501).send({
        responseMessage: "Not Implemented",
        responseCode: 501,
        error: error,
      });
    }
  },
  // Vendor Otp Verification

  vendorOtpVerification: async (req, res) => {
    const schema = Joi.object().keys({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
    });
    schema.validateAsync(req.body);
    try {
      const userData = await userModel.findOne({ email: req.body.email });
      if (!userData) {
        // console.log("Email is not in Database..!!");
        // return res.send(errorCode.Not_Found());
        return res.status(404).send({
          responseMessage: "Email is not in database..!!",
          responseCode: 404,
        });
      } else {
        if (userData.otp == req.body.otp) {
          /* Compair OTP at real time...!! */
          if (userData.otpTime >= Date.now()) {
            if (userData.OtpVerification == false) {
              const user_data = await userModel.findByIdAndUpdate(
                { _id: userData.id },
                { $set: { OtpVerification: true } },
                { new: true }
              );

              if (!user_data) {
                // return res.send(errorCode.Not_Found());
                return res.status(500).send({
                  responseMessage: "failed",
                  responseCode: 500,
                });
              } else {
                // return res.send(errorCode.Success() );
                return res.status(200).send({
                  responseMessage: "success",
                  responseCode: 200,
                  user_data,
                });
              }
            } else {
              return res.status(401).send({
                responseMessage: "Otp verified already..!!",
                responseCode: 401,
              });
            }
          } else {
            return res.status(401).send({
              responseMessage: "Otp time expired..!!",
              responseCode: 401,
            });
          }
        } else {
          return res.status(401).send({
            responseMessage: " Invalid Otp!!",
            responseCode: 401,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({
        responseMessage: "Internal server error",
        responseCode: 500,
      });
    }
  },

  // // Vendor Login

  vendorLogin: async (req, res) => {
    const schema = Joi.object().keys({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      password: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$"
          )
        )
        .required(),
    });
    schema.validateAsync(req.body);
    try {
      const userData = await userModel.findOne({
        $and: [{ email: req.body.email, userType: "Vendor" }],
      });
      // console.log(userData);
      if (userData) {
        if ((approvalStatus = "Approve")) {
          var check = bcrypt.compareSync(req.body.password, userData.password);
          if (check == false) {
            return res.status(403).send({
              responseCode: 403,
              responseMessage: "Incorrect Password.",
            });
          } else {
            token = jwt.sign(
              { _id: userData._id, email: userData.email },
              "secretKey",
              { expiresIn: "1H" }
            );
            return res.status(200).send({
              responseMessage: "Login Success",
              responseCode: 200,
              token,
              userData,
            });
          }
        } else {
          return res.status(401).send({
            responseCode: 401,
            responseMessage: "Approval Status pending....!!",
          });
        }
      } else {
        return res.status(501).send({
          responseCode: 501,
          responseMessage: "Enter valid Email Id !!",
        });
      }
    } catch (error) {
      // console.log(error.message)
      return res.status(501).send({
        responseCode: 501,
        responseMessage: "Something went wrong",
        error: error,
      });
    }
  },

  // // Vendor prassword update

  vendorEditPassword: async (req, res) => {
    const schema = Joi.object().keys({
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      confirmPassword: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    schema.validateAsync(req.body);

    try {
      let vendorData = await userModel.findOne({ _id: req.userId });
      if (!vendorData) {
        return res.status(404).send({
          responseMessage: "Vendor not In the Database..!!",
          responseCode: 404,
        });
      } else {
        if (req.body.password != req.body.confirmPassword) {
          return res.status(403).send({
            responseMessage: " Password and Confirm password doesn't matched  ",
            responseCode: 403,
          });
        }
        let check = bcrypt.compareSync(req.body.password, vendorData.password);
        if (check == true) {
          return res.status(402).send({
            responseMessage: " Password is Same As Proivous Password",
            responseCode: 402,
          });
        } else {
          var hashpass = hashSync(req.body.password, 10);
          req.body.password = hashpass;
          let vendor_data = await userModel.findByIdAndUpdate(
            { _id: vendorData._id },
            { password: req.body.password },
            { new: true }
          );
          if (!vendor_data) {
            return res.status(404).send({
              responseMessage: "user not found",
              responseCode: 404,
            });
          } else {
            return res.status(200).send({
              responseMessage: "success",
              responseCode: 200,
              Data: vendor_data,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
      return res
        .status(501)
        .send({ responseCode: 501, responseMessage: "Something went wrong" });
    }
  },
};
