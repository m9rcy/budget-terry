const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

app.enable("trust proxy");

// Serving static files
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));

// Global MIDDLEWARE
// Cors, to allow other domain, subdomain etc. to access our api
app.use(cors());

// http method options (preflight for delete/patch)
app.options("*", cors());

// Security Headers
app.use(helmet());

// Dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTES
// HTML
app.use(function (req, res, next) {
  if (something && req.path !== "/") return res.redirect("/");
  next();
});

app.get("/", function (req, res, next) {
  if (something)
    return res.sendfile("/public/index.html", { root: __dirname + "/.." });
  next();
});

// SERVER
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UnhandledRejection 🔥 Shutting down application");
  console.log(err.name, err.message);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("😱 SIGTERM received Shutting down gracefully");

  server.close(() => {
    console.log("😳 Process terminated!");
  });
});
