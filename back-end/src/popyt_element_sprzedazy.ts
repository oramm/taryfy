const express = require("express");

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  PopytElementSprzedazy.Select(res, req);
});
router.post("/insert", (req, res) => {
  PopytElementSprzedazy.Insert(res, req);
});
router.post("/update", (req, res) => {
  PopytElementSprzedazy.Update(res, req);
});
router.post("/delete", (req, res) => {
  PopytElementSprzedazy.Delete(res, req);
});

class PopytElementSprzedazy {
  static Select(res, req) {
    let query =
      "SELECT * from popyt_element_sprzedazy WHERE wniosek_id=" +
      req.body.wniosek_id +
      " AND typ_id=" +
      req.body.typ_id;
    DB.execute(query, res);
  }

  static Insert(res, req) {
    let query =
      "INSERT INTO popyt_element_sprzedazy (wniosek_id, typ_id, nazwa, opis, wspolczynnik, jednostka, abonament, abonament_nazwa, abonament_wspolczynnik) VALUES (" +
      req.body.wniosek_id +
      "," +
      req.body.typ_id +
      "," +
      DB.escape(req.body.sprzedaz.nazwa) +
      "," +
      DB.escape(req.body.sprzedaz.opis) +
      "," +
      DB.escape(req.body.sprzedaz.wspolczynnik) +
      "," +
      DB.escape(req.body.sprzedaz.jednostka) +
      "," +
      DB.escape(req.body.sprzedaz.abonament) +
      "," +
      DB.escape(req.body.sprzedaz.abonament_nazwa) +
      "," +
      DB.escape(req.body.sprzedaz.abonament_wspolczynnik) +
      ")";
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE popyt_element_sprzedazy SET nazwa=" +
      DB.escape(req.body.sprzedaz.nazwa) +
      ", opis=" +
      DB.escape(req.body.sprzedaz.opis) +
      ", wspolczynnik=" +
      DB.escape(req.body.sprzedaz.wspolczynnik) +
      ", jednostka=" +
      DB.escape(req.body.sprzedaz.jednostka) +
      ", abonament=" +
      DB.escape(req.body.sprzedaz.abonament) +
      ", abonament_nazwa=" +
      DB.escape(req.body.sprzedaz.abonament_nazwa) +
      ", abonament_wspolczynnik=" +
      DB.escape(req.body.sprzedaz.abonament_wspolczynnik) +
      ", wariant_id=" +
      DB.escape(req.body.sprzedaz.wariant_id) +
      " WHERE id=" +
      req.body.sprzedaz.id;
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query = "DELETE FROM popyt_element_sprzedazy WHERE id = " + req.body.id;
    DB.execute(query, res);
  }
}

export { router as PopytElementSprzedazyRouter, PopytElementSprzedazy};
