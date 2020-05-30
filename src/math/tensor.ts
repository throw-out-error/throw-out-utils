import { Direction } from "../direction";

export type Scalar = [];
export type Vector = [3];
export type Matrix = [3, 3];

export type Float32Array = globalThis.Float32Array;
export type Float64Array = globalThis.Float64Array;
export type Int8Array = globalThis.Int8Array;
export type Int16Array = globalThis.Int16Array;
export type Int32Array = globalThis.Int32Array;
export type Uint8ClampedArray = globalThis.Uint8ClampedArray;
export type Uint8Array = globalThis.Uint8Array;
export type Uint16Array = globalThis.Uint16Array;
export type Uint32Array = globalThis.Uint32Array;

export type TypedArray =
    | Float32Array
    | Float64Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint8ClampedArray
    | Uint8Array
    | Uint16Array
    | Uint32Array;

type NDArray = number | ArrayLike<number> | ArrayLike<NDArray>;

export class Tensor<
    S extends number[] = number[],
    T extends TypedArray = Float64Array
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

    constructor(
        data: NDArray,
        size?: S,
        type: {
            from(array: ArrayLike<number>): T;
        } = Float64Array as any
    ) {
        if (!size) {
            size = ([] as unknown) as S;
            let dim = data;
            while (Array.isArray(dim)) {
                size.push(dim.length);
                dim = dim[0];
            }
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

    public set(...n: Array<number>): ThisType<Tensor> {
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
    public offset(n = 1, direction: Direction): ThisType<Tensor> {
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

        // if (n) dirVec = dirVec.scale(n);

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

    public add(n: Tensor | number): ThisType<Tensor> {
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

    sub(n: Tensor | number): ThisType<Tensor> {
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
    map(
        transformFn: (n: number, row: number, col: number) => number
    ): ThisType<Tensor> {
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
    forEach(
        callback: (n: number, row: number, col: number) => void
    ): ThisType<Tensor> {
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

    scale(n: number): ThisType<Tensor> {
        return this.map((v) => (v *= n));
    }

    divide(n: number): ThisType<Tensor> {
        return this.map((v) => (v /= n));
    }

    // unit(): ThisType<Tensor> {
    //     return this.divide(this.length());
    // }

    // // WTF
    // length(): number {
    //     return Math.sqrt(this.dot(this));
    // }

    negate(): ThisType<Tensor> {
        return this.map((v) => (v = -v));
    }

    // lerp(a: Tensor, b: Tensor, fraction: number): Tensor {
    //     return b.clone().sub(a).scale(fraction).add(a);
    // }

    equals(m: Tensor): boolean {
        return this.data.toString() === m.data.toString();
    }

    static random(size: number[], multiplier = 1): Tensor {
        const result = Tensor.zeros(size);
        result.map(() => Math.floor(Math.random() * multiplier));
        return result;
    }
}
