import { Exception } from "./Exception";

/**
 * An InvalidStateException signals an invalid state of an object.
 * In other words, a class invariant failed.
 */
export class InvalidStateException extends Exception {
  
    public static assert(c: boolean, m: string = "invalid state", t?: Exception): void {
        if (!c) throw new InvalidStateException(m, t);
    }

    constructor(m: string, t?: Exception) {
        super(m, t);
    }

    // too lazy to change all the calls that used to rely on this method
    public static assertIsNotNullOrUndefined(o: any, m: string = "object must not be null or undefined"): void {
        InvalidStateException.assert(o !== null && o !== undefined, m);
    }

    // too lazy to change all the calls that used to rely on this method
    public static assertCondition(c: boolean, m: string = "condition failed"): void {
        InvalidStateException.assert(c, m);
    }
    
}