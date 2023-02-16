/*
    Calculate shift table
    ONLY USED TO CALCULATE SHIFT TABLE IN shifts.js
*/

function calc_shifts() {
    const s = {}
    for (var t1 = 0; t1 < 17; t1 ++) {
        for (var t2 = 0; t2 < 17; t2 ++) {
            for (var t3 = 0; t3 < 17; t3 ++) {
                for (var t4 = 0; t4 < 17; t4 ++) {
                    // Gets original row / column

                    const original = (
                        (t1 << 15)
                        + (t2 << 10)
                        + (t3 << 5)
                        + t4
                    )
                    
                    // Calculates merge

                    const data = merge(t1, t2, t3, t4)
                    const row = data[0]
                    const score = data[1]

                    // Converts merged row to 20 bit number

                    const id = (
                        (row[0] << 15)
                        + (row[1] << 10)
                        + (row[2] << 5)
                        + row[3]
                    )

                    // Saves result

                    s[original] = [id, score]
                }
            }
        }
    }
    console.log(JSON.stringify(s))
}

function merge(t1, t2, t3, t4) {
    // Converts to array

    const row = [t1, t2, t3, t4]

    // Processing "stack"

    const p = []

    // Loop

    var score = 0
    for (var t = 3; t >= 0; t --) {
        var tile = row[t]
        if (tile != 0) {
            // Checks stack

            var tile = t
            while (p.length != 0 && row[p[p.length - 1]] == row[tile]) {
                row[p[p.length - 1]] ++
                score += 2 ** row[p[p.length - 1]]
                row[tile] = 0
                tile = p[p.length - 1]
                p.pop()
            }

            // Adds current element to stack

            p.push(t)
        }
    }

    // Resets stack

    p.length = 0

    // Loop again (I really was lazy and didn't want to debug and this part doesn't need to be too efficient anyways so I just pasted it again)

    for (var t = 3; t >= 0; t --) {
        var tile = row[t]
        if (tile != 0) {
            // Checks stack

            var tile = t
            while (p.length != 0 && row[p[p.length - 1]] == row[tile]) {
                row[p[p.length - 1]] ++
                score += 2 ** row[p[p.length - 1]]
                row[tile] = 0
                tile = p[p.length - 1]
                p.pop()
            }

            // Adds current element to stack

            p.push(t)
        }
    }

    // Gets rid of spaces

    while (row.includes(0)) {
        row.splice(row.indexOf(0), 1)
    }
    const a = 4 - row.length
    for (var s = 0; s < a; s ++) {
        row.unshift(0)
    }

    // Merge done

    return [row, score]
}

/*
    Calcluate heuristics table
    ONLY USED TO CALCULATE EVAL TABLE IN score.js
*/

function calc_evals() {
    const e = {}
    for (var t1 = 0; t1 < 17; t1 ++) {
        for (var t2 = 0; t2 < 17; t2 ++) {
            for (var t3 = 0; t3 < 17; t3 ++) {
                for (var t4 = 0; t4 < 17; t4 ++) {
                    const board = (t1 << 15) + (t2 << 10) + (t3 << 5) + t4
                    e[board] = heuristic([t1, t2, t3, t4])
                }
            }
        }
    }
    console.log(JSON.stringify(e))
}

function heuristic(tiles) {
    // Takes the average of all heuristics

    return Math.round((open_squares(tiles) + mono(tiles) + near_edge(tiles) + smooth(tiles) + gain(tiles)) / 5)
}

function open_squares(tiles) {
    // Simple heuristic for open squares

    var score = 0
    for (var t = 0; t < tiles.length; t ++) {
        if (tiles[t] == 0) {
            score += 10
        }
    }
    return score
}

function mono(tiles) {
    // Heuristic for monotonicity

    var inc = 100
    var dec = 100

    // Increasing and decreasing monotonicity

    for (var t = 1; t < 4; t ++) {
        if (tiles[t] < tiles[t - 1]) {
            inc -= 30
        } else if (tiles[t] > tiles[t - 1]) {
            dec -= 30
        }
    }

    // Take the max

    return Math.max(0, inc, dec)
}

function near_edge(tiles) {
    // Heuristic for larger tiles near the edge

    const max = Math.max.apply(null, tiles)
    if (tiles[0] == max || tiles[3] == max) {
        return 40
    } else {
        return 0
    }
}

function smooth(tiles) {
    // Heuristic for smoothness

    var score = 0
    for (var t = 1; t < 4; t ++) {
        if (tiles[t] == tiles[t - 1]) {
            score += 15
        }
    }

    return score
}

function gain(tiles) {
    // Heuristic for score gain

    const state = (tiles[0] << 15) + (tiles[1] << 10) + (tiles[2] << 5) + tiles[3]
    const gain = shifts[state][1]

    // "Formula"

    return gain * 10
}