import { ConstConstError } from "./errors"
import { Frozen, DeepFrozen } from "./frozen-types";
import { isSimpleObject } from "./utils";
import { mutationHandler, mapMutationHandler } from "./handlers";

export function freeze<T>(obj: T): Frozen<T> {
    if(obj == undefined) {
        return obj as Frozen<T>;
    } else if(typeof obj != "object" || (!isSimpleObject(obj) && !(obj instanceof Map) && !(obj instanceof Array))) {
        return obj as Frozen<T>;
    } else {
        if(Object.isFrozen(obj)) {
            return obj as Frozen<T>;
        } else {
            let handlerToUse = mutationHandler;
            if (obj instanceof Map) handlerToUse = mapMutationHandler;
            return new Proxy(obj, handlerToUse) as Frozen<T>;
        }
    }
}

export function deepFreeze<T>(obj: T): DeepFrozen<T> {
    if(obj == undefined) return obj as DeepFrozen<T>;
    if(typeof obj != "object" || (!isSimpleObject(obj) && !(obj instanceof Array) && !(obj instanceof Map))) return obj as DeepFrozen<T>;
    const wm = new WeakMap();
    return deepFreezer(obj, wm);
}

function deepFreezer<T>(obj: T, seenObj: WeakMap<object, unknown>): DeepFrozen<T> {
    if(obj == undefined) return obj as DeepFrozen<T>;
    if(typeof obj != "object" || (!isSimpleObject(obj) && !(obj instanceof Array) && !(obj instanceof Map))) return obj as DeepFrozen<T>;
    if(Object.isFrozen(obj)) return obj as DeepFrozen<T>;
    let proxyObj;
    if(seenObj.has(obj)) {
        const seenRef = seenObj.get(obj);
        if(!seenRef) throw new Error("Object got GCed before freezing completed!");
        return seenRef as DeepFrozen<T>;
    } else {
        const handler = (obj instanceof Map) ? mapMutationHandler : mutationHandler;
        proxyObj = new Proxy(obj, handler);
        seenObj.set(obj, proxyObj);
    }
    if(obj instanceof Array) {
        for(let i = 0; i < obj.length; i++) {
            const val = Reflect.get(obj, i);
            Reflect.set(obj, i, deepFreezer(val, seenObj));
        }
    } else if (obj instanceof Map) {
        for(const [key, val] of obj.entries()) {
            obj.set(key, deepFreezer(val, seenObj));
        }
    } else {
        const keys = Reflect.ownKeys(obj);
        for(const key of keys) {
            const val = Reflect.get(obj, key);
            Reflect.set(obj, key, deepFreezer(val, seenObj));
        }
    }
    return proxyObj;
}
