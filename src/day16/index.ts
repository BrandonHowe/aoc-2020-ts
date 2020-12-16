import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

interface DRange {
    min1: number;
    max1: number;
    min2: number;
    max2: number;
    name: string;
}

interface Ticket {
    ranges: DRange[];
    ticket: number[];
    nearby: number[][];
}

const parseTicket = (arr: string[][]) => {
    const firstThings = arr[0]
        .map(l =>
            l
                .split(" or ")
                .flatMap(j => j.split(": "))
                .slice(1)
                .map(j => j.split("-"))
                .map(j => j.map(Number))
        )
        .map((j, idx) => ({
            min1: j[0][0],
            max1: j[0][1],
            min2: j[1][0],
            max2: j[1][1],
            name: arr[0][idx].split(": ")[0]
        }));
    const secondThings = arr[1][1].split(",").map(Number);
    const nearby = arr[2].slice(1).map(l => l.split(",").map(Number));
    nearby.pop();
    return {
        ranges: firstThings,
        ticket: secondThings,
        nearby
    };
};

const inRange = (num: number, range: DRange) => {
    return (
        (num >= range.min1 && num <= range.max1) ||
        (num >= range.min2 && num <= range.max2)
    );
};

const part1 = (arr: string[][]) => {
    const parsed = parseTicket(arr);
    return parsed.nearby
        .flat()
        .filter(l => !parsed.ranges.some(j => inRange(l, j)))
        .reduce((acc, cur) => acc + cur);
};

const removeInvalids = (parsed: Ticket) => {
    return parsed.nearby.filter(l => {
        for (const thing of l) {
            if (!parsed.ranges.some(j => inRange(thing, j))) {
                return false;
            }
        }
        return true;
    });
};

const reduceCorrect = (arr: string[][]) => {
    let nubbed = arr.map(l => [...new Set(l)]);
    for (const i in nubbed) {
        const nub = nubbed[i];
        if (nub.length === 1) {
            nubbed = nubbed.map((l, idx) =>
                idx !== +i ? l.filter(j => j !== nub[0]) : l
            );
        }
    }
    return nubbed;
};

const part2 = (arr: string[][]) => {
    const parsed = parseTicket(arr);
    const invalid: string[][] = Array(parsed.ranges.length)
        .fill([])
        .map(() => []);
    parsed.nearby = removeInvalids(parsed);
    parsed.nearby.map(l => {
        return l.map((k, idx) =>
            parsed.ranges.map(j => {
                if (!invalid[idx].includes(j.name) && !inRange(k, j)) {
                    invalid[idx].push(j.name);
                }
            })
        );
    });
    const valid = Array(parsed.ranges.length)
        .fill([])
        .map(() => parsed.ranges.map(j => j.name))
        .map((l, idx) => l.filter(j => !invalid[idx].includes(j)));
    let reduceItABunch = valid;
    for (let i = 0; i < 20; i++) {
        reduceItABunch = reduceCorrect(reduceItABunch);
    }
    const depIndexes = Object.entries(reduceItABunch.map(l => l[0]))
        .filter(l => l[1].startsWith("departure"))
        .map(l => +l[0]);
    return parsed.ticket
        .filter((_, idx) => depIndexes.includes(idx))
        .reduce((acc, cur) => acc * cur);
};

const main = async () => {
    const input = await (
        await readInputRaw(path.join(__dirname, "./input.txt"))
    )
        .split("\n\n")
        .map(l => l.split("\n"));

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
