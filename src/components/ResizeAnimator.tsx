import * as React from 'react';
import {
  requestAnimationFrame,
  cancelAnimationFrame,
  easeInCubic,
  inverseEaseInCubic,
} from '../util';

export interface Props {
  children: React.ReactNode;
  /** Animation time in ms */
  duration?: number;
}

export class ResizeAnimator extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    duration: 250,
  };
  animatedNode = React.createRef<HTMLDivElement>();
  contentNode = React.createRef<HTMLDivElement>();
  animationStarted = false;
  contentHeightBeforeUpdate: number = 0;
  contentChanged: boolean = false;
  delta?: number;
  progress?: number;
  animationFrame: number = -1;
  contentHeightBeforeAnimationStart: number = 0;
  lastAnimatedNodeHeight: number = 0;
  lastPaintAt?: number;

  componentDidMount() {
    this.animatedNode.current!.style.height =
      this.contentNode.current!.offsetHeight + 'px';
  }

  componentWillUpdate() {
    this.contentHeightBeforeUpdate = this.contentNode.current!.offsetHeight;
  }

  componentDidUpdate() {
    const content = this.contentNode.current!;
    const wrapper = this.animatedNode.current!;

    this.contentChanged =
      this.contentHeightBeforeUpdate !== content.offsetHeight;
    if (this.contentChanged) {
      if (this.animationStarted) {
        const targetHeight = content.offsetHeight;

        // Re-set animation parameters based on current animation state
        this.resetAnimation();
        this.delta = targetHeight - wrapper.offsetHeight;
        const easedProgress = this.getProgressFromAnimatedHeight(
          targetHeight,
          this.delta,
          this.lastAnimatedNodeHeight,
        );
        this.progress = inverseEaseInCubic(Math.max(easedProgress, 0));
      }
      // start animation
      this.animationStarted = true;
      wrapper.style.overflow = 'hidden';
      this.contentHeightBeforeAnimationStart = this.contentHeightBeforeUpdate;
      this.animationFrame = requestAnimationFrame(this.animateHeight);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame);
  }

  getAnimatedHeight(target: number, delta: number, progress: number) {
    return target - delta + delta * progress;
  }

  getProgressFromAnimatedHeight(target: number, delta: number, height: number) {
    return (height - target + delta) / delta;
  }

  animateHeight = () => {
    const targetHeight = this.contentNode.current!.offsetHeight;
    this.lastPaintAt = this.lastPaintAt || Date.now();
    this.delta =
      this.delta || targetHeight - this.contentHeightBeforeAnimationStart;

    if (this.progress === undefined) {
      this.progress = 0;
    }

    // calculate the (linear) progress state [0,1] from time passed since last paint
    const delta = Math.min(
      (Date.now() - this.lastPaintAt) / this.props.duration!,
      1,
    );
    this.progress = Math.min(this.progress + delta, 1);

    this.lastAnimatedNodeHeight = this.getAnimatedHeight(
      targetHeight,
      this.delta,
      easeInCubic(this.progress),
    );
    this.animatedNode.current!.style.height =
      Math.floor(this.lastAnimatedNodeHeight) + 'px';

    const needMoreAnimation = this.progress < 1;

    if (needMoreAnimation) {
      this.lastPaintAt = Date.now();
      this.animationFrame = requestAnimationFrame(this.animateHeight);
    } else {
      this.resetAnimation();
      this.animatedNode.current!.style.overflow = 'visible';
    }
  };

  resetAnimation = () => {
    cancelAnimationFrame(this.animationFrame);
    this.lastPaintAt = undefined;
    this.progress = undefined;
    this.delta = undefined;
    this.animationStarted = false;
  };

  render() {
    const node = this.animatedNode.current;
    const style = this.animationStarted
      ? {
        height: node!.style.height,
        overflow: node!.style.overflow,
      }
      : {
        height: (node && node.style.height) || 'auto',
      };

    return (
      <div ref={this.animatedNode} style={style as any}>
        <div ref={this.contentNode}>{this.props.children}</div>
      </div>
    );
  }
}
