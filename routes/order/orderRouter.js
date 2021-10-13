var express = require("express");
var router = express.Router();
const { isAlpha, isInt } = require("validator");
// bringing in the required utilities
var { jwtMiddleware } = require("../users/lib/authMiddleware");

const {getAllOrders, createOrder, deleteOrder, updateOrder } = require('./controller/orderController')

router.post("/create-order", jwtMiddleware, createOrder);

router.get('/', jwtMiddleware, getAllOrders);

router.put('/update-order/:id', jwtMiddleware, updateOrder);

router.delete('/delete-order/:id', jwtMiddleware, deleteOrder);


module.exports = router;

