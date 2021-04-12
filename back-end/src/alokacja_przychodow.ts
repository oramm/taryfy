const express = require("express");

var router = express.Router();

import { Log } from "./Log";
import { DB } from "./db_util";
import { WspolczynnikAlokacjiSelected } from "../../common/model";

router.post("/select_elementy_przychodow", (req, res) => {
  DBAccess.SelectElementyPrzychodow(res, req);
});
router.post("/select_wspolczynnik_alokacji", (req, res) => {
  DBAccess.SelectWspolczynnikAlokacji(res, req);
});

router.post("/select_wspolczynnik_alokacji_selected", (req, res) => {
  DBAccess.SelectWspolczynnikAlokacjiSelected(res, req);
});

router.post("/select_grupy_wspolczynnik", (req, res) => {
  DBAccess.SelectGrupyWspolczynnik(res, req);
});

router.post("/select_koszty", (req, res) => {
  DBAccess.SelectKoszty(res, req);
});

router.post("/update", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  DBAccess.Update(res, req);
});

class DBAccess {
  static SelectElementyPrzychodow(res, req) {
    Log(0, "SelectElementyPrzychodow received req.body=", req.body);
    let query =
      "SELECT id,poziom,nazwa FROM elementy_przychodow_dict WHERE typ_id = " +
      DB.escape(req.body.typ_id) +
      " ORDER BY id";
    DB.execute(query, res);
  }

  static SelectWspolczynnikAlokacji(res, req) {
    Log(0, "SelectWspolczynnikAlokacji received req.body=", req.body);
    let query =
      "SELECT" +
      " popyt_element_sprzedazy.id as popyt_element_sprzedazy_id" +
      ", popyt_element_sprzedazy.nazwa as popyt_element_sprzedazy_nazwa" +
      ", popyt_element_sprzedazy.kod_wspolczynnika as popyt_element_sprzedazy_kod_wspolczynnika" +
      ", popyt_element_sprzedazy.abonament_nazwa as popyt_element_sprzedazy_abonament_nazwa" +
      ", popyt_element_sprzedazy.abonament as popyt_element_sprzedazy_abonament" +
      ", popyt_element_sprzedazy.abonament_kod_wspolczynnika as popyt_element_sprzedazy_abonament_kod_wspolczynnika" +     
      ", popyt_warianty.id as popyt_warianty_id" +
      ", popyt_warianty.nazwa as popyt_warianty_nazwa" +
      " FROM" +
      " popyt_element_sprzedazy, popyt_warianty" +
      " WHERE" +
      " popyt_element_sprzedazy.typ_id = " +
      DB.escape(req.body.typ_id) +
      " AND popyt_element_sprzedazy.wniosek_id = " +
      DB.escape(req.body.wniosek_id) +
      " AND popyt_warianty.element_sprzedazy_id = popyt_element_sprzedazy.id";
    DB.execute(query, res);
  }

  static SelectWspolczynnikAlokacjiSelected(res, req) {
    Log(0, "SelectGrupaWspolczynnik received req.body=", req.body);
    let query =
      " SELECT" +
      " id" +
      " , elementy_przychodow_id" +
      " , popyt_element_sprzedazy_id" +
      " , popyt_warianty_id" +
      " , abonament" +
      " FROM" +
      " wspolczynnik_alokacji" +
      " WHERE" +
      " typ_id =" +
      DB.escape(req.body.typ_id) +
      " AND popyt_element_sprzedazy_id IN (SELECT id FROM popyt_element_sprzedazy WHERE wniosek_id = " +
      DB.escape(req.body.wniosek_id) +
      ") " +
      " AND okres_id = " +
      DB.escape(req.body.okres_id);

    DB.execute(query, res);
  }

