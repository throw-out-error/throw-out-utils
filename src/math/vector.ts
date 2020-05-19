import { Matrix } from "./matrix";
import { Direction } from "../direction";

export class Vector extends Matrix {
    static EMPTY: Vector = Vector.from(0, 0, 0)

    constructor(length: number) {
        super(length, 1);
    }

    x(): number {
        return this.data[0][0];
    }

    y(): number {
        return this.data[1][0];
    }

    z(): number {
        return this.data[2][0];
    }

    set(...n: Array<number>): Vector {
        n.forEach((v, i) => (this.data[i][0] = v));
        return this;
    }

    static fromArray(array: number[] | number[][]): Vector {
        return Vector.fromMatrix(super.fromArray(array));
    }

    static from(...n: number[]): Vector {
        return Vector.fromArray(n);
    }

    static fromMatrix(m: Matrix): Vector {
        const v = new Vector(m.rows)
        m.data.forEach((_v1: number[], i: number) =>
            _v1.forEach((v2: number) => (v.data[i][0] = v2))
        );
        return v;
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
        let dirVec = Vector.EMPTY.clone()
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

    add(n: Vector | number): Vector {
        return Vector.fromMatrix(super.add(n));
    }

    sub(n: Vector | number): Vector {
        return Vector.fromMatrix(super.sub(n));
    }

    scale(n: number): Vector {
        return Vector.fromMatrix(super.scale(n));
    }

    divide(n: number): Vector {
        return Vector.fromMatrix(super.scale(n));
    }

    equals(m: Vector): boolean {
        return super.equals(m);
    }

    /**
        Copies the current vector and returns the new copy.
        This is used if you don't want to modify the original vector when using operations.
    */
    clone(): Vector {
        return Vector.fromMatrix(super.clone());
    }

    map(transformFn: Function): Vector {
        return Vector.fromMatrix(super.map(transformFn));
    }

    negate(): Vector {
        return Vector.fromMatrix(super.negate());
    }

    lerp(a: Vector, b: Vector, fraction: number): Vector {
        return Vector.fromMatrix(super.lerp(a, b, fraction));
    }

    transpose(): Vector {
        return Vector.fromMatrix(super.transpose());
    }
}
