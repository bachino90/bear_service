$(function() {

});

$(document).ready(function() {
  //$('#newBeaconForm').validator()

  $('#addBeaconButton').click(function (){
    $('#beacons').append("<div class='beacon'><input type='text' placeholder='FULL ID' name='full_uuid' required><input type='text' placeholder='RSSI' name='rssi' required></div></br>");
  });
});
