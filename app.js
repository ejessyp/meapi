const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const convertHTMLToPDF = require('pdf-puppeteer');

const app = express();
const httpServer = require("http").createServer(app);
// graphql
const visual = true;
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema
} = require("graphql");

const { RootQueryType, RootMutationType } = require("./graphql/root.js");

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});


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

    // socket.on('disconnect', function () {
    //     console.log('user disconnected');
    // });
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


app.use('/graphql',
    (req, res, next) => authModel.checkToken(req, res, next),
    graphqlHTTP({
        schema: schema,
        graphiql: visual, // Visual är satt till true under utveckling
    })
);



app.use("/users", auth);
app.use("/data", data);
app.use(
    bodyParser.text({
        limit: '50mb'
    })
);
app.get('/', function (req, res) {
    res.send('hello world');
});

app.post("/pdf", async function (req, res) {
    // to download to loacl filesystem with custom name pass a
    // "path" option. see the page.pdf docs for more info
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
    console.log(req.body);
    convertHTMLToPDF(
        req.body,
        pdf => {
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdf);
        },
        null,
        null,
        true
    ).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});

// Send email
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/send", async (req, res, next) => {
    try {
        const { template, variables, to, subject, from } = req.body;
        console.log(req.body);
        let html = template;

        // Object.keys(variables).forEach(variable => {
        //     html = html.replace(`[[${variable}]]`, variables[variable]);
        // });
        const msg = {
            to,
            from,
            subject,
            html
        };

        sgMail.send(msg)
            .then(() => {
                console.log('Email sent');
                res.json({"message": "Invitation has sent out!"});
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (ex) {
        res.json(ex);
    }
});


const server = httpServer.listen(port, () => {
    console.log('Me and socket api listening on port ' + port);
});

module.exports = server;
