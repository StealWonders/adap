import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";

import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.ROOT_NODE != null, "Root node must not be null");
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
        this.assertClassInvariants();
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        this.assertClassInvariants();
        return new StringName("", '/'); // no pre-condition required
    }

    public move(to: Directory): void {
        this.assertClassInvariants();
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, false, "Root node cannot be moved");
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        // null operation
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn == ""); // Root must have "" as base name
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
    }

}