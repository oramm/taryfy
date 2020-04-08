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
      "SELECT * from rodzaje_kosztow WHERE wniosek_id=" + req.body.wniosek_id;
    DB.ececuteSQL(query, result => {
      res.send(result);
    });
  }

  static Insert(res, req) {
    let query = (connection: any) =>
      "INSERT INTO rodzaje_kosztow(wniosek_id, nazwa) VALUES (" +
      req.body.wniosek_id +
      "," +
      connection.escape(req.body.nazwa) +
      ")";
    DB.ececuteSQLSanitize(query, res, result => {
      console.dir("Insert rodzaje_kosztow, id:", result.insertId);
      res.send(result);
    });
  }

  static Update(res, req) {
    let query = (connection: any) =>
      "UPDATE rodzaje_kosztow SET nazwa=" +
      connection.escape(req.body.nazwa) +
      " WHERE id=" +
      req.body.id;
    DB.ececuteSQLSanitize(query, res, result => {
      res.send(result);
    });
  }

  static Delete(res, req) {
    let query = "DELETE FROM rodzaje_kosztow WHERE id = " + req.body.id;
    DB.ececuteSQL(query, result => {
      res.send(result);
    });
  }
}

export {router as rodzajeKosztowRouter, RodzajeKosztow}