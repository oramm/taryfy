## Instalacja

Zainstaluj [Node.js](https://nodejs.org/en/download) wersja 12.16.2 (z npm 6.14.4).

Sprawdzenie aktualnie zinstalowanej wersji:
`node -v`

Pobierz pliki z repozytorum na dysk lokalny.

Przejdz do folderu `./back-end`.

Zainstaluj zależne pakiety komendę:
`npm i`

## Uruchomienie

W folderze `./back-end` uruchom komendę:
`npm start`

Poprawnie uruchomiony serwer wyświetli komunikat:
`Wnioski Taryfowe back-end server is listening on port: [ 5000 ]`

## Utworzenie bazy

Bazę można utworzyć skryptem ruchamianym komendą:
`ts-node admin_create_db`

## Dodawanie klientów i użytkowników

Dodawanie użytkowników i/lub klientów wykonywane jest skryptem:
`admin_add_user.ts`

Komenda uruchamiająca:
`ts-node admin_add_user`

Dodawanie klientów można wykonać również bezpośrednio na bazie danych, natomiast użtykownicy mogą by dodawani jedynie za pomocą skryptu, ze względu na przechowywanie hasła w formie haszowanej.
