var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function(User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.authenticate(username.toLowerCase(), password, done);
    }
  ));
};