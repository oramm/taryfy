import React, { Component } from "react";
import { MDBBtn, MDBBtnGroup, MDBBox } from "mdbreact";

type Menu020Props = {
  callback: (index: number, name: string) => void;
};

type Menu020State = {
  callback: (index: number, name: string) => void;
  menu_items: string[];
  selected_item: number;
};

export default class Menu020 extends Component<Menu020Props, Menu020State> {
  state: Menu020State = {
    callback: (index: number, name: string) => {},
    menu_items: [
      "Założenia makroekonomiczne",
      "Koszty",
      "Kredyty i pożyczki",
      "Popyt",
      "Grupy odbiorców",
      "Abonamenty",
      "Alokacja kosztów do elementów przychodów",
      "Alokacja kosztów do grup taryfowych",
      "Wnioski taryfowe"
    ],
    selected_item: 0
  };
  constructor(props: Menu020Props) {
    super(props);
    this.state.callback = props.callback;
    this.state.callback(0, this.state.menu_items[0]);
  }

  onMenuItemClick(index: number) {
    this.setState({ selected_item: index }, () => console.dir(this.state));
    console.log(
      "changeMenu020 name: " + this.state.menu_items[index] + " index: " + index
    );
    this.state.callback(index, this.state.menu_items[index]);
  }

  render() {
    return (
      <MDBBtnGroup style={{"marginTop": "60px"}}>
        {this.state.menu_items.map((name, index) => (
          <MDBBox key={index}>
            <MDBBtn
              style={{ height: "90%" }}
              size="sm"
              active={this.state.selected_item === index}
              onClick={() => this.onMenuItemClick(index)}
            >
              {name}
            </MDBBtn>
          </MDBBox>
        ))}
      </MDBBtnGroup>
    );
  }
}
