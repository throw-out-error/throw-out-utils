import { Vector } from "./vector";
export * from './easing'
export * from "./vector";
export * from "./cuboid";
export * from './matrix'

export const clamp = (x: number, min: number, max: number): number =>
    x < min ? min : x > max ? max : x;

export const sign = (n: number): number => (n > 0 ? 1 : n < 0 ? -1 : 0);

export const avg = (...nums: number[]): number =>
    nums.reduce((acc, val) => acc + val, 0) / nums.length;

export const euclideanMod = (
    numerator: number,
    denominator: number
): number => {
    const result = numerator % denominator;
    return result < 0 ? result + denominator : result;
};

export const dist = (loc1: Vector, loc2: Vector): number =>
    loc1.x() - loc2.x() + (loc1.y() - loc2.y()) + (loc1.z() - loc2.z());
