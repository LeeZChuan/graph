import { EaseType, initScaler } from '../scaler';
import { LinearScaler } from '../scaler/LinearScaler';
import { Scaler } from './Scaler';

export interface PlayerOption {
  begin?: number;
  end?: number;
  now?: number;
  ease?: EaseType;
}

export abstract class Player {
  option: PlayerOption;
  _scaler: Scaler | undefined;
  startAt: number = 0;
  anim: number = 0;
  constructor(option: PlayerOption = {}) {
    this.option = option;
  }
  get scaler() {
    if (!this._scaler) {
      this._scaler = initScaler(this.begin, this.end, this.ease);
      return this._scaler;
    }
    return this._scaler;
  }
  get begin() {
    return this.option.begin || 0;
  }
  get end() {
    return this.option.end || 1000;
  }
  get now() {
    return this.option.now || 0;
  }
  get ease() {
    return this.option.ease || 'linear';
  }
  set now(val: number) {
    this.option.now = val;
    this.update();
  }
  play() {
    if (this.anim) {
      return;
    }
    this.now = 0;
    this.startAt = Date.now();
    this.anim = requestAnimationFrame(this.tick.bind(this));
  }
  tick() {
    this.now = Date.now() - this.startAt;
    if (this.now > this.end) {
      this.anim = 0;
    } else {
      this.anim = requestAnimationFrame(this.tick.bind(this));
    }
  }
  abstract update(): void;
}
