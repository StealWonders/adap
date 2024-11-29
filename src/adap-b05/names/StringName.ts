import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { AbstractName } from "./AbstractName";

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

    getNoComponents(): number {
        AbstractName.assertNameInvariant(this); // class-invariant
        
        const result = this.noComponents;
        
        AbstractName.postCheckComponentAmount(result); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    getComponent(i: number): string {
        AbstractName.assertNameInvariant(this); // class-invariant
        this.checkBounds(i); // pre-condition

        const result = this.name.split(this.getUnescaptedDelimiterRegex())[i];

        MethodFailedException.assertIsNotNullOrUndefined(result); // post-condition
        MethodFailedException.assertCondition(result.length > 0, "components must have at least one character"); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
        return result;
    }

    setComponent(i: number, newComponent: string) {
        AbstractName.assertNameInvariant(this); // class-invariant

        this.checkBounds(i); // pre-condition
        IllegalArgumentException.assertIsNotNullOrUndefined(newComponent); // pre-condition
        IllegalArgumentException.assertCondition(newComponent.length > 0, "components must have at least one character"); // pre-condition
        this.checkForUnescapedDelimiter(newComponent); // pre-condition
        const transaction = this.cloneWithPrototype(this); // save the current state for a potential rollback
        
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components[i] = newComponent;
        this.name = components.join(this.delimiter);

        MethodFailedException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getComponent(i) === newComponent,
            "component assignment did not work"
        ); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
    }

    insert(i: number, newComponent: string) {
        AbstractName.assertNameInvariant(this); // class-invariant

        this.checkBounds(i);
        IllegalArgumentException.assertIsNotNullOrUndefined(newComponent);
        IllegalArgumentException.assertCondition(newComponent.length > 0, "components must have at least one character");
        this.checkForUnescapedDelimiter(newComponent);
        const transaction = this.cloneWithPrototype(this); // save the current state for a potential rollback
        
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(i, 0, newComponent);
        this.name = components.join(this.delimiter);
        this.noComponents++;

        MethodFailedException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getComponent(i) === newComponent,
            "component insertion did not work"
        ); // post-condition
        MethodFailedException.assertConditionWithCallback(
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
        this.checkForUnescapedDelimiter(c); // pre-condition
        const transaction = this.cloneWithPrototype(this); // save the current state for a potential rollback
        
        this.name += this.delimiter + c;
        this.noComponents++;

        MethodFailedException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getComponent(this.getNoComponents() - 1) === c,
            "component insertion did not work"
        ); // post-condition
        MethodFailedException.assertConditionWithCallback(
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

        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;

        MethodFailedException.assertConditionWithCallback(
            () => {
                Object.assign(this, transaction);
            },
            this.getNoComponents() === transaction.getNoComponents() - 1,
            "component insertion did not work"
        ); // post-condition
        AbstractName.assertNameInvariant(this); // class-invariant
    }

}