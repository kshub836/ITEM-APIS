const { Types, Schema, model } = require("mongoose");


const userData = new Schema({
    type: {
        type: String,
        
      },
    description:{
        type:String,
        
      },
    title:{
        type:String,
        
      },  
    status: {
        type: String,        
        default:"Active"
      },
      

},
{timestamps:true}
)
module.exports = model("static", userData);