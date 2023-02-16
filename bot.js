/*
    Everything in this file is optimized so ugly code
    TODO: transposition table maybe?
*/

function calc_move(board, max_depth) {
    const depth = calc_depth(board, max_depth)
    console.log("depth", depth)
    let pu = process([shift_up(board)], depth)
    let pr = process([shift_up(board)], depth)
    let pd = process([shift_up(board)], depth)
    let pl = process([shift_up(board)], depth)
    let max = grade(grade(grade(grade([0, Math.floor(Math.random() * 4)], pu), pr), pd), pl)
    return max[1]
}

function process(p, depth) {
    for (var m = 0; m < depth; m ++) {
        let sts = p.length
        for (var s = 0; s < sts; s ++) {
            for (var x = 0n; x < 80n; x += 5n) {
                if (((p[0] >> x) & 0b11111n) == 0n) {
                    p.push(p[0] + (2n << x))
                }
            }
            p.shift()
        }
        sts = p.length
        for (var s = 0; s < sts; s ++) {
            let state = p[0]
            let up = shift_up(state)
            let right = shift_right(state)
            let down = shift_down(state)
            let left = shift_left(state)
            if (up != state) {
                p.push(up)
            }
            if (right != state) {
                p.push(right)
            }
            if (down != state) {
                p.push(down)
            }
            if (left != state) {
                p.push(left)
            }
            p.shift()
        }
    }
    return p
}

function calc_depth(board, max_depth) {
    let empty = 0
    for (var s = 0n; s < 80n; s += 5n) {
        if (((board >> s) & 0b11111n) == 0) {
            empty ++
        }
    }
    let b = 0
    if (shift_up(board) != board) {
        b ++
    }
    if (shift_right(board) != board) {
        b ++
    }
    if (shift_down(board) != board) {
        b ++
    }
    if (shift_left(board) != board) {
        b ++
    }
    let a
    if (empty > 4) {
        a = 1.8
    } else {
        switch (b) {
            case 4:
                a = 4
                break
            case 3:
                a = 3
                break
            case 2:
                a = 2.6
                break
            case 1:
                a = 2.4
                break
            case 0:
                a = 0
                break
        }
    }
    b *= a
    for (var d = 1; d <= max_depth; d ++) {
        if ((Math.round(b * empty * 10) / 10) ** d > 200000) {
            return d - 2
        }
    }
    return max_depth - 1
}

function shift_up(board) {
    for (var s = 0n; s < 20n; s += 5n) {
        const column = gc(board, s)
        board = sc(board, s, BigInt(column), BigInt(rvse(shifts[rvse(column)][0])))
    }
    return board
}

function shift_right(board) {
    for (var r = 0n; r < 80n; r += 20n) {
        const row = gr(board, r)
        board = sr(board, r, BigInt(row), BigInt(shifts[row][0]))
    }
    return board
}

function shift_down(board) {
    for (var s = 0n; s < 20n; s += 5n) {
        const column = gc(board, s)
        board = sc(board, s, BigInt(column), BigInt(shifts[column][0]))
    }
    return board
}

function shift_left(board) {
    for (var r = 0n; r < 80n; r += 20n) {
        const row = gr(board, r)
        board = sr(board, r, BigInt(row), BigInt(rvse(shifts[rvse(row)][0])))
    }
    return board
}

function gc(board, shift) {
    return Number((((board >> (60n + shift)) & 0b11111n) << 15n) + (((board >> (40n + shift)) & 0b11111n) << 10n) + (((board >> (20n + shift)) & 0b11111n) << 5n) + ((board >> shift) & 0b11111n))
}

function gr(board, row) {
    return Number((board >> row) & 0b11111111111111111111n)
}

function rvse(query) {
    return (((query & 0b11111) << 15) + (((query >> 5) & 0b11111) << 10) + (((query >> 10) & 0b11111) << 5) + ((query >> 15) & 0b11111))
}

function sc(board, shift, original, result) {
    board -= ((original >> 15n) & 0b11111n) << (60n + shift)
    board -= ((original >> 10n) & 0b11111n) << (40n + shift)
    board -= ((original >> 5n) & 0b11111n) << (20n + shift)
    board -= (original & 0b11111n) << shift
    board += ((result >> 15n) & 0b11111n) << (60n + shift)
    board += ((result >> 10n) & 0b11111n) << (40n + shift)
    board += ((result >> 5n) & 0b11111n) << (20n + shift)
    board += (result & 0b11111n) << shift
    return board
}

function sr(board, row, original, result) {
    board -= original << row
    board += result << row
    return board
}

function grade(max, p) {
    for (var s = 0; s < p.length; s ++) {
        let state = p[s]
        let score = 0
        for (var shift = 0n; shift < 4n; shift += 1n) {
            score + scores[gr(state, shift)]
            score += scores[gc(state, 5n * shift)]
        }
        if (score > max[0]) {
            max[0] = score
            max[1] = 0
        }
    }
    return max
}

function get_score(board) {
    var e = 0
    for (var s = 0n; s < 20n; s += 5n) {
        e += Math.floor(Math.random() * 1000)
        // e += score[gc(board, s)]
    }
    for (var r = 0n; s < 80n; s += 20n) {
        e += Math.floor(Math.random() * 1000)
        // e += score[gr(board, r)]
    }
    return e
}