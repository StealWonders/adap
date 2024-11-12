import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        if (other.length == 0) throw new Error("Name must have at least one component");
        if (delimiter !== undefined) super(delimiter);
        else super();
        this.name = other;
        this.noComponents = other.split(this.getUnescaptedDelimiterRegex(delimiter)).length; // count the number of components
    }

    getNoComponents(): number {
        return this.noComponents;
    }

    getComponent(i: number): string {
        this.checkBounds(i);
        return this.name.split(this.getUnescaptedDelimiterRegex())[i];
    }

    setComponent(i: number, newComponent: string) {
        this.checkBounds(i);
        this.checkForUnescapedDelimiter(newComponent);
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components[i] = newComponent;
        this.name = components.join(this.delimiter);
    }

    insert(i: number, newComponent: string) {
        this.checkBounds(i);
        this.checkForUnescapedDelimiter(newComponent);
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(i, 0, newComponent);
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    append(c: string) {
        this.checkForUnescapedDelimiter(c);
        this.name += this.delimiter + c;
        this.noComponents++;
    }

    remove(i: number) {
        this.checkBounds(i);
        const components = this.name.split(this.getUnescaptedDelimiterRegex());
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    private checkForUnescapedDelimiter(c: string): void {
        if (c.includes(this.getUnescaptedDelimiterRegex().toString())) throw new Error("String contains unescaped delimiter characters");
    }

    private getUnescaptedDelimiterRegex(delimiter: string = this.delimiter): RegExp {
        return new RegExp(`(?<!\\${ESCAPE_CHARACTER})[${this.delimiter}]`, 'g'); // todo: make this escape escape-characters
        
        // all not correctly escaped delimiters
        // return new RegExp(`(?<!\\${ESCAPE_CHARACTER})(?:\\\\\\\\)*[${this.delimiter}]`, 'g');
        // return new RegExp(`(?<!\\${ESCAPE_CHARACTER})(\\${ESCAPE_CHARACTER}\\${ESCAPE_CHARACTER})*[${this.delimiter}]`, 'g');
        // return new RegExp(`(?<!\\${ESCAPE_CHARACTER}|(?:\\${ESCAPE_CHARACTER}{2})*\\${ESCAPE_CHARACTER})[${delimiter}]`, 'g');    
        // return new RegExp(`(?<=(^|[^\\${ESCAPE_CHARACTER}]|(?:\\${ESCAPE_CHARACTER}{2})+))[${delimiter}]`, 'g');
    }   

}