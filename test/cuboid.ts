import { assert } from "chai";
import { Tensor, Direction, Cuboid } from "../src";
import "mocha";

describe("Cuboid", () => {
    const cuboid1 = new Cuboid(0, 0, 0, 2, 2, 2);
    it("cuboid 1 should have a minimum of 0 and maximum of 2", () => {
        assert(cuboid1.toString() === "0,0,0:2,2,2");
    });

    const cuboid2 = cuboid1.clone().offsetDir(2, Direction.DOWN);
    it("tensor 2 should be offsetted 2 units downward.", () => {
        assert(cuboid2.toString() === "0,-2,0:2,0,2");
    });

    it("tensor 1 should NOT be equal to tensor 2", () => {
        assert(!cuboid1.equals(cuboid2));
    });
});
