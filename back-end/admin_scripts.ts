import { uzytkownicyInsert } from "./src/uzytkownicy";
import { klienciInsert } from "./src/klienci";

let add_user = (data: { nazwa: string; haslo: string; klient_nazwa: string }) => {
  let req = { body: data };
  let res = {
    status: (a: any) => {
      return { json: (a: any) => {} };
    },
    json: (a: any) => {},
  };

  uzytkownicyInsert(res, req);
};

let add_client = (
  klient: { nazwa: string; opis: string; adres: string; nip: string },
  users?: { nazwa: string; haslo: string }[]
) => {
  let req = { body: klient };
  let res = {
    status: (a: any) => {
      return { json: (a: any) => {} };
    },
    json: (a: any) => {},
    send: (send_res: any) => {
      console.log("add_client res:", send_res);
      users && users.map((item) => {
        add_user({
          klient_nazwa: klient.nazwa,
          nazwa: item.nazwa,
          haslo: item.haslo,
        });
      });
    },
  };

  klienciInsert(res, req);
};

export {add_user, add_client};