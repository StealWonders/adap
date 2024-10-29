import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if (delimiter !== undefined) this.delimiter = delimiter;
        this.components = other;
    }

    public asString(delimiter: string = this.delimiter): string {
        let name: string = "";
        for (let i = 0; i < this.components.length; i++) {
            if (i != 0) {
                name += delimiter; // append the delimiter before the next component (not before the first)
            }
            name += this.components[i].replaceAll(delimiter, ESCAPE_CHARACTER + delimiter); // always append the next component
            // if a component contains the delimiter, escape it with the escape character before appending it
        }
        return name;
    }

    public asDataString(): string {
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c); // insert the component at the i-th position and push the rest back
    }

    public append(c: string): void {
        this.components.push(c); // append the component at the end
    }

    public remove(i: number): void {
        this.components.splice(i, 1); // remove the i-th component
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

}