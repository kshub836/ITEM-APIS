const itemRouter = require("express").Router();
const item = require("../controllers/ItemController");
const auth = require("../middleware/auth");



itemRouter.post("/itemCreate",auth.verifyToken,item.itemCreate); 
itemRouter.get("/itemList",auth.verifyToken,item.itemList);
itemRouter.get('/itemListAPi',auth.verifyToken,item.itemListAPi); 
itemRouter.get('/singleItemList',auth.verifyToken,item.singleItemList); 
itemRouter.put('/updateItem/:id',auth.verifyToken,item.updateItem); 
itemRouter.delete('/deleteItem',auth.verifyToken,item.deleteItem);
module.exports = itemRouter;