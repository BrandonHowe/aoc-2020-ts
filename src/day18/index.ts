import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

// :: splitAt = number => Array<any>|string => Array<Array<any>|string>
const splitAt = (index: number) => (x: string): string[] => [
    x.slice(0, index),
    x.slice(index + 1)
];

const findMatchingParen = (str: string) => {
    let depth = 0;
    let canWin = false;
    for (const i in str.split("")) {
        const char = str[i];
        if (char === "(") {
            depth++;
            canWin = true;
        } else if (char === ")") {
            depth--;
        }
        if (canWin && depth === 0) {
            return +i;
        }
    }
    return -1;
};

const getFirstSpecialCharParens = (str: string) => {
    const plusIdx = str.indexOf("+");
    const multIdx = str.indexOf("*");
    const parenIdx = str.indexOf("(");
    if (parenIdx === 0) {
        return 0;
    }
    if (plusIdx === -1) {
        return multIdx;
    }
    if (multIdx === -1) {
        return plusIdx;
    }
    if (parenIdx === -1) {
        return plusIdx;
    }
    return Math.min(plusIdx, multIdx, parenIdx);
};

const lexQuestion = (raw: string): number => {
    const str = raw.trim();
    const firstSpecialCharParens = getFirstSpecialCharParens(str);
    const specialChar = str[firstSpecialCharParens];
    if (specialChar === "(") {
        const matchingParenIdx = findMatchingParen(str);
        if (matchingParenIdx === -1) {
            throw "Unmatched parentheses";
        }
        const splitStr = splitAt(matchingParenIdx - str.indexOf("(") - 1)(
            str.slice(str.indexOf("(") + 1)
        );
        return lexQuestion(`${lexQuestion(splitStr[0])}${splitStr[1]}`);
    }
    const firstSpecialCharRing = (() => {
        const plusIdx = str.indexOf("+");
        const multIdx = str.indexOf("*");
        if (plusIdx === -1) {
            return multIdx;
        }
        if (multIdx === -1) {
            return plusIdx;
        }
        return plusIdx < multIdx ? plusIdx : multIdx;
    })();
    if (firstSpecialCharRing === -1) {
        return Number(str);
    }
    const splitStr = splitAt(firstSpecialCharRing)(str);
    if (str.charAt(firstSpecialCharRing) === "+") {
        return Number(splitStr[0]) + lexQuestion(splitStr[1]);
    } else {
        return Number(splitStr[0]) * lexQuestion(splitStr[1]);
    }
};

function insert(str: string, index: number, value: string) {
    return str.substr(0, index) + value + str.substr(index);
}

const part1 = (arr: string[]) => {
    return arr
        .map(l =>
            l
                .split("")
                .reverse()
                .map(l => {
                    if (l === ")") {
                        return "(";
                    } else if (l === "(") {
                        return ")";
                    } else {
                        return l;
                    }
                })
                .join("")
        )
        .map(lexQuestion)
        .reduce((acc, cur) => acc + cur);
};

const part2 = (arr: string[]) => {
    return arr
        .map(l =>
            l
                .split("")
                .reverse()
                .map(l => {
                    if (l === ")") {
                        return "(((";
                    } else if (l === "(") {
                        return ")))";
                    } else if (l === "+") {
                        return ")+(";
                    } else if (l === "*") {
                        return "))*((";
                    }
                    return l;
                })
                .join("")
                .replace(/^/, "((")
                .replace(/$/, "))")
        )
        .map(lexQuestion)
        .reduce((acc, cur) => acc + cur);
};

const main = async () => {
    const input = await readInputSplit(path.join(__dirname, "./input.txt"));
    input.pop();

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
