const express = require("express");

import { Log } from "./log";

import { Spreadsheet } from "./spreadsheet";
import { GrupyOdbiorcow } from "../../common/model";
import { koszty } from "../../common/model";
import { PopytZestawienie } from "./popyt_zestawienie";
import { DB } from "./db_util";

var router = express.Router();

router.post("/generuj", (req, res) => {
  let gd = new Wyniki();
  gd.generuj(res, req);
});

type ElementPrzychoduWspolczynnikAlokacji = {
  elementy_przychodow_id: number;
  kod_wspolczynnika: string;
  abonament_kod_wspolczynnika: string;
  abonament: boolean;
  okres_id: number;
};

class Wyniki {
  grupy: GrupyOdbiorcow[];
  wspolczynniki_alokacji: ElementPrzychoduWspolczynnikAlokacji[];
  wspolczynniki_alokacji2: ElementPrzychoduWspolczynnikAlokacji[];
  zestawienie: any[];
  zestawienie2: any[];
  wniosek_id: number;
  wniosek: any;
  koszty: any[];
  popyt_element_sprzedazy: any[];
  popyt_wariant_odbiorcy: any[];

  public generuj = async (res: any, req: any) => {
    let ss = new Spreadsheet();
    this.wniosek_id = req.body.wniosek_id;
    Log(0, "Wyniki generuj");
    try {
      this.loadData(req, async () => {
        Log(0, "Wyniki zestawienie:", this.zestawienie);
        Log(0, "generuj this.wniosek:", this.wniosek);
        if (this.wniosek[0].spreadsheet_wyniki_id) {
          Log(
            0,
            "generuj delete file id:",
            this.wniosek[0].spreadsheet_wyniki_id
          );
          await ss.connect().then(async (googledrive) => {
            await ss.deleteFile(
              googledrive,
              this.wniosek[0].spreadsheet_wyniki_id
            );
            Log(
              0,
              "generuj delete 2 file id:",
              this.wniosek[0].spreadsheet_wyniki_id
            );
          });
        }
        let file_name =
          "wyniki " +
          this.wniosek[0].klient_nazwa +
          " " +
          this.wniosek[0].wniosek_nazwa;

        Log(0, "generuj file_name:", file_name);
        await ss
          //.copyTemplate("1Wmi-UBW4-IPxTpEuJNJQwSmGzZkNNmniAm_o38Xl9v4") // local
          //.copyTemplate("1JEcx2OrRZwxpmHIjpeavDjS4G1kUHkVPKOZsbti9ceA", "wyniki kopia") // server taryfy.envi@gmail.com
          .copyTemplate(
            "1vKl-sx5KbHCvv3g82CRy4pI_9c-p8GZ-34CbpEmQUVQ",
            file_name
          ) // server taryfy@envi.com.pl
          .then(() => {
            return new Promise((resolve, reject) => {
              let query =
                "UPDATE wnioski SET spreadsheet_wyniki_id=" +
                DB.escape(ss.file_id) +
                " WHERE id=" +
                DB.escape(req.body.wniosek_id);
              DB.execute(query, null, (error, result) => {
                if (error) {
                  Log(0, "generuj UPDATE wnioski error:", error);
                  reject(error);
                } else if (result) {
                  Log(0, "generuj UPDATE wnioski result:", result);
                  resolve(result);
                }
              });
            });
          })
          .then(() => ss.connectSheets())
          .then(() => ss.loadSheets())
          .then(() => ss.createEmptyRequest())
          .then(() => {
            this.generujAB(ss, "A", [11,12,11,6]);
            this.generujAB(ss, "B", [19,20,18,13]);
            this.generujC(ss);
            this.generujD(ss);
            this.generujE(ss);
            this.generujF(ss);
            this.generujG(ss);
            this.generujH(ss);
          })
          .then(() => ss.batchUpdate())
          // .then(() => {
          //   ss.getWebLink()
          //   .then((link)=>
          //   {
          //     Log(0, "Wyniki generuj link:", ss.getLink());
          //     res.status(200).json({
          //       link: link,
          //     });
          //   })
          // })
          .then(() => ss.getWebLink())
          .then((link) => {
            Log(0, "Wyniki generuj link:", link);
            res.status(200).json({
              link: link,
            });
          })
          .catch((error) => {
            Log(0, "Wyniki generuj error:", error);
            res.status(400).json({
              err: error,
            });
          });
      });
    } catch (err) {
      Log(0, "Wyniki generuj err:", err);
      res.status(400).json({
        err: err,
      });
    }
  };

