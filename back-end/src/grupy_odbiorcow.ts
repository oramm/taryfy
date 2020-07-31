const express = require("express");

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  GrupyOdbiorcow.Select(res, req);
});
router.post("/insert", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  GrupyOdbiorcow.Insert(res, req);
});
router.post("/update", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  GrupyOdbiorcow.Update(res, req);
});
router.post("/delete", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  GrupyOdbiorcow.Delete(res, req);
});

class GrupyOdbiorcow {
  static Select(res, req) {
    let query =
      "SELECT * from grupy_odbiorcow WHERE wniosek_id=" +
      DB.escape(req.body.wniosek_id) +
      " AND typ_id=" +
      DB.escape(req.body.typ_id);
    DB.execute(query, res);
  }

  static Insert(res, req) {
    let query =
      "INSERT INTO grupy_odbiorcow (wniosek_id, typ_id, nazwa, opis) VALUES (" +
      DB.escape(req.body.wniosek_id) +
      "," +
      DB.escape(req.body.typ_id) +
      "," +
      DB.escape(req.body.data.nazwa) +
      "," +
      DB.escape(req.body.data.opis) +
      ")";
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE grupy_odbiorcow SET nazwa=" +
      DB.escape(req.body.data.nazwa) +
      ", opis=" +
      DB.escape(req.body.data.opis) +
      " WHERE id=" +
      DB.escape(req.body.data.id);
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query =
      "DELETE FROM grupy_odbiorcow WHERE id = " + DB.escape(req.body.data.id);
    DB.execute(query, res);
  }
}

export { router as GrupyOdbiorcowRouter };
