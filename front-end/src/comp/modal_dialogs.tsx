import { Component } from "react";
import * as React from "react";
import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBInput,
  MDBModalFooter,
  MDBBtn
} from "mdbreact";

type Props = {
  set_callbacks_callback: (dailogs: ModalDialogs)=>void;
};

type State = {
  modal_label: string;
  modal_nazwa: string;
  modal_nazwa_toggle: boolean;
  modal_action: (name: string) => void;
  modal_usun_toggle: boolean;
  modal_usun_disabled: boolean;
  modal_bottom_toggle: boolean;
  modal_bottom_label: string;
  modal_error_toggle: boolean;
};

export type OnModal = (label: string, nazwa: string, action: (nazwa: string) => void) => void;

export default class ModalDialogs extends Component<Props, State> {
  state: State = {
    modal_label: "",
    modal_nazwa: "",
    modal_nazwa_toggle: false,
    modal_action: () => {},
    modal_usun_toggle: false,
    modal_usun_disabled: true,
    modal_bottom_toggle: false,
    modal_bottom_label: "",
    modal_error_toggle: false
  };

  constructor(props: Props) {
    super(props);
    props.set_callbacks_callback(this);
  }

  public modalNazwaOn = (label: string, nazwa: string, action: (name: string) => void) => {
    console.log("modalNazwaOn label: ", label);
    console.log("modalNazwaOn nazwa: ", nazwa);
    this.setState({
      modal_label: label,
      modal_nazwa: nazwa,
      modal_nazwa_toggle: true,
      modal_action: action
    });
  };

  modalNazwaOff = () => {
    this.setState({
      modal_nazwa_toggle: false
    });
  };

  public modalUsunOn = (label: string, nazwa: string, action: (name: string) => void) => {
    this.setState({
      modal_label: label,
      modal_nazwa: nazwa,
      modal_usun_toggle: true,
      modal_usun_disabled: true,
      modal_action: action
    });
  };

  modalUsunOff = () => {
    this.setState({
      modal_usun_toggle: false
    });
  };

  public modalWTokuToggle = () => {
    this.setState({
      modal_bottom_toggle: !this.state.modal_bottom_toggle
    });
  };
  
  public modalErrorOn = (label: string, nazwa: string, action: (name: string) => void) => {
    console.log("modalErrorOn label: ", label);
    this.setState({
      modal_label: label,
      modal_error_toggle: true
    });
  };

  modalErrorOff = () => {
    this.setState({
      modal_error_toggle: false
    });
  };

  modalNazwa() {
    return (
      <MDBModal
        isOpen={this.state.modal_nazwa_toggle}
        toggle={this.modalNazwaOff}
      >
        <MDBModalHeader toggle={this.modalNazwaOff}>
          {this.state.modal_label}
        </MDBModalHeader>
        <MDBModalBody>
          <MDBInput
            type="text"
            label="Podaj nazwę"
            value={this.state.modal_nazwa}
            onChange={event => {
              const { value } = event.currentTarget;
              this.setState({ modal_nazwa: value });
            }}
          ></MDBInput>{" "}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.modalNazwaOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="primary"
            onClick={() => {
              this.modalNazwaOff();
              this.state.modal_action(this.state.modal_nazwa);
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
      <MDBModal
        isOpen={this.state.modal_usun_toggle}
        toggle={this.modalUsunOff}
      >
        <MDBModalHeader toggle={this.modalUsunOff}>
          {this.state.modal_label}
        </MDBModalHeader>
        <MDBModalBody>
          <div>
            <MDBInput
              type="checkbox"
              label="Usunięcie wniosku oznacza utratę wszystkich powiązanych danych."
              onChange={() => {
                this.setState({
                  modal_usun_disabled: !this.state.modal_usun_disabled
                });
              }}
            />
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.modalUsunOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="primary"
            onClick={() => {
              this.modalUsunOff();
              this.state.modal_action(this.state.modal_nazwa);
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
        isOpen={this.state.modal_bottom_toggle}
        toggle={this.modalWTokuToggle}
        frame
        position="bottom"
      >
        <MDBModalBody className="text-center">
          Lorem ipsum dolor sit amet
          {this.state.modal_label}
        </MDBModalBody>
      </MDBModal>
    );
  }

  modalError() {
    return (
      <MDBModal
        isOpen={this.state.modal_error_toggle}
        toggle={this.modalErrorOff}
      >
        <MDBModalHeader toggle={this.modalErrorOff}>
          Błąd:
        </MDBModalHeader>
        <MDBModalBody>
        {this.state.modal_label}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.modalErrorOff}>
            Zamknij
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  render() {
    return (
      <>
        {this.modalWToku()}
        {this.modalNazwa()}
        {this.modalUsun()}
        {this.modalError()}
      </>
    );
  }
}
