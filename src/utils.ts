// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSimpleObject(x: any) {
    return x.toString() == "[object Object]";
}

export function turnOffProxy(): boolean {
    if (process.env.CONST_CONST_SKIP == "1") {
        return true;
    } else {
        return false;
    }
}