import { Component } from "react";
import * as React from "react";
import {
  MDBContainer,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBInput,
  MDBModalFooter,
  MDBBtn,
  MDBInputGroup,
  MDBBtnGroup,
  MDBBox,
} from "mdbreact";
import { ElementPrzychodu } from "../../../common/model";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

export type ModalDialogs = {
  nazwaOn: (
    label: string,
    nazwa: string,
    callback: (name: string) => void
  ) => void;
  opisOn: (
    label: string,
    nazwa: string,
    opis: string,
    callback: (nazwa: string, opis: string, id?: any) => void,
    id?: any
  ) => void;
  usunOn: (
    label: string,
    nazwa: string,
    callback: (name: string) => void
  ) => void;
  errorOn: (label: string) => void;
  wTokuOn: () => void;
  wTokuOff: () => void;
  hasloOn: (
    callback: (haslo: string, haslo1: string, haslo2: string) => void
  ) => void;
};

type Props = {
  set_modal_dialog_callbacks: (dialogs: ModalDialogs) => void;
};

type State = {
  modal_label: string;
  modal_nazwa: string;
  modal_nazwa_invalid: boolean;
  modal_opis: string;
  modal_opis_on: boolean;
  modal_opis_id: number;
  modal_callback: (...args: any[]) => void;
  modal_nazwa_on: boolean;
  modal_usun_on: boolean;
  modal_usun_disabled: boolean;
  //  modal_w_toku_count: number;
  modal_w_toku_on: boolean;
  modal_error_on: boolean;
  modal_haslo_on: boolean;
  modal_haslo: string;
  modal_haslo1: string;
  modal_haslo_invalid: boolean;
  modal_haslo2: string;
};

// type OnModal = (
//   label: string,
//   nazwa: string,
//   action: (nazwa: string) => void
// ) => void;

let GrupyAllokacji = ["A", "B", "C", "D", "E", "F"];
let GrupyAllokacjiControl = (
  sel: any,
  label: string,
  callback: (value: any) => void
) => {
  return (
    <MDBInputGroup
      containerClassName="mb-3"
      prepend={label}
      inputs={
        <select
          className="browser-default custom-select"
          onChange={(event) => {
            callback(event);
          }}
        >
          {GrupyAllokacji.map((item, index) => {
            if (sel === item) {
              return (
                <option value={item} selected>
                  {item}
                </option>
              );
            } else {
              return <option value={item}>{item}</option>;
            }
          })}
        </select>
      }
    />
  );
};

let Okresy = ["1-12", "13-24", "25-36"];
let OkresyControl = (
  callback: (index: number, value: string) => void, 
  selected_item: number,
  prefix?: boolean
) => {
  let okresy_temp = prefix ? ["-11-0"].concat(Okresy) : Okresy;
  return (
    <MDBBtnGroup>
      {okresy_temp.map((name, index) => (
        <MDBBox key={index}>
          <MDBBtn
            onClick={() => callback(index, name)}
            size="sm"
            color={selected_item === index + (prefix ? 0 : 1) ? "dark" : "mdb-color"}
            outline
            //active={selected_item === index ? true : false}
            active={selected_item === index + (prefix ? 0 : 1)}
          >
            {name}
          </MDBBtn>
        </MDBBox>
      ))}
    </MDBBtnGroup>
  );
};

class ModalDialogsComp extends Component<Props, State> {
  state: State = {
    modal_label: "",
    modal_nazwa: "",
    modal_nazwa_on: false,
    modal_nazwa_invalid: false,
    modal_opis: "",
    modal_opis_on: false,
    modal_opis_id: 0,
    modal_callback: (...args: any[]) => {},
    modal_usun_on: false,
    modal_usun_disabled: true,
    modal_w_toku_on: false,
    modal_error_on: false,
    modal_haslo_on: false,
    modal_haslo: "",
    modal_haslo1: "",
    modal_haslo_invalid: false,
    modal_haslo2: "",
  };
  private modal_w_toku_count: number = 0;

  constructor(props: Props) {
    super(props);
    let dialogs: ModalDialogs = {
      nazwaOn: this.nazwaOn,
      opisOn: this.opisOn,
      usunOn: this.usunOn,
      errorOn: this.errorOn,
      wTokuOn: this.wTokuOn,
      wTokuOff: this.wTokuOff,
      hasloOn: this.hasloOn,
    };
    props.set_modal_dialog_callbacks(dialogs);
  }

  public nazwaOn = (
    label: string,
    nazwa: string,
    action: (name: string) => void
  ) => {
    console.log("ModalDialogs nazwaOn label: ", label);
    console.log("ModalDialogs nazwaOn nazwa: ", nazwa);
    this.setState({
      modal_label: label,
      modal_nazwa: nazwa,
      modal_nazwa_on: true,
      modal_nazwa_invalid: false,
      modal_callback: action,
    });
  };
  nazwaOff = () => {
    this.setState({
      modal_nazwa_on: false,
    });
  };

