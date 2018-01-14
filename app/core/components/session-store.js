const config = require('@config');
const session = require('express-session');
const SessionStore = require('connect-redis')(session);

const Redis = require('ioredis');
const redisConfig = config.database.redis;

module.exports = new SessionStore({ client: new Redis(redisConfig) });