import * as path from "path";
import { readInputSplitNum } from "../helpers/readInput";

const part1 = (arr: number[], idx: number) => {
    for (const num of arr.slice(idx - 25, idx)) {
        for (const num2 of arr.slice(idx - 25, idx)) {
            if (num !== num2 && num + num2 === arr[idx]) {
                return true;
            }
        }
    }
    return false;
};

const truePart1 = (input: number[]) => {
    for (let i = 25; i < input.length; i++) {
        if (!part1(input, i)) {
            return input[i];
        }
    }
    return 0;
};

const part2 = (arr: number[], idx: number, match: number) => {
    for (const i in arr.slice(idx - 25, idx)) {
        for (const j in arr.slice(idx - 25, idx)) {
            if (Number(j) > +i) {
                if (
                    arr
                        .slice(+i + idx - 25, +j + idx - 25)
                        .reduce((acc, cur) => acc + cur, 0) === match
                ) {
                    return arr.slice(+i + idx - 25, +j + idx - 25);
                }
            }
        }
    }
    return [];
};

const main = async () => {
    const input = await readInputSplitNum(path.join(__dirname, "./input.txt"));
    input.pop();

    console.time("part1");

    const p1 = truePart1(input);
    console.log("Part 1", p1);

    console.timeEnd("part1");

    console.time("part2");
    for (let i = 25; i < input.length; i++) {
        if (part2(input, i, p1).length !== 0) {
            console.log(
                "Part 2",
                Math.max(...part2(input, i, p1)) +
                    Math.min(...part2(input, i, p1))
            );
            break;
        }
    }
    console.timeEnd("part2");
};

main();
