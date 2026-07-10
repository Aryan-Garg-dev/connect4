export enum DiscColor {
    RED = 'RED',
    BLUE = 'BLUE'
}

export class Disc {
    constructor(
        readonly color: DiscColor
    ) { }
}