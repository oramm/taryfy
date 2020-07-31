import React, { Component } from "react";
import { MDBBtn, MDBBtnGroup, MDBBox } from "mdbreact";

type Props = {
  callback: (index: number) => void;
  menu_items: string[];
};

type State = {
  selected_item: number;
};

export default class Menu030 extends Component<Props, State> {
  state: State = {
    selected_item: 0
  };

  constructor(props: Props) {
    super(props);
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
  }
  
  componentDidUpdate(prevProps: Props) {
    if (prevProps.menu_items !== this.props.menu_items) {
      this.setState({selected_item: 0});
    }
  }
  
  onMenuItemClick(index: number) {
    this.setState({ selected_item: index }, () => console.dir(this.state));
    this.props.callback(index);
  }

  render() {
    return (
      <MDBBtnGroup>
        {this.props.menu_items.map((name, index) => (
          <MDBBox key={index}>
            <MDBBtn
              color="mdb-color"
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
