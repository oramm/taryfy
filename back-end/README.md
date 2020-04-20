## Instalacja

Zainstaluj Node.js wersja 12.16.2 (z npm 6.14.4): [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
Sprawdzenie aktualnie zinstalowanej wersji:
### `node -v`

Pobierz pliki z repozytorum na dysk lokalny.

Przejdz do folderu "./back-end/".

W celu instalacji niezbędnych pakietów uruchom w terminalu komendę:

### `npm i`


## Uruchomienie

Będąc w folderze "./back-end/" uruchom komendę:

### `npm start`

Poprawnie uruchomiony serwer wyświetli komunikat:
### Taryfy back-end listening on port:  [ 5000 ]


## Utworzenie bazy

Bazę można utworzyć skryptem ruchamianym  komendą:
### `ts-node admin_create_db'

## Dodawanie klientów i użytkowników

W celu dodania klientów i/lub użytkowników należy wyedytować skrypt "add_user.ts" a następnie uruchomić go komendą:
### `ts-node add_user`

Dodawanie klientów można wykonać również bezpośrednio na bazie danych, natomist użtykownicy mogą by dodawani jedynie za pomocą skryptu, ze względu na przechowywanie hasła w formie haszowanej.
