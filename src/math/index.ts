import { Tensor } from './tensor';

export * from './easing'
export * from "./tensor";
export * from "./cuboid";

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

export const dist = (loc1: Tensor, loc2: Tensor): number =>
    loc1.x() - loc2.x() + (loc1.y() - loc2.y()) + (loc1.z() - loc2.z());
