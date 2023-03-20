const forwardBtn = document.getElementById('forwardBtn');
const backwardBtn = document.getElementById('backwardBtn');
const stopBtn = document.getElementById('stopBtn');
const rightBtn = document.getElementById('right-button');
const leftBtn = document.getElementById('left-button');
const angleRange = document.getElementById('angleRange');
const angleNumber = document.getElementById('angleNumber');
const setSpeedBtn = document.getElementById('setSpeedBtn');
const slider = document.getElementById("slider");
const speedRange = document.getElementById('speed-range');
const speedOutput = document.getElementById('speed-output');
let ledButton = document.getElementById('led-button');
let ledState = false;

const ESP8266_IP = '192.168.1.128'; // Cambiar por la dirección IP de tu ESP8266

function sendRequest(path) {
    fetch(`https://${ESP8266_IP}/${path}`)
      .then(response => {
        if (response.status === 200) {
          console.log(`Request successful: ${path}`);
        } else {
          console.error(`Error sending request: ${response.status}`);
        }
      })
      .catch(err => console.error(`Error sending request: ${err}`));
  }

function sendMotorSpeedRequest(speed) {
  const percent = Math.round(speed / 100 * 255);
  sendRequest(`speed?percent=${percent}`);
  speedOutput.innerHTML = `${speed}%`;
}

// slider.addEventListener("input", () => {
//   sendMotorSpeedRequest(slider.value);
// });

speedRange.addEventListener('input', () => {
  speedOutput.innerHTML = `${speedRange.value}%`;
});

setSpeedBtn.addEventListener('click', () => {
  sendMotorSpeedRequest(speedRange.value);
});

forwardBtn.addEventListener('click', () => {
  sendRequest('/forward');
  console.log("Forward button clicked");
});

backwardBtn.addEventListener('click', () => {
  sendRequest('/backward');
  console.log("Backward button clicked");
});

rightBtn.addEventListener('click', () => {
  sendRequest('/right');
  console.log("/right button clicked");
});

leftBtn.addEventListener('click', () => {
  sendRequest('/left');
  console.log("/left button clicked");
});

stopBtn.addEventListener('click', () => {
  sendRequest('/stop');
  console.log("Stop button clicked");
});

sendRequest(`speed?percent=${angleRange.value}`);

angleRange.addEventListener('input', () => {
  angleNumber.value = angleRange.value;
  sendRequest(`speed?percent=${angleRange.value}`);
});

angleNumber.addEventListener('input', () => {
  angleRange.value = angleNumber.value;
  sendRequest(`speed?percent=${angleRange.value}`);
});

setSpeedBtn.addEventListener('click', () => {
  sendRequest(`servo?angle=${angleRange.value}`);
});

ledButton.addEventListener('click', function () {
  if (ledState) {
    // off LED
    sendRequest('ledOff');
    ledState = false;
    console.log('Led off');
    ledButton.innerHTML = 'LED off';
    ledButton.style.backgroundColor = '#0ef6fa';
  } else {
    // on LED
    sendRequest('ledOn');
    ledState = true;
    console.log('LED on');
    ledButton.innerHTML = 'LED on';
    ledButton.style.backgroundColor = 'red';
  }
});
