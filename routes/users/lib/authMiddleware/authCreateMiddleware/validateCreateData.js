const {
	isAlpha,
	isAlphanumeric,
	isEmail,
	isStrongPassword,	
} = require("validator");

function validateCreateData(req, res, next) {
	const { firstName, lastName, username, email, password } = req.body;
  let errObj = {};

	if (!isAlpha(firstName)) {
		errObj.firstName =
			"First name cannot contain special characters or numbers";
	}
	if (!isAlpha(lastName)) {
		errObj.lastName = "Last name cannot contain special characters or numbers";
	}
	if (!isAlphanumeric(username)) {
		errObj.username = "Username cannot contain special characters";
	}
	if (!isEmail(email)) {
		errObj.email = "Email must be in a valid email format";
	}
	if (!isStrongPassword(password)) {
		errObj.password =
			"password must contain one special character, one number, one uppercase letter and be at least 8 characters long";
	}
	if (Object.keys(errObj).length > 0) {
		return res.status(500).json({ message: "error", error: errObj });
	} else {
		next();
	}
}

module.exports = {
	validateCreateData,
};
