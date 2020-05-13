import { Vector } from "./vector";

export const clamp = (x: number, min: number, max: number) =>
    x < min ? min : x > max ? max : x;

export const sign = (n: number) => (n > 0 ? 1 : n < 0 ? -1 : 0);

export const avg = (...nums: number[]) =>
    nums.reduce((acc, val) => acc + val, 0) / nums.length;

export const euclideanMod = (numerator: number, denominator: number) => {
    const result = numerator % denominator;
    return result < 0 ? result + denominator : result;
};

export const dist = (loc1: Vector, loc2: Vector) =>
    Math.sqrt(
        (loc1.x - loc2.x) ** 2 + (loc1.y - loc2.y) ** 2 + (loc1.z - loc2.z) ** 2
    );
