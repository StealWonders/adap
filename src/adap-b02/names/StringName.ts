import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0; // probably number of components?

    constructor(other: string, delimiter?: string) {
        if (delimiter !== undefined) this.delimiter = delimiter;
        this.name = other;
        this.noComponents = other.split(this.delimiter).length;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name; // todo!!!
    }

    public asDataString(): string {
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        if (x < 0 || x >= this.length) throw new Error("index out of bounds");
        return this.name.split(this.delimiter)[x]; // todo!!!
    }

    public setComponent(n: number, c: string): void {
        if (n < 0 || n >= this.noComponents) throw new Error("index out of bounds");
        // todo!!!
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n >= this.noComponents) throw new Error("index out of bounds");
        // todo!!!
    }

    public append(c: string): void {
        throw new Error("needs implementation");
    }

    public remove(n: number): void {
        throw new Error("needs implementation");
    }

    public concat(other: Name): void {
        throw new Error("needs implementation");
    }

}