"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cluster = require('cluster');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
console.log('-------------->>>>>>', process.env.SAULT_PASS);
// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    // Listen for terminating workers
    cluster.on('exit', function (worker) {
        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });
    // Code to run if we're in a worker process
}
else {
    const AWS = require('aws-sdk');
    const express = require('express');
    const bodyParser = require('body-parser');
    AWS.config.region = process.env.REGION;
    const sns = new AWS.SNS();
    const ddb = new AWS.DynamoDB();
    const ddbTable = process.env.STARTUP_SIGNUP_TABLE;
    const snsTopic = process.env.NEW_SIGNUP_TOPIC;
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path_1.default.join(process.cwd(), 'views'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.get('/', function (req, res) {
        res.render('index', {
            static_path: 'static',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });
    app.post('/signup', function (req, res) {
        const item = {
            'email': { 'S': req.body.email },
            'name': { 'S': req.body.name },
            'preview': { 'S': req.body.previewAccess },
            'theme': { 'S': req.body.theme }
        };
        ddb.putItem({
            'TableName': ddbTable,
            'Item': item,
            'Expected': { email: { Exists: false } }
        }, function (err, data) {
            if (err) {
                let returnStatus = 500;
                if (err.code === 'ConditionalCheckFailedException') {
                    returnStatus = 409;
                }
                res.status(returnStatus).end();
                console.log('DDB Error: ' + err);
            }
            else {
                sns.publish({
                    'Message': 'Name: ' + req.body.name + "\r\nEmail: " + req.body.email
                        + "\r\nPreviewAccess: " + req.body.previewAccess
                        + "\r\nTheme: " + req.body.theme,
                    'Subject': 'New user sign up!!!',
                    'TopicArn': snsTopic
                }, function (err, data) {
                    if (err) {
                        res.status(500).end();
                        console.log('SNS Error: ' + err);
                    }
                    else {
                        res.status(201).end();
                    }
                });
            }
        });
    });
    if (process.env.NODE_ENV === 'development') {
        app.use('/static', express.static('static'));
    }
    const port = process.env.PORT || 3000;
    const server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}
//# sourceMappingURL=app.js.map