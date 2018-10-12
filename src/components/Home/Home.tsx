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
        {/* <Icons /> */}
        <Transition
          from={{ opacity: 0, transform: 'translateX(50px)' }}
          enter={{ opacity: 1, transform: 'translateX(0)' }}
          leave={{ opacity: 0, transform: 'translateX(50px)' }}>
          {(styles => (
            <h1 style={styles}>HOME</h1>
          ))}
        </Transition>
        <Transition
          from={{ opacity: 0, transform: 'translateX(100px)' }}
          enter={{ opacity: 1, transform: 'translateX(0)' }}
          leave={{ opacity: 0, transform: 'translateX(100px)' }}
          delay={50}
        >
          {(styles => (
            <p style={styles}>content, content, content</p>
          ))}
        </Transition>
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


