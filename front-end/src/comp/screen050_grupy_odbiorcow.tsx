import React, { Component } from "react";
import update from "immutability-helper";
import { MDBBtn, MDBBox, MDBTable, MDBTableBody, MDBIcon } from "mdbreact";
import {
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
} from "mdbreact";

import { post, cancel } from "./post";

import { ModalDialogs, ModalDialogsGetFake } from "./modal_dialogs";

type Props = {
  wniosek_id: number;
  modal_dialogs: ModalDialogs;
};

type Data = {
  id: number;
  nazwa: string;
  opis: string;
  liczba_odbiorcow_1: number;
  liczba_odbiorcow_2: number;
  liczba_odbiorcow_3: number;
  liczba_odbiorcow_scieki_1: number;
  liczba_odbiorcow_scieki_2: number;
  liczba_odbiorcow_scieki_3: number;
};

let DataEmpty: Data = {
  id: 0,
  nazwa: "",
  opis: "",
  liczba_odbiorcow_1: 0,
  liczba_odbiorcow_2: 0,
  liczba_odbiorcow_3: 0,
  liczba_odbiorcow_scieki_1: 0,
  liczba_odbiorcow_scieki_2: 0,
  liczba_odbiorcow_scieki_3: 0,
};

type State = {
  wniosek_id: number;
  data: Data[];
  modal_dialogs: ModalDialogs;
  modal_label: string;
  modal_nazwa_invalid: boolean;
  modal_data: Data;
  modal_on: boolean;
  modal_method: any;
};

export default class Screen extends Component<Props, State> {
  state: State = {
    wniosek_id: 0,
    data: [],
    modal_dialogs: ModalDialogsGetFake(),
    modal_label: "",
    modal_nazwa_invalid: false,
    modal_data: DataEmpty,
    modal_on: false,
    modal_method: null,
  };

  constructor(props: Props) {
    super(props);
    this.state.wniosek_id = props.wniosek_id;
    this.state.modal_dialogs = props.modal_dialogs;
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.setState({ wniosek_id: props.wniosek_id }, () => {
      cancel();
      this.loadData();
    });
  }

  onGrupyOdbiorcowDodaj = (nazwa: string, opis: string) => {
    console.log("Screen050: onGrupyOdbiorcowDodaj");
    console.log(this.state);

    post(
      "/grupy_odbiorcow/insert",
      {
        wniosek_id: this.state.wniosek_id,
        data: this.state.modal_data,
      },
      (response) => {
        console.log("Screen050: onGrupyOdbiorcowDodaj response:", response);
        this.loadData();
      }
    );
  };

