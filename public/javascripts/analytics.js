

var origin_x = 30.5;
var origin_y = 30.5;
var corners_x = new Array();
var corners_y = new Array();
var beacons = [];
var os_requests = [];

function drawGrid() {
  var c = $('#analytics-layout');
  var ct = c.get(0).getContext('2d');
  var container = $(c).parent();
  c.attr('width', $(container).width()); //max width
  c.attr('height', $(container).height()); //max height

  var canvas = document.getElementById("analytics-layout");
  var context = canvas.getContext("2d");
  var origin_x = 0.0;
  var origin_y = 30.0;
  var scale = 50.0;
  var delta = 30.5;
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;

  var max = Math.max(canvasWidth, canvasHeight);
  var numberOfRules = parseInt(max/scale) + 1;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.beginPath();
  context.lineWidth=0.2;

  for (var i=1;i<=numberOfRules;i++) {
    context.moveTo(delta,0);
    context.lineTo(delta, canvasHeight);

    context.moveTo(0,delta);
    context.lineTo(canvasWidth, delta);

    delta += scale;
  }
  context.stroke();
}

function drawScale(scale) {
  if (scale > 0) {
    var canvas = document.getElementById('analytics-layout');
    var context = canvas.getContext('2d');

    context.beginPath();
    context.lineWidth="1.0";
    context.strokeStyle="black";
    context.rect(30.5,3.5,50.0,10.0);
    context.stroke();

    context.beginPath();
    context.lineWidth="1.0";
    context.strokeStyle="black";
    context.rect(80.5,3.5,50.0,10.0);
    context.stroke();
    context.fillStyle="black";
    context.fill();

    context.beginPath();
    context.font="10px Verdana";
    context.fillStyle="black";
    context.fillText("0",27.5,28.0);
    var first = parseInt(50.0/scale);
    context.fillText(first.toString(),74.5,28.0);
    var second = parseInt(100.0/scale);
    context.fillText(second.toString()+"m",124.5,28.0);
  }
}

function drawBeacons(scale) {
  if (scale>0 && beacons) {
    var canvas = document.getElementById("analytics-layout");
    var context = canvas.getContext("2d");
    var centerX;
    var centerY;

    for (var beacon_id in beacons) {
      var beacon = beacons[beacon_id];
      context.beginPath();
      centerX = origin_x + beacon.position.x * scale;
      centerY = origin_y + beacon.position.y * scale;
      context.arc(centerX, centerY, 5.0, 0, 2 * Math.PI, false);
      context.fillStyle = 'black';
      context.fill();
      context.closePath();
    }
    getAnalytics(scale);
  }
}

function drawLayout() {
  var canvas = document.getElementById("analytics-layout");
  var context = canvas.getContext("2d");

  drawGrid();

  if (corners_x && corners_y) {
    var maxX = Math.max.apply(null, corners_x);
    var maxY = Math.max.apply(null, corners_y);
    var scale;

    if (maxY > maxX) {
      scale = canvas.height/(2*origin_y + maxY);
      origin_x = (canvas.width - (maxX * scale))/2.0;
      origin_y = (canvas.height - (maxY * scale))/2.0;
    } else if (maxY < maxX) {
      scale = canvas.width/(2*origin_x + maxX);
      origin_x = (canvas.width - (maxX * scale))/2.0;
      origin_y = (canvas.height - (maxY * scale))/2.0;
    } else {
      if (canvas.height > canvas.width) {
        scale = canvas.width/(2*origin_x + maxX);
        origin_x = (canvas.width - (maxX * scale))/2.0;
        origin_y = (canvas.height - (maxY * scale))/2.0;
      } else {
        scale = canvas.height/(2*origin_y + maxY);
        origin_x = (canvas.width - (maxX * scale))/2.0;
        origin_y = (canvas.height - (maxY * scale))/2.0;
      }
    }

    context.beginPath();
    context.lineWidth=2;
    context.moveTo(origin_x + corners_x[0], origin_y + corners_y[0]);

    for (var i=1;i<corners_x.length;i++) {
      var x = origin_x + corners_x[i] * scale;
      var y = origin_y + corners_y[i] * scale;
      context.lineTo(x, y);
    }
    context.stroke();

    drawScale(scale);
    drawBeacons(scale);
  }
}

