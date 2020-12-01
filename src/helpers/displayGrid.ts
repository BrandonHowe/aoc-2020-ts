type Indexable = string | number;

export const displayGridObjConfig = <T extends Indexable>(
    grid: T[][],
    replacer: Record<T, string> = {} as Record<T, string>
) => {
    return grid.reduce(
        (acc, cur) =>
            acc +
            cur.reduce(
                (acc, cur) => acc + (replacer[cur] || cur).toString(),
                ""
            ) +
            "\n",
        ""
    );
};

export const displayGridFuncConfig = <T extends Indexable>(
    grid: T[][],
    replacer: (val: T) => string | undefined = (v: T) => v.toString()
) => {
    return grid.reduce(
        (acc, cur) =>
            acc +
            cur.reduce(
                (acc, cur) => acc + (replacer(cur) || cur).toString(),
                ""
            ) +
            "\n",
        ""
    );
};
