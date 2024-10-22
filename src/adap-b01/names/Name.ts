export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

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
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    // mutation method: initialization
    // convenience: constructor
    constructor(other: string[], delimiter?: string) {
        this.components = other;
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // query method: conversion
    // implemenation: composed
    public asString(delimiter: string = this.delimiter): string {
        let name: string = "";
        for (let i = 0; i < this.components.length; i++) {
            if (i != 0) {
                name += delimiter; // append the delimiter before the next component (not before the first)
            }
            name += this.components[i]; // always append the next component
        }
        return name;
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        throw new Error("needs implementation");
    }

    // query method: getter
    // implemenation: primitive
    public getComponent(i: number): string {
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // mutation method: setter
    // implemenation: primitive
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     // query method: getter
    // implemenation: primitive
    public getNoComponents(): number {
        return this.components.length; // who in their right mind would call this NoComponents? Call it getNumberOf.. or getComponentCount
    }

    /** Expects that new Name component c is properly masked */
    // mutation method: command
    // implemenation: primitive??
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c); // insert the component at the i-th position and push the rest back
    }

    /** Expects that new Name component c is properly masked */
    // mutation method: command
    // implemenation: primitive??
    public append(c: string): void {
        this.components.push(c); // add the component to the end
    }

    // mutation method: command
    // implemenation: primitive??
    public remove(i: number): void {
        this.components.splice(i, 1); // remove the i-th component
    }

}