const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const User = require("../model/User");
const errorHandler = require('../../utils/errorHandler/errorHandler');

async function getUserInfo(req, res, next) {
	try {
		const decodedData = res.locals.decodedData;
		const foundUser = await User.findOne({ email: decodedData.email }).populate(
			"orderHistory",
			"-orderOwner -_v"
		);
		res.json({ message: "success", payload: foundUser });
	} catch (e) {
		res.status(500).json({ message: "error", error: errorHandler(e) });
	}
}


async function createUser(req, res) {
	const { firstName, lastName, username, email, password } = req.body;

	
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
		res.status(500).json({ message: "error", error: errorHandler(error) });
	}
}

async function login(req, res) {
	//log the user in using email and password
	//if email does not exist, error message "please go sign up"
	//if email exists but wrong password error message "please check email and password"
	// if successful - for now send message "login success"
	const { email, password } = req.body;
	
	try {
	let foundUser = await User.findOne({ email: email });
	
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
			let jwtToken = jwt.sign(
				{
					email: foundUser.email,
					username: foundUser.username,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "24h" }
			);
			res.json({ message: "success", payload: jwtToken});
		}
	} 
	} catch (e) {
		res.status(500).json({ message: "error", error: e.message });		
	}
}

async function updateUser(req, res) {
	try {
		//If token is valid
		//go to the next middleware
		// making sure first name, last name, username, password are not empty
		// making each field has a correct validation (refer back to previous lessons)
		// Making sure confirmPassword and password are identical
		// If they dont match - send an error message to user saying "Password and confirmPassword must match"
		// If every fields are correct allow the user to update

		const { password } = req.body;

		// let notDecodedToken = req.headers.authorization;

		// let slicedToken = notDecodedToken.slice(7);

		// let decodedToken = jwt.verify(slicedToken, process.env.JWT_SECRET);

		const decodedData = res.locals.decodedData;

		let salt = await bcrypt.genSalt(10);
		let hashedPassword = await bcrypt.hash(password, salt);

		req.body.password = hashedPassword;

		let updatedUser = await User.findOneAndUpdate(
			{ email: decodedData.email },
			req.body,
			{ new: true }
		);

		res.json({
			message: "success",
			payload: updatedUser,
		});
	} catch (e) {
		res.status(500).json({ message: "error", error: e.message });
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
	updateUser,
	deleteUser,
	getUserInfo,
};
