import { Component } from "react";
import * as React from "react";
import {
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
};

type Props = {
  set_modal_dialog_callbacks: (dialogs: ModalDialogs) => void;
};

type State = {
  modal_label: string;
  modal_nazwa: string;
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
};

// type OnModal = (
//   label: string,
//   nazwa: string,
//   action: (nazwa: string) => void
// ) => void;

let GrupyAllokacji = ["A", "B", "C", "D", "E", "F"];
let GrupyAllokacjiControl = (sel: any, label: string, callback: (value: any) => void) => {
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
let OkresyControl = (callback: (index: number, value: string)=>void) =>
{
  return (
    <MDBBtnGroup>
      {Okresy.map((name, index) => (
        <MDBBox key={index}>
          <MDBBtn
            onClick={() => callback(index,name)}
            size="sm"
          >
            {name}
          </MDBBtn>
        </MDBBox>
      ))}
    </MDBBtnGroup>
  );
}

class ModalDialogsComp extends Component<Props, State> {
  state: State = {
    modal_label: "",
    modal_nazwa: "",
    modal_nazwa_on: false,
    modal_opis: "",
    modal_opis_on: false,
    modal_opis_id: 0,
    modal_callback: (...args: any[]) => {},
    modal_usun_on: false,
    modal_usun_disabled: true,
    modal_w_toku_on: false,
    modal_error_on: false,
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
      <MDBModal isOpen={this.state.modal_nazwa_on} toggle={this.nazwaOff}>
        <MDBModalHeader toggle={this.nazwaOff}>
          {this.state.modal_label}
        </MDBModalHeader>
        <MDBModalBody>
          <MDBInput
            type="text"
            label="Podaj nazwę"
            value={this.state.modal_nazwa}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState({ modal_nazwa: value });
            }}
          ></MDBInput>{" "}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.nazwaOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="primary"
            onClick={() => {
              this.nazwaOff();
              this.state.modal_callback(this.state.modal_nazwa);
            }}
          >
            Akceptuj
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  modalOpis() {
    return (
      <MDBModal isOpen={this.state.modal_opis_on} toggle={this.opisOff}>
        <MDBModalHeader toggle={this.opisOff}>
          {this.state.modal_label}
        </MDBModalHeader>
        <MDBModalBody>
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
          <MDBBtn color="secondary" onClick={this.opisOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="primary"
            onClick={() => {
              this.opisOff();
              this.state.modal_callback(this.state.modal_nazwa, this.state.modal_opis, this.state.modal_opis_id);
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
      <MDBModal isOpen={this.state.modal_usun_on} toggle={this.usunOff}>
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
          <MDBBtn color="secondary" onClick={this.usunOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="primary"
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
      <MDBModal isOpen={this.state.modal_error_on} toggle={this.errorOff}>
        <MDBModalHeader toggle={this.errorOff}>Błąd:</MDBModalHeader>
        <MDBModalBody>{this.state.modal_label}</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.errorOff}>
            Zamknij
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
      </>
    );
  }
}

const ModalDialogsGetFake: () => ModalDialogs = () => ({
  nazwaOn: (label: string, nazwa: string, action: (name: string) => void) => {
    console.log("ModalDialogsFake nazwaOn error!");
  },
  opisOn: (label: string, nazwa: string, opis: string, action: (name: string, opis: string) => void) => {
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
});

export { ModalDialogsGetFake, ModalDialogsComp, GrupyAllokacjiControl, OkresyControl };
