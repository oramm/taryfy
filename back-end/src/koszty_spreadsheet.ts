const express = require("express");
const util = require("util");

import { KosztyRodzaje } from "./koszty_rodzaje";
import { Koszty } from "./koszty";
import { Wnioski } from "./wnioski";
import { Log } from "./log";
import { Spreadsheet } from "./spreadsheet";

var router = express.Router();

import { DB } from "./db_util";

router.post("/loadspreadsheet", (req, res) => {
  KosztySpreadsheet.loadSpreadsheet(res, req);
});

router.post("/savedata", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  KosztySpreadsheet.saveData(res, req);
});

router.post("/insertrodzaje", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  KosztySpreadsheet.insertRodzajeToSpreadsheet(res, req);
});

router.post("/prognozuj", (req, res) => {
  if ((req.userData.uprawnienia & 1) !== 1) {
    return res.status(403).json({ message: "Brak uprawnień do zapisu" });
  }
  KosztySpreadsheet.prognozuj(res, req);
});

const { GoogleSpreadsheet } = require("google-spreadsheet");

const header = [
  "Wyszczególnienie",
  "Rok obrachunkowy (2017)",
  "Rok obrachunkowy (2018)",
  "Rok obrachunkowy (2019) - BAZA DO PROGNOZY",
  "1. rok obowiązywania nowych taryf",
  "2. rok obowiązywania nowych taryf",
  "3. rok obowiązywania nowych taryf",
];

let template_file_id = "1JKImzOGCm45kVXHPty3ZAeY7mDLbThIFyiLEqwWw3SI";
let file_link: "https://docs.google.com/spreadsheets/d/1JKImzOGCm45kVXHPty3ZAeY7mDLbThIFyiLEqwWw3SI/edit?usp=drivesdk&rm=minimal";
//let file_id = "1v3vuARgN5HfPngYa5OcU4Oqjm63EswR1oX8_xXmWVkQ";
//let file_link: "https://docs.google.com/spreadsheets/d/1v3vuARgN5HfPngYa5OcU4Oqjm63EswR1oX8_xXmWVkQ/edit?usp=drivesdk&rm=minimal";
let sheet_name = "koszty";
let row_y = 3;
let row_yr = 21;

class KosztySpreadsheet {
  static async loadSpreadsheet(res: any, req: any) {
    let wnioski_data: any;
    Wnioski.SelectSpreadsheet(req)
      .then((wnioski_res) => {
        wnioski_data = wnioski_res;
        Log(0, "KosztySpreadsheet loadSpreadsheet wnioski:", wnioski_data);
        return Koszty.SelectInternal(req);
      })
      .then(async (koszty: any) => {
        Log(0, "KosztySpreadsheet loadSpreadsheet koszty:", koszty);
        let ss = new Spreadsheet();
        let x = 1,
          xr = 7;
        let file_id = template_file_id;
        if (wnioski_data[0].spreadsheet_koszty_id) {
          file_id = wnioski_data[0].spreadsheet_koszty_id;
        } else {
          let file_name =
            "koszty " +
            wnioski_data[0].klient_nazwa +
            " " +
            wnioski_data[0].wniosek_nazwa;
          Log(0, "KosztySpreadsheet loadSpreadsheet file_name:", file_name);
          await ss.copyTemplate(file_id, file_name).then(() => {
            file_id = ss.file_id;
            return Wnioski.UpdateSpreadsheetKosztyInternal(
              req.body.wniosek_id,
              file_id
            );
          });
        }
        Log(0, "KosztySpreadsheet loadSpreadsheet file_id:", file_id);
        return (
          ss
            .setFileId(file_id)
            //          .then(() => ss.copyTemplate(file_id, "koszty kopia"))
            .then(() => ss.connectSheets())
            .then(() => ss.loadSheets())
            .then(() => ss.createEmptyRequest())
            .then(() => ss.addRequestClear(sheet_name, x, row_y, xr, 10))
            .then(() => ss.addRequestClear(sheet_name, x, 14, xr, 7))
            .then(() => {
              koszty.forEach((item, index) => {
                if(item.koszty_rodzaje_id == 1) return;
                ss.addRequestEmptyRow(
                  sheet_name,
                  x,
                  xr,
                  item.koszty_rodzaje_id
                );
                ss.addRequestRowValue(item.rok_obrachunkowy_1);
                ss.addRequestRowValue(item.rok_obrachunkowy_2);
                ss.addRequestRowValue(item.rok_obrachunkowy_3);
                ss.addRequestRowValue(item.rok_nowych_taryf_1);
                ss.addRequestRowValue(item.rok_nowych_taryf_2);
                ss.addRequestRowValue(item.rok_nowych_taryf_3);
              });
            })
            .then(() => {
              ss.batchUpdate();
            })
            .then(() => {
              Log(0, "KosztySpreadsheet loadSpreadsheet link:", ss.getLink());
              res.status(200).json({
                link: ss.getLink(),
              });
            })
        );
      })
      .catch((error) => {
        Log(0, "Wyniki loadSpreadsheet error:", error);
        res.status(400).json({
          err: error,
        });
      });
  }

