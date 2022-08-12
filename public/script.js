const socket = io("/");
const user = prompt("Enter username: ");
const video_element = document.createElement("video");
video_element.muted = true;
let my_stream;
function connectToNewUser(uid, stream) {
  const call = peer.call(uid, stream);
  const new_video_element = document.createElement("video");
  call.on("stream", (video_stream) => {
    addVideoStream(new_video_element, video_stream);
  });
}
navigator.mediaDevices
  .getUserMedia({ audio: true, video: true })
  .then((stream) => {
    my_stream = stream;
    addVideoStream(video_element, stream);
    socket.on("user-connected", (uid) => {
      connectToNewUser(uid, stream);
    });
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (video_stream) => {
        addVideoStream(video, video_stream);
      });
    });
  });

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    $("#video_grid").append(video);
  });
}

let peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

$(function () {
  $("#show_chat").click(function () {
    $(".left-window").css("display", "none");
    $(".right-window").css("display", "block");
    $(".header-back").css("display", "block");
  });
  $(".header-back").click(function () {
    $(".left-window").css("display", "block");
    $(".right-window").css("display", "none");
    $(".header-back").css("display", "none");
  });
  $("#send").click(function () {
    if ($("#chat_message").val().length != 0) {
      socket.emit("message", $("#chat_message").val());
      $("#chat_message").val("");
    }
  });
  $("#chat_message").keydown(function (e) {
    if (e.key == "Enter" && $("#chat_message").val().length != 0) {
      socket.emit("message", $("#chat_message").val());
      $("#chat_message").val("");
    }
  });
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user);
});
socket.on("createMessage", (message, userName) => {
  $(".messages").append(`<div class="message">
    <b><i class="far fa-user-circle"></i><span>
      ${userName === user ? "Me" : userName}
    </span></b>
    <span>${message}</span>
    </div>`);
});
