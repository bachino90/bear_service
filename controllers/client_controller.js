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

// SHOW ALL
// GET /clients
router.get('/', isLoggedIn, function(req, res) {
  BeaconClient.find(function(err, allClients){
    if (err) {
      res.render(err);
    }
    res.render('client/clients',{ clients: allClients });
  });
});

// SHOW ONE
// GET /clients/:client_id
router.get('/:client_id',isLoggedIn, function(req, res) {
  BeaconClient.findById(req.params.client_id, function(err, client) {
    if (err) {
      res.render(err);
    }
    res.render('client/update_client',{ client: client });
  });
});

// CREATE
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

// UPDATE
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
      res.redirect('/clients');
    });
  });
});

// DELETE
// DELETE /clients/:client_id
router.delete('/:client_id',isLoggedIn, function(req, res){
  BeaconClient.remove({ _id: req.params.client_id }, function(err, clientId) {
    if (err) {
      res.render(err);
    }
    res.redirect('/clients');
  });
});

module.exports = router;
