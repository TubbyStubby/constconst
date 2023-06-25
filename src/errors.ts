export enum ConstConstErrorCodes {
    SET_ERROR,
    DELETE_ERROR
}

export class ConstConstError extends Error {
    static newSetError(property: unknown, value: unknown) {
        const message = `Cannot set property '${property}' to value '${value}' since object is a constconst`;
        const error = new ConstConstError(message, ConstConstErrorCodes.SET_ERROR);
        return error;
    }
    
    static newDeleteError(property: unknown) {
        const message = `Cannot delete property '${property}' since object is a constconst`;
        const error = new ConstConstError(message, ConstConstErrorCodes.DELETE_ERROR);
        return error;
    }

    code: ConstConstErrorCodes | undefined;
    
    constructor(msg: string, code?: ConstConstErrorCodes) {
        super(msg);
        Object.defineProperty(this, "name", {
            value: new.target.name,
            enumerable: false,
            configurable: true
        });
        Object.setPrototypeOf(this, new.target.prototype);
        if(code) this.code = code;
    }
}