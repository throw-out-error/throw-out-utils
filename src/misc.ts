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
 * @param a The array or string to split up into chunks.
 */
export const chunk = (a: any[] | string, b: number): any[] =>
    Array.from({ length: Math.ceil(a.length / b) }, (_, r) =>
        a.slice(r * b, r * b + b)
    );

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
