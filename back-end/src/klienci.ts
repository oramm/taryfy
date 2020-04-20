const express = require("express");
var router = express.Router();

import { Log } from "./log";
import { DB } from "./db_util";

router.post("/insert", (req, res) => {
  Klienci.insert(res, req);
});

class Klienci {
  static insert(res, req) {
    Log(0, "Klienci insert received req.body=", req.body);
    let query = (connection: any) =>
      "SELECT * from klienci where nazwa =" + connection.escape(req.body.nazwa);

    DB.executeSQLSanitize(query, res, (result) => {
      let size: string = result.length;
      if (Number(size) > 0) {
        //error, user already exists
        res.json({
          message: "Klient already exists",
        });
      } else {
        let query = (connection: any) =>
          "INSERT INTO klienci (nazwa, opis, adres, nip) SELECT " +
          connection.escape(req.body.nazwa) +
          "," +
          connection.escape(req.body.opis) +
          "," +
          connection.escape(req.body.adres) +
          "," +
          connection.escape(req.body.nip) +
          " WHERE NOT EXISTS (SELECT * FROM klienci WHERE nazwa=" +
          connection.escape(req.body.nazwa) +
          ");";
        DB.executeSQLSanitize(query, res, result => {
          Log(0, result);
          res.send(result);
        });
      }
    });
  }
}

let klienciInsert = Klienci.insert;

export { router as klienciRouter, klienciInsert };