  loadWniosek = (req) => {
    return new Promise((res, rej) => {
      let query =
        "SELECT  \
      wnioski.spreadsheet_koszty_id as spreadsheet_koszty_id\
      , wnioski.spreadsheet_wyniki_id as spreadsheet_wyniki_id\
      , wnioski.nazwa as wniosek_nazwa\
      , klienci.nazwa as klient_nazwa \
      FROM wnioski, klienci WHERE wnioski.id=" +
        DB.escape(req.body.wniosek_id) +
        " AND klienci.id = wnioski.klient_id";
      DB.execute(query, null, (error, result) => {
        if (error) {
          Log(0, "generuj select wnioski error:", error);
          rej(error);
        } else if (result) {
          Log(0, "generuj select wnioski result:", result);
          this.wniosek = result;
        }
        res(req);
      });
    });
  };
  loadGrupy = (req) => {
    return new Promise((res, rej) => {
      let query =
        "SELECT * from grupy_odbiorcow WHERE wniosek_id=" +
        DB.escape(req.body.wniosek_id);
      DB.execute(query, null, (error, result) => {
        if (error) {
          Log(0, "generuj select grupy_odbiorcow error:", error);
          rej(error);
        } else if (result) {
          this.grupy = result;
          Log(0, "generuj select result:", result);
        }
        res(req);
      });
    });
  };

  loadWspolczynniki = (req) => {
    return new Promise((res, rej) => {
      let query =
        " SELECT" +
        " wspolczynnik_alokacji.elementy_przychodow_id as elementy_przychodow_id" +
        " , popyt_element_sprzedazy.kod_wspolczynnika as kod_wspolczynnika" +
        " , popyt_element_sprzedazy.abonament_kod_wspolczynnika as abonament_kod_wspolczynnika" +
        " , wspolczynnik_alokacji.abonament as abonament" +
        " , wspolczynnik_alokacji.okres_id as okres_id" +
        " FROM" +
        " wspolczynnik_alokacji, popyt_element_sprzedazy" +
        " WHERE" +
        " wspolczynnik_alokacji.popyt_element_sprzedazy_id = popyt_element_sprzedazy.id" +
        " AND popyt_element_sprzedazy.wniosek_id = " + DB.escape(req.body.wniosek_id) +
        " AND wspolczynnik_alokacji.typ_id = 1";
      DB.execute(query, null, (error, result) => {
        if (error) {
          Log(0, "generuj select wspolczynnik_alokacji error:", error);
          rej(error);
        } else if (result) {
          this.wspolczynniki_alokacji = result;
        }
        res(req);
      });
    });
  };

  loadWspolczynniki2 = (req) => {
    return new Promise((res, rej) => {
      let query =
        " SELECT" +
        " wspolczynnik_alokacji.elementy_przychodow_id as elementy_przychodow_id" +
        " , popyt_element_sprzedazy.kod_wspolczynnika as kod_wspolczynnika" +
        " , popyt_element_sprzedazy.abonament_kod_wspolczynnika as abonament_kod_wspolczynnika" +
        " , wspolczynnik_alokacji.abonament as abonament" +
        " , wspolczynnik_alokacji.okres_id as okres_id" +
        " FROM" +
        " wspolczynnik_alokacji, popyt_element_sprzedazy" +
        " WHERE" +
        " wspolczynnik_alokacji.popyt_element_sprzedazy_id = popyt_element_sprzedazy.id" +
        " AND popyt_element_sprzedazy.wniosek_id = " + DB.escape(req.body.wniosek_id) +
        " AND wspolczynnik_alokacji.typ_id = 2";
      DB.execute(query, null, (error, result) => {
        if (error) {
          Log(0, "generuj select wspolczynnik_alokacji error:", error);
          rej(error);
        } else if (result) {
          this.wspolczynniki_alokacji2 = result;
        }
        res(req);
      });
    });
  };

