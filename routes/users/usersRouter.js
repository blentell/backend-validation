const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
const { createUser, login, updateUser, deleteUser, getUserInfo } = require('./controller/usersController');

const {
	checkIsEmpty,
	checkIsUndefined,
	validateCreateData,
	validateLoginData,
	jwtMiddleware,
	validateUpdateData,
} = require("./lib/authMiddleware");

router.get('/', jwtMiddleware, getUserInfo);

router.post(
	"/create-user",
	checkIsEmpty,
	checkIsUndefined,
	validateCreateData,
	createUser
);

router.post(
	"/login",
	checkIsEmpty,
	checkIsUndefined,  
  validateLoginData,
	login
);

router.put("/profile", jwtMiddleware, checkIsUndefined, checkIsEmpty, validateUpdateData, updateUser);

router.delete('/delete-user-by-id/:id', deleteUser);

module.exports = router;
