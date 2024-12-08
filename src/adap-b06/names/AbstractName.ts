import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        AbstractName.preCheckDelimiterLength(delimiter); // pre-condition
        this.delimiter = delimiter;
        AbstractName.assertNameInvariant(this); // class-invariant
    }

    public asString(delimiter: string = this.delimiter): string {
        AbstractName.assertNameInvariant(this); // class-invariant
        AbstractName.preCheckDelimiterLength(delimiter); // pre-condition

        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            result += this.getComponent(i)
                .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER) // Unescape escape characters
                .replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter); // Unescape the delimiter
            if (i < this.getNoComponents() - 1) result += delimiter;
        }

        AbstractName.postCheckComponentAmount(result.length); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public toString(): string {
        AbstractName.assertNameInvariant(this); // class-invariant

        const result = this.asDataString(); // don't know if this behavior is correct. Nothing was specified in the task

        AbstractName.postCheckComponentAmount(result.length); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public asDataString(): string {
        AbstractName.assertNameInvariant(this); // class-invariant

        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            result += this.getComponent(i);
            if (i < this.getNoComponents() - 1) result += DEFAULT_DELIMITER;
        }

        AbstractName.postCheckComponentAmount(result.length); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public isEqual(other: Name): boolean {
        AbstractName.assertNameInvariant(this); // class-invariant

        if (this === other) return true; // same object (reference equality)
        if (other == null) return false;

        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) return false;
        if (this.getNoComponents() !== other.getNoComponents()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                AbstractName.assertNameInvariant(this); // class-invariant
                return false;
            }
        }

        AbstractName.assertNameInvariant(this); // class-invariant
        return true;
    }

    // ref: https://www.baeldung.com/java-hashcode
    public getHashCode(): number {
        AbstractName.assertNameInvariant(this); // class-invariant

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

        const result = hash >>> 0; // keep the hash within 32-bit integer range

        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public clone(): Name {
        AbstractName.assertNameInvariant(this); // class-invariant

        const result = Object.create(this);

        MethodFailedException.assertIsNotNullOrUndefined(result, "Object.create() failed"); // post-condition
        MethodFailedException.assertCondition(this.isEqual(result), "clone() failed"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    protected cloneWithPrototype<T>(obj: T): T {
        const cloned = structuredClone(obj);
        Object.setPrototypeOf(cloned, Object.getPrototypeOf(obj));
        return cloned;
    }

    public isEmpty(): boolean {
        AbstractName.assertNameInvariant(this); // class-invariant

        const result = this.getNoComponents() === 0;

        MethodFailedException.assertCondition(this.getNoComponents() === 0 || this.getNoComponents() > 0, "component amount must be positive or zero"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public getDelimiterCharacter(): string {
        AbstractName.assertNameInvariant(this); // class-invariant

        const result = this.delimiter;

        AbstractName.postCheckDelimiterLength(result); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        AbstractName.assertNameInvariant(this); // class-invariant

        IllegalArgumentException.assertIsNotNullOrUndefined(other); // pre-condition
        AbstractName.preCheckComponentAmount(other.getNoComponents()); // pre-condition
        IllegalArgumentException.assertCondition(this.delimiter === other.getDelimiterCharacter(), "delimiters do not match"); // pre-condition

        let concatinated: Name = this; // dummy start-value
        for (let i = 0; i < other.getNoComponents(); i++) {
            concatinated = this.append(other.getComponent(i));
        }

        MethodFailedException.assertCondition(this.getNoComponents() + other.getNoComponents() === concatinated.getNoComponents(), "number of components do not add up correctly"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return concatinated;
    }

    // Helper Method
    protected getUnescaptedDelimiterRegex(delimiter: string = this.delimiter): RegExp {
        return new RegExp(`(?<!\\${ESCAPE_CHARACTER})[${this.delimiter}]`, 'g');
    }

    // Class-bound Conditions
    protected checkBounds(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) throw new IllegalArgumentException("index out of bounds");
    }

    protected checkForUnescapedDelimiter(c: string): void {
        if (c.includes(this.getUnescaptedDelimiterRegex().toString())) throw new IllegalArgumentException("string contains unescaped delimiter characters");
    }

    // Pre- and Post-Conditions
    protected static preCheckDelimiterLength(delimiter: string): void {
        if (delimiter.length !== 1) throw new IllegalArgumentException("delimiter must be a single character");
    }

    protected static postCheckDelimiterLength(delimiter: string): void {
        if (delimiter.length !== 1) throw new MethodFailedException("delimiter must be a single character");
    }

    protected static preCheckComponentAmount(amount: number): void {
        if (amount < 0) throw new IllegalArgumentException("component amount must be positive");
    }

    protected static postCheckComponentAmount(amount: number): void {
        if (amount < 0) throw new MethodFailedException("component amount must be positive");
    }

    // Class Invariant
    protected static instanceIsName(o: any): o is Name {
        return o instanceof AbstractName; // todo: probably make this better
    }

    protected static assertNameInvariant(o: any) {
        InvalidStateException.assertCondition(AbstractName.instanceIsName(o), "Name class-invariant violated");
    }

}