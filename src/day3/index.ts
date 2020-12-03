import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const getTreesFromSlope = (slope: number[], board: string[][]) => {
    const location = [0, 0];

    let trees = 0;

    while (location[1] < board.length) {
        location[0] += slope[0];
        location[1] += slope[1];
        if (
            board[location[1]] &&
            board[location[1]][location[0] % board[0].length] === "#"
        ) {
            trees++;
        }
    }

    return trees;
};

const main = async () => {
    const input = await (
        await readInputSplit(path.join(__dirname, "./input.txt"))
    ).map(l => l.split(""));

    console.time("main");

    console.log("Part 1:", getTreesFromSlope([3, 1], input));

    console.log(
        "Part 2:",
        [
            [1, 1],
            [3, 1],
            [5, 1],
            [7, 1],
            [1, 2]
        ]
            .map(l => getTreesFromSlope(l, input))
            .reduce((acc, cur) => acc * cur)
    );

    console.timeEnd("main");
};

main();
