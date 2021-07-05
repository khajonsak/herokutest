require('dotenv').config();

const express = require('express');
var session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const logger = require('morgan');
const line = require('@line/bot-sdk');
const cors = require('cors');
const mysql = require('mysql');
const PORT = process.env.PORT || 3000;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testloginrich'

});


const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};


const client = new line.Client(config);
const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors());

app.get('/api/v1/unlink-richmenu', (req, res) => {    
    client.unlinkRichMenuFromUser("U2db00ef1712aa45bf9fcca64c3c82501");
    res.json({
        data: req.body
    });
});

app.post('/api/v1/change-richmenu', (req, res) => {
    
    const { username, password, userId } = req.body;
    console.log(req.body);
    if (username && password){
        connection.query('SELECT * FROM user  WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
     if(results.length > 0){ 
         req.session.loggeedin = true;
         req.session.userId = userId;
         client.linkRichMenuToUser(userId, "richmenu-466548b3d9117e842d9441fc8684680d");
         res.json({
            data: req.body
        });
         console.log('รหัสถูกต้อง')
        
     } else if (username && password) {
        connection.query('SELECT * FROM user1 WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
            if(results.length > 0){ 
                req.session.loggeedin = true;
                req.session.userId = userId;
                client.linkRichMenuToUser(userId, "richmenu-466548b3d9117e842d9441fc8684680d");
          
                console.log('รหัสถูกต้อง1')
                
            } else if (username && password) {
                connection.query('SELECT * FROM user2 WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
                    if(results.length > 0){ 
                        req.session.loggeedin = true;
                        req.session.userId = userId;
                        client.linkRichMenuToUser(userId, "richmenu-466548b3d9117e842d9441fc8684680d");
                  
                        console.log('รหัสถูกต้อง2')
                    } else {
                        console.log('รหัสไม่ถูกต้อง2')

                    }

                })
            }
        })
        
     } 
     res.end();
 });

 }
   
})

app.listen(PORT, () => {
    console.log("Ready on port 3000");
});