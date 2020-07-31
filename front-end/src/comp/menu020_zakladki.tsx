import React, { Component } from "react";
import { MDBBtn, MDBBtnGroup, MDBBox } from "mdbreact";

type Props = {
  callback: (index: number, name: string) => void;
  items: string[];
};

type State = {
  callback: (index: number, name: string) => void;
  selected_item: number;
};

export default class Menu020 extends Component<Props, State> {
  state: State = {
    callback: (index: number, name: string) => {},
    selected_item: 0,
  };
  constructor(props: Props) {
    super(props);
    this.state.callback = props.callback;
    this.state.callback(0, this.props.items[0]);
  }

  onMenuItemClick(index: number) {
    this.setState({ selected_item: index }, () => console.dir(this.state));
    console.log(
      "changeMenu020 name: " + this.props.items[index] + " index: " + index
    );
    this.state.callback(index, this.props.items[index]);
  }

  render() {
    return (
      <MDBBtnGroup style={{ marginTop: "60px" }}>
        {this.props.items.map((name, index) => (
          <MDBBox key={index}>
            <MDBBtn
              color="mdb-color"
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
