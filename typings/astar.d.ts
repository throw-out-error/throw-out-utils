declare function astar(): AStarResult;
declare class AStarResult {
  status: string;
  cost: number;
  path: Array<any>;
}