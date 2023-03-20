const itemModel = require("../model/itemModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";
const status = require("../enums/status");
const userType = require("../enums/userType")
const userModel = require("../model/user");
const { json } = require("body-parser");

module.exports = {

itemCreate: async (req, res) => {
    
    try {
        let adminVerify = await userModel.find({ _id: req.userId, userType: { $in: [userType.ADMIN] } });
        if (!adminVerify) {           
            return res.status(409).send({
                responseMessage: "Unauthorized",
                responseCode: 409,
              });
        } 
        else{        
        const itemData = await itemModel.findOne({ 
        $and: [
            { status: { $ne: status.DELETE } },
            { $or: [{ modelName: req.body.modelName }, { itemName: req.body.itemName }] },
          ],
       });
      if (itemData) {
        if (itemData.modelName==req.body.modelName){
             // return res.send(errorCode.Internal_Server_Error());
            // console.log(itemData);
            return res.status(200).send({
            responseMessage: "This Item is already exist..",
            responseCode: 200,
          });
        }        
      } else {  
          const item_data = await itemModel(req.body).save();
          if (item_data) {
            return res.status(200).send({
              responseMessage: "Item Created Successfully",
              responseCode: 200,
              data: item_data,
            });
          } else {
            // console.log(err1);
            return res.status(500).send({
              responseMessage: "Internal server error",
              responseCode: 500,              
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


  itemList: async (req, res) => {
    try {
      let adminData = await userModel.findOne({ _id: req.userId });
      if (!adminData) {
        // return res.send(errorCode.Internal_Server_Error() );
        return res.status(409).send({
          responseMessage: "Unauthorized..",
          responseCode: 409,
        });        
      } 
      else {
        let itemData = await itemModel.findOne({          
          status: req.body.status
        });
        if (!itemData) {
          // return res.send(errorCode.Internal_Server_Error() );
          return res.status(404).send({
            responseMessage: "Not Found",
            responseCode: 404,
          });
        } else {
          // console.log(result);
          // return res.send(errorCode.Success() );
          return res.status(200).send({
            responseMessage: req.body.status + " " + "list......",
            responseCode: 200,
            Data: itemData,
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
    };
},

itemListAPi: async (req, res) => {
    try {
      const {page, limit, search } = req.body;
      let query = { status: { $ne: status.DELETE },userType:{$ne:"ADMIN"} };
      // words = userModel      
      if (search) {
        //  userModel.filter(data => data.length > 30);
        query.$or = [
          { itemName: { $regex: search, $options: "i" } },
          { modelName: { $regex: search, $options: "i" } },
          { _id: { $regex: search, $options: "i" } },
                
        ];
      }     
      

        let options = {
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          sort: { createdAt: -1 },
        };
        var item_data = await itemModel.paginate(query, options, {userType:{$ne:"ADMIN"}});
        if (item_data.docs.length != 0) {
          return res.status(200).send({
            status: "success",
            responseMessage: "Item details",
            responseCode: 200,
            Data: item_data,
          });
        } else {
          return res.status(404).send({
            status: "failed",
            responseMessage: "Item not found",
            responseCode: 404,
          });
        }
      
    } catch (error) {
      console.log("error", error);
      res.status(501).send({ responseCode: "Something went Wrong..!!" });
    }
  },

  singleItemList: async (req, res) => {
    try {
        let adminData = await userModel.findOne({ _id: req.userId });
        if (!adminData) {
          // return res.send(errorCode.Internal_Server_Error() );
          return res.status(409).send({
            responseMessage: "Unauthorized..",
            responseCode: 409,
          });        
        } 
        else {
      let itemData = await itemModel.findOne({_id:req.body._id, status: { $ne: status.DELETE } });
      if (!itemData) {
        // return res.send(errorCode.Internal_Server_Error() );
        return res.status(404).json({
          responseMessage: "No Data Found",
          responseCode: 404,
        });
      } else {
        // return res.send(errorCode.Success() );
        return res.status(200).send({
          responseMessage: "Data Access successfully",
          responseCode: 200,
          Data: itemData,
        });
      }
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

  updateItem: async (req, res) => {
    try { 
        let adminData = await userModel.findOne({ _id: req.userId });
        if (!adminData) {
          // return res.send(errorCode.Internal_Server_Error() );
          return res.status(409).send({
            responseMessage: "Unauthorized..",
            responseCode: 409,
          });        
        }       
      let itemData = await itemModel.findOne({ _id:req.params.id ,status: { $ne: status.DELETE }});
      if (!itemData) {
        return res.send({
          responseCode: 404,
          responseMessage: "User Not Found",
        });
      } else {
        const updateItem = await itemModel.findByIdAndUpdate(
          { _id: itemData._id },
          { $set: req.body },
          { new: true }
        );
        return res.send({
          responseCode: 200,
          responseMessage: "Item updated successfully..!!",
          responseResult: updateItem,
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

  deleteItem: async (req, res) => {
    try { 
        let adminData = await userModel.findOne({ _id: req.userId });
        if (!adminData) {
          // return res.send(errorCode.Internal_Server_Error() );
          return res.status(409).send({
            responseMessage: "Unauthorized..",
            responseCode: 409,
          });        
        }      
      let itemData = await itemModel.findOne({ _id: req.body._id, status: { $ne: status.DELETE } });
      if (!itemData) {
        return res.send({
          responseCode: 404,
          responseMessage: "User Not Found",
        });
      } else {
        const deleteItem = await itemModel.findByIdAndUpdate(
          { _id: req.body._id },
          {$set:{ status: status.DELETE }},
          { new: true }
        );
        return res.send({
          responseCode: 200,
          responseMessage: "Item Deleted successfully..!!",          
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






};