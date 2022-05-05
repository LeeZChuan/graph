import { Player } from '../core/Player';

export class PlayerGroup extends Player {
  players: Player[];

  constructor(players: Player[]) {
    super({
      begin: Math.min(...players.map(e => e.begin)),
      end: Math.max(...players.map(e => e.end)),
    });
    this.players = players;
  }
  update() {
    this.players.forEach(e => {
      e.now = this.now;
    });
  }
}
