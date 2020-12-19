import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

interface Rule {
    [val: number]: number[][] | "a" | "b";
}

const parseRule = (str: string) => {
    const split1 = str.split(": ");
    const num = Number(split1[0]);
    if (split1[1] === '"a"') {
        return {
            [num]: "a"
        } as Rule;
    } else if (split1[1] === '"b"') {
        return {
            [num]: "b"
        } as Rule;
    } else {
        return {
            [num]: split1[1].split(" | ").map(l => l.split(" ").map(Number))
        };
    }
};

const matchRule = (
    ruleNum: number,
    rules: Rule,
    strToTest: string,
    strIdx: number
): number[] => {
    const currRule = rules[ruleNum];
    if (typeof currRule === "string") {
        return strToTest[strIdx] === currRule ? [strIdx + 1] : [];
    } else {
        return currRule.flatMap(rule =>
            rule.reduce(
                (acc, cur) =>
                    acc.flatMap(l => matchRule(cur, rules, strToTest, l)),
                [strIdx]
            )
        );
    }
};

const part1 = (arr: string[][]) => {
    const rules = arr[0]
        .map(parseRule)
        .reduce((acc, cur) => ({ ...acc, ...cur }), {});
    const strs = arr[1];
    return strs
        .map(l => matchRule(0, rules, l, 0))
        .filter((l, idx) => l[0] === strs[idx].length).length;
};

const part2 = (arr: string[][]) => {
    const rules = arr[0]
        .map(parseRule)
        .reduce((acc, cur) => ({ ...acc, ...cur }), {});
    const strs = arr[1];
    rules[8] = [[42], [42, 8]];
    rules[11] = [
        [42, 31],
        [42, 11, 31]
    ];
    return strs
        .map(l => matchRule(0, rules, l, 0))
        .filter((l, idx) => l[0] === strs[idx].length).length;
};

const main = async () => {
    const input = await (
        await readInputRaw(path.join(__dirname, "./input.txt"))
    )
        .split("\n\n")
        .map(l => l.split("\n"));
    input[input.length - 1].pop();

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
