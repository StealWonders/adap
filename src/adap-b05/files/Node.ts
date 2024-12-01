import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";
import { ServiceFailureException } from "../common/ServiceFailureException";

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
        
        const result: Set<Node> = new Set<Node>();
        try {
            if (this.getBaseName() === bn) result.add(this); // node searched for is the this node

            // search for files in directory recursively
            if (this instanceof Directory) {
                const dir: Directory = this as Directory;
                dir.getChildren().forEach((child: Node) => {
                    const childResult: Set<Node> = child.findNodes(bn);
                    childResult.forEach((node: Node) => {
                        result.add(node);
                    });
                });
            }
        } catch (e: any) {
            throw new ServiceFailureException("Failed to find nodes", e);
        }

        return result;
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