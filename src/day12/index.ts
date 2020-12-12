import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const part1 = (arr: [string, number][]) => {
    const startingPos = [0, 0];
    let direction = 1;
    arr.map(l => {
        switch (l[0]) {
            case "N":
                startingPos[1] += l[1];
                break;
            case "E":
                startingPos[0] += l[1];
                break;
            case "S":
                startingPos[1] -= l[1];
                break;
            case "W":
                startingPos[0] -= l[1];
                break;
            case "F":
                switch (direction) {
                    case 0:
                        startingPos[1] += l[1];
                        break;
                    case 1:
                        startingPos[0] += l[1];
                        break;
                    case 2:
                        startingPos[1] -= l[1];
                        break;
                    case 3:
                        startingPos[0] -= l[1];
                        break;
                }
                break;
            case "R":
                direction = (direction + Math.floor(l[1] / 90)) % 4;
                break;
            case "L":
                direction = (direction + 4 - Math.floor(l[1] / 90)) % 4;
                break;
        }
    });
    return Math.abs(startingPos[0]) + Math.abs(startingPos[1]);
};

const part2 = (arr: [string, number][]) => {
    const waypoint = [10, 1];
    const startingPos = [0, 0];
    arr.map(l => {
        switch (l[0]) {
            case "N":
                waypoint[1] += l[1];
                break;
            case "E":
                waypoint[0] += l[1];
                break;
            case "S":
                waypoint[1] -= l[1];
                break;
            case "W":
                waypoint[0] -= l[1];
                break;
            case "F":
                for (let i = 0; i < l[1]; i++) {
                    startingPos[0] += waypoint[0];
                    startingPos[1] += waypoint[1];
                }
                break;
            case "R":
                for (let i = 0; i < l[1] / 90; i++) {
                    const [nw1, nw0] = waypoint;
                    waypoint[0] = nw0;
                    waypoint[1] = nw1 * -1;
                }
                break;
            case "L":
                for (let i = 0; i < l[1] / 90; i++) {
                    const [nw1, nw0] = waypoint;
                    waypoint[0] = nw0 * -1;
                    waypoint[1] = nw1;
                }
                break;
        }
    });
    return Math.abs(startingPos[0]) + Math.abs(startingPos[1]);
};

const main = async () => {
    const input: [string, number][] = await (
        await readInputSplit(path.join(__dirname, "./input.txt"))
    ).map(l => [l.charAt(0), Number(l.slice(1))]);
    input.pop();

    console.time("part1");

    console.log("Part 1:", part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log("Part 2:", part2(input));

    console.timeEnd("part2");
};

main();
