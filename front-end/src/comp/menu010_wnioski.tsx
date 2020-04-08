import React, { Component } from "react";
import { post } from "./post";

import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
  MDBBtn,
} from "mdbreact";

import Select from "react-select";
import { OnModal } from "./modal_dialogs";

type Props = {
  callback: (name: string, wniosek_id: number) => void;
  logout_callback: () => void;
  on_modal_usun: OnModal | undefined;
  on_modal_nazwa: OnModal | undefined;
};

type WiosekData = { id: number; nazwa: string };
type SelectMenuType = { value: string; label: string };

type State = {
  callback: (name: string, wniosek_id: number) => void;
  logout_callback: () => void;
  on_modal_nazwa: OnModal | undefined;
  on_modal_usun: OnModal | undefined;
  data: WiosekData[];
  wniosek_id: number;
  wnioski_select_menu: SelectMenuType[];
  wnioski_selected_item: SelectMenuType;
};

export default class Menu010 extends Component<Props, State> {
  state: State = {
    callback: (name: string, wniosek_id: number) => {},
    logout_callback: () => {},
    on_modal_nazwa: (label: string, nazwa: string, action: (nazwa: string) => void) => {},
    on_modal_usun: (label: string, nazwa: string, action: (nazwa: string) => void) => {},
    data: [],
    wniosek_id: 0,
    wnioski_select_menu: [],
    wnioski_selected_item: {} as SelectMenuType
  };

  constructor(props: Props) {
    super(props);
    this.state.callback = props.callback;
    this.state.logout_callback = props.logout_callback;
    this.state.on_modal_nazwa = props.on_modal_nazwa;
    this.state.on_modal_usun = props.on_modal_usun;
  }
  updateWnioski() {
    post("/wnioski/select", {}, response => {
      let wnioski_select_menu: SelectMenuType[] = [];
      let wnioski_selected: SelectMenuType | undefined = undefined;
      for (let entry of response.data) {
        wnioski_select_menu.push({ value: entry.id, label: entry.nazwa });
        if (this.state.wniosek_id === Number(entry.id)) {
          wnioski_selected = { value: entry.id, label: entry.nazwa };
        }
      }

      console.log("wnioski_select_menu.length = " + wnioski_select_menu.length);

      if (wnioski_select_menu.length > 0) {
        wnioski_selected = wnioski_selected || wnioski_select_menu[0];
        this.setState(
          {
            wnioski_selected_item: wnioski_selected,
            data: response.data,
            wnioski_select_menu: wnioski_select_menu
          },
          () => {
            console.log("Menu010: this.state:");
            console.log(this.state);
            this.state.callback(
              this.state.wnioski_selected_item.label,
              Number.parseInt(this.state.wnioski_selected_item.value)
            );
          }
        );
      } else {
        this.setState(
          {
            data: response.data,
            wnioski_select_menu: wnioski_select_menu
          },
          () => {
            console.log("Menu010: this.state:");
            console.log(this.state);
          }
        );
      }
    });
  }

  componentDidMount() {
    console.log("Menu010: componentDidMount");
    this.updateWnioski();
  }

  dodaj = (nazwa: string) => {
    console.log("Menu010: dodaj");
    console.log(this.state);
    post("/wnioski/insert", { nazwa: nazwa }, response => {
      this.setState({ wniosek_id: response.data.insertId });
      this.updateWnioski();
    });
  };

  edytuj = (nazwa: string) => {
    console.log("Menu010 edytuj this.state:", this.state);
    post(
      "/wnioski/update",
      {
        nazwa: nazwa,
        id: this.state.wnioski_selected_item.value
      },
      response => {
        this.updateWnioski();
      }
    );
  };

  duplikuj = (nazwa: string) => {
    console.log("Menu010: dupliku");
    console.log(this.state);
    post(
      "/wnioski/clone",
      {
        nazwa: nazwa,
        id: this.state.wnioski_selected_item.value
      },
      response => {
        console.log(response.data[0]["@last_id"]);
        this.setState({ wniosek_id: response.data[0]["@last_id"] });
        this.updateWnioski();
      }
    );
  };

  usun = (nazwa: string) => {
    console.log("menu010: usun");
    console.log(this.state);
    post(
      "/wnioski/delete",
      {
        id: this.state.wnioski_selected_item.value
      },
      response => {
        this.updateWnioski();
      }
    );
  };

  onChangeWniosek = (e: any) => {
    console.log("menu010 onChangeWniosek param:", e);
    this.setState(
      {
        wnioski_selected_item: e,
        wniosek_id: e.value
      },
      () => {
        console.log("menu010 onChangeWniosek promise this.state:", this.state);
        this.state.callback(e.label, e.value);
      }
    );
  };

  render() {
    return (
      <MDBNavbar color="default-color" dark expand="md" fixed="top">
        <MDBNavbarBrand>
          <strong className="white-text">Wnioski taryfowe</strong>
        </MDBNavbarBrand>
        <MDBNavbarNav style={{ width: "100%" }}>
          <MDBNavItem style={{ width: "50%" }}>
            <Select
              class="align-middle"
              options={this.state.wnioski_select_menu}
              value={this.state.wnioski_selected_item}
              onChange={this.onChangeWniosek}
            />
          </MDBNavItem>
          <MDBNavItem>
            <MDBBtn
              size="sm"
              onClick={() =>{ this.state.on_modal_nazwa &&
                this.state.on_modal_nazwa(
                  "Dodaj nowy wniosek",
                  this.state.wnioski_selected_item.label,
                  this.dodaj
                );
              }
              }
            >
              Dodaj nowy
            </MDBBtn>
            <MDBBtn
              size="sm"
              onClick={() => {
               console.log("Menu010 edytuj onClick this.state:", this.state);
                this.state.on_modal_nazwa &&
                this.state.on_modal_nazwa(
                  "Edytuj nazwę wniosku",
                  this.state.wnioski_selected_item.label,
                  this.edytuj
                )
              }
              }
            >
              Edytuj nazwę
            </MDBBtn>
            <MDBBtn
              size="sm"
              onClick={() => this.state.on_modal_nazwa &&
                this.state.on_modal_nazwa(
                  "Dodaj nowy wniosek",
                  this.state.wnioski_selected_item.label,
                  this.duplikuj
                )
              }
            >
              Duplikuj
            </MDBBtn>
            <MDBBtn
              size="sm"
              onClick={() =>
                this.state.on_modal_usun &&
                this.state.on_modal_usun(
                  "Usuń wniosek",
                  this.state.wnioski_selected_item.label,
                  this.usun
                )
              }
            >
              Usuń
            </MDBBtn>
          </MDBNavItem>
        </MDBNavbarNav>
        <MDBNavbarNav right>
          <MDBNavItem>
            <MDBDropdown dropleft>
              <MDBDropdownToggle nav caret>
                <MDBIcon icon="user" />
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default">
                <MDBDropdownItem>Ustawienia</MDBDropdownItem>
                <MDBDropdownItem onClick={this.state.logout_callback}>
                  Wyloguj
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
      </MDBNavbar>
    );
  }
}
