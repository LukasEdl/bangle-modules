let onNewExerciseCallback;
let rawInput = '';

function utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }

  return out;
}

function onNewExercise(callback) {
  onNewExerciseCallback = callback;
}

function setupBluetooth() {
  // declare the services
  NRF.setServices({
    0x2A1F: {
      0x2A1C: {
        writable: true,
        broadcast: true,
        value: new Int32Array([0, 0, 0]).buffer,
        //notify: true,
        onWrite: function (evt) {
          const inputString = utf8ArrayToStr(evt.data);

          if (inputString !== '\n\n') {
            rawInput += inputString;

          } else {
            console.log(`setupBluetooth`)
            if (onNewExerciseCallback) {
              console.log(`callbacks found`)
              onNewExerciseCallback(rawInput)
            }
            rawInput = '';
          }
        }
      },
      0x2A1D: {
        readable: true,
        value: '            ',
        notify: true,
      },
    },
  });
}

function writeToService(message) {
  console.log(`sending message to bangle: ${message}`);
  try {
    E.showMessage('Start sending message ' + message);
     NRF.updateServices({
      0x2A1F: {
        0x2A1D: {
          value: message,
        }
      }
    })
    E.showMessage('Sent message ' + message);
  } catch (e) {
    E.showMessage(e.toString());
  }
}

function sendBluetoothMessage(message) {
  let stepSize = 12;
  for (let i = 0; i < message.length + 1; i += stepSize) {
    writeToService(message.substring(i, i + stepSize));
  }
  writeToService('\n\n');
}

function sendSetComplete(set) {
  sendBluetoothMessage('set#' + set.reps + '#' + set.value);
}


module.exports = {
  setupBluetooth: setupBluetooth,
  onNewExercise: onNewExercise,
  sendSetComplete: sendSetComplete,
};
