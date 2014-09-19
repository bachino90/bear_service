//===============================//
//====== Client Controller ======//
//===============================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Store          = require('../models/beacon').Store;
var Area           = require('../models/beacon').Area;
var Beacon         = require('../models/beacon').Beacon;
var BeaconClient   = require('../models/beacon').BeaconClient;


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

// GET /clients
router.get('/', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,false,'',false);
});

// GET /clients/:client_id
router.get('/:client_id',isLoggedIn, function(req, res){
  redirectToHomeWithErrors(req,res,false,'',false);
});

// GET /clients/new
router.get('/new', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,true,'',false);
});

// POST /clients
router.post('/', isLoggedIn, function(req,res) {
  var new_client = new BeaconClient();
  new_client.name = req.body.name;
  new_client.primary_uuid = req.body.primary_uuid;
  new_client.secondary_uuid = req.body.secondary_uuid;
  new_client.save(function(err) {
    if (err) {
      res.render(err);
    }
    res.redirect('/clients');
  });
});
