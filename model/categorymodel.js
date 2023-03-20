const { Schema, model } = require("mongoose");

const category = new Schema({  
    category:{
        type:String,        
    }

},
{timestamps:true}
)
module.exports = model("category", category);