//'use strict';
const express = require("express");

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  Wnioski.SelectAfterInsertWhenEmpty(res);
});
router.post("/insert", (req, res) => {
  Wnioski.Insert(res, req);
});
router.post("/update", (req, res) => {
  Wnioski.Update(res, req);
});
router.post("/clone", (req, res) => {
  Wnioski.Clone(res, req);
});
router.post("/delete", (req, res) => {
  Wnioski.Delete(res, req);
});

class Wnioski {
  //metoda dodaje domyslny wpis, jezeli tabela byla pusta, potem robi select
  static SelectAfterInsertWhenEmpty(res) {
    let query =
      " \
      INSERT INTO wnioski(nazwa) \
      SELECT 'domyślny pusty wniosek' \
      WHERE NOT EXISTS (SELECT *FROM wnioski); \
      SELECT * from wnioski";
    DB.ececuteSQL(query, result => {
      res.send(result[1]);
    });
  }

  static Select(res) {
    let query = "SELECT * from wnioski";
    DB.ececuteSQL(query, result => {
      res.send(result);
    });
  }

  static Update(res, req) {
    let query = (connection: any) =>
      "UPDATE wnioski SET nazwa=" +
      connection.escape(req.body.nazwa) +
      " WHERE id=" +
      req.body.id;
    DB.ececuteSQLSanitize(query, res, result => {
      res.send(result);
    });
  }
  static Insert(res, req) {
    let query = (connection: any) =>
      "INSERT INTO wnioski(nazwa) VALUES (" +
      connection.escape(req.body.nazwa) +
      ")";
    DB.ececuteSQLSanitize(query, res, result => {
      console.dir("Insert wnioski, id:", result.insertId);
      // result = {wniosek_id: result.insertId};
      res.send(result);
    });
  }
  static Clone(res, req) {
    let query = (connection: any) =>
      "START TRANSACTION; \
      INSERT INTO wnioski (nazwa) VALUES (" +
      connection.escape(req.body.nazwa) +
      "); \
    SET @last_id = LAST_INSERT_ID(); \
    \
    INSERT INTO zalozenia\
    (wniosek_id, inflacja_1, wskaznik_cen_1, marza_zysku_1, inflacja_2, wskaznik_cen_2, marza_zysku_2, inflacja_3, wskaznik_cen_3, marza_zysku_3) \
    SELECT @last_id, inflacja_1, wskaznik_cen_1, marza_zysku_1, inflacja_2, wskaznik_cen_2, marza_zysku_2, inflacja_3, wskaznik_cen_3, marza_zysku_3 \
    from zalozenia WHERE wniosek_id=" +
      req.body.id +
      ";\
    \
    INSERT INTO rodzaje_kosztow \
    (wniosek_id, nazwa) \
    SELECT @last_id, nazwa \
    from rodzaje_kosztow WHERE wniosek_id=" +
      req.body.id +
      ";\
      COMMIT;\
      SELECT @last_id";

    DB.ececuteSQLSanitize(query, res, result => {
      res.send(result[result.length-1]);
    });
  }
  static Delete(res, req) {
    let query = (connection: any) =>
      "DELETE from wnioski WHERE id=" + req.body.id;
    DB.ececuteSQLSanitize(query, res, result => {
      res.send(result);
    });
  }
}

export {router as wnioskiRouter};