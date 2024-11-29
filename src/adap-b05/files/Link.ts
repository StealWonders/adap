import { Node } from "./Node";
import { Directory } from "./Directory";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        // no pre-condition required
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        // no pre-condition required
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode); // todo: is this the pre-condition????
        return target.getBaseName();
    }

    public rename(bn: string): void {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn !== null && bn != undefined, "Base name must not be null or undefined");
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, target !== null, "Target node must not be null"); // todo: check if this is correct!!!!!
        const result: Node = this.targetNode as Node;
        return result;
    }
}