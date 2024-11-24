import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        IllegalArgumentException.assertCondition(other.length > 0, "name must have at least one component"); // pre-condition
        super(delimiter); // if undefined, the default delimiter is used
        this.name = other;
        this.noComponents = other.split(this.getUnescaptedDelimiterRegex(delimiter)).length; // count the number of components
        AbstractName.assertNameInvariant(this); // class-invariant
    }

    getNoComponents(): number {
        // todo: class-invariant
        MethodFailureException.assertCondition(this.noComponents > 0, "name must have at least one component"); // post-condition
        return this.noComponents;
    }

    getComponent(i: number): string {
        // todo: class-invariant
        this.checkBounds(i); // pre-condition
        const result = this.name.split(this.getUnescaptedDelimiterRegex())[i];
        MethodFailureException.assertIsNotNullOrUndefined(result); // post-condition
        MethodFailureException.assertCondition(result.length > 0, "components must have at least one character"); // post-condition
        return result;
    }

    setComponent(i: number, newComponent: string) {
        // todo: class-invariant
        this.checkBounds(i); // pre-condition
        IllegalArgumentException.assertIsNotNullOrUndefined(newComponent); // pre-condition
        IllegalArgumentException.assertCondition(newComponent.length > 0, "components must have at least one character"); // pre-condition
        this.checkForUnescapedDelimiter(newComponent); // pre-condition
        
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components[i] = newComponent;
        this.name = components.join(this.delimiter);

        // todo: class-invariant
        // todo: post-condition
    }

    insert(i: number, newComponent: string) {
        // todo: class-invariant
        this.checkBounds(i);
        IllegalArgumentException.assertIsNotNullOrUndefined(newComponent);
        IllegalArgumentException.assertCondition(newComponent.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(newComponent);
        
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(i, 0, newComponent);
        this.name = components.join(this.delimiter);
        this.noComponents++;

        // todo: class-invariant
        // todo: post-condition
    }

    append(c: string) {
        // todo: class-invariant
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(c); // pre-condition
        
        this.name += this.delimiter + c;
        this.noComponents++;

        // todo: class-invariant
        // todo: post-condition
    }

    remove(i: number) {
        // todo: class-invariant
        this.checkBounds(i); // pre-condition

        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;

        // todo: class-invariant
        // todo: post-condition
    }

}