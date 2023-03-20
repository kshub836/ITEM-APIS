const staticRouter = require("express").Router();
const static = require("../controllers/static");



staticRouter.post('/staticcreate', static.staticcreate)

module.exports = staticRouter;
