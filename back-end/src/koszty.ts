import { DB } from "./db_util";
import { RodzajeKosztow } from "./rodzaje_kosztow";
import {Log} from "./log"

const { GoogleSpreadsheet } = require("google-spreadsheet");

export class Koszty {
  static async updateSpreadsheet(
    res: { send: (arg0: any) => void },
    req: { body: { nazwa: any; id: string } }
  ) {
    const doc = new GoogleSpreadsheet(
      "1Whi0wLCOyF1NSjc04vMDNXs3xcOvJL5Qd1FZV_gwnAk"
    );
    await doc.useServiceAccountAuth(require("./creds-from-google.json"));

    await doc.loadInfo(); // loads document properties and worksheets
    Log(0,doc.title);

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    Log(0,"title:", sheet.title);
    Log(0,"sheet:", sheet);

    const rows = await sheet.getRows();
    Log(0,"rows.length:", rows.length);

    for (let i: number = rows.length - 1; i >= 0; i--) {
      Log(0,"rows[i]:", i);
      await rows[i].del();
    }

    RodzajeKosztow.Select(
      {
        send: async (res: any) => {
          let rodzaje_kosztow: string[][] = [];
          res.map(async item => {
             let row: string[] =[item.nazwa];
            rodzaje_kosztow.push(row);
          });
          Log(0,"rodzaje_kosztow:", rodzaje_kosztow);          
          await sheet.addRows(rodzaje_kosztow);
        }
      },
      req
    );
  }
}
