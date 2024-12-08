import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        AbstractName.preCheckComponentAmount(other.length); // pre-condition

        super(delimiter); // if undefined, the default delimiter is used
        this.name = other;
        this.noComponents = other.split(this.getUnescaptedDelimiterRegex(delimiter)).length; // count the number of components

        AbstractName.assertNameInvariant(this); // class-invariant
    }

    public getNoComponents(): number {
        AbstractName.assertNameInvariant(this); // class-invariant
        
        const result = this.noComponents;
        
        AbstractName.postCheckComponentAmount(result); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    public getComponent(i: number): string {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i); // pre-condition

        const result = this.name.split(this.getUnescaptedDelimiterRegex())[i];

        MethodFailedException.assertIsNotNullOrUndefined(result); // post-condition
        // MethodFailedException.assertCondition(result.length > 0, "components must have at least one character"); // post-condition // RootNode name is empty
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    private doSetComponent(i: number, newComponent: string): void {
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components[i] = newComponent;
        this.name = components.join(this.delimiter);
    }

    public setComponent(i: number, newComponent: string): StringName {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i); // pre-condition
        IllegalArgumentException.assertIsNotNullOrUndefined(newComponent); // pre-condition
        IllegalArgumentException.assertCondition(newComponent.length > 0, "components must have at least one character"); // pre-condition
        this.checkForUnescapedDelimiter(newComponent); // pre-condition

        const immutableCopy: StringName = this.cloneWithPrototype(this); // this should not be changed so we return a new instance with the changes
        immutableCopy.doSetComponent(i, newComponent);

        MethodFailedException.assertCondition(immutableCopy.getComponent(i) === newComponent, "component assignment did not work"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        AbstractName.assertNameInvariant(immutableCopy); // class-invariant
        return immutableCopy;
    }

    private doInsert(i: number, newComponent: string): void {
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(i, 0, newComponent);
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    public insert(i: number, newComponent: string): StringName {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i);
        IllegalArgumentException.assertIsNotNullOrUndefined(newComponent);
        IllegalArgumentException.assertCondition(newComponent.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(newComponent);
        
        const immutableCopy = this.cloneWithPrototype(this); // this should not be changed so we return a new instance with the changes
        immutableCopy.doInsert(i, newComponent);

        MethodFailedException.assertCondition(immutableCopy.getNoComponents() === this.getNoComponents() + 1, "component insertion did not work"); // post-condition
        MethodFailedException.assertCondition(immutableCopy.getComponent(i) === newComponent, "component insertion did not work"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        AbstractName.assertNameInvariant(immutableCopy); // class-invariant
        return immutableCopy;
    }

    private doAppend(newComponent: string): void {
        this.name += this.delimiter + newComponent;
        this.noComponents++;
    }

    public append(c: string): StringName {
        AbstractName.assertNameInvariant(this); // class-invariant
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(c); // pre-condition
        
        const immutableCopy = this.cloneWithPrototype(this); // this should not be changed so we return a new instance with the changes
        immutableCopy.doAppend(c);

        MethodFailedException.assertCondition(immutableCopy.getNoComponents() === this.getNoComponents() + 1, "component insertion did not work"); // post-condition
        // MethodFailedException.assertCondition(immutableCopy.getComponent(this.getNoComponents() - 1) === c, "component insertion did not work"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        AbstractName.assertNameInvariant(immutableCopy); // class-invariant
        return immutableCopy;
    }

    private doRemove(i: number): void {
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    public remove(i: number): StringName {
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