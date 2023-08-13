/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConstConstError } from "../src/errors";
import { fakeDeepFreeze, fakeFreeze } from "../src/fakeFreezers";

describe("Freeze Tests", () => {
    it("Should return same value if not a function or object", () => {
        const value = Symbol("x");
        const frozen = fakeFreeze(value);
        expect(frozen).toBe(value);
        expect(fakeFreeze(undefined)).toBe(undefined);
    });

    it("Should seal simple object", () => {
        const obj = { foo: "bar" };
        const frozen = fakeFreeze(obj);
        expect(frozen).toEqual(obj);
        expect(Object.isSealed(obj)).toBe(true);
    });
    
    it("Should seal an array", () => {
        const arr = [1, 2, 3, 4];
        const frozen = fakeFreeze(arr);
        expect(frozen).toEqual(arr);
        expect(Object.isSealed(arr)).toBe(true);
    });
    
    it("Should not seal nested objects", () => {
        const obj = { foo: { bar: "foobar" } };
        const frozen = fakeFreeze(obj);
        expect(frozen).toEqual(obj);
        expect(Object.isSealed(obj)).toBe(true);
        expect(Object.isSealed(obj.foo)).toBe(false);
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

describe("Deep Freeze Tests", () => {
    it("Should return non function and objects", () => {
        const value = Symbol("x");
        const frozen = fakeDeepFreeze(value);
        expect(frozen).toBe(value);
        expect(fakeDeepFreeze(undefined)).toBe(undefined);
    });

    it("Should seal simple object", () => {
        const obj = { foo: "bar" };
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(frozen);
        expect(Object.isSealed(obj)).toBe(true);
    });

    it("Should seal an array ", () => {
        const obj = [1, 2, 3, 4];
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(frozen);
        expect(Object.isSealed(obj)).toBe(true);
    });

    it("Should seal nested objects", () => {
        const obj = { foo: { bar: "foobar" } };
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(obj);
        expect(Object.isSealed(obj)).toBe(true);
        expect(Object.isSealed(obj.foo)).toBe(true);
    });

    it("Should seal all objects in an array", () => {
        const obj = [{ foo: "bar" }, { bar: "baz" }];
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(obj);
        expect(Object.isSealed(obj)).toBe(true);
        expect(Object.isSealed(obj[0])).toBe(true);
        expect(Object.isSealed(obj[1])).toBe(true);
    });

    it("Should handle circular references", () => {
        const obj: any = { foo: "bar" };
        obj.self = obj;
        const frozen = fakeDeepFreeze(obj);
        expect(frozen).toEqual(obj);
        expect(Object.isSealed(obj)).toBe(true);
        expect(Object.isSealed(obj.self)).toBe(true);
        expect(frozen.self).toBe(frozen);
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