/*
 Based on example by Tom Igoe included in Arduino IDE
 at File -> Examples -> Stepper -> stepper_oneRevolution

 Modified to suit pinouts of Freetronics HBridge Shield
*/

#include <Stepper.h>
#include <aREST.h>
#include <avr/wdt.h>

const int stepsPerRevolution = 200;  // change this to fit the number of steps per revolution
                                     // for your motor

const int enableA = 6;
const int enableB = 5;

// initialize the stepper library using the default pins on the HBridge Shield:
Stepper stepper(stepsPerRevolution, 4, 7, 3, 2);

// Create aREST instance
aREST rest = aREST();

void setup(void) {

  // initialize the serial port:
  Serial.begin(9600);

  // set up the enable pins:
  pinMode(enableA, OUTPUT);
  pinMode(enableB, OUTPUT);
  // set the speed at 300 rpm:
  stepper.setSpeed(300);
  
  // Functions to be exposed
  rest.function("step",stepmotor);
  
  // Start watchdog
  wdt_enable(WDTO_4S);
}

void loop() {
  //Serial.println("Start Loop");
  // Handle REST calls
  rest.handle(Serial);  
  //Serial.println("End Loop");
  wdt_reset();

}

int stepmotor(String command) {

  // Get number of steps
  int steps = command.toInt();
  digitalWrite(enableA, HIGH);
  digitalWrite(enableB, HIGH);
  stepper.step(steps);
  digitalWrite(enableA, LOW);
  digitalWrite(enableB, LOW);

  return steps;
}
  
