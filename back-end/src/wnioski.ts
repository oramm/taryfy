const express = require("express");
import { Spreadsheet } from "./spreadsheet";

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  Wnioski.SelectAfterInsertWhenEmpty(req, res);
});
router.post("/insert", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  Wnioski.Insert(res, req);
});
router.post("/update", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  Wnioski.Update(res, req);
});
router.post("/update_koszty", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  Wnioski.UpdateKoszty(res, req);
});
router.post("/update_wyniki", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  Wnioski.UpdateWyniki(res, req);
});
router.post("/clone", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  Wnioski.Clone(res, req);
});
router.post("/delete", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  Wnioski.Delete(res, req);
});

class Wnioski {
  static SelectAfterInsertWhenEmpty(req, res) {
    let query =
      "INSERT INTO wnioski(nazwa, klient_id) SELECT 'domyślny pusty wniosek', " +
      DB.escape(req.userData.klient_id) +
      " FROM dual WHERE NOT EXISTS (SELECT * FROM wnioski WHERE klient_id = " +
      DB.escape(req.userData.klient_id) +
      "); SELECT id, nazwa from wnioski WHERE klient_id = " +
      DB.escape(req.userData.klient_id);
    DB.execute(query, res);
  }

  static SelectSpreadsheet(req) {
    let query =
      "SELECT  \
      wnioski.spreadsheet_koszty_id as spreadsheet_koszty_id\
      , wnioski.spreadsheet_wyniki_id as spreadsheet_wyniki_id\
      , wnioski.nazwa as wniosek_nazwa\
      , klienci.nazwa as klient_nazwa \
      FROM wnioski, klienci WHERE wnioski.id=" +
      DB.escape(req.body.wniosek_id) +
      " AND klienci.id = wnioski.klient_id";
    return DB.executeInternal(query);
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

  static UpdateSpreadsheetKosztyInternal(wniosek_id, spreadsheet_koszty_id) {
    return new Promise((resolve, reject) => {
      let query =
        "UPDATE wnioski SET spreadsheet_koszty_id=" +
        DB.escape(spreadsheet_koszty_id) +
        " WHERE id=" +
        DB.escape(wniosek_id);
      DB.execute(query, null, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        }
      });
    });
  }

  static UpdateSpreadsheetWynikiInternal(wniosek_id, spreadsheet_wyniki_id) {
    return new Promise((resolve, reject) => {
      let query =
        "UPDATE wnioski SET spreadsheet_wyniki_id=" +
        DB.escape(spreadsheet_wyniki_id) +
        " WHERE id=" +
        DB.escape(wniosek_id);
      DB.execute(query, null, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        }
      });
    });
  }

  static UpdateKoszty(res, req) {
    let query =
      "UPDATE wnioski SET spreadsheet_koszty_id=" +
      DB.escape(req.body.spreadsheet_koszty_id) +
      " WHERE id=" +
      DB.escape(req.body.id);
    DB.execute(query, res);
  }
  static UpdateWyniki(res, req) {
    let query =
      "UPDATE wnioski SET spreadsheet_wyniki_id=" +
      DB.escape(req.body.spreadsheet_wyniki_id) +
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
  static async Delete(res, req) {
    let query =
      "SELECT spreadsheet_koszty_id, spreadsheet_wyniki_id FROM wnioski WHERE id=" +
      DB.escape(req.body.id);
    return DB.executeGetResult(query).then(async (oryginal_result: any) => {
      let ss = new Spreadsheet();
      let result = oryginal_result[0];
      console.log("Delete wniosek files, result:", result);
      if (result.spreadsheet_koszty_id || result.spreadsheet_wyniki_id) {
        await ss.connect().then(async (googledrive) => {
          if (result.spreadsheet_wyniki_id) {
            await ss.deleteFile(googledrive, result.spreadsheet_wyniki_id);
            console.log(
              "Delete wniosek result.spreadsheet_wyniki_id:",
              result.spreadsheet_wyniki_id
            );
          }
          if (result.spreadsheet_koszty_id) {
            console.log(
              "Delete wniosek result.spreadsheet_koszty_id:",
              result.spreadsheet_koszty_id
            );
            await ss.deleteFile(googledrive, result.spreadsheet_koszty_id);
          }
        });
      }
      //todo delete spreadsheet
      let query = "DELETE from wnioski WHERE id=" + DB.escape(req.body.id);
      DB.execute(query, res);
    });
  }
}

export { router as wnioskiRouter, Wnioski };
