import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

const parseStr = (arr: string[]) => {
    return arr.slice(1).map(Number);
};

const rotateArr = <T>(arr: T[]): T[] => {
    arr.push(arr.shift()!);
    return arr;
};

const iterGame = (p1: number[], p2: number[]) => {
    const top1 = p1.shift()!;
    const top2 = p2.shift()!;
    if (top1 > top2) {
        p1.push(top1, top2);
    } else {
        p2.push(top2, top1);
    }
};

const thingInPreevs = (arr: number[][], prevs: number[][][]) => {
    const arrsEqual = <T>(arr1: T[], arr2: T[]): boolean =>
        arr1.every((l, idx) => arr2[idx] === l);
    for (const thing of prevs) {
        if (thing.every((l, idx) => arrsEqual(arr[idx], l))) {
            return true;
        }
    }
    return false;
};

const calcGame2 = (p1: number[], p2: number[]) => {
    const prevs: string[] = [];
    while (p1.length > 0 && p2.length > 0) {
        if (prevs.includes(`${p1.join()}|${p2.join()}`)) {
            return true;
        }
        prevs.push(`${p1.join()}|${p2.join()}`);
        const top1 = p1.shift()!;
        const top2 = p2.shift()!;
        if (p1.length >= top1 && p2.length >= top2) {
            const winner = calcGame2(
                [...p1].slice(0, top1),
                [...p2].slice(0, top2)
            );
            if (winner) {
                p1.push(top1, top2);
            } else {
                p2.push(top2, top1);
            }
        } else if (top1 > top2) {
            p1.push(top1, top2);
        } else {
            p2.push(top2, top1);
        }
    }
    return p1.length > 0;
};

const part1 = (arr: string[]) => {
    const parsed = arr.map(l => l.split("\n")).map(parseStr);
    const p1 = parsed[0];
    const p2 = parsed[1];
    while (p1.length > 0 && p2.length > 0) {
        iterGame(p1, p2);
    }
    return (p1.length > 0 ? p1 : p2)
        .reverse()
        .reduce((acc, cur, idx) => acc + cur * (idx + 1));
};

const part2 = (arr: string[]) => {
    const parsed = arr.map(l => l.split("\n")).map(parseStr);
    const p1 = parsed[0];
    const p2 = parsed[1];
    calcGame2(p1, p2);
    return (p1.length > 0 ? p1 : p2)
        .reverse()
        .reduce((acc, cur, idx) => acc + cur * (idx + 1));
};

const main = async () => {
    const input = (await readInputRaw(path.join(__dirname, "./input.txt")))
        .trim()
        .split("\n\n");

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input)); // SLOW

    console.timeEnd("part2");
};

main();
