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
      { nazwa: "a", haslo: "a" },
      { nazwa: "", haslo: "" },
    ]
  );

  //dodanie samego klienta
  await add_client({
    nazwa: "nazwa klienta 2",
    opis: "opis klienta 2",
    adres: "adres klienta 2",
    nip: "nip 2",
  });

  //dodanie użytkowników do istniejącego klienta
  await add_user({ nazwa: "aa", haslo: "aa", klient_nazwa: "nazwa klienta 2" });
  await add_user({ nazwa: "bb", haslo: "bb", klient_nazwa: "nazwa klienta 2" });

  console.log("koniec");
})();
