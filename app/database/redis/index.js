const fs = require('fs');
const path = require('path');
const caminte = require('caminte');
const redisConfig = require('@config').database.redis;

/* уставнавливаем адаптер и загружаем в него конфигурацию */
const schema  = new caminte.Schema('redis', redisConfig);
schema.client.options.prefix = redisConfig.keyPrefix;

const modelsDir = path.resolve(__dirname, './models');

/* записываем все модели из папки ./models */
fs.readdirSync(modelsDir).forEach((model) => {
	model = require(path.resolve(modelsDir, model));

	model(schema);
});

/* функция для получения модели по ее имени */
schema.model = function model(str) {
	return this.models[str];
};

module.exports = schema;