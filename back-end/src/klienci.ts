const express = require("express");
var router = express.Router();

import { Log } from "./log";
import { DB } from "./db_util";

// this functionality is only available via script admin_add_user
// router.post("/insert", (req, res) => {
//   Klienci.insert(res, req);
// });

class Klienci {
  static async insert(klient: {
    nazwa: string;
    opis: string;
    adres: string;
    nip: string;
  }) {
    Log(0, "Klienci.insert received klient: ", klient);
    let query = "SELECT * from klienci where nazwa =" + DB.escape(klient.nazwa);

    return await DB.executeAsync(query, null, async (error, result) => {
      Log(0, "Klienci.insert query SELECT finished");
      let size: string = result.length;
      if (error) {
        Log(0, "Nie udało się dodać klienta: ", klient.nazwa);
      }
      if (Number(size) > 0) {
        Log(
          0,
          "Nie udało się dodać klienta, klient już istnieje: ",
          klient.nazwa
        );
      } else {
        let query =
          "INSERT INTO klienci (nazwa, opis, adres, nip) SELECT "
          + DB.escape(klient.nazwa)
          + ","
          + DB.escape(klient.opis)
          + ","
          + DB.escape(klient.adres)
          + ","
          + DB.escape(klient.nip)
          + " FROM dual WHERE NOT EXISTS (SELECT * FROM klienci WHERE nazwa="
          + DB.escape(klient.nazwa)
          + ");"
          ;
        return await DB.executeAsync(query, null, (error, result) => {
          if (error)
            Log(0, "Nie udało się dodać klienta o nazwie: ", klient.nazwa);
          else if (result) Log(0, "Klient dodany: ", klient.nazwa);
        });
        //Log(0, "Klienci.insert query INSERT finised");
      }
    });
    Log(0, "Klienci.insert fineshed: ", klient);
  }
}

let klienciInsert = Klienci.insert;

export { router as klienciRouter, klienciInsert };
