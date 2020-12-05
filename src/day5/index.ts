import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const getNumFromStr = (str: string) => {
    const split = str.split("");
    const range: [number, number] = [0, 127];
    const col = [0, 7];
    for (const char of split.slice(0, 7)) {
        if (char === "F") {
            range[1] = range[1] - Math.ceil((range[1] - range[0]) / 2);
        } else {
            range[0] = range[0] + Math.ceil((range[1] - range[0]) / 2);
        }
    }
    for (const char of split.slice(-3)) {
        if (char === "L") {
            col[1] = col[1] - Math.ceil((col[1] - col[0]) / 2);
        } else {
            col[0] = col[0] + Math.ceil((col[1] - col[0]) / 2);
        }
    }
    return { range: range[0], col: col[0] };
};

const p2 = (num: number[]) => {
    let match = 0;
    while (true) {
        if (
            !num.includes(match) &&
            num.includes(match - 1) &&
            num.includes(match + 1)
        ) {
            return match;
        } else {
            match++;
        }
    }
};

const main = async () => {
    const input = await readInputSplit(path.join(__dirname, "./input.txt"));
    input.pop();

    console.time("part1");

    console.log(
        "Part 1:",
        Math.max(...input.map(getNumFromStr).map(l => l.range * 8 + l.col))
    );

    console.timeEnd("part1");

    console.time("part2");

    console.log(
        "Part 2:",
        p2(input.map(getNumFromStr).map(l => l.range * 8 + l.col))
    );

    console.timeEnd("part2");
};

main();
