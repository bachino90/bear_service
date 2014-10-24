//========================================//
//======== Beacon API  Controller ========//
//========================================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Beacon           = require('../../../models/beacon').Beacon;
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

});

router.post('/', isLoggedIn, function(req, res) {
  console.log('Raw text:');
  console.log(req.body);
  var data = JSON.parse(req.body.data);
  console.log('JSON data:');
  console.log(data);
  Beacon.find({ 'full_uuid':{ $in:data.uuids } }, function(err, beacons){
    if (err) {
      res.json(err);
    } else if (beacons.length == 0) {
      err = new Object();
      err.status = 404;
      err.message = 'Beacon Not Found';
      res.json(err);
    } else {
      console.log('Beacons encontrados');
      console.log(beacons);
      var content = new Array();
      var date = new Date();
      for (var i=0; i<beacons.length; i++) {
        var new_request = new BeaconRequest();
        new_request.device_os = data.device_os;
        new_request.device_uuid = data.device_uuid;
        new_request.date = date;
        new_request.beacon = beacons[i]._id;
        new_request.client = beacons[i].client;
        new_request.store = beacons[i].store;
        new_request.rssi = data.beacons[data.uuids.indexOf(beacons[i].full_uuid)].rssi;
        //new_request.beacon_user =
        if (data.test) {
          new_request.test = data.test;
        }
        new_request.save();
        console.log(new_request);
        content[i] = beacons[i].content;
      }

      res.json(content);
    }
  });
});

module.exports = router;
