const { Types, Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const otp = require("../helper/common");
const { hashSync } = require("bcrypt");
const status = require("../enums/status");
const userType = require("../enums/userType")

const user = new Schema({

  userName: {
    type: String,
    // required: true,
  },
  firstName:{
    type:String,
    // required:true,
  },
  lastName:{
    type:String,
    // required:true,
  }, 
  vendorName:{
    type:String,
    // required:true,
  }, 
  email: {
    type: String,
    // required: true,
  }, 
   
  image: {
    type: String,
    // required: true,
  }, 
  password: {
    type: String,
    // required: true,
  },
  countryCode: {
    type: String,
    // required: true,
  },
   
  mobileNumber: {
    type: String,
    // required: true,
  },
  dateOfBirth: {
    type: String,
    // required: true,
  },
  otp: {
    type: String,
    // required: true,
  },
  otpTime: {
    type: String,
    // required: true,
  }, 
  token:{
    type:String,
    // required: true,
  },
  image:{
    type:String,
    // required: true,
  },
  address:{
    type:String,
    // required: true,
  },
  pincode:{
    type:String,    
    
  },
  OtpVerification:{
    type:Boolean,
    default: false
    // required: false   
  },
  status:{
  type: String,
  default:status.ACTIVE
  },
  userType:{
    type: String,    
    default:userType.USER
    },   

},
{timestamps:true}
);
user.plugin(mongoosePaginate);
// user.paginate().try({}); 

module.exports = model("user", user);


//Admin Signup
// module.exports = model("user", user);

mongoose.model("user", user)
  .find({ userType: "Admin" }, async (err, result) => {
    if (err) {
      console.log("Default Admin Error", err);
    } else if (result.length != 0) {
      console.log("Default Admin........................................",);
    } else {
      //let otppass = otp.generateOTP();
      let hashPassword = hashSync("Shubham@123", 10);

      let admin = {
        userName: "shubham_kumar",
        firstName: "Shubham",
        lastName: "Kumar",
        email: "Shubham.kumar@mailinator.com",
        password: hashPassword,
        //countryCode: "+91",
        //mobileNumber: "7985919618",
        //dateOfBirth: "12/11/2002",
        //otp: otppass,
        address: "Delhi",
        userType:userType.ADMIN,
        approvalStatus:"Approve",
        OtpVerification: true,
      };

      mongoose.model("user", user).create(admin, (err1, result1) => {
        if (err1) {
          console.log("Admin creation error", err1);
        } else {
          // console.log("Default Admin created", result1);
          console.log("Default Admin created");
        }
      });
    }
  });








