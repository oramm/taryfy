import React, { Component } from "react";
import { MDBBtn, MDBBtnGroup, MDBBox } from "mdbreact";

type Menu030Props = {
  callback: (index: number) => void;
  menu_items: string[];
};

type Menu030State = {
  callback: (index: number) => void;
  menu_items: string[];
  selected_item: number;
};

export default class Menu030 extends Component<Menu030Props, Menu030State> {
  state: Menu030State = {
    callback: (index: number) => {},
    menu_items: [],
    selected_item: 0
  };

  constructor(props: Menu030Props) {
    super(props);
    this.state.callback = props.callback;
    this.state.menu_items = props.menu_items;
  }

  onMenuItemClick(index: number) {
    this.setState({ selected_item: index }, () => console.dir(this.state));
    this.props.callback(index);
  }

  render() {
    return (
      <MDBBtnGroup>
        {this.state.menu_items.map((name, index) => (
          <MDBBox key={index}>
            <MDBBtn
              
              onClick={() => this.onMenuItemClick(index)}
              size="sm"
              active={this.state.selected_item === index}
            >
              {name}
            </MDBBtn>
          </MDBBox>
        ))}
      </MDBBtnGroup>
    );
  }
}