  loadZestawienie = (req) => {
    this.zestawienie = [];
    this.zestawienie2 = [];
    return new Promise((res, rej) => {
      req.body.okres_id = 1;
      PopytZestawienie.Select(
        req,
        (result1) => {
          this.zestawienie.push(result1);
          req.body.okres_id = 2;
          PopytZestawienie.Select(
            req,
            (result2) => {
              this.zestawienie.push(result2);
              req.body.okres_id = 3;
              PopytZestawienie.Select(
                req,
                (result3) => {
                  this.zestawienie.push(result3);
                  req.body.typ_id = 2;
                  req.body.okres_id = 1;
                  PopytZestawienie.Select(
                    req,
                    (result4) => {
                      this.zestawienie2.push(result4);
                      req.body.okres_id = 2;
                      PopytZestawienie.Select(
                        req,
                        (result5) => {
                          this.zestawienie2.push(result5);
                          req.body.okres_id = 3;
                          PopytZestawienie.Select(
                            req,
                            (result6) => {
                              req.body.typ_id = 1;
                              this.zestawienie2.push(result6);
                              res(req);
                            },
                            rej
                          );
                        },
                        rej
                      );
                    },
                    rej
                  );
                },
                rej
              );
            },
            rej
          );
        },
        rej
      );
    });
  };
  loadKoszty = (req) => {
    return new Promise((res, rej) => {
      let query =
        "SELECT" +
        " koszty.koszty_rodzaje_id, koszty_rodzaje_id" +
        ", koszty.typ_id as koszty_typ_id" +
        ", koszty.rok_obrachunkowy_1 as koszty_rok_obrachunkowy_1" +
        ", koszty.rok_obrachunkowy_2 as koszty_rok_obrachunkowy_2" +
        ", koszty.rok_obrachunkowy_3 as koszty_rok_obrachunkowy_3" +
        ", koszty.rok_nowych_taryf_1 as koszty_rok_nowych_taryf_1" +
        ", koszty.rok_nowych_taryf_2 as koszty_rok_nowych_taryf_2" +
        ", koszty.rok_nowych_taryf_3 as koszty_rok_nowych_taryf_3" +
        " FROM" +
        " koszty" +
        " WHERE" +
        " koszty.wniosek_id = " +
        DB.escape(req.body.wniosek_id) +
        " ORDER BY koszty_rodzaje_id";
      DB.execute(query, null, (error, result) => {
        if (error) {
          Log(0, "generuj select koszty error:", error);
          rej(error);
        } else if (result) {
          this.koszty = result;
        }
        res(req);
      });
    });
  };
  loadPopytElement = (req) => {
    return new Promise((res, rej) => {
      let query =
        "SELECT" +
        " nazwa" +
        ", kod_wspolczynnika" +
        ", typ_id" +
        ", abonament" +
        ", abonament_kod_wspolczynnika" +
        " FROM" +
        " popyt_element_sprzedazy" +
        " WHERE" +
        " wniosek_id = " +
        DB.escape(req.body.wniosek_id) +
        " ORDER BY id, typ_id";
      DB.execute(query, null, (error, result) => {
        if (error) {
          Log(0, "generuj select koszty error:", error);
          rej(error);
        } else if (result) {
          this.popyt_element_sprzedazy = result;
        }
        res(req);
      });
    });
  };
  loadPopytWariant = (req) => {
    return new Promise((res, rej) => {
      let query =
        "SELECT" +
        " popyt_element_sprzedazy.id as element_sprzedazy_id" +
        " , popyt_element_sprzedazy.typ_id as element_sprzedazy_typ_id" +
        " , popyt_wariant_odbiorcy.okres_id as wariant_okres_id" +
        " , popyt_wariant_odbiorcy.grupy_odbiorcow_id as wariant_grupy_odbiorcow_id" +
        " , popyt_wariant_odbiorcy.liczba_odbiorcow as wariant_liczba_odbiorcow" +
        " FROM" +
        " popyt_element_sprzedazy, popyt_wariant_odbiorcy, popyt_warianty" +
        " WHERE" +
        " popyt_element_sprzedazy.wniosek_id = " +
        DB.escape(req.body.wniosek_id) +
        " AND popyt_element_sprzedazy.wariant_id = popyt_wariant_odbiorcy.wariant_id" +
        " ORDER BY" +
        " popyt_wariant_odbiorcy.okres_id, popyt_wariant_odbiorcy.grupy_odbiorcow_id";
      DB.execute(query, null, (error, result) => {
        if (error) {
          Log(0, "generuj select koszty error:", error);
          rej(error);
        } else if (result) {
          this.popyt_wariant_odbiorcy = result;
          //next();
        }
        res(req);
      });
    });
  };

