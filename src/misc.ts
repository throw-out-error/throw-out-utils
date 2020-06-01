import { asTree } from "treeify";

/**
 * @description Capitalize the first letter of each word
 */
export const capWords = (str: string): string =>
    str.replace(/\b[a-z]/g, (char) => char.toUpperCase());

/**
 *
 * @description decodes base64 string
 */
export const atob = (str: string): string =>
    Buffer.from(str, "base64").toString("binary");

export const cap = ([first, ...rest], lowerRest = false): string =>
    first.toUpperCase() +
    (lowerRest ? rest.join("").toLowerCase() : rest.join(""));

/**
 * @description Chunks an array into smaller arrays of a specified size.
 */
export const chunk = (xs: any[], n: number): any[] =>
    xs.reduce((o, x, i) => {
        o[Math.floor(i / n)].push(x);
        return o;
    }, Array(Math.ceil(xs.length / n)).fill([]));

export const dayOfYear = (date: Date): number =>
    Math.floor(
        (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
            1000 /
            60 /
            60 /
            24
    );

export const treeify = (
    data: any,
    showValues = true,
    hideFunctions = true
): string => {
    return asTree(JSON.parse(JSON.stringify(data)), showValues, hideFunctions);
};
