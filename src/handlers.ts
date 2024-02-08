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
    get (tgt, prop, rcvr) {
        if (prop === "size") {
            return tgt.size;
        }
        let val = Reflect.get(tgt, prop, rcvr);
        if (prop === "set" && typeof val === "function") {
            throw ConstConstError.newMapSetError();
        } else if (prop === "clear" && typeof val === "function") {
            throw ConstConstError.newMapClearError();
        } else if (prop === "delete" && typeof val === "function") {
            throw ConstConstError.newMapDeleteError();
        }  else if (typeof val === "function") {
            val = val.bind(tgt);
            return val;
        }
    }
};
