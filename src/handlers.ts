import { ConstConstError } from "./errors";

export const mutationHandler: ProxyHandler<any> = {
    set(_, prop, val) {
        throw ConstConstError.newSetError(prop, val);
    },
    deleteProperty(_, prop) {
        throw ConstConstError.newDeleteError(prop);
    }
}

export const mapMutationHandler: ProxyHandler<any> = {
    get (tgt, prop) {
        let val = Reflect.get(tgt, prop);
        if (prop === "set") {
            throw ConstConstError.newMapSetError();
        } else if (prop === "clear") {
            throw ConstConstError.newMapClearError();
        } else if (prop === "delete") {
            throw ConstConstError.newMapDeleteError();
        }  else if (typeof val === "function") {
            val = val.bind(tgt);
            return val;
        } else {
            return val;
        }
    }
};
