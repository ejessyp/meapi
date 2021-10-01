const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "https://www.student.bth.se"],
        methods: ["GET", "POST"]
    }
});

io.on('connection', function (socket) {
    console.log("User connected");
    socket.on('create', function (room) {
        socket.join(room);
        console.log(room);
        //io.emit('chat message', message);
    });
    // Server
    socket.on("doc", function (data) {
        //  the server send out to all other clients
        socket.to(data["_id"]).emit("doc", data.html);
        // console.log(data);
    });
});


const auth = require("./routes/auth.js");
const data = require("./routes/data.js");

const authModel = require("./models/auth.js");

const port = process.env.PORT || 1337;


app.use(cors());
// app.options('*', cors());

app.disable('x-powered-by');

app.set("view engine", "ejs");


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/users", auth);
app.use("/data", data);
app.get('/', function (req, res) {
    res.send('hello world');
});


const server = httpServer.listen(port, () => {
    console.log('Me and socket api listening on port ' + port);
});

module.exports = server;
