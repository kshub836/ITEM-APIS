const userModel = require("../model/user");

const otp = require("../helper/common");
const bcrypt = require("bcrypt");
const { hashSync } = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = "secretKey";
const nodemailer = require("nodemailer");

const errorCode = require("../middleware/errorcode");

const cloudinary = require("cloudinary").v2;
const QRCode = require("qrcode");
var springedge = require("springedge");
const userType = require("../enums/userType")

const storeModel = require("../model/storeModel");
var randomstring = require("randomstring");
const { default: mongoose } = require("mongoose");

module.exports = {
  // api development

  signUp: async (req, res) => {
    try {
      let userData = await userModel.findOne({
        $or: [
          { email: req.body.email },
          { mobileNumber: req.body.mobileNumber },
        ],
      });

      if (userData) {
        if (userData.email == req.body.email) {
          return res.status(400).send({
            responseMessage: "Email already exists",
            responseCode: 400,
          });
        } else if (userData.mobileNumber == req.body.mobileNumber) {
          return res.status(400).send({
            responseMessage: "Mobile Number already exists",
            responseCode: 400,
          });
        }
      }
      if (req.body.password !== req.body.confirmPassword) {
        return res.status(401).send({
          responseMessage: "Password & Confirm password  Doesn't match....",
          responseCode: 401,
        });
      } else {
        //OTP
        otpass = otp.generateOTP();
        req.body.otp = otpass;
        /* Adding Curent Time for OTP Verification...*/
        req.body.otpTime = Date.now() + 180000;

        const pass = req.body.password;

        var hashpass = hashSync(pass, 10);
        req.body.password = hashpass;

        // client.messages
        //   .create({
        //     body: "otpass",
        //     from: "+17243085552",
        //     to: "req.body.mobileNumber",
        //   })
        //   .then((message) => console.log(message.sid));

        var params = {
         " apikey": "6on957rb36978j0rl148a6j226v03jmr", // API Key
          "sender": "SEDEMO", // Sender Name
          "to": req.body.mobileNumber, //Moblie Number
          "message": "Hello, This is a test message from spring edge,req.body.otp",
          "format": "json",
        };

        springedge.messages.send(params, 5000, function (err, response) {
          if (err) {
            return console.log(err);
          }
          console.log(response);
        });

        rand = Math.floor(Math.random() * 100 + 54);
        host = req.get("host");
        let link = "http://" + req.get("host") + "/verify?id=" + rand;

        let mailDetails = {
          from: "kshubh8604@gmail.com",
          to: req.body.email,
          subject: "OTP Authentication ",
          text:
            // "OTP for  is  " +
            // " " +
            // req.body.otp +
            // " " +
            // "for complete registration.",
            "Hello,\n Please click on the link to verify your account.\n" +
            link,
          // html: '<a href="${link}">Verify Email.</a>'
        };

        nodemailer
          .createTransport({
            service: "gmail",
            auth: {
              user: "kshubh8604@gmail.com",
              pass: "ssruulevuyoniehi",
            },
          })
          .sendMail(mailDetails, (err) => {
            if (err) {
              return console.log("error", err);
            } else {
              return console.log("OTP sent! ");
            }
          });
      }
      let user_data = await userModel(req.body).save();
      if (user_data) {
        // console.log(user_data);
        // res.send(res1);
        // return res.send(errorCode.Success());
        return res.status(200).send({
          responseMessage: "Signup success",
          responseCode: 200,
          data: user_data,
        });
      } else {
        // return res.send(errorCode.Internal_Server_Error());
        return res.status(500).send({
          responseMessage: "Internal server error",
          responseCode: 500,
        });
      }
    } catch (error) {
      console.log(error.message);
      // return res.send(errorCode.Not_Implemented());
      return res.status(501).send({
        responseMessage: "Not Implemented",
        responseCode: 501,
        error: error,
      });
    }
  },

  // otpverification Api
  OtpVerification: async (req, res) => {
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
                { $set: { approvalStatus: "Approve", OtpVerification: true } },
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

  //Resend Otp

  resendOtp: async (req, res) => {
    try {
      let userData = await userModel.findOne({ email: req.body.email });
      // console.log();

      if (!userData) {
        console.log("..........", userData);
        // return res.send(errorCode.Not_Found() );
        return res.status(404).send({
          responseCode: 404,
          responseMessage: "User not found",
        });
      } else {
        // //OTP
        // otpass = otp.generateOTP();
        // req.body.otp = otpass;
        // /* Adding Curent Time for OTP Verification...*/
        // req.body.otpTime = Date.now() + 180000;

        newOtp = otp.generateOTP();
        otpNewTime = Date.now() + 180000;

        //Email for otp
        let mailDetails = {
          from: "kshubh8604@gmail.com",
          to: req.body.email,
          subject: "OTP Verification ",
          text: "OTP for Reset password is " + " " + newOtp + ".",
        };

        nodemailer
          .createTransport({
            service: "Gmail",
            auth: {
              user: "kshubh8604@gmail.com",
              pass: "ssruulevuyoniehi",
            },
          })
          .sendMail(mailDetails, (err) => {
            if (err) {
              return console.log("error", err);
            } else {
              // return res.send(errorCode.Success() );
              return console.log("OTP Sent");
            }
          });
      }
      let user_data = await userModel.findByIdAndUpdate(
        { _id: userData._id },
        { $set: { otp: newOtp, otpTime: otpNewTime, OtpVerification: false } }
        // { new: true }
      );

      // console.log(result1);
      if (!user_data) {
        // console.log(err);
        // return res.send(errorCode.Internal_Server_Error() );
        return res.status(500).send({
          responseMessage: "User not found",
          responseCode: 500,
        });
      } else {
        // return res.send(errorCode.Success() );
        return res.status(200).send({
          responseMessage: "success",
          responseCode: 200,
          Data: userData,
        });
      }
    } catch (error) {
      console.log(error.message);
      // return res.send(errorCode.Not_Implemented() );
      return res.status(501).send({
        responseMessage: "Something went wrong",
        responseCode: 500,
        error: error,
      });
    }
  },

  //   login api

  logIn: async (req, res) => {
    try {
      var mobileEmail = req.body.mobileEmail;
      let userData = await userModel.findOne({
        $or: [
          { email: mobileEmail },
          { mobileNumber: mobileEmail },
          { userName: mobileEmail },
          //{userType:{$ne:"Admin"}}
          //{$and:[{ email:req.body.email,userType:"Admin" }]}
        ],
      });
      if(userData.userType=="Admin"||userData.userType=="Vendor"){
        return res.status(404).send({
          responseCode: 404,
          responseMessage: "User not found",
        });
      }else if (userData) {
        if (userData.OtpVerification==true) {
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
            responseMessage: "OTP verification pending....!!",
          });
        }
      } else {
        return res.status(404).send({
          responseCode: 404,
          responseMessage: "User Not found...!!",
        });
      }
    } catch (error) {
      console.log(error.message);
      // return res.send(errorCode.Unauthorished() );
      return res.status(501).send({
        responseCode: 501,
        responseMessage: "Something went wrong",
        error: error,
      });
    }
  },

  // UpdatePasswordApi through id

  updatePassword: async (req, res) => {
    try {
      let userData = await userModel.findByIdAndUpdate(
        { _id: userData._id },
        { password: req.body.password }
      );

      if (!userData) {
        // return res.send(errorCode.Not_Found());
        return res
          .status(500)
          .send({ responseMessage: "failed", responseCode: 500, err: err });
      } else {
        // return res.send(errorCode.Success() );
        return res.status(200).send({
          responseMessage: "success",
          responseCode: 200,
          Data: userData,
        });
      }
    } catch (error) {
      console.log(error.message);
      // return res.send(errorCode.Internal_Server_Error() );
      return res.status(500).send({ responseCode: "Something went Worng..!!" });
    }
  },

  //user Api

  User: async (req, res) => {
    try {
      let userData = await userModel.findOne({ email: req.body.email });
      if (!userData) {
        // return res.send(errorCode.Internal_Server_Error() );
        return res.status(404).send({
          responseMessage: "User not Found",
          responseCode: 404,
        });
      } else {
        // return res.send(errorCode.Success() );
        return res.status(200).send({
          responseMessage: "Data Access successfully",
          responseCode: 200,
          Data: userData,
        });
      }
    } catch (error) {
      console.log(error.message);
      // return res.send(errorCode.Internal_Server_Error() );
      return res.status(500).send({
        responseMessage: "Something went wrong",
        responseCode: 500,
        error: error,
      });
    }
  },

  // //  resetpassword api

  resetPassword: async (req, res) => {
    try {
      let userData = await userModel.findOne({ email: req.body.email });
      if (!userData) {
        console.log("Email is not in the databse..!!");
        return res.status(404).send({
          responseMessage: "Email is not In the Database..!!",
          responseCode: 404,
        });
      } else {
        let check = bcrypt.compareSync(req.body.password, userData.password);
        if (check == true) {
          return res.status(402).send({
            responseMessage: " Password is Same As Previous Password",
            responseCode: 402,
          });
        } else {
          var hashpass = hashSync(req.body.password, 10);
          req.body.password = hashpass;

          let user_data = await userModel.findByIdAndUpdate(
            { _id: userData._id },
            { password: req.body.password }
          );
          if (!user_data) {
            return res.status(404).send({
              responseMessage: "user not found in database",
              responseCode: 404,
              err: err,
            });
          } else {
            return res.status(200).send({
              responseMessage: "success",
              responseCode: 200,
              res: user_data,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
      return res.status(501).send({ responseCode: "Something went wrong" });
    }
  },

  // resetPassword: (req, res) => {
  //   try {
  //     userModel.findOne({ email: req.body.email }, (err, res1) => {
  //       if (!res1) {
  //         console.log("Email is not in the database..!!");
  //         // return res.send(errorCode.Not_Found() );
  //         return res.status(404).send({
  //           responseMessage: "Email is not found In  Database..!!",
  //           responseCode: 404,
  //           res1: [],
  //         });
  //       } else {
  //         if (res1.password == req.body.password) {
  //           console.log("Password is Same As Previous Password  Error(201)");
  //           // return res.send(errorCode.Non_authorished() );
  //           return res.status(203).send({
  //             responseMessage: "Please Enter Different Password...!!",
  //             responseCode: 203,
  //             Result: {},
  //           });
  //         } else {
  //           console.log("old password :  " + res1.password);
  //           var hashpass = hashSync(req.body.password, 10);
  //           req.body.password = hashpass;

  //           userModel.findByIdAndUpdate(
  //             { _id: res1._id },
  //             { password: req.body.password },
  //             { new: true },
  //             (err, result4) => {
  //               if (err) {
  //                 return res.status(404).send({
  //                   responseMessage: "User not found In Database..!!",
  //                   responseCode: 404,
  //                 });
  //               } else {
  //                 console.log(
  //                   "Password is Updated..!! :   " + req.body.password
  //                 );
  //                 // return res.send(errorCode.Success() );
  //                 return res.status(200).send({
  //                   responseMessage: "Password is Updated..!!",
  //                   responseCode: 200,
  //                   result: result4,
  //                 });
  //               }
  //             }
  //           );
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     // return res.send(errorCode.Internal_Server_Error() );
  //     res.status(500).send({ responseCode: "Something went Wrong..!!" });
  //     console.log("Something Went Wrong..!");
  //   }
  // },
  //forgot password

  forgotpassword: async (req, res) => {
    try {
      let userData = await userModel.findOne({ email: req.body.email });
      // console.log();

      if (!userData) {
        console.log("..........", userData);
        // return res.send(errorCode.Not_Found() );
        return res.status(404).send({
          responseCode: 404,
          responseMessage: "User not found",
        });
      } else {
        // //OTP
        // otpass = otp.generateOTP();
        // req.body.otp = otpass;
        // /* Adding Curent Time for OTP Verification...*/
        // req.body.otpTime = Date.now() + 180000;

        newOtp = otp.generateOTP();
        otpNewTime = Date.now() + 180000;

        //Email for otp
        let mailDetails = {
          from: "kshubh8604@gmail.com",
          to: req.body.email,
          subject: "OTP Verification ",
          text: "OTP for Reset password is " + " " + newOtp + ".",
        };

        nodemailer
          .createTransport({
            service: "Gmail",
            auth: {
              user: "kshubh8604@gmail.com",
              pass: "ssruulevuyoniehi",
            },
          })
          .sendMail(mailDetails, (err) => {
            if (err) {
              return console.log("error", err);
            } else {
              // return res.send(errorCode.Success() );
              return console.log("OTP Sent");
            }
          });
      }
      let user_data = await userModel.findByIdAndUpdate(
        { _id: userData._id },
        { $set: { otp: newOtp, otpTime: otpNewTime, OtpVerification: false } }
        // { new: true }
      );

      // console.log(result1);
      if (!user_data) {
        // console.log(err);
        // return res.send(errorCode.Internal_Server_Error() );
        return res.status(500).send({
          responseMessage: "User not found",
          responseCode: 500,
        });
      } else {
        // return res.send(errorCode.Success() );
        return res.status(200).send({
          responseMessage: "success",
          responseCode: 200,
          Data: userData,
        });
      }
    } catch (error) {
      console.log(error.message);
      // return res.send(errorCode.Not_Implemented() );
      return res.status(501).send({
        responseMessage: "Something went wrong",
        responseCode: 500,
        error: error,
      });
    }
  },

  //profile verification

  // profile: (req, res) => {
  //   jwt.verify(req.token, secretKey, (err, result) => {
  //     function verifyToken(req, res, next) {
  //       const bearerHeader = req.headers["authentication"];
  //       if (typeof bearerHeader !== "undefined") {
  //         const bearer = bearerHeader.split(" ");
  //         const token = bearer[1];
  //         req.token = token;
  //         next();
  //       } else {
  //         return res.send({
  //           result: "Token is not valid",
  //         });
  //       }
  //       if (err) {
  //         return res.send({ result: "Invalid Token" });
  //       } else {
  //         return res.json({
  //           message: "Profile access successfully",
  //         });
  //       }
  //     }
  //   });
  // },

  //userlist

  Userlist: async (req, res) => {
    try {
      let userData = await userModel.find({ status: "Active" });
      if (!userData) {
        // return res.send(errorCode.Internal_Server_Error() );
        return res.status(404).send({
          responseMessage: "No Data Found",
          responseCode: 404,
        });
      } else {
        // return res.send(errorCode.Success() );
        return res.status(200).send({
          responseMessage: "Data Access successfully",
          responseCode: 200,
          Data: userData,
        });
      }
    } catch (error) {
      console.log(error.message);
      // return res.send(errorCode.Internal_Server_Error() );
      return res.status(500).send({
        responseMessage: "Something went wrong",
        responseCode: 500,
        error: error,
      });
    }
  },

  //pagination

  paginate: async (req, res) => {
    try {
      var page = req.body.page;
      var sort = req.body.sort;
      var user_data;
      var skip;
      if (page <= 1) {
        skip = 0;
      } else {
        skip = (page - 1) * 2;
      }
      if (sort) {
        if (sort == "firstname") {
          usersort = {
            firstname: 1,
          };
        } else if (sort == "_id") {
          usersort = {
            _id: 1,
          };
        }
        user_data = await userModel.find().sort(usersort).skip(skip).limit(5);
      } else {
        user_data = await userModel.find().skip(skip).limit(5);
      }
      return res
        .status(200)
        .send({ success: true, msg: "User Details", data: user_data });
    } catch (error) {
      return res.status(400).send(error.message);
    }
    // },
    //paginate
    // user
    //   .paginate({}, { page: req.body.page, limit: req.body.limit })

    //   .then((res1) => {
    //     res.json({ res1 });
    //   })
    //   .catch((error) => {
    //     res.json({ message: "an error Occured", error });
    //   });
  },

  //File upload cloudinary

  fileupload: async (req, res) => {
    

    const file = req.files.photo;
    console.log(file.tempFilePath);
    let upload = await cloudinary.uploader.upload(file.tempFilePath);
      if (!upload) {
        return res.status(500).send({
          responseMessage: "Internal server error",
          responseCode: 500,
          error: err,
        });
      } else {
        return res.status(200).send({
          responseMessage: "Upload successfully",
          responseCode: 200,
          res: upload,
        });
      }
 
  },

  // QR code generator

  QRCode: (req, res) => {
    // Creating the data
    let data = {
      // firstName: req.body.firstName,
      // lastName: req.body.lastName,
      name: req.body.name,
      userName: req.body.userName,
      mobileNumber: req.body.mobileNumber,
      email:req.body.email,
    };

    // Converting the data into String format
    let stringdata = JSON.stringify(data);

    // Print the QR code to terminal
    QRCode.toString(stringdata, { type: "terminal" }, function (err, QRcode) {
      if (err) {
        return res.status(404).send({
          responseMessage: "No Data Found",
          responseCode: 404,
        });
      }else{
        console.log(QRcode);
        return res.status(200).send({
          responseMessage: "QR Generated successfully",
          responseCode: 200,
          Data: QRcode,
        });
       
      }
      // Printing the generated code
      
      //console.log(data);
    });

    // Converting the data into base64
    QRCode.toDataURL(stringdata, function (err, code) {
      if (err) return console.log("error occurred");

      // Printing the code
      console.log(code);
    });
  },

  // Edit profile
  editProfile: async (req, res) => {
    try {
      let user = await userModel.findOne({ _id: req.userId });
      if (!user) {
        return res.send({
          responseCode: 404,
          responseMessage: "User Not Found",
        });
      } else {
        const updateUser = await userModel.findByIdAndUpdate(
          { _id: user._id },
          { $set: req.body },
          { new: true }
        );
        return res.send({
          responseCode: 200,
          responseMessage: "Profile updated successfully..!!",
          responseResult: updateUser,
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.send({
        responseCode: 501,
        responseMessage: "Something Went Wrong",
        result: error,
      });
    }
  },
  // editProfile: async (req, res) => {
  //   try {
  //     let user = await userModel.findOne({ _id: req.userId });
  //     if (!user) {
  //       res.send({
  //         responseCode: 404,
  //         responseMessage: "User Not Found",
  //         responseResult: [],
  //       });
  //     } else {
  //       if (user) {
  //         if (user.email == req.body.email) {
  //           const updateUser = await userModel.findByIdAndUpdate({
  //             _id: user._id,
  //           });
  //           res.send({
  //             responseCode: 200,
  //             responseMessage: "Profile updated successfully..!! ",
  //             responseResult: updateUser,
  //           });
  //         } else {
  //           let result = await userModel.findOne({
  //             _id: { $ne: user._id },
  //             email: req.body.email,
  //             status: "Active",
  //           });
  //           if (result) {
  //             res.send({
  //               responseCode: 200,
  //               responseMessage: "Email already exists",
  //               responseResult: [],
  //             });
  //           } else {
  //             const updateUser = await userModel.findByIdAndUpdate(
  //               { _id: user._id },
  //               { $set: req.body }
  //             );
  //             res.send({
  //               responseCode: 200,
  //               responseMessage: "Profile updated successfully..!!",
  //               responseResult: updateUser,
  //             });
  //           }
  //         }
  //       } else {
  //         res.send({
  //           responseCode: 404,
  //           responseMessage: "User Not found",
  //           responseResult: [],
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     res.send({
  //       responseCode: 501,
  //       responseMessage: "Something Went Wrong",
  //       result: error,
  //     });
  //   }
  // },

  // Admin Login

  adminLogin: async (req, res) => {
    try {
      let adminData = await userModel.findOne({$and:[{ email:req.body.email,userType:userType.ADMIN }]})
        if (adminData) {
          // if (result.OtpVerification == true) {
            var check = bcrypt.compareSync(req.body.password, adminData.password);
            if (check == false) {
              return res.status(403).send({
                responseCode: 403,
                responseMessage: "Incorrect Password.",
              });
            } else {
              token = jwt.sign(
                { _id: adminData._id, email: adminData.email },
                "secretKey",
                { expiresIn: "24H" }
              );
              return res.status(200).send({
                responseMessage: "Login Success",
                responseCode: 200,
                token,
                adminData,
              });
            }
          // }
          //  else {
          //   return res.status(401).send({
          //     responseCode: 401,
          //     responseMessage: "OTP verification pending....!!",
          //   });
          // }
        } else {
          return res.status(404).send({
            responseCode: 404,
            responseMessage: "User Not found...!!",
          });
        }
      
    } catch (error) {
      console.log(error)
      // return res.send(errorCode.Unauthorished() );
      return res.status(501).send({        
        responseCode: 501,
        responseMessage: "Something went wrong",
        error: error,
      });
    }
  },

  //Admin Edit profile

  adminEditProfile: async (req, res) => {
    try {
      let user = await userModel.findOne({ _id: req.userId });
      if (!user) {
        return res.send({
          responseCode: 404,
          responseMessage: "User Not Found",
          responseResult: [],
        });
      } else {
        const updateUser = await userModel.findByIdAndUpdate(
          { _id: user._id },
          { $set: req.body },
          { new: true }
        );
        return res.send({
          responseCode: 200,
          responseMessage: "Profile updated successfully..!!",
          responseResult: updateUser,
        });
      }
    } catch (error) {
      return res.send({
        responseCode: 501,
        responseMessage: "Something Went Wrong",
        result: error,
      });
    }
  },

  //Vendor pending list

  vendorPendingList: async (req, res) => {
    try {
      let adminData = await userModel.findOne({ _id: req.userId });
      if (!adminData) {
        // return res.send(errorCode.Internal_Server_Error() );
        return res.status(404).send({
          responseMessage: "Admin Not found...",
          responseCode: 404,
        });
      } else {
        let userData = await userModel.find({
          approvalStatus: req.body.approvalStatus,
          userType: req.body.userType,
        });
        if (!userData) {
          // return res.send(errorCode.Internal_Server_Error() );
          return res.status(404).send({
            responseMessage: "Not Found",
            responseCode: 404,
          });
        } else {
          // console.log(result);
          // return res.send(errorCode.Success() );
          return res.status(200).send({
            responseMessage: req.body.approvalStatus + " " + "list......",
            responseCode: 200,
            Data: userData,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
      // return res.send(errorCode.Internal_Server_Error() );
      return res.status(501).send({
        responseMessage: "Something went wrong",
        responseCode: 501,
        error: error,
      });
    }
  },

  //Vendor pending approval

  vendorPendingApproval: async (req, res) => {
    try {
      let adminData = await userModel.findOne({ _id: req.userId });
      if (!adminData) {
        // return res.send(errorCode.Internal_Server_Error() );
        return res.status(404).send({
          responseMessage:
            "You dont have access.Only Admin can access it!!!......",
          responseCode: 404,
          error: err,
        });
      } else {
        let userData = await userModel.findOne({
          $and: [
            { email: req.body.email },
            // { userType: req.body },
          ],
        });
        // console.log(result)
        
        if (!userData) {
          // console.log("Email is not in Database..!!");
          // return res.send(errorCode.Not_Found());
          return res.status(404).send({
            responseMessage: "Vendor  does not exist in database..!!",
            responseCode: 404,
          });
        } else if (userData.approvalStatus == "Approve") {
          return res.status(200).send({
            responseMessage: "Already approved..",
            responseCode: 200,
          });
        } else {
          // random = Math.floor(Math.random() * 1000000);
          let random = randomstring.generate(7);

          let mailDetails = {
            from: "Shubham.kumar@mailinator.com", //Admin email
            to: req.body.email,
            subject: "Credentials for vendor login",
            text:
              "User ID  for vendor login is: " +
              " " +
              req.body.email +
              " " +
              "And password is:" +
              " " +
              random +
              "",
          };

          nodemailer
            .createTransport({
              service: "gmail",
              auth: {
                user: "kshubh8604@gmail.com",
                pass: "ssruulevuyoniehi",
              },
            })
            .sendMail(mailDetails, (err) => {
              if (err) {
                return console.log("error", err);
              } else {
                return console.log("Mail sent successfully! ");
              }
            });

          let newRamdom = hashSync(random, 10);
          let user_Data = await userModel.findByIdAndUpdate(
            { _id: userData._id },
            { $set: { approvalStatus: "Approve", password: newRamdom , userType:"Vendor"} },
            { new: true }
          );

          // console.log(result1);
          if (!user_Data) {
            // console.log(err);
            // return res.send(errorCode.Internal_Server_Error() );
            return res.status(500).send({
              responseMessage: "User not found",
              responseCode: 500,
            });
          } else {
            // return res.send(errorCode.Success() );
            return res.status(200).send({
              responseMessage: "success",
              responseCode: 200,
              Data: user_Data,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({
        responseMessage: "Internal server error",
        responseCode: 500,
        result: {},
      });
    }
  },


  // userlistApi : async (req, res) => {
  //   try {
  //     const { status, userType, page, limit, firstName,otp, sort } = req.body;
  //     let query = { status: { $ne: "Delete" } };
      
  //     // if (search) {
  //     //   query.$or = [
  //     //     { firstName: { $regex: search } },
  //     //     { email: { $regex: search, $options: "i" } },
  //     //   ];
  //     // }
  //     if (userType) {
  //       query.userType = { $regex:".*"+userType+".*", $options:'i' };
  //     }
  //     if (firstName) {
  //       query.firstName ={ $regex:".*"+firstName+".*", $options:'i' } 
  //     } 
  //     if(otp){
  //       query.otp = { $regex: ".*"+otp+".*", $options:'i' }
  //     }     
  //     // if(country){
  //     //   query.country = { $regex: ".*"+country+".*", $options:'i' }
  //     // }
  //     // if(state){
  //     //   query.state = { $regex: ".*"+state+".*", $options:'i' }
  //     // }
  
  //     let options = {
  //       page: parseInt(page) || 1,
  //       limit: parseInt(limit) || 10,
  //       sort:''
  //     };
  //     if (userType == "Vendor" || userType == "user") {
  //       var userData = await userModel.paginate(query, options);
  //       if ((userData.docs.length!= 0)) {
  //         return res.send({
  //           status: "Success",
  //           responseCode: 200,
  //           responseMessage: "User list fetched sucessfully.",
  //           userData: userData,
  //         });
  //       } else {
  //         return res.send({
  //           status: "Error",
  //           responseCode: 404,
  //           responseMessage: "Data Not Foumd !...",
  //         });
  //       }
  //     } else {
  //       return res.status(404).send({
  //         status: "Error",
  //         responseMessage:
  //           "" + userType + " Is Not Valid Key Data Not Foumd !...",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     return res.status(500).send({
  //       responseMessage: "Internal Server Error",
  //       responseCode: 500,
  //       error: error,
  //     });
  //   }
  // },
  

  userlistApi: async (req, res) => {
    try {
      const { userType, page, limit, search } = req.body;
      let query = { status: { $ne: "DELETE" },userType:{$ne:"Admin"} };
      // words = userModel

      if (userType) {
        query.userType =userType;
      }
      if (search) {
        //  userModel.filter(data => data.length > 30);
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { mobileNumber: { $regex: search, $options: "i" } },         
        ];
      }
       
        if (userType =="Admin") {
          return res.status(404).send({
            status: "Failed",
            responseMessage: "User not found",
            responseCode: 404,
          });
        }

        let options = {
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          sort: { createdAt: -1 },
        };
        var user_data = await userModel.paginate(query, options, {userType:{$ne:"Admin"}});
        if (user_data.docs.length != 0) {
          return res.status(200).send({
            status: "success",
            responseMessage: "User details",
            responseCode: 200,
            Data: user_data,
          });
        } else {
          return res.status(404).send({
            status: "failed",
            responseMessage: "User not found",
            responseCode: 404,
          });
        }
      
    } catch (error) {
      console.log("error", error);
      res.status(501).send({ responseCode: "Something went Wrong..!!" });
    }
  },

  

  // searchApi: async (req, res) => {
  //   try {
  //     let Data = await  Tokendata.users("users").aggregate(
  //       { $group:{_id:"$email"} });
      
  //       if (!Data) {
  //         // return res.send(errorCode.Internal_Server_Error() );
  //         return res.status(404).send({
  //           responseMessage: "Not Found",
  //           responseCode: 404,
  //         });
  //       } else {
  //         // console.log(result);
  //         // return res.send(errorCode.Success() );
  //         return res.status(200).send({
  //           responseMessage: req.body.approvalStatus + " " + "list......",
  //           responseCode: 200,
  //           Data: userData,
  //         });
  //       }
  //     }
  //    catch (error) {
  //     console.log(error.message);
  //     // return res.send(errorCode.Internal_Server_Error() );
  //     return res.status(501).send({
  //       responseMessage: "Something went wrong",
  //       responseCode: 501,
  //       error: error,
  //     });
  //   }
  // },

  aggregateSearchKyc: async (body) => {
    const { search, page, limit, userType, fromDate, toDate, kycStatus, country } = body;
    if (search) {
        var filter = search;
    }
    let data = filter || ""
    let countryData = country || ""
    let searchData = [
        {
            $lookup: {
                from: "user",
                localField: 'userId',
                foreignField: '_id',
                as: "userDetails",
            }
        },
        {
            $unwind: {
                path: "$userDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                $or: [
                    {
                        "$expr": {
                            "$regexMatch": {
                                "input": { "$concat": ["$userDetails.firstName", " ", "$userDetails.lastName"] },
                                "regex": data,
                                "options": "i"
                            }
                        }
                    },
                    { "userDetails.email": { $regex: data, $options: "i" } },
                ]
            }
        },
        {
            $match: { "status": status.ACTIVE },
        },
        { $sort: { createdAt: -1 } }
    ]
    if (userType) {
        searchData.push({
            $match: { "userDetails.userType": userType }
        })
    }
    if (country) {
        searchData.push({
            $match: { "userDetails.country": { $regex: countryData, $options: "i" } }
        })
    }
    if (kycStatus) {
        searchData.push({
            $match: { "approveStatus": kycStatus }
        })
    }

    if (fromDate && !toDate) {
        searchData.push({
            "$match": {
                // "$expr": { "$gte": ["$createdAt", new Date(fromDate)] }
                "$expr": { "$lte": ["$createdAt", new Date(new Date(toDate).toISOString().slice(0, 10) + 'T23:59:59.999Z')] }

            }
        })
    }
    if (!fromDate && toDate) {
        searchData.push({
            "$match": {
                // "$expr": { "$lte": ["$createdAt", new Date(toDate)] }
                "$expr": { "$lte": ["$createdAt", new Date(new Date(toDate).toISOString().slice(0, 10) + 'T23:59:59.999Z')] }

            }
        })
    }
    if (fromDate && toDate) {
        searchData.push({
            "$match": {
                // "$expr": { "$and": [{ "$lte": ["$createdAt", new Date(toDate)] }, { "$gte": ["$createdAt", new Date(fromDate)] }] }
      "$expr": 
      { "$and":[{ "$lte": ["$createdAt", new Date(new Date(toDate).toISOString().slice(0, 10) + 'T23:59:59.999Z') ]  }, 
                { "$gte": ["$createdAt", new Date(new Date(fromDate).toISOString().slice(0, 10)) ]}]}
            }
        })
    }

    let aggregate = kycModel.aggregate(searchData)
    let options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort: { createdAt: -1 },
    };
    return await kycModel.aggregatePaginate(aggregate, options)
}




};
