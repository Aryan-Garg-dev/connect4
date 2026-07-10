import { DiscColor } from "./disc"

export interface PlayerJson {
    name: string,
    color: DiscColor
}

export class Player {
    constructor(
        readonly name: string,
        readonly color: DiscColor
    ) { }

    toObject = (): PlayerJson => {
        return {
            name: this.name,
            color: this.color
        }
    };

    static fromObject = (data: PlayerJson): Player => {
        return new Player(data.name, data.color);
    };

}
