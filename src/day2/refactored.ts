import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const part1 = (str: string[]) => {
    const beginning = str[0].split("-").map(Number);
    const second = str[1].charAt(0);
    const matches = str[2].split(second).length - 1;
    return matches <= beginning[1] && matches >= beginning[0];
};

const part2 = (str: string[]) => {
    const beginning = str[0].split("-").map(Number);
    const second = str[1].charAt(0);

    if (
        str[2].charAt(beginning[0] - 1) === second &&
        str[2].charAt(beginning[1] - 1) === second
    ) {
        return false;
    }

    return (
        str[2].charAt(beginning[0] - 1) === second ||
        str[2].charAt(beginning[1] - 1) === second
    );
};

const main = async () => {
    const input = await (
        await readInputSplit(path.join(__dirname, "./input.txt"))
    ).map(l => l.split(" "));
    input.pop();

    console.time("main");

    console.log(input.map(part1).filter(l => !!l).length);
    console.log(input.map(part2).filter(l => !!l).length);

    console.timeEnd("main");
};

main();
