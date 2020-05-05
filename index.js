const cors = require('cors');
const express = require('express');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('working');
});

app.post('/', async (req, res) => {
  try {
    const page = await fetch(req.body.albumUrl)
      .then((res) => res.text())
      .then((body) => body);

    const $ = cheerio.load(page);
    const playDiv = $('body')
      .find(`#${req.body.playId}`)
      .find('span.ico')
      .attr('data-url');
    if (playDiv) {
      res.send({
        _id: req.body.playId.replace('play_', ''),
        url: 'https://myzuka.club' + playDiv,
      });
    } else {
      res.status(400).end();
    }
  } catch (err) {
    res.status(400).end();
  }
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
