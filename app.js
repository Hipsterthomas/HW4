var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//在 express.js 中，使用 sqlite3 來操作數據庫，並開啟位置在 db/sqlite.db 的資料庫，需要確認是否成功打開資料庫
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

// 撰寫 post /api 路由，使用 SQLite 查詢某 model 的所有資料
app.post('/api', (req, res) => {
    let model = req.body.model;
    let sql = `SELECT model, date, price FROM tesla WHERE model = ?`;
    db.all(sql, [model], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        if (rows.length === 0) {
            res.status(404).send('Not found');
        }
        else{
            res.send(rows)
        }
    });
});

module.exports = app;