  public opisOn = (
    label: string,
    nazwa: string,
    opis: string,
    callback: (nazwa: string, opis: string, id?: any) => void,
    id?: any
  ) => {
    console.log("ModalDialogs pisOn label: ", label);
    console.log("ModalDialogs opisOn nazwa: ", nazwa);
    console.log("ModalDialogs opisOn opis: ", opis);
    id && console.log("ModalDialogs opisOn id: ", id);
    this.setState({
      modal_label: label,
      modal_nazwa: nazwa,
      modal_nazwa_invalid: false,
      modal_opis: opis,
      modal_opis_on: true,
      modal_opis_id: id,
      modal_callback: callback,
    });
  };

  opisOff = () => {
    this.setState({
      modal_opis_on: false,
    });
  };

  hasloOn = () => {
    this.setState({
      modal_haslo_on: true,
      modal_haslo_invalid: false,
    });
  };

  hasloOff = () => {
    this.setState({
      modal_haslo_on: false,
    });
  };

  public usunOn = (
    label: string,
    nazwa: string,
    action: (name: string) => void
  ) => {
    this.setState({
      modal_label: label,
      modal_nazwa: nazwa,
      modal_usun_on: true,
      modal_usun_disabled: true,
      modal_callback: action,
    });
  };
  usunOff = () => {
    this.setState({
      modal_usun_on: false,
    });
  };

  public wTokuOn = async () => {
    console.log(
      "wTokuOn this.state.modal_w_toku_count:",
      this.modal_w_toku_count
    );
    // await this.setState(
    //   {
    //     modal_w_toku_count: this.state.modal_w_toku_count + 1,
    //   },
    //   () =>
    //     this.setState({
    //       modal_w_toku_on: true,
    //     })
    // );
    this.modal_w_toku_count++;
    this.setState({ modal_w_toku_on: true });
  };

  public wTokuOff = async () => {
    console.log(
      "wTokuOff this.state.modal_w_toku_count:",
      this.modal_w_toku_count
    );
    //todo: is it thread safe?
    this.modal_w_toku_count--;
    this.modal_w_toku_count === 0 && this.setState({ modal_w_toku_on: false });
  };

  public errorOn = (label: string) => {
    console.log("modalErrorOn label: ", label);
    this.setState({
      modal_label: label,
      modal_error_on: true,
    });
  };

  errorOff = () => {
    this.setState({
      modal_error_on: false,
    });
  };

