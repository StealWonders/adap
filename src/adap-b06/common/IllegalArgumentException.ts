import { Exception } from "./Exception";
import { InvalidStateException } from "./InvalidStateException";

/**
 * An IllegalArgumentException signals an invalid argument.
 * In other words, a method precondition failed.
 */
export class IllegalArgumentException extends Exception {

    public static assert(c: boolean, m: string = "illegal argument", t?: Exception): void {
        if (!c) throw new IllegalArgumentException(m, t);
    }
    
    constructor(m: string, t?: Exception) {
        super(m, t);
    }

    // too lazy to change all the calls that used to rely on this method
    public static assertIsNotNullOrUndefined(o: any, m: string = "object must not be null or undefined"): void {
        IllegalArgumentException.assert(o !== null && o !== undefined, m);
    }

    // too lazy to change all the calls that used to rely on this method
    public static assertCondition(c: boolean, m: string = "condition failed"): void {
        IllegalArgumentException.assert(c, m);
    }

}