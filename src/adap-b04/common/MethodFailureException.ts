import { Exception } from "./Exception";

/**
 * A MethodFailureException signals that the method failed to provide its service.
 * In other words, a postcondition failed.
 */
export class MethodFailureException extends Exception {

    static assertIsNotNullOrUndefined(o: any, exMsg: string = "null or undefined"): void {
        this.assertCondition(!this.isNullOrUndefined(o), exMsg);
    }
    
    static assertCondition(cond: boolean, exMsg: string): void {
        if (!cond) throw new MethodFailureException(exMsg);
    }

    static assertIsNotNullOrUndefinedWithCallback(callback: () => void, o: any, exMsg: string = "null or undefined"): void {
        this.assertConditionWithCallback(callback, !this.isNullOrUndefined(o), exMsg);
    }

    static assertConditionWithCallback(callback: () => void, cond: boolean, exMsg: string): void {
        if (cond) return;
        callback();
        throw new MethodFailureException(exMsg);
    }

    constructor(m: string) {
        super(m);
    }
    
}
