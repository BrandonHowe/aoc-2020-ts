import * as path from "path";
import { displayGridObjConfig } from "../helpers/displayGrid";
import { readInputSplit } from "../helpers/readInput";

const getNewValForCell = (arr: string[][], y: number, x: number) => {
    const cell = arr[y][x];
    const adjL = arr[y][x - 1];
    const adjR = arr[y][x + 1];
    const adjU = arr[y - 1] && arr[y - 1][x];
    const adjD = arr[y + 1] && arr[y + 1][x];
    const adjUL = arr[y - 1] && arr[y - 1][x - 1];
    const adjUR = arr[y - 1] && arr[y - 1][x + 1];
    const adjDL = arr[y + 1] && arr[y + 1][x - 1];
    const adjDR = arr[y + 1] && arr[y + 1][x + 1];
    const neighbors = [adjL, adjR, adjU, adjD, adjUL, adjUR, adjDL, adjDR].map(
        l => l === "#"
    );
    if (cell === "L" && neighbors.filter(l => !!l).length === 0) {
        return "#";
    } else if (cell === "#" && neighbors.filter(l => !!l).length >= 4) {
        return "L";
    }
    return cell;
};

const iterateBoardOnce = (board: string[][]) => {
    return board.map((l, idx) =>
        l.map((_, idx2) => getNewValForCell(board, idx, idx2))
    );
};

const boardsEqual = (board: string[][], arr: string[][]) => {
    for (const i in board) {
        for (const j in board[i]) {
            if (board[i][j] !== arr[i][j]) {
                return false;
            }
        }
    }
    return true;
};

const part1 = (arr: string[][]) => {
    let lastBoard = arr;
    let currBoard = iterateBoardOnce(arr);
    while (!boardsEqual(lastBoard, currBoard)) {
        lastBoard = currBoard;
        currBoard = iterateBoardOnce(currBoard);
    }
    return lastBoard;
};

const getCountFromP1 = (arr: string[][]) => {
    let total = 0;
    for (const thing of arr) {
        for (const blah of thing) {
            if (blah === "#") {
                total++;
            }
        }
    }
    return total;
};

const getNewValForCell2 = (arr: string[][], y: number, x: number) => {
    const cell = arr[y][x];
    const neighbors = getVisibleSeats(arr, y, x);
    if (cell === "L" && neighbors === 0) {
        return "#";
    } else if (cell === "#" && neighbors >= 5) {
        return "L";
    }
    return cell;
};

const iterateBoardOnce2 = (board: string[][]) => {
    return board.map((l, idx) =>
        l.map((_, idx2) => getNewValForCell2(board, idx, idx2))
    );
};

const getVisibleSeats = (arr: string[][], y: number, x: number) => {
    const firstInRow = (str: string[]) => {
        return str.filter(l => l !== ".")[0] || "L";
    }
    const cell = arr[y][x];
    const lSeats = arr[y].filter((_, idx) => idx < x).reverse();
    const rSeats = arr[y].filter((_, idx) => idx > x);
    const uSeats = arr
        .map(l => l[x])
        .filter((_, idx) => idx < y)
        .reverse();
    const dSeats = arr.map(l => l[x]).filter((_, idx) => idx > y);
    const ulSeats = arr
        .map((l, idx) => l[idx - y + x])
        .filter((_, idx) => idx < y)
        .reverse();
    const drSeats = arr.map((l, idx) => l[idx - y + x]).filter((_, idx) => idx > y);
    const urSeats = arr
        .map((l, idx) => l[y - idx + x])
        .filter((_, idx) => idx < y)
        .reverse();
    const dlSeats = arr
        .map((l, idx) => l[y - idx + x])
        .filter((_, idx) => idx > y);
    return [
        lSeats,
        rSeats,
        uSeats,
        dSeats,
        ulSeats,
        drSeats,
        urSeats,
        dlSeats
    ].filter(l => firstInRow(l) !== "L").length;
};

const part2 = (arr: string[][]) => {
    let lastBoard = arr;
    let currBoard = iterateBoardOnce2(arr);
    let iterCount = 0;
    while (!boardsEqual(lastBoard, currBoard)) {
        iterCount++;
        lastBoard = currBoard;
        currBoard = iterateBoardOnce2(currBoard);
    }
    return lastBoard;
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    raw.pop();
    const input = raw.map(l => l.split(""));

    console.time("part1");

    console.log(getCountFromP1(part1(input)));

    console.timeEnd("part1");

    console.time("part2");

    console.log(getCountFromP1(part2(input))); // WARNING: VERY SLOW

    console.timeEnd("part2");
};

main();
