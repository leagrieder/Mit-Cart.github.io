#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <WiFiServer.h>
#include <Servo.h>

const char* ssid = "Grieder/Fragniere";
const char* password = "family1807";

WiFiClient client;
WiFiServer server(80);
Servo servo;

const int in1 = 5;   //D1
const int in2 = 2;    //D4
const int servoPin = 4; //D2
const int ledPin = 12; //D6
const int buzzerPin = 13; //D7
int isGoingBackwards = 0;

void setup() {
  Serial.begin(9600);

  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(servoPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);
  digitalWrite(servoPin, LOW);
  digitalWrite(ledPin, LOW);
  digitalWrite(buzzerPin, LOW);

  servo.attach(servoPin);
  servo.write(90);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wifi...");
  Serial.print(ssid);
  Serial.print(password);
  Serial.print("\n");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(WiFi.status());
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Wifi connected");
  Serial.println();
  Serial.println(WiFi.localIP());

  server.begin();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wifi disconnected");
    WiFi.disconnect();
    delay(1000);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.print(".");
    }
    Serial.println("");
    Serial.println("Wifi reconnected");
    server.begin();
  }

  if (client.connected()) {
    if (client.available()) {
      client.addHeader("Access-Control-Allow-Origin", "*");
      String request = client.readStringUntil('\r');
      Serial.println(request);
      client.flush();

      if (request.indexOf("/forward") != -1) {
        Serial.println("Moving forward");
        digitalWrite(in1, HIGH);
        digitalWrite(in2, LOW);
        digitalWrite(ledPin, HIGH);
      } else if (request.indexOf("/backward") != -1) {
        Serial.println("Moving backward");
        digitalWrite(in1, LOW);
        digitalWrite(in2, HIGH);
        digitalWrite(ledPin, HIGH);
        isGoingBackwards = 1;
      } else if (request.indexOf("/stop") != -1) {
        Serial.println("Stopping");
        digitalWrite(in1, LOW);
        digitalWrite(in2, LOW);
        digitalWrite(ledPin, LOW);
      } else {
        client.println("Invalid command");
      }
    }
  } else {
    client = server.available();
    isGoingBackwards = 0;
  }

  if (isGoingBackwards) {
    digitalWrite(buzzerPin, HIGH);
    delay(500);
    digitalWrite(buzzerPin, LOW);
    delay(500);
  }
}