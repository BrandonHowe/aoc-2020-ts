import * as path from "path";
import { readInputGrid } from "../helpers/readInput";

interface Location {
    x: number;
    y: number;
    z: number;
}

const areNeighbors = (val1: Location, val2: Location) => {
    return (
        Math.abs(val2.x - val1.x) <= 1 &&
        Math.abs(val2.y - val1.y) <= 1 &&
        Math.abs(val2.z - val1.z) <= 1
    );
};

const getNeighborCount = (val: Location, arr: Map<Location, boolean>) => {
    let neighborCount = 0;
    for (const thing of arr) {
        // console.log(val, thing, areNeighbors(val, thing[0]));
        if (thing[1] === true && areNeighbors(val, thing[0])) {
            neighborCount++;
        }
        if (thing[1] === true && areSame(val, thing[0])) {
            neighborCount--;
        }
    }
    return neighborCount;
};

const areSame = (val1: Location, val2: Location) => {
    return val2.x === val1.x && val2.y === val1.y && val2.z === val1.z;
};

const getArrDims = (arr: Map<Location, boolean>) => {
    const keys = arr.keys();
    let minX = 9999;
    let maxX = -100;
    let minY = 9999;
    let maxY = -100;
    let minZ = 9999;
    let maxZ = -100;
    for (const key of keys) {
        if (key.x < minX) {
            minX = key.x;
        }
        if (key.x > maxX) {
            maxX = key.x;
        }
        if (key.y < minY) {
            minY = key.y;
        }
        if (key.y > maxY) {
            maxY = key.y;
        }
        if (key.z < minZ) {
            minZ = key.z;
        }
        if (key.z > maxZ) {
            maxZ = key.z;
        }
    }
    return {
        minX,
        maxX,
        minY,
        maxY,
        minZ,
        maxZ
    };
};

const mapHasLoc = (val: Location, arr: Map<Location, boolean>) => {
    for (const thing of arr.entries()) {
        if (areSame(val, thing[0])) {
            return thing;
        }
    }
    return null;
};

const mapSetLoc = (
    val: Location,
    bool: boolean,
    arr: Map<Location, boolean>
) => {
    const newMap = new Map();
    for (const thing of arr.keys()) {
        if (areSame(val, thing)) {
            newMap.delete(thing);
        } else {
            newMap.set(thing, arr.get(thing)!);
        }
    }
    newMap.set(val, bool);
    return newMap;
};

const changeThing = (arr: Map<Location, boolean>) => {
    let officialState = arr;
    let newMap = arr;
    const dims = getArrDims(arr);
    for (let i = dims.minX - 1; i < dims.maxX + 2; i++) {
        for (let j = dims.minY - 1; j < dims.maxY + 2; j++) {
            for (let k = dims.minZ - 1; k < dims.maxZ + 2; k++) {
                const loc = { x: i, y: j, z: k };
                if (
                    mapHasLoc(loc, officialState) &&
                    mapHasLoc(loc, officialState)![1]
                ) {
                    if (
                        getNeighborCount(loc, officialState) !== 2 &&
                        getNeighborCount(loc, officialState) !== 3
                    ) {
                        newMap = mapSetLoc(loc, false, newMap);
                    } else {
                        newMap = mapSetLoc(loc, true, newMap);
                    }
                } else {
                    if (getNeighborCount(loc, officialState) === 3) {
                        newMap = mapSetLoc(loc, true, newMap);
                    } else {
                        newMap = mapSetLoc(loc, false, newMap);
                    }
                }
            }
        }
    }
    return newMap;
};

const part1 = (arr: string[][]) => {
    const parsed = arr.flatMap((l, yidx) =>
        l.map(
            (j, xidx) =>
                [{ x: xidx, y: yidx, z: 0 }, j === "#"] as [Location, boolean]
        )
    );
    let currState = new Map(parsed);
    for (let i = 0; i < 6; i++) {
        currState = changeThing(currState);
        let total = 0;
        for (const thing of new Map(parsed)) {
            if (thing[1] === true) {
                total++;
            }
        }
    }
    let total = 0;
    for (const thing of currState) {
        if (thing[1] === true) {
            total++;
        }
    }
    return total;
};

const displayMap = (map: Map<Location, boolean>) => {
    const dims = getArrDims(map);
    console.log(dims);
    const strs = [];
    for (let i = dims.minZ; i < dims.maxZ + 1; i++) {
        strs.push("");
        for (let j = dims.minY; j < dims.maxY + 1; j++) {
            for (let k = dims.minX; k < dims.maxX + 1; k++) {
                console.log(...mapHasLoc({ x: k, y: j, z: i }, map));
                strs[strs.length - 1] +=
                    mapHasLoc({ x: k, y: j, z: i }, map) &&
                    mapHasLoc({ x: k, y: j, z: i }, map)![1]
                        ? "#"
                        : ".";
            }
            strs[strs.length - 1] += "\n";
        }
    }
    return strs;
};

interface Location2 {
    x: number;
    y: number;
    z: number;
    w: number;
}

const locToNum = (loc: Location2) => {
    return loc.x * 100 ** 3 + loc.y * 100 ** 2 + loc.z * 100 + loc.w;
};

