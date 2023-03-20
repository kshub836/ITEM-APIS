const userRouter = require("express").Router();
const user = require("../controllers/user");
const auth = require("../middleware/auth");
const vendor = require("../controllers/vendorControler");

// const swagger = require("swagger.json")
// const upload = require("../middleware/multer")
userRouter.post("/User", user.User);
const multer= require('multer');
const path= require('path');
const {CloudinaryStorage} = require("multer-storage-cloudinary")

var bodyParser = require('body-parser');
userRouter.use(bodyParser.urlencoded({ extended: true }));
userRouter.use(bodyParser.json());
const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: "dyjr7uu2w",
  api_key: "428354248675467",
  api_secret: "XXbxFALkCag_RPCijDy5xpsLgR0",
  secure: true,
});
// multer upload
const upload = multer({ 
  storage:new CloudinaryStorage({
          cloudinary: cloudinary,
          params: {
            folder: "DEV",
           //format: async (req, file) => 'jpg'
          },
        })
});


// const upload = multer({ 
//   storage:new CloudinaryStorage({
//           cloudinary: cloudinary,
//           params: {
//             folder: "DEV",
//            //format: async (req, file) => 'jpg'
//           },
//         })
// });
  //const upload = multer({storage:storage}),



 /**
 * @swagger
 * /app/v1/user/signup:
 *   post:
 *     tags: 
 *       - User      
 *     description: Signup api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: lastName                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: userName                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: email                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: mobileNumber                
 *         description: 
 *         in: formData
 *         required: true,       
 *       - name: password                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: confirmPassword                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: dateOfBirth                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: address                
 *         description: 
 *         in: formData
 *         required: true,
 *                     
 *     responses:
 *       200:
 *         description: Sign Up successfully
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
 userRouter.post("/signup", user.signUp);

 /**
 * @swagger
 * /app/v1/user/login:
 *   post:
 *     tags: 
 *       - User      
 *     description: Login api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mobileEmail                
 *         description: 
 *         in: formData
 *         required: true, 
 *       - name: password                
 *         description: 
 *         in: formData
 *         required: true,
 *      
 *     responses:
 *       200:
 *         description: Login successfully
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post("/login", user.logIn);

 /**
 * @swagger
 * /app/v1/user/otpverification:
 *   post:
 *     tags: 
 *       - User      
 *     description: Otp Verification api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email                
 *         description: 
 *         in: formData         
 *         required: true, 
 *       - name: otp                
 *         description: 
 *         in: formData
 *         required: true,       
 *     responses:
 *       200:
 *         description: OTP Verification successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post("/otpverification", user.OtpVerification);


 /**
 * @swagger
 * /app/v1/user/update/:id:
 *   patch:
 *     tags: 
 *       - User      
 *     description: Update Password api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName                
 *         description: 
 *         in: formData
 *         required: true,      
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.patch("/update/:id", user.updatePassword);


 /**
 * @swagger
 * /app/v1/user/resetpassword:
 *   put:
 *     tags: 
 *       - User      
 *     description: Reset Password api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: password                
 *         description: 
 *         in: formData
 *         required: true,      
 *     responses:
 *       200:
 *         description:  successfull 
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.put("/resetpassword", user.resetPassword);


 /**
 * @swagger
 * /app/v1/user/forgot-password:
 *   post:
 *     tags: 
 *       - User      
 *     description: Forgot Password api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email                
 *         description: 
 *         in: formData
 *         required: true,      
 *     responses:
 *       200:
 *         description: Reset successfully
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post("/forgot-password", user.forgotpassword);


 /**
 * @swagger
 * /app/v1/user/resendotp:
 *   post:
 *     tags: 
 *       - User      
 *     description: Resend OTP api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email                
 *         description: 
 *         in: formData
 *         required: true,      
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post("/resendotp", user.resendOtp);


 /**
 * @swagger
 * /app/v1/user/Userlist:
 *   get:
 *     tags: 
 *       - User      
 *     description: User List api Docs
 *     produces:
 *       - application/json
 *     parameters:         
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.get("/Userlist",user.Userlist);

 
userRouter.post("/editProfile", auth.verifyToken,user.editProfile);

 /**
 * @swagger
 * /app/v1/user/adminlogin:
 *   post:
 *     tags: 
 *       -  Admin      
 *     description: Admin Login api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email                
 *         description: 
 *         in: formData
 *         required: true, 
 *       - name: password                
 *         description: 
 *         in: formData
 *         required: true,       
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post("/adminlogin", user.adminLogin); 

 /**
 * @swagger
 * /app/v1/user/adminEditProfile:
 *   put:
 *     tags: 
 *       - Admin      
 *     description: Admin Edit Profile api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: lastName                 
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: mobileNumber                 
 *         description: 
 *         in: formData
 *         required: true,       
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.put("/adminEditProfile", auth.verifyToken,user.adminEditProfile);


 /**
 * @swagger
 * /app/v1/user/vendorPendingList:
 *   get:
 *     tags: 
 *       - Admin      
 *     description: Vendor Pending List api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: approvalStatus                
 *         description: 
 *         in: formData
 *         required: true, 
 *       - name: userType                
 *         description: 
 *         in: formData
 *         required: true,      
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.get("/vendorPendingList", auth.verifyToken,user.vendorPendingList);

 /**
 * @swagger
 * /app/v1/user/vendorPendingApproval:
 *   post:
 *     tags: 
 *       - Admin      
 *     description:  Vendor Pending Approval api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email                
 *         description: 
 *         in: formData
 *         required: true,      
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post("/vendorPendingApproval", auth.verifyToken,user.vendorPendingApproval); 


/**
 * @swagger
 * /app/v1/user/QRCode:
 *   post:
 *     tags: 
 *       - User      
 *     description: QR Code generator api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: userName                
 *         description: 
 *         in: formData
 *         required: true, 
 *       - name: mobileNumber                
 *         description: 
 *         in: formData
 *         required: true,     
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.get("/QRCode",user.QRCode);

userRouter.get('/userlistApi',user.userlistApi)

userRouter.get("/paginate",user.paginate);



 /**
 * @swagger
 * /app/v1/user/vendorCreate:
 *   post:
 *     tags: 
 *       - Vendor      
 *     description:  Vendor Create api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: vendorName                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: email                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: address                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: pincode                
 *         description: 
 *         in: formData
 *         required: true, 
 *       - name: mobileNumber                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: userType                
 *         description: 
 *         in: formData
 *         required: true,    
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post('/vendorCreate',upload.array("image",4), vendor.vendorCreate);

 /**
 * @swagger
 * /app/v1/user/vendorOtpVerification:
 *   post:
 *     tags: 
 *       - Vendor      
 *     description:  Vendor OTP Verification api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: otp                
 *         description: 
 *         in: formData
 *         required: true,          
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post('/vendorOtpVerification', vendor.vendorOtpVerification);

 /**
 * @swagger
 * /app/v1/user/vendorLogin:
 *   post:
 *     tags: 
 *       - Vendor      
 *     description:  Vendor Login api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: password                
 *         description: 
 *         in: formData
 *         required: true,          
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post('/vendorLogin',vendor.vendorLogin)


 /**
 * @swagger
 * /app/v1/user/vendorEditPassword:
 *   post:
 *     tags: 
 *       - Vendor      
 *     description:  Vendor Edit api Docs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: password                
 *         description: 
 *         in: formData
 *         required: true,
 *       - name: confirmPassword                
 *         description: 
 *         in: formData
 *         required: true,          
 *     responses:
 *       200:
 *         description: Successfull
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.put("/vendorEditPassword", auth.verifyToken, vendor.vendorEditPassword);

// userRouter.post("/logout", auth.isVendorLogin, vendor.vendorLogout);






// userRouter.post('/vendorPopulate', vendor.vendorPopulate); 

//
  //  userRouter.post('/searchApi', user.searchApi); 





// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: "DEV",
//     },
//   });

  // const upload = multer{storage:storage}

  


//multer setup



// const upload = multer({ 
//     storage:multer.diskStorage({
//         destination:function(req,file,cb)
//         {
//             cb(null,path.join(__dirname, "../uploads"))
//         },
//         filename:function (req,file,cb) {
//             cb(null,file.filename+ "-" +Date.now()+ file.originalname)            
//         }  ,   
// })
// });


userRouter.post("/upload",upload.array("photo",4),(req,res)=>{

    return res.json({responseMessage: "Image uploaded Successfully",
    responseCode: 200, responseResult:req.files});
})


//  cloudinary setup

const fileupload = require("express-fileupload")
userRouter.use(fileupload({
  useTempFiles:true
}))
userRouter.post("/fileupload",user.fileupload)







module.exports = userRouter;
