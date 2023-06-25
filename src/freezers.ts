import { mutationHandler } from "./handlers";

export function freeze<T>(obj: T): Readonly<T> {
    if(obj == undefined) return obj;
    if(typeof obj != "function" && typeof obj != "object") return obj;
    if(Object.isFrozen(obj)) return obj;
    Object.freeze(obj);
    return new Proxy(obj, mutationHandler);
}

export function deepFreeze<T>(obj: T): Readonly<T> {
    if(obj == undefined) return obj;
    if(typeof obj != "function" && typeof obj != "object") return obj;
    const wm = new WeakMap();
    return deepFreezer(obj, wm);
}

function deepFreezer<T>(obj: T, seenObj: WeakMap<object, Readonly<T>>): Readonly<T> {
    if(obj == undefined) return obj;
    if(typeof obj != "function" && typeof obj != "object") return obj;
    if(Object.isFrozen(obj)) return obj;
    let proxyObj;
    if(seenObj.has(obj)) {
        const seenRef = seenObj.get(obj);
        if(!seenRef) throw new Error("Object got GCed before freezing completed!");
        return seenRef;
    } else {
        proxyObj = new Proxy(obj, mutationHandler);
        seenObj.set(obj, proxyObj);
    }
    if(obj instanceof Array) {
        for(let i = 0; i < obj.length; i++) {
            const val = Reflect.get(obj, i);
            Reflect.set(obj, i, deepFreezer((val as any), seenObj));
        }
    } else {
        const keys = Reflect.ownKeys(obj);
        for(const key of keys) {
            const val = Reflect.get(obj, key);
            Reflect.set(obj, key, deepFreezer((val as any), seenObj));
        }
    }
    Object.freeze(obj);
    return proxyObj;
}
