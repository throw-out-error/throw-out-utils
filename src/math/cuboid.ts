import { Vector } from "./vector";

export class Cuboid {
    public static EMPTY: Cuboid = new Cuboid(0, 0, 0, 0, 0, 0);
    public static FULL_CUBE: Cuboid = new Cuboid(0, 0, 0, 1, 1, 1);

    protected minimumPoint: Vector;
    protected maximumPoint: Vector;

    public constructor(
        x1: number,
        y1: number,
        z1: number,
        x2: number,
        y2: number,
        z2: number
    ) {
        this.minimumPoint = Vector.from(x1, y1, z1);
        this.maximumPoint = Vector.from(x2, y2, z2);
    }

    public static fromVector(v: Vector): Cuboid {
        return this.fromVectors(v, v);
    }

    /**
     *
     * @param p1 The minimum point
     * @param p2 The maximum point
     */
    public static fromVectors(p1: Vector, p2: Vector): Cuboid {
        return new Cuboid(p1.x(), p1.y(), p1.z(), p2.x(), p2.y(), p2.z());
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
        return this.minimumPoint.x();
    }

    public minY(): number {
        return this.minimumPoint.y();
    }

    public minZ(): number {
        return this.minimumPoint.z();
    }

    public maxX(): number {
        return this.maximumPoint.x();
    }

    public maxY(): number {
        return this.maximumPoint.y();
    }

    public maxZ(): number {
        return this.maximumPoint.z();
    }

    public clone(): Cuboid {
        return Cuboid.fromVectors(this.minimumPoint, this.maximumPoint);
    }

    /**
     * Returns an array of all possible points in a cuboid.
     */
    public all(): Vector[] {
        const arr: Vector[] = [];

        for (let i = this.minX(); i < this.maxX(); i++) {
            for (let j = this.minY(); j < this.maxY(); j++) {
                for (let k = this.minZ(); k < this.maxZ(); k++) {
                    arr.push(Vector.from(i, j, k));
                }
            }
        }

        return arr;
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
    public offset(n = 1, x: number, y: number, z: number): Cuboid {
        return new Cuboid(
            this.minX() + x * n,
            this.minY() + y * n,
            this.minZ() + z * n,
            this.maxX() + x * n,
            this.maxY() + y * n,
            this.maxZ() + z * n
        );
    }

    /**
     * Offsets the current bounding box by the specified amount.
     */
    public offsetVector(n = 1, vec: Vector): Cuboid {
        return this.offset(n, vec.x(), vec.y(), vec.z());
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
            min.x(),
            max.x(),
            min.y(),
            max.y(),
            min.z(),
            max.z()
        );
    }

    /**
     * Returns if the supplied vector is compconstely inside the bounding box
     */
    public containsVector(v: Vector): boolean {
        return this.contains(v.x(), v.y(), v.z());
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

    static fromString(s: string): Cuboid {
        try {
            const minMax = s.split(":");
            const minArr = minMax[0].split(",");
            const maxArr = minMax[1].split(",");

            const min = Vector.from(
                parseFloat(minArr[0]),
                parseFloat(minArr[1]),
                parseFloat(minArr[2])
            );
            const max = Vector.from(
                parseFloat(maxArr[0]),
                parseFloat(maxArr[1]),
                parseFloat(maxArr[2])
            );
            return this.fromVectors(min, max);
        } catch (err) {
            console.error(`Parsing error: ${err}`);
            return this.EMPTY;
        }
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
        return Vector.from(
            this.minX() + (this.maxX() - this.minX()) * 0.5,
            this.minY() + (this.maxY() - this.minY()) * 0.5,
            this.minZ() + (this.maxZ() - this.minZ()) * 0.5
        );
    }
}