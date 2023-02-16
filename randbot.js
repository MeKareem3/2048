/*
    All functions defined in this file are optimized so ugly code

    Simulates random games and takes total of all scores
    Picks starting move with highest score
*/

const sims = 30
const sim_depth = 60

function rand_bot(state) {
    const scores = [[0, 0], [0, 1], [0, 2], [0, 3]]
    const up_state = shift_up(state)
    const right_state = shift_right(state)
    const down_state = shift_down(state)
    const left_state = shift_left(state)
    for (var s = 0; s < sims; s ++) {
        scores[0][0] += sim(up_state)
        scores[1][0] += sim(right_state)
        scores[2][0] += sim(down_state)
        scores[3][0] += sim(left_state)
    }
    scores.sort(scores_comp)
    const shifts = [shift_up, shift_right, shift_down, shift_left]
    for (var m = 0; m < 4; m ++) {
        if (shifts[scores[m][1]](state) != state) {
            return scores[m][1]
        }
    }
}

function sim(state) {
    const moves = [move_up, move_right, move_down, move_left]
    var score = 0
    for (var m = 0; m < sim_depth; m ++) {
        const result = moves[Math.floor(Math.random() * 4)](state, score)
        state = result[0]
        score = result[1]
        state = rt(state)
    }
    return score
}

function rt(state) {
    const empty = []
    for (var p = 0n; p < 80n; p += 5n) {
        if (((state >> p) & 0b11111n) == 0n) {
            empty.push(p)
        }
    }
    if (empty.length) {
        state += BigInt(Math.random() < 0.9 ? 1 : 2) << empty[Math.floor(Math.random() * empty.length)]
    }
    return state
}

function scores_comp(a, b) {
    return (a[0] < b[0]) ? -1 : 1
}