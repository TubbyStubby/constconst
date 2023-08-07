import { ConstConstError } from "./errors"
import { Frozen, DeepFrozen } from "./frozen-types";

export function fakeFreeze<T>(obj: T): Frozen<T> {
    if(obj == undefined) {
        return obj as Frozen<T>;
    } else if(typeof obj != "object") {
        return obj as Frozen<T>;
    } else {
        Object.seal(obj);
        return new Proxy(obj, {
            set(_, prop, val) {
                throw ConstConstError.newSetError(prop, val);
            },
            deleteProperty(_, prop) {
                throw ConstConstError.newDeleteError(prop);
            }
        }) as Frozen<T>;
    }
}

export function fakeDeepFreeze<T>(obj: T): DeepFrozen<T> {
    if(obj == undefined) return obj as DeepFrozen<T>;
    if(typeof obj != "object") return obj as DeepFrozen<T>;
    const wm = new WeakMap();
    return fakeDeepFreezer(obj, wm);
}

function fakeDeepFreezer<T>(obj: T, seenObj: WeakMap<object, unknown>): DeepFrozen<T> {
    if(obj == undefined) return obj as DeepFrozen<T>;
    if(typeof obj != "object") return obj as DeepFrozen<T>;
    let proxyObj;
    if(seenObj.has(obj)) {
        const seenRef = seenObj.get(obj);
        if(!seenRef) throw new Error("Object got GCed before freezing completed!");
        return seenRef as DeepFrozen<T>;
    } else {
        proxyObj = new Proxy(obj, {
            get(target, p) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const val = Reflect.get(target, p);
                if(val == undefined) return val;
                if(typeof val != "object") return val;
                return seenObj.get(val);
            },
            set(_, prop, val) {
                throw ConstConstError.newSetError(prop, val);
            },
            deleteProperty(_, prop) {
                throw ConstConstError.newDeleteError(prop);
            }
        });
        seenObj.set(obj, proxyObj);
    }
    if(obj instanceof Array) {
        for(let i = 0; i < obj.length; i++) {
            const val = Reflect.get(obj, i);
            fakeDeepFreezer(val, seenObj);
        }
    } else {
        const keys = Reflect.ownKeys(obj);
        for(const key of keys) {
            const val = Reflect.get(obj, key);
            fakeDeepFreezer(val, seenObj);
        }
    }
    Object.seal(obj);
    return proxyObj as DeepFrozen<T>;
}
