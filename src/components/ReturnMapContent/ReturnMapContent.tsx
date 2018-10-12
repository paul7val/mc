import * as React from 'react';

export interface Props {
  content: any[any];
  classname: string
  render: (item: any) => React.ReactNode;
}

export default class ReturnMapContent extends React.Component<Props, {}> {

  render() {
    const { 
      render, 
      content, 
      classname 
    } = this.props;

    return content.map(item => {      
      return (
        <div
          className={classname}
          key={`${classname}${content.id}`}
        >
          {render(item)}
        </div>
      )
    })
  }
}
