import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

interface Instruction {
    idx: number;
    val: string;
}

interface Instrs {
    mask: number[];
    instructions: Instruction[];
}

const boolCombo = size => {
    const buf = Array(1 << size);
    for (let i = buf.length; i--; ) {
        buf[i] = Array(size);
        for (let j = size; j--; ) buf[i][j] = +!!(i & (1 << j));
    }
    return buf;
};

console.log(boolCombo(3));

const setVal = (arr: number[], mask: (number | null)[], num: string) => {
    mask.reverse();
    const binary = Number(num).toString(2).split("").map(Number);
    const reversedArr = arr.reverse();
    const reversedNum = binary.reverse();
    for (let i = 0; i < 36; i++) {
        reversedArr[+i] = (mask[i] !== -1 ? mask[i] : reversedNum[i]) || 0;
    }
    mask.reverse();
    return reversedArr.reverse();
};

const genPossibilitiesRaw = (num: number) => {
    const possibilities = [];
    for (let i = 0; i < 1 << num; i++) {
        possibilities.push(
            Array(num)
                .fill(0)
                .map((_, idx) => num - idx - 1)
                .map(l => !!(i & (1 << (l - 1))))
        );
    }
    return possibilities.map(l => l.map(Number));
};

const genPossibilities = (arr: number[]) => {
    const neg1Count = arr.filter(l => l === -1).length;
    const neg1Indices = Object.entries(arr)
        .filter(l => l[1] === -1)
        .map(l => Number(l[0]));
    const possibilitiesRaw: number[][] = boolCombo(neg1Count);
    const possibilities: number[][] = [];
    for (const possibility of possibilitiesRaw) {
        possibilities.push([...arr]);
        for (let i = 0; i < neg1Indices.length; i++) {
            possibilities[possibilities.length - 1][neg1Indices[i]] =
                possibility[i];
        }
    }
    return possibilities;
};

const setValP2 = (arr: number[], mask: number[], num: string) => {
    mask.reverse();
    const binary = Number(num).toString(2).split("").map(Number);
    const reversedArr = arr.reverse();
    const reversedNum = binary.reverse();
    for (let i = 0; i < 36; i++) {
        reversedArr[+i] = mask[i] || reversedNum[i] || 0;
    }
    mask.reverse();
    return reversedArr.reverse();
};

const parseProgram = (arr: string[]) => {
    const totalThings: Instrs[] = [];
    arr.map(l => {
        if (l.charAt(1) === "a") {
            totalThings.push({
                mask: l
                    .split(" = ")[1]
                    .split("")
                    .map(j => (Number(j).toString() === j ? Number(j) : -1)),
                instructions: []
            });
        } else {
            const splitStr = l.split("] = ");
            totalThings[totalThings.length - 1].instructions.push({
                idx: Number(splitStr[0].slice(4)),
                val: splitStr[1]
            });
        }
    });
    return totalThings;
};

const part1 = (arr: string[]) => {
    const program = parseProgram(arr);
    const thing: Record<number, any> = {};
    for (const blah of program) {
        for (const instr of blah.instructions) {
            const leArr = thing[instr.idx] || Array(36).fill(0);
            thing[instr.idx] = setVal(leArr, blah.mask, instr.val);
        }
    }
    return Object.values(thing).reduce(
        (acc, cur) => acc + parseInt(cur.reverse().join(""), 2),
        0
    );
};

const part2 = (arr: string[]) => {
    const program = parseProgram(arr);
    const thing: Record<number, any> = {};
    for (const blah of program) {
        for (const instr of blah.instructions) {
            const leArr = thing[instr.idx] || Array(36).fill(0);
            const p2 = setValP2(leArr, blah.mask, +instr.idx);
            const newPos = genPossibilities(p2);
            newPos.map(l => {
                const int = parseInt(l.reverse().join(""), 2);
                thing[int] = Number(instr.val)
                    .toString(2)
                    .padStart(36, "0")
                    .split("");
            });
        }
    }
    return Object.values(thing).reduce(
        (acc, cur) => acc + parseInt(cur.join(""), 2),
        0
    );
};

const main = async () => {
    const input = await readInputSplit(path.join(__dirname, "./input.txt"));
    input.pop();

    // console.log(part1(input));
    console.log(part2(input));

    console.time("main");

    console.timeEnd("main");
};

main();
