var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/exam.html', function(req, res, next) {
  res.render('exam');
});

router.get('/exam-list.html', function(req, res, next) {
  res.render('exam-list');
});

router.get('/report.html', function(req, res, next) {
  res.render('report');
});

module.exports = router;
