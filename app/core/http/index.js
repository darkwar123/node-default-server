const fs = require('fs');
const path = require('path');
const config = require('@config');
const Express = require('express');

const helmet = require('helmet');
const boom = require('express-boom');
const bodyParser = require('body-parser');
const compression = require('compression');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const debug = require('debug')('express:errors');

const session = require('express-session');
const sessionStore = require('@core/components/session-store');
const sessionConfig = config.app.session;

let app = new Express();

app.enable('trust proxy');// включаем x-forwarded-for header

app.use(boom());// подключаем вывод ошибок boom
app.use(helmet());// отключаем все лишние headers
app.use(compression());// включаем компресс статистических файлов
app.use(cookieParser());// парсим cookie
app.use(bodyParser.json({ limit: '100mb' }));// парсим post данные
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));// парсим get данные
app.use(session(
	Object.assign(
		{ store: sessionStore },
		sessionConfig,
	)
));// устанавливаем сессию

const publicDir = path.resolve(__dirname, '../../public');
const componentsDir = path.resolve(__dirname, './components');

app.use(serveStatic(publicDir));

/* обрабатываем express app нашими компонентами */
fs.readdirSync(componentsDir).forEach((component) => {
	component = require(path.resolve(componentsDir, component));

	component(app);
});

app.use((req, res, next) => {
	res.format({
		'text/html': function(){
			return res.sendFile(path.resolve(publicDir, 'index.html'));
		},
		'application/json': function(){
			return res.boom.notFound();
		},
		'default': function() {
			return res.boom.notAcceptable();
		},
	});
});

app.use((err, req, res, next) => {
	debug('%O', err);
	return res.boom.badImplementation();
});

module.exports = app;