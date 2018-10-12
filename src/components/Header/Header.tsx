import * as React from "react";
import './header.scss';
import { BrowserRouter as Router, Link } from "react-router-dom";

export interface Props {
  switch: () => void;
  lang: string;
}

export default class Header extends React.Component<Props, {}> {

  handleClick = () => {
    this.props.switch();
  }

  render() {
    const {lang} = this.props;

    return (
      <header className="header">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/agenda">Agenda</Link>
            </li>
            <li>
              <Link to="/partners">Partners</Link>
            </li>
          </ul>
        </nav>
        <div className="lang" onClick={this.handleClick}>
          <div>{lang}</div>
        </div>
      </header>
    );
  }
}


