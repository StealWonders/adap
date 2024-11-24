import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=387861&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilRepositoryGUI
    // -> IllegalArgumentException and not IllegalStateException
    public move(to: Directory): void {
        IllegalArgumentException.assertCondition(false, "root node cannot be moved");
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Base name must not be null or undefined");
        // null operation
    }

}