const express = require("express");

var router = express.Router();

import { Log } from "./log";
import { DB } from "./db_util";

router.post("/select", (req, res) => {
  Zalozenia.SelectAfterInsertWhenEmpty(res, req);
});

router.post("/update", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  Zalozenia.Update(res, req);
});

class Zalozenia {
  //metoda dodaje nowy wpis, jezeli nie bylo zadnego
  static SelectAfterInsertWhenEmpty(res, req) {
    Log(0, "Zalozenia Select received req.body=", req.body);
    let query =
      "INSERT INTO zalozenia (wniosek_id,inflacja_1,wskaznik_cen_1,marza_zysku_1,inflacja_2,wskaznik_cen_2,marza_zysku_2,inflacja_3,wskaznik_cen_3,marza_zysku_3) \
      SELECT " +
      req.body.wniosek_id +
      ",10,11,12,21,22,23,31,32,33 FROM dual WHERE NOT EXISTS (SELECT * FROM zalozenia WHERE wniosek_id=" +
      req.body.wniosek_id +
      "); \
      SELECT * FROM zalozenia WHERE wniosek_id=" +
      req.body.wniosek_id;
    DB.execute(query, res);
  }

  static Select(res, req) {
    Log(0, "Zalozenia Select received req.body=", req.body);
    let query =
      "SELECT * from zalozenia where wniosek_id=" + req.body.wniosek_id;
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE `zalozenia` SET `inflacja_1`=" +
      req.body.inflacja_1 +
      ",`wskaznik_cen_1`=" +
      req.body.wskaznik_cen_1 +
      ",`marza_zysku_1`=" +
      req.body.marza_zysku_1 +
      ",`inflacja_2`=" +
      req.body.inflacja_2 +
      ",`wskaznik_cen_2`=" +
      req.body.wskaznik_cen_2 +
      ",`marza_zysku_2`=" +
      req.body.marza_zysku_2 +
      ",`inflacja_3`=" +
      req.body.inflacja_3 +
      ",`wskaznik_cen_3`=" +
      req.body.wskaznik_cen_3 +
      ",`marza_zysku_3`=" +
      req.body.marza_zysku_3 +
      " WHERE `id`=" +
      req.body.id;
    DB.execute(query, res);
  }
}

export { router as zalozeniaRouter };
