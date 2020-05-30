import { Direction } from "../direction";

export type Scalar = [];
export type Vector = [3];
export type Matrix = [3, 3];

type ConstructorReturnType<
    T extends new (...args: any) => any
> = T extends new (...args: any) => infer R ? R : any;

type TypedArray =
    | ConstructorReturnType<Float64ArrayConstructor>
    | ConstructorReturnType<Int16ArrayConstructor>; // and so on, probably have to try out here.

type NDArray = number | NDArray[];

export class Tensor<
    S extends number[] = number[],
    T extends TypedArray = TypedArray
> {
    public static get ZERO(): Tensor {
        return Tensor.zeros([1]);
    }
    public static get VECTOR_ZERO(): Tensor {
        return Tensor.zeros([3]);
    }

    public static get MATRIX_ZERO(): Tensor {
        return Tensor.zeros([3, 3]);
    }

    /**
     * Initializes an empty tensor with the specified size. All values in the data array will be 0.
     */
    static zeros<S extends number[]>(size: S): Tensor<S> {
        return new Tensor<S>(
            new Array(size.reduce((s, l) => s * l, 1)).fill(0),
            size
        );
    }

    data: T;
    size: S;

    constructor(data: NDArray, size?: S, type = Float64Array) {
        if (!size) {
            size = new Array<number>() as S;
            size[0] = data instanceof Array ? data.length : 1;
            size[1] =
                data instanceof Array && data[0] instanceof Array
                    ? data[0].length
                    : 1;
        }

        this.data = type.from((data as number[]).flat(Infinity) ?? [data]) as T;
        if (this.data.length !== size.reduce((s, l) => s * l, 1)) {
            throw TypeError("Incorrect element count");
        }
        this.size = size;
    }

    public x(): number {
        return this.data[0][0];
    }

    public y(): number {
        return this.data[0][1];
    }

    public z(): number {
        return this.data[0][2];
    }

    public set(...n: Array<number>): Tensor {
        return this;
    }

    public static from<A extends number[]>(...data: number[]): Tensor<A> {
        return new Tensor<A>(data);
    }

    public static fromString(s: string): Tensor {
        return new Tensor(s.split(",").map((sv) => parseFloat(sv)));
    }

    public toString(): string {
        return this.data.toString();
    }

    /**
     * Offsets this Tensor in the specified direction (n times).
     * If n is not specified then it will default to one unit in the direction specified.
     * Keep in mind that this method does not clone the current Tensor.
     * @param direction the direction to offset in
     */
    public offset(n = 1, direction: Direction): Tensor {
        let dirVec = Tensor.VECTOR_ZERO.clone();
        switch (direction) {
            case Direction.UP:
                dirVec = Tensor.from<Vector>(0, 1, 0);
                break;
            case Direction.DOWN:
                dirVec = Tensor.from<Vector>(0, -1, 0);
                break;
            case Direction.NORTH:
                dirVec = Tensor.from<Vector>(0, 0, -1);
                break;
            case Direction.SOUTH:
                dirVec = Tensor.from<Vector>(0, 0, 1);
                break;
            case Direction.WEST:
                dirVec = Tensor.from<Vector>(-1, 0, 0);
                break;
            case Direction.EAST:
                dirVec = Tensor.from<Vector>(1, 0, 0);
                break;
        }

        if (n) dirVec = dirVec.scale(n);

        return this.add(dirVec);
    }

    public dimensions() {
        return this.size;
    }
    /**
        Copies the current Tensor and returns the new copy.
        This is used if you don't want to modify the original Tensor when using operations.
    */
    public clone(): Tensor {
        const d: number[] = [];
        this.data.forEach((n) => d.push(n));
        const m: Tensor = new Tensor(d, this.size);
        return m;
    }

    public add(n: Tensor | number): Tensor {
        if (n instanceof Tensor) {
            this.data.forEach((v, r, c) => {
                if ((this.data[r] as any) instanceof Array)
                    this.data[r][c] = this.data[r][c] + n.data[r][c];
                else this.data[r] = this.data[r] + n.data[r];
            });
        } else if (typeof n === "number") {
            this.data.map((v) => v + n);
        }
        return this;
    }

    sub(n: Tensor | number): Tensor {
        if (n instanceof Tensor) {
            if (this.size !== n.size)
                throw new Error(
                    "Can't perform sub operation on matrices with differing dimensions"
                );
            this.data.forEach((v, r, c) => {
                if ((this.data[r] as any) instanceof Array)
                    this.data[r][c] = this.data[r][c] - n.data[r][c];
                else this.data[r] = this.data[r] - n.data[r];
            });
        } else if (typeof n === "number") {
            this.data.map((v) => v - n);
        }
        return this;
    }

    dot(m: Tensor): number {
        if (this.size[1] !== m.size[0])
            throw new Error(
                "Can't perform dot operation on matrices whose number of rows is not equivalent of the first Tensor's number of columns"
            );
        let result = 0;
        this.forEach((v, r, c) => {
            if ((this.data[r] as any) instanceof Array)
                result += this.data[r][c] * m.data[r][c];
            else result += this.data[r] * m.data[r];
        });
        return result;
    }

    /**
     * Apply function to all elements in this Tensor.
     *
     * @param {Function} transformFn With signature (number, row, col) => number
     */
    map(transformFn: (n: number, row: number, col: number) => number): Tensor {
        const rows = this.size[0],
            cols = this.size[1] || 1;

        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++) {
                if ((this.data[r] as any) instanceof Array)
                    this.data[r][c] = transformFn(this.data[r][c], r, c);
                else this.data[r] = transformFn(this.data[r], r, c);
            }
        return this;
    }

    /**
     * Iterate over all the elements in this tensor.
     *
     * @param {Function} transformFn With signature (number, row, col) => number
     */
    forEach(callback: (n: number, row: number, col: number) => void): Tensor {
        const rows = this.size[0],
            cols = this.size[1] || 1;

        for (let row = 0; row < rows; row++)
            for (let col = 0; col < cols; col++) {
                // console.log(JSON.stringify(this.data[row]))
                if ((this.data[row] as any) instanceof Array)
                    callback(this.data[row][col], row, col);
                else callback(this.data[row], row, col);
            }

        return this;
    }

    scale(n: number): Tensor {
        return this.map((v) => (v *= n));
    }

    divide(n: number): Tensor {
        return this.map((v) => (v /= n));
    }

    unit(): Tensor {
        return this.divide(this.length());
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    negate(): Tensor {
        return this.map((v) => (v = -v));
    }

    lerp(a: Tensor, b: Tensor, fraction: number): Tensor {
        return b.clone().sub(a).scale(fraction).add(a);
    }

    equals(m: Tensor): boolean {
        return this.data.toString() === m.data.toString();
    }

    static random(size: number[], multiplier = 1): Tensor {
        const result = Tensor.zeros(size);
        result.map(() => Math.floor(Math.random() * multiplier));
        return result;
    }
}
