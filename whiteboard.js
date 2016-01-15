'use strict';

var videoElement = document.querySelector("#video");
var captureButton = document.querySelector("#capture");
var constraints = window.constraints = {
  audio: false,
  video: true
};
var errorElement = document.querySelector("#errorMessage");
var videoPlaying = false;

navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

navigator.getMedia(constraints,
                   function(stream) {
                     var videoTracks = stream.getVideoTracks();
                     console.log("Got stream with constraints: ", constraints);
                     console.log("Using video device: " + videoTracks[0].label);
                     stream.onended = function() {
                       console.log("Stream ended");
                     };
                     window.stream = stream;
                     var url = window.URL || window.webkitURL;
                     videoElement.src = url.createObjectURL(stream);
                     console.log("videoElement: " + videoElement);
                     //videoElement.srcObject = stream;
                     videoElement.play();
                     videoPlaying = true;
                   },
                   function(error) {
                     if (error.name === "ConstraintNotSatisfiedError") {
                       errorMessage("The resolution " + constraints.video.width.exact + "x" + constraints.video.height.exact + "px is not supported by your device.");
                     } else if (error.name === "PermissionDeniedError") {
                       errorMessage("Permissions have not been granted to use your camera. You need to allow the page access to your device in order for it to work.");
                     }
                     errorMessage("getUserMedia error: " + error.name, error);
                     videoPlaying = false;
                   });

function errorMessage(message, error) {
  errorElement.innerHTML += "<p>" + message + "</p>";
  if (typeof error !== "undefined") {
    console.error(error);
  }
};

captureButton.addEventListener("click", function() {
  if (videoPlaying) {
    var canvas = document.querySelector("#canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    var imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/webp");
    document.querySelector("#picture").setAttribute("src", data);
  }
}, false);
