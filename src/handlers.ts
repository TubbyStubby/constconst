import { ConstConstError } from "./errors"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mutationHandler: ProxyHandler<any> = {
    set(_, prop, val) {
        throw ConstConstError.newSetError(prop, val);
    },
    deleteProperty(_, prop) {
        throw ConstConstError.newDeleteError(prop);
    }
}
