import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

interface Bag {
    color: string;
    children: { amount: number; color: string }[];
}

const turnArrToBag = (arr: string[]) => {
    const newBag: Bag = {
        color: arr[0].trim(),
        children: arr.slice(1).flatMap(l => {
            const newL = l.trim();
            if (newL.slice(0, 2) === "no") {
                return [] as { amount: number; color: string }[];
            } else {
                return [
                    {
                        amount: Number(newL.charAt(0)),
                        color: newL.split(" ").slice(1, 3).join(" ").trim()
                    }
                ];
            }
        })
    };
    return newBag;
};

const containsShinyGold = (arr: Bag[], color: string) => {
    return arr.find(l => l.color === color)
        ? arr
              .find(l => l.color === color)!
              .children.some(l => l.color === "shiny gold")
        : false;
};

const childrenToBag = (main: Bag[], arr: Bag["children"]) => {
    return arr.map(l => ({
        color: l.color,
        children: main.find(j => j.color === l.color)?.children || []
    }));
};

const containsShinyGoldRec = (arr: Bag[], cur: Bag) => {
    let out = 0;
    out += childrenToBag(
        arr,
        cur.children.filter(l => l.color === "shiny gold")
    ).length;
    out += childrenToBag(arr, cur.children)
        .filter(l => containsShinyGoldRec(arr, l) > 0)
        .map(l => containsShinyGoldRec(arr, l))
        .reduce((acc, cur) => acc + cur, 0);
    return out;
};

const part2 = (arr: Bag[], val: Bag) => {
    let out = 0;
    val.children.map(l => {
        out += l.amount;
        childrenToBag(arr, [l]).map(j => {
            out += part2(arr, j) * l.amount;
        });
    });
    return out;
}

const main = async () => {
    const input = await readInputSplit(path.join(__dirname, "./input.txt"));

    input.pop();

    const parsed = input
        .map(l => l.split("bags contain"))
        .map(l => [l[0], ...l[1].split(", ")])
        .map(turnArrToBag);

    console.time("part1");

    console.log(parsed.map(l => containsShinyGoldRec(parsed, l)).filter(l => l > 0).length);

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(parsed, parsed.find(l => l.color === "shiny gold")!));

    console.timeEnd("part2");
};

main();
