const express = require("express");

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  PopytWarianty.Select(res, req);
});
router.post("/insert", (req, res) => {
  PopytWarianty.Insert(res, req);
});
router.post("/update", (req, res) => {
  PopytWarianty.Update(res, req);
});
router.post("/delete", (req, res) => {
  PopytWarianty.Delete(res, req);
});

class PopytWarianty {
  static Select(res, req) {
    let query =
      "SELECT * from popyt_warianty WHERE element_sprzedazy_id=" +
      DB.escape(req.body.element_sprzedazy_id);
    DB.execute(query, res);
  }

  static Insert(res, req) {
    let query =
      "INSERT INTO popyt_warianty (element_sprzedazy_id, okres, nazwa, opis) VALUES (" +
      DB.escape(req.body.element_sprzedazy_id) +
      "," +
      DB.escape(req.body.data.okres) +
      "," +
      DB.escape(req.body.data.nazwa) +
      "," +
      DB.escape(req.body.data.opis) +
      ")";
    DB.execute(query, res);
  }

  static Update(res, req) {
    let query =
      "UPDATE popyt_warianty SET nazwa=" +
      DB.escape(req.body.data.nazwa) +
      ", okres=" +
      DB.escape(req.body.data.okres) +
      ", opis=" +
      DB.escape(req.body.data.opis) +
      " WHERE id=" +
      DB.escape(req.body.data.id);
    DB.execute(query, res);
  }

  static Delete(res, req) {
    let query = "DELETE FROM popyt_warianty WHERE id = " + req.body.id;
    DB.execute(query, res);
  }
}

export { router as PopytWariantySymulacjiRouter};
