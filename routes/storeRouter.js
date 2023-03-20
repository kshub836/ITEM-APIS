
const storeRouter = require("express").Router();
const store = require("../controllers/storeControler")

// const auth =require ("../middleware/auth");



const multer= require('multer');
const path = require('path');
const {CloudinaryStorage} = require("multer-storage-cloudinary")

 const bodyParser = require('body-parser');
 storeRouter.use(bodyParser.urlencoded({ extended: true }));
 storeRouter.use(bodyParser.json());
const cloudinary = require("cloudinary").v2

// storeRouter.use(express.static('public'));

// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__dirname,"./uploads2"),function(error,success){
//             if (error) throw error
//         })
//     },
//     filename:function(req,file,cb){
//        const name =  Date.now()+'-'+file.originalname;
//        cb(null,name,function(error,success){
//         if(error) throw error
//        })
//     }
// });

// const upload = multer({storage:storage});



cloudinary.config({
  cloud_name: "dyjr7uu2w",
  api_key: "428354248675467",
  api_secret: "XXbxFALkCag_RPCijDy5xpsLgR0",
  secure: true,
});


const upload = multer({ 
    storage:new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
              folder: "DEV",
            },
          })
});

storeRouter.post("/createStore",upload.single('image'), store.createStore)


module.exports = storeRouter;










