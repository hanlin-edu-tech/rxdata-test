var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{title:'index'});
});

router.get('/exam.html', function(req, res, next) {
  res.render('exam',{title:'exam'});
});

router.get('/exam-list.html', function(req, res, next) {
  res.render('exam-list',{title:'exam-list'});
});

router.get('/report.html', function(req, res, next) {
  res.render('report',{title:'report'});
});

module.exports = router;
