const express = require("express");

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  KosztyRodzaje.Select(res, req);
});
router.post("/insert", (req, res) => {
  KosztyRodzaje.Insert(res, req);
});
router.post("/update", (req, res) => {
  KosztyRodzaje.Update(res, req);
});
router.post("/delete", (req, res) => {
  KosztyRodzaje.Delete(res, req);
});

class KosztyRodzaje {
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
      "INSERT INTO koszty_rodzaje (wniosek_id, typ_id, nazwa, opis, wspolczynnik) VALUES (" +
      req.body.wniosek_id +
      "," +
      req.body.typ_id +
      "," +
      DB.escape(req.body.nazwa) +
      "," +
      DB.escape(req.body.opis) +
      "," +
      DB.escape(req.body.wspolczynnik) +
      ")";
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE koszty_rodzaje SET nazwa=" +
      DB.escape(req.body.nazwa) +
      ", opis=" +
      DB.escape(req.body.opis) +
      ", wspolczynnik=" +
      DB.escape(req.body.wspolczynnik) +
      " WHERE id=" +
      req.body.id;
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query = "DELETE FROM koszty_rodzaje WHERE id = " + req.body.id;
    DB.execute(query, res);
  }
}

export { router as KosztyRodzajeRouter, KosztyRodzaje};
