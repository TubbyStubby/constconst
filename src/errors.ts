export enum ConstConstErrorCodes {
    SET_ERROR,
    DELETE_ERROR
}

export class ConstConstError extends Error {
    static newSetError(property: unknown, value: unknown) {
        const message = `Cannot set ${property} to ${value} since object is an actual constant.`;
        const error = new ConstConstError(message, ConstConstErrorCodes.SET_ERROR);
        return error;
    }
    
    static newDeleteError(property: unknown) {
        const message = `Cannot delete ${property} since object is an actual constant.`;
        const error = new ConstConstError(message, ConstConstErrorCodes.DELETE_ERROR);
        return error;
    }

    code: ConstConstErrorCodes | undefined;
    
    constructor(msg: string, code?: ConstConstErrorCodes) {
        super(msg);
        this.name = "ConstConstError";
        if(code) this.code = code;
    }
}