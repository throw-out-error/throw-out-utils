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
    data: unknown,
    showValues = true,
    hideFunctions = true
): string => {
    return asTree(JSON.parse(JSON.stringify(data)), showValues, hideFunctions);
};

/**
 * Promisify the original function.
 * @param {original} original - Function that gets promisified.
 * @param {?Object} self - Object that gets applied as this-object when the original function is called.
 * @returns {wrapper}
 */
export function promisify(original, self: unknown = null) {
    if (typeof original !== "function") {
        throw new TypeError("original must be a function");
    }

    /**
     * Wrapped original function.
     * @typedef {function} wrapper
     * @param {...*} args - Arguments to apply to the original function.
     * @returns {Promise.<*>} - Promise that gets resolved when the original function calls the callback.
     */
    function wrapper(...args) {
        const thisArg = self;

        if (typeof args[args.length - 1] === "function") {
            // called with callback
            return original.call(thisArg, ...args);
        }

        // promisified
        return new Promise((resolve, reject) => {
            /**
             * Callback for the original function.
             * @typedef {function} cb
             * @param {?Error} error - Error if one occured.
             * @param {*} result - Result of the original function.
             */
            function cb(error, result) {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }

            args.push(cb);

            original.call(thisArg, ...args);
        });
    }

    return wrapper;
}
