/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConstConstError } from "../src/errors";
import { fakeDeepFreeze, fakeFreeze } from "../src/fakeFreezers";

describe("Fake Freeze Tests", () => {
    it("Should return same value if not a function or object", () => {
        const value = Symbol("x");
        const frozen = fakeFreeze(value);
        expect(frozen).toBe(value);
        expect(fakeFreeze(undefined)).toBe(undefined);
    });

    it("Should fake freeze a simple object", () => {
        const obj = { foo: "bar" };
        const frozen = fakeFreeze(obj);
        expect(frozen).toEqual(obj);
        const value = "test";
        expect(() => (frozen as any).foo = value).toThrow(ConstConstError.newSetError('foo', value));
    });

    it ("should keep set untouched", () => {
        const sample = new Set([1,2,3,4]);
        const frozen = fakeFreeze(sample);
        expect(frozen).toBe(sample);
    })

    it ("Should fake freeze a map", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = fakeFreeze(map);
        expect(frozen.size).toBe(map.size);
        for (const key of map.keys()) {
            expect(frozen.get(key)).toBe(map.get(key));
        }
    });
    
    test("Frozen object throws error when updating existing property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeFreeze(obj);
        const value = "baz";
        expect(() => (frozen.foo as any) = value).toThrow(ConstConstError.newSetError('foo', value));
    });
    
    test("Frozen object reflects changes made to original", () => {
        const obj = { foo: "bar" };
        const frozen = fakeFreeze(obj);
        obj.foo = "baz";
        expect(frozen.foo).toBe("baz");
    });
    
    test("Frozen object throws error when deleting a property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeFreeze(obj);
        expect(() => delete (frozen as any).foo).toThrow(ConstConstError.newDeleteError('foo'));
    });
    
    test("Frozen object throws error when adding new property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeFreeze(obj);
        const value = "foobar";
        expect(() => (frozen as any).baz = value).toThrow(ConstConstError.newSetError('baz', value));
    });

    test("Frozen map throws error when setting property", () => {
        const map = new Map([["foo", "bar"], ["foo_1", "bar_1"]]);
        const frozen = fakeFreeze(map);
        const value_to_set = "something_different";
        expect(() => frozen.set("foo", value_to_set)).toThrow(ConstConstError.newMapSetError());
    })

    test("Frozen map throws error when deleting property", () => {
        const map = new Map([["foo", "bar"], ["foo_1", "bar_1"]]);
        const frozen = fakeFreeze(map);
        expect(() => frozen.delete("foo")).toThrow(ConstConstError.newMapDeleteError());
    })

    test("Frozen map throws error when clearing property", () => {
        const map = new Map([["foo", "bar"], ["foo_1", "bar_1"]]);
        const frozen = fakeFreeze(map);
        expect(() => frozen.clear()).toThrow(ConstConstError.newMapClearError());
    })
})

describe("Deep Fake Freeze Tests", () => {
    it("Should return non function and objects", () => {
        const value = Symbol("x");
        const frozen = fakeDeepFreeze(value);
        expect(frozen).toBe(value);
        expect(fakeDeepFreeze(undefined)).toBe(undefined);
    });

    it("Should fake freeze simple object", () => {
        const obj = { foo: "bar" };
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(frozen);
        const value = "test";
        expect(() => (frozen as any).bar = value).toThrow(ConstConstError.newSetError('bar', value));
        obj.foo = "baz";
        expect(frozen.foo).toBe("baz");
    });

    it("Should fake freeze an array of objects", () => {
        const arr = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }];
        const frozen = fakeDeepFreeze(arr);
        expect(frozen).toEqual(frozen);
        const value = "test";
        expect(() => (frozen as any)[3].b = value).toThrow(ConstConstError.newSetError('b', value));
    });

    it("Should fake freeze nested objects", () => {
        const obj = { foo: { bar: "foobar" } };
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(obj);
        const value = "test";
        expect(() => (frozen as any).foo.baz = value).toThrow(ConstConstError.newSetError('baz', value));
    });

    it("Should handle circular references", () => {
        const obj: any = { foo: "bar" };
        obj.self = obj;
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(obj);
        expect(frozen.self).toBe(frozen);
        const value = "test";
        expect(() => (frozen as any).self.bar = value).toThrow(ConstConstError.newSetError('bar', value));
    });

    it("Should handle nested undefined", () => {
        const obj: any = { foo: "bar", baz: undefined };
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(obj);
    });

    it ("Should fakedeepfreeze a map", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = fakeDeepFreeze(map);
        expect(frozen.size).toBe(map.size);
        for (const key of map.keys()) {
            expect(frozen.get(key)).toBe(map.get(key));
        }

        expect(() => frozen.get("foo_1")["bar_1"] = "something").toThrow(ConstConstError.newSetError("bar_1", "something"));
    });

    test("Frozen object throws error when updating existing property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeDeepFreeze(obj);
        const value = "baz";
        expect(() => (frozen.foo as any) = value).toThrow(ConstConstError.newSetError('foo', value));
    });
    
    test("Frozen object reflects changes made to original", () => {
        const obj = { foo: "bar" };
        const frozen = fakeDeepFreeze(obj);
        obj.foo = "baz";
        expect(frozen.foo).toBe("baz");
    });
    
    test("Nested frozen object reflects changes made to original", () => {
        const obj = { foo: { bar: "bas" } };
        const frozen = fakeDeepFreeze(obj);
        obj.foo.bar = "baz";
        expect(frozen.foo.bar).toBe("baz");
    });
    
    test("Frozen object throws error when deleting a property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeDeepFreeze(obj);
        expect(() => delete (frozen as any).foo).toThrow(ConstConstError.newDeleteError('foo'));
    });

    test("Frozen object throws error when adding new property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeDeepFreeze(obj);
        const value = "baz";
        expect(() => (frozen as any).bar = value).toThrow(ConstConstError.newSetError('bar', value));
    });

    test("DeepFrozen map throws error when setting property at any level", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = fakeDeepFreeze(map);
        const value_to_set = "something_different";
        expect(() => frozen.set("foo", value_to_set)).toThrow(ConstConstError.newMapSetError());
        expect(() => frozen.get("foo_1")["bar_1"] = "something").toThrow(ConstConstError.newSetError("bar_1", "something"));
    })

    test("DeepFrozen map throws error when deleting property", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = fakeDeepFreeze(map);
        expect(() => frozen.delete("foo")).toThrow(ConstConstError.newMapDeleteError());
        expect(() => delete frozen.get("foo_1")["bar_1"]).toThrow(ConstConstError.newDeleteError("bar_1"));
        
    })

    test("DeepFrozen map throws error when clearing property", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = fakeDeepFreeze(map);
        expect(() => frozen.clear()).toThrow(ConstConstError.newMapClearError());
    })
})