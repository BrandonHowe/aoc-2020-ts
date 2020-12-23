import * as path from "path";
import { readInputRaw } from "../helpers/readInput";
import { LinkedList } from "@datastructures/linked-list";

const getDest = (label: number, curr: number[], arr: number[]) => {
    let destination = label - 1;
    if (destination < Math.min(...arr)) {
        destination = Math.max(...arr);
    }
    while (curr.includes(destination)) {
        if (destination < Math.min(...arr)) {
            destination = Math.max(...arr);
        } else {
            destination--;
        }
    }
    return destination;
};

const part1 = (label: number) => {
    let labelArr = label.toString().split("").map(Number);
    for (let i = 0; i < 100; i++) {
        const currCups = labelArr.slice(1, 4);
        const remaining = [labelArr[0], ...labelArr.slice(4)];
        const destination = getDest(remaining[0], currCups, remaining);
        const destinationIdx = remaining.findIndex(l => l === destination);
        labelArr = remaining
            .slice(0, destinationIdx + 1)
            .concat(currCups)
            .concat(remaining.slice(destinationIdx + 1));
        labelArr.push(labelArr.shift()!);
    }
    while (labelArr[0] !== 1) {
        labelArr.push(labelArr.shift()!);
    }
    return labelArr.slice(1).join("");
};

const lltomap = (ll: any[]) => {
    return new Map(ll.map(l => [l.v, l]));
};

const part2 = (label: number) => {
    const labelArr = label.toString().split("").map(Number);
    let cups: any[] = labelArr;
    for (let i = Math.max(...labelArr) + 1; i <= 1000000; i++) {
        cups.push(i);
    }
    cups = cups.map((v, i) => (cups[i] = { v }));
    cups.forEach(
        (_, idx) =>
            (cups[idx].n = idx < cups.length - 1 ? cups[idx + 1] : cups[0])
    );
    const cupMap = lltomap(cups);
    let first = cups[0];
    for (let i = 0; i < 10000000; i++) {
        // if (i % 100000 === 0) {
        //     console.log(`We have done ${i} iterations`);
        // }
        const currCups = [first.n.v, first.n.n.v, first.n.n.n.v];
        const remaining = first.n;
        first.n = first.n.n.n.n;

        let destination = first.v - 1;
        while (true) {
            while (currCups.includes(destination)) {
                destination--;
            }
            if (destination === 0) {
                destination = cups.length;
            }
            while (currCups.includes(destination)) {
                destination--;
            }
            const matchingDest = cupMap.get(destination);
            if (matchingDest) {
                remaining.n.n.n = matchingDest.n;
                matchingDest.n = remaining;
                break;
            }
            destination--;
        }
        first = first.n;
    }
    const cup1 = cupMap.get(1);
    return cup1.n.v * cup1.n.n.v;
};

const main = async () => {
    const input = Number(
        (await readInputRaw(path.join(__dirname, "./input.txt"))).trim()
    );

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