  // static async loadSpreadsheet_back(res: any, req: any) {
  //   Koszty.Select(req, async (error, result) => {
  //     if (error) {
  //       res.status(500).json({
  //         message: "Databasa error: " + error,
  //       });
  //     } else {
  //       //if (result.length > 0) {
  //       Log(0, "KosztySpreadsheet result:", result);
  //       let ss = new Spreadsheet();
  //       let x = 1,
  //         xr = 7;
  //       ss.setFileId(file_id)
  //         //          .then(() => ss.copyTemplate(file_id, "koszty kopia"))
  //         .then(() => ss.connectSheets())
  //         .then(() => ss.loadSheets())
  //         .then(() => ss.createEmptyRequest())
  //         .then(() => ss.addRequestClear(sheet_name, x, row_y, xr, 10))
  //         .then(() => ss.addRequestClear(sheet_name, x, 14, xr, 8))
  //         .then(() => {
  //           result.forEach((item, index) => {
  //             ss.addRequestEmptyRow(sheet_name, x, xr, item.koszty_rodzaje_id);
  //             ss.addRequestRowValue(item.rok_obrachunkowy_1);
  //             ss.addRequestRowValue(item.rok_obrachunkowy_2);
  //             ss.addRequestRowValue(item.rok_obrachunkowy_3);
  //             ss.addRequestRowValue(item.rok_nowych_taryf_1);
  //             ss.addRequestRowValue(item.rok_nowych_taryf_2);
  //             ss.addRequestRowValue(item.rok_nowych_taryf_3);
  //           });
  //         })
  //         .then(() => {
  //           ss.batchUpdate();
  //         })
  //         // .then(() => ss.getWebLink())
  //         // .then((link)=>
  //         .then(() => {
  //           Log(0, "KosztySpreadsheet loadData link:", ss.getLink());
  //           res.status(200).json({
  //             link: ss.getLink(),
  //           });
  //         })
  //         .catch((error) => {
  //           Log(0, "Wyniki KosztySpreadsheet 1 error:", error);
  //           res.status(400).json({
  //             err: error,
  //           });
  //         });
  //     }
  //     // else{
  //     //   Log(0, "KosztySpreadsheet loadData no data");
  //     //   res.status(200).json({
  //     //     link: file_link,
  //     //   });
  //     // }
  //   });
  // }

