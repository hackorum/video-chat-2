const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
console.log("helloo");

const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: { user: "neilsabde2008@gmail.com", pass: "xfzclqmgxdcbikdn" },
  secure: true,
});

app.post("/send-mail", (req, res) => {
  const to = req.body.to;
  const url = req.body.url;
  const maildata = {
    from: "neilsabde2008@gmail.com",
    to: to,
    subject: "Join this chat",
    html: `
    <p>hello pls join this meeting it is very important</p>
    <p>click the link below to join fast</p>
    <p>${url}</p>
    `,
  };
  transporter.sendMail(maildata, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).send({
      message: "Invitation sent pls check fast",
      message_id: info.messageId,
    });
  });
});

app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, uid, username) => {
    socket.join(roomId);
    io.to(roomId).emit("user-connected", uid);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, username);
    });
  });
});

server.listen(process.env.PORT || 8080);
