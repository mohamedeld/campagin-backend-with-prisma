

const sendErrorForDevelopment = (err,response) => {
  response.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProduction = (err,response)=>{
  if(err.isOperational){
      response.status(err.statusCode).json({
          status:err.status,
          message: err.message,
      })
  }
}

const globalErrors =   (err, request, response, next) => {
err.statusCode = err.statusCode || 500;
err.status = err.status || "error";

if (process.env.NODE_ENV === "development") {
  sendErrorForDevelopment(err, response);
}
else if(process.env.NODE_ENV === "production"){
  sendErrorForProduction(err,response);
}
};

export default globalErrors;