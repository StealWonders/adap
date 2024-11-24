import { MethodFailedException } from "../../adap-b05/common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set();

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Base name must not be null or undefined"); // pre-condition
        IllegalArgumentException.assertIsNotNullOrUndefined(pn, "Parent node must not be null or undefined"); // pre-condition
        super(bn, pn);
    }

    public add(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn, "Child node must not be null or undefined"); // pre-condition
        this.childNodes.add(cn);
        MethodFailedException.assertCondition(this.childNodes.has(cn), "Add failed"); // post-condition
    }

    public remove(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn, "Child node must not be null or undefined"); // pre-condition
        this.childNodes.delete(cn); // Yikes! Should have been called remove
        MethodFailedException.assertCondition(!this.childNodes.has(cn), "Remove failed"); // post-condition
    }

}