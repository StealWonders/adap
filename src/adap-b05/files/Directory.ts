import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
        this.assertClassInvariants();
    }

    public add(cn: Node): void {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, !this.childNodes.has(cn), "Directory already contains node");
        this.childNodes.add(cn);
        this.assertClassInvariants();
    }

    public remove(cn: Node): void {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.childNodes.has(cn), "Directory does not contain node");
        this.childNodes.delete(cn); // Yikes! Should have been called remove
        this.assertClassInvariants();
    }

    public getChildren(): Set<Node> {
        this.assertClassInvariants();
        return this.childNodes;
    }

}