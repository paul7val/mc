import * as React from "react";
import './header.scss';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Keyframes,animated, config, Spring } from 'react-spring'
import delay from 'delay'
import { runInThisContext } from "vm";

export interface Props {
  switch: () => void;
  lang: string;
}

interface State {
  open: boolean;
}

class Test extends React.Component<Props, State> {
  state: State = {
    open: false
  }

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

const fast = { ...config.stiff, restSpeedThreshold: 1, restDisplacementThreshold: 0.01 }

// Creates a spring with predefined animation slots
const Sidebar = Keyframes.Spring({
  // single items,
  open: { to: { x: 0 }, config: config.gentle },
  // or async functions with side-effects
  close: async call => {
    await delay(400)
    await call({ to: { x: 100 }, config: config.gentle })
  }
})

// Creates a keyframed trail
const Content = Keyframes.Trail({
  peek: [{ delay: 600, from: { x: -100, opacity: 0, blur: 4 }, to: { x: 0, opacity: 1, blur: 0 } }, { to: { x: -100, opacity: 0, blur:4 } }],
  open: { delay: -100, to: { x: 0, opacity: 1, blur: 0, pointer: 'auto' } },
  close: { to: { x: -100, opacity: 0, blur: 4, pointer: 'none' } }
})

const styles = {
  width: '100%',
  height: '100vh',
  position: 'fixed',
  top: '0',
  backgroundColor: 'black'
}

const links = [
  <Link to="/">Home</Link>,
  <Link to="/agenda">Agenda</Link>,
  <Link to="/partners">Partners</Link>
]

export default class Header extends React.Component<Props, State> {
  state: State = {
    open: false
  }

  handleClick = () => {
    this.props.switch();
  }

  toggle = () => this.setState({open: !this.state.open});

  render() {
    const { lang } = this.props;
    const state = this.state.open ? 'open' : 'close';
    return (
      <header className={!this.state.open && 'closed'}>
        <div onClick={this.toggle} className="icon">
          <svg version="1.1" id="Capa_1" width="30px" height="30px">
            <g>
              <path d="M112,6H12C5.4,6,0,11.4,0,18s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,6,112,6z" />
              <path d="M112,50H12C5.4,50,0,55.4,0,62c0,6.6,5.4,12,12,12h100c6.6,0,12-5.4,12-12C124,55.4,118.6,50,112,50z" />
              <path d="M112,94H12c-6.6,0-12,5.4-12,12s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,94,112,94z" />
            </g>
          </svg>

        </div>
        <nav>
          <Sidebar native state={state}>
            {({ x }) => (
              <>
                <div className="background">
                  <Spring from={{ opacity: this.state.open ? 0 : 1 }} to={{ opacity: this.state.open ? 1 : 0 }}>
                  {styles => <div className="test" style={styles}>i will fade in</div>}
                </Spring>
              </div>
                <animated.ul style={{ transform: x.interpolate(x => `translate3d(0,-100%,0)`) }}>
                  <Content native keys={links.map((_, i) => i)} config={{ tension: 500, friction: 60 }} state={state}>
                  {links.map((link) => ({ x, blur, pointer, ...props }) => (
                    <animated.li
                      style={{
                          transform: x.interpolate(x => `translate3d(0,${-x}%,0)`),
                          pointerEvents: pointer.interpolate(pointer => `${pointer}`),
                          filter: blur.interpolate(blur => `blur(${blur}px)`),
                        ...props
                      }}
                      onClick={this.toggle}
                    >
                      {link}
                    </animated.li>
                  ))}
                </Content>
              </animated.ul>
              </>
            )}
          </Sidebar>
          <div className="lang" onClick={this.handleClick}>
            <div>{lang}</div>
          </div>
        </nav>
      </header>
    )
  }
}

