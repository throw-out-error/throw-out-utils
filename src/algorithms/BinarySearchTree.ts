export interface BstNodeInterface {
    value: number;
    left: BstNodeInterface | null;
    right: BstNodeInterface | null;
}

export class BstNode implements BstNodeInterface {
    constructor(value: number) {
        this.left = null;
        this.right = null;
        this.value = value;
    }

    value: number;
    left: BstNodeInterface | null;
    right: BstNodeInterface | null;
}

export class BinarySearchTree {
    root: BstNode | null;

    constructor() {
        this.root = null;
    }

    insert(value: number) {
        const newNode = new BstNode(value);
        // If root empty, set new node as the root
        if (!this.root) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(root: BstNode, newNode: BstNode) {
        if (newNode.value < root.value) {
            // If no left child, then just insesrt to the left
            if (root.left === null) {
                root.left = newNode;
                return;
            } else {
                this.insertNode(root.left, newNode);
            }
        } else {
            // If no right child, then just insesrt to the right
            if (root.right === null) {
                root.right = newNode;
                return;
            } else {
                this.insertNode(root.right, newNode);
            }
        }
    }

    search(value: number): boolean | string {
        if (!this.root) {
            return "Tree is empty";
        } else {
            return this.searchNode(this.root, value);
        }
    }

    searchNode(root: BstNode, value: number): boolean {
        if (!root) {
            return false;
        }

        if (value < root.value) {
            if (root.left === null) {
                return false;
            }
            return this.searchNode(root.left, value);
        } else if (value > root.value) {
            if (root.right === null) {
                return false;
            }
            return this.searchNode(root.right, value);
        }

        // value === root.value
        return true;
    }

    remove(value: number): void {
        if (!this.root) {
            return;
        } else {
            this.removeNode(this.root, value);
        }
    }

    removeNode(root: BstNode, value: number): null | BstNode {
        // If value is less than root value, go to the left subtree
        if (value < root.value && root.left !== null) {
            root.left = this.removeNode(root.left, value);
            return root;
            // If value is greater than root value, go to the right subtree
        } else if (value > root.value && root.right !== null) {
            root.right = this.removeNode(root.right, value);
            return root;
            // If we found the value, remove the node
        } else {
            // If no child nodes, just remove the node
            if (!root.left && !root.right) {
                return null;
            }
            // If one child (left)
            if (root.left) {
                root = root.left;
                return root;
                // If one child (right)
            } else if (root.right) {
                root = root.right;
                return root;
            }
            // If two child nodes (both)
            // Get the minimum of the right subtree to ensure we have valid replacement
            const minRight = this.findMinNode(root.right!);
            root.value = minRight.value;
            // Make sure we remove the node that we replaced the deleted node
            root.right = this.removeNode(root.right!, minRight.value);
            return root;
        }
    }

    findMinNode(root: BstNode): BstNode {
        if (!root.left) {
            return root;
        } else {
            return this.findMinNode(root.left);
        }
    }
}
