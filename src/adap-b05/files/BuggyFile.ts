import { File } from "./File";
import { Directory } from "./Directory";

export class BuggyFile extends File {

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
        this.assertClassInvariants();
    }

    /**
     * Fault injection for homework
     * @returns base name, here always ""
     */
    protected doGetBaseName(): string {
        this.assertClassInvariants();
        this.baseName = "";
        return super.doGetBaseName();
    }

}