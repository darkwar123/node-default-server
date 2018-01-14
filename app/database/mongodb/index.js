const fs = require('fs');
const path = require('path');
const config = require('@config');

const mongoose = require('mongoose');
const cachegoose = require('cachegoose');

const Redis = require('ioredis');
const redisConfig = config.database.redis;

const mongodbUri = config.database.mongodb.uri;

mongoose.Promise = Promise;

/* используем кэширование */
cachegoose(mongoose, {
	engine: 'redis',
	client: new Redis(redisConfig)
});

const connection = mongoose.createConnection(mongodbUri);

const modelsDir = path.resolve(__dirname, './models');

/* записываем все модели из папки ./models */
fs.readdirSync(modelsDir).forEach((model) => {
	const name = model.replace(/\.js$/i, '');
	model = require(path.resolve(modelsDir, model));

	connection.model(name, model);
});

module.exports = connection;