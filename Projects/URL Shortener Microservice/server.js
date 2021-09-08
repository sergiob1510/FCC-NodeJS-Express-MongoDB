require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
const shortId = require('shortid');
const validUrl = require('valid-url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({
   extended: false
}));

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//Solution
//DB Setup
mongoose.connect(process.env['DB_CONNECT'], { useNewUrlParser : true, useUnifiedTopology : true }, () => { console.log("DB connected");});

const shortenedUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
  },
  shortenedUrl: {
    type: String
  }
});

const ShortUrl = mongoose.model('shorturl', shortenedUrlSchema);

app.post('/api/shorturl', async (req, res) => {
  console.log(req.body.url);
  const url = req.body.url;
  const urlCode = shortId.generate();
  if(!validUrl.isWebUri(url)) {
    res.json({
      'error' : 'invalid URL'
    });
  };
  try {
    let findOne = await ShortUrl.findOne({
      originalUrl: url
    });
    if (findOne) {
      res.json({
        original_url: findOne.originalUrl,
        short_url: findOne.shortenedUrl
      });
      } else {
        findOne = new ShortUrl({
          originalUrl: url,
          shortenedUrl: urlCode
        });
      await findOne.save();
      res.json({
        original_url : findOne.originalUrl,
        short_url: findOne.shortenedUrl
      });
      };
    } catch (err) {
      console.error(err)
      res.json('Server error');
    };
  });

  app.get('/api/shorturl/:short_url?', async (req, res) => {
    try {
      const urlParams = await ShortUrl.findOne({
        shortenedUrl: req.params.short_url
      });
      if (urlParams) {
        return res.redirect(urlParams.originalUrl);
      } else {
        return res.json('No URL found');
      }
    } catch (err) {
      console.error(err);
      res.json('Server error');
    };
  });

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
