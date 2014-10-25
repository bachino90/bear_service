//===============================//
//======= Store Controller ======//
//===============================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Store          = require('../models/beacon').Store;
var Beacon         = require('../models/beacon').Beacon;
var Client         = require('../models/beacon').Client;
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

function redirectWithErrors(req, res, is_new, err) {
  //
  // is_new = 1   Add Store
  // is_new = 2   Edit Store
  // is_new = 3   Layout Store
  // is_new = 4   Delete Store
  //
  var errors = new Array();
  for (var name in err.errors) {
    errors.push(err.errors[name]);
  }
  req.flash('is_new',is_new);
  req.flash('errors',errors);
  res.redirect(req.originalUrl);
}

// GET /clients/:client_id/stores
// Get all store for client_id
router.get('/', isLoggedIn, function(req,res) {
  Client.findById(client_id).populate('stores').exec(function(err,client) {
    if (err) {
      console.log(err);
      res.render('skeleton/error');
    } else if (!client) {
      res.render('skeleton/error');
    } else {
      res.render('skeleton/stores',{ client: client,
                             new_store_name: req.flash('new_store_name'),
                         new_store_major_id: req.flash('new_store_major_id'),
                                     is_new: req.flash('is_new'),
                                     errors: req.flash('errors') });
    }
  });
});

// GET /clients/:client_id/stores/:store_id
// Get store_id
router.get('/:store_id', isLoggedIn, function(req,res) {
  res.redirect(req.originalUrl+'/beacons');
});

// GET /clients/:client_id/stores/:store_id/layout
// Get store_id
router.get('/:store_id/analytics', isLoggedIn, function(req,res) {
  Store.findById(req.params.store_id, function(err,store) {
    if (err) {
      res.render(err);
    }
    res.render('skeleton/analytics',{ store: store });
  });
});

// GET /clients/:client_id/stores/:store_id/layout
// Get store_id
router.get('/:store_id/layout', isLoggedIn, function(req,res) {
  Store.findById(req.params.store_id).select('layout beacons').exec(function(err,store) {
    if (err) {
      res.json(err);
    }
    Beacon.find({ _id: { $in:store.beacons } }, 'position beacon_name minor_id').exec(function(err, beacons){
      var st = new Object();
      st.layout = store.layout;
      st.beacons = beacons;
      res.json(st);
    });
    //res.json(store.layout);
  });
});

// POST /clients/:client_id/stores
// Create store for client_id
router.post('/', isLoggedIn, function(req,res) {
  Client.findById(client_id, function(err,client) {
    if (err) {
      redirectWithErrors(req, res, 1, err);
    }
    var store = new Store();
    store.store_name = req.body.store_name;
    store.major_id = req.body.major_id;
    store.uuid = client.uuid;
    store.client = client._id;
    store.save(function (err) {
      if (err) {
        req.flash('new_store_name',req.body.store_name);
        req.flash('new_store_major_id',req.body.major_id);
        redirectWithErrors(req, res, 1, err);
      }
      else res.redirect('/clients/'+client_id+'/stores');
    });
  });
});

// PUT /clients/:client_id/stores/:store_id
// Create store for client_id
router.put('/:store_id', isLoggedIn, function(req,res) {
  Store.findById(req.params.store_id, function(err,store) {
    store.store_name = req.body.store_name;
    store.location.latitude = req.body.latitude;
    store.location.longitude = req.body.longitude;
    store.save(function (err) {
      if (err) {
        console.log(err);
        redirectWithErrors(req, res, 2, err);
      }
      else res.redirect('/clients/'+client_id+'/stores/'+req.params.store_id+'/beacons');
    });
  });
});

// PUT /clients/:client_id/stores/:store_id/layout
// Update store_id layout
router.put('/:store_id/layout', isLoggedIn, function(req,res) {
  console.log('update layout');
  Store.findById(req.params.store_id, function(err,store) {
    if (err) {
      res.json(err);
    }
    console.log('LAYOUT raw text');
    console.log(req.body);
    var layout = JSON.parse(req.body.layout);
    console.log('LAYOUT json');
    console.log(layout);
    store.layout = layout;
    store.save(function (err){
      if (err) {
        res.json(err);
      }
      res.json(store.layout);
    })
  });
});


// DELETE /clients/:client_id/stores/:store_id
// Delete store with store_id in client_id
router.delete('/:store_id', isLoggedIn, function(req,res) {
  Store.findOne({ _id:req.params.store_id }, function (err, store) {
    if (err) {
      res.redirect('/clients/'+client_id+'/stores?new=3&err=0');
    } else {
      store.remove(function(err) {
        if (err) {
          res.redirect('/clients/'+client_id+'/stores?new=3&err=0');
        } else {
          res.redirect('/clients/'+client_id+'/stores');
        }
      });
    }
  });
});

module.exports = router;
