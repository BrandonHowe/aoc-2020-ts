import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

const p1 = (str: string[][]) => {
    let total = 0;
    str.map(l => {
        total += [...new Set(l)].length;
    });
    return total;
};

const p2 = (str: string[][][]) => {
    let total = 0;
    str.map(l => {
        const set = [...new Set(l.flat())];
        set.map(j => {
            if (l.every(k => k.includes(j))) {
                total++;
            }
        });
    });
    return total;
};

const main = async () => {
    const input: string[][][] = await (
        await readInputRaw(path.join(__dirname, "./input.txt"))
    )
        .split("\n\n")
        .map(l => l.split("\n"))
        .map(l => l.map(j => j.split("")));

    input[input.length - 1].pop();

    const p1input = input.map(l => l.flat());

    console.log(p1(p1input));
    console.log(p2(input));

    console.time("main");

    console.timeEnd("main");
};

main();
