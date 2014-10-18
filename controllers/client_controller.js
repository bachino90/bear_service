//===============================//
//====== Client Controller ======//
//===============================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Store          = require('../models/beacon').Store;
var Area           = require('../models/beacon').Area;
var Beacon         = require('../models/beacon').Beacon;
var Client         = require('../models/beacon').Client;


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
  Client.find(function(err, allClients){
    if (err) {
      res.render(err);
    }
    res.render('skeleton/clients',{ clients: allClients,
                            new_client_name: req.flash('new_client_name'),
                            new_client_uuid: req.flash('new_client_uuid'),
                                     is_new: req.flash('is_new'),
                                     errors: req.flash('errors') });
  });
});

// SHOW ONE
// GET /clients/:client_id
router.get('/:client_id', isLoggedIn, function(req, res) {
  res.redirect(req.originalUrl+'/stores');
  /*
  Client.findById(req.params.client_id, function(err, client) {
    if (err) {
      res.render(err);
    }
    res.render('client/update_client',{ client: client });
  });
  */
});

router.get('/beacons', isLoggedIn, function(req, res) {
  Beacon.find(req.params.client_id, function(err, client) {
    if (err) {
      res.render(err);
    }
    res.render('client/update_client',{ client: client });
  });
});

// CREATE
// POST /clients
router.post('/', isLoggedIn, function(req,res) {
  var new_client = new Client();
  new_client.name = req.body.name;
  new_client.uuid = req.body.uuid;
  new_client.save(function(err) {
    if (err) {
      console.log(err);
      res.render(err);
    } else {
      res.redirect('/clients');
    }
  });
});

// UPDATE
// PUT /clients
router.put('/:client_id', isLoggedIn, function(req,res) {
  // use our bear model to find the bear we want
  Client.findById(req.params.client_id, function(err, client) {
    if (err) {
      res.render(err);
    }
    client.name = req.body.name;
    client.uuid = req.body.uuid;
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
router.delete('/:client_id', isLoggedIn, function(req, res){
  Client.findOne({ _id:req.params.client_id }, function (err, client) {
    if (err) {
      res.render(err);
    } else {
      client.remove(function(err) {
        if (err) {
          res.render(err);
        } else {
          res.redirect('/clients');
        }
      });
    }
  });
});

module.exports = router;
