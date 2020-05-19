export class Matrix {
    data: Array<Array<number>>;
    rows: number;
    columns: number;
    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
        this.data = [];
        for (let i = 0; i < rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < columns; j++) this.data[i][j] = 0;
        }
    }

    static fromArray(array: number[] | number[][]): Matrix {
        const result = new Matrix(
            array.length,
            (array[0] as number[]).length ?? 1
        );
        if (array[0] instanceof Array) {
            // 2d array code
            result.data = array as number[][];
        } else {
            result.data = (array as number[]).map((n) => [n]);
        }
        return result;
    }

    /**
        Copies the current matrix and returns the new copy.
        This is used if you don't want to modify the original matrix when using operations.
    */
    clone(): Matrix {
        const m: Matrix = new Matrix(this.rows, this.columns);
        m.data = this.data;
        return m;
    }

    add(n: Matrix | number): Matrix {
        if (n instanceof Matrix) {
            if (this.rows !== n.rows || this.columns !== n.columns)
                throw new Error(
                    "Can't perform add operation on matrices with differing dimensions"
                );
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.columns; j++)
                    this.data[i][j] += n.data[i][j];
        } else if (typeof n === "number") {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.columns; j++) this.data[i][j] += n;
        }
        return this;
    }

    sub(n: Matrix | number): Matrix {
        if (n instanceof Matrix) {
            if (this.rows !== n.rows || this.columns !== n.columns)
                throw new Error(
                    "Can't perform sub operation on matrices with differing dimensions"
                );
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.columns; j++)
                    this.data[i][j] += n.data[i][j];
        } else if (typeof n === "number") {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.columns; j++) this.data[i][j] += n;
        }
        return this;
    }

    dot(m: Matrix): any {
        if (this.columns !== m.rows)
            throw new Error(
                "Can't perform dot operation on matrices whose number of rows is not equivalent of the first matrix's number of columns"
            );
        const result = new Matrix(this.rows, m.columns);
        for (let i = 0; i < result.rows; i++)
            for (let j = 0; j < result.columns; j++) {
                // Dot product of values in col
                let sum = 0;
                for (let k = 0; k < this.columns; k++)
                    sum += this.data[i][k] * m.data[k][j];
                result.data[i][j] = sum;
            }
        return result;
    }

    /**
     * Apply function to all elements in this matrix.
     *
     * @param {Function} transformFn With signature (double) => double
     */
    map(transformFn: Function): Matrix {
        const thisData = this.data,
            rows = this.rows,
            cols = this.columns;

        const result = new Array(rows);

        for (let row = 0; row < rows; ++row) {
            result[row] = new Array(cols);

            for (let col = 0; col < cols; ++col) {
                result[row][col] = transformFn(thisData[row][col]);
            }
        }

        return Matrix.fromArray(result);
    }

    scale(n: number): Matrix {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.columns; j++) this.data[i][j] *= n;
        return this;
    }

    divide(n: number): Matrix {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.columns; j++) this.data[i][j] /= n;
        return this;
    }

    unit(): Matrix {
        return this.divide(this.length());
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    negate(): Matrix {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.columns; j++)
                this.data[i][j] = -this.data[i][j];
        return this;
    }

    lerp(a: Matrix, b: Matrix, fraction: number): Matrix {
        return b.clone().sub(a).scale(fraction).add(a);
    }

    equals(m: Matrix): boolean {
        return this.data === m.data;
    }

    transpose(): Matrix {
        const result = new Matrix(this.columns, this.rows);
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.columns; j++)
                result.data[j][i] = this.data[i][j];
        return result;
    }

    randomize(multiplier = 1): Matrix {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.columns; j++)
                this.data[i][j] = Math.floor(Math.random() * multiplier);
        return this;
    }
}
