//'use strict';
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const port = 5000;

//import { uzytkownicyRoute } from "./uzytkownicy_route_";
import { uzytkownicyRouter } from "./src/uzytkownicy";
import { wnioskiRouter } from "./src/wnioski";
import { zalozeniaRouter } from "./src/zalozenia";
import { rodzajeKosztowRouter } from "./src/rodzaje_kosztow";
import { Koszty } from "./src/koszty";
import { Log } from "./src/log";

app.use(express.static("public"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.use((req, res, next) => {
  Log(0, "request received req.body: ", req.body);
  Log(0, "request received req.originalUrl: ", req.originalUrl);
  Log(0, "request received req.header: ", req.header);
  //Log(0, "request received req: ", req);
  next();
});

app.use("/uzytkownicy", uzytkownicyRouter);

app.use((req, res, next) => {
  Log(0, "request received req.headers.authorization: ", req.headers.authorization);
  if (req.headers.authorization) {
    try {
      const decoded = jwt.verify(
        req.headers.authorization,
        //todo: this key is also used in uzytkownicy.ts file, move it to one place
        "g6asdfbw4yhdfvqwe4yfg2365burthff6ui47irtfdgwgh45wv4hsdf0zq1x08lqz34r54brwer4ddwv54t67uhe5rtv"
      );
      Log(0, "token is correct");
      req.userData = decoded;
      next();
    } catch (error) {
      Log(0, "token verification failed");
      return res.status(401).json({
        message: "Auth failed"
      });
    }
  } else {
    return res.status(501).json({ message: "Missing login token" });
  }
});

app.use("/wnioski", wnioskiRouter);
app.use("/zalozenia", zalozeniaRouter);
app.use("/rodzaje_kosztow", rodzajeKosztowRouter);

app.post("/koszty/updatespreadsheet", (req, res) => {
  Log(0, "updatespreadsheet request reacived");
  Koszty.updateSpreadsheet(res, req);
});


//todo: make it available only for tests
// app.get("/createdb", (req, res) => {
//   var fs = require("fs");

//   var sql = fs.readFileSync("./db/create_db.sql").toString();
//   Log(0, "file len: " + fs.readFileSync("./db/create_db.sql").length);
//   Log(0, "sql: " + sql);
// });

app.use((req, res, next) => {
  const error = new Error("Not found");
  //error.status(404);
  next(error);
});

app.use((err, req, res) => {
  Log(0, "Taryfy back-end error: ", err);
});

app.listen(port, () => {
  Log(0, "Taryfy back-end listening on port: ", port);
});
