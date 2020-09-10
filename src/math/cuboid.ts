import { Tensor, Vector } from "./tensor";
import { Direction } from "../direction";

export class Cuboid {
    public static EMPTY: Cuboid = new Cuboid(0, 0, 0, 0, 0, 0);
    public static FULL_CUBE: Cuboid = new Cuboid(0, 0, 0, 1, 1, 1);

    protected minimumPoint: Tensor<Vector>;
    protected maximumPoint: Tensor<Vector>;

    public constructor(
        x1: number,
        y1: number,
        z1: number,
        x2: number,
        y2: number,
        z2: number
    ) {
        this.minimumPoint = Tensor.from<Vector>(x1, y1, z1);
        this.maximumPoint = Tensor.from<Vector>(x2, y2, z2);
    }

    public static fromVector(v: Tensor): Cuboid {
        return this.fromVectors(v, v);
    }

    /**
     *
     * @param p1 The minimum point
     * @param p2 The maximum point
     */
    public static fromVectors(p1: Tensor, p2: Tensor): Cuboid {
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
        return this.maximumPoint.x;
    }

    public maxY(): number {
        return this.maximumPoint.y;
    }

    public maxZ(): number {
        return this.maximumPoint.z;
    }

    public clone(): Cuboid {
        return Cuboid.fromVectors(this.minimumPoint, this.maximumPoint);
    }

    /**
     * Returns an array of all possible points in a cuboid.
     */
    public all(): Tensor[] {
        const arr: Tensor[] = [];

        for (let i = this.minX(); i < this.maxX(); i++) {
            for (let j = this.minY(); j < this.maxY(); j++) {
                for (let k = this.minZ(); k < this.maxZ(); k++) {
                    arr.push(Tensor.from(i, j, k));
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
    public offsetTensor(n = 1, vec: Tensor): Cuboid {
        return this.offset(n, vec.x, vec.y, vec.z);
    }

    /**
     * Offsets the current bounding box by the specified amount in a specified direction.
     */
    public offsetDir(n = 1, dir: Direction): Cuboid {
        let dirVec = Tensor.VECTOR_ZERO.clone();
        switch (dir) {
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

        // TODO: implement Cuboid#add method and sub method
        this.minimumPoint.add(dirVec);
        this.maximumPoint.add(dirVec);
        return this;
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

    public intersectsTensor(min: Tensor, max: Tensor): boolean {
        return this.intersects(min.x, max.x, min.y, max.y, min.z, max.z);
    }

    /**
     * Returns if the supplied vector is compconstely inside the bounding box
     */
    public containsTensor(v: Tensor): boolean {
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
    public getMinPoint(): Tensor {
        return this.minimumPoint;
    }

    /**
     * '
     *
     * @return the vector containing the maximum point of this cuboid
     */
    public getMaxPoint(): Tensor {
        return this.maximumPoint;
    }

    public getSize(): Tensor<Vector> {
        return Tensor.from<Vector>(
            this.maxX() - this.minX(),
            this.maxY() - this.minY(),
            this.maxZ() - this.minZ()
        );
    }

    static fromString(s: string): Cuboid {
        try {
            const minMax = s.split(":");
            const minArr = minMax[0].split(",");
            const maxArr = minMax[1].split(",");

            const min = Tensor.from(
                parseFloat(minArr[0]),
                parseFloat(minArr[1]),
                parseFloat(minArr[2])
            );
            const max = Tensor.from(
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
            this.minimumPoint.toString() + ":" + this.maximumPoint.toString()
        );
    }

    getCenter(): Tensor {
        return Tensor.from(
            this.minX() + (this.maxX() - this.minX()) * 0.5,
            this.minY() + (this.maxY() - this.minY()) * 0.5,
            this.minZ() + (this.maxZ() - this.minZ()) * 0.5
        );
    }
}
