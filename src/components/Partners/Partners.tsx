import * as React from "react";
import './partners.scss';
import { readMoreSplit, createMarkup } from "../../assets/js/helper";
import ToggleActive from "../ToggleActive/ToggleActive";
import Accordeon from "../Accordeon/Accordeon";
import ReadMore from "../ReadMore/ReadMore";
// import '../ToggleActive/toggleActive.scss'
import { Transition } from 'react-spring'

export interface AppProps {
  partners: any
}

export interface State {
  reset: boolean;
}

export default class Partners extends React.Component<AppProps, State> {
  state = { reset: false }

  reset = () => {
    this.setState({
      reset: !this.state.reset
    })
  }

  render() {
    const { partners } = this.props;
    return (
      <div className="partners">
        <h1 onClick={this.reset}>PARTNERS</h1>
        <Transition
          from={{ opacity: 0, height: 0 }}
          enter={{ opacity: 1, height: 'auto' }}
          leave={{ opacity: 0, height: 0 }}>
          {this.state.reset && (styles => <div style={styles}>Single Component</div>)}
        </Transition>
        {partners.map(partner => {
          const readmore = readMoreSplit(partner.acf.description);
            return (
            <div
              className="partner"
              key={partner.id}
            >
              <div className="logo">
                <img src={partner.acf.image.sizes.medium_large} />
              </div>
              <h2>
                {partner.title.rendered}
              </h2>
              <div className="content">
                <ToggleActive
                  render={(open, onChange) => {
                    return (
                      <>
                        <div
                          className="intro"
                          dangerouslySetInnerHTML={createMarkup(`${readmore[0]}`)}
                        />
                        <Transition
                          from={{ opacity: 0, height: 0 }}
                          enter={{ opacity: 1, height: 'auto' }}
                          leave={{ opacity: 0, height: 0 }}
                          config={{ tension: 230, friction: 30 }}>
                          {open && (styles =>
                            <div
                              className="more"
                              style={styles}
                              dangerouslySetInnerHTML={createMarkup(`${readmore[1]}`)}
                              key={`partner${partner.id}`}
                            />
                          )}
                        </Transition>
                        <ReadMore click={() =>  onChange( ) } label="more" />

                      </>
                    );
                  }}
                />
                {/* <ToggleActive
                  render={(open, onChange) => {
                    return (
                      <>
                        <div
                          className="intro"
                          dangerouslySetInnerHTML={createMarkup(`${readmore[0]}`)}
                        />

                        <Accordeon
                          open={open}
                          minHeight={100}
                          more={<ReadMore click={onChange} label="more..." open={open} />}
                        >
                          <div
                            className="more"
                            dangerouslySetInnerHTML={createMarkup(`${readmore[1]}`)}
                            key={`partner${partner.id}`}
                          />
                        </Accordeon>
                      </>
                    );
                  }}
                /> */}

              </div>
            </div>
          )
          })
        }
      </div>
    );
  }
}


