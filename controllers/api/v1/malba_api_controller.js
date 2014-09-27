//========================================//
//======== Beacon API  Controller ========//
//========================================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Beacon         = require('../../../models/beacon').Beacon;
var Client         = require('../../../models/beacon').Client;
var BeaconRequest  = require('../../../models/beacon').BeaconRequest;


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

// SHOW ONE
// GET /api/v1/:client_id
router.get('/:_id', isLoggedIn, function(req, res) {
  Beacon.findById(req.params._id).populate('area').exec(function(err, beacon){
    if (err) {
      res.json(err);
    } else {
      var options = {
        path: 'area.store',
        model: 'Store'
      };
      Beacon.populate(beacon, options, function (err, beacon) {
        res.json(beacon);
      });
    }
  });
});

router.post('/', isLoggedIn, function(req, res) {

  Beacon.find({ full_id:req.body.full_id }).populate('content').exec(function(err, beacons){
    if (err) {
      res.json(err);
    } else {
      var new_request = new BeaconRequest();
      new_request.device_os = req.body.device_os;
      new_request.device_uuid = req.body.device_uuid;
      new_request.client = beacons[0].client;
      new_request.beacons = beacons;
      new_request.beacons_rssi = req.body.beacons_rssi;
      //new_request.beacon_user =
      res.json(beacons[0].content);
    }
  });
});

module.exports = router;
