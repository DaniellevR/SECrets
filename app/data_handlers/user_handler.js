var User = require('../models/user');

module.exports = {
    getSecret: function (name, callback) {
        User.find({name: name}, function (err, found_user) {
            if (err || found_user.length == 0) {
                callback("User not found", null);
            } else {
                callback(null, found_user[0].secret);
            }
        });
    },
    addSecret: function (name, password, secret, callback) {
        User.find({name: name}, function (err, found_user) {
            if (err || found_user.length == 0) {
                var user = new User();
                user.name = name;
                user.password = password;
                user.secret = secret;
        
                user.save((err, res) => {
                    if (err) {
                        callback("Failed to save user with secret", null);
                    } else {
                        callback(null, "Saved");
                    }
                });
            } else {
                User.findOneAndUpdate({ name: name }, { $set: { secret: secret }}, function (err, updated_user) {
                    if (err) {
                        callback("Failed to update secret of user", null);
                    } else {
                        callback(null, "Updated");
                    }
                });
            }
        });
    }
}