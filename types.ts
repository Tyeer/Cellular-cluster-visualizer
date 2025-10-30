
export interface Point {
    x: number;
    y: number;
}

export interface Cell {
    id: number;
    q: number;
    r: number;
    x: number;
    y: number;
    group: number;
    corners: Point[];
}
