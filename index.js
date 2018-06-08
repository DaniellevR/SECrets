var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var crypto = require('crypto');
var user_handler = require('./app/data_handlers/user_handler');
var user = require('./app/models/user');

// Port
const PORT = process.env.PORT || 3000

// Database
var mongoose = require('mongoose');
var db_url = require('./config/database.js').url;
mongoose.connect(db_url);

// View engine
app.set('view engine', 'ejs');

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Encryption
var encryption_algorithm = 'aes-256-cbc';

app.get('/', function(req, res) {
    res.render('pages/index', {data: ''});
});

app.post('/secret', function(req, res) {
    var name = req.body.name
	var secretText = req.body.secretText
    var password = req.body.password

    var data = '';

    if (secretText) {
        // Encrypt
        let cipher = crypto.createCipher(encryption_algorithm, name + password);
        data = cipher.update(secretText, 'utf8', 'hex') + cipher.final('hex');

        user_handler.addSecret(name, password, data, function(err, result) {
            if (err) {
                data = err;
            } else {
                data = result;
            }

            res.render('pages/index', {data: data});
        });
    } else {
        // Decrypt
        user_handler.getSecret(name, function(err, result) {
            if (err) {
                data = 'Wrong combination of name and password';
            } else {
                try {
                    var decipher = crypto.createDecipher(encryption_algorithm, name + password);
                    data = decipher.update(result, 'hex', 'utf8') + decipher.final('utf8');
                } catch(e) {
                    data = 'Wrong combination of name and password';
                }
            }

            res.render('pages/index', {data: data});
        });
    }
});

app.use(function (req, res) {
    res.render('pages/page_not_found');
});

app.listen(PORT);