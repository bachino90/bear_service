//===============================//
//====== Client Controller ======//
//===============================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();

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

// SHOW ALL
// GET /clients
router.get('/', isLoggedIn, function(req, res) {
  res.render('request/request_testing');
});

module.exports = router;