  loadData = (req: any, next: any) => {
    this.loadWniosek(req)
      .then(() => this.loadGrupy(req))
      .then(() => this.loadWspolczynniki(req))
      .then(() => this.loadWspolczynniki2(req))
      .then(() => this.loadZestawienie(req))
      .then(() => this.loadKoszty(req))
      .then(() => this.loadPopytElement(req))
      .then(() => this.loadPopytWariant(req))
      .then(next)
      .catch((error) => {
        Log(0, "loadData error:", error);
        throw error;
      });
  };

  generujAB = (ss: any, sheet_name: string, rows: number[]) => {
    let column = 0,
      column_r = 10;
    let row = 4,
      row_r = 3; //zero base
    let comment_column = 0,
      comment_column_r = 2;
    let comment_row = 8,
      comment_row_r = 3; //zero base

    if (this.grupy.length > 1) {
      ss.addRequestCopy(
        sheet_name,
        comment_column,
        comment_row,
        comment_column_r,
        comment_row_r,
        comment_column,
        comment_row + row_r * (this.grupy.length - 1),
        comment_column_r,
        comment_row_r
      );
      ss.addRequestClear(
        sheet_name,
        comment_column,
        comment_row,
        comment_column_r,
        comment_row_r
      );
      ss.addRequestCopy(
        sheet_name,
        column,
        row,
        column_r,
        row_r,
        column,
        row + row_r,
        column_r - 1,
        row_r * (this.grupy.length - 1)
      );
    }
    this.grupy.forEach((item, index) => {
      ss.addRequestValue(
        sheet_name,
        column + 1,
        row + row_r * index,
        item.nazwa
      );
      ss.addRequestValue(
        sheet_name,
        column,
        row + row_r * index,
        index + 1,
        "number"
      );
      for (let i = 1; i < 4; i++) {
        ss.addRequestValue(
          sheet_name,
          4 + (i - 1) * 2,
          row + row_r * index,
          `='F${i}'!${ss.columnNames[2 + index]}${rows[0]}`,
          //='F1'!C11
          "formula"
        );
        ss.addRequestValue(
          sheet_name,
          4 + (i - 1) * 2,
          row + row_r * index + 1,
          `='F${i}'!${ss.columnNames[2 + index]}${rows[1]}`,
          //='F1'!C12
          "formula"
        );
        ss.addRequestValue(
          sheet_name,
          4 + (i - 1) * 2,
          row + row_r * index + 2,
          `=ZAOKR('G${i}'!${ss.columnNames[2 + index]}${rows[2]}/'G${i}'!${
            ss.columnNames[2 + index]
          }${rows[3]},2)`,
          //=ZAOKR('G1'!C11/'G1'!C6,2)
          "formula"
        );
      }
      for (let i = 0; i < 10; i++) {
        ss.addRequestBorder(sheet_name, i, 1, row + row_r * index, 3);
      }
    });
  };

