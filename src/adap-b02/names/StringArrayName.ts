import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if (other.length == 0) throw new Error("Name must have at least one component");
        if (delimiter !== undefined) this.delimiter = delimiter;
        this.components = other;
    }

    // return a human-readable representation of the Name. If a component contains an escaped delimiter unescape it
    public asString(delimiter: string = this.delimiter): string {
        return this.components.map((component) => component
            .replaceAll(this.getUnescaptedDelimiterRegex(), delimiter)
            .replaceAll(ESCAPE_CHARACTER, ""))
            .join(delimiter);
    }

    // join the components with the default delimiter so that the Name can be parsed back in from the string
    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
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
        this.checkBounds(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.checkBounds(i);
        this.checkForUnescapedDelimiter(c);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.checkBounds(i);
        this.checkForUnescapedDelimiter(c);
        this.components.splice(i, 0, c); // insert the component at the i-th position and push the rest back
    }

    public append(c: string): void {
        this.checkForUnescapedDelimiter(c);
        this.components.push(c); // append the component at the end
    }

    public remove(i: number): void {
        this.checkBounds(i);
        this.components.splice(i, 1); // remove the i-th component
    }

    public concat(other: Name): void {
        if (this.delimiter !== other.getDelimiterCharacter()) throw new Error("delimiters do not match");
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

    private checkBounds(i: number): void {
        if (i < 0 || i >= this.components.length) throw new Error("index out of bounds");
    }

    private checkForUnescapedDelimiter(c: string): void {
        if (c.includes(this.delimiter)) throw new Error("String contains unescaped delimiter characters");
    }

    private getUnescaptedDelimiterRegex(delimiter: string = this.delimiter): RegExp {
        return new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`, 'g');
    }

}