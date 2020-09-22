import assert from "assert";
import { PriorityQueue } from ".";

function reconstructPath(node): any[] {
    if (node.parent !== undefined) {
        const pathSoFar = reconstructPath(node.parent);
        pathSoFar.push(node.data);
        return pathSoFar;
    } else {
        // this is the starting node
        return [node.data];
    }
}

function defaultHash(node): string {
    return node.toString();
}

function heapComparator(a, b): number {
    return a.f - b.f;
}

export class PathfindingResult {
    public status: string;
    public cost: number;
    public path: any[];

    constructor(status: string, cost: number, path: any[]) {
        this.status = status;
        this.cost = cost;
        this.path = path;
    }
}

/**
 * Credit goes to https://github.com/andrewrk/node-astar
 */
export const aStar = (params: any): PathfindingResult => {
    assert.ok(params.start !== undefined);
    assert.ok(params.isEnd !== undefined);
    assert.ok(params.neighbor);
    assert.ok(params.distance);
    assert.ok(params.heuristic);
    if (params.timeout === undefined) params.timeout = Infinity;
    assert.ok(!isNaN(params.timeout));
    const hash = params.hash || defaultHash;

    const startNode = {
        data: params.start,
        g: 0,
        f: 0,
        h: params.heuristic(params.start),
    };
    let bestNode = startNode;
    startNode.f = startNode.h;
    // leave .parent undefined
    const closedDataSet = new Set();
    const openHeap = new PriorityQueue({ comparator: heapComparator });
    const openDataMap = new Map();
    openHeap.enqueue(startNode);
    openDataMap.set(hash(startNode.data), startNode);
    const startTime = new Date();
    while (openHeap.size) {
        if (new Date().getTime() - startTime.getTime() > params.timeout) {
            return {
                status: "timeout",
                cost: bestNode.g,
                path: reconstructPath(bestNode),
            };
        }
        const node = openHeap.peek();
        openDataMap.delete(hash(node.data));
        if (params.isEnd(node.data)) {
            // done
            return {
                status: "success",
                cost: node.g,
                path: reconstructPath(node),
            };
        }
        // not done yet
        closedDataSet.add(hash(node.data));
        const neighbors = params.neighbor(node.data);
        for (let i = 0; i < neighbors.length; i++) {
            const neighborData = neighbors[i];
            if (closedDataSet.has(hash(neighborData))) {
                // skip closed neighbors
                continue;
            }
            const gFromThisNode =
                node.g + params.distance(node.data, neighborData);
            let neighborNode = openDataMap.get(hash(neighborData));
            let update = false;
            if (neighborNode === undefined) {
                // add neighbor to the open set
                neighborNode = {
                    data: neighborData,
                };
                // other properties will be set later
                openDataMap.set(hash(neighborData), neighborNode);
            } else {
                if (neighborNode.g < gFromThisNode) {
                    // skip this one because another route is faster
                    continue;
                }
                update = true;
            }
            // found a new or better route.
            // update this neighbor with this node as its new parent
            neighborNode.parent = node;
            neighborNode.g = gFromThisNode;
            neighborNode.h = params.heuristic(neighborData);
            neighborNode.f = gFromThisNode + neighborNode.h;
            if (neighborNode.h < bestNode.h) bestNode = neighborNode;
            if (update) {
                // openHeap.heapify()
            } else {
                openHeap.enqueue(neighborNode);
            }
        }
    }
    // all the neighbors of every accessible node have been exhausted
    return {
        status: "noPath",
        cost: bestNode.g,
        path: reconstructPath(bestNode),
    };
};
