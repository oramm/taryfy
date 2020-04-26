const express = require("express");

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  Wnioski.SelectAfterInsertWhenEmpty(req, res);
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
  static SelectAfterInsertWhenEmpty(req, res) {
    let query =
      "INSERT INTO wnioski(nazwa, klient_id) SELECT 'domyślny pusty wniosek', " +
      DB.escape(req.userData.klient_id) +
      " WHERE NOT EXISTS (SELECT * FROM wnioski WHERE klient_id = " +
      DB.escape(req.userData.klient_id) +
      "); SELECT id, nazwa from wnioski WHERE klient_id = " +
      DB.escape(req.userData.klient_id);
    DB.execute(query, res);
  }

  static Select(res) {
    let query = "SELECT id, nazwa from wnioski";
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE wnioski SET nazwa=" +
      DB.escape(req.body.nazwa) +
      " WHERE id=" +
      DB.escape(req.body.id);
    DB.execute(query, res);
  }
  static Insert(res, req) {
    let query =
      "INSERT INTO wnioski(klient_id, nazwa) VALUES (" +
      DB.escape(req.userData.klient_id) +
      "," +
      DB.escape(req.body.nazwa) +
      ")";
    DB.execute(query, res);
  }
  static Clone(res, req) {
    let query =
      "START TRANSACTION; \
INSERT INTO wnioski (klient_id, nazwa) VALUES (" +
      DB.escape(req.userData.klient_id) +
      "," +
      DB.escape(req.body.nazwa) +
      "); SET @last_id = LAST_INSERT_ID(); \
INSERT INTO zalozenia \
(wniosek_id, inflacja_1, wskaznik_cen_1, marza_zysku_1, inflacja_2, wskaznik_cen_2, marza_zysku_2, inflacja_3, wskaznik_cen_3, marza_zysku_3) \
SELECT @last_id, inflacja_1, wskaznik_cen_1, marza_zysku_1, inflacja_2, wskaznik_cen_2, marza_zysku_2, inflacja_3, wskaznik_cen_3, marza_zysku_3 \
from zalozenia WHERE wniosek_id=" +
      DB.escape(req.body.id) +
      ";\
INSERT INTO koszty_rodzaje \
(wniosek_id, typ_id, nazwa, opis) \
SELECT @last_id, typ_id, nazwa, opis \
from koszty_rodzaje WHERE wniosek_id=" +
      DB.escape(req.body.id) +
      ";\
COMMIT; SELECT @last_id";

    DB.execute(query, null, (error, result) => {
      if (error) {
        res.status(500).json({
          message: "Databasa error: " + error,
        });
      } else {
        res.send(result[result.length - 1]);
      }
    });
  }
  static Delete(res, req) {
    let query = "DELETE from wnioski WHERE id=" + DB.escape(req.body.id);
    DB.execute(query, res);
  }
}

export { router as wnioskiRouter };
