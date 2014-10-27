var express = require('express');
var router = express.Router();
var fs = require('fs');
var config = JSON.parse(
    fs.readFileSync(__dirname + '/../config.json', 'utf-8'));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    monitor: false,
    mockHeight: config.dimensions.height,
    mockWidth: config.dimensions.width
  });
});
router.get('/monitor', function(req, res) {
  res.render('index', {
    monitor: true,
    mockHeight: config.dimensions.height,
    mockWidth: config.dimensions.width
  });
});

module.exports = router;
