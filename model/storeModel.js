const { Schema, model } = require("mongoose");

const store = new Schema({
  vendorId:{
    type:String,      
 },    
    storeName:{
      type:String,      
   },
   businessEmail:{
    type:String,
   },  
    image:{
      type:String, 
   },   
   image_1:{
    type:String, 
 },   
     password:{
      type:String,
   },          
    address: {
        type: String,   
        
      },
    pincode:{
        type:String,    
        
      },    
      approvalStatus:{
        type:String,
        enum:["Approve", "Pending", "Reject"],
        default:"Pending"
      },
     userType:{
        type:String,      
        default:"Vendor"
      },
      location: {
        type: {type: String,required:true},
        coordinates:[]        
         
       },    

},
{timestamps:true}
)
store.index({location:"2dsphere"});
module.exports = model("store", store);