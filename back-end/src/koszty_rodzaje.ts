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
      "SELECT * from koszty_rodzaje WHERE wniosek_id=" +
      req.body.wniosek_id +
      " AND typ_id=" +
      req.body.typ_id;
    DB.execute(query, res);
  }

  static Insert(res, req) {
    let query =
      "INSERT INTO koszty_rodzaje(wniosek_id, typ_id, nazwa) VALUES (" +
      req.body.wniosek_id +
      "," +
      req.body.typ_id +
      "," +
      DB.escape(req.body.nazwa) +
      ")";
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE koszty_rodzaje SET nazwa=" +
      DB.escape(req.body.nazwa) +
      " WHERE id=" +
      req.body.id;
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query = "DELETE FROM koszty_rodzaje WHERE id = " + req.body.id;
    DB.execute(query, res);
  }
}

class RodzajeKosztow_back {
  static Select(res, req) {
    let query =
      "SELECT * from koszty_rodzaje WHERE wniosek_id=" +
      req.body.wniosek_id +
      " AND typ_id=" +
      req.body.typ_id;
    DB.execute(query, res);
  }

  static Insert(res, req) {
    let query =
      "INSERT INTO koszty_rodzaje(wniosek_id, typ_id, nazwa) VALUES (" +
      req.body.wniosek_id +
      "," +
      req.body.typ_id +
      "," +
      DB.escape(req.body.nazwa) +
      ")";
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE koszty_rodzaje SET nazwa=" +
      DB.escape(req.body.nazwa) +
      " WHERE id=" +
      req.body.id;
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query = "DELETE FROM koszty_rodzaje WHERE id = " + req.body.id;
    DB.execute(query, res);
  }
}

export { router as rodzajeKosztowRouter, RodzajeKosztow };
