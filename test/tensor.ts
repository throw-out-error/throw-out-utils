import { assert } from "chai";
import { Tensor, Direction } from "../src";
import "mocha";

describe("Tensor", () => {
    const tensor1 = Tensor.VECTOR_ZERO.clone();
    it("tensor 1 should equal 0, 0, 0", () => {
        assert(tensor1.toString() === "0,0,0");
    });

    const tensor2 = tensor1.clone().offsetDir(3, Direction.DOWN);
    it("tensor 2 should be offsetted to 0, -3, 0", () => {
        assert(tensor2.toString() === "0,-3,0");
    });

    it("tensor 1 should NOT be equal to tensor 2", () => {
        assert(!tensor1.equals(tensor2));
    });
});