  //   static async loadData_backup(res: any, req: any) {
  //     Koszty.Select(req, async (error, result) => {
  //       if (error) {
  //         res.status(500).json({
  //           message: "Databasa error: " + error,
  //         });
  //       } else
  //       {
  //       //if (result.length > 0) {
  //       Log(0, "KosztySpreadsheet result:", result);
  //         let ss = new Spreadsheet();
  //         let x = 1, xr = 7;
  //         ss.setFileId(file_id)
  // //          .then(() => ss.copyTemplate(file_id, "koszty kopia"))
  //           .then(() => ss.connectSheets())
  //           .then(() => ss.loadSheets())
  //           .then(() => ss.loadValues("B2:D22"))
  //           .then(() => ss.createEmptyRequest())
  //           .then(() => ss.addRequestClear(sheet_name,x,row_y,xr,row_yr))
  //           .then(()=>{
  //             result.forEach((item, index) => {
  //               ss.addRequestEmptyRow(sheet_name, x, xr, 1 + index);
  //               ss.addRequestRowValue(item.rok_obrachunkowy_1);
  //               ss.addRequestRowValue(item.rok_obrachunkowy_2);
  //               ss.addRequestRowValue(item.rok_obrachunkowy_3);
  //               ss.addRequestRowValue(item.rok_nowych_taryf_1);
  //               ss.addRequestRowValue(item.rok_nowych_taryf_2);
  //               ss.addRequestRowValue(item.rok_nowych_taryf_3);
  //             });
  //           })
  //           .then(() => {return ss.batchUpdate()})
  //           .then(() => ss.getWebLink())
  //           .then((link)=>
  //             {
  //               Log(0, "KosztySpreadsheet loadData link:", link);
  //               res.status(200).json({
  //                 link: link,
  //               });
  //           })
  //           // .then(() =>{
  //           //   Log(0, "KosztySpreadsheet loadData link:", ss.getLink());
  //           //   res.status(200).json({
  //           //     link: ss.getLink(),
  //           //   });
  //           // })
  //           .catch((error) => {
  //             Log(0, "Wyniki KosztySpreadsheet error:", error);
  //             res.status(400).json({
  //               err: error,
  //             });
  //           });
  //       }
  //       // else{
  //       //   Log(0, "KosztySpreadsheet loadData no data");
  //       //   res.status(200).json({
  //       //     link: file_link,
  //       //   });
  //       // }
  //     });
  //   }

  static async saveData(res: any, req: any) {
    let ss = new Spreadsheet();
    Wnioski.SelectSpreadsheet(req).then((select_res: any) => {
      Log(0, "KosztySpreadsheet.saveData select_res:", select_res);
      ss.setFileId(select_res[0].spreadsheet_koszty_id)
        .then(() => ss.connectSheets())
        .then(() => ss.loadSheets())
        .then(() => {
          let resp = ss.loadValues("B2:G21");
          resp.then((resp: any) => {
            let data = [];
            resp.data.values &&
              resp.data.values.forEach((item, index) => {
                Log(0, "KosztySpreadsheet.saveData item:", item);
                if (
                  [1, 12].includes(index) ||
                  Object.keys(item).length === 0
                )
                  return;
                let data_row = {
                  koszty_rodzaje_id: index + 1,
                  rok_obrachunkowy_1: item[0],
                  rok_obrachunkowy_2: item[1],
                  rok_obrachunkowy_3: item[2],
                  rok_nowych_taryf_1: item[3],
                  rok_nowych_taryf_2: item[4],
                  rok_nowych_taryf_3: item[5],
                };
                Log(0, "KosztySpreadsheet.saveData data_row:", data_row);
                data.push(data_row);
              });
            req.body.data = data;
            Koszty.Insert(res, req, true);
          });
        });
    });
  }

  static async getSpreadsheet() {
    const doc = new GoogleSpreadsheet(
      //"1Rn-PhIxVupxK9mLC5zjBQthCsUOQ4_UH3GIn7P_FJyw" // local
      "1JKImzOGCm45kVXHPty3ZAeY7mDLbThIFyiLEqwWw3SI" // server
    );
    await doc.useServiceAccountAuth(require("./creds-from-google.json"));

    await doc.loadInfo(); // loads document properties and worksheets
    Log(0, doc.title);
    const sheet = await doc.sheetsByIndex[0];
    Log(0, "updateSpreadsheet title:", sheet.title);
    Log(0, "updateSpreadsheet sheet:", sheet);
    return sheet; // or use doc.sheetsById[id]
  }

  static async clearSpreadsheet(sheet: any) {
    const rows = await sheet.getRows();
    Log(0, "clearSpreadsheet rows.length:", rows.length);

    for (let i: number = rows.length - 1; i >= 0; i--) {
      Log(0, "updateSpreadsheet rows[i]:", i);
      await rows[i].del();
    }
  }

  static async insertRodzajeToSpreadsheet(
    // res: { send: (arg0: any) => void },
    res: any,
    req: { body: { nazwa: any; id: string } }
  ) {
    const sheet = await KosztySpreadsheet.getSpreadsheet();
    await KosztySpreadsheet.clearSpreadsheet(sheet);

    KosztyRodzaje.Select(
      {
        send: async (select_res: any) => {
          let koszty_rodzaje: string[][] = [];
          await select_res.map(async (item) => {
            let row: string[] = [item.nazwa];
            koszty_rodzaje.push(row);
          });
          Log(0, "updateSpreadsheet koszty_rodzaje:", koszty_rodzaje);
          let ret = await sheet.addRows(koszty_rodzaje);
          Log(0, "updateSpreadsheet ret:", ret);
          res.status(200).send("Spreadsheet updated");
        },
      },
      req
    );
  }

