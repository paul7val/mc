import * as React from "react";
import "./../assets/scss/App.scss";
import { filterProperties } from "../assets/js/helper";
import Header from "./Header/Header";
import Home from "./Home/Home";
import Partners from "./Partners/Partners";
import Agenda from "./Agenda/Agenda";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import createBrowserHistory from 'history/createBrowserHistory'
import { TransitionGroup, CSSTransitionGroup } from 'react-transition-group'
import { Transition } from 'react-spring'

export interface State {
  partners: any[];
  lang: string;
  [key: string]: any;
};

export default class App extends React.Component<{}, State> {
  state: State = {
    partners: [],
    lang: 'de'
  };
 
  componentDidMount() {
    this.getAll();
  }

  switchLang = () => {
    const { lang } = this.state;
    this.setState({
      lang: lang === 'de' ? 'en' : 'de'
    })
    this.getAll();
  }

  getAll() {
    const { lang } = this.state;
    this.get(`http://paulmitt.nunki.uberspace.de/wordpress/wp-json/wp/v2/partners?lang=${lang}`, ['logo', 'content', 'tags', 'acf', 'id', 'title'], 'partners');
    this.get(`http://paulmitt.nunki.uberspace.de/wordpress/wp-json/wp/v2/pages?lang=${lang}`, ['content', 'tags', 'acf', 'id', 'slug'], 'pages');
    this.get(`http://paulmitt.nunki.uberspace.de/wordpress/wp-json/wp/v2/tags?lang=${lang}`, ['id', 'name'], 'tags');
    this.get(`http://paulmitt.nunki.uberspace.de/wordpress/wp-json/wp/v2/events?lang=${lang}`, ['tags', 'acf', 'id', 'title'], 'events');
  }

  get = (url: string, allowedKeys: string[], stateProp: string) => {
    const prop: string = stateProp;
    const loaded: string = `${stateProp}Loaded`;
    this.setState({
      [prop]: undefined,
      [loaded]: false
    });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          [prop]: filterProperties(res, allowedKeys, false),
          [loaded]: true
        });
      }); 
  }

  home = () => ( <Home content={this.state.pages}/> )
  partners = () => ( <Partners partners={this.state.partners} /> )
  agenda = () => (<Agenda events={this.state.events} tags={this.state.tags} /> )

  public routes = [
    {
      path: "/",
      exact: true,
      comp: this.home
    },
    {
      path: "/partners",
      comp: this.partners
    },
    {
      path: "/agenda",
      comp: this.agenda
    }
  ];

  render() {
    const {
      lang
    } = this.state;

    return (
      <div className="app">
        
        <Router>
          <Header switch={this.switchLang} lang={lang} />
          <Switch>
            {this.routes.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                exact={route.exact}
                component={route.comp}
              />
            ))}
          </Switch>
        </Router>
      </div>
    );
  }
}
