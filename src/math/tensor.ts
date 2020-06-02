import { Direction } from "../direction";
import { chunk, treeify } from "../misc";

export type Scalar = [];
export type Vector<T extends number = 3> = [T];

export function isVector<T extends TypedArray, S extends [number] = [3]>(
    v: Tensor<number[], T>,
    size: S = [3] as never
): v is Tensor<Vector, T> {
    return isOfSize<S, T>(v, size);
}

export function isOfSize<S extends number[], T extends TypedArray>(
    tensor: Tensor<number[], T>,
    size: S
): tensor is Tensor<S, T> {
    return (
        size.length === tensor.size.length &&
        size.every((d, i) => tensor.size[i] === d)
    );
}

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
    T extends TypedArray = TypedArray
> {
    public static get ZERO(): Tensor<[]> {
        return Tensor.zeros([]);
    }
    public static get VECTOR_ZERO(): Tensor<Vector> {
        return Tensor.zeros([3]);
    }

    public static get MATRIX_ZERO(): Tensor<[3, 3]> {
        return Tensor.zeros([3, 3]);
    }

    static random<S extends number[]>(size: S, multiplier = 1): Tensor<S> {
        const result = Tensor.zeros(size);
        result.map(() => Math.floor(Math.random() * multiplier));
        return result;
    }

    /**
     * @description Initializes an empty tensor with the specified size. All values in the data array will be 0.
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
        } = Float64Array as never // never was the quick fix, seems like a good idea
    ) {
        if (!size) {
            size = ([] as unknown) as S;
            let dim = data;
            while (Array.isArray(dim)) {
                size.push(dim.length);
                dim = dim[0];
            }
        }

        this.data = type.from((data as number[]).flat(Infinity) ?? [data]);
        if (this.data.length !== size.reduce((s, l) => s * l, 1)) {
            throw TypeError("Incorrect element count");
        }
        this.size = size;
    }

    public get x(): number {
        return this.data[0];
    }

    public set x(value: number) {
        this.data[0] = value;
    }

    public get y(): number {
        return this.data[1];
    }

    public set y(value: number) {
        this.data[1] = value;
    }

    public get z(): number {
        return this.data[2];
    }

    public set z(value: number) {
        this.data[2] = value;
    }

    public set(...n: Array<number>): Tensor<S, T> {
        this.data.set(n);
        return this;
    }

    public static from<A extends number[]>(...data: number[]): Tensor<A> {
        return new Tensor<A>(data);
    }

    public static fromString(s: string): Tensor {
        return new Tensor(s.split(",").map((sv) => parseFloat(sv)));
    }

    public toArrayString(): string {
        return treeify(this.toArray());
    }

    public toString(): string {
        return this.data.toString();
    }

    /**
     * @description Swaps the dimensions of this tensor
     */
    public transpose(): Tensor<S, T> {
        this.size.reverse();
        return this;
    }

    /**
     * @description converts
     */
    public toArray(): NDArray {
        const size = this.size;
        const go = (a: NDArray) => {
            const s = size.pop();
            const result = chunk(a as number[], s as number);
            size.push(s as number);
            return result.length > 1 ? result.map(go) : a;
        };
        return go(this.data);
    }

    /**
     * @description Offsets this tensor by the specified amount.
     * If n is not specified then it will default to one unit.
     * Keep in mind that this method does not clone the current Tensor.
     * Also, the size must match the value array's length.
     * @param n The amount of units to offset to
     * @param val The offset values (ex. offset(1, 0, 2, 0) will offset 2 units up)
     */
    public offset(n = 1, val: number[]): Tensor<S, T> {
        // TODO: size check on val and this.size
        if (this.size[0] != val.length)
            throw new Error(
                "This tensor's size must be the same as the offset value array!"
            );
        this.map((v, i) => v + val[i] * n);
        return this;
    }

    /**
     * @description Offsets this Tensor in the specified direction (n times).
     * If n is not specified then it will default to one unit in the direction specified.
     * Keep in mind that this method does not clone the current Tensor.
     * @param direction the direction to offset in
     */
    public offsetDir(n = 1, direction: Direction): Tensor<Vector, T> {
        if (!isOfSize<Vector<3>, T>(this, [3])) {
            throw TypeError(
                "This tensor must be a Vector of size [3] to be offsetted."
            );
        }

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

        dirVec.scale(n);

        this.add(dirVec);
        return this;
    }

    public dimensions() {
        return this.size;
    }
    /**
     * @description
     * Copies the current Tensor and returns the new copy.
     * This is used if you don't want to modify the original Tensor when using operations.
     */
    public clone(): Tensor<S, T> {
        const d: number[] = [];
        this.data.forEach((n: number) => d.push(n));
        const m: Tensor<S, T> = new Tensor(d, this.size);
        return m;
    }

    public add(n: Tensor<S> | number): Tensor<S, T> {
        if (typeof n === "number") {
            this.map((v) => v + n);
            return this;
        }

        if (this.size.some((v, i) => n.size[i] !== v)) {
            throw TypeError("Tensor have to have the same size");
        }

        this.map((v, i) => v + n.data[i]);
        return this;
    }

    sub(n: Tensor | number): Tensor<S, T> {
        if (typeof n === "number") {
            this.map((v) => v - n);
            return this;
        }

        if (!isOfSize(n, this.size)) {
            throw TypeError("Tensor have to have the same size");
        }

        this.map((v, i) => v - n.data[i]);
        return this;
    }

    /**
     * @returns the dot product of the tensors
     */
    dot(m: Tensor): number {
        if (this.size[1] !== m.size[0])
            throw new Error(
                "Can't perform dot operation on matrices whose number of rows is not equivalent of the first Tensor's number of columns"
            );
        let result = 0;
        this.forEach((v: number, i: number) => (result += this.data[i] * m.data[i]));
        return result;
    }

    /**
     * Apply function to all elements in this Tensor.
     *
     * @param {Function} callback With signature (number, row, col) => number
     */
    map(
        callback: (val: number, index: number, arr: ArrayLike<number>) => number
    ): ThisType<Tensor> {
        this.data = this.data.map(callback) as T;
        return this;
    }

    /**
     * Iterate over all the elements in this tensor.
     *
     * @param {Function} callback With signature (value, index, array) => void
     */
    forEach(
        callback: (val: number, index: number, arr: ArrayLike<number>) => void
    ): ThisType<Tensor> {
        this.data.forEach(callback);
        return this;
    }

    scale(factor: number): Tensor<S, T> {
        this.map((v) => v * factor);
        return this;
    }

    divide(n: number): Tensor<S, T> {
        return this.scale(1 / n);
    }

    // TODO: matrix multiplcation (.mult()) and division (.div())

    negate(): ThisType<Tensor> {
        return this.map((v) => (v = -v));
    }

    lerp(a: Tensor, b: Tensor, fraction: number): Tensor {
        return b.clone().sub(a).scale(fraction).add(a);
    }

    equals(m: Tensor): boolean {
        return this.data.toString() === m.data.toString();
    }
}
