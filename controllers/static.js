const static = require("../model/staticcontent");

module.exports = {
  staticcreate: async (req, res) => {
    try {
      let staticData = await static.findOne({ type: req.body.type });
      if (staticData) {
        // return res.send(errorCode.Conflict());
        return res.status(403).send({
          responseMessage: "Details already exist..!",
          responseCode: 403,          
        });
      } else {
        let static_data = await static(req.body).save();
        if (!static_data) {
          // console.log(err1);
          return res.status(500).send({
            responseMessage: "Internal server error",
            responseCode: 500,
          });
        } else {
          return res.status(200).send({
            responseMessage: "Data Access Successfully...!!",
            responseCode: 200,
            Data: static_data,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
      return res.status(501).send({
        responseMessage: "Not Implemented",
        responseCode: 501,
        error: error,
      });
    }
  },
};
