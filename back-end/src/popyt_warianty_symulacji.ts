const express = require("express");

var router = express.Router();

import { DB } from "./db_util";
import { Log } from "./log";

router.post("/select", (req, res) => {
  PopytWarianty.Select(res, req);
});
router.post("/select_one", (req, res) => {
  PopytWarianty.SelectOne(res, req);
});
router.post("/select_odbiorcy", (req, res) => {
  PopytWarianty.SelectOdbiorcy(res, req);
});
router.post("/select_sumy", (req, res) => {
  PopytWarianty.SelectSumy(res, req);
});
router.post("/insert", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  PopytWarianty.Insert(res, req);
});
router.post("/update", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  PopytWarianty.Update(res, req);
});
router.post("/delete", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  PopytWarianty.Delete(res, req);
});

class PopytWarianty {
  static Select(res, req) {
    let query =
      "SELECT * from popyt_warianty WHERE element_sprzedazy_id=" +
      DB.escape(req.body.element_sprzedazy_id);
    DB.execute(query, res);
  }

  static SelectOne(res, req) {
    let query =
      "SELECT * from popyt_warianty WHERE id=" +
      DB.escape(req.body.wariant_symulacji_id);
    DB.execute(query, res);
  }

  //SELECT grupy_odbiorcow.nazwa, okresy_dict.id, popyt_wariant_odbiorcy.* FROM (okresy_dict, grupy_odbiorcow) LEFT JOIN popyt_wariant_odbiorcy ON grupy_odbiorcow.id = popyt_wariant_odbiorcy.grupy_odbiorcow_id AND okresy_dict.id = popyt_wariant_odbiorcy.okres_id
  static SelectOdbiorcy(res, req) {
    let query =
      "SELECT grupy_odbiorcow.id as grupy_odbiorcow_id_valid," +
      " grupy_odbiorcow.nazwa," +
      " okresy_dict.id as okresy_dict_id, " +
      " popyt_wariant_odbiorcy.id," +
      " popyt_wariant_odbiorcy.wariant_id," +
      " popyt_wariant_odbiorcy.grupy_odbiorcow_id," +
      " popyt_wariant_odbiorcy.okres_id," +
      " IFNULL(popyt_wariant_odbiorcy.sprzedaz, 0) as sprzedaz," +
      " IFNULL(popyt_wariant_odbiorcy.wspolczynnik_alokacji, 0) as sprzedaz_wspolczynnik_alokacji," +
      " IFNULL(popyt_wariant_odbiorcy.oplaty_abonament, 0) as oplaty_abonament," +
      " IFNULL(popyt_wariant_odbiorcy.wspolczynnik_alokacji_abonament, 0) as oplaty_abonament_wspolczynnik_a," +
      " IFNULL(popyt_wariant_odbiorcy.liczba_odbiorcow, 0) as liczba_odbiorcow" +
      " FROM (okresy_dict, grupy_odbiorcow)" +
      " LEFT JOIN popyt_wariant_odbiorcy ON grupy_odbiorcow.id = popyt_wariant_odbiorcy.grupy_odbiorcow_id" +
      " AND okresy_dict.id = popyt_wariant_odbiorcy.okres_id" +
      " AND popyt_wariant_odbiorcy.wariant_id=" +
      DB.escape(req.body.wariant_id) +
      " WHERE grupy_odbiorcow.wniosek_id=" +
      DB.escape(req.body.wniosek_id);
    //"popyt_wariant_odbiorcy.okres_id="+DB.escape(req.body.okres_id) +

    DB.execute(query, res);
  }

  static SelectSumy(res, req) {
    let query =
      "SELECT "
      + " popyt_wariant_sumy.id"
      + ", okresy_dict.id as okres_id"
      + ", " + DB.escape(req.body.wariant_id) + " AS wariant_id"
      + ", IFNULL(popyt_wariant_sumy.sprzedaz,0) AS sprzedaz"
      + ", IFNULL(popyt_wariant_sumy.oplaty_abonament, 0) AS oplaty_abonament"
      + ", IFNULL(popyt_wariant_sumy.typ_alokacji_abonament, 0) AS typ_alokacji_abonament"
      + ", IFNULL(popyt_wariant_sumy.dopelnienie_grupa, 0) AS dopelnienie_grupa"
      + " FROM okresy_dict"
      + " LEFT JOIN popyt_wariant_sumy"
      + " ON okresy_dict.id = popyt_wariant_sumy.okres_id"
      + " AND popyt_wariant_sumy.wariant_id="
      + DB.escape(req.body.wariant_id);
    DB.execute(query, res);
  }

