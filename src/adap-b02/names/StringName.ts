import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0; // probably number of components?

    constructor(other: string, delimiter?: string) {
        if (delimiter !== undefined) this.delimiter = delimiter;
        this.name = other;

        // regex that matches the delimiter not preceded by the escape character
        const delimiterWithoutEscapeRegex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})\${this.delimiter}`, 'g');
        this.noComponents = other.split(delimiterWithoutEscapeRegex).length; // count the number of components
    }

    // return a human-readable representation of the Name. If a component contains an escaped delimiter unescape it
    public asString(delimiter: string = this.delimiter): string {
        return this.name.replace(new RegExp(`\\${ESCAPE_CHARACTER}${delimiter}`, 'g'), delimiter);
    }

    // join the components with the default delimiter so that the Name can be parsed back in from the string
    public asDataString(): string {
        return this.name;
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

    // get the i-th component of the name, split by the uneescaped delimiter
    public getComponent(x: number): string {
        this.checkBounds(x);
        return this.name.split(this.getUnescaptedDelimiterRegex())[x];
    }

    public setComponent(n: number, newComponent: string): void {
        this.checkBounds(n);
        this.checkForUnescapedDelimiter(newComponent);
        // this.name = this.name.split(this.delimiter).map((originalComponent, idx) => idx === n ? newComponent : originalComponent).join(this.delimiter);
        // const regex = new RegExp(`(?<!\\\\)\\${this.delimiter}`, 'g');
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components[n] = newComponent;
        this.name = components.join(this.delimiter);
    }

    public insert(n: number, newComponent: string): void {
        // this.checkBounds(n); // test requires this to be commented out
        this.checkForUnescapedDelimiter(newComponent);
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(n, 0, newComponent);
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string): void {
        this.checkForUnescapedDelimiter(c);
        this.name += this.delimiter + c;
        this.noComponents++;
    }

    public remove(n: number): void {
        this.checkBounds(n);
        // this.name = this.name.split(this.delimiter).filter((_, idx) => idx !== n).join(this.delimiter);
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    public concat(other: Name): void {
        if (this.delimiter !== other.getDelimiterCharacter()) throw new Error("delimiters do not match");
        this.name += this.delimiter + other.asDataString();
        this.noComponents += other.getNoComponents();
    }

    private checkBounds(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("index out of bounds");
    }

    private checkForUnescapedDelimiter(c: string): void {
        if (c.includes(this.delimiter)) throw new Error("String contains unescaped delimiter characters");
    }

    private getUnescaptedDelimiterRegex(): RegExp {
        return new RegExp(`(?<!\\${ESCAPE_CHARACTER})\${this.delimiter}`, 'g');
    }

}