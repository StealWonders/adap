import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.preCheckDelimiterLength(delimiter); // pre-condition
        this.delimiter = delimiter;
        AbstractName.assertNameInvariant(this); // class-invariant
    }

    public asString(delimiter: string = this.delimiter): string {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.preCheckDelimiterLength(delimiter); // pre-condition

        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            result += this.getComponent(i)
                .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER) // Unescape escape characters
                .replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter); // Unescape the delimiter
            if (i < this.getNoComponents() - 1) result += delimiter;
        }

        this.postCheckComponentAmount(result.length); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public toString(): string {
        AbstractName.assertNameInvariant(this); // class-invariant

        const result = this.asDataString(); // don't know if this behavior is correct. Nothing was specified in the task

        this.postCheckComponentAmount(result.length); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public asDataString(): string {
        AbstractName.assertNameInvariant(this); // class-invariant

        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            result += this.getComponent(i);
            if (i < this.getNoComponents() - 1) result += this.delimiter;
        }

        this.postCheckComponentAmount(result.length); // post-condition
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

        MethodFailureException.assertIsNotNullOrUndefined(result, "Object.create() failed"); // post-condition
        MethodFailureException.assertCondition(this.isEqual(result), "clone() failed"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public isEmpty(): boolean {
        AbstractName.assertNameInvariant(this); // class-invariant

        const result = this.getNoComponents() === 0;

        MethodFailureException.assertCondition(this.getNoComponents() === 0 || this.getNoComponents() > 0, "component amount must be positive or zero"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public getDelimiterCharacter(): string {
        AbstractName.assertNameInvariant(this); // class-invariant

        const result = this.delimiter;

        this.postCheckDelimiterLength(result); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        AbstractName.assertNameInvariant(this); // class-invariant

        IllegalArgumentException.assertIsNotNullOrUndefined(other); // pre-condition
        this.preCheckComponentAmount(other.getNoComponents()); // pre-condition
        IllegalArgumentException.assertCondition(this.delimiter === other.getDelimiterCharacter(), "delimiters do not match"); // pre-condition
        const transaction = this.clone(); // save the current state for rollback

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        MethodFailureException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            transaction.getNoComponents() + other.getNoComponents() === this.getNoComponents(),
            "number of components do not add up correctly"
        )
        AbstractName.assertNameInvariant(this); // class-invariant
    }

    // Helper Method
    protected getUnescaptedDelimiterRegex(delimiter: string = this.delimiter): RegExp {
        return new RegExp(`(?<!\\${ESCAPE_CHARACTER})[${this.delimiter}]`, 'g');
    }

    // Pre- and Post-Conditions
    protected checkBounds(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) throw new IllegalArgumentException("index out of bounds");
    }

    protected checkForUnescapedDelimiter(c: string): void {
        if (c.includes(this.getUnescaptedDelimiterRegex().toString())) throw new IllegalArgumentException("string contains unescaped delimiter characters");
    }

    protected preCheckDelimiterLength(delimiter: string): void {
        if (delimiter.length !== 1) throw new IllegalArgumentException("delimiter must be a single character");
    }

    protected postCheckDelimiterLength(delimiter: string): void {
        if (delimiter.length !== 1) throw new MethodFailureException("delimiter must be a single character");
    }

    protected preCheckComponentAmount(amount: number): void {
        if (amount < 0) throw new IllegalArgumentException("component amount must be positive");
    }

    protected postCheckComponentAmount(amount: number): void {
        if (amount < 0) throw new MethodFailureException("component amount must be positive");
    }

    // Class Invariant
    protected static instanceIsName(o: any): o is Name {
        return o instanceof AbstractName; // todo: probably make this better
    }

    protected static assertNameInvariant(o: any) {
        InvalidStateException.assertCondition(AbstractName.instanceIsName(o), "Name class-invariant violated");
    }

}