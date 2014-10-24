//===============================//
//====== Client Controller ======//
//===============================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var BeaconRequest  = require('../models/beacon').BeaconRequest;
var mongoose       = require('mongoose');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  /*
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('../');
  */

  return next();
}

// SHOW ALL
// GET /clients
router.get('/', isLoggedIn, function(req, res) {
  res.render('skeleton/request');
});

router.get('/all', isLoggedIn, function(req, res) {
  BeaconRequest.find().populate('beacon', 'beacon_name').populate('store', 'store_name').populate('client', 'name').exec(function(err,requests) {
    if (err) {
      res.json(err);
    } else {
      console.log('all requests');
      console.log(requests);
      res.json(requests);
    }
  });
});

router.get('/dReq', isLoggedIn, function(req, res) {
  BeaconRequest.remove({}, function(err) {
    console.log('collection dropped');
    res.redirect('/request');
  });
});

router.get('/dTestReq', isLoggedIn, function(req, res) {
  BeaconRequest.remove({'test':true}, function(err) {
    console.log('collection dropped');
    res.redirect('/request');
  });
});

router.get('/dAll', isLoggedIn, function(req, res) {
  mongoose.connection.db.dropDatabase();
  res.redirect('/request');
});


module.exports = router;
