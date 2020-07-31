import { add_user, add_client } from "./admin_scripts";
(async () => {
  //dodanie klienta z listą użytkowników

  await add_client(
    {
      nazwa: "nazwa klienta",
      opis: "opis klienta",
      adres: "adres klienta",
      nip: "nip",
    },
    [
      { nazwa: "a", uprawnienia: "0", haslo: "a" },
      { nazwa: "", uprawnienia: "1", haslo: "" },
    ]
  );
  //uprawnienia: "0" - odczyt
  //uprawnienia: "1" - odczyt i zapis

  //dodanie samego klienta
  await add_client({
    nazwa: "nazwa klienta 2",
    opis: "opis klienta 2",
    adres: "adres klienta 2",
    nip: "nip 2",
  });

  //dodanie użytkowników do istniejącego klienta
  await add_user({ nazwa: "aa", uprawnienia: "1", haslo: "aa", klient_nazwa: "nazwa klienta 2" });
  await add_user({ nazwa: "bb", uprawnienia: "1", haslo: "bb", klient_nazwa: "nazwa klienta 2" });

  console.log("koniec");
})();
