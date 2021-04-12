const express = require("express");
import { Log } from "./log";

var router = express.Router();

import { DB } from "./db_util";

router.post("/select", (req, res) => {
  PopytZestawienie.SelectAndSend(res, req);
});

class PopytZestawienie {
  static SelectAndSend(res, req) {
    this.Select(req, (resp) => {
      res.send(resp);
    });
  }
  static Select(req, next, reject?) {
    let query =
      "SELECT" +
      " popyt_element_sprzedazy.id as element_sprzedazy_id" +
      " , popyt_element_sprzedazy.nazwa as element_sprzedazy_nazwa" +
      " , popyt_element_sprzedazy.jednostka as element_sprzedazy_jednostka" +
      " , popyt_element_sprzedazy.kod_wspolczynnika as element_sprzedazy_kod_wspolczynnika" +
      " , popyt_element_sprzedazy.abonament as element_sprzedazy_abonament" +
      " , popyt_element_sprzedazy.abonament_nazwa as element_sprzedazy_abonament_nazwa" +
      " , popyt_element_sprzedazy.abonament_kod_wspolczynnika as element_sprzedazy_abonament_kod_wspolczynnika" +
      " , popyt_warianty.nazwa as wariant_nazwa" +
      " , grupy_odbiorcow.nazwa as grupy_odbiorcow_nazwa" +
      " , popyt_wariant_odbiorcy.*" +
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

    let prepare = (error: any, result: any) => {
      if (error)
      {
        reject && reject(error);
        return;
      }
      let table: string[][] = [];
      let last_id = -1;
      let first_row: string[] = [];
      let first_row_state = 0; //0 - not started, 1 - under construction, 2 - finished
      let row1: string[] = [];
      let row2: string[] = [];
      let row3: string[] = [];
      let row4: string[] = [];
      let row: string[][] = [row1, row2, row3, row4];
      let sum: number[] = [0, 0, 0, 0];

      table.push(first_row);

      let copyRows = () => {
        row.forEach((item: string[], index: number) => {
          if (item !== [] && item.length !== 0) {
            item.push(sum[index] ? String(Math.round( sum[index] * 100 + Number.EPSILON ) / 100) : String(0));
            table.push(item);
          }
          sum[index] = 0;
          row[index] = [];
        });
      };
      let addItemToRows = (item: any) => {
        row[0].push(item.sprzedaz || "");
        row[1].push(item.wspolczynnik_alokacji || "");
        row[2].push(item.oplaty_abonament || "");
        row[3].push(item.wspolczynnik_alokacji_abonament || "");
        sum[0] += Number(item.sprzedaz);
        sum[1] += Number(item.wspolczynnik_alokacji);
        sum[2] += Number(item.oplaty_abonament);
        sum[3] += Number(item.wspolczynnik_alokacji_abonament);
      };
      if (result) {
        result.forEach((item: any, index: number) => {
          if (item.element_sprzedazy_id === last_id) {
            //next elements in list for one element_sprzedazy
            if (first_row_state === 1) {
              first_row.push(item.grupy_odbiorcow_nazwa);
            }
            addItemToRows(item);
          } else {
            //first element in list for one element_sprzedazy
            last_id = item.element_sprzedazy_id;
            if (first_row_state === 0) {
              first_row.push(item.grupy_odbiorcow_nazwa);
              first_row_state = 1;
            } else if (first_row_state === 1) {
              first_row_state = 2;
            }

            if (first_row_state === 2) {
              //next new set of rows started, copy previous one
              copyRows();
            }

            row[0].push("<rowSpan>" + item.element_sprzedazy_kod_wspolczynnika + 
            (req.body.add_wariant ? " " + item.wariant_nazwa : ""));
            row[0].push("<rowSpan>" + item.element_sprzedazy_nazwa);
            row[0].push(item.element_sprzedazy_jednostka);
            row[1].push("<empty>");
            row[1].push("<empty>");
            row[1].push("%");
            row[2].push(
              "<rowSpan>" +
                (item.element_sprzedazy_abonament
                  ? item.element_sprzedazy_abonament_kod_wspolczynnika +
                    (req.body.add_wariant ? " " + item.wariant_nazwa : "")
                  : "")
            );
            row[2].push("<rowSpan>" + item.element_sprzedazy_abonament_nazwa);
            row[2].push("zł");
            row[3].push("<empty>");
            row[3].push("<empty>");
            row[3].push("%");
            addItemToRows(item);
          }
        });

        first_row.push("Ogółem");
        copyRows();
      }
      Log(0, "PopytZestawienie->prepare table:" + table);
      next(table);
    };

    DB.execute(query, null, prepare);

    //DB.execute(query, res);
  }
}

export { router as PopytZestawienieRouter };
export { PopytZestawienie as PopytZestawienie };
