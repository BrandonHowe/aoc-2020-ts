import * as path from "path";
import { readInputSplitNum } from "../helpers/readInput";

const main = async () => {
    const input = await readInputSplitNum(path.join(__dirname, "./input.txt"));

    console.time("main");

    console.timeEnd("main");
};

main();
