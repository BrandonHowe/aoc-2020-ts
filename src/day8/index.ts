import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const part1 = (program: string[][]) => {
    let acc = 0;
    let ip = 0;
    const instructionsRan = Array(program.length)
        .fill(0)
        .map(() => 0);
    while (instructionsRan[ip] < 1) {
        instructionsRan[ip]++;
        if (program[ip][0] === "acc") {
            acc += Number(program[ip][1]);
            ip++;
        } else if (program[ip][0] === "jmp") {
            ip += Number(program[ip][1]);
        } else if (program[ip][0] === "nop") {
            ip++;
        }
    }
    return acc;
};

const checkEnding = (program: string[][]) => {
    let acc = 0;
    let ip = 0;
    const instructionsRan = Array(program.length)
        .fill(0)
        .map(() => 0);
    for (let i = 0; i < 10000; i++) {
        if (ip >= program.length) {
            return acc;
        }
        instructionsRan[ip]++;
        if (program[ip][0] === "acc") {
            acc += Number(program[ip][1]);
            ip++;
        } else if (program[ip][0] === "jmp") {
            ip += Number(program[ip][1]);
        } else if (program[ip][0] === "nop") {
            ip++;
        }
    }
    return null;
};

const part2 = (program: string[][]) => {
    for (const i in program) {
        const thing = program[i];
        const fakeProgram = [...program.map(l => [...l])];
        if (thing[0] === "jmp") {
            fakeProgram[i][0] = "nop";
            if (checkEnding(fakeProgram) !== null) {
                return checkEnding(fakeProgram);
            }
        } else if (thing[0] === "nop") {
            fakeProgram[i][0] = "jmp";
            if (checkEnding(fakeProgram) !== null) {
                return checkEnding(fakeProgram);
            }
        }
    }
};

const main = async () => {
    const input = await (
        await readInputSplit(path.join(__dirname, "./input.txt"))
    ).map(l => l.split(" "));

    input.pop();

    console.time("part1");

    console.log("Part 1:", part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log("Part 2:", part2(input));

    console.timeEnd("part2");
};

main();
