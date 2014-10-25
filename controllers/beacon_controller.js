//===============================//
//======= Store Controller ======//
//===============================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Store          = require('../models/beacon').Store;
var Beacon         = require('../models/beacon').Beacon;
var BeaconClient   = require('../models/beacon').Client;
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
  var baseUrl = req.baseUrl.split("/");
  client_id = baseUrl[2];
  store_id = baseUrl[4];
  return next();
}

function redirectWithErrors(req, res, is_new, err) {
  //
  // is_new = 1   Add beacon
  // is_new = 2   Edit beacon
  // is_new = 4   Delete beacon
  //
  var errors = new Array();
  for (var name in err.errors) {
    errors.push(err.errors[name]);
  }
  req.flash('is_new',is_new);
  req.flash('errors',errors);
  console.log(req);
  res.redirect(req.originalUrl);
}

// GET /clients/:client_id/stores/:store_id/beacons
// Get all beacon for store_id
router.get('/', isLoggedIn, function(req,res) {
  Store.findById(store_id).populate('beacons').exec(function(err,store) {
    if (err) {
      res.render('skeleton/error');
    } else if (!store) {
      res.render('skeleton/error');
    } else {
      res.render('skeleton/beacons',{ store: store,
                            new_beacon_name: req.flash('new_beacon_name'),
                        new_beacon_minor_id: req.flash('new_beacon_minor_id'),
                                     is_new: req.flash('is_new'),
                                     errors: req.flash('errors') });
    }
  });
});

// GET /clients/:client_id/stores/:store_id/beacons/:beacon_id
// Get beacon_id
router.get('/:beacon_id', isLoggedIn, function(req,res) {
  Beacon.findById(req.params.beacon_id).populate('store').exec(function(err,beacon) {
    if (err) {
      res.render('skeleton/error');
    } else if (!beacon) {
      res.render('skeleton/error');
    } else {
      var store = beacon.store;
      res.render('skeleton/content',{ beacon: beacon,
                                       store: store,
                                      is_new: req.flash('is_new'),
                                      errors: req.flash('errors') });
    }
  });
});

// POST /clients/:client_id/stores/:store_id/beacons
// Create beacon for store_id
router.post('/', isLoggedIn, function(req,res) {

  Store.findById(store_id, function(err, store) {
    var beacon = new Beacon();
    beacon.beacon_name = req.body.beacon_name;
    beacon.minor_id = req.body.minor_id;
    beacon.major_id = store.major_id;
    beacon.uuid = store.uuid;
    beacon.store = store._id;
    beacon.client = store.client;
    beacon.save(function(err) {
      if (err) {
        //res.render(err);
        req.flash('new_beacon_name', req.body.beacon_name);
        req.flash('new_beacon_minor_id', req.body.minor_id);
        redirectWithErrors(req, res, 1, err);
      }
      else {
        res.redirect('/clients/'+client_id+'/stores/'+store_id+'/beacons');
        /*
        var beacon = new Beacon();
        beacon.uuid = store.uuid;
        beacon.major_id = store.major_id;
        beacon.minor_id = req.body.minor_id;
        beacon.store = store._id;
        beacon.area = area._id;
        beacon.client = store.client._id;
        beacon.save (function (err) {
          if (err) {
            res.render(err);
          } else {
            res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
          }
        });
        */
      }
    });
  });
});

// PUT /clients/:client_id/stores/:store_id/beacons/:beacon_id
// Update beacon for store_id
router.put('/:beacon_id', isLoggedIn, function(req,res) {
  Beacon.findById(req.params.beacon_id, function(err,beacon) {
    beacon.beacon_name = req.body.beacon_name;
    beacon.description = req.body.description;
    beacon.position.x = req.body.x;
    beacon.position.y = req.body.y;
    beacon.position.z = req.body.z;
    console.log(req.body);
    beacon.save(function (err) {
      if (err) {
        //res.render(err);
        console.log(err);
        redirectWithErrors(req, res, 2, err);
      }
      else res.redirect('/clients/'+client_id+'/stores/'+store_id+'/beacons');
    });
  });
});

// DELETE /clients/:client_id/stores/:store_id/beacons/:beacon_id
// Delete beacon with beacon_id in store_id
router.delete('/:beacon_id', isLoggedIn, function(req,res) {
  Beacon.findOne({ _id:req.params.beacon_id }, function (err, Beacon) {
    if (err) {
      //res.render(err);
      redirectWithErrors(req, res, 3, err);
    } else {
      Beacon.remove(function(err) {
        if (err) {
          //res.render(err);
          redirectWithErrors(req, res, 3, err);
        } else {
          res.redirect('/clients/'+client_id+'/stores/'+store_id+'/Beacons');
        }
      });
    }
  });
});

module.exports = router;
