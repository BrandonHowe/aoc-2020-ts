/* eslint-disable node/no-unsupported-features/es-builtins */
import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const part1 = (arr: any[]) => {
    const times = arr[1].map((l: number) => l - (arr[0] % l));
    const fastestIndex = times.indexOf(Math.min(...times));
    return arr[1][fastestIndex] * times[fastestIndex];
};

const positiveModulo = (num1: bigint, mod: bigint) => {
    let res = num1;
    while (res < 0n) {
        res += mod;
    }
    return res;
};
const computeStuff = (
    num1: bigint,
    mod1: bigint,
    num2: bigint,
    mod2: bigint
) => {
    const maxPossible = mod1 * mod2;

    for (let j = 0; j < maxPossible / mod2; j++) {
        const i = BigInt(j);
        // console.log("!", num2, mod2, i, mod1, (num2 + mod2 * i) % mod1, mod2 * i)
        if ((num2 + mod2 * i) % mod1 === num1) {
            return mod2 * i + num2;
        }
    }

    return 0n;
};

const part2 = (raw: number[]) => {
    let temp = Object.entries(raw);
    temp = temp.filter(l => !isNaN(l[1]));

    const keys = temp.map(l => l[0]).map(BigInt);
    const arr = temp.map(l => l[1]).map(BigInt);

    let accum = computeStuff(keys[0], arr[0], arr[1] - keys[1], arr[1]);
    let currLCM = arr[0] * arr[1];

    for (let i = 2; i < arr.length; i++) {
        const currThing = positiveModulo(arr[i] - keys[i], arr[i]);
        accum = computeStuff(currThing, arr[i], accum, currLCM);
        currLCM *= arr[i];
    }

    return accum;
};

const main = async () => {
    const input: any[] = await await readInputSplit(
        path.join(__dirname, "./input.txt")
    );
    input.pop();

    input[0] = Number(input[0]);
    input[1] = input[1].split(",").map(Number);

    console.time("part1");

    console.log(part1([input[0], input[1].filter(l => !isNaN(l))]));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input[1]));

    console.timeEnd("part2");
};

main();
