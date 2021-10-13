const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../model/User");
	const {
		isAlpha,
		isAlphanumeric,
		isEmail,
		isStrongPassword,
		isEmpty,
	} = require("validator");

async function createUser(req, res) {
	const { firstName, lastName, username, email, password } = req.body;
	let body = req.body;
	let errObj = {};
		
	for (let key in body) {
			if (isEmpty(body[key])) {
				errObj[`${key}`] = `${key} cannot be empty`;
			}
		}
	
	if (!isAlpha(firstName)) {
		errObj.firstName =
			"First name cannot contain special characters or numbers";
	}
	if (!isAlpha(lastName)) {
		errObj.lastName =
			"Last name cannot contain special characters or numbers";
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

async function login(req, res) {
	//log the user in using email and password
	//if email does not exist, error message "please go sign up"
	//if email exists but wrong password error message "please check email and password"
	// if successful - for now send message "login success"
	const { email, password } = req.body;
	
	let errObj = {};

	if (!isEmail(email)) {
		errObj.email = "please enter a valid email";
	}

	if (isEmpty(password)) {
		errObj.password = "password cannot be empty";
	}

			if (Object.keys(errObj).length > 0) {
				return res.status(500).json({ message: "error", error: errObj });
	}
	

	try {
	let foundUser = await User.findOne({ email: email });
	let goodPass = await User.findOne({ password: password });

	if (!foundUser) {
		return res
			.status(500)
			.json({ message: "error", error: "Email does not exist, go sign up" });
	}

	else {
		let comparedPassword = await bcrypt.compare(password, foundUser.password);
		if (!comparedPassword) {
			return res
				.status(500)
				.json({ message: "error", error: "Please check your email and password" });
		} else {
			res.json({ message: "login successful" });
		}
	} 
	} catch (e) {
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
	login,
	getUsers,
	updateUser,
	deleteUser,
};
