import * as React from "react";
import './ReadMore.scss';

export interface Props {
  click: () => void;
  label: string;
}

const ReadMore = ({click, label}: Props) => (
  <div 
    className="readMore"
    onClick={click}
  >
    <h1>{label}</h1>
  </div>
)

export default ReadMore
