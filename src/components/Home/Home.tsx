import * as React from "react";
import './home.scss';
import { Transition } from 'react-spring'
// import Icons from "../Icons/Icons";

export interface Props {
  style?: any;
  content
}

export default class Home extends React.Component<Props, {}> {

  render() {
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
      </div>
    );
  }
}


