const config = require('@config');
const mongodb = require('@database/mongodb');

const cookie = require('cookie');
const cookiesParser = require('cookie-parser');
const sessionStore = require('@core/components/session-store');

module.exports = function(io) {
	io.set('authorization', (handshake, callback) => {
		if (typeof handshake.headers.cookie !== 'string') {
			return callback(null, true);
		}

		handshake.user = null;

		const cookies = cookie.parse(handshake.headers.cookie);
		const sessionId = cookiesParser.signedCookie(cookies[config.app.session.key], config.app.session.secret);

		sessionStore.load(sessionId, (err, session = {}) => {
			if (err || !session.hasOwnProperty('passport')) {
				return callback(null, true);
			}

			mongodb.model('User').findById(session.passport.user, (err, user) => {
				if (!err && user) {
					handshake.user = user;
				}

				return callback(null, true);
			});
		})
	});

	io.use((socket, next) => {
		Object.assign(socket, {
			user: socket.request.user,
			isAuthenticated() {
				return !!this.user
			},
		});

		if (!socket.isAuthenticated()) {
			return next();
		}

		socket.join(socket.user._id, (err) => {
			if (err) {
				return socket.disconnect();
			}

			return next();
		});
	});
};