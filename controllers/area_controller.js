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
router.get('/:store_id',isLoggedIn,function(req,res) {
  Store.findById(store_id, function(err,store) {
    if (err) {
      res.render(err);
    }
    var area = store.areas.id(req.params.area_id);
    console.log(area);
    res.render('area/update_area',{ area: area });
  });
});

// POST /clients/:client_id/stores/:store_id/areas
// Create area for store_id
router.post('/',isLoggedIn,function(req,res) {
  Store.findOne({"_id":store_id, 'areas.minor_id': req.body.minor_id}, function(err, store) {
    if (err) {
      console.log(err);
      res.render(err);
    }
    if (store) {
      console.log('YA existe esa area');
      res.render(err);
    } else {
      Store.findById(store_id, function(err,store) {
        if (err) {
          console.log(err);
          res.render(err);
        } else {
          store.areas.push({ area_name: req.body.area_name,
                             minor_id: req.body.minor_id });
          store.save(function (err) {
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
router.put('/:area_id',isLoggedIn,function(req,res) {
  Store.findById(store_id, function(err,store) {
    var area = store.areas.id(req.params.area_id);
    area.area_name = req.body.area_name;
    area.minor_id = req.body.minor_id;
    area.description = req.body.description;
    store.save(function (err) {
      if (err) {
        res.render(err);
      }
      else res.redirect('/clients/'+client_id+'/stores'+store_id+'/areas');
    });
  });
});

// DELETE /clients/:client_id/stores/:store_id/areas/:area_id
// Delete area with area_id in store_id
router.delete('/:area_id',isLoggedIn,function(req,res) {
  Store.findById(store_id, function(err,store) {
    store.areas.id(req.params.area_id).remove();
    store.save(function (err) {
      if (err) console.log('Error: '+err);
      res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas');
    });
  });
});


module.exports = router;
