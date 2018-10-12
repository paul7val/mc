import * as React from "react";
import './agenda.scss';
import ReturnMapContent from "../ReturnMapContent/ReturnMapContent";
import { 
  someInBothAr, 
  createMarkup 
} from "../../assets/js/helper";
import { Transition, animated } from 'react-spring'

export interface Props {
  events: any[];
  tags: any[];
}

export interface State {
  tagIDsOfCat: any;
  activeTagsId: any;
  items: string[]
}

export default class Agenda extends React.Component<Props, State> {

  state: State = { 
    tagIDsOfCat: [],
    activeTagsId: [],
    items: []
  };

  componentDidMount() {
    const {
      events,
      tags,
    } = this.props;

    this.tagIDsOfCategory();

    // new item
    setTimeout(() => this.setState({ items: ['item1', 'item2', 'item3', 'item4'] }), 1000)
    // new item in between
    setTimeout(() => this.setState({ items: ['item1', 'item2', 'item5', 'item3', 'item4'] }), 2000)
    // deleted items
    setTimeout(() => this.setState({ items: ['item1', 'item3', 'item4'] }), 3000)
    // scrambled order
    setTimeout(() => this.setState({ items: ['item4', 'item2', 'item3', 'item1'] }), 4000)
  }

  tagIDsOfCategory = () => {
    const {
      events,
      tags
    } = this.props;

    const tagIDsOfCat = {};
    tags.forEach(tag => 
      events.forEach(event => 
        event.tags.forEach(eventTagId => {
          if (tag.id === eventTagId) {
            tagIDsOfCat[tag.id] = tag.name
          }
        })
      )
    );

    this.setState({
      tagIDsOfCat
    })
  }

  // find selected Tags and save to Array
  handleFilter = (tag: number) => {
    const { activeTagsId } = this.state;
    if (activeTagsId.includes(tag)) {
      this.setState({ activeTagsId: [...this.state.activeTagsId].filter(item => item !== tag) });
    } else {
      this.setState({
        activeTagsId: [...this.state.activeTagsId, tag]
      })
    }
  }


  render() {
    const {
      events,
      tags
    } = this.props;
    const { 
      activeTagsId,
      tagIDsOfCat
    } = this.state;

    const defaultStyles = {
      overflow: 'hidden',
      width: '100%',
      backgroundColor: '#247BA0',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      fontSize: '4em'
    }
    
    
    return (
      <div className="agenda">
        <h1>AGENDA</h1>
        
        <div className="filter">
          <div>
            Filter nach Tags
          </div>
          {Object.keys(tagIDsOfCat).map(id => {
              const tagname = tagIDsOfCat[id]
              return (
                <label key={`filter${id}`}>
                  <input type="checkbox" name="filter" value={tagname} onClick={() => this.handleFilter(parseInt(id))} />{tagname}
                </label>
              )
            })}
          
        </div>
        <ReturnMapContent
          content={events ? events : []}
          classname="event"
          render={(item) => {
            
            if (activeTagsId.length === 0 || someInBothAr(activeTagsId, item.tags)) {
              return (
                <>
                  <div className="title">
                    <h3>{item.title.renderd}</h3>
                  </div>
                  <div className="date">
                    <p>{item.acf.date}</p>
                  </div>
                  <div className="time">
                    <p>{item.acf.time}</p>
                  </div>
                  <div className="tags">
                    <ReturnMapContent
                      content={item.tags}
                      classname="tag"
                      render={(tag) => {
                        const tagName = tags.find(tagReq => { 
                          return tagReq.id === tag
                        })
                        if (tagName) {
                          return (
                            <p>{tagName.name}</p>
                          )
                        }
                      }}
                    />
                  </div>
                  <div 
                    className="description"
                    dangerouslySetInnerHTML={createMarkup(`${item.acf.description}`)}
                  />
                </>
              )
            }
          }}
        />
      </div>
    );
  }
}