  onGrupyOdbiorcowEdytuj = () => {
    console.log("Screen050: onGrupyOdbiorcowEdytuj");
    console.log(this.state);
    post(
      "/grupy_odbiorcow/update",
      {
        data: this.state.modal_data,
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

  modalDodajOn = (modal_label: string) => {
    console.log("Screen050 modalDodajOn, state:", this.state);
    this.setState({
      modal_label: modal_label,
      modal_on: true,
      modal_method: this.onGrupyOdbiorcowDodaj
    });
  };

  modalEdytujOn = (modal_label: string) => {
    console.log("Screen050 modalEdytujOn, state:", this.state);
    this.setState({
      modal_label: modal_label,
      modal_on: true,
      modal_method: this.onGrupyOdbiorcowEdytuj
    });
  };

  modalOff = () => {
    this.setState({
      modal_on: false,
    });
  };

  modalGrupyOdbiorcow() {
    return (
      <MDBModal isOpen={this.state.modal_on} toggle={this.modalOff}>
        <MDBModalHeader toggle={this.modalOff}>
          {this.state.modal_label}
        </MDBModalHeader>
        <MDBModalBody>
          {this.state.modal_nazwa_invalid ? (
            <MDBBox className="_invalid">Niepoprawna wartość pola:</MDBBox>
          ) : (
            <></>
          )}
          <MDBInput
            type="text"
            label="Nazwa:"
            value={this.state.modal_data.nazwa}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState(
                (previousState) =>
                update(previousState, {
                  modal_data: {
                    nazwa: { $set: value },
                  },
                }))
            }}
          ></MDBInput>
          <MDBInput
            type="text"
            label="Opis:"
            value={this.state.modal_data.opis}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState(
                (previousState) =>
                update(previousState, {
                  modal_data: {
                    opis: { $set: value },
                  },
                }))
            }}
          ></MDBInput>
          <MDBInput
            type="number"
            label="Liczba odbiorców wody [1-12]"
            value={this.state.modal_data.liczba_odbiorcow_1}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState((previousState) =>
                update(previousState, {
                  modal_data: {
                    liczba_odbiorcow_1: { $set: Number(value) },
                  },
                })
              );
            }}
          ></MDBInput>
          <MDBInput
            type="number"
            label="Liczba odbiorców wody [13-24]"
            value={this.state.modal_data.liczba_odbiorcow_2}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState((previousState) =>
                update(previousState, {
                  modal_data: {
                    liczba_odbiorcow_2: { $set: Number(value) },
                  },
                })
              );
            }}
          ></MDBInput>
          <MDBInput
            type="number"
            label="Liczba odbiorców wody [25-36]"
            value={this.state.modal_data.liczba_odbiorcow_3}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState((previousState) =>
                update(previousState, {
                  modal_data: {
                    liczba_odbiorcow_3: { $set: Number(value) },
                  },
                })
              );
            }}
          ></MDBInput>
          <MDBInput
            type="number"
            label="Liczba odbiorców scieków [1-12]"
            value={this.state.modal_data.liczba_odbiorcow_scieki_1}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState((previousState) =>
                update(previousState, {
                  modal_data: {
                    liczba_odbiorcow_scieki_1: { $set: Number(value) },
                  },
                })
              );
            }}
          ></MDBInput>
          <MDBInput
            type="number"
            label="Liczba odbiorców ścieków [13-24]"
            value={this.state.modal_data.liczba_odbiorcow_scieki_2}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState((previousState) =>
                update(previousState, {
                  modal_data: {
                    liczba_odbiorcow_scieki_2: { $set: Number(value) },
                  },
                })
              );
            }}
          ></MDBInput>
          <MDBInput
            type="number"
            label="Liczba odbiorców ścieków [25-36]"
            value={this.state.modal_data.liczba_odbiorcow_scieki_3}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState((previousState) =>
                update(previousState, {
                  modal_data: {
                    liczba_odbiorcow_scieki_3: { $set: Number(value) },
                  },
                })
              );
            }}
          ></MDBInput>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="mdb-color" onClick={this.modalOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="mdb-color"
            onClick={() => {
              if (this.state.modal_data.nazwa === "") {
                this.setState({ modal_nazwa_invalid: true });
              } else {
                this.setState({ modal_nazwa_invalid: false });
                this.modalOff();
                this.state.modal_method();
              }
            }}
          >
            Akceptuj
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  render() {
    return (
      <>
        {this.modalGrupyOdbiorcow()}
        <MDBBtn
          size="sm"
          className="float-left"
          style={{ width: "250px" }}
          color="mdb-color"
          outline
          onClick={() => this.modalDodajOn("Dodaj nową grupę odbiorców")}
        >
          Dodaj nową grupę odbiorców
        </MDBBtn>
        <MDBTable className="_row bs-2">
          <MDBTableBody>
            {this.state.data.map((item, index) => (
              <tr key={index}>
                <td className="w-100">
                  <MDBBox className="left p-0 font-weight-bold">
                    {item.nazwa}
                  </MDBBox>
                  <MDBBox className="left p-0">{item.opis}</MDBBox>
                </td>
                <td className="align-middle">
                  <div
                    onClick={() => this.onGrupyOdbiorcowUsun(item.id)}
                    className="rounded flat_button pointer"
                  >
                    <MDBIcon far icon="trash-alt p-1" />
                  </div>
                </td>
                <td className="align-middle">
                  <div
                    className="rounded flat_button pointer"
                    onClick={() => {
                      this.setState(
                        {
                          modal_data: this.state.data[index],
                        },
                        () => {
                          this.modalEdytujOn("Edytuj grupę odbiorców");
                        }
                      );
                    }}
                  >
                    <MDBIcon icon="pen p-1" />
                  </div>
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