  generujB = (ss: any, sheet_name: string) => {
    let column = 0,
      column_r = 10;
    let row = 4,
      row_r = 3; //zero base
    let comment_column = 0,
      comment_column_r = 2;
    let comment_row = 8,
      comment_row_r = 3; //zero base

    if (this.grupy.length > 1) {
      ss.addRequestCopy(
        sheet_name,
        comment_column,
        comment_row,
        comment_column_r,
        comment_row_r,
        comment_column,
        comment_row + row_r * (this.grupy.length - 1),
        comment_column_r,
        comment_row_r
      );
      ss.addRequestClear(
        sheet_name,
        comment_column,
        comment_row,
        comment_column_r,
        comment_row_r
      );
      ss.addRequestCopy(
        sheet_name,
        column,
        row,
        column_r,
        row_r,
        column,
        row + row_r,
        column_r - 1,
        row_r * (this.grupy.length - 1)
      );
    }
    this.grupy.forEach((item, index) => {
      ss.addRequestValue(
        sheet_name,
        column + 1,
        row + row_r * index,
        item.nazwa
      );
      ss.addRequestValue(
        sheet_name,
        column,
        row + row_r * index,
        index + 1,
        "number"
      );
    });
  };

  generujC = (ss: Spreadsheet) => {
    let name = "C";
    //let koszty_row = [1,2,4,8,9,12,13,17,18,19,20,21,22,23];
    let koszty_row = [1, 3, 7, 8, 11, 12, 16, 17, 18, 19, 20, 21]; // które
    let row_woda = 6,
      row_sciek = 19,
      column = 2; //zero base
    let i = 0;
    koszty_row.forEach((item, index) => {
      Log(0, "generujC item:" + item + " index:", index);
      {
        let koszt = this.koszty.find(
          (element) =>
            element.koszty_rodzaje_id === item && element.koszty_typ_id === 1
        );
        Log(0, "generujC typ_id === 1 koszt:", koszt);
        if (koszt) {
          ss.addRequestValue(
            name,
            column + 0,
            row_woda + index,
            koszt.koszty_rok_obrachunkowy_1,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 1,
            row_woda + index,
            koszt.koszty_rok_obrachunkowy_2,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 2,
            row_woda + index,
            koszt.koszty_rok_obrachunkowy_3,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 5,
            row_woda + index,
            koszt.koszty_rok_nowych_taryf_1,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 6,
            row_woda + index,
            koszt.koszty_rok_nowych_taryf_2,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 7,
            row_woda + index,
            koszt.koszty_rok_nowych_taryf_3,
            "number"
          );
        }
      }
      {
        let koszt = this.koszty.find(
          (element) =>
            element.koszty_rodzaje_id === item && element.koszty_typ_id === 2
        );
        Log(0, "generujC typ_id === 2 koszt:", koszt);
        if (koszt) {
          ss.addRequestValue(
            name,
            column + 0,
            row_sciek + index,
            koszt.koszty_rok_obrachunkowy_1,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 1,
            row_sciek + index,
            koszt.koszty_rok_obrachunkowy_2,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 2,
            row_sciek + index,
            koszt.koszty_rok_obrachunkowy_3,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 5,
            row_sciek + index,
            koszt.koszty_rok_nowych_taryf_1,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 6,
            row_sciek + index,
            koszt.koszty_rok_nowych_taryf_2,
            "number"
          );
          ss.addRequestValue(
            name,
            column + 7,
            row_sciek + index,
            koszt.koszty_rok_nowych_taryf_3,
            "number"
          );
        }
      }
    });
  };

