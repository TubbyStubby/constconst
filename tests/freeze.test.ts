import { ConstConstError } from "../src/errors";
import { deepFreeze, freeze } from "../src/freezers";

describe("Freeze Tests", () => {
    it("Should return same value if not a function or object", () => {
        const value = Symbol("x");
        const frozen = freeze(value);
        expect(frozen).toBe(value);
        expect(freeze(undefined)).toBe(undefined);
    });

    it ("should keep set untouched", () => {
        const sample = new Set([1,2,3,4]);
        const frozen = freeze(sample);
        expect(frozen).toBe(sample);
    })

    it("Should freeze simple object", () => {
        const obj = { foo: "bar" };
        const frozen = freeze(obj);
        expect(frozen).toEqual(obj);
        const value = "test";
        expect(() => (frozen as any).foo = value).toThrow(ConstConstError.newSetError('foo', value));
    });
    
    it("Should not freeze nested objects", () => {
        const obj = { foo: { bar: "foobar" } };
        const frozen = freeze(obj);
        expect(frozen).toEqual(obj);
    });

    it('Should return original object if its already frozen', () => {
        const obj = { foo: "bar" };
        Object.freeze(obj);
        const frozen = freeze(obj);
        expect(frozen).toBe(obj);
    });
    
    it ("Should freeze a map (surface level)", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = freeze(map);
        expect(frozen.size).toBe(map.size);
        for (const key of map.keys()) {
            expect(frozen.get(key)).toBe(map.get(key));
        }

        expect(() => frozen.get("foo_1")["bar_1"] = "something").not.toThrow(ConstConstError.newMapSetError());
    });

    test("Frozen object throws error when updating existing property", () => {
        const obj = { foo: "bar" };
        const frozen = freeze(obj);
        const value = "baz";
        expect(() => (frozen.foo as any) = value).toThrow(ConstConstError.newSetError('foo', value));
    });
    
    test("Frozen object throws error when deleting a property", () => {
        const obj = { foo: "bar" };
        const frozen = freeze(obj);
        expect(() => delete (frozen as any).foo).toThrow(ConstConstError.newDeleteError('foo'));
    });
    
    test("Frozen object throws error when adding new property", () => {
        const obj = { foo: "bar" };
        const frozen = freeze(obj);
        const value = "foobar";
        expect(() => (frozen as any).baz = value).toThrow(ConstConstError.newSetError('baz', value));
    });

    test("Frozen map throws error when setting property", () => {
        const map = new Map([["foo", "bar"], ["foo_1", "bar_1"]]);
        const frozen = freeze(map);
        const value_to_set = "something_different";
        expect(() => frozen.set("foo", value_to_set)).toThrow(ConstConstError.newMapSetError());
    })

    test("Frozen map throws error when deleting property", () => {
        const map = new Map([["foo", "bar"], ["foo_1", "bar_1"]]);
        const frozen = freeze(map);
        expect(() => frozen.delete("foo")).toThrow(ConstConstError.newMapDeleteError());
    })

    test("Frozen map throws error when clearing property", () => {
        const map = new Map([["foo", "bar"], ["foo_1", "bar_1"]]);
        const frozen = freeze(map);
        expect(() => frozen.clear()).toThrow(ConstConstError.newMapClearError());
    })
})

describe("Deep Freeze Tests", () => {
    it("Should return non function and objects", () => {
        const value = Symbol("x");
        const frozen = deepFreeze(value);
        expect(frozen).toBe(value);
        expect(deepFreeze(undefined)).toBe(undefined);
    });

    it("Should freeze simple object", () => {
        const obj = { foo: "bar" };
        const frozen = deepFreeze(obj);
        expect(frozen).toEqual(frozen);
        const value = "test";
        expect(() => (frozen as any).foo = value).toThrow(ConstConstError.newSetError('foo', value));
    });

    it("Should freeze an array ", () => {
        const arr = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }];
        const frozen = deepFreeze(arr);
        expect(frozen).toEqual(frozen);
        const value = "test";
        expect(() => (frozen as any)[1].b = value).toThrow(ConstConstError.newSetError('b', value));
    });

    it('Should return original object if its already frozen', () => {
        const obj = { foo: "bar" };
        Object.freeze(obj);
        const frozen = deepFreeze(obj);
        expect(frozen).toBe(obj);
    });

    it("Should freeze nested objects aswell", () => {
        const obj = { foo: { bar: "foobar" } };
        const frozen = deepFreeze(obj);
        expect(frozen).toMatchObject(obj);
    });

    it("Should freeze all objects in an array", () => {
        const obj = [{ foo: "bar" }, { bar: "baz" }];
        const frozen = deepFreeze(obj);
        expect(frozen).toEqual(obj);
    });

    it("Should handle circular references", () => {
        const obj: any = { foo: "bar" };
        obj.self = obj;
        const frozen = deepFreeze(obj);
        expect(frozen).toEqual(obj);
        expect(frozen.self).toBe(frozen);
    });

    it("Should handle nested undefined", () => {
        const obj: any = { foo: "bar", baz: undefined };
        const frozen = deepFreeze(obj);
        expect(frozen).toEqual(obj);
    });

    it ("Should deepfreeze a map", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = deepFreeze(map);
        expect(frozen.size).toBe(map.size);
        for (const key of map.keys()) {
            expect(frozen.get(key)).toBe(map.get(key));
        }

        expect(() => frozen.get("foo_1")["bar_1"] = "something").toThrow(ConstConstError.newSetError("bar_1", "something"));
    });

    test("Frozen object throws error when updating existing property", () => {
        const obj = { foo: "bar" };
        const frozen = deepFreeze(obj);
        const value = "bar";
        expect(() => (frozen.foo as any) = value).toThrow(ConstConstError.newSetError('foo', value));
    });
    
    test("Frozen object throws error when deleting a property", () => {
        const obj = { foo: "bar" };
        const frozen = deepFreeze(obj);
        expect(() => delete (frozen as any).foo).toThrow(ConstConstError.newDeleteError('foo'));
    });

    test("Frozen object throws error when adding new property", () => {
        const obj = { foo: "bar", baz: { "a": "b" } };
        const frozen = deepFreeze(obj);
        const value = "baz";
        expect(() => (frozen as any).bar = value).toThrow(ConstConstError.newSetError('bar', value));
        expect(() => (frozen as any).baz.c = value).toThrow(ConstConstError.newSetError('c', value));
    });

    test("DeepFrozen map throws error when setting property at any level", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = deepFreeze(map);
        const value_to_set = "something_different";
        expect(() => frozen.set("foo", value_to_set)).toThrow(ConstConstError.newMapSetError());
        expect(() => frozen.get("foo_1")["bar_1"] = "something").toThrow(ConstConstError.newSetError("bar_1", "something"));
    })

    test("DeepFrozen map throws error when deleting property", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = deepFreeze(map);
        expect(() => frozen.delete("foo")).toThrow(ConstConstError.newMapDeleteError());
        expect(() => delete frozen.get("foo_1")["bar_1"]).toThrow(ConstConstError.newDeleteError("bar_1"));
        
    })

    test("DeepFrozen map throws error when clearing property", () => {
        const map = new Map<any, any>([
            ["foo", "bar"], 
            ["foo_1", {"bar_1": "baz"}]
        ]);
        const frozen = deepFreeze(map);
        expect(() => frozen.clear()).toThrow(ConstConstError.newMapClearError());
    })
})