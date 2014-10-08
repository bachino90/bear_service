//===============================//
//======= Store Controller ======//
//===============================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Store          = require('../models/beacon').Store;
var Area           = require('../models/beacon').Area;
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

// GET /clients/:client_id/stores/:store_id/areas
// Get all area for store_id
router.get('/', isLoggedIn, function(req,res) {
  Store.findById(store_id).populate('areas').exec(function(err,store) {
    if (err) {
      res.render(err);
    }
    res.render('skeleton/areas',{ store: store });
  });
});

// GET /clients/:client_id/stores/:store_id/areas/:area_id
// Get area_id
router.get('/:area_id', isLoggedIn, function(req,res) {
  Area.findById(req.params.area_id).populate('store').exec(function(err,area) {
    if (err) {
      res.render(err);
    }
    var store = area.store;
    res.render('skeleton/update_area',{ area: area, store: store });
  });
});

// POST /clients/:client_id/stores/:store_id/areas
// Create area for store_id
router.post('/', isLoggedIn, function(req,res) {

  Store.findById(store_id, function(err, store) {
    var area = new Area();
    area.area_name = req.body.area_name;
    area.minor_id = req.body.minor_id;
    area.major_id = store.major_id;
    area.uuid = store.uuid;
    area.store = store._id;
    area.save(function(err) {
      if (err) {
        res.render(err);
      }
      else {
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
      }
    });
  });
});

// PUT /clients/:client_id/stores/:store_id/areas/:area_id
// Update area for store_id
router.put('/:area_id', isLoggedIn, function(req,res) {
  Area.findById(req.params.area_id, function(err,area) {
    area.area_name = req.body.area_name;
    area.description = req.body.description;
    area.position.x = req.body.x;
    area.position.y = req.body.y;
    area.position.z = req.body.z;
    area.save(function (err) {
      if (err) {
        res.render(err);
      }
      else res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
    });
  });
});

// DELETE /clients/:client_id/stores/:store_id/areas/:area_id
// Delete area with area_id in store_id
router.delete('/:area_id', isLoggedIn, function(req,res) {
  Area.findOne({ _id:req.params.area_id }, function (err, area) {
    if (err) {
      res.render(err);
    } else {
      area.remove(function(err) {
        if (err) {
          res.render(err);
        } else {
          res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
        }
      });
    }
  });
});

module.exports = router;
