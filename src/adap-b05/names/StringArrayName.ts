import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
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

    getNoComponents(): number {
        AbstractName.assertNameInvariant(this); // class-invariant
        
        const result = this.components.length

        AbstractName.postCheckComponentAmount(result); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    getComponent(i: number): string {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i); // pre-condition

        const result = this.components[i];

        MethodFailureException.assertIsNotNullOrUndefined(result); // post-condition
        MethodFailureException.assertCondition(result.length > 0, "components must have at least one character"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    setComponent(i: number, c: string) {
        AbstractName.assertNameInvariant(this); // class-invariant

        this.checkBounds(i); // pre-condition
        IllegalArgumentException.assertIsNotNullOrUndefined(c); // pre-condition
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character"); // pre-condition
        this.checkForUnescapedDelimiter(c); // pre-condition
        const transaction = this.cloneWithPrototype(this); // save the current state for a potential rollback
        
        this.components[i] = c;

        MethodFailureException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getComponent(i) === c,
            "component assignment did not work"
        ); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
    }

    insert(i: number, c: string) {
        AbstractName.assertNameInvariant(this); // class-invariant

        this.checkBounds(i);
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(c);
        const transaction = this.cloneWithPrototype(this); // save the current state for a potential rollback
        
        this.components.splice(i, 0, c); // insert the component at the i-th position and push the rest back

        MethodFailureException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getComponent(i) === c,
            "component insertion did not work"
        ); // post-condition
        MethodFailureException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getNoComponents() === transaction.getNoComponents() + 1,
            "component insertion did not work"
        ); // post-condition

        AbstractName.assertNameInvariant(this); // class-invariant
    }

    append(c: string) {
        AbstractName.assertNameInvariant(this); // class-invariant

        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(c.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(c);
        const transaction = this.cloneWithPrototype(this); // save the current state for a potential rollback
        
        this.components.push(c); // append the component at the end

        MethodFailureException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getComponent(this.getNoComponents() - 1) === c,
            "component insertion did not work"
        ); // post-condition
        MethodFailureException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getNoComponents() === transaction.getNoComponents() + 1,
            "component insertion did not work"
        ); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
    }

    remove(i: number) {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i); // pre-condition
        const transaction = this.cloneWithPrototype(this); // save the current state for a potential rollback
        
        this.components.splice(i, 1); // remove the i-th component

        MethodFailureException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getNoComponents() === transaction.getNoComponents() - 1,
            "component insertion did not work"
        ); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
    }

}