const getNeighborCount2 = (val: Location2, arr: Map<number, boolean>) => {
    let neighborCount = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                for (let dw = -1; dw <= 1; dw++) {
                    if (dx == 0 && dy == 0 && dz == 0 && dw == 0) {
                        continue;
                    }
                    if (
                        arr.get(
                            locToNum({
                                x: val.x + dx,
                                y: val.y + dy,
                                z: val.z + dz,
                                w: val.w + dw
                            })
                        )
                    ) {
                        // console.log(
                        //     "Found a neighbor at",
                        //     {
                        //         x: val.x + dx,
                        //         y: val.y + dy,
                        //         z: val.z + dz,
                        //         w: val.w + dw
                        //     },
                        //     arr.get(
                        //         locToNum({
                        //             x: val.x + dx,
                        //             y: val.y + dy,
                        //             z: val.z + dz,
                        //             w: val.w + dw
                        //         })
                        //     )
                        // );
                        neighborCount++;
                    }
                }
            }
        }
    }
    return neighborCount;
};

const areSame2 = (val1: Location2, val2: Location2) => {
    return (
        val2.x === val1.x &&
        val2.y === val1.y &&
        val2.z === val1.z &&
        val2.w === val1.w
    );
};

const getArrDims2 = (keys: IterableIterator<Location2>) => {
    let minX = 9999;
    let maxX = -100;
    let minY = 9999;
    let maxY = -100;
    let minZ = 9999;
    let maxZ = -100;
    let minW = 9999;
    let maxW = -100;
    for (const key of keys) {
        if (key.x < minX) {
            minX = key.x;
        }
        if (key.x > maxX) {
            maxX = key.x;
        }
        if (key.y < minY) {
            minY = key.y;
        }
        if (key.y > maxY) {
            maxY = key.y;
        }
        if (key.z < minZ) {
            minZ = key.z;
        }
        if (key.z > maxZ) {
            maxZ = key.z;
        }
        if (key.w < minW) {
            minW = key.w;
        }
        if (key.w > maxW) {
            maxW = key.w;
        }
    }
    return {
        minX,
        maxX,
        minY,
        maxY,
        minZ,
        maxZ,
        minW,
        maxW
    };
};

const mapHasLoc2 = (val: Location2, arr: Map<Location2, boolean>) => {
    for (const thing of arr.entries()) {
        if (areSame2(val, thing[0])) {
            return thing;
        }
    }
    return null;
};

const mapSetLoc2 = (
    val: Location2,
    bool: boolean,
    arr: Map<Location2, boolean>
) => {
    const newMap = new Map();
    for (const thing of arr.keys()) {
        if (areSame2(val, thing)) {
            newMap.delete(thing);
        } else {
            newMap.set(thing, arr.get(thing)!);
        }
    }
    newMap.set(val, bool);
    return newMap;
};

const mapDelLoc2 = (val: Location2, arr: Map<Location2, boolean>) => {
    const newMap = arr;
    for (const thing of arr.keys()) {
        if (areSame2(val, thing)) {
            newMap.delete(thing);
        }
    }
    return newMap;
};

const changeThing2 = (
    arr: Map<number, boolean>,
    numToLoc: Map<number, Location2>
): [Map<number, boolean>, Map<number, Location2>] => {
    let officialState = new Map([...arr.entries()]);
    let newMap = arr;
    let newArr = numToLoc;
    const dims = getArrDims2(numToLoc.values());
    for (let i = dims.minX - 1; i < dims.maxX + 2; i++) {
        for (let j = dims.minY - 1; j < dims.maxY + 2; j++) {
            for (let k = dims.minZ - 1; k < dims.maxZ + 2; k++) {
                for (let l = dims.minW - 1; l < dims.maxW + 2; l++) {
                    const loc = { x: i, y: j, z: k, w: l };
                    const neighborCount = getNeighborCount2(loc, officialState);
                    const mapHasLoc = numToLoc.get(locToNum(loc));
                    if (mapHasLoc) {
                        if (neighborCount !== 2 && neighborCount !== 3) {
                            newMap.delete(locToNum(loc));
                            newArr.delete(locToNum(loc));
                        } else {
                            newMap.set(locToNum(loc), true);
                            newArr.set(locToNum(loc), loc);
                        }
                    } else {
                        if (neighborCount === 3) {
                            newMap.set(locToNum(loc), true);
                            newArr.set(locToNum(loc), loc);
                        }
                    }
                }
            }
        }
    }
    return [newMap, newArr];
};

const part2 = (arr: string[][]) => {
    let parsed: any = arr
        .flatMap((l, yidx) =>
            l.map(
                (j, xidx) =>
                    [locToNum({ x: xidx, y: yidx, z: 0, w: 0 }), j === "#"] as [
                        number,
                        boolean
                    ]
            )
        )
        .filter(l => l[1] === true);
    const numToLocs = new Map(
        arr
            .flatMap((l, yidx) =>
                l.map(
                    (_, xidx) =>
                        [
                            locToNum({ x: xidx, y: yidx, z: 0, w: 0 }),
                            { x: xidx, y: yidx, z: 0, w: 0 }
                        ] as [number, Location2]
                )
            )
            .filter(l => parsed.some((j: number[]) => j[0] === l[0]))
    );
    parsed = new Map(parsed);
    let currState = parsed;
    let locs = numToLocs;
    for (let i = 0; i < 6; i++) {
        [currState, locs] = changeThing2(currState, locs);
    }
    let total = 0;
    for (const thing of currState) {
        if (thing[1] === true) {
            total++;
        }
    }
    return total;
};

const main = async () => {
    const input = await readInputGrid(path.join(__dirname, "./input.txt"));
    input.pop();

    console.time("part 1");

    console.log(part1(input));

    console.timeEnd("part 1");

    console.time("part 2");

    console.log(part2(input));

    console.timeEnd("part 2");
};

main();
