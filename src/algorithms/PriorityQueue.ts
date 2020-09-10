export type Comparator<T> = (a: T, b: T) => number;

export interface Options<T> {
    comparator?: Comparator<T>;
    initialValues?: T[];
}

export class PriorityQueue<T> implements Iterable<T> {
    private _length = 0;
    private DEFAULT_COMPARATOR(a, b) {
        return a - b;
    }

    /**
     * @returns the number of elements in this queue.
     */
    public get size(): number {
        return this._length;
    }

    /**
     * @returns true if this queue is empty; false otherwise
     */
    public isEmpty(): boolean {
        return this._length == 0;
    }

    private comparator: Comparator<T>;
    private data: T[];

    constructor(options?: Options<T>) {
        if (!options) options = {};
        this.comparator = options.comparator || this.DEFAULT_COMPARATOR;
        this._length = options.initialValues ? options.initialValues.length : 0;
        this.data = options.initialValues ? options.initialValues.slice(0) : [];
        this._heapify();
    }

    private _heapify(): void {
        if (this.data.length > 0) {
            for (let i = 0; i < this.data.length; i++) {
                this._bubbleUp(i);
            }
        }
    }

    /**
     * Adds the element to this queue.
     * @returns queue with the added element.
     */
    public enqueue(value: T): T[] {
        this.data.push(value);
        this._bubbleUp(this.data.length - 1);
        return this.data;
    }

    /**
     * Removes and returns the element on this queue that was least recently added.
     * @returns the element on this queue that was least recently added.
     */

    public dequeue(): T {
        const ret = this.data[0];
        const last = this.data.pop();
        if (this.data.length > 0 && last !== undefined) {
            this.data[0] = last;
            this._bubbleDown(0);
        }
        return ret;
    }

    /**
     * @returns the element least recently added to this queue.
     */
    public peek(): T {
        return this.data[0];
    }

    public clear(): void {
        this.data.length = 0;
    }

    public _bubbleUp(pos: number): void {
        while (pos > 0) {
            const parent = (pos - 1) >>> 1;
            if (this.comparator(this.data[pos], this.data[parent]) < 0) {
                const x = this.data[parent];
                this.data[parent] = this.data[pos];
                this.data[pos] = x;
                pos = parent;
            } else {
                break;
            }
        }
    }

    public _bubbleDown(pos: number): void {
        const last = this.data.length - 1;
        while (true) {
            const left = (pos << 1) + 1;
            const right = left + 1;
            let minIndex = pos;
            if (
                left <= last &&
                this.comparator(this.data[left], this.data[minIndex]) < 0
            ) {
                minIndex = left;
            }
            if (
                right <= last &&
                this.comparator(this.data[right], this.data[minIndex]) < 0
            ) {
                minIndex = right;
            }
            if (minIndex !== pos) {
                const x = this.data[minIndex];
                this.data[minIndex] = this.data[pos];
                this.data[pos] = x;
                pos = minIndex;
            } else {
                break;
            }
        }
        return void 0;
    }
    [Symbol.iterator](): Iterator<T, T, any> {
        let iterationCount = 0;
        let it = this.data[0];
        return {
            next: (): any => {
                let result: { done: boolean; value: T };
                if (iterationCount < this.data.length) {
                    result = { value: it, done: false };
                    iterationCount++;
                    it = this.data[iterationCount];
                    return result;
                }
                return { value: iterationCount, done: true };
            },
        };
    }
}
