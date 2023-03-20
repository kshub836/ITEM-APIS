// const category = require("../model/categorymodel");
// const user = require("../model/user");




// module.exports = {


  
//     createCategaory: (req, res) => {
//     try {
//         let adminData = user.findOne({ _id: req.userId });
//         if (!adminData) {
//           // return res.send(errorCode.Internal_Server_Error() );
//           return res.status(404).send({
//             responseMessage: "You dont have access.Only Admin can access it!!!......",
//             responseCode: 404,
//             error: err,
//           });
//         }else{
//         category.findOne({ category:req.body.category },  (err, result) => {
//         if (err) {             
//              return res.status(500).send({
//                 responseMessage: "Internal server error",
//                 responseCode: 500,
//                 err,
//               });
           
//              } else if (result) {
//                   return res.status(403).send({
//                   responseMessage: "Category  already exist..!",
//                   responseCode: 403,
//                   err,
//                 });
//         }

//         category(req.body).save( (err1, res1) => {
//           if (err1) {
//             console.log(err1);

//             return res.status(500).send({
//               responseMessage: "Internal server error",
//               responseCode: 500,
//               error: err1,
//             });
//           } else {
//             return  res.status(200).send({
//               responseMessage: "Category save Successfully...!!",
//               responseCode: 200,
//               res: res1,
//             });
//           }
//         });
//       })
//     }
//     } catch (error) {
//       return  res.status(501).send({
//         responseMessage: "Not Implemented",
//         responseCode: 501,
//         error: error,
//       });
//     }
//   },

// //   productPopulate: (req, res) => {
// //     product.find({ _id:req.body.vendor_id}, (err, store) => {
// //         if (err) {
// //             return res.status(404).send({ responseMessage: "Product not found", responseCode: 404, });
// //         } else {

// //             // console.log(user)
// //            return res.status(200).send({ responseMessage: "Product Details", responseCode: 200, store });
// //         }
// //     }).populate('vendor_id');


// // }

// };
