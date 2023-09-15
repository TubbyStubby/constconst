// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSimpleObject(x: any) {
    return x.toString() == "[object Object]";
}