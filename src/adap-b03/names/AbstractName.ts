import { Name } from "./Name";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./../common/Printable";

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    // todo: escapted escape-characters are not handled correctly
    // return a human-readable representation of the Name. If a component contains an escaped delimiter unescape it
    public asString(delimiter: string = this.delimiter): string {
        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            result += this.getComponent(i)
                .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER) // Unescape escape characters
                .replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter); // Unescape the delimiter
            if (i < this.getNoComponents() - 1) result += delimiter;
        }
        return result;
    }

    // todo: escapted escape-characters are not handled correctly
    // return a human-readable representation of the Name. If a component contains an escaped delimiter unescape it
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
        return Object.create(this);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        if (this.delimiter !== other.getDelimiterCharacter()) throw new Error("delimiters do not match");
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    protected checkBounds(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) throw new Error("index out of bounds");
    }

    protected checkForUnescapedDelimiter(c: string): void {
        if (c.includes(this.getUnescaptedDelimiterRegex().toString())) throw new Error("String contains unescaped delimiter characters");
    }

    protected getUnescaptedDelimiterRegex(delimiter: string = this.delimiter): RegExp {
        return new RegExp(`(?<!\\${ESCAPE_CHARACTER})[${this.delimiter}]`, 'g');
    }

}