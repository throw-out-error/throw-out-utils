function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];

    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift() || 0);
        } else {
            result.push(right.shift() || 0);
        }
    }

    while (left.length) result.push(left.shift() || 0);

    while (right.length) result.push(right.shift() || 0);

    return result;
}

export function mergeSort(arr: number[]): number[] {
    if (arr.length < 2) return arr;

    const middle = arr.length / 2;
    const left = arr.slice(0, middle);
    const right = arr.slice(middle, arr.length);

    return merge(mergeSort(left), mergeSort(right));
}
