import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const thingIsValid = (blah: string[]) => {
    const beginning = blah[0].split("-").map(Number);
    const second = blah[1].charAt(0);
    let total = 0;
    for (const char of blah[2]) {
        if (char === second) {
            total++;
        }
    }
    return total <= beginning[1] && total >= beginning[0];
}

const part2 = (blah: string[]) => {
    const beginning = blah[0].split("-").map(Number);
    const second = blah[1].charAt(0);
    let total = 0;
    for (const char of blah[2]) {
        if (char === second) {
            total++;
        }
    }

    if (blah[2].charAt(beginning[0] - 1) === second && blah[2].charAt(beginning[1] - 1) === second) {
        return false;
    }

    return blah[2].charAt(beginning[0] - 1) === second || blah[2].charAt(beginning[1] - 1) === second;
}

const main = async () => {
    const input = await (await readInputSplit(path.join(__dirname, "./input.txt"))).map(l => l.split(" "));
    input.pop();

    console.time("main");

    // console.log(input.map(thingIsValid).filter(l => !!l).length);
    console.log(input.map(part2).filter(l => !!l).length);

    console.timeEnd("main");
};

main();
