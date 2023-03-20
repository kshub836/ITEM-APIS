module.exports = {
  
  //Successfull response

  Success: () => {
    return {
      responseMessage: "Success",
      responseCode: 200,
    };
  },

  Created: () => {
    return {
      responseMessage: "User created",
      responseCode: 201,
    };
  },

  Accepted: () => {
    return {
      responseMessage: "Accepted",
      responseCode: 202,
    };
  },

  Non_authorished: () => {
    return {
      responseMessage: "Non-Authoritative Information",
      responseCode: 203,
    };
  },
  No_Content: () => {
    return {
      responseMessage: "Content not found",
      responseCode: 204,
    };
  },

  Reset_Content: () => {
    return {
      responseMessage: "Content Reseted",
      responseCode: 205,
    };
  },

  // Client Error response

  Bad_Request: () => {
    return {
      responseMessage: "Bad Request",
      responseCode: 400,
    };
  },

  Unauthorished: () => {
    return {
      responseMessage: "Unauthorished user",
      responseCode: 401,
    };
  },

  Payment_Required: () => {
    return {
      responseMessage: "Payment Required",
      responseCode: 402,
    };
  },

  Forbidden: () => {
    return {
      responseMessage: "Forbidden",
      responseCode: 403,
    };
  },

  Not_Found: () => {
    return {
      responseMessage: "User Not Found",
      responseCode: 404,
    };
  },

  Not_Acceptable: () => {
    return {
      responseMessage: "Not Accepted",
      responseCode: 406,
    };
  },

  Proxy_Authetication_required: () => {
    return {
      responseMessage: "Proxy Authentication Required",
      responseCode: 407,
    };
  },

  Request_Timeout: () => {
    return {
      responseMessage: "Request Timeout",
      responseCode: 408,
    };
  },

  Conflict:()=>{
    return {
        responseMessage: "Email Already Exists",
        responseCode: 409,
      };
     },

  //Server Response

  Internal_Server_Error: () => {
    return {
      responseMessage: "Internal Server Error",
      responseCode: 500,
    };
  },

  Not_Implemented: () => {
    return {
      responseMessage: "Not Implmented",
      responseCode: 501,
    };
  },

  Bad_Gateway: () => {
    return {
      responseMessage: "Bad Gateway",
      responseCode: 502,
    };
  },

  Service_Unavailable: () => {
    return {
      responseMessage: "Service Unavailable",
      responseCode: 503,
    };
  },

  Gateway_Timeout: () => {
    return {
      responseMessage: "Gateway Timeout",
      responseCode: 504,
    };
  },

  HTTP_Version_Not_Supported: () => {
    return {
      responseMessage: "HTTP Version not supported",
      responseCode: 505,
    };
  },

  Inssifficient_Storage: () => {
    return {
      responseMessage: "Inssufficient Storage",
      responseCode: 507,
    };
  },

  Network_Authentication_Required: () => {
    return {
      responseMessage: "Network Authentication Required",
      responseCode: 511,
    };
  },
};
