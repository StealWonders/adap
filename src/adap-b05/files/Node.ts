import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
        this.assertClassInvariants();
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.add(this);
    }

    public move(to: Directory): void {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, to != null, "Target directory must not be null");
        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;
        this.assertClassInvariants();
    }

    public getFullName(): Name {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.parentNode != null, "Parent node must not be null");
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.baseName != null, "Base name must not be null");
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn !== null && bn != undefined, "Base name must not be null or undefined");
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        this.doSetBaseName(bn);
        this.assertClassInvariants();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.parentNode != null, "Parent node must not be null");
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn !== null && bn != undefined, "Base name must not be null or undefined");
        const nodesFound: Set<Node> = new Set<Node>();
        if (this.getBaseName() === bn) {
            nodesFound.add(this);
        }
        return nodesFound;
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn != "");
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
    }

}