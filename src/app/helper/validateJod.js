const validationMiddleware=(schema) =>{
    return async (req, res, next) => {
        try {
          await schema.parseAsync(req.body);
        } catch (error) {
          next(error);
        }
        next();
      };
    } 
export default validationMiddleware;