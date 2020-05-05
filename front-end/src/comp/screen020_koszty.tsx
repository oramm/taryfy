import React, { Component } from "react";
import {
  MDBContainer,
  MDBBtn,
  MDBBox,
  MDBTable,
  MDBTableBody,
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBInputGroup,
} from "mdbreact";
import { post, cancel } from "./post";

import { ModalDialogs, ModalDialogsGetFake } from "./modal_dialogs";

type Props = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number;
  modal_dialogs: ModalDialogs;
};

type RodzajeKosztowData = {
  id: number;
  nazwa: string;
  opis: string;
  wspolczynnik: string;
};

type State = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number;
  koszty_rodzaje: RodzajeKosztowData[];
  wskaznik_id: number;
  wskaznik_1: string;
  wskaznik_2: string;
  wskaznik_3: string;
  modal_dialogs: ModalDialogs;
  modal_koszt_label: string;
  modal_koszt_nazwa: string;
  modal_koszt_opis: string;
  modal_koszt_wspolczynnik: string;
  modal_koszt_on: boolean;
  modal_koszt_action: (/* name: string, opis: string, wspolczynnik: string*/) => void;
};

class Screen020 extends Component<Props, State> {
  state: State = {
    callback: (index: number) => {},
    wniosek_id: 0,
    typ_id: 1,
    wskaznik_id: 0,
    wskaznik_1: "1.0",
    wskaznik_2: "1.0",
    wskaznik_3: "1.0",
    modal_dialogs: ModalDialogsGetFake(),
    koszty_rodzaje: [],
    modal_koszt_label: "",
    modal_koszt_nazwa: "",
    modal_koszt_opis: "",
    modal_koszt_wspolczynnik: "",
    modal_koszt_on: false,
    modal_koszt_action: (/*name: string, opis: string, wspolczynnik: string*/) => {},
  };

