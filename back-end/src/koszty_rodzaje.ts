const express = require("express");

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  RodzajeKosztow.Select(res, req);
});
router.post("/insert", (req, res) => {
  RodzajeKosztow.Insert(res, req);
});
router.post("/update", (req, res) => {
  RodzajeKosztow.Update(res, req);
});
router.post("/delete", (req, res) => {
  RodzajeKosztow.Delete(res, req);
});

class RodzajeKosztow {
  static Select(res, req) {
    let query =
      "SELECT * from koszty_rodzaje WHERE wniosek_id=" + req.body.wniosek_id +
      " AND typ_id="+req.body.typ_id;
    DB.executeSQL(query, result => {
      res.send(result);
    });
  }

  static Insert(res, req) {
    let query = (connection: any) =>
      "INSERT INTO koszty_rodzaje(wniosek_id, typ_id, nazwa) VALUES (" +
      req.body.wniosek_id +
      "," +
      req.body.typ_id +
      "," +      
      connection.escape(req.body.nazwa) +
      ")";
    DB.executeSQLSanitize(query, res, result => {
      console.dir("Insert koszty_rodzaje, id:", result.insertId);
      res.send(result);
    });
  }

  static Update(res, req) {
    let query = (connection: any) =>
      "UPDATE koszty_rodzaje SET nazwa=" +
      connection.escape(req.body.nazwa) +
      " WHERE id=" +
      req.body.id;
    DB.executeSQLSanitize(query, res, result => {
      res.send(result);
    });
  }

  static Delete(res, req) {
    let query = "DELETE FROM koszty_rodzaje WHERE id = " + req.body.id;
    DB.executeSQL(query, result => {
      res.send(result);
    });
  }
}

export {router as rodzajeKosztowRouter, RodzajeKosztow}