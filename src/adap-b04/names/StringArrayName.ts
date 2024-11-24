import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        IllegalArgumentException.assertCondition(other.length > 0, "name must have at least one component"); // pre-condition
        IllegalArgumentException.assertCondition(other.every(c => c.length > 0), "components must have at least one character"); // pre-condition
        super(delimiter); // if undefined, the default delimiter is used
        this.components = other;
        // todo: class-invariant
    }

    getNoComponents(): number {
        // todo: class-invariant
        MethodFailureException.assertCondition(this.components.length > 0, "name must have at least one component"); // post-condition
        return this.components.length
    }

    getComponent(i: number): string {
        // todo: class-invariant
        this.checkBounds(i); // pre-condition
        const result = this.components[i];
        MethodFailureException.assertIsNotNullOrUndefined(result); // post-condition
        MethodFailureException.assertCondition(result.length > 0, "components must have at least one character"); // post-condition
        return result;
    }

    setComponent(i: number, c: string) {
        // todo: class-invariant
        this.checkBounds(i); // pre-condition
        IllegalArgumentException.assertIsNotNullOrUndefined(c); // pre-condition
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character"); // pre-condition
        this.checkForUnescapedDelimiter(c); // pre-condition
        
        this.components[i] = c;

        // todo: class-invariant
        // todo: post-condition
    }

    insert(i: number, c: string) {
        // todo: class-invariant
        this.checkBounds(i);
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(c);
        
        this.components.splice(i, 0, c); // insert the component at the i-th position and push the rest back

        // todo: class-invariant
        // todo: post-condition
    }

    append(c: string) {
        // todo: class-invariant
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(c);
        
        this.components.push(c); // append the component at the end

        // todo: class-invariant
        // todo: post-condition
    }

    remove(i: number) {
        // todo: class-invariant
        this.checkBounds(i); // pre-condition
        
        this.components.splice(i, 1); // remove the i-th component

        // todo: class-invariant
        // todo: post-condition
    }

}