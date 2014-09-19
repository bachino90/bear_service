//===============================//
//======= Store Controller ======//
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


// GET /clients/:client_id/stores
// Get all store for client_id
router.get('/',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id).populate('stores').exec(function(err,client) {
    if (err) {
      res.render(err);
    }
    res.render('store/stores',{ client: client });
  });
});

// POST /clients/:client_id/stores
// Create store for client_id
router.post('/',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    var store = new Store();
    store.store_name = req.body.store_name;
    store.major_id = req.body.major_id;
    store.client = client._id;
    store.save(function (err) {
      if (err) {
        res.render(err);
      }
      else res.redirect('/clients/'+req.params.client_id+'/stores');
    });
  });
});

// PUT /clients/:client_id/stores/:store_id
// Create store for client_id
router.put('/:store_id',isLoggedIn,function(req,res) {
  Store.findById(req.params.store_id, function(err,store) {
    store.store_name = req.body.store_name;
    store.major_id = req.body.major_id;
    store.location.latitude = req.body.latitude;
    store.location.longitude = req.body.longitude;
    store.save(function (err) {
      if (err) {
        res.render(err);
      }
      else res.redirect('/clients/'+req.params.client_id+'/stores');
    });
  });
});

// DELETE /clients/:client_id/stores/:store_id
// Delete store with store_id in client_id
router.delete('/:store_id',isLoggedIn,function(req,res) {
  Store.remove({ _id: req.params.store_id }, function (err, storeId) {
    if (err) {
      res.render(err);
    }
    res.redirect('/clients/'+req.params.client_id+'/stores');
  });
  /*
  BeaconClient.findById(req.params.client_id, function(err,client) {
    client.stores.id(req.params.store_id).remove();
    client.save(function (err) {
      if (err) console.log('Error: '+err);
      else res.redirect('/clients/'+req.params.client_id);
    });
  });
  */
});

module.exports = router;
