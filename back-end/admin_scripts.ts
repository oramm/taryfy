import { uzytkownicyInsert } from "./src/uzytkownicy";
import { klienciInsert } from "./src/klienci";

let add_user = async (data: {
  nazwa: string;
  uprawnienia: string;
  haslo: string;
  klient_nazwa: string;
}) => {
  return await uzytkownicyInsert(data);
};

let add_client = async (
  klient: { nazwa: string; opis: string; adres: string; nip: string },
  users?: { nazwa: string; uprawnienia: string; haslo: string }[]
) => {
  let ret = await klienciInsert(klient);
  if (users) {
    for (let i = 0; i < users.length; i++) {
      ret = await add_user({
        klient_nazwa: klient.nazwa,
        nazwa: users[i].nazwa,
        uprawnienia: users[i].uprawnienia,
        haslo: users[i].haslo,
      });
    }
  }
  return ret;
};

export { add_user, add_client };
