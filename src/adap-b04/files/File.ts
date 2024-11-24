import { Node } from "./Node";
import { Directory } from "./Directory";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        IllegalArgumentException.assertCondition(baseName !== null && baseName !== undefined && baseName !== "", "Base name must not be null, undefined, or empty"); // pre-condition
        super(baseName, parent);
        
    }

    // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=387861&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilRepositoryGUI
    // -> IllegalArgumentException and not IllegalStateException
    public open(): void {
        IllegalArgumentException.assertCondition(this.doGetFileState() === FileState.CLOSED, "File is already open");
        // do something
    }

    // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=387861&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilRepositoryGUI
    // -> IllegalArgumentException and not IllegalStateException
    public close(): void {
        IllegalArgumentException.assertCondition(this.doGetFileState() === FileState.OPEN, "File is already closed");
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}