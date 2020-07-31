const express = require("express");

var router = express.Router();

import { Log } from "./Log";
import { DB } from "./db_util";

router.post("/select", (req, res) => {
  KosztyWskazniki.SelectAfterInsertWhenEmpty(res, req);
});

router.post("/update", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  KosztyWskazniki.Update(res, req);
});
router.post("/delete", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  KosztyWskazniki.Delete(res, req);
});

class KosztyWskazniki {
  static Select(res, req) {
    let query =
      "SELECT * from koszty_wskazniki WHERE wniosek_id=" +
      req.body.wniosek_id +
      " AND typ_id=" +
      req.body.typ_id;
    DB.execute(query, res);
  }

  static SelectAfterInsertWhenEmpty(res, req) {
    Log(0, "KosztyWskazniki Select received req.body=", req.body);
    let query =
      "INSERT INTO koszty_wskazniki (wniosek_id, typ_id, wskaznik_1, wskaznik_2, wskaznik_3) SELECT " +
      req.body.wniosek_id +
      ", " +
      req.body.typ_id +
      ",1,1,1 WHERE NOT EXISTS (SELECT * FROM koszty_wskazniki WHERE wniosek_id=" +
      req.body.wniosek_id +
      " AND typ_id=" +
      req.body.typ_id +
      "); SELECT * FROM koszty_wskazniki WHERE wniosek_id=" +
      req.body.wniosek_id +
      " AND typ_id=" +
      req.body.typ_id;
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE koszty_wskazniki SET wskaznik_1=" +
      DB.escape(req.body.wskaznik_1) +
      ", wskaznik_2=" +
      DB.escape(req.body.wskaznik_2) +
      ", wskaznik_3=" +
      DB.escape(req.body.wskaznik_3) +
      " WHERE id=" +
      req.body.id;
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query = "DELETE FROM koszty_wskazniki WHERE id=" + req.body.id;
    DB.execute(query, res);
  }
}

export { router as KosztyWskaznikiRouter };
