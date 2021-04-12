//'use strict';
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5006;

import { uzytkownicyRouter } from "./src/uzytkownicy";
import { wnioskiRouter } from "./src/wnioski";
import { zalozeniaRouter } from "./src/zalozenia";
import { KosztyRodzajeRouter } from "./src/koszty_rodzaje";
import { KosztyWskaznikiRouter } from "./src/koszty_wskazniki";
import { KosztySpreadsheetRouter } from "./src/koszty_spreadsheet";
import { KosztyRouter } from "./src/koszty";
import { PopytElementSprzedazyRouter } from "./src/popyt_element_sprzedazy";
import { PopytWariantySymulacjiRouter } from "./src/popyt_warianty_symulacji";
//import { PopytWariantOdbiorcyRouter } from "./src/popyt_wariant_odbiorcy";
import { PopytZestawienieRouter } from "./src/popyt_zestawienie";
import { AlokacjaPrzychodowRouter } from "./src/alokacja_przychodow";
import { GrupyOdbiorcowRouter } from "./src/grupy_odbiorcow";
import { WynikiSpreadsheetRouter } from "./src/wyniki";
import { Log } from "./src/log";

app.use(express.static("public"));
//support JSON-encoded bodies
app.use(bodyParser.json());
//support URL-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
let counter: number = 0;
app.use((req, res, next) => {
  Log(0, "request received counter: ", ++counter);
  Log(0, "request received req.body: ", req.body);
  Log(0, "request received req.originalUrl: ", req.originalUrl);
  Log(0, "request received req.header: ", req.header);
  //Log(0, "request received req: ", req);
  next();
});

//this is a way to drop and create fresh DB with empty tables
//instead use:
//ts-node admin_create_db
//
//uncoment it only when you are 100% shure you know what you are doing
//
//app.get("/createdb", async (req, res) => {
//  await DB.crateDB((result: any) => {
//    var fs = require("fs");
//    var sql = fs.readFileSync("./src/sql/create_db.sql").toString();
//    Log(0, "file len: " + fs.readFileSync("./src/sql/create_db.sql").length);
//    Log(0, "sql: " + sql);
//    DB.execute(sql,res);
//  });
//});

app.use("/uzytkownicy", uzytkownicyRouter);

app.use((req, res, next) => {
  Log(
    0,
    "request received req.headers.authorization: ",
    req.headers.authorization
  );
  if (req.headers.authorization) {
    try {
      const decoded = jwt.verify(
        req.headers.authorization,
        //todo: this key is also used in uzytkownicy.ts file, move it to one place
        "g6asdfbw4yhdfvqwe4yfg2365burthff6ui47irtfdgwgh45wv4hsdf0zq1x08lqz34r54brwer4ddwv54t67uhe5rtv"
      );
      Log(0, "token is correct, decoded: ", decoded);
      req.userData = decoded;
      next();
    } catch (error) {
      Log(0, "token verification failed");
      return res.status(401).json({
        message: "Auth failed",
      });
    }
  } else {
    return res.status(501).json({ message: "Missing login token" });
  }
});

app.use("/wnioski", wnioskiRouter);
app.use("/zalozenia", zalozeniaRouter);
app.use("/koszty_rodzaje", KosztyRodzajeRouter);
app.use("/koszty_wskazniki", KosztyWskaznikiRouter);
app.use("/koszty_spreadsheet", KosztySpreadsheetRouter);
app.use("/koszty", KosztyRouter);
app.use("/popyt_element_sprzedazy", PopytElementSprzedazyRouter);
app.use("/popyt_warianty_symulacji", PopytWariantySymulacjiRouter);
//app.use("/popyt_wariant_odbiorcy",  PopytWariantOdbiorcyRouter);
app.use("/popyt_zestawienie", PopytZestawienieRouter);
app.use("/alokacja_przychodow", AlokacjaPrzychodowRouter);
app.use("/grupy_odbiorcow", GrupyOdbiorcowRouter);
app.use("/wyniki", WynikiSpreadsheetRouter);

//todo: return some error?
app.use((req, res, next) => {
  const error = new Error("Taryfy back-end error - adress not found");
  //error.status(404);
  next(error);
});

app.use((err, req, res) => {
  Log(0, "Taryfy back-end error: ", err);
});

app.listen(port, () => {
  Log(0, "Wnioski Taryfowe back-end server is listening on port: ", port);
});