  static SelectGrupyWspolczynnik(res, req) {
    Log(0, "SelectGrupaWspolczynnik received req.body=", req.body);
    let query =
      " SELECT" +
      " popyt_wariant_odbiorcy.grupy_odbiorcow_id as grupy_odbiorcow_id" +
      " , popyt_wariant_odbiorcy.wspolczynnik_alokacji as wspolczynnik" +
      " , popyt_wariant_odbiorcy.wspolczynnik_alokacji_abonament as wspolczynnik_abonament" +
      " , popyt_element_sprzedazy.id as popyt_element_sprzedazy_id" +
      " , popyt_element_sprzedazy.abonament as popyt_element_sprzedazy_abonament" +
      " , popyt_warianty.id as popyt_warianty_id" +
      " FROM" +
      " popyt_element_sprzedazy" +
      " , popyt_warianty" +
      " , popyt_wariant_odbiorcy" +
      " WHERE" +
      " popyt_element_sprzedazy.wniosek_id =" +
      DB.escape(req.body.wniosek_id) +
      " AND popyt_element_sprzedazy.typ_id =" +
      DB.escape(req.body.typ_id) +
      " AND popyt_warianty.element_sprzedazy_id = popyt_element_sprzedazy.id" +
      " AND popyt_wariant_odbiorcy.wariant_id = popyt_warianty.id" +
      " AND popyt_wariant_odbiorcy.okres_id = " +
      DB.escape(req.body.okres_id);

    DB.execute(query, res);
  }

  static SelectKoszty(res, req) {
    Log(0, "SelectGrupaWspolczynnik received req.body=", req.body);
    let query =
      " SELECT" +
      " elementy_przychodow_dict.id as elementy_przychodow_id" +
      " , SUM(koszty.rok_obrachunkowy_1) as rok_obrachunkowy_1" +
      " , SUM(koszty.rok_obrachunkowy_2) as rok_obrachunkowy_2" +
      " , SUM(koszty.rok_obrachunkowy_3) as rok_obrachunkowy_3" +
      " , SUM(koszty.rok_nowych_taryf_1) as rok_nowych_taryf_1" +
      " , SUM(koszty.rok_nowych_taryf_2) as rok_nowych_taryf_2" +
      " , SUM(koszty.rok_nowych_taryf_3) as rok_nowych_taryf_3" +
      " FROM" +
      " elementy_przychodow_dict JOIN koszty_rodzaje ON elementy_przychodow_dict.id = koszty_rodzaje.elementy_przychodow_id" +
      " ,koszty" +
      " WHERE" +
      " koszty.wniosek_id =" +
      DB.escape(req.body.wniosek_id) +
      " AND koszty.koszty_rodzaje_id = koszty_rodzaje.id" +
      // " AND koszty_rodzaje.typ_id =" +
      // DB.escape(req.body.typ_id) +
      " GROUP BY koszty_rodzaje.elementy_przychodow_id";

    DB.execute(query, res);
  }
  static Update(res, req) {
    Log(0, "Update received req.body=", req.body);
    let query =
      "START TRANSACTION; DELETE FROM wspolczynnik_alokacji WHERE popyt_element_sprzedazy_id IN (SELECT id FROM popyt_element_sprzedazy WHERE wniosek_id = "
      + DB.escape(req.body.wniosek_id)
      + ")"
      + " AND typ_id =" +
      DB.escape(req.body.typ_id) +
      (req.body.powiel === true ? "" : (" AND okres_id = " +
      DB.escape(req.body.okres_id))) +
      ";";
    let okresy = [Number(req.body.okres_id)];
    if (req.body.powiel === true)
    {
      okresy[0] = 1;
      okresy[1] = 2;
      okresy[2] = 3;
    }
    okresy.forEach((okres,index)=>{
      for (let item of req.body.wspolczynnik_alokacji_selected) {
        query +=
          " INSERT INTO wspolczynnik_alokacji (" +
          " typ_id" +
          " , okres_id" +
          " , elementy_przychodow_id" +
          " , popyt_element_sprzedazy_id" +
          " , popyt_warianty_id" +
          " , abonament)" +
          " VALUES(" +
          DB.escape(req.body.typ_id) +
          "," +
          DB.escape(okres) +
          "," +
          DB.escape(item.elementy_przychodow_id) +
          "," +
          DB.escape(item.popyt_element_sprzedazy_id) +
          "," +
          DB.escape(item.popyt_warianty_id) +
          "," +
          DB.escape(item.abonament) +
          ");";
      }
    })
    query += "COMMIT;";
    DB.execute(query, res);
  }
}

export { router as AlokacjaPrzychodowRouter };
