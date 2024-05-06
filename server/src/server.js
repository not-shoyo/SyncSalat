const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const { connectToDatabase } = require("./database");
const { connectSockets } = require("./sockets");

const userRoutes = require("./routes/userRoutes");
const dataRoutes = require("./routes/dataRoutes");
const maintainanceRoutes = require("./routes/maintainanceRoutes");

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const DB_USERNAME = process.env.DB_USERNAME || null;
const DB_PASSWORD = process.env.DB_PASSWORD || null;
const DB_URL =
  process.env.DB_URL ||
    (DB_USERNAME && DB_PASSWORD) ?
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@syncsalatcluster.0v9b8m3.mongodb.net/syncSalat?retryWrites=true&w=majority&appName=SyncSalatCluster` :
    "mongodb://localhost:27017/syncSalat";
const PATH_TO_SECRETS = process.env.PATH_TO_SECRETS || "";
const SSL_PRIVATE_KEY = process.env.SSL_PRIVATE_KEY || fs.readFileSync(`${PATH_TO_SECRETS}localhost-key.pem`, "utf8");
const SSL_CERTIFICATE = process.env.SSL_CERTIFICATE || fs.readFileSync(`${PATH_TO_SECRETS}localhost-cert.pem`, "utf8");

console.log(`PORT: ${PORT}`);
console.log(`FRONTEND_URL: ${FRONTEND_URL}`);
console.log(`DB_URL: ${DB_URL}`);
console.log(`PATH_TO_SECRETS: ${PATH_TO_SECRETS}`);
console.log(`SSL_PRIVATE_KEY: ${SSL_PRIVATE_KEY}`);
console.log(`SSL_CERTIFICATE: ${SSL_CERTIFICATE}`);

/**
 * Some network firewalls dont let you connect to MongoDB Atlas.
 * Only works on personal hotspot when run on localhost frontend and backend.
 */

const app = express();

app.use(express.json());

app.use(cors({ origin: FRONTEND_URL }));
app.options("*", cors());

connectToDatabase(DB_URL);

// Use routes
app.use("/api/user", userRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/maintainance", maintainanceRoutes);

app.get("/api/helloworld", (req, res) => {
  res.status(200).json({ message: "Hello World", anotherMessage: app });
});

// Specify the paths to your certificate and private key
// const privateKey = fs.readFileSync("localhost-key.pem", "utf8");
// const certificate = fs.readFileSync("localhost-cert.pem", "utf8");
const credentials = { key: SSL_PRIVATE_KEY, cert: SSL_CERTIFICATE };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

// Start the server
httpsServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// connectSockets(httpsServer, app._router);
connectSockets(httpsServer, FRONTEND_URL);

// Run `npx nodemon server.js` from the server/ directory to run the server
// All API calls etc. happen on https://localhost:3001 (or whatever PORT is)
