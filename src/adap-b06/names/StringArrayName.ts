import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        AbstractName.preCheckComponentAmount(other.length); // pre-condition
        IllegalArgumentException.assertCondition(other.every(c => c.length > 0), "components must have at least one character"); // pre-condition
        
        super(delimiter); // if undefined, the default delimiter is used
        this.components = other;

        AbstractName.assertNameInvariant(this); // class-invariant
    }

    public getNoComponents(): number {
        AbstractName.assertNameInvariant(this); // class-invariant
        
        const result = this.components.length

        AbstractName.postCheckComponentAmount(result); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public getComponent(i: number): string {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i); // pre-condition

        const result = this.components[i];

        MethodFailedException.assertIsNotNullOrUndefined(result); // post-condition
        MethodFailedException.assertCondition(result.length > 0, "components must have at least one character"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    private doSetComponent(i: number, newComponent: string): void {
        this.components[i] = newComponent;
    }

    public setComponent(i: number, c: string): StringArrayName {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i); // pre-condition
        IllegalArgumentException.assertIsNotNullOrUndefined(c); // pre-condition
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character"); // pre-condition
        this.checkForUnescapedDelimiter(c); // pre-condition
        
        const immutableCopy = this.cloneWithPrototype(this); // this should not be changed so we return a new instance with the changes
        immutableCopy.doSetComponent(i, c);

        MethodFailedException.assertCondition(immutableCopy.getComponent(i) === c, "component assignment did not work"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        AbstractName.assertNameInvariant(immutableCopy); // class-invariant
        return immutableCopy;
    }

    private doInsert(i: number, newComponent: string): void {
        this.components.splice(i, 0, newComponent);
    }

    public insert(i: number, c: string): StringArrayName {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i);
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(c);

        const immutableCopy = this.cloneWithPrototype(this); // this should not be changed so we return a new instance with the changes
        immutableCopy.doInsert(i, c);

        MethodFailedException.assertCondition(immutableCopy.getNoComponents() === this.getNoComponents() + 1, "component insertion did not work"); // post-condition
        MethodFailedException.assertCondition(immutableCopy.getComponent(i) === c, "component insertion did not work"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        AbstractName.assertNameInvariant(immutableCopy); // class-invariant
        return immutableCopy;
    }

    private doAppend(newComponent: string): void {
        this.components.push(newComponent);
    }

    public append(c: string): StringArrayName {
        AbstractName.assertNameInvariant(this); // class-invariant
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(c);
        
        const immutableCopy = this.cloneWithPrototype(this); // this should not be changed so we return a new instance with the changes
        immutableCopy.doAppend(c);

        MethodFailedException.assertCondition(immutableCopy.getNoComponents() === this.getNoComponents() + 1, "component insertion did not work"); // post-condition
        // MethodFailedException.assertCondition(immutableCopy.getComponent(this.getNoComponents() - 1) === c, "component insertion did not work"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        AbstractName.assertNameInvariant(immutableCopy); // class-invariant
        return immutableCopy;
    }

    private doRemove(i: number): void {
        this.components.splice(i, 1);
    }

    public remove(i: number): StringArrayName {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i); // pre-condition

        const immutableCopy = this.cloneWithPrototype(this); // this should not be changed so we return a new instance with the changes
        immutableCopy.doRemove(i);

        MethodFailedException.assertCondition(immutableCopy.getNoComponents() === this.getNoComponents() - 1, "component removal did not work"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        AbstractName.assertNameInvariant(immutableCopy); // class-invariant
        return immutableCopy;
    }

}