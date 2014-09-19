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

function insideRedirectToHome(req,res,rN,m,vE,newB,showB,b,c) {
  if (vE['code'] == 11000) {
    m = "Already exist";
  }
  var title = "Beacons";
  var client_id = "";
  if (req.params.client_id) {
    title = b[0].name;
    client_id = req.params.client_id;
  }
  res.render('beacons/index',{title: title,
                       clients_side: c,
                       clients_main: b,
                          client_id: client_id,
                           routeNew: rN,
                            message: m,
                             valErr: vE,
                          newBeacon: newB,
                         showBeacon: showB});
}

// GET /clients
router.get('/', isLoggedIn, function(req, res) {
  BeaconClient.find(function(err, all_clients){
    if (err) {
      res.render(err);
    }
    res.render('show_clients',{ clients: all_clients });
  });
});

// GET /clients/:client_id
router.get('/:client_id',isLoggedIn, function(req, res){
  BeaconClient.findById(req.params.client_id, function(err, client){
    if (err) {
      res.render(err);
    }
    res.render('client',{ client: client });
  });
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

// PUT /clients
router.put('/:client_id', isLoggedIn, function(req,res) {
  // use our bear model to find the bear we want
  BeaconClient.findById(req.params.client_id, function(err, client) {
    if (err) {
      res.render(err);
    }
    client.name = req.body.name;
    client.mayor_id = req.body.primary_uuid;
    client.minor_id = req.body.secondary_uuid;
    // save the client update
    client.save(function(err) {
      if (err) {
        res.render(err);
      }
      res.redirect('/client');
    });
  });
});
