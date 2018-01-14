const fs = require('fs');
const path = require('path');

const routesDir = path.resolve(__dirname, '../../../api/http/routes/');

/**
 * Добавляет пути к нашему приложению
 * @param {Express} app
 * */
module.exports = function(app) {
	fs.readdirSync(routesDir).forEach((route) => {
		const name = '/' + route.replace(/\.js$/i, '');
		route = require(path.resolve(routesDir, route));

		app.use(name, route);
	});
};