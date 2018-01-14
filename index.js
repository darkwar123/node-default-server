/* регестрируем наши модули из package.json */
require('module-alias/register');

const config = require('@config');
const appPort = config.app.port;

const redis = require('@database/redis');
const mongodb = require('@database/mongodb');

const http = require('@core/http');
const ws = require('@core/ws')(http.listen(appPort));

/* прикрепляем к http наше ws соединение */
http.ws = ws;