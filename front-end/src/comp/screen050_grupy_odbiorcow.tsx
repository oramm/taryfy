import React, { Component } from "react";
import { MDBBtn, MDBBox, MDBTable, MDBTableBody } from "mdbreact";
import { post, cancel } from "./post";

import { ModalDialogs, ModalDialogsGetFake } from "./modal_dialogs";

type Props = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number;
  modal_dialogs: ModalDialogs;
};

type Data = {
  id: number;
  typ_id: number;
  nazwa: string;
  opis: string;
};

let DataEmpty: Data = {
  id: 0,
  typ_id: 0,
  nazwa: "",
  opis: "",
};

type State = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number;
  data: Data[];
  modal_dialogs: ModalDialogs;
  modal_label: string;
  modal_data: Data;
  modal_on: boolean;
  modal_callback: (/* name: string, opis: string, wspolczynnik: string*/) => void;
};

export default class Screen extends Component<Props, State> {
  state: State = {
    callback: (index: number) => {},
    wniosek_id: 0,
    typ_id: 1,
    data: [],
    modal_dialogs: ModalDialogsGetFake(),
    modal_label: "",
    modal_data: DataEmpty,
    modal_on: false,
    modal_callback: (/*name: string, opis: string, wspolczynnik: string*/) => {},
  };

  constructor(props: Props) {
    super(props);
    this.state.callback = props.callback;
    this.state.wniosek_id = props.wniosek_id;
    this.state.modal_dialogs = props.modal_dialogs;
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.setState(
      { wniosek_id: props.wniosek_id, typ_id: props.typ_id },
      () => {
        cancel();
        this.loadData();
      }
    );
  }

  onGrupyOdbiorcowDodaj = (nazwa: string, opis: string) => {
    console.log("Screen050: onGrupyOdbiorcowDodaj");
    console.log(this.state);

    post(
      "/grupy_odbiorcow/insert",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
        data: { nazwa: nazwa, opis: opis },
      },
      (response) => {
        console.log("Screen050: onGrupyOdbiorcowDodaj response:", response);
        this.loadData();
      }
    );
  };

  onGrupyOdbiorcowEdytuj = (nazwa: string, opis: string, id?: any) => {
    console.log("Screen050: onGrupyOdbiorcowEdytuj");
    if (!id)
      return console.log(
        "Screen050: onGrupyOdbiorcowEdytuj ERROR id is missing"
      );

    console.log(this.state);
    post(
      "/grupy_odbiorcow/update",
      {
        id: id,
        data: { nazwa: nazwa, opis: opis },
      },
      (response) => {
        console.log("Screen050: onGrupyOdbiorcowEdytuj response:", response);
        this.loadData();
      }
    );
  };

  onGrupyOdbiorcowUsun = (id: any) => {
    console.log("Screen050 onGrupyOdbiorcowUsun data:", id);
    post(
      "/grupy_odbiorcow/delete",
      {
        data: { id: id },
      },
      (response) => {
        console.log("Screen050 onGrupyOdbiorcowUsun response", response);
        this.loadData();
      }
    );
  };

  loadData = () => {
    post(
      "/grupy_odbiorcow/select",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
      },
      (response) => {
        console.log("Screen050 loadData response:", response);
        this.setState({ data: response.data }, () =>
          console.log("Screen050 loadData state:", this.state)
        );
      }
    );
  };

  componentDidMount() {
    console.log("Screen050 componentDidMount");
    this.loadData();
  }

  componentWillUnmount() {
    cancel();
  }

  render() {
    return (
      <>
        <MDBBtn
          size="sm"
          className="float-left"
          style={{ width: "250px" }}
          onClick={() =>
            this.state.modal_dialogs.opisOn(
              "Dodaj nową grupę odbiorców",
              "",
              "",
              this.onGrupyOdbiorcowDodaj
            )
          }
        >
          Dodaj nową grupę odbiorców
        </MDBBtn>
        <MDBTable small>
          <MDBTableBody>
            {this.state.data.map((item, index) => (
              <tr key={index}>
                <td className="p-0">
                  <MDBBox className="left p-0 font-weight-bold">
                    {item.nazwa}
                  </MDBBox>
                  <MDBBox className="left p-0">{item.opis}</MDBBox>
                </td>
                <td className="p-0">
                  <MDBBtn
                    className="float-right p-2 m-1"
                    size="sm"
                    style={{ width: "60px" }}
                    onClick={() => this.onGrupyOdbiorcowUsun(item.id)}
                  >
                    Usuń
                  </MDBBtn>
                  <MDBBtn
                    className="float-right p-2 m-1"
                    size="sm"
                    style={{ width: "60px" }}
                    onClick={() => {
                      this.state.modal_dialogs.opisOn(
                        "Edytuj grupę odbiorców",
                        item.nazwa,
                        item.opis,
                        this.onGrupyOdbiorcowEdytuj,
                        item.id
                      );
                    }}
                  >
                    Edytuj
                  </MDBBtn>
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </>
    );
  }
}

export { Screen as Screen050_grupy_odbiorcow };
