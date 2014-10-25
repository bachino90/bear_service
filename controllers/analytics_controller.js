//===================================//
//======= Analytics Controller ======//
//===================================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Store          = require('../models/beacon').Store;
var Beacon         = require('../models/beacon').Beacon;
var BeaconClient   = require('../models/beacon').Client;
var BeaconRequest  = require('../models/beacon').BeaconRequest;
var store_id;
var client_id;


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  /*
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('../');
  */
  client_id = req.baseUrl.split("/")[2];
  return next();
}


router.get('/:store_id', isLoggedIn, function(req,res) {
  BeaconRequest.find({ store: req.params.store_id }, function(err, requests) {
    if (err) {
      res.json(err);
    } else {
      res.json(requests);
    }
  })
});



module.exports = router;
