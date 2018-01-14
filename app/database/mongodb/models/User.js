const md5 = require('md5');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const debug = require('debug')('mongoose:user');

let schema = new Schema({
	email: {
		type: String,
		minLength: 4,
		maxLength: 60,
		required: true,
		trim: true,
		match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	},
	password: {
		type: String,
		required: true,
		minLength: 6,
		maxLength: 60,
		set: (val) => md5(val),
	},
	balance: {
		type: mongoose.Types.Decimal128,
		default: mongoose.Types.Decimal128.fromString('0.00'),
		index: true,
	},
	createdAt: {
		select: false,
		type: Date,
		default: Date.now,
		index: true,
	},
}, { runSettersOnQuery: true });

schema.methods.verifyPassword = function verifyPassword(password) {
	return md5(password) === this.password;
};

module.exports = schema;