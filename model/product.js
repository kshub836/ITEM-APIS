const { Schema, model } = require("mongoose");

const product = new Schema({  
  vendor_id:{
       type:Schema.Types.ObjectId,
       ref:"store",
    },
    item_name: {
      type: String,
    },  
    modelName:{
      type: String,      
    },     
    price:{
        type:String,        
      },
    manufacturersDetails:{
        type:String,        
      },       

},
{timestamps:true}
)
module.exports = model("product", product);