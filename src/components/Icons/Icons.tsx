import * as React from "react";
import * as ReactDOM from 'react-dom'
import { Spring, animated } from 'react-spring'
import { TimingAnimation } from 'react-spring/dist/addons'

export interface State {
  offset: number;
}

export default class Icons extends React.Component<{}, State> {
  state = { offset: 0 }


  render() {
    const { offset } = this.state
    return (
      <svg width="500" viewBox="0 0 23 23">
        <g fill="transparent" stroke="blue" 
          fill-opacity="0" stroke-opacity="1" strokeWidth="01" stroke-linecap="round" stroke-linejoin="round">
          <Spring native reset from={{ dash: offset }} to={{ dash: 0 }} impl={TimingAnimation} config={{ duration: 3000 }}>
            {stroke => {
              return (
              <animated.path

                fill="#373737"
                strokeDasharray={offset}
                // strokeDashoffset={stroke.dash}
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            )}}
          </Spring>
        </g>
      </svg>
    )
  }
}


