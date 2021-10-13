const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
	{
		orderName: {
			type: String,
		},
		orderAmount: {
			type: Number,
    },
    orderItem: {
      type: Array,
    },
		orderOwner: {
			type: mongoose.Schema.ObjectId,
			ref: "user",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("order", OrderSchema);
