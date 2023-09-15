/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConstConstError } from "../src/errors";
import { deepFreeze, freeze } from "../src/freezers";

describe("Freeze Tests", () => {
    it("Should return same value if not a function or object", () => {
        const value = Symbol("x");
        const frozen = freeze(value);
        expect(frozen).toBe(value);
        expect(freeze(undefined)).toBe(undefined);
    });

    it("Should freeze simple object", () => {
        const obj = { foo: "bar" };
        const frozen = freeze(obj);
        expect(frozen).toEqual(obj);
        const value = "test";
        expect(() => (frozen as any).foo = value).toThrowError(ConstConstError.newSetError('foo', value));
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
    
    test("Frozen object throws error when updating existing property", () => {
        const obj = { foo: "bar" };
        const frozen = freeze(obj);
        const value = "baz";
        expect(() => (frozen.foo as any) = value).toThrowError(ConstConstError.newSetError('foo', value));
    });
    
    test("Frozen object throws error when deleting a property", () => {
        const obj = { foo: "bar" };
        const frozen = freeze(obj);
        expect(() => delete (frozen as any).foo).toThrowError(ConstConstError.newDeleteError('foo'));
    });
    
    test("Frozen object throws error when adding new property", () => {
        const obj = { foo: "bar" };
        const frozen = freeze(obj);
        const value = "foobar";
        expect(() => (frozen as any).baz = value).toThrowError(ConstConstError.newSetError('baz', value));
    });
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
        expect(() => (frozen as any).foo = value).toThrowError(ConstConstError.newSetError('foo', value));
    });

    it("Should freeze an array ", () => {
        const arr = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }];
        const frozen = deepFreeze(arr);
        expect(frozen).toEqual(frozen);
        const value = "test";
        expect(() => (frozen as any)[1].b = value).toThrowError(ConstConstError.newSetError('b', value));
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

    test("Frozen object throws error when updating existing property", () => {
        const obj = { foo: "bar" };
        const frozen = deepFreeze(obj);
        const value = "bar";
        expect(() => (frozen.foo as any) = value).toThrowError(ConstConstError.newSetError('foo', value));
    });
    
    test("Frozen object throws error when deleting a property", () => {
        const obj = { foo: "bar" };
        const frozen = deepFreeze(obj);
        expect(() => delete (frozen as any).foo).toThrowError(ConstConstError.newDeleteError('foo'));
    });

    test("Frozen object throws error when adding new property", () => {
        const obj = { foo: "bar" };
        const frozen = deepFreeze(obj);
        const value = "baz";
        expect(() => (frozen as any).bar = value).toThrowError(ConstConstError.newSetError('bar', value));
    });
})