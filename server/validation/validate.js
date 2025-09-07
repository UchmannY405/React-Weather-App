const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err?.issues) {
        const fieldErrors = {};
        for (const issue of err.issues) {
          const path = issue.path.join(".") || "root";
          fieldErrors[path] = issue.message;
        }
        return res.status(422).json({
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          fieldErrors,
        });
      }
      next(err);
    }
  };

module.exports = { validate };
