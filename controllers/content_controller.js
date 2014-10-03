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
var BeaconContent  = require('../models/beacon').BeaconContent;
var store_id;
var client_id;
var area_id;

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
  area_id = baseUrl[6];
  return next();
}

// GET /clients/:client_id/stores/:store_id/areas/:area_id/content
// Get all area for store_id
router.get('/', isLoggedIn, function(req,res) {
  Beacon.find({ 'area' = area_id }).populate('area').exec(function(err,beacon) {
    if (err) {
      res.render(err);
    }
    res.render('content/content',{ beacon: beacon });
  });
});

// PUT /clients/:client_id/stores/:store_id/areas/:area_id/content
// Update area for store_id
router.put('/', isLoggedIn, function(req,res) {
  Beacon.find({ 'area' = area_id }, function(err,beacon) {
    if (err) {
      res.render(err);
    } else {
      beacon.content.web_url = req.body.web_url;
      beacon.content.image_url = req.body.image_url;
      beacon.content.video_url = req.body.video_url;
      beacon.content.audio_url = req.body.audio_url;
      beacon.content.audio_streaming_url = req.body.audio_streaming_url;
      beacon.content.video_streaming_url = req.body.video_streaming_url;
      beacon.content.info_text = req.body.info_text;
      beacon.content.save(function(err){
        if (err) {
          res.render(err);
        } else {
          res.redirect('/clients/'+client_id+'/stores/'+store_id+'/areas/'+area_id+'/content');
        }
      });
    }
  });
});

module.exports = router;
