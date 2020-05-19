import { Direction } from "../direction";

// TODO: REMOVE
export class Vector {
    x: number;
    y: number;
    z: number;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    negate(): Vector {
        this.set(-this.x, -this.y, -this.z);
        return this;
    }

    add(v: Vector | number): Vector {
        if (v instanceof Vector)
            return this.set(this.x + v.x, this.y + v.y, this.z + v.z);
        else return this.set(this.x + v, this.y + v, this.z + v);
    }

    /**
     * Offsets this vector in the specified direction (n times).
     * If n is not specified then it will default to one unit in the direction specified.
     * Keep in mind that this method does not clone the current vector.
     * @param direction the direction to offset in
     */
    offset(direction: Direction, n?: number): Vector {
        let dirVec = new Vector();
        switch (direction) {
            case Direction.UP:
                dirVec = new Vector(0, 1, 0);
                break;
            case Direction.DOWN:
                dirVec = new Vector(0, -1, 0);
                break;
            case Direction.NORTH:
                dirVec = new Vector(0, 0, -1);
                break;
            case Direction.SOUTH:
                dirVec = new Vector(0, 0, 1);
                break;
            case Direction.WEST:
                dirVec = new Vector(-1, 0, 0);
                break;
            case Direction.EAST:
                dirVec = new Vector(1, 0, 0);
                break;
        }

        if (n) dirVec.scale(n);

        return this.add(dirVec);
    }

    sub(v: Vector | number): Vector {
        if (v instanceof Vector)
            return this.set(this.x - v.x, this.y - v.y, this.z - v.z);
        else return this.set(this.x - v, this.y - v, this.z - v);
    }

    scale(v: Vector | number): Vector {
        if (v instanceof Vector)
            return this.set(this.x * v.x, this.y * v.y, this.z * v.z);
        else return this.set(this.x * v, this.y * v, this.z * v);
    }

    divide(v: Vector | number): Vector {
        if (v instanceof Vector)
            return this.set(this.x / v.x, this.y / v.y, this.z / v.z);
        else return this.set(this.x / v, this.y / v, this.z / v);
    }

    equals(v: Vector): boolean {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    dot(v: Vector): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: Vector): Vector {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    sqrMagnitude(): number {
        return this.dot(this);
    }

    magnitude(): number {
        return Math.sqrt(this.sqrMagnitude());
    }

    set(x: number, y?: number, z?: number): Vector {
        this.x = x;
        this.y = y || this.y;
        this.z = z || this.z;
        return this;
    }

    getByIndex(index: number): number {
        switch (index) {
            default:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
        }
    }

    setByIndex(index: number, value: number): Vector {
        switch (index) {
            default:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
        }
        return this;
    }

    /**
    * Normalizes the vector by its magnitude
    * @function
    * @returns {Vector} Returns self
    * @instance
    * @name normalize
    * @snippet #Vector.normalize|self
    normalize();
    */
    normalize(): Vector {
        const magnitude = this.magnitude();

        if (magnitude === 0) {
            // divide by zero

            this.x = 0;

            this.y = 0;

            return this;
        }

        this.x /= magnitude;

        this.y /= magnitude;

        return this;
    }

    /**
     * Returns the distance from another vector
     * @function
     * @param {Vector} vector - Other vector
     * @returns {Number} Distance between the two vectors
     * @instance
     * @name distance
     * @snippet #Vector.distance|Number
     * distance(${1:otherVector});
     */
    distance(vector: Vector): number {
        return vector.clone().sub(this).magnitude();
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    unit(): Vector {
        return this.divide(this.length());
    }

    min(): number {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    max(): number {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    toAngles(): Record<string, number> {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length()),
        };
    }

    angleTo(a: Vector): number {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    toArray(n?: number): number[] {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }

    /**
        Copies the current vector and returns the new copy.
        This is used if you don't want to modify the original vector when using operations.
    */
    clone(): Vector {
        return new Vector(this.x, this.y, this.z);
    }

    static fromAngles(theta: number, phi: number): Vector {
        return new Vector(
            Math.cos(theta) * Math.cos(phi),
            Math.sin(phi),
            Math.sin(theta) * Math.cos(phi)
        );
    }

    randomDirection(): Vector {
        return Vector.fromAngles(
            Math.random() * Math.PI * 2,
            Math.asin(Math.random() * 2 - 1)
        );
    }

    lerp(a: Vector, b: Vector, fraction: number): Vector {
        return b.clone().sub(a).scale(fraction).add(a);
    }

    toString(): string {
        return `${this.x},${this.y},${this.z}`;
    }

    static fromArray(a: number[]): Vector {
        return new Vector(a[0], a[1], a[2]);
    }
}
