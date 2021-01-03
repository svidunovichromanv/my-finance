import * as expressTS from "express";
import * as core from "express-serve-static-core";
import {Cluster} from "cluster";
import {DynamoDB, SNS} from "aws-sdk";
import path from "path";
import {logLineAsync} from "./utils/logger";
// Include the cluster module
const cluster: Cluster = require('cluster');

require('dotenv').config();

const logToRootFile = (info: string): Promise<null> => logLineAsync(path.join(process.cwd(), 'log.log'), info);

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {

        // Replace the terminated workers
        logToRootFile('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {
    const AWS = require('aws-sdk');
    const express = require('express');
    const bodyParser = require('body-parser');

    AWS.config.region = process.env.REGION

    const sns: SNS = new AWS.SNS();
    const ddb: DynamoDB = new AWS.DynamoDB();

    const ddbTable =  process.env.STARTUP_SIGNUP_TABLE;
    const snsTopic =  process.env.NEW_SIGNUP_TOPIC;
    const app: core.Express = express();

    app.set('view engine', 'ejs');
    app.set('views', path.join(process.cwd(), 'views'));
    app.use(bodyParser.urlencoded({extended:false}));

    app.get('/', function(req, res) {
        res.render('index', {
            static_path: 'static',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.post('/signup', (req: expressTS.Request, res: expressTS.Response) => {
        const item = {
            'email': {'S': req.body.email},
            'name': {'S': req.body.name},
            'preview': {'S': req.body.previewAccess},
            'theme': {'S': req.body.theme}
        };

        ddb.putItem({
            'TableName': ddbTable,
            'Item': item,
            'Expected': { email: { Exists: false } }        
        }, function(err, data) {
            if (err) {
                let returnStatus = 500;

                if (err.code === 'ConditionalCheckFailedException') {
                    returnStatus = 409;
                }

                res.status(returnStatus).end();
                logToRootFile('DDB Error: ' + err);
            } else {
                sns.publish({
                    'Message': 'Name: ' + req.body.name + "\r\nEmail: " + req.body.email 
                                        + "\r\nPreviewAccess: " + req.body.previewAccess 
                                        + "\r\nTheme: " + req.body.theme,
                    'Subject': 'New user sign up!!!',
                    'TopicArn': snsTopic
                }, function(err, data) {
                    if (err) {
                        res.status(500).end();
                        logToRootFile('SNS Error: ' + err);
                    } else {
                        res.status(201).end();
                    }
                });            
            }
        });
    });

    if (process.env.NODE_ENV === 'development') {
        app.use('/static', express.static('static'));
    }

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        logToRootFile('Server running at http://127.0.0.1:' + port + '/');
    });
}
