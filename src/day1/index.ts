import * as path from "path";
import { readInputSplitNum } from "../helpers/readInput";

const main = async () => {
    const input = await readInputSplitNum(path.join(__dirname, "./input.txt"));

    console.time("part1");

    for (const num1 of input) {
        for (const num2 of input) {
            if (num1 + num2 === 2020 && num1 !== num2) {
                console.log("Part 1", num1 * num2);
            }
        }
    }

    console.timeEnd("part1");

    console.time("part2");

    for (const num1 of input) {
        for (const num2 of input) {
            for (const num3 of input) {
                if (
                    num1 + num2 + num3 === 2020 &&
                    num1 !== num2 &&
                    num2 !== num3 &&
                    num1 !== num3
                ) {
                    console.log("Part 2", num1 * num2 * num3);
                }
            }
        }
    }

    console.timeEnd("part2");
};

main();