  static async prognozuj(res: any, req: any) {
    let ss = new Spreadsheet();
    Log(0, "prognozuj");
    Wnioski.SelectSpreadsheet(req).then((select_res: any) => {
      Log(0, "KosztySpreadsheet.saveData select_res:", select_res);
      ss.setFileId(select_res[0].spreadsheet_koszty_id)
        .then(() => ss.connectSheets())
        .then(() => ss.loadSheets())
        .then(() => {
          let resp = ss.loadValues("B2:D21");
          return resp.then((resp: any) => {
            ss.createEmptyRequest()
              .then(() => {
                resp.data.values &&
                  resp.data.values.forEach((item, index) => {
                    if ([0, 1, 12].includes(index)) return;
                    ss.addRequestEmptyRow(sheet_name, 4, 7, 1 + index);
                    ss.addRequestRowValue(
                      Number(item[2]) * Number(req.body.wskaznik_1)
                    );
                    ss.addRequestRowValue(
                      Number(item[2]) * Number(req.body.wskaznik_2)
                    );
                    ss.addRequestRowValue(
                      Number(item[2]) * Number(req.body.wskaznik_3)
                    );
                  });
              })
              .then(() => {
                ss.batchUpdate();
              })
              //          .then(() => ss.getWebLink())
              .then(() => {
                Log(0, "prognozuj Spreadsheet updated");
                res.status(200).send("Spreadsheet updated");
              });
          });
        })
        .catch((error) => {
          Log(0, "prognozuj Spreadsheet updated error", error);
          res.status(400).json({
            message: "spreadsheet prognozuj error:" + error,
          });
        });
    });
  }
}
// class KosztySpreadsheet {

//   static async loadData(res: any, req: any) {
//     await Koszty.Select(req, async (error, result) => {
//       if (error) {
//         res.status(500).json({
//           message: "Databasa error: " + error,
//         });
//       } else if (result) {
//         const sheet = await KosztySpreadsheet.getSpreadsheet();
//         await KosztySpreadsheet.clearSpreadsheet(sheet);

//         let koszty: string[][] = [];
//         result.map((item) => {
//           let row: string[] = [
//             item.rodzaj_nazwa,
//             item.rok_obrachunkowy_1,
//             item.rok_obrachunkowy_2,
//             item.rok_obrachunkowy_3,
//             item.rok_nowych_taryf_1,
//             item.rok_nowych_taryf_2,
//             item.rok_nowych_taryf_3,
//           ];
//           koszty.push(row);
//         });
//         Log(0, "KosztySpreadsheet.loadData koszty:", koszty);
//         let ret = await sheet.addRows(koszty);
//         Log(0, "KosztySpreadsheet.loadData ret:", ret);

//         await KosztyRodzaje.Select(
//           {
//             send: async (select_res: any) => {
//               let koszty_rodzaje: string[][] = [];
//               await select_res.map(async (item) => {
//                 let row: string[] = [item.nazwa];
//                 koszty_rodzaje.push(row);
//               });
//               Log(0, "KosztySpreadsheet.loadData koszty_rodzaje:", koszty_rodzaje);
//               let ret = await sheet.addRows(koszty_rodzaje);
//               Log(0, "KosztySpreadsheet.loadData ret:", ret);
//             },
//           },
//           req
//         );

//         res.status(200).send("Spreadsheet updated");
//       }
//     });
//   }

//   static async saveData(res: any, req: any) {
//     const sheet = await KosztySpreadsheet.getSpreadsheet();
//     const rows = await sheet.getRows();
//     let data = [];
//     for (let i: number = 0; i < rows.length; i++) {
//       Log(0, "KosztySpreadsheet.saveData row[" + i + "]:", rows[i]);
//       let data_row = {
//         rodzaj_nazwa: rows[i][header[0]],
//         rok_obrachunkowy_1: rows[i][header[1]],
//         rok_obrachunkowy_2: rows[i][header[2]],
//         rok_obrachunkowy_3: rows[i][header[3]],
//         rok_nowych_taryf_1: rows[i][header[4]],
//         rok_nowych_taryf_2: rows[i][header[5]],
//         rok_nowych_taryf_3: rows[i][header[6]],
//       }

