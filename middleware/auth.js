const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
module.exports = {
  verifyToken: (req, res, next) => {
    try {      
      jwt.verify(req.headers.token, "secretKey", (err, result) => {
         if (err) {
          console.log(err);
         return res.send({
            responseCode: 501,
            responseMessage: " Something went wrong!!",
            responseResult: err,
          });        
         
          }
           else {
            userModel.findOne({ _id: result._id }, (err1, result5) => {
              if (!result5) {
               return res.send({
                    responseCode: 404,
                    responseMessage: "User not found..!!",
                    responseResult: result5,
                  });
                }           
              
                  else {
                    req.userId = result5._id;
                    next();
                  }              
            });
          }          
        
      });
    } catch (error) {
      return res.send({
        responseCode: 500,
        responseMessage: "Internal Server Error",
        responseResult: error,
      });
    }
  },
};