  // static SelectWynikiSymulacji(res, req) {
  //   let query =
  //     "SELECT popyt_wariant_sumy.id, okresy_dict.id as okres_id," +
  //     DB.escape(req.body.wariant_id) +
  //     " as wariant_id, IFNULL(popyt_wariant_sumy.sprzedaz,0) AS sprzedaz, IFNULL(popyt_wariant_sumy.oplaty_abonament,0) AS oplaty_abonament FROM okresy_dict LEFT JOIN popyt_wariant_sumy" +
  //     " ON okresy_dict.id = popyt_wariant_sumy.okres_id AND popyt_wariant_sumy.wariant_id=" +
  //     DB.escape(req.body.wariant_id);
  //   DB.execute(query, res);
  // }

  static QueryInsertWariantOdbiorcy(data, wariant_id) {
    Log(
      0,
      "QueryInsertWariantOdbiorcy wariant_d=" + wariant_id + " , data:",
      data
    );
    return (
      "INSERT INTO popyt_wariant_odbiorcy"
      + " (wariant_id, grupy_odbiorcow_id, okres_id, \
          sprzedaz, wspolczynnik_alokacji, oplaty_abonament,"
      + " wspolczynnik_alokacji_abonament, liczba_odbiorcow) VALUES ("
      + wariant_id
      + " ," + DB.escape(data.grupy_odbiorcow_id_valid)
      + " ," + DB.escape(data.okresy_dict_id)
      + " ," + DB.escape(data.sprzedaz)
      + " ," + DB.escape(data.sprzedaz_wspolczynnik_alokacji)
      + " ," + DB.escape(data.oplaty_abonament)
      + " ," + DB.escape(data.oplaty_abonament_wspolczynnik_a)
      + " ," + DB.escape(data.liczba_odbiorcow)
      + ")"
    );
  }

  static QueryInsertWariantSumy(data, wariant_id) {
    Log(0, "QueryInsertWariantSumy data", data);
    return (
      "INSERT INTO popyt_wariant_sumy \
      (wariant_id, okres_id, sprzedaz, \
      oplaty_abonament, typ_alokacji_abonament, \
      dopelnienie_grupa, wskaznik) VALUES ("
      + wariant_id
      + "," 
      + DB.escape(data.okres_id) 
      + "," 
      + DB.escape(data.sprzedaz_docelowa) 
      + "," 
      + DB.escape(data.oplaty_abonament_docelowa) 
      + "," 
      + (DB.escape(data.typ_alokacji_abonament) === "NULL" ? "0" : DB.escape(data.typ_alokacji_abonament))
      + "," 
      + (DB.escape(data.dopelnienie_grupa)  === "NULL" ? "0" : DB.escape(data.dopelnienie_grupa))
      + "," 
      + DB.escape(data.wskaznik) 
      + ")"
    );
  }

  static Insert(res, req) {
    let query =
      "START TRANSACTION; " +
      "INSERT INTO popyt_warianty (element_sprzedazy_id, nazwa, opis) VALUES (" +
      DB.escape(req.body.element_sprzedazy_id) +
      "," +
      DB.escape(req.body.wariant.nazwa) +
      "," +
      DB.escape(req.body.wariant.opis) +
      "); SET @last_id = LAST_INSERT_ID(); ";

    req.body.odbiorcy.map((item, index) => {
      query += PopytWarianty.QueryInsertWariantOdbiorcy(item, "@last_id") + ";";
    });

    req.body.sumy.map((item, index) => {
      query += PopytWarianty.QueryInsertWariantSumy(item, "@last_id") + ";";
    });

    query += "COMMIT;";

    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "START TRANSACTION; " +
      "UPDATE popyt_warianty SET nazwa=" +
      DB.escape(req.body.wariant.nazwa) +
      ", opis=" +
      DB.escape(req.body.wariant.opis) +
      " WHERE id=" +
      DB.escape(req.body.wariant.id) +
      ";" +
      " DELETE FROM popyt_wariant_odbiorcy WHERE wariant_id=" +
      DB.escape(req.body.wariant.id) +
      ";";

    req.body.odbiorcy.map((item, index) => {
      query +=
        PopytWarianty.QueryInsertWariantOdbiorcy(
          item,
          DB.escape(req.body.wariant.id)
        ) + ";";
    });

    query +=
      " DELETE FROM popyt_wariant_sumy WHERE wariant_id=" +
      DB.escape(req.body.wariant.id) +
      ";";

    req.body.sumy.map((item, index) => {
      query +=
        PopytWarianty.QueryInsertWariantSumy(
          item,
          DB.escape(req.body.wariant.id)
        ) + ";";
    });

    query += "COMMIT;";
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query = "DELETE FROM popyt_warianty WHERE id=" + req.body.id;
    DB.execute(query, res);
  }
}

export { router as PopytWariantySymulacjiRouter };
