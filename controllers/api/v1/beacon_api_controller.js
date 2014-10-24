//========================================//
//======== Beacon API  Controller ========//
//========================================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Beacon         = require('../../../models/beacon').Beacon;
var Client         = require('../../../models/beacon').Client;


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
  Beacon.findById(req.params._id).populate('beacon').exec(function(err, beacon){
    if (err) {
      res.json(err);
    } else {
      var options = {
        path: 'beacon.store',
        model: 'Store'
      };
      Beacon.populate(beacon, options, function (err, beacon) {
        res.json(beacon);
      });
    }
  });
});

module.exports = router;
