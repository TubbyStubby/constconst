const map = new Map([
    ["a", 1],
    ["b", 2],
    ["c", { "d": 4 } ]
]);

const mapProxyHandler = {
    get (tgt, prop, rcvr) {
        if (prop === "size") {
            return tgt.size;
        }
        let val = Reflect.get(tgt, prop, rcvr);
        if (prop === "set" && typeof val === "function") {
            throw Error("Set Error");
        } else if (prop === "clear" && typeof val === "function") {
            throw Error("Clear Error");
        } else if (prop === "delete" && typeof val === "function") {
            throw Error("Delete Error");
        }  else if (typeof val === "function") {
            val = val.bind(tgt);
            return val;
        }
    }
};

// map.set("re", 56);
let p = new Proxy(map, mapProxyHandler);
// p.set("a", 45);
for (let key of map.keys()) {
    console.log(map.get(key) == p.get(key));
}

p.get("c")["d"] = 34;
console.log(p);