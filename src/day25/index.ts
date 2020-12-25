import * as path from "path";
import { readInputSplitNum } from "../helpers/readInput";

const transform = (num: number, loops: number) => {
    let total = 1;
    for (let i = 0; i < loops; i++) {
        total *= num;
        total %= 20201227;
    }
    return total;
};

const findLoopSize = (num: number) => {
    let res = 1;
    let i = 0;
    while (res !== num) {
        res = (7 * res) % 20201227;
        i++;
    }
    return i;
};

const part1 = (nums: [number, number]) => {
    const loops = nums.map(findLoopSize);
    const encKeys = [
        transform(nums[0], loops[1]),
        transform(nums[1], loops[0])
    ];
    return encKeys;
};

const main = async () => {
    const input = await readInputSplitNum(path.join(__dirname, "./input.txt"));
    input.pop();

    console.time("main");

    console.log(part1(input as [number, number])[0]);

    console.timeEnd("main");

    console.log("Merry Christmas!");
};

main();
