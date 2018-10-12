import * as React from 'react';
import {
  requestAnimationFrame,
  cancelAnimationFrame,
  easeInCubic,
  easeOutCubic,
} from '../../util';
import { ResizeAnimator } from '../ResizeAnimator';

export interface Props {
  children: React.ReactNode;
  /** value is in ms */
  minHeight?: number;
  more?: any;
  duration?: number;
  open: boolean;
  resize?: boolean;
}

export default class Accordion extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    duration: 250,
    resize: false,
    minHeight: 0,
    more: null,
  };

  contentNode = React.createRef<HTMLDivElement>();
  animatedNode = React.createRef<HTMLDivElement>();
  animationStarted = false;
  stateChanged = false;
  prevChildren?: React.ReactNode;
  animationFrame?: number;
  lastPaintAt?: number;
  isReverted: boolean = false;
  wasClosing: boolean = false;
  progress?: number;

  componentDidMount() {
    // if (!this.props.open) {
    //   this.contentNode.current!.style.display = 'none';
    // }
  }

  componentWillUpdate(nextProps: Props) {
    if (!this.animationStarted) {
      this.stateChanged = nextProps.open !== this.props.open;
      this.prevChildren = this.props.children;
    }
    // if (nextProps.open) {
    //   this.contentNode.current!.style.display = 'block';
    // }
  }

  componentDidUpdate() {
    if (this.stateChanged && !this.animationStarted) {
      // start animation
      this.animationStarted = true;
      this.animatedNode.current!.style.overflow = 'hidden';
      this.animationFrame = requestAnimationFrame(this.animateHeight);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame);
  }

  animateHeight = () => {
    const targetHeight = this.contentNode.current!.offsetHeight;
    const isClosing = !this.props.open;
    this.isReverted = this.wasClosing !== isClosing || this.isReverted;
    this.lastPaintAt = this.lastPaintAt || Date.now();
    this.progress =
      this.progress || this.animatedNode.current!.offsetHeight / targetHeight;

    // calculate the (linear) progress state [0,1] from time passed since last paint
    const delta = Math.min(
      (Date.now() - this.lastPaintAt) / this.props.duration!,
      1,
    );
    this.progress = isClosing
      ? Math.max(this.progress - delta, 0)
      : Math.min(this.progress + delta, 1);

    // apply transition timing function
    const easedProgress =
      isClosing && !this.isReverted
        ? easeOutCubic(this.progress)
        : easeInCubic(this.progress);

    // Make sure we land on 0
    this.animatedNode.current!.style.height =
      Math.floor(Math.max(this.props.minHeight, targetHeight * easedProgress)) + 'px';

    const needMoreAnimation = isClosing ? this.progress > 0 : this.progress < 1;

    if (needMoreAnimation) {
      this.lastPaintAt = Date.now();
      this.wasClosing = isClosing;
      this.animationFrame = requestAnimationFrame(this.animateHeight);
    } else {
      this.lastPaintAt = undefined;
      this.progress = undefined;
      this.animationStarted = false;
      if (!isClosing) {
        this.animatedNode.current!.style.overflow = 'visible';
        this.animatedNode.current!.style.height = 'auto';
      } 
      // else {
      //   this.contentNode.current!.style.display = 'none';
      // }
    }
  };

  render() {
    const { open, children, duration, resize } = this.props;

    const defaultStyle =
      !this.stateChanged && !this.animationStarted
        ? !open
          ? { height: `${this.props.minHeight}px`, overflow: 'hidden', position: 'relative' }
          : { height: 'auto', position: 'relative' }
        : {
          height: this.animatedNode.current!.style.height,
          overflow: this.animatedNode.current!.style.overflow,
          position: 'relative'
        };
    const content = !open && this.stateChanged ? this.prevChildren : children;

    return (
      <div ref={this.animatedNode} style={defaultStyle as any}>
        <div ref={this.contentNode}>
          {resize ? (
            <ResizeAnimator duration={duration}>{content}</ResizeAnimator>
          ) : (
              content
            )}
        </div>
        {this.props.more}
      </div>
    );
  }
}
