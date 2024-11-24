import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        IllegalArgumentException.assertCondition(bn !== null && bn !== undefined && bn !== "", "Base name must not be null, undefined, or empty"); // pre-condition
        IllegalArgumentException.assertIsNotNullOrUndefined(pn, "Parent node must not be null or undefined"); // pre-condition
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn; // ????? what is this?
        }
        MethodFailureException.assertCondition(this.getBaseName() === bn, "Initialization failed"); // post-condition
        MethodFailureException.assertCondition(this.getParentNode() === pn, "Initialization failed"); // post-condition
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        // todo: pre-cond
        this.targetNode = target;
        // todo: post-cond
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Base name must not be null or undefined"); // pre-condition
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
        MethodFailureException.assertCondition(target.getBaseName() === bn, "Rename failed"); // post-condition
    }

    protected ensureTargetNode(target: Node | null): Node {
        // todo: pre-cond
        const result: Node = this.targetNode as Node;
        return result;
        // todo: post-cond
    }
}