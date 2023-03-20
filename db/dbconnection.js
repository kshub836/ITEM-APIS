const mongoose =require('mongoose')

mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://shubham:shubham123@cluster0.pkvxbri.mongodb.net/Tokendata?retryWrites=true&w=majority',
{useNewUrlParser: true,useUnifiedTopology:true},
(err,res)=>{
    if(err){
        console.log('Connection Error',err);
    }
    else{
        console.log("DB Connected.........................................");
    }
})