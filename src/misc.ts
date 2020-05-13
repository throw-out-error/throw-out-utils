/**
 * @description Capitalize the first letter of each word
 */
export const capWords = (str: string) =>
    str.replace(/\b[a-z]/g, (char) => char.toUpperCase());

/**
 *
 * @description decodes base64 string
 */
export const atob = (str: string) =>
    Buffer.from(str, "base64").toString("binary");

export const cap = ([first, ...rest], lowerRest = false) =>
    first.toUpperCase() +
    (lowerRest ? rest.join("").toLowerCase() : rest.join(""));

/**
 * @description Chunks an array into smaller arrays of a specified size.
 */
export const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );

export const dayOfYear = (date: Date) =>
    Math.floor(
        (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
            1000 /
            60 /
            60 /
            24
    );