  generujD = (ss: Spreadsheet) => {
    let names = ["D1", "D2", "D3"];
    let formula_row = [8,9,10,11,12,13,14,15,17,18,19,20,21,22,23];
    //[28,29,30,31,32,33,34,35,37,38,39,40,41,42,43];
    let koszty_row = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 21];
    let arkusz_row = [1,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19];
    let row = 2,
      column = 3,
      row_r = 43,
      column_r = 1; //zero base
    let okres_id = 1;
    let formula_postfix_woda = "";
    let formula_postfix_scieki = "";
    this.popyt_element_sprzedazy.forEach((item, index) => {
      if (item.typ_id === 1) {
        formula_postfix_woda +=
          ', "' +
          item.kod_wspolczynnika +
          "\",'E1'!$E$" +
          (index + 3) * 2 +
          (item.abonament
            ? ', "' +
              item.abonament_kod_wspolczynnika +
              "\",'E1'!$E$" +
              (index + 3) * 2
            : "");
      } else {
        formula_postfix_scieki +=
          ', "' +
          item.kod_wspolczynnika +
          "\",'E1'!$E$" +
          (index + 3) * 2 +
          (item.abonament
            ? ', "' +
              item.abonament_kod_wspolczynnika +
              "\",'E1'!$E$" +
              (index + 3) * 2
            : "");
      }
    });
    formula_postfix_woda += ")/100,2)";
    formula_postfix_scieki += ")/100,2)";
    for (let name of names) {
      ss.addRequestCopy(
        name,
        column,
        row,
        column_r,
        row_r,
        column,
        row,
        this.grupy.length,
        row_r
      );
      this.grupy.forEach((item, grupy_index) => {
        formula_row.forEach((item2, index2) => {
          ss.addRequestValue(
            name,
            column + grupy_index,
            item2,
            `=ROUND($${ss.columnNames[column + this.grupy.length]}${
              item2 + 1
            }*SWITCH(C${item2 + 1}` +
              formula_postfix_woda.replace(
                /\$E/g,
                ss.columnNames[grupy_index + 4]
              ),
            //            }, "A", 'E1'!$E$6, "B", 'E1'!$E$8,"C", 'E1'!$E$10, "D", 'E1'!$E$12)/100,2)`
            "formula"
          );
          ss.addRequestValue(
            name,
            column + grupy_index,
            item2 + 20,
            `=ROUND($${ss.columnNames[column + this.grupy.length]}${
              item2 + 21
            }*SWITCH(C${item2 + 21}` +
              formula_postfix_scieki.replace(
                /\$E/g,
                ss.columnNames[grupy_index + 4]
              ),
            //            }, "A", 'E1'!$E$6, "B", 'E1'!$E$8,"C", 'E1'!$E$10, "D", 'E1'!$E$12)/100,2)`
            "formula"
          );
        });
      });
      this.generujNazwyGrup(ss, name, column, row);
      ss.addRequestClear(name, column - 1, row + 5, 1, row_r - 5);
      this.wspolczynniki_alokacji.forEach((item, index) => {
        if (item.okres_id == okres_id) {
          //Log(0, "1 addRequestValue: item.elementy_przychodow_id: " + item.elementy_przychodow_id + " kod:" + (item.abonament ? item.abonament_kod_wspolczynnika : item.kod_wspolczynnika) + " index:" + index)
          ss.addRequestValue(
            name,
            column - 1,
            row + 3 + item.elementy_przychodow_id,
            item.abonament
              ? item.abonament_kod_wspolczynnika
              : item.kod_wspolczynnika
          );
        }
      });
      this.wspolczynniki_alokacji2.forEach((item, index) => {
        if (item.okres_id == okres_id) {
          //Log(0, "2 addRequestValue: item.elementy_przychodow_id: " + item.elementy_przychodow_id + " kod:" + (item.abonament ? item.abonament_kod_wspolczynnika : item.kod_wspolczynnika) + " index:" + index)
          ss.addRequestValue(
            name,
            column - 1,
            row + 3 + 1 + item.elementy_przychodow_id,
            item.abonament
              ? item.abonament_kod_wspolczynnika
              : item.kod_wspolczynnika
          );
        }
      });
      okres_id++;
      koszty_row.forEach((item, index) => {
        Log(0, "generujD koszty_row item:" + item + " index:", index);
        {
          let koszt = this.koszty.find(
            (element) =>
              element.koszty_rodzaje_id === item && element.koszty_typ_id === 1
          );
          Log(0, "generujC typ_id === 1 koszt:", koszt);
          if (koszt) {
            let koszt_value = 0;
            if (name === "D1") koszt_value = koszt.koszty_rok_obrachunkowy_1;
            if (name === "D2") koszt_value = koszt.koszty_rok_obrachunkowy_2;
            if (name === "D3") koszt_value = koszt.koszty_rok_obrachunkowy_3;
            ss.addRequestValue(
              name,
              column + this.grupy.length,
              row + arkusz_row[index] + 3,
              koszt_value,
              "number"
            );
          }
        }
        {
          let koszt = this.koszty.find(
            (element) =>
              element.koszty_rodzaje_id === item && element.koszty_typ_id === 2
          );
          Log(0, "generujC typ_id === 1 koszt:", koszt);
          if (koszt) {
            let koszt_value = 0;
            if (name === "D1") koszt_value = koszt.koszty_rok_obrachunkowy_1;
            if (name === "D2") koszt_value = koszt.koszty_rok_obrachunkowy_2;
            if (name === "D3") koszt_value = koszt.koszty_rok_obrachunkowy_3;
            ss.addRequestValue(
              name,
              column + this.grupy.length,
              row + arkusz_row[index] + 23,
              koszt_value,
              "number"
            );
          }
        }
      });
      ss.addRequestValue(name, column + this.grupy.length, 2, "ogółem");
      ss.addRequestBorderInner(name, 2, this.grupy.length + 2, 5, 40);
      ss.addRequestBorderInner(name, 3, this.grupy.length + 1, 1, 4);
      ss.addRequestMerge(name, 3, this.grupy.length, 1, 0);
    }
  };

  generujE = (ss: Spreadsheet) => {
    let names = ["E1", "E2", "E3"];
    let ogolem = [4, 6, 7, 8, 9, 10, 11, 12, 13];
    let row = 2,
      column = 4,
      row_r = 12,
      column_r = 1; //zero base
    let i = 0;
    for (let name of names) {
      ss.addRequestCopy(
        name,
        column,
        row,
        column_r,
        row_r,
        column,
        row,
        this.grupy.length,
        row_r
      );
      this.generujNazwyGrup(ss, name, column, row);
      let last_zestawienie_row = 0;
      this.zestawienie[i].forEach((zestawienie_row, zestawienie_row_index) => {
        last_zestawienie_row = zestawienie_row_index;
        if (zestawienie_row_index > 0) {
          ss.addRequestEmptyRow(
            name,
            0,
            zestawienie_row.length + 1,
            3 + zestawienie_row_index
          );
          ss.addRequestRowValue(zestawienie_row_index);
          zestawienie_row.forEach((item, index) => {
            Log(0, "generujE item:", item);
            typeof item === "string" &&
              Log(0, "generujE item.substr(9):", item.substr(9));
            typeof item === "string" && item.includes("<rowSpan>")
              ? ss.addRequestRowValue(item.substr(9))
              : typeof item === "string" && item.includes("<empty>")
              ? ss.addRequestRowValue("")
              : ss.addRequestRowValue(item);
          });
        }
      });
      this.zestawienie2[i].forEach((zestawienie_row, zestawienie_row_index) => {
        if (zestawienie_row_index > 0) {
          ss.addRequestEmptyRow(
            name,
            0,
            zestawienie_row.length + 1,
            3 + zestawienie_row_index + last_zestawienie_row
          );
          ss.addRequestRowValue(zestawienie_row_index + last_zestawienie_row);
          zestawienie_row.forEach((item, index) => {
            Log(0, "generujE item:", item);
            typeof item === "string" &&
              Log(0, "generujE item.substr(9):", item.substr(9));
            typeof item === "string" && item.includes("<rowSpan>")
              ? ss.addRequestRowValue(item.substr(9))
              : typeof item === "string" && item.includes("<empty>")
              ? ss.addRequestRowValue("")
              : ss.addRequestRowValue(item);
          });
        }
      });
      ss.addRequestValue(name, column + this.grupy.length, 2, "ogółem");
      ss.addRequestBorderInner(
        name,
        0,
        this.grupy.length + 5,
        2,
        this.zestawienie[i].length + this.zestawienie2[i].length
      );
      ss.addRequestBorderInner(name, 4, this.grupy.length + 1, 1, 1);
      ss.addRequestMerge(name, 4, this.grupy.length, 1, 0);
      ++i;
    }
  };

  generujF = (ss: any) => {
    let names = ["F1", "F2", "F3"];
    let row = 2,
      column = 2,
      row_r = 18,
      column_r = 1; //zero base
    for (let name of names) {
      ss.addRequestCopy(
        name,
        column,
        row,
        column_r,
        row + row_r,
        column,
        row,
        this.grupy.length,
        row + row_r
      );
      this.generujNazwyGrup(ss, name, column, row);
    }
    this.grupy.forEach((item, index) => {
      ss.addRequestValue(names[0], column + index, 9, item.liczba_odbiorcow_1);
      ss.addRequestValue(names[1], column + index, 9, item.liczba_odbiorcow_2);
      ss.addRequestValue(names[2], column + index, 9, item.liczba_odbiorcow_3);
      ss.addRequestValue(
        names[0],
        column + index,
        17,
        item.liczba_odbiorcow_scieki_1
      );
      ss.addRequestValue(
        names[1],
        column + index,
        17,
        item.liczba_odbiorcow_scieki_2
      );
      ss.addRequestValue(
        names[2],
        column + index,
        17,
        item.liczba_odbiorcow_scieki_3
      );
    });
    for (let name of names) {
      ss.addRequestBorderInner(name, 2, this.grupy.length, 1, 18);
      ss.addRequestMerge(name, 2, this.grupy.length - 1, 1, 0);
    }
  };

  generujG = async (ss: Spreadsheet) => {
    let names = ["G1", "G2", "G3"];
    let ogolem = [5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16];
    let row = 2,
      column = 2,
      row_r = 14,
      column_r = 1; //zero base
    for (let name of names) {
      ss.addRequestCopy(
        name,
        column,
        row + 1,
        column_r,
        row_r,
        column,
        row + 1,
        this.grupy.length,
        row_r
      );
      this.generujNazwyGrup(ss, name, column, row);
      ogolem.forEach((item, index) => {
        ss.addRequestValue(
          name,
          column + this.grupy.length,
          item,
          `=SUM(${ss.columnNames[column]}${item + 1}:${
            ss.columnNames[column + this.grupy.length - 1]
          }${item + 1})`,
          "formula"
        );
      });
      ss.addRequestValue(name, column + 1, 1, "", "");
      ss.addRequestValue(name, column + this.grupy.length, 2, "ogółem");
      ss.addRequestValue(
        name,
        column + this.grupy.length,
        17,
        `=${ss.columnNames[column + this.grupy.length]}${17}+${
          ss.columnNames[column + this.grupy.length]
        }${16}`,
        "formula"
      );
      ss.addRequestBorderInner(name, 2, this.grupy.length + 1, 1, 17);
      ss.addRequestMerge(name, 2, this.grupy.length, 1, 0);
    }
  };

  generujH = (ss: Spreadsheet) => {
    let names = ["H1", "H2", "H3"];
    let ogolem = [6, 7, 11, 12];
    let row = 2,
      column = 2,
      row_r = 12,
      column_r = 1; //zero base
    for (let name of names) {
      ss.addRequestCopy(
        name,
        column,
        row,
        column_r,
        row_r,
        column,
        row,
        this.grupy.length,
        row_r
      );
      this.generujNazwyGrup(ss, name, column, row);
      this.grupy.forEach((item, index) => {
        ss.addRequestValue(name, column + index, 7, item.przychody_woda);
        ss.addRequestValue(name, column + index, 12, item.przychody_scieki);
      });
      ogolem.forEach((item, index) => {
        ss.addRequestValue(
          name,
          column + this.grupy.length,
          item,
          `=SUM(${ss.columnNames[column]}${item + 1}:${
            ss.columnNames[column + this.grupy.length - 1]
          }${item + 1})`,
          "formula"
        );
      });
      ss.addRequestValue(name, column + 1, 1, "", "");
      ss.addRequestValue(name, column + this.grupy.length, 2, "ogółem");
      ss.addRequestBorderInner(name, 2, this.grupy.length + 1, 1, 13);
      ss.addRequestMerge(name, 2, this.grupy.length, 1, 0);
    }
  };

  generujNazwyGrup = (ss: any, name: string, x: number, y: number) => {
    Log(0, "generuGrupy this.grupy:", this.grupy);
    Log(0, "generuGrupy this.grupy.length:", this.grupy.length);
    ss.addRequestEmptyRow(name, x, this.grupy.length, y);
    this.grupy.forEach((item, index) => {
      ss.addRequestRowValue(item.nazwa);
    });
  };
}

export { router as WynikiSpreadsheetRouter };
