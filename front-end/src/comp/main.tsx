import { Component } from "react";
import * as React from "react";
import { MDBBox, MDBContainer } from "mdbreact";

import Menu010 from "./menu010_wnioski";
import Menu020 from "./menu020_zakladki";
import Menu030 from "./menu030_podmenu";
import { Screen005_login } from "./screen005_login";
import { Screen010_zalozenia } from "./screen010_zalozenia";
import { Screen020_koszty } from "./screen020_koszty";
import { Screen040_popyt } from "./screen040_popyt";
import { Screen050_grupy_odbiorcow } from "./screen050_grupy_odbiorcow";
import Screen900 from "./screen900_";
import { setPostToken, setPostModals } from "./post";
import {
  ModalDialogsComp,
  ModalDialogs,
  ModalDialogsGetFake,
} from "./modal_dialogs";

type Props = {};

type State = {
  uzytkownik_nazwa: string;
  uzytkownik_zapis: boolean;
  token: string;
  wniosek_id: number;
  menu010: string;
  menu020: number;
  menu020_name: string;
  menu030: number;
};

let Menu030Items: string[][] = [
  [],
  [
    "Koszty - Woda",
    "Koszty - Ścieki",
    "Koszty pośrednie",
    "Koszty ogólne",
    "Koszty inne",
  ],
  [],
  ["Popyt - Woda", "Popyt - Ścieki"],
  ["Grupy Odbiorców - Woda", "Grupy Odbiorców - Ścieki"],
];

export default class Main extends Component<Props, State> {
  state: State = {
    uzytkownik_nazwa: "",
    uzytkownik_zapis: false,
    token: "",
    wniosek_id: 0,
    menu010: "",
    menu020: 0,
    menu020_name: "",
    menu030: 0,
  };

  _modal_dialogs: ModalDialogs = ModalDialogsGetFake();

  componentDidMount() {}

  onChangeMenu010Wnioski = (name: string, wniosek_id: number) => {
    console.log("changeMenu010 " + name + " wniosek_id: " + wniosek_id);
    this.setState({ menu010: name, wniosek_id: wniosek_id }, () =>
      console.dir(this.state)
    );
  };

  onChangeMenu020Zakladki = (value: any, name: string) => {
    console.log("onChangeMenu020 name: " + name + " value:" + value);
    this.setState({ menu020: value, menu020_name: name }, () => {
      console.dir("onChangeMenu020 after state change");
      console.dir(this.state);
    });
  };

  onChangeMenu030Podmenu(value: any) {
    console.log("changeMenu030 " + value);
    this.setState({ menu030: value }, () => console.dir(this.state));
  }

  onChangeScreen(value: any) {
    console.log("onChangeScreen " + value);
    this.setState({ menu030: value }, () => console.dir(this.state));
  }

  clearToken = () => {
    setPostToken("");
    this.setState({ token: "" });
  };

  onLoggedin = (data: any) => {
    console.log("Main onLoggedin data: ", data);
    setPostToken(data.token);
    this.setState({ token: data.token });
  };

  render() {
    return (
      <>
        <ModalDialogsComp
          set_modal_dialog_callbacks={(dialogs) => {
            this._modal_dialogs = dialogs;
            setPostModals(dialogs);
            console.log("main ModalDialogs:", this._modal_dialogs);
          }}
        />
        {this.state.token === "" ? (
          <>
            <Screen005_login
              callback={this.onLoggedin}
              modal_dialogs={this._modal_dialogs}
            />
          </>
        ) : (
          <>
            <Menu010
              callback={this.onChangeMenu010Wnioski}
              logout_callback={this.clearToken}
              modal_dialogs={this._modal_dialogs}
            />
            <Menu020 callback={this.onChangeMenu020Zakladki} />
            {Menu030Items[this.state.menu020] &&
            Menu030Items[this.state.menu020].length > 0 ? (
              <Menu030
                callback={(value: any) => this.onChangeMenu030Podmenu(value)}
                menu_items={Menu030Items[this.state.menu020]}
              />
            ) : (
              <></>
            )}
            <MDBBox tag="h3" display="flex" m="3" className="left">
              {this.state.menu020_name}
            </MDBBox>
            <MDBContainer>
              {this.state.menu020 === 0 ? (
                <Screen010_zalozenia wniosek_id={this.state.wniosek_id} />
              ) : this.state.menu020 === 1 ? (
                <Screen020_koszty
                  wniosek_id={this.state.wniosek_id}
                  typ_id={this.state.menu030 + 1}
                  callback={(value: any) => this.onChangeScreen(value)}
                  modal_dialogs={this._modal_dialogs}
                />
              ) : this.state.menu020 === 3 ? (
                <Screen040_popyt
                  wniosek_id={this.state.wniosek_id}
                  typ_id={this.state.menu030 + 1}
                  callback={(value: any) => this.onChangeScreen(value)}
                  modal_dialogs={this._modal_dialogs}
                />
              ) : this.state.menu020 === 4 ? (
                <Screen050_grupy_odbiorcow
                  wniosek_id={this.state.wniosek_id}
                  typ_id={this.state.menu030 + 1}
                  callback={(value: any) => this.onChangeScreen(value)}
                  modal_dialogs={this._modal_dialogs}
                />
              ) : (
                <Screen900 nazwa={this.state.menu020_name} />
              )}
            </MDBContainer>
          </>
        )}
      </>
    );
  }
}
