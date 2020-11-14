
main();

async function main() {
  // await init();
  // Get the initial set of cameras connected

  const videoCameras = await getConnectedDevices('videoinput');
  console.log('Cameras found:', videoCameras);

  updateCameraList(videoCameras);

  // Listen for changes to media devices and update the list accordingly
  navigator.mediaDevices.addEventListener('devicechange', event => {
    const newCameraList = getConnectedDevices('video');
    updateCameraList(newCameraList);
  });

  if (videoCameras && videoCameras.length > 0) {
    console.log("open video");
    // Open first available video camera with a resolution of 1280x720 pixels
    const stream = await openCamera(videoCameras[0].deviceId, 640, 480);
    const videoElement = document.querySelector('video#localVideo');
    videoElement.srcObject = stream;
    console.log(stream);
  }
}

async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 'video': true, 'audio': true });
    // console.log('Got MediaStream:', stream);
    console.log(stream);
    // const videoElement = document.querySelector('video#localVideo');
    // videoElement.srcObject = stream;
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
}

async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === type)
}


// Updates the select element with the provided set of cameras
function updateCameraList(cameras) {
  const listElement = document.querySelector('select#availableCameras');
  listElement.innerHTML = '';
  cameras.map(camera => {
    const cameraOption = document.createElement('option');
    cameraOption.label = camera.label;
    cameraOption.value = camera.deviceId;
    return cameraOption;
  }).forEach(cameraOption => {
    // listElement.add(cameraOption)
    listElement.appendChild(cameraOption)
    // console.log(cameraOption);
  });
}

// Fetch an array of devices of a certain type
async function getConnectedDevices(type) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === type)
}


async function openCamera(cameraId, minWidth, minHeight) {
  const constraints = {
    'audio': { 'echoCancellation': true },
    'video': {
      'deviceId': cameraId,
      'width': { 'min': minWidth },
      'height': { 'min': minHeight }
    }
  }

  return await navigator.mediaDevices.getUserMedia(constraints);
}


async function playVideoFromCamera() {
  try {
    const constraints = { 'video': true, 'audio': true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoElement = document.querySelector('video#localVideo');
    videoElement.srcObject = stream;
  } catch (error) {
    console.error('Error opening video camera.', error);
  }
}