//======================================================================================================//

function processLayout(data) {
  if (data) {
    for (var i = 0; i < data.layout.length; i++) {
      corners_x[i] = data.layout[i].x;
      corners_y[i] = data.layout[i].y;
    }
    for (var i = 0; i < data.beacons.length; i++) {
      beacons[data.beacons[i]._id] = data.beacons[i];
      beacons[data.beacons[i]._id].requests = [];
    }
    drawLayout();
  }
}

function getLayout() {
  var url = $('input#layoutURL').val();
  $.ajax({
    url: url,
    type: 'GET',
    success: function(data) {
      processLayout(data);
    }
  });
}

//======================================================================================================//

function drawHeatMap(scale) {
  // create instance
  var heatmapInstance = h337.create({
    container: document.querySelector('.heatmap'),
    radius: 15,
    blur: 0.85,
    opacity: 0.45
  });
  for (var beacon_id in beacons) {
    var beacon = beacons[beacon_id];
    // a single datapoint
    var dataPoint = {
      x: origin_x + beacon.position.x * scale, // x coordinate of the datapoint, a number
      y: origin_y + beacon.position.y * scale - 0.5, // y coordinate of the datapoint, a number
      value: beacon.requests.length // the value at datapoint(x, y)
    };
    if (dataPoint.value > 0) {
      heatmapInstance.addData(dataPoint);
    }
  }
  /*
  document.querySelector('.heatmap').onmousemove = function(ev) {
    heatmapInstance.addData({
      x: ev.layerX,
      y: ev.layerY,
      value: 1
    });
  }
  */
}

function drawOSDoughnutChart(labels, points) {
  var doughnutChartData = [
    {
        value: os_requests['IOS'].length,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "iOS"
    },
    {
        value: os_requests['IOS'].length,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Android"
    },
    {
        value: os_requests['IOS'].length,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Window Phone"
    }
]

  // Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#osDoughnutChart").get(0).getContext("2d");
  // This will get the first returned node in the jQuery collection.
  var myNewChart = new Chart(ctx).Doughnut(doughnutChartData, {
      responsive: true
  });
}

function drawBeaconRadarChart(labels, points) {
  var radarChartData = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: points
      }
    ]
  };
  // Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#beaconRadarChart").get(0).getContext("2d");
  // This will get the first returned node in the jQuery collection.
  var myNewChart = new Chart(ctx).Radar(radarChartData, {
      responsive: true
  });
}

function processHeatMapData(data, scale) {
  var labels = [];
  var points = [];
  for (var i = 0; i < data.length; i++) {
    beacons[data[i].beacon].requests.push(data[i]);
    if (os_requests[data[i].device_os]) {
      os_requests[data[i].device_os].push(data[i]);
    } else {
      os_requests[data[i].device_os] = new Array();
      os_requests[data[i].device_os].push(data[i]);
    }
  }
  $("#beaconTableBody").empty();
  for (var beacon_id in beacons) {
    var beacon = beacons[beacon_id];
    var numRequests = beacon.requests.length;
    /*
    $("#beaconTableBody").append('<tr><th>'+beacon.beacon_name+
    '</th><th>'+beacon.minor_id+
    '</th><th>'+numRequests+
    '</th></tr>');
    */
    labels.push(beacon.beacon_name);
    points.push(beacon.requests.length);
  }

  drawBeaconRadarChart(labels, points);
  drawOSDoughnutChart(labels, points);

  drawHeatMap(scale);
}

function getAnalytics(scale) {
  var url = $('input#analyticsURL').val();
  $.ajax({
    url: url,
    type: 'GET',
    success: function(data) {
      processHeatMapData(data, scale);
    }
  });
}

//======================================================================================================//

$(document).ready(function() {

  getLayout();

});

$(window).resize(drawLayout);
