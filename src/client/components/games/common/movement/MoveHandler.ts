
class KeysHandler {
  pressed: {[key: string]: number|null} = {};
  constructor() {
    document.addEventListener("keydown", e => this.onKeyDown(e));
    document.addEventListener("keyup", e => this.onKeyUp(e));
  }

  destroy() {
    document.removeEventListener('keydown', e => this.onKeyDown(e));
    document.removeEventListener('keyup', e => this.onKeyUp(e));
  }

  onKeyDown(e: KeyboardEvent) {
    this.pressed[e.key] = new Date().getTime();
  }

  onKeyUp(e: KeyboardEvent) {
    this.pressed[e.key] = null;
  }

  isPressed(key: string) {
    return !! this.pressed[key];
  }
  lastPressed(key1: string, key2: string): string|void {
    const time1 = this.pressed[key1];
    const time2 = this.pressed[key2];

    if(time1 && time2) {
      return time1 > time2 ? key1 : key2;
    } else if(time1) {
      return key1;
    } else if(time2) {
      return key2;
    }
  }
}

const GAME_FPS = 64;

const MOVE_KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_LEFT: 'ArrowLeft',
};

export interface CoordinatesMove {
  up: 1|0
  down: 1|0
  right: 1|0
  left: 1|0
}

export interface PlayerCoordinates {
  y: number
  x: number
}

type MoveWatcher = (move: CoordinatesMove) => void;
type CoordinatesWatcher = (coordinates: PlayerCoordinates) => void;

export class MoveHandler {
  interval: any;
  keysHandler: KeysHandler;
  watcher: MoveWatcher|null = null;

  constructor(
  ) {
    this.keysHandler = new KeysHandler();
    this.interval = setInterval(() => this.checkMove(), 1000/GAME_FPS);
  }

  onChange(cb: MoveWatcher) {
    this.watcher = cb
  }

  destroy() {
    clearInterval(this.interval);
  }

  checkMove() {
    const verticalMove = this.keysHandler.lastPressed(MOVE_KEYS.ARROW_UP, MOVE_KEYS.ARROW_DOWN);
    const horizontalMove = this.keysHandler.lastPressed(MOVE_KEYS.ARROW_RIGHT, MOVE_KEYS.ARROW_LEFT);

    const moves = [];
    if(verticalMove) moves.push(verticalMove === MOVE_KEYS.ARROW_UP ? 'up':'down');
    if(horizontalMove) moves.push(horizontalMove === MOVE_KEYS.ARROW_RIGHT ? 'right':'left');

    if(moves.length && this.watcher) {
      this.watcher({
        up: verticalMove === MOVE_KEYS.ARROW_UP ? 1 : 0,
        down: verticalMove === MOVE_KEYS.ARROW_DOWN ? 1 : 0,
        right: horizontalMove === MOVE_KEYS.ARROW_RIGHT ? 1 : 0,
        left: horizontalMove === MOVE_KEYS.ARROW_LEFT ? 1 : 0,
      })
    }
  }
}

interface PositionManagerConfig {
  offsetX?: number,
  offsetY?: number,
  minX?: number,
  maxX?: number,
  minY?: number,
  maxY?: number,
  speed?: number,
}

export class PositionManager {
  y = 0;
  x = 0;
  speed = 2;

  watcher: CoordinatesWatcher|null = null;

  constructor(
    private config: PositionManagerConfig = {},
    private moveHandler: MoveHandler = new MoveHandler()
  ) {
    if(this.config.offsetX) this.x = this.config.offsetX;
    if(this.config.offsetY) this.y = this.config.offsetY;
    if(this.config.speed) this.speed = this.config.speed;
    this.moveHandler.onChange(move => this.onMove(move));
  }

  destroy() {
    this.moveHandler.destroy();
  }

  onChange(watcher: CoordinatesWatcher) {
    this.watcher = watcher
  }

  getCoordinates(): PlayerCoordinates {
    return {
      y: this.y,
      x: this.x,
    }
  }

  private onMove(move: CoordinatesMove) {
    this.y += move.up - move.down;
    this.x += move.right - move.left;

    if(this.config.minX !== undefined) this.x = Math.max(this.x, this.config.minX);
    if(this.config.maxX !== undefined) this.x = Math.min(this.x, this.config.maxX);
    if(this.config.minY !== undefined) this.y = Math.max(this.y, this.config.minY);
    if(this.config.maxY !== undefined) this.y = Math.min(this.y, this.config.maxY);

    if(this.watcher) {
      this.watcher(this.getCoordinates())
    }
  }

}

