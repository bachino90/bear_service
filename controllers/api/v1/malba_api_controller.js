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
  console.log('Raw text:');
  console.log(req.body);
  var data = JSON.parse(req.body.data)
  console.log('JSON data:');
  console.log(data);
  Beacon.find({ 'full_uuid':{ $in:data.uuids } }).populate('content').exec(function(err, beacons){
    if (err) {
      res.json(err);
    } else {
      console.log('Beacons encontrados');
      console.log(beacons);
      var content = new Array();
      for (var i=0; i<beacons.length; i++) {
        var new_request = new BeaconRequest();
        new_request.device_os = data.device_os;
        new_request.device_uuid = data.device_uuid;
        //new_request.client = beacons[i].client;
        new_request.beacons = beacons[i]._id;
        new_request.beacons_rssi = data.beacons[data.uuids.indexOf(beacons[i].full_uuid)].rssi;
        //new_request.beacon_user =
        new_request.save();
        content[i] = beacons.content;
      }

      res.json(beacons);
    }
  });
});

module.exports = router;
