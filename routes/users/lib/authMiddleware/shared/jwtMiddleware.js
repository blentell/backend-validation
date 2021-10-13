const jwt = require("jsonwebtoken");

function jwtMiddleware(req, res, next) {
  try {
    if (req.headers && req.headers.authorization) {
			// let jwtToken = req.headers.authorization.split(" ");
			// let decodedToken = jwt.decode(jwtToken[1], process.env.JWT_SECRET)
			// res.json({ message: "success", payload: decodedToken });
			let notDecodedToken = req.headers.authorization;

			let slicedToken = notDecodedToken.slice(7);

			let decodedToken = jwt.verify(slicedToken, process.env.JWT_SECRET);

      res.locals.decodedData = decodedToken;
      next();
		} else {
			throw { message: "You don't have permission" };
		}
    // If token is valid
    // go to the next middleware
    // validateUpdateData -> making sure first name, last name, username, password are not empty
    // making sure each field has a correct validation(refer back to previous lessons)
    // Making sure confirmedPassword and password are identical
    // If they dont match - send an error message to user saying "Password and confirmPassword do not match"
    // If all fields are correct, allow the user to update

	} catch (e) {
		res.status(500).json({ message: "error", error: e.message });
	}
}

module.exports = {
	jwtMiddleware,
};
