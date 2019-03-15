const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

admin.initializeApp();

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
  admin.auth().createCustomToken(req.query.id)
    .then(function(customToken) {
      res.render('report',{title:'report', token:customToken});
    })
    .catch(function(err) {
      res.status(500).send(`customToken error! ${err}`);
    });
});

module.exports = router;
