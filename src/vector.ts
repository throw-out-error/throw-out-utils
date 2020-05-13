export class Vector {
    x: number;
    y: number;
    z: number;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    negative() {
        return new Vector(-this.x, -this.y, -this.z);
    }

    add(v: any) {
        if (v instanceof Vector)
            return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector(this.x + v, this.y + v, this.z + v);
    }

    subtract(v: any) {
        if (v instanceof Vector)
            return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        else return new Vector(this.x - v, this.y - v, this.z - v);
    }

    scale(v: any) {
        if (v instanceof Vector)
            return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        else return new Vector(this.x * v, this.y * v, this.z * v);
    }

    divide(v: any) {
        if (v instanceof Vector)
            return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector(this.x / v, this.y / v, this.z / v);
    }

    equals(v: Vector) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    dot(v: Vector) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: Vector) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    dotProduct(vector: Vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    sqrMagnitude() {
        return this.dotProduct(this);
    }

    magnitude() {
        return Math.sqrt(this.sqrMagnitude());
    }

    set(x: number, y?: number, z?: number) {
        this.x = x;
        this.y = y || this.y;
        this.z = z || this.z;
    }

    /**
  
    * Normalizes the vector by its magnitude
  
    * @function
  
    * @returns {Vector2} Returns self
  
    * @instance
  
    * @name normalize
  
    * @snippet #Vector2.normalize|self
  
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
  
      distance(${1:otherVector});
    */
    distance(vector: Vector) {
        return vector.subtract(this).magnitude();
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    unit() {
        return this.divide(this.length());
    }

    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length()),
        };
    }

    angleTo(a: Vector) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    toArray(n?: number) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }

    clone() {
        return new Vector(this.x, this.y, this.z);
    }

    fromAngles(theta: number, phi: number) {
        return new Vector(
            Math.cos(theta) * Math.cos(phi),
            Math.sin(phi),
            Math.sin(theta) * Math.cos(phi)
        );
    }
    randomDirection() {
        return this.fromAngles(
            Math.random() * Math.PI * 2,
            Math.asin(Math.random() * 2 - 1)
        );
    }

    lerp(a: any, b: any, fraction: any) {
        return b.subtract(a).scale(fraction).add(a);
    }
    fromArray(a: number[]) {
        return new Vector(a[0], a[1], a[2]);
    }
}
