const express = require("express");

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  KosztyRodzaje.Select(res, req);
});
router.post("/insert", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  KosztyRodzaje.Insert(res, req);
});
router.post("/update", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  KosztyRodzaje.Update(res, req);
});
router.post("/delete", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  KosztyRodzaje.Delete(res, req);
});

class KosztyRodzaje {
  static Select(res, req) {
    let query =
      "SELECT * from koszty_rodzaje WHERE wniosek_id=" +
      req.body.wniosek_id +
      " AND typ_id=" +
      req.body.typ_id +
      " ORDER BY id";
    DB.execute(query, res);
  }

  static Insert(res, req) {
    let query =
      "INSERT INTO koszty_rodzaje (wniosek_id, typ_id, nazwa, opis, elementy_przychodow_id) VALUES (" +
      req.body.wniosek_id +
      "," +
      req.body.typ_id +
      "," +
      DB.escape(req.body.nazwa) +
      "," +
      DB.escape(req.body.opis) +
      "," +
      DB.escape(req.body.elementy_przychodow_id) +
      ")";
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE koszty_rodzaje SET nazwa=" +
      DB.escape(req.body.nazwa) +
      ", opis=" +
      DB.escape(req.body.opis) +
      ", elementy_przychodow_id=" +
      DB.escape(req.body.elementy_przychodow_id) +
      " WHERE id=" +
      req.body.id;
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query = "DELETE FROM koszty_rodzaje WHERE id = " + req.body.id;
    DB.execute(query, res);
  }
}

export { router as KosztyRodzajeRouter, KosztyRodzaje };
