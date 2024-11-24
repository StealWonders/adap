import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Base name must not be null or undefined"); // pre-condition
        IllegalArgumentException.assertIsNotNullOrUndefined(pn, "Parent node must not be null or undefined"); // pre-condition
        this.doSetBaseName(bn);
        this.parentNode = pn;
        MethodFailureException.assertCondition(this.getBaseName() === bn, "Initialization failed"); // post-condition
        MethodFailureException.assertCondition(this.parentNode === pn, "Initialization failed"); // post-condition
    }

    public move(to: Directory): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(to, "Target directory must not be null or undefined"); // pre-condition
        this.parentNode.remove(this);
        to.add(this);
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Base name must not be null or undefined"); // pre-condition
        this.doSetBaseName(bn);
        MethodFailureException.assertCondition(this.getBaseName() === bn, "Rename failed"); // post-condition
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Node {
        return this.parentNode;
    }

}
