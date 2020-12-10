import * as path from "path";
import { readInputSplitNum } from "../helpers/readInput";

const part1 = (arr: number[]) => {
    let currFind = 0;
    let onejolts = 0;
    let threejolts = 0;
    const picked = Array(arr.length).fill(0);
    while (picked.includes(0)) {
        if (arr.includes(currFind + 1)) {
            picked[arr.indexOf(currFind + 1)]++;
            currFind++;
            onejolts++;
        } else if (arr.includes(currFind + 3)) {
            picked[arr.indexOf(currFind + 3)]++;
            currFind += 3;
            threejolts++;
        }
    }
    return onejolts * (threejolts + 1);
};

const gaps = (raw: number[]) => {
    const arr = raw.sort((a, b) => a - b);
    return arr.map((l, idx) => (arr[idx + 1] || -9999) - l).filter(l => l > 0);
};

const genRuns = (arr: number[]) => {
    const newArr: number[] = [1];
    for (const thing of arr) {
        if (thing === 1) {
            newArr[newArr.length - 1]++;
        }
        if (thing === 3) {
            newArr.push(1);
        }
    }
    newArr[0]++; // To account for leading zero
    return newArr.filter(l => l !== 1);
};

const part2 = (arr: number[]) => {
    const leGaps = genRuns(gaps(arr));
    console.log(arr.sort((a, b) => a - b));
    let exp2 = 0;
    let exp7 = 0;
    let exp13 = 0;
    for (const gap of leGaps) {
        if (gap === 3) {
            exp2++;
        }
        if (gap === 4) {
            exp2 += 2;
        }
        if (gap === 5) {
            exp7++;
        }
        if (gap === 6) {
            exp13 += 1;
        }
    }
    console.log(exp2, exp7, exp13);
    return 2 ** exp2 * 7 ** exp7 * 13 ** exp13;
};

const main = async () => {
    const input = await readInputSplitNum(path.join(__dirname, "./input.txt"));
    input.pop();

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
