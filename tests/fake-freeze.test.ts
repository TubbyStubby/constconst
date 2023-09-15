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
        expect(() => (frozen as any).foo = value).toThrowError(ConstConstError.newSetError('foo', value));
    });
    
    test("Frozen object throws error when updating existing property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeFreeze(obj);
        const value = "baz";
        expect(() => (frozen.foo as any) = value).toThrowError(ConstConstError.newSetError('foo', value));
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
        expect(() => delete (frozen as any).foo).toThrowError(ConstConstError.newDeleteError('foo'));
    });
    
    test("Frozen object throws error when adding new property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeFreeze(obj);
        const value = "foobar";
        expect(() => (frozen as any).baz = value).toThrowError(ConstConstError.newSetError('baz', value));
    });
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
        expect(() => (frozen as any).bar = value).toThrowError(ConstConstError.newSetError('bar', value));
        obj.foo = "baz";
        expect(frozen.foo).toBe("baz");
    });

    it("Should fake freeze an array of objects", () => {
        const arr = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }];
        const frozen = fakeDeepFreeze(arr);
        expect(frozen).toEqual(frozen);
        const value = "test";
        expect(() => (frozen as any)[3].b = value).toThrowError(ConstConstError.newSetError('b', value));
    });

    it("Should fake freeze nested objects", () => {
        const obj = { foo: { bar: "foobar" } };
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(obj);
        const value = "test";
        expect(() => (frozen as any).foo.baz = value).toThrowError(ConstConstError.newSetError('baz', value));
    });

    it("Should handle circular references", () => {
        const obj: any = { foo: "bar" };
        obj.self = obj;
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(obj);
        expect(frozen.self).toBe(frozen);
        const value = "test";
        expect(() => (frozen as any).self.bar = value).toThrowError(ConstConstError.newSetError('bar', value));
    });

    test("Frozen object throws error when updating existing property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeDeepFreeze(obj);
        const value = "baz";
        expect(() => (frozen.foo as any) = value).toThrowError(ConstConstError.newSetError('foo', value));
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
        expect(() => delete (frozen as any).foo).toThrowError(ConstConstError.newDeleteError('foo'));
    });

    test("Frozen object throws error when adding new property", () => {
        const obj = { foo: "bar" };
        const frozen = fakeDeepFreeze(obj);
        const value = "baz";
        expect(() => (frozen as any).bar = value).toThrowError(ConstConstError.newSetError('bar', value));
    });
})