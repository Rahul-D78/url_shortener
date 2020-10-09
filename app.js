const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const shortUrl = require('./models/short')
const ejs = require('ejs')

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/urlDB', {useNewUrlParser:true, useUnifiedTopology:true});

app.get('/', async (req, res) => {
    const shortUrls = await shortUrl.find();
    res.render('index', {shortUrls: shortUrls});
})

app.post('/shortUrls',  async (req, res) => {
    await shortUrl.create({full: req.body.fullurl})

    res.redirect('/');
})

app.get('/:shortUrl', async (req, res) => {
    const shorturl = await shortUrl.findOne({short : req.params.shortUrl})

    if(shorturl == null) return res.sendStatus(404);

    shorturl.clicks++;
    shorturl.save();

    res.redirect(shorturl.full)
})

app.listen(3000, (req, res) => {
    console.log(`server is running on http://localhost:3000`);
})