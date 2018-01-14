const passport = require('passport');
const LocalStrategy = require('passport-local');

const mongodb = require('@database/mongodb');
const User = mongodb.model('User');

passport.use(new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password',
	},
	(username, password, done) => {
		User.findOne({ username }, (err, user) => {
			if (err || !user || !user.verifyPassword(password)) {
				return done();
			}

			return done(null, user);
		});
	}
));

passport.serializeUser((user, done) => {
	return done(null, user._id);
});

passport.deserializeUser((_id, done) => {
	User.findById(_id, (err, user) => {
		return done(err, user);
	});
});

module.exports = function(app) {
	app.use(passport.initialize());
	app.use(passport.session());
};