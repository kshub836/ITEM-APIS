const { Schema, model } = require("mongoose");
const status = require("../enums/status");
const mongoosePaginate = require('mongoose-paginate-v2');

const item = new Schema({  
  itemName:{
    type: String,
    },
    modelName:{
        type: String,
    },
    quantity: {
        type: String,
      },
    price: {
      type: String,
    },  
    expiryDate:{
      type: String,  
    },
    manufacturersDetails:{
      type: String,      
    },
    description:{
        type:String
    },  
    status:{
        type: String,
        default:status.ACTIVE
        },      

},
{timestamps:true}
)
item.plugin(mongoosePaginate);
module.exports = model("item", item);