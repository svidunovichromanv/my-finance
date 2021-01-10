import * as core from "express-serve-static-core";
import {Cluster} from "cluster";
import path from "path";
import { getRandomString } from "./helpers/random-string.function";
import {Md5} from "md5-typescript";
import {initializeDb} from "./services/db.service";
import {UsersModel} from "./models/users";
import {SES} from "aws-sdk";
import {AWSError} from "aws-sdk/lib/error";

const cluster: Cluster = require('cluster');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log(Md5.init('3223668Hjvf' + process.env.SAULT_PASS));

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
} else {
    const AWS = require('aws-sdk');
    const express = require('express');
    const bodyParser = require('body-parser');

    AWS.config.region = process.env.REGION
    const app: core.Express = express();

    app.set('view engine', 'ejs');
    app.set('views', path.join(process.cwd(), 'views'));
    app.use(bodyParser.urlencoded({extended:false}));
    initializeDb();
    UsersModel.findAll({raw:true}).then(users=>{
        console.log(users[0]);
    }).catch(err=>console.log(err));
    console.log('------------------->>>', process.env.REGION);
    AWS.config.update({region: process.env.REGION, credentials: {accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY}});



    const hi= 'HI!';
    const params = {
        Destination: {
            ToAddresses: [
                'svidunovichromanv@gmail.com',
            ]
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: `Hello! ${hi}`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Test email'
            }
        },
        Source: 'svidunovichromanv@gmail.com',
    };

    const sendPromise = new AWS.SES().sendEmail(params).promise();


    sendPromise.then(
        (data: SES.Types.SendEmailResponse) => {
            console.log(data.MessageId);
        }).catch(
        (err: AWSError) => {
            console.error(err, err.stack);
        });


    app.get('/', function(req, res) {
        res.render('index', {
            static_path: 'static',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.post('/signup', function(req, res) {
        res.status(500).end();
    });

    if (process.env.NODE_ENV === 'development') {
        app.use('/static', express.static('static'));
    }

    const port = process.env.PORT || 3000;

    const server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}
