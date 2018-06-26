const fs = require('fs');
const path = require('path');
const IO = require('socket.io');
const config = require('@config');

const Redis = require('ioredis');

const redisConfig = config.database.redis;
const redisAdapter = require('socket.io-redis');
const redisAdapterPrefix = redisConfig.keyPrefix;

const componentsDir = path.resolve(__dirname, './components');

/**
 * Создает socket.io сервер из экземпляра класса Express
 * @param {Express} app
 * @return {IO}
 * */
module.exports = function(app) {
	const io = new IO(app);

	io.adapter(redisAdapter(
		{
			key: redisAdapterPrefix,
			pubClient: new Redis(redisConfig),
			subClient: new Redis(redisConfig),
		}
	));

	/* обрабатываем io нашими компонентами */
	fs.readdirSync(componentsDir).forEach((component) => {
		component = require(path.resolve(componentsDir, component));

		component(io);
	});

	return io;
};