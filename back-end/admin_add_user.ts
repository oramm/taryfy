import { add_user, add_client } from "./admin_scripts";

//dodanie klienta z listą użytkowników
add_client(
  {
    nazwa: "nazwa klienta",
    opis: "opis klienta",
    adres: "adres klienta",
    nip: "nip"
  },
  [
    { nazwa: "a", haslo: "a" },
    { nazwa: "", haslo: "" },
  ]
);

//dodanie samego klienta
add_client({
  nazwa: "nazwa klienta 2",
  opis: "opis klienta 2",
  adres: "adres klienta 2",
  nip: "nip 2"
});

//dodanie użytkowników do istniejącego klienta
add_user({ nazwa: "b", haslo: "b", klient_nazwa: "nazwa klienta 2" });