//       Log(0, "KosztySpreadsheet.saveData data_row]:", data_row);
//       data.push(data_row);
//     }
//     //todo: check values
//     req.body.data = data;
//     await Koszty.Insert(res, req, true);
//   }

//   static async getSpreadsheet() {
//     const doc = new GoogleSpreadsheet(
//       "1Whi0wLCOyF1NSjc04vMDNXs3xcOvJL5Qd1FZV_gwnAk"
//     );
//     await doc.useServiceAccountAuth(require("./creds-from-google.json"));

//     await doc.loadInfo(); // loads document properties and worksheets
//     Log(0, doc.title);
//     const sheet = await doc.sheetsByIndex[0];
//     Log(0, "updateSpreadsheet title:", sheet.title);
//     Log(0, "updateSpreadsheet sheet:", sheet);
//     return sheet; // or use doc.sheetsById[id]
//   }

//   static async clearSpreadsheet(sheet: any) {
//     const rows = await sheet.getRows();
//     Log(0, "clearSpreadsheet rows.length:", rows.length);

//     for (let i: number = rows.length - 1; i >= 0; i--) {
//       Log(0, "updateSpreadsheet rows[i]:", i);
//       await rows[i].del();
//     }
//   }

//   static async insertRodzajeToSpreadsheet(
//     // res: { send: (arg0: any) => void },
//     res: any,
//     req: { body: { nazwa: any; id: string } }
//   ) {
//     const sheet = await KosztySpreadsheet.getSpreadsheet();
//     await KosztySpreadsheet.clearSpreadsheet(sheet);

//     KosztyRodzaje.Select(
//       {
//         send: async (select_res: any) => {
//           let koszty_rodzaje: string[][] = [];
//           await select_res.map(async (item) => {
//             let row: string[] = [item.nazwa];
//             koszty_rodzaje.push(row);
//           });
//           Log(0, "updateSpreadsheet koszty_rodzaje:", koszty_rodzaje);
//           let ret = await sheet.addRows(koszty_rodzaje);
//           Log(0, "updateSpreadsheet ret:", ret);
//           res.status(200).send("Spreadsheet updated");
//         },
//       },
//       req
//     );
//   }

//   static async prognozuj(res: any, req: any) {
//     const sheet = await KosztySpreadsheet.getSpreadsheet();
//     const rows = await sheet.getRows();
//     for (let i: number = rows.length - 1; i >= 0; i--) {
//       Log(0, "KosztySpreadsheet.prognozuj row[" + i + "]:", rows[i]);
//       Log(
//         0,
//         "KosztySpreadsheet.prognozuj row[" + i + "][header[3]]:",
//         rows[i][header[3]]
//       );
//       Log(
//         0,
//         "KosztySpreadsheet.prognozuj row[" + i + "][header[3]]:",
//         Number(rows[i][header[3]])
//       );
//       Log(
//         0,
//         "KosztySpreadsheet.prognozuj req.body.wskaznik_1:",
//         req.body.wskaznik_1
//       );
//       Log(
//         0,
//         "KosztySpreadsheet.prognozuj Number(req.body.wskaznik_1):",
//         Number(req.body.wskaznik_1)
//       );
//       rows[i][header[4]] =
//         Number(rows[i][header[3]]) * Number(req.body.wskaznik_1);
//       rows[i][header[5]] =
//         Number(rows[i][header[3]]) * Number(req.body.wskaznik_2);
//       rows[i][header[6]] =
//         Number(rows[i][header[3]]) * Number(req.body.wskaznik_3);
//       Log(
//         0,
//         "KosztySpreadsheet.prognozuj row[" + i + "][header[3]]:",
//         rows[i][header[3]]
//       );

//       try {
//         await rows[i].save();
//       } catch (error) {
//         res.status(500).json({
//           message: "spreadsheet error:" + error,
//         });
//       }
//     }
//     res.end();
//   }
// }

export { router as KosztySpreadsheetRouter, KosztySpreadsheet };
