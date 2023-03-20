// const product = require("../model/product");




// module.exports = {


  
//   productCreate: async (req, res) => {
//     try {
//         product.findOne({ modelName:req.body.modelName }, async (err, result) => {
//         if (err) {             
//              return res.status(500).send({
//                 responseMessage: "Internal server error",
//                 responseCode: 500,
//                 err,
//               });
           
//              } else if (result) {
//                   return res.status(403).send({
//                   responseMessage: "Product  already exist..!",
//                   responseCode: 403,
//                   err,
//                 });
//         }

//         product(req.body).save(async (err1, res1) => {
//           if (err1) {
//             console.log(err1);

//             return await res.status(500).send({
//               responseMessage: "Internal server error",
//               responseCode: 500,
//               error: err1,
//             });
//           } else {
//             return await res.status(200).send({
//               responseMessage: "Product save Successfully...!!",
//               responseCode: 200,
//               res: res1,
//             });
//           }
//         });
//       });
//     } catch (error) {
//       return await res.status(501).send({
//         responseMessage: "Not Implemented",
//         responseCode: 501,
//         error: error,
//       });
//     }
//   },

//   productPopulate: (req, res) => {
//     product.find({ _id:req.body.vendor_id}, (err, store) => {
//         if (err) {
//             return res.status(404).send({ responseMessage: "Product not found", responseCode: 404, });
//         } else {

//             // console.log(user)
//            return res.status(200).send({ responseMessage: "Product Details", responseCode: 200, store });
//         }
//     }).populate('vendor_id');


// }

// };

