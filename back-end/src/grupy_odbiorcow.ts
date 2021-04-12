const express = require("express");

var router = express.Router();

import { DB } from "./db_util";
import { Log } from "./log";

router.post("/select", (req, res) => {
  GrupyOdbiorcowDB.Select(res, req);
});
router.post("/insert", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  GrupyOdbiorcowDB.Insert(res, req);
});
router.post("/update", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  GrupyOdbiorcowDB.Update(res, req);
});
router.post("/update_przychody", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  GrupyOdbiorcowDB.UpdatePrzychody(res, req);
});
router.post("/delete", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  GrupyOdbiorcowDB.Delete(res, req);
});

class GrupyOdbiorcowDB {
  static selectQuery = (wniosek_id) => {
    return (
      "SELECT * from grupy_odbiorcow WHERE wniosek_id=" + DB.escape(wniosek_id)
    );
  };
  static Select(res, req) {
    let query = this.selectQuery(req.body.wniosek_id);
    DB.execute(query, res);
  }

  static Insert(res, req) {
    let query =
      "INSERT INTO grupy_odbiorcow (wniosek_id, nazwa, opis, przychody_woda, przychody_scieki, liczba_odbiorcow_1, liczba_odbiorcow_2, liczba_odbiorcow_3, liczba_odbiorcow_scieki_1, liczba_odbiorcow_scieki_2, liczba_odbiorcow_scieki_3) VALUES (" +
      DB.escape(req.body.wniosek_id) +
      "," +
      DB.escape(req.body.data.nazwa) +
      "," +
      DB.escape(req.body.data.opis) +
      "," +
      DB.escape(0) + //req.body.data.przychody_woda
      "," +
      DB.escape(0) + //req.body.data.przychody_scieki
      "," +
      DB.escape(req.body.data.liczba_odbiorcow_1) +
      "," +
      DB.escape(req.body.data.liczba_odbiorcow_2) +
      "," +
      DB.escape(req.body.data.liczba_odbiorcow_3) +
      "," +
      DB.escape(req.body.data.liczba_odbiorcow_scieki_1) +
      "," +
      DB.escape(req.body.data.liczba_odbiorcow_scieki_2) +
      "," +
      DB.escape(req.body.data.liczba_odbiorcow_scieki_3) +
      ")";
    DB.execute(query, res);
  }

  static Update(res, req) {
    let set_list = [];
    if (req.body.data.nazwa)
      set_list.push("nazwa=" + DB.escape(req.body.data.nazwa));
    if (req.body.data.opis)
      set_list.push("opis=" + DB.escape(req.body.data.opis));
    if (req.body.data.przychody_woda)
      set_list.push("przychody_woda=" + DB.escape(req.body.data.przychody_woda));
    if (req.body.data.przychody_scieki)
      set_list.push("przychody_scieki=" + DB.escape(req.body.data.przychody_scieki));
    if (req.body.data.liczba_odbiorcow_1)
      set_list.push("liczba_odbiorcow_1=" + DB.escape(req.body.data.liczba_odbiorcow_1));
    if (req.body.data.liczba_odbiorcow_2)
      set_list.push("liczba_odbiorcow_2=" + DB.escape(req.body.data.liczba_odbiorcow_2));
    if (req.body.data.liczba_odbiorcow_3)
      set_list.push("liczba_odbiorcow_3=" + DB.escape(req.body.data.liczba_odbiorcow_3));
    if (req.body.data.liczba_odbiorcow_scieki_1)
      set_list.push("liczba_odbiorcow_scieki_1=" + DB.escape(req.body.data.liczba_odbiorcow_scieki_1));
    if (req.body.data.liczba_odbiorcow_scieki_2)
      set_list.push("liczba_odbiorcow_scieki_2=" + DB.escape(req.body.data.liczba_odbiorcow_scieki_2));
    if (req.body.data.liczba_odbiorcow_scieki_3)
      set_list.push("liczba_odbiorcow_scieki_3=" + DB.escape(req.body.data.liczba_odbiorcow_scieki_3));

    if (set_list.length > 0) {
      let query = "UPDATE grupy_odbiorcow SET ";
      set_list.forEach((item, index) => {
        query += item;
        if (index + 1 < set_list.length) query += ", ";
      });
      query += " WHERE id=" + DB.escape(req.body.data.id);
      DB.execute(query, res);
    }
  }

  static UpdatePrzychody(res, req) {
    Log(0, "UpdatePrzychody req.body.data:", req.body.data);
    let query = "START TRANSACTION;";
    req.body.data.forEach((item, index) => {
      query +=
        " UPDATE grupy_odbiorcow SET" +
        " przychody_woda=" +
        DB.escape(item.przychody_woda) +
        ", przychody_scieki=" +
        DB.escape(item.przychody_scieki) +
        " WHERE id=" +
        DB.escape(item.id) +
        ";";
    });
    query += " COMMIT;";
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query =
      "DELETE FROM grupy_odbiorcow WHERE id = " + DB.escape(req.body.data.id);
    DB.execute(query, res);
  }
}

export { router as GrupyOdbiorcowRouter, GrupyOdbiorcowDB };
