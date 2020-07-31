const express = require("express");

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  PopytZestawienie.Select(res, req);
});

class PopytZestawienie {
  static Select(res, req) {
    let query =
      "SELECT" +
      " popyt_element_sprzedazy.id as element_sprzedazy_id" +
      " , popyt_element_sprzedazy.nazwa as element_sprzedazy_nazwa" +
      " , popyt_element_sprzedazy.jednostka as element_sprzedazy_jednostka" + 
      " , popyt_element_sprzedazy.wspolczynnik as element_sprzedazy_wspolczynnik" +
      " , popyt_element_sprzedazy.abonament as element_sprzedazy_abonament"+
      " , popyt_element_sprzedazy.abonament_nazwa as element_sprzedazy_abonament_nazwa" +
      " , popyt_element_sprzedazy.abonament_wspolczynnik as element_sprzedazy_abonament_wspolczynnik" +
      " , popyt_warianty.nazwa as wariant_nazwa" +
      " , grupy_odbiorcow.nazwa as grupy_odbiorcow_nazwa, popyt_wariant_odbiorcy.*" +
      " FROM" +
      " popyt_element_sprzedazy, popyt_wariant_odbiorcy, grupy_odbiorcow, popyt_warianty" +
      " WHERE" +
      " popyt_element_sprzedazy.wniosek_id = " +
      DB.escape(req.body.wniosek_id) +
      " AND popyt_element_sprzedazy.typ_id = " +
      DB.escape(req.body.typ_id) +
      " AND popyt_wariant_odbiorcy.okres_id = " +
      DB.escape(req.body.okres_id) +
      " AND popyt_element_sprzedazy.wariant_id = popyt_wariant_odbiorcy.wariant_id" +
      " AND grupy_odbiorcow.id = popyt_wariant_odbiorcy.grupy_odbiorcow_id" +
      " AND popyt_warianty.id = popyt_element_sprzedazy.wariant_id" +
      " ORDER BY" +
      " popyt_element_sprzedazy.id, popyt_wariant_odbiorcy.id";

    DB.execute(query, res);
  }
}

export { router as PopytZestawienieRouter };
