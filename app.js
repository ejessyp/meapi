const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// const auth = require("./routes/auth.js");
const data = require("./routes/data.js");

// const authModel = require("./models/auth.js");

const port = process.env.PORT || 1337;

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

app.set("view engine", "ejs");

// don't show the log when it is test
// if (process.env.NODE_ENV !== 'test') {
//     // use morgan to log at command line
//     app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
// const middleware = require("./middleware/index.js");
// app.use(middleware.logIncomingToConsole);
// app.listen(port, logStartUpDetailsToConsole);

// app.all('*', authModel.checkAPIKey);

// app.use("/users", users);
app.use("/data", data);
app.get('/', function (req, res) {
  res.send('hello world')
})


const server = app.listen(port, () => {
    console.log('Me api listening on port ' + port);
});

// app.listen(port, () => {
//     console.info(`Server is listening on port ${port}.`);
//
//     // Show which routes are supported
//     console.info("Available routes are:");
//     app._router.stack.forEach((r) => {
//         if (r.route && r.route.path) {
//             console.info(r.route.path);
//         }
//     });
// });
/**
 * Log app details to console when starting up.
 *
 * @return {void}
 */
// function logStartUpDetailsToConsole() {
//     let routes = [];
//
//     // Find what routes are supported
//     app._router.stack.forEach((middleware) => {
//         if (middleware.route) {
//             // Routes registered directly on the app
//             routes.push(middleware.route);
//         } else if (middleware.name === "router") {
//             // Routes added as router middleware
//             middleware.handle.stack.forEach((handler) => {
//                 let route;
//
//                 route = handler.route;
//                 route && routes.push(route);
//             });
//         }
//     });
//
//     console.info(`Server is listening on port ${port}.`);
//     console.info("Available routes are:");
//     console.info(routes);
// }
module.exports = server;
