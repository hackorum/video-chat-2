const socket = io("/");
const user = prompt("Enter username: ");

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
