import { RodzajeKosztow } from "./koszty_rodzaje";
import { Log } from "./log";

const { GoogleSpreadsheet } = require("google-spreadsheet");

export class Koszty {
  static async updateSpreadsheet(
    // res: { send: (arg0: any) => void },
    res: any,
    req: { body: { nazwa: any; id: string } }
  ) {
    const doc = new GoogleSpreadsheet(
      "1Whi0wLCOyF1NSjc04vMDNXs3xcOvJL5Qd1FZV_gwnAk"
    );
    await doc.useServiceAccountAuth(require("./creds-from-google.json"));

    await doc.loadInfo(); // loads document properties and worksheets
    Log(0, doc.title);

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    Log(0, "updateSpreadsheet title:", sheet.title);
    Log(0, "updateSpreadsheet sheet:", sheet);

    const rows = await sheet.getRows();
    Log(0, "updateSpreadsheet rows.length:", rows.length);

    for (let i: number = rows.length - 1; i >= 0; i--) {
      Log(0, "updateSpreadsheet rows[i]:", i);
      await rows[i].del();
    }

    RodzajeKosztow.Select(
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
        }
      },
      req
    );
  }
}
