const express = require("express");
import { Log } from "./log";

import { DB } from "./db_util";

var router = express.Router();
// router.post("/select", (req, res) => {
//   Koszty.Select(res, req);
// });
// router.post("/deleteinsert", (req, res) => {
//   Koszty.Insert(res, req, true);
// });

class Koszty {
  static async Select(req, callback) {
    Log(0, "Koszty.Select req.body:", req.body);
    let query = "SELECT * from koszty WHERE wniosek_id=" + req.body.wniosek_id + " ORDER BY id";
    return DB.execute(query, null, callback);
  }

  static Insert(res, req, delete_first: boolean) {
    Log(0, "Koszty.Insert req.body:", req.body);

    let query = delete_first
      ? "DELETE FROM koszty WHERE koszty.wniosek_id = " +
        DB.escape(req.body.wniosek_id) +
        " AND koszty.koszty_rodzaje_id IN (SELECT id FROM koszty_rodzaje WHERE typ_id = " +
        DB.escape(req.body.typ_id) +
        ");"
      : "";
    for (let i = 0; i < req.body.data.length; i++) {
      query +=
        "INSERT INTO koszty (wniosek_id, koszty_rodzaje_id, rodzaj_nazwa, rok_obrachunkowy_1, rok_obrachunkowy_2,rok_obrachunkowy_3, rok_nowych_taryf_1, rok_nowych_taryf_2, rok_nowych_taryf_3) VALUES (" +
        DB.escape(req.body.wniosek_id) +
        ",(SELECT id FROM koszty_rodzaje WHERE typ_id = " +
        DB.escape(req.body.typ_id) +
        " AND wniosek_id = " +
        DB.escape(req.body.wniosek_id) +
        " ORDER BY id LIMIT " + i + ",1)," +
        DB.escape(req.body.data[i].rodzaj_nazwa) +
        "," +
        DB.escape(req.body.data[i].rok_obrachunkowy_1) +
        "," +
        DB.escape(req.body.data[i].rok_obrachunkowy_2) +
        "," +
        DB.escape(req.body.data[i].rok_obrachunkowy_3) +
        "," +
        DB.escape(req.body.data[i].rok_nowych_taryf_1) +
        "," +
        DB.escape(req.body.data[i].rok_nowych_taryf_2) +
        "," +
        DB.escape(req.body.data[i].rok_nowych_taryf_3) +
        "); ";
    }
    DB.execute(query, res);
  }

  static Delete(res, req) {
    // let query = "DELETE FROM koszty WHERE id = " + req.body.id;
    let query =
      "DELETE FROM koszty WHERE wniosek_id = " +
      req.body.wniosek_id +
      " AND koszty_rodzaje_id = " +
      req.body.koszty_rodzaje_id;
    DB.execute(query, res);
  }
}

export { router as KosztyRouter, Koszty };
