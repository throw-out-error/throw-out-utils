import { Direction } from "../direction";

export class Vector {
    static EMPTY: Vector = Vector.from(0, 0, 0);
    data: number[];
    originalLength: number;

    constructor(length: number) {
        this.data = [];
        this.originalLength = length;
        for (let i = 0; i < length; i++) this.data[i] = 0;
    }

    x(): number {
        return this.data[0];
    }

    y(): number {
        return this.data[1];
    }

    z(): number {
        return this.data[2];
    }

    set(...n: Array<number>): Vector {
        n.forEach((v, i) => (this.data[i][0] = v));
        return this;
    }

    static fromArray(array: number[]): Vector {
        const result = new Vector(array.length);
        result.data = array;
        return result;
    }

    static from(...n: number[]): Vector {
        return Vector.fromArray(n);
    }

    static fromString(s: string): Vector {
        return Vector.fromArray(s.split(",").map((sv) => parseFloat(sv)));
    }

    toString(): string {
        return `${this.x()},${this.y()},${this.z()}`;
    }

    /**
     * Offsets this vector in the specified direction (n times).
     * If n is not specified then it will default to one unit in the direction specified.
     * Keep in mind that this method does not clone the current vector.
     * @param direction the direction to offset in
     */
    offset(n = 1, direction: Direction): Vector {
        let dirVec = Vector.EMPTY.clone();
        switch (direction) {
            case Direction.UP:
                dirVec = Vector.from(0, 1, 0);
                break;
            case Direction.DOWN:
                dirVec = Vector.from(0, -1, 0);
                break;
            case Direction.NORTH:
                dirVec = Vector.from(0, 0, -1);
                break;
            case Direction.SOUTH:
                dirVec = Vector.from(0, 0, 1);
                break;
            case Direction.WEST:
                dirVec = Vector.from(-1, 0, 0);
                break;
            case Direction.EAST:
                dirVec = Vector.from(1, 0, 0);
                break;
        }

        if (n) dirVec = dirVec.scale(n);

        return this.add(dirVec);
    }

    dimensions(): number {
        return this.data.length;
    }

    /**
        Copies the current Vector and returns the new copy.
        This is used if you don't want to modify the original Vector when using operations.
    */
    clone(): Vector {
        const m: Vector = new Vector(this.originalLength);
        m.data = this.data;
        return m;
    }

    add(n: Vector | number): Vector {
        if (n instanceof Vector) {
            for (let i = 0; i < this.originalLength; i++)
                this.data[i] += n.data[i];
        } else if (typeof n === "number") {
            for (let i = 0; i < this.originalLength; i++) this.data[i] += n;
        }
        return this;
    }

    sub(n: Vector | number): Vector {
        if (n instanceof Vector) {
            if (this.originalLength !== n.originalLength)
                throw new Error(
                    "Can't perform sub operation on matrices with differing dimensions"
                );
            for (let i = 0; i < this.originalLength; i++)
                this.data[i] += n.data[i];
        } else if (typeof n === "number") {
            for (let i = 0; i < this.originalLength; i++) this.data[i] += n;
        }
        return this;
    }

    dot(m: Vector): number {
        if (this.originalLength !== m.originalLength)
            throw new Error(
                "Can't perform dot operation on matrices whose number of rows is not equivalent of the first Vector's number of columns"
            );
        let result = 0;
        for (let k = 0; k < this.originalLength; k++)
            result += this.data[k] * m.data[k];

        return result;
    }

    /**
     * Apply function to all elements in this Vector.
     *
     * @param {Function} transformFn With signature (number, row, col) => number
     */
    map(transformFn: Function): Vector {
        const thisData = this.data,
            rows = this.originalLength;

        const result = new Array(rows);
        for (let row = 0; row < rows; ++row) {
            result[row] = transformFn(thisData[row], row);
        }

        return Vector.fromArray(result);
    }

    scale(n: number): Vector {
        for (let i = 0; i < this.originalLength; i++) this.data[i] *= n;
        return this;
    }

    divide(n: number): Vector {
        for (let i = 0; i < this.originalLength; i++) this.data[i] /= n;
        return this;
    }

    unit(): Vector {
        return this.divide(this.length());
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    negate(): Vector {
        for (let i = 0; i < this.originalLength; i++)
            this.data[i] = -this.data[i];
        return this;
    }

    lerp(a: Vector, b: Vector, fraction: number): Vector {
        return b.clone().sub(a).scale(fraction).add(a);
    }

    equals(m: Vector): boolean {
        if (this.originalLength != m.originalLength) return false;
        for (let i = 0; i < this.originalLength; i++)
            if (this.data[i] != m.data[i]) return false;
        return true;
    }

    randomize(multiplier = 1): Vector {
        for (let i = 0; i < this.originalLength; i++)
            this.data[i] = Math.floor(Math.random() * multiplier);
        return this;
    }
}
