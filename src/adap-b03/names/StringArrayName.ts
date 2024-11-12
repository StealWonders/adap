import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if (other.length == 0) throw new Error("Name must have at least one component");
        if (delimiter !== undefined) super(delimiter);
        else super();
        this.components = other;
    }

    getNoComponents(): number {
        return this.components.length
    }

    getComponent(i: number): string {
        this.checkBounds(i);
        return this.components[i];
    }

    setComponent(i: number, c: string) {
        this.checkBounds(i);
        this.checkForUnescapedDelimiter(c);
        this.components[i] = c;
    }

    insert(i: number, c: string) {
        this.checkBounds(i);
        this.checkForUnescapedDelimiter(c);
        this.components.splice(i, 0, c); // insert the component at the i-th position and push the rest back
    }

    append(c: string) {
        this.checkForUnescapedDelimiter(c);
        this.components.push(c); // append the component at the end
    }

    remove(i: number) {
        this.checkBounds(i);
        this.components.splice(i, 1); // remove the i-th component
    }

}