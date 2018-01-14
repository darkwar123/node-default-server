const fs = require('fs');
const path = require('path');
const boom = require('express-boom');

const router = require('node-socket.io-router').Router();

const routesDir = path.resolve(__dirname, '../../../api/ws/routes/');

/**
 * Добавляет пути к нашему приложению
 * @param {IO} io
 * */
module.exports = function(io) {
	fs.readdirSync(routesDir).forEach((route) => {
		const name = '/' + route.replace(/\.js$/i, '');
		route = require(path.resolve(routesDir, route));

		router.use(name, route);

		/* подключаемые модули */
		router.use(boom());

		io.use(router.handle());
	});
};