import { Exception } from "./Exception";

/**
 * A MethodFailedException signals that the method failed to provide its service.
 * In other words, a postcondition failed.
 */
export class MethodFailedException extends Exception {
  
    public static assert(c: boolean, m: string = "method failed", t?: Exception): void {
        if (!c) throw new MethodFailedException(m, t);
    }

    constructor(m: string, t?: Exception) {
        super(m, t);
    }

    // too lazy to change all the calls that used to rely on this method
    public static assertIsNotNullOrUndefined(o: any, m: string = "object must not be null or undefined"): void {
        MethodFailedException.assert(o !== null && o !== undefined, m);
    }

    // too lazy to change all the calls that used to rely on this method
    public static assertCondition(c: boolean, m: string = "condition failed"): void {
        MethodFailedException.assert(c, m);
    }
    
}