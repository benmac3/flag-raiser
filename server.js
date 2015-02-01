// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ); //Web framework

//Create server
var app = express();

// Serial Port
var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/tty.usbmodem1411", {
  baudrate: 9600
});


//var serialPort = require("serialport");
//serialPort.list(function (err, ports) {
//  ports.forEach(function(port) {
//    console.log(port.comName);
//    console.log(port.pnpId);
//    console.log(port.manufacturer);
//  });
//});




// Configure server
app.configure( function() {

    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));

});

//Router

//Raise the flag
app.get( '/success', function( request, response )  {
    raiseLowerFlag(2000,5000);
    console.log('Fail Raise');
});


//Lower the flag
app.get( '/fail', function( request, response )  {
    raiseLowerFlag(1000,5000);
    console.log('Fail Raise');
});

function raiseLowerFlag(steps, delay) {

  serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
    console.log('open');
    serialPort.on('data', function(data) {
      console.log('data received: ' + data);
    });
    var up = "/step?params="+steps+"\r";
    serialPort.write(up, function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
      setTimeout(function() {
        var down = "/step?params="+(steps*-1)+"\r";
        serialPort.write(down, function(err, results) {
          console.log('err ' + err);
          console.log('results ' + results);
        });
      }, delay);
    });
  }
  });
}


//Start server
var port = 3000;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});