  koszt_last_edited_id: number = 0;

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
        this.loadSpreadsheet();
      }
    );
  }

  onRodzajeKosztowDodaj = () => {
    console.log("Screen020: onRodzajeKosztowDodaj");
    console.log(this.state);
    post(
      "/koszty_rodzaje/insert",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
        nazwa: this.state.modal_koszt_nazwa,
        opis: this.state.modal_koszt_opis,
        wspolczynnik: this.state.modal_koszt_wspolczynnik,
      },
      (response) => {
        console.log("Axios.post/koszty_rodzaje/insert response:", response);
        this.loadDataRodzaje();
      }
    );
  };

  onRodzajeKosztowEdytuj = () => {
    console.log("Screen020: edytuj");
    console.log(this.state);
    post(
      "/koszty_rodzaje/update",
      {
        id: this.koszt_last_edited_id,
        nazwa: this.state.modal_koszt_nazwa,
        opis: this.state.modal_koszt_opis,
        wspolczynnik: this.state.modal_koszt_wspolczynnik,
      },
      (response) => {
        console.log(
          "onRodzajeKosztowEdytuj /koszty_rodzaje/update response:",
          response
        );
        this.loadDataRodzaje();
      }
    );
  };

  onRodzajeKosztowUsun(id: number) {
    console.log("onRodzajeKosztowUsun");
    post(
      "/koszty_rodzaje/delete",
      {
        // wniosek_id: this.state.wniosek_id,
        id: id,
      },
      (response) => {
        console.log("Axios.post /koszty_rodzaje/delete response");
        console.log(response);
        this.loadData();
      }
    );
  }

  onZapisz = (event: any) => {
    console.log("Screen020: onZapisz, state:", this.state);
    post(
      "/koszty_spreadsheet/savedata",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
      },
      (response) => {
        console.log("onPrognozuj /koszty_wskazniki/update response:", response);
        //this.loadData();
      }
    );
  };

  onPrognozuj = (event: any) => {
    console.log("Screen020: onPrognozuj, state:", this.state);
    post(
      "/koszty_wskazniki/update",
      {
        id: this.state.wskaznik_id,
        wskaznik_1: this.state.wskaznik_1,
        wskaznik_2: this.state.wskaznik_2,
        wskaznik_3: this.state.wskaznik_3,
      },
      (response) => {
        console.log("onPrognozuj /koszty_wskazniki/update response:", response);
      }
    );
    post(
      "/koszty_spreadsheet/prognozuj",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
        wskaznik_1: this.state.wskaznik_1,
        wskaznik_2: this.state.wskaznik_2,
        wskaznik_3: this.state.wskaznik_3,
      },
      (response) => {
        console.log(
          "onPrognozuj /koszty_sprzedsheet/prognozuj response:",
          response
        );
      }
    );
  };

  insertRodzajeToSpreadsheet = () => {
    console.log("Screen020: insertRodzajeToSpreadsheet, state:", this.state);
    post(
      "/koszty_spreadsheet/insertrodzaje",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
      },
      (response) => {
        console.log("/koszty_spreadsheet/insertrodzaje response:", response);
      }
    );
  };

  loadSpreadsheet = () => {
    post(
      "/koszty_spreadsheet/loaddata",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
      },
      (response) => {
        console.log("/koszty_spreadsheet/loaddata response:", response);
      }
    );
  };

  loadDataRodzaje = () => {
    post(
      "/koszty_rodzaje/select",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
      },
      (response) => {
        console.log("loadData /koszty_rodzaje/select response:", response);
        this.setState({ koszty_rodzaje: response.data }, () =>
          console.log("loadData /koszty_rodzaje/select state:", this.state)
        );
      }
    );
  };

  loadDataWskazniki = () => {
    post(
      "/koszty_wskazniki/select",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
      },
      (response) => {
        console.log("loadData /koszty_wskazniki/select response:", response);
        this.setState(
          {
            wskaznik_id: response.data[1][0].id,
            wskaznik_1: response.data[1][0].wskaznik_1,
            wskaznik_2: response.data[1][0].wskaznik_2,
            wskaznik_3: response.data[1][0].wskaznik_3,
          },
          () =>
            console.log(
              "loadData /koszty_wskazniki/select set state:",
              this.state
            )
        );
      }
    );
  };

  loadData = () => {
    console.log("Screen020: loadData called");
    //this.loadDataSpreadsheet();
    this.loadDataRodzaje();
    this.loadDataWskazniki();
  };

  componentDidMount() {
    console.log("Screen020: componentDidMount");
    this.loadData();
  }

  componentWillUnmount() {
    cancel();
  }

  public modalRodzajKosztowOn = (
    label: string,
    nazwa: string,
    opis: string,
    wspolczynnik: string,
    action: (/*name: string, opis: string, wspolczynnik: string*/) => void
  ) => {
    let new_state = {
      modal_koszt_label: label,
      modal_koszt_nazwa: nazwa,
      modal_koszt_opis: opis,
      modal_koszt_wspolczynnik: wspolczynnik,
      modal_koszt_on: true,
      modal_koszt_action: action,
    };
    console.log("modalRodzajKosztowOn: ", new_state);
    this.setState(new_state);
  };

  modalRodzajKosztowOff = () => {
    this.setState({
      modal_koszt_on: false,
    });
  };

  modalRodzajKosztow() {
    return (
      <MDBModal
        isOpen={this.state.modal_koszt_on}
        toggle={this.modalRodzajKosztowOff}
      >
        <MDBModalHeader toggle={this.modalRodzajKosztowOff}>
          {this.state.modal_koszt_label}
        </MDBModalHeader>
        <MDBModalBody>
          <MDBInput
            type="text"
            label="Nazwa:"
            value={this.state.modal_koszt_nazwa}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState({ modal_koszt_nazwa: value });
            }}
          ></MDBInput>
          <MDBInput
            type="text"
            label="Opis:"
            value={this.state.modal_koszt_opis}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState({ modal_koszt_opis: value });
            }}
          ></MDBInput>

          <MDBInputGroup
            containerClassName="mb-3"
            prepend="Współczynnik allokacji:"
            inputs={
              <select
                className="browser-default custom-select"
                onChange={(event) => {
                  const { value } = event.currentTarget;
                  this.setState({ modal_koszt_wspolczynnik: value });
                }}
              >
                {this.state.modal_koszt_wspolczynnik === "A" ? (
                  <option value="A" selected>
                    A
                  </option>
                ) : (
                  <option value="A">A</option>
                )}
                {this.state.modal_koszt_wspolczynnik === "B" ? (
                  <option value="B" selected>
                    B
                  </option>
                ) : (
                  <option value="B">B</option>
                )}
                {this.state.modal_koszt_wspolczynnik === "C" ? (
                  <option value="C" selected>
                    C
                  </option>
                ) : (
                  <option value="C">C</option>
                )}
                {this.state.modal_koszt_wspolczynnik === "D" ? (
                  <option value="D" selected>
                    D
                  </option>
                ) : (
                  <option value="D">D</option>
                )}
                {this.state.modal_koszt_wspolczynnik === "E" ? (
                  <option value="E" selected>
                    E
                  </option>
                ) : (
                  <option value="E">E</option>
                )}
              </select>
            }
          />
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.modalRodzajKosztowOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="primary"
            onClick={() => {
              this.modalRodzajKosztowOff();
              this.state.modal_koszt_action();
            }}
          >
            Akceptuj
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  kosztyRodzaje = () => {
    return (
      <MDBTable small>
        <MDBTableBody>
          {this.state.koszty_rodzaje.map((koszt, index) => (
            <tr key={index}>
              <td className="p-0">
                <MDBBox className="left p-0 font-weight-bold">
                  {koszt.nazwa}
                </MDBBox>
                <MDBBox className="left p-0">{koszt.opis}</MDBBox>
              </td>
              <td className="p-0">
                <MDBBtn
                  className="float-right p-2 m-1"
                  size="sm"
                  style={{ width: "60px" }}
                  onClick={() => this.onRodzajeKosztowUsun(koszt.id)}
                >
                  Usuń
                </MDBBtn>
                <MDBBtn
                  className="float-right p-2 m-1"
                  size="sm"
                  style={{ width: "60px" }}
                  // onClick={() =>
                  //   {
                  //     this.koszt_last_edited_id = koszt.id;
                  //   this.modalRodzajKosztowOn(
                  //     "Edytuj nazwę typu kosztów",
                  //     "",
                  //     "",
                  //     "A",
                  //     this.onRodzajeKosztowDodaj
                  //   )
                  //   }
                  // }
                  onClick={() => {
                    this.koszt_last_edited_id = koszt.id;
                    this.modalRodzajKosztowOn(
                      "Edytuj typ kosztów",
                      koszt.nazwa,
                      koszt.opis,
                      koszt.wspolczynnik,
                      this.onRodzajeKosztowEdytuj
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
    );
  };

  render() {
    return (
      <>
        {this.modalRodzajKosztow()}
        <MDBBtn
          size="sm"
          className="float-left"
          style={{ width: "250px" }}
          onClick={() =>
            this.modalRodzajKosztowOn(
              "Dodaj nowy rodzaj kosztów",
              "",
              "",
              "A",
              this.onRodzajeKosztowDodaj
            )
          }
        >
          Dodaj nowy rodzaj kosztów
        </MDBBtn>
        {this.kosztyRodzaje()}
        <MDBBtn
          size="sm"
          className="float-left"
          style={{ width: "250px" }}
          onClick={this.insertRodzajeToSpreadsheet}
        >
          Kopiuj rodzaje kosztów do tabeli
        </MDBBtn>

        {/*todo: use global style
 .koszty_rodzaje_table td {
  padding: 2px;
}         */}
        <MDBTable borderless className="p-2">
          <MDBTableBody style={{}}>
            <tr>
              <td style={{ width: "61%", padding: 2 }}></td>
              <td style={{ width: "13%", padding: 2 }} className="text-center">
                Wskaźnik rok 1
              </td>
              <td style={{ width: "13%", padding: 2 }} className="text-center">
                Wskaźnik rok 2
              </td>
              <td style={{ width: "13%", padding: 2 }} className="text-center">
                Wskaźnik rok 3
              </td>
            </tr>
            <tr>
              <td style={{ padding: 2 }}></td>
              <td style={{ padding: 2 }}>
                <MDBBox>
                  <MDBInput
                    noTag
                    className="text-right"
                    type="text"
                    value={this.state.wskaznik_1}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      //todo: validate value
                      this.setState({ wskaznik_1: value });
                    }}
                  />
                </MDBBox>
              </td>
              <td style={{ padding: 2 }}>
                <MDBBox>
                  <MDBInput
                    noTag
                    className="text-right"
                    type="text"
                    value={this.state.wskaznik_2}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      //todo: validate value
                      this.setState({ wskaznik_2: value });
                    }}
                  />
                </MDBBox>
              </td>
              <td style={{ padding: 2 }}>
                <MDBBox>
                  <MDBInput
                    noTag
                    className="text-right"
                    type="text"
                    value={this.state.wskaznik_3}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      //todo: validate value
                      this.setState({ wskaznik_3: value });
                    }}
                  />
                </MDBBox>
              </td>
            </tr>
            <tr>
              <td style={{ padding: 2 }}></td>
              <td style={{ padding: 2 }}></td>
              <td style={{ padding: 2 }} colSpan={2}>
                <MDBBtn
                  size="sm"
                  style={{ width: "250px" }}
                  className="float-right"
                  onClick={this.onPrognozuj}
                >
                  Prognozuj
                </MDBBtn>
              </td>
            </tr>
            <tr>
              <td style={{ padding: 2 }} colSpan={4}>
                <MDBBox>
                  <iframe
                    width="100%"
                    title="spreadsheet"
                    height="400"
                    src="https://docs.google.com/spreadsheets/d/1Whi0wLCOyF1NSjc04vMDNXs3xcOvJL5Qd1FZV_gwnAk/edit?rm=minimal"
                  ></iframe>
                </MDBBox>
              </td>
            </tr>
            <tr>
              <td style={{ padding: 2 }}></td>
              <td style={{ padding: 2 }}></td>
              <td style={{ padding: 2 }} colSpan={2}>
                <MDBBtn
                  size="sm"
                  style={{ width: "250px" }}
                  className="float-right"
                  onClick={this.onZapisz}
                >
                  Zapisz tabelę
                </MDBBtn>
              </td>
            </tr>
          </MDBTableBody>
        </MDBTable>
      </>
    );
  }
}

export{Screen020 as Screen020_koszty}