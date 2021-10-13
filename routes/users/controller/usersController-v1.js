const User = require("../model/User");
const bcrypt = require("bcryptjs");


function checkForNumberandSymbol(target) {
	var regName = /[!`\-=@#$%^&*()\[\],.?":;{}|<>1234567890]/g;
	if (target.match(regName)) {
		return true;
	} else {
		return false;
	}
}

function checkForEmptyString(target) {
	if (target.length === 0) {
		return true;
	} else {
		return false;
	}
}

function checkForSpecialCharacters(target) {
	var regName = /[!`\-=@#$%^&*()\[\],.?":;{}|<>]/g;
	if (target.match(regName)) {
		return true;
	} else {
		return false;
	}
}

function checkForProperEmail(target) {
	var mailFormat = /\S+@\S+\.\S+/;
	if (target.match(mailFormat)) {
		return true;
	} else {
		return false;
	}
}

function checkForProperPassword(target) {
	var regName =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])*(?=.*[!@#\\$%\\^\\&*\)\(+=._-]).{8,15}$/;
	if (target.match(regName)) {
		return true;
	} else {
		return false;
	}
}

async function createUser(req, res) {
	const { firstName, lastName, username, email, password } = req.body;
	let body = req.body;
	let errObj = {};

	for (let key in body) {
		if (checkForEmptyString(body[key])) {
			errObj[`${key}`] = `${key} cannot be empty`;
		}
	}

	if (checkForNumberandSymbol(firstName)) {
		errObj.firstName =
			"First name cannot contain special characters or numbers";
	}

	if (checkForNumberandSymbol(lastName)) {
		errObj.lastName = "Last name cannot contain special characters or numbers";
	}

	if (checkForSpecialCharacters(username)) {
		errObj.username = "username cannot contain special characters";
	}

	if (!checkForProperEmail(email)) {
		errObj.email = "email must be in email format"
	}

	if (!checkForProperPassword(password)) {
		errObj.password = "password must contain one special character, one number, one uppercase letter and be at least 8 characters long";
	}

	if (Object.keys(errObj).length > 0) {
		return res.status(500).json({ message: "error", error: errObj });
	}

	try {

		let salt = await bcrypt.genSalt(10);
		let hashed = await bcrypt.hash(password, salt);

		const createdUser = new User({
			firstName,
			lastName,
			username,
			email,
			password: hashed,
		});

		let savedUser = await createdUser.save();
		res.json({ message: "success", payload: savedUser });
	} catch (error) {
		res.status(500).json({ message: "error", error: error.message });
	}
}

async function getUsers(req, res) {
	const { firstName, lastName, username, email, password } = req.body;
	try {
		let payload = await User.find(req.body);
		res.json({ message: "success", payload: payload });
	} catch (error) {
		res.status(500).json({ message: "error", error: "error.message" });
	}
}

async function updateUser(req, res) {
	const { firstName, lastName, username, email, password } = req.body;
	try {
		let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json({ message: "success", payload: updatedUser });
	} catch (error) {
		res.status(500).json({ message: "failure", error: error.message });
	}
}

async function deleteUser(req, res) {
	const { firstName, lastName, username, email, password } = req.body;
	try {
		let deletedUser = await User.findByIdAndDelete(req.params.id, req.body);
		res.json({ message: "success", payload: deletedUser });
	} catch (error) {
		res.status(500).json({ message: "failure", error: error.message });
	}
}

module.exports = {
	createUser,
	getUsers,
	updateUser,
	deleteUser,
};
