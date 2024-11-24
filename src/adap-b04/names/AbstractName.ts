import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assertCondition(delimiter.length === 1, "delimiter must be a single character"); // pre-condition
        this.delimiter = delimiter;
        // todo: post-condition
    }

    // todo: escapted escape-characters are not handled correctly
    // return a human-readable representation of the Name. If a component contains an escaped delimiter unescape it
    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assertCondition(delimiter.length === 1, "delimiter must be a single character"); // pre-condition
        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            result += this.getComponent(i)
                .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER) // Unescape escape characters
                .replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter); // Unescape the delimiter
            if (i < this.getNoComponents() - 1) result += delimiter;
        }
        MethodFailureException.assertCondition(result.length > 0, "name must have at least one component"); // post-condition
        return result;
    }

    // todo: escapted escape-characters are not handled correctly
    // machine readable representation of the Name. Delimiters must be escaped within components
    public toString(): string {
        return this.asDataString(); // don't know if this behavior is correct. Nothing was specified in the task
    }

    // todo: escapted escape-characters are not handled correctly
    // machine readable representation of the Name. Delimiters must be escaped within components
    public asDataString(): string {
        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            result += this.getComponent(i);
            if (i < this.getNoComponents() - 1) result += this.delimiter;
        }
        MethodFailureException.assertCondition(result.length > 0, "name must have at least one component"); // post-condition
        return result;
    }

    public isEqual(other: Name): boolean {
        if (this === other) return true; // same object (reference equality)
        if (other == null) return false;

        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) return false;
        if (this.getNoComponents() !== other.getNoComponents()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }

    // ref: https://www.baeldung.com/java-hashcode
    public getHashCode(): number {
        let hash = 7; // start with a prime number
        hash = 31 * hash  + this.delimiter.charCodeAt(0);
        
        // hash each component
        for (let i = 0; i < this.getNoComponents(); i++) {
            const component = this.getComponent(i);
            for (let j = 0; j < component.length; j++) {
                hash = 31 * hash + component.charCodeAt(j);
            }
            hash = hash * 31; // separator value to distinguish between different component boundaries
        }
        
        return hash >>> 0; // keep the hash within 32-bit integer range
    }

    public clone(): Name {
        const result = Object.create(this);
        MethodFailureException.assertCondition(result !== null, "Object.create() failed"); // post-condition
        MethodFailureException.assertCondition(this.isEqual(result), "clone() failed"); // post-condition
        return result;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        MethodFailureException.assertCondition(this.delimiter.length === 1, "delimiter must be a single character"); // post-condition
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assertCondition(other != null, "other must not be null"); // pre-condition
        IllegalArgumentException.assertCondition(other.getNoComponents() > 0, "other must have at least one component"); // pre-condition
        IllegalArgumentException.assertCondition(this.delimiter === other.getDelimiterCharacter(), "delimiters do not match"); // pre-condition
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        // todo: post-condition
    }

    protected checkBounds(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) throw new IllegalArgumentException("index out of bounds");
    }

    protected checkForUnescapedDelimiter(c: string): void {
        if (c.includes(this.getUnescaptedDelimiterRegex().toString())) throw new IllegalArgumentException("string contains unescaped delimiter characters");
    }

    protected getUnescaptedDelimiterRegex(delimiter: string = this.delimiter): RegExp {
        return new RegExp(`(?<!\\${ESCAPE_CHARACTER})[${this.delimiter}]`, 'g');
    }

}