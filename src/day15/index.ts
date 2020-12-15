import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

const part1 = (arr: number[]) => {
    const lastSpoken: Record<number, number> = {};
    for (const i in arr) {
        lastSpoken[arr[i]] = +i;
    }
    let last = arr[arr.length - 1];
    for (let i = arr.length; i < 2020; ++i) {
        const currNum = last in lastSpoken ? i - lastSpoken[last] - 1 : 0;
        lastSpoken[last] = i - 1;
        last = currNum;
    }
    return last;
};

const part2 = (arr: number[]) => {
    const lastSpoken: Map<number, number> = new Map(
        arr.flatMap((l, idx) => (idx < arr.length - 1 ? [[l, idx]] : []))
    );
    let last = arr[arr.length - 1];
    for (let i = arr.length; i < 30000000; ++i) {
        const currNum = lastSpoken.has(last)
            ? i - lastSpoken.get(last)! - 1
            : 0;
        lastSpoken.set(last, i - 1);
        last = currNum;
    }
    return last;
};

const main = async () => {
    const input = await (
        await readInputRaw(path.join(__dirname, "./input.txt"))
    )
        .split(",")
        .map(Number);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