  modalNazwa() {
    return (
    <MDBContainer>
      <MDBModal isOpen={this.state.modal_nazwa_on} toggle={this.nazwaOff} overflowScroll={false} inline={false} noClickableBodyWithoutBackdrop={false}>
        <MDBModalHeader toggle={this.nazwaOff}>
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
            label="Podaj nazwę"
            value={this.state.modal_nazwa}
            className="_invalid"
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState({ modal_nazwa: value });
            }}
          ></MDBInput>{" "}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="mdb-color" onClick={this.nazwaOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="mdb-color"
            onClick={() => {
              if (this.state.modal_nazwa === "") {
                this.setState({ modal_nazwa_invalid: true });
              } else {
                this.setState({ modal_nazwa_invalid: false });
                this.nazwaOff();
                this.state.modal_callback(this.state.modal_nazwa);
              }
            }}
          >
            Akceptuj
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>      
    );
  }

  modalOpis() {
    return (
      <MDBModal isOpen={this.state.modal_opis_on} toggle={this.opisOff} overflowScroll={false} inline={false} noClickableBodyWithoutBackdrop={false}>
        <MDBModalHeader toggle={this.opisOff}>
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
            value={this.state.modal_nazwa}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState({ modal_nazwa: value });
            }}
          ></MDBInput>
          <MDBInput
            type="text"
            label="Opis:"
            value={this.state.modal_opis}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState({ modal_opis: value });
            }}
          ></MDBInput>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="mdb-color" onClick={this.opisOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="mdb-color"
            onClick={() => {
              if (this.state.modal_nazwa === "") {
                this.setState({ modal_nazwa_invalid: true });
              } else {
                this.setState({ modal_nazwa_invalid: false });
                this.opisOff();
                this.state.modal_callback(
                  this.state.modal_nazwa,
                  this.state.modal_opis,
                  this.state.modal_opis_id
                );
              }
            }}
          >
            Akceptuj
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  modalUsun() {
    return (
      <MDBModal isOpen={this.state.modal_usun_on} toggle={this.usunOff} overflowScroll={false} inline={false} noClickableBodyWithoutBackdrop={false}>
        <MDBModalHeader toggle={this.usunOff}>
          {this.state.modal_label}
        </MDBModalHeader>
        <MDBModalBody>
          <div>
            <MDBInput
              type="checkbox"
              label="Usunięcie wniosku oznacza utratę wszystkich powiązanych danych."
              onChange={() => {
                this.setState({
                  modal_usun_disabled: !this.state.modal_usun_disabled,
                });
              }}
            />
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="mdb-color" onClick={this.usunOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="mdb-color"
            onClick={() => {
              this.usunOff();
              this.state.modal_callback(this.state.modal_nazwa);
            }}
            disabled={this.state.modal_usun_disabled}
          >
            Akceptuj
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  modalWToku() {
    return (
      <MDBModal
        isOpen={this.state.modal_w_toku_on}
        // toggle={this.wTokuOff}
        overflowScroll={false} inline={false} noClickableBodyWithoutBackdrop={false}
      >
        <MDBModalBody className="text-center">
          Operacja w toku
          {/* {this.state.modal_label} */}
        </MDBModalBody>
      </MDBModal>
    );
  }

  modalError() {
    return (
      <MDBModal isOpen={this.state.modal_error_on} toggle={this.errorOff} overflowScroll={false} inline={false} noClickableBodyWithoutBackdrop={false}>
        <MDBModalHeader toggle={this.errorOff}>Błąd:</MDBModalHeader>
        <MDBModalBody>{this.state.modal_label}</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="mdb-color" onClick={this.errorOff}>
            Zamknij
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  modalHaslo() {
    return (
      <MDBModal isOpen={this.state.modal_haslo_on} toggle={this.hasloOff} overflowScroll={false} inline={false} noClickableBodyWithoutBackdrop={false}>
        <MDBModalHeader toggle={this.hasloOff}>Zmiana hasła</MDBModalHeader>
        <MDBModalBody>
          <MDBInput
            type="password"
            label="Aktualne hasło:"
            value={this.state.modal_haslo}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState({ modal_haslo: value });
            }}
          ></MDBInput>
          {this.state.modal_haslo_invalid ? (
            <MDBBox className="_invalid">
              Niepoprawna wartość, podane hasła są różne:
            </MDBBox>
          ) : (
            <></>
          )}
          <MDBInput
            type="password"
            label="Nowe hasło:"
            value={this.state.modal_haslo1}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState({ modal_haslo1: value });
            }}
          ></MDBInput>
          <MDBInput
            type="password"
            label="Powtórz nowe hasło:"
            value={this.state.modal_haslo2}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState({ modal_haslo2: value });
            }}
          ></MDBInput>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="mdb-color" onClick={this.hasloOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="mdb-color"
            onClick={() => {
              if (this.state.modal_haslo2 !== this.state.modal_haslo1) {
                this.setState({ modal_haslo_invalid: true });
              } else {
                this.hasloOff();
                this.state.modal_callback(
                  this.state.modal_haslo,
                  this.state.modal_haslo1,
                  this.state.modal_haslo2
                );
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
        {this.modalNazwa()}
        {this.modalOpis()}
        {this.modalUsun()}
        {this.modalWToku()}
        {this.modalError()}
        {this.modalHaslo()}
      </>
    );
  }
}

const ModalDialogsGetFake: () => ModalDialogs = () => ({
  nazwaOn: (label: string, nazwa: string, action: (name: string) => void) => {
    console.log("ModalDialogsFake nazwaOn error!");
  },
  opisOn: (
    label: string,
    nazwa: string,
    opis: string,
    action: (name: string, opis: string) => void
  ) => {
    console.log("ModalDialogsFake nazwaOn error!");
  },
  usunOn: (label: string, nazwa: string, action: (name: string) => void) => {
    console.log("ModalDialogsFake usunOn error!");
  },
  errorOn: (label: string) => {
    console.log("ModalDialogsFake errorOn error!");
  },
  wTokuOn: () => {
    console.log("ModalDialogsFake wTokuOn error!");
  },
  wTokuOff: () => {
    console.log("ModalDialogsFake wTokuOff error!");
  },
  hasloOn: () => {
    console.log("ModalDialogsFake wTokuOff error!");
  },
});

let ElementPrzychoduControl = (
  elementy_przychodow: ElementPrzychodu[],
  elementy_przychodow_selected_id: number,
  callback: (elementy_przychodow_id: number) => void
) => {
  let selected = 0;
  return (
    <MDBInputGroup
      containerClassName="mb-3"
      prepend="Współczynnik alokacji:"
      inputs={
        <select
          className="browser-default custom-select"

          onChange={(event) => {
            const { value } = event.currentTarget;
            let num_value: number = Number(value);
            console.log("ElementPrzychoduControl num_value:", num_value);
            callback(num_value);
          }}
        >
          {elementy_przychodow.map((item: ElementPrzychodu, index: number) => {
            if (selected === 0 && item.poziom === 2) selected = item.id;
            return (
              index === elementy_przychodow.length - 1 || item.poziom >= elementy_przychodow[index+1].poziom ? <option
                value={item.id}
                selected={item.id === elementy_przychodow_selected_id}
              >
                {item.nazwa}
              </option> : <></>
            );
          })}
        </select>
      }{...selected && !elementy_przychodow_selected_id && callback(selected)}
    /> 
  );
};

export {
  ModalDialogsGetFake,
  ModalDialogsComp,
  GrupyAllokacjiControl,
  OkresyControl,
  ElementPrzychoduControl,
};
