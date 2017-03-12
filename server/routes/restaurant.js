var _ = require('lodash');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var moment = require('moment');

var rp = require('request-promise');

var headers = {
  Authorization: 'bearer 27037c67-f394-4cfd-ab51-069ac71132fb'
};

router.get('/availability/:id', (req, res) => {
  console.log('GET /availability', req.params)
  const spec = req.query;
  const rid = req.params.id;
  const availUrl = 'https://platform.otqa.com/availability';

  const options = {
    uri: `${availUrl}/${rid}`,
    method: 'GET',
    headers: headers,
    qs: {
      start_date_time: spec.start_date_time,
      forward_minutes: spec.forward_minutes,
      backward_minutes: spec.backward_minutes,
      party_size: spec.party_size
    }
  };

  rp(options)
    .then(response => {
      const result = JSON.parse(response).times_available;
      _.each(result, obj => {
        obj.time = moment(obj.time).format('YYYY/MM/DD h:mm');
      });
      return res.status(200).send(result);
    })
    .catch(err => {
      return res.status(400).send(err.message);
    })
});

router.get('/listings', (req, res) => {
  const name = req.query.name
  console.log('GET /listings');
  const options = {
    uri: 'https://platform.otqa.com/sync/listings',
    method: 'GET',
    headers: headers,
    json: true
  };

  rp(options)
    .then(response => {
      if (!name) {
        return res.status(200).send(response.items);
      }
      const item = _.filter(response.items, item => {
        return item.name.indexOf(name) > -1
      })
      return res.status(200).send(item);
    })
    .catch(err => {
      return res.status(400).send(err.message);
    })
});

module.exports = router;
