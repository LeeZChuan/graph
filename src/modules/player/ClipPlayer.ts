import { BoundingRect, Group, Rect } from 'zrender';
import Displayable from 'zrender/lib/graphic/Displayable';
import { Player, PlayerOption } from '../core/Player';

export interface ClipPlayerOption extends PlayerOption {
  direction?: 'TB' | 'LR' | 'RL' | 'BT';
}

export class ClipPlayer extends Player {
  target: Group | Displayable;
  clip: Rect;

  option: ClipPlayerOption;
  rect: BoundingRect;
  constructor(target: Group | Displayable, option: ClipPlayerOption = {}) {
    super(option);
    this.option = option;
    this.target = target;
    const rect = target.getBoundingRect();
    this.clip = new Rect({
      silent: true,
      shape: {
        ...rect,
      },
    });
    this.rect = rect;
    target.setClipPath(this.clip);
    this.update();
  }

  update() {
    let now = Math.max(this.now, this.begin);
    now = Math.min(now, this.end);
    let temp = 0;
    switch (this.direction) {
      case 'LR':
        this.clip.attr({
          shape: {
            width: this.scaler.normalize(now) * this.rect.width,
          },
        });
        break;
      case 'BT':
        temp = this.scaler.normalize(now) * this.rect.height;
        this.clip.attr({
          shape: {
            y: this.rect.y + this.rect.height - temp,
            height: temp,
          },
        });
        break;
      case 'TB':
        this.clip.attr({
          shape: {
            height: this.scaler.normalize(now) * this.rect.height,
          },
        });
        break;
      case 'RL':
        temp = this.scaler.normalize(now) * this.rect.width;
        this.clip.attr({
          shape: {
            x: this.rect.x + this.rect.width - temp,
            width: temp,
          },
        });
        break;
    }
  }
  get direction() {
    return this.option.direction || 'LR';
  }
}
