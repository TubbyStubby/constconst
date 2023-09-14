export type Frozen<T> = 
    T extends NonObject ? T :
    T extends object ? FrozenObject<T> :
    T

export type DeepFrozen<T> =
    T extends NonObject ? T :
    T extends ReadonlyArray<infer R> ? DeepFrozenArray<R> :
    T extends object ? DeepFrozenObject<T> :
    T

type NonObject =
    | null
    | undefined
    | string
    | number
    | boolean
    | symbol
    | bigint
    | Date
    | AnyFunction

type AnyFunction = (...args: unknown[]) => unknown

type FrozenObject<T> = {
    readonly [K in keyof T]: T[K];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeepFrozenArray<T> extends ReadonlyArray<DeepFrozen<T>> {}

type DeepFrozenObject<T> = {
    readonly [K in keyof T]: DeepFrozen<T[K]>;
}