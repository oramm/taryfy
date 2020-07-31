const express = require("express");

import { KosztyRodzaje } from "./koszty_rodzaje";
import { Koszty } from "./koszty";
import { Log } from "./log";

var router = express.Router();

import { DB } from "./db_util";

router.post("/loaddata", (req, res) => {
  KosztySpreadsheet.loadData(res, req);
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

class KosztySpreadsheet {
  static async loadData(res: any, req: any) {
    await Koszty.Select(req, async (error, result) => {
      if (error) {
        res.status(500).json({
          message: "Databasa error: " + error,
        });
      } else if (result) {
        const sheet = await KosztySpreadsheet.getSpreadsheet();
        await KosztySpreadsheet.clearSpreadsheet(sheet);

        let koszty: string[][] = [];
        result.map((item) => {
          let row: string[] = [
            item.rodzaj_nazwa,
            item.rok_obrachunkowy_1,
            item.rok_obrachunkowy_2,
            item.rok_obrachunkowy_3,
            item.rok_nowych_taryf_1,
            item.rok_nowych_taryf_2,
            item.rok_nowych_taryf_3,
          ];
          koszty.push(row);
        });
        Log(0, "KosztySpreadsheet.loadData koszty:", koszty);
        let ret = await sheet.addRows(koszty);
        Log(0, "KosztySpreadsheet.loadData ret:", ret);
        res.status(200).send("Spreadsheet updated");
      }
    });
  }

  static async saveData(res: any, req: any) {
    const sheet = await KosztySpreadsheet.getSpreadsheet();
    const rows = await sheet.getRows();
    let data = [];
    for (let i: number = 0; i < rows.length; i++) {
      Log(0, "KosztySpreadsheet.saveData row[" + i + "]:", rows[i]);
      let data_row = {
        rodzaj_nazwa: rows[i][header[0]],
        rok_obrachunkowy_1: rows[i][header[1]],
        rok_obrachunkowy_2: rows[i][header[2]],
        rok_obrachunkowy_3: rows[i][header[3]],
        rok_nowych_taryf_1: rows[i][header[4]],
        rok_nowych_taryf_2: rows[i][header[5]],
        rok_nowych_taryf_3: rows[i][header[6]],
      }

      Log(0, "KosztySpreadsheet.saveData data_row]:", data_row);
      data.push(data_row);
    }
    //todo: check values
    req.body.data = data;
    await Koszty.Insert(res, req, true);
  }

  static async getSpreadsheet() {
    const doc = new GoogleSpreadsheet(
      "1Whi0wLCOyF1NSjc04vMDNXs3xcOvJL5Qd1FZV_gwnAk"
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
    const sheet = await KosztySpreadsheet.getSpreadsheet();
    const rows = await sheet.getRows();
    for (let i: number = rows.length - 1; i >= 0; i--) {
      Log(0, "KosztySpreadsheet.prognozuj row[" + i + "]:", rows[i]);
      Log(
        0,
        "KosztySpreadsheet.prognozuj row[" + i + "][header[3]]:",
        rows[i][header[3]]
      );
      Log(
        0,
        "KosztySpreadsheet.prognozuj row[" + i + "][header[3]]:",
        Number(rows[i][header[3]])
      );
      Log(
        0,
        "KosztySpreadsheet.prognozuj req.body.wskaznik_1:",
        req.body.wskaznik_1
      );
      Log(
        0,
        "KosztySpreadsheet.prognozuj Number(req.body.wskaznik_1):",
        Number(req.body.wskaznik_1)
      );
      rows[i][header[4]] =
        Number(rows[i][header[3]]) * Number(req.body.wskaznik_1);
      rows[i][header[5]] =
        Number(rows[i][header[3]]) * Number(req.body.wskaznik_2);
      rows[i][header[6]] =
        Number(rows[i][header[3]]) * Number(req.body.wskaznik_3);
      Log(
        0,
        "KosztySpreadsheet.prognozuj row[" + i + "][header[3]]:",
        rows[i][header[3]]
      );

      try {
        await rows[i].save();
      } catch (error) {
        res.status(500).json({
          message: "spreadsheet error:" + error,
        });
      }
    }
    res.end();
  }
}

export { router as KosztySpreadsheetRouter, KosztySpreadsheet };
