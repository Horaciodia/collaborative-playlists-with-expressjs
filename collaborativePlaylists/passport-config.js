const bcrypt = require('bcrypt');
const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;

function initializePassport(passport) {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                let user = await User.findOne({ username: username });

                if (!user) {
                    return done(null, false, {message: 'Incorrect username'});
                }

                const passwordsMatched = await bcrypt.compare(password, user.password);

                if (!passwordsMatched) {
                    return done(null, false, {message: 'Incorrect password'});
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ))

    passport.serializeUser(
        (user, done) => {
            return done(null, user._id);
        }
    );

    passport.deserializeUser(
        async (id, done) => {
            try {
                const user = await User.findById(id);
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    );
}

module.exports = initializePassport