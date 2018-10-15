import * as React from "react";
import './home.scss';
import { Transition } from 'react-spring'
// import Icons from "../Icons/Icons";
import {
  createMarkup
} from "../../assets/js/helper";

export interface Props {
  style?: any;
  content: any
}

export default class Home extends React.Component<Props, {}> {
  render() {
    const { 
      content 
    } = this.props;
    const home = content && content.find(page => (page.slug === 'home'))

    return (
      <div 
        className="home"
        style={this.props.style}
      >
        {home &&
          <div
            className="dom"
            dangerouslySetInnerHTML={createMarkup(`${home.content.rendered}`)}
          />
        }
      </div>
    );
  }
}


