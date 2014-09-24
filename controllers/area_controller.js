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


function checkAreaUniqueness(req, res, next) {
  Store.findOne({"_id":store_id, 'areas.minor_id': req.body.minor_id}, function(err, store) {
    if (err) {
      console.log(err);
      res.render(err);
    }
    if (store) {
      console.log('YA existe esa area');
      res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
    } else {
      next();
    }
  });
}


// GET /clients/:client_id/stores/:store_id/areas
// Get all area for store_id
router.get('/',isLoggedIn,function(req,res) {
  Store.findById(store_id, function(err,store) {
    if (err) {
      res.render(err);
    }
    res.render('area/areas',{ store: store });
  });
});

// GET /clients/:client_id/stores/:store_id/areas/:area_id
// Get area_id
router.get('/:area_id',isLoggedIn,function(req,res) {
  Store.findById(store_id).populate('store').exec(function(err,store) {
    if (err) {
      res.render(err);
    }
    var area = store.areas.id(req.params.area_id);
    res.render('area/update_area',{ area: area, store: store });
  });
});

// POST /clients/:client_id/stores/:store_id/areas
// Create area for store_id
router.post('/', isLoggedIn, checkAreaUniqueness, function(req,res) {
  /*
  Store.findById(store_id, function(err, store) {
    var area = new Area();
    area.area_name = req.body.area_name;
    area.minor_id = req.body.minor_id;
    area.major_id = store.major_id;
    area.uuid = store.uuid;
    area.store = store.id;
    area.save(function(err) {
      if (err) {
        res.render(err);
      }
      else {



        res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
      }
    });
  });
  */
  Store.findById(store_id, function(err,store) {
    if (err) {
      console.log(err);
      res.render(err);
    } else {
      var area = store.areas.push({ area_name: req.body.area_name,
                                     minor_id: req.body.minor_id });
      store.save(function (err) {
        if (err) {
          res.render(err);
        } else {
          var beacon = new Beacon();
          beacon.uuid = store.uuid;
          beacon.store.major_id = store.major_id;
          beacon.store.store_name = store.store_name;
          beacon.store.location.latitude = store.location.latitude;
          beacon.store.location.longitude = store.location.longitude;
          beacon.area.minor_id = req.body.minor_id;
          beacon.area.area_name = req.body.area_name;
          beacon.client = store.client;
          beacon.save (function (err) {
            if (err) {
              res.render(err);
            } else {
              res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
            }
          });
        }
      });
    }
  });
});

// PUT /clients/:client_id/stores/:store_id/areas/:area_id
// Update area for store_id
router.put('/:area_id', isLoggedIn, checkAreaUniqueness, function(req,res) {
  Store.findById(store_id, function(err,store) {
    var area = store.areas.id(req.params.area_id);
    area.area_name = req.body.area_name;
    area.description = req.body.description;
    store.save(function (err) {
      if (err) {
        res.render(err);
      }
      else res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
    });
  });
});

// DELETE /clients/:client_id/stores/:store_id/areas/:area_id
// Delete area with area_id in store_id
router.delete('/:area_id',isLoggedIn,function(req,res) {
  /*
  Area.remove({ _id: req.params.area_id }, function (err, area_id) {
    if (err) {
      res.render(err);
    }
    res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
  });
  */
  Store.findById(store_id, function(err,store) {
    store.areas.id(req.params.area_id).remove();
    store.save(function (err) {
      if (err) console.log('Error: '+err);
      res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
    });
  });
});


module.exports = router;
