import { Vector } from "./vector";

export class Cuboid {
    public static AIR: Cuboid = new Cuboid(0, 0, 0, 0, 0, 0);
    public static FULL_CUBE: Cuboid = new Cuboid(0, 0, 0, 1, 1, 1);

    protected minimumPoint: Vector;
    protected maximumPoint: Vector;

    public constructor(
        x1: number,
        x2: number,
        y1: number,
        y2: number,
        z1: number,
        z2: number
    ) {
        this.minimumPoint = new Vector(x1, y1, z1);
        this.maximumPoint = new Vector(x2, y2, z2);
    }

    public static fromVector(v: Vector) {
        return this.fromVectors(v, v);
    }

    /**
     *
     * @param p1 The minimum point
     * @param p2 The maximum point
     */
    public static fromVectors(p1: Vector, p2: Vector) {
        return new Cuboid(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }

    public equals(c: Cuboid): boolean {
        return (
            c.minimumPoint.equals(this.minimumPoint) &&
            c.maximumPoint.equals(this.maximumPoint)
        );
    }

    isEmpty(): boolean {
        return this.maxX() == 0 && this.maxY() == 0 && this.maxZ() == 0;
    }

    public minX(): number {
        return this.minimumPoint.x;
    }

    public minY(): number {
        return this.minimumPoint.y;
    }

    public minZ(): number {
        return this.minimumPoint.z;
    }

    public maxX(): number {
        return this.minimumPoint.x;
    }

    public maxY(): number {
        return this.minimumPoint.y;
    }

    public maxZ(): number {
        return this.minimumPoint.z;
    }
    /**
     * Creates a new Cuboid that has been contracted by the given amount, with positive changes
     * decreasing max values and negative changes increasing min values.
     * If the amount to contract by is larger than the length of a side, then the side will wrap (still creating a valid
     * AABB - see last sample).

    */
    public contract(x: number, y: number, z: number): Cuboid {
        let d0 = this.minX();
        let d1 = this.minY();
        let d2 = this.minZ();
        let d3 = this.maxX();
        let d4 = this.maxY();
        let d5 = this.maxZ();

        if (x < 0.0) {
            d0 -= x;
        } else if (x > 0.0) {
            d3 -= x;
        }

        if (y < 0.0) {
            d1 -= y;
        } else if (y > 0.0) {
            d4 -= y;
        }

        if (z < 0.0) {
            d2 -= z;
        } else if (z > 0.0) {
            d5 -= z;
        }

        return new Cuboid(d0, d1, d2, d3, d4, d5);
    }

    /**
     * Creates a new Cuboid that has been expanded by the given amount, with positive changes increasing
     * max values and negative changes decreasing min values.
     */
    public expand(x: number, y: number, z: number): Cuboid {
        let d0 = this.minX();
        let d1 = this.minY();
        let d2 = this.minZ();
        let d3 = this.maxX();
        let d4 = this.maxY();
        let d5 = this.maxZ();

        if (x < 0.0) {
            d0 += x;
        } else if (x > 0.0) {
            d3 += x;
        }

        if (y < 0.0) {
            d1 += y;
        } else if (y > 0.0) {
            d4 += y;
        }

        if (z < 0.0) {
            d2 += z;
        } else if (z > 0.0) {
            d5 += z;
        }

        return new Cuboid(d0, d1, d2, d3, d4, d5);
    }

    public intersect(other: Cuboid): Cuboid {
        const d0 = Math.max(this.minX(), other.minX());
        const d1 = Math.max(this.minY(), other.minY());
        const d2 = Math.max(this.minZ(), other.minZ());
        const d3 = Math.min(this.maxX(), other.maxX());
        const d4 = Math.min(this.maxY(), other.maxY());
        const d5 = Math.min(this.maxZ(), other.maxZ());
        return new Cuboid(d0, d1, d2, d3, d4, d5);
    }

    public union(other: Cuboid): Cuboid {
        const d0 = Math.min(this.minX(), other.minX());
        const d1 = Math.min(this.minY(), other.minY());
        const d2 = Math.min(this.minZ(), other.minZ());
        const d3 = Math.max(this.maxX(), other.maxX());
        const d4 = Math.max(this.maxY(), other.maxY());
        const d5 = Math.max(this.maxZ(), other.maxZ());
        return new Cuboid(d0, d1, d2, d3, d4, d5);
    }

    /**
     * Offsets the current bounding box by the specified amount.
     */
    public offset(x: number, y: number, z: number): Cuboid {
        return new Cuboid(
            this.minX() + x,
            this.minY() + y,
            this.minZ() + z,
            this.maxX() + x,
            this.maxY() + y,
            this.maxZ() + z
        );
    }

    /**
     * Offsets the current bounding box by the specified amount.
     */
    public offsetVector(vec: Vector): Cuboid {
        return this.offset(vec.x, vec.y, vec.z);
    }

    /**
     * Checks if the bounding box intersects with another.
     */
    public intersectsCuboid(other: Cuboid): boolean {
        return this.intersects(
            other.minX(),
            other.minY(),
            other.minZ(),
            other.maxX(),
            other.maxY(),
            other.maxZ()
        );
    }

    public intersects(
        x1: number,
        y1: number,
        z1: number,
        x2: number,
        y2: number,
        z2: number
    ): boolean {
        return (
            this.minX() < x2 &&
            this.maxX() > x1 &&
            this.minY() < y2 &&
            this.maxY() > y1 &&
            this.minZ() < z2 &&
            this.maxZ() > z1
        );
    }

    public intersectsVector(min: Vector, max: Vector): boolean {
        return this.intersects(
            Math.min(min.x, max.x),
            Math.min(min.y, max.y),
            Math.min(min.z, max.z),
            Math.max(min.x, max.x),
            Math.max(min.y, max.y),
            Math.max(min.z, max.z)
        );
    }

    /**
     * Returns if the supplied vector is compconstely inside the bounding box
     */
    public containsVector(v: Vector) {
        return this.contains(v.x, v.y, v.z);
    }

    public contains(x: number, y: number, z: number): boolean {
        return (
            x >= this.minX() &&
            x < this.maxX() &&
            y >= this.minY() &&
            y < this.maxY() &&
            z >= this.minZ() &&
            z < this.maxZ()
        );
    }

    /**
     * Returns the average length of the edges of the bounding box.
     */
    public getAverageEdgeLength(): number {
        const d0 = this.maxX() - this.minX();
        const d1 = this.maxY() - this.minY();
        const d2 = this.maxZ() - this.minZ();
        return (d0 + d1 + d2) / 3.0;
    }

    /**
     * '
     *
     * @return the vector containing the minimum point of this cuboid
     */
    public getMinPoint(): Vector {
        return this.minimumPoint;
    }

    /**
     * '
     *
     * @return the vector containing the maximum point of this cuboid
     */
    public getMaxPoint(): Vector {
        return this.maximumPoint;
    }

    public getXSize(): number {
        return this.maxX() - this.minX();
    }

    public getYSize(): number {
        return this.maxY() - this.minY();
    }

    public getZSize(): number {
        return this.maxZ() - this.minZ();
    }

    public toString(): string {
        return (
            "" +
            this.minX() +
            "," +
            this.minY() +
            "," +
            this.minZ() +
            ":" +
            this.maxX() +
            "," +
            this.maxY() +
            "," +
            this.maxZ() +
            ""
        );
    }

    getCenter(): Vector {
        return new Vector(
            this.minX() + (this.maxX() - this.minX()) * 0.5,
            this.minY() + (this.maxY() - this.minY()) * 0.5,
            this.minZ() + (this.maxZ() - this.minZ()) * 0.5
        );
    }
}
