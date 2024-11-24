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

    public open(): void {
        InvalidStateException.assertCondition(this.doGetFileState() === FileState.CLOSED, "File is already open");
        // do something
    }

    public close(): void {
        InvalidStateException.assertCondition(this.doGetFileState() === FileState.OPEN, "File is already closed");
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}