const storeModel = require("../model/storeModel");
const userModel = require("../model/user");

const nodemailer = require("nodemailer");
const otp = require("../helper/common");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";

module.exports = {
  createStore: async (req, res) => {
    try {
      const userData = await userModel.findOne({
        $and: [
          {
            email: req.body.businessEmail,
            _id: req.body.vendorId,
            userType: "Vendor",
          },
        ],
      });
      if (userData) {
        if (!req.body.latitude || !req.body.longitude) {
          return res.status(402).send({
            responseMessage: "latitude and longitude is required.",
            responseCode: 402,
          });
        } else {
          const storeData = await storeModel.findOne({
            businessEmail: req.body.businessEmail,
          });
          if (storeData) {
            return res.status(200).send({
              responseMessage: "This store is already created...",
              responseCode: 200,
            });
          } else {
            let subject = "Store signup successfully";
            let body ="Thank You For contacting us. We will back Soon After the Documentation verification!!";
            let send = await nodemailerFunction.sendMail(
              req.body.email,
              subject,
              body
            );

            if (send) {
              // let mailDetails = {
              //   from: "Shubham.kumar@mailinator.com",
              //   to: req.body.businessEmail,
              //   subject: "Store signup successfully",
              //   text: "Thank You For contacting us. We will back Soon After the Documentation verification!!",
              // };

              // nodemailer
              //   .createTransport({
              //     service: "gmail",
              //     auth: {
              //       user: "kshubh8604@gmail.com",
              //       pass: "ssruulevuyoniehi",
              //     },
              //   })
              //   .sendMail(mailDetails, (err) => {
              //     if (err) {
              //       return console.log("error", err);
              //     } else {
              //       return console.log("Mail  sent! ");
              //     }
              //   });
              const storedata = await storeModel({
                vendorId: req.body.vendorId,
                storeName: req.body.storeName,
                businessEmail: req.body.businessEmail,
                address: req.body.address,
                image: req.file.path,
                // image2: req.file.path,
                pin: req.body.pin,
                location: {
                  type: "Point",
                  coordinates: [
                    parseFloat(req.body.latitude),
                    parseFloat(req.body.longitude),
                  ],
                },
              });
              const store_data = await storedata.save();
              if (!store_data) {
                console.log(store_data);
                return res.status(500).send({
                  responseMessage: "Internal server error",
                  responseCode: 500,
                  error: [],
                });
              } else {
                return res.status(200).send({
                  responseMessage: "Store Created Successfully",
                  responseCode: 200,
                  Data: store_data,
                });
              }
            }
          }
        }
      } else {
        return res.status(403).send({
          responseMessage:
            "Could'nt find the vendor details. Please provide the correct vendor ID or Business email!!..",
          responseCode: 403,
          error: [],
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(501).send({
        responseMessage: "Not Implemented",
        responseCode: 501,
        error: error,
      });
    }
  },

  // // Store Login

  // //   storeLogin: (req, res) => {
  // //     try {

  // //       storeModel.findOne({ business_email:req.body.business_email},
  // //         (err, result) => {
  // //           console.log(result)
  // //           if (result) {
  // //             // console.log(result)
  // //             if (approvalStatus == "Approve") {
  // //               var check = bcrypt.compareSync( req.body.password, result.password);
  // //               if (check == false) {
  // //                 return res.status(403).send({
  // //                   responseCode: 403,
  // //                   responseMessage: "Incorrect Password.",
  // //                 });
  // //               } else {
  // //                 token = jwt.sign(
  // //                   { _id: result._id, business_email: result.business_email },
  // //                   "secretKey",
  // //                   { expiresIn: "1H" }
  // //                 );
  // //                 return res.status(200).send({
  // //                   responseMessage: "Login Success",
  // //                   responseCode: 200,
  // //                   token,
  // //                   result,
  // //                 });
  // //               }
  // //             } else {
  // //               return res.status(401).send({
  // //                 responseCode: 401,
  // //                 responseMessage: "Approval Status pending....!!",
  // //               });
  // //             }
  // //           } else {
  // //             return res.status(404).send({
  // //               responseCode: 404,
  // //               responseMessage: "User Not found...!!",
  // //             });
  // //           }
  // //         }
  // //       );
  // //     } catch (error) {
  // //       return res.status(501).send({
  // //         responseCode: 501,
  // //         responseMessage: "Something went wrong",
  // //         error: error,
  // //       });
  // //     }
  // //   },

  //   // Vendor prassword update

  //   editPassword: (req, res) => {
  //     try {
  //       userModel.findOne({ _id: req.userId }, (err, result) => {
  //             if (!result) {

  //                 return res.status(404).send({ responseMessage: "user is not In the Database..!!", responseCode: 404 });
  //             }
  //             else if (result) {
  //                 if (req.body.password != req.body.confirmPassword) {
  //                     return res.status(403).send({ responseMessage: " Password and Confirm password doesn't matched  ", responseCode: 403 });
  //                 }

  //                 let check = bcrypt.compareSync(req.body.password, result.password);
  //                 if (check == true) {
  //                     return res.status(402).send({ responseMessage: " Password is Same As Proivous Password", responseCode: 402, result: {} });
  //                 }
  //                 else {
  //                     var hashpass = hashSync(req.body.password, 10)
  //                     req.body.password = hashpass
  //                     userModel.findByIdAndUpdate(
  //                         { _id: result._id },
  //                         { password: req.body.password },
  //                         { new: true },
  //                         (err, result4) => {
  //                             if (err) {
  //                                 return res.status(404).send({ responseMessage: "user not found", responseCode: 404, err: err });
  //                             } else {
  //                                 return res.status(200).send({ responseMessage: "success", responseCode: 200, res: result4, });
  //                             }
  //                         }
  //                     );
  //                 }

  //             }
  //         });
  //     } catch (error) {
  //         return res.status(501).send({ responseCode: "Something_went_wrong" });

  //     }
  //   },
};
