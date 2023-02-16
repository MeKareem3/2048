var game_state = 0n
var score = 0
var highscore = 0
var control = true

function random_tile() {
    // Generates random tile

    const tile = Math.random() < 0.9 ? 1 : 2

    // Gets empty positions

    const empty = []
    for (var p = 0n; p < 80n; p += 5n) {
        if (((game_state >> p) & 0b11111n) == 0n) {
            empty.push(p)
        }
    }

    // Picks a random position

    const pos = empty[Math.floor(Math.random() * empty.length)]
    game_state += BigInt(tile) << pos
}

function update_game() {
    // Clears existing board

    clear_board()

    // Look at every tile

    for (var s = 0; s < 16; s ++) {
        // Gets tile value (n in 2 ^ n) with special binary system (no 2 ^ 0 as 1 does not exist in the game)

        var tile = Number(((game_state >> BigInt(5 * s)) & 0b11111n))

        // Renders tile value

        if (tile != 0) {
            render_tile(s, tile)
        }
    }

    // Score and highscore

    const score_value = document.getElementById("score_value")
    score_value.innerText = score
    if (score > highscore) {
        highscore = score
        const highscore_value = document.getElementById("highscore_value")
        highscore_value.innerText = highscore
    }
}

function clear_board() {
    // Tile div

    const tiles = document.getElementById("tiles")

    // Deletes all children

    while (tiles.firstChild) {
        tiles.removeChild(tiles.firstChild)
    }
}

function render_tile(pos, value) {
    // Gets position of tile

    const r = 3 - Math.floor(pos / 4)
    const c = 3 - pos % 4

    // Creates tile element

    const tile = document.createElement("div")
    tile.className = `tile p${value} r${r} c${c}`
    tile.innerText = 2 ** value

    // Appends element

    const tiles = document.getElementById("tiles")
    tiles.appendChild(tile)
}

function move(direction) {
    // Move result

    var data

    // Try move

    if (direction == 0) {
        // Up

        data = move_up(game_state, score)
    } else if (direction == 1) {
        // Right

        data = move_right(game_state, score)
    } else if (direction == 2) {
        // Down

        data = move_down(game_state, score)
    } else if (direction == 3) {
        // Left

        data = move_left(game_state, score)
    }

    // Updates board

    if (data[0] != game_state) {
        game_state = data[0]
        score = data[1]
        random_tile()
        update_game()
    }

    // Check if dead

    if (no_moves(game_state)) {
        game_over()
    }
}

function move_up(board, score) {
    for (var s = 15n; s >= 0n; s -= 5n) {
        // Gets column

        const column = get_column(board, s)

        // Gets data

        const data = get_shift(reverse(column))
        const result = reverse(data[0])
        const score_add = data[1]

        // Checks if update necessary

        if (column != result) {
            // Sets column

            board = set_column(board, s, BigInt(column), BigInt(result))

            // Updates score

            score += score_add
        }
    }

    return [board, score]
}

function move_right(board, score) {
    for (var r = 3n; r >= 0n; r -= 1n) {
        // Gets row

        const row = get_row(board, r)
    
        // Gets data

        const data = get_shift(row)
        const result = data[0]
        const score_add = data[1]

        // Checks if update necessary

        if (row != result) {
            // Sets row

            board = set_row(board, r, BigInt(row), BigInt(result))

            // Updates score

            score += score_add
        }
    }

    return [board, score]
}

function move_down(board, score) {
    for (var s = 15n; s >= 0n; s -= 5n) {
        // Gets column

        const column = get_column(board, s)

        // Gets data

        const data = get_shift(column)
        const result = data[0]
        const score_add = data[1]

        // Checks if update necessary

        if (column != result) {
            // Sets column

            board = set_column(board, s, BigInt(column), BigInt(result))

            // Updates score

            score += score_add
        }
    }

    return [board, score]
}

function move_left(board, score) {
    for (var r = 3n; r >= 0n; r -= 1n) {
        // Gets row

        var row = get_row(board, r)

        // Gets data

        const data = get_shift(reverse(row))
        const result = reverse(data[0])
        const score_add = data[1]

        // Checks if update necessary

        if (row != result) {
            // Sets row

            board = set_row(board, r, BigInt(row), BigInt(result))

            // Updates score

            score += score_add
        }
    }

    return [board, score]
}

function get_column(board, shift) {
    return Number(
        (((board >> (60n + shift)) & 0b11111n) << 15n)
        + (((board >> (40n + shift)) & 0b11111n) << 10n)
        + (((board >> (20n + shift)) & 0b11111n) << 5n)
        + ((board >> shift) & 0b11111n)
    )
}

function get_row(board, row) {
    return Number((board >> (20n * row)) & 0b11111111111111111111n)
}

function reverse(query) {
    // Gets tiles

    const t1 = (query >> 15) & 0b11111
    const t2 = (query >> 10) & 0b11111
    const t3 = (query >> 5) & 0b11111
    const t4 = query & 0b11111

    // Converts reversed tiles back to number

    return (
        (t4 << 15)
        + (t3 << 10)
        + (t2 << 5)
        + t1
    )
}

function get_shift(query) {
    // Lookup result

    const data = shifts[query]
    const shift = data[0]
    const score_add = data[1]

    // Data

    return [shift, score_add]
}

function set_column(board, shift, original, result) {
    // Breaks up original into tiles

    const o1 = (original >> 15n) & 0b11111n
    const o2 = (original >> 10n) & 0b11111n
    const o3 = (original >> 5n) & 0b11111n
    const o4 = original & 0b11111n

    // Breaks up result into tiles

    const r1 = (result >> 15n) & 0b11111n
    const r2 = (result >> 10n) & 0b11111n
    const r3 = (result >> 5n) & 0b11111n
    const r4 = result & 0b11111n

    // Subtracts original from board

    board -= o1 << (60n + shift)
    board -= o2 << (40n + shift)
    board -= o3 << (20n + shift)
    board -= o4 << shift

    // Adds result to board

    board += r1 << (60n + shift)
    board += r2 << (40n + shift)
    board += r3 << (20n + shift)
    board += r4 << shift

    // Board done

    return board
}

function set_row(board, row, original, result) {
    board -= original << (20n * row)
    board += result << (20n * row)
    return board
}

function no_moves(board) {
    return (check_full(board) && move_up(board)[0] == board && move_right(board)[0] == board && move_down(board)[0] == board && move_left(board)[0] == board)
}

function check_full(board) {
    for (var s = 0n; s < 80n; s += 5n) {
        if (((board >> s) & 0b11111n) == 0n) {
            return false
        }
    }
    return true
}

function game_over() {
    // Turns off bot

    bot_interval.active = false

    // Variables

    control = false
    over = true

    // Displays div

    const gameover = document.getElementById("game_over")
    gameover.style.opacity = 1
}

document.addEventListener("DOMContentLoaded", function() {
    // Adds event listeners

    const new_game = document.getElementById("new_game")
    new_game.addEventListener("click", function() {
        // Hides game over

        const gameover = document.getElementById("game_over")
        gameover.style.opacity = 0

        // Resets bot stuff

        bot_interval.active = false
        const bot_button = document.getElementById("bot_config")
        bot_button.style.display = "block"
        bot_button.style.pointerEvents = "auto"

        // Resets stuff

        game_state = 0n
        score = 0
        control = true
        update_game()

        // Generates 2 random tiles

        random_tile()
        random_tile()

        // Displays board

        update_game()
    })

    document.addEventListener("keydown", function(event) {
        if (control && event.isTrusted && !event.repeat && !event.path.includes(document.getElementById("bot_window"))) {
            // Moves tiles on board

            const code = event.keyCode
            if (code == 87 || code == 38) {
                // Up

                move(0)
            } else if (code == 68 || code == 39) {
                // Right

                move(1)
            } else if (code == 83 || code == 40) {
                // Down

                move(2)
            } else if (code == 65 || code == 37) {
                // Left

                move(3)
            }
        }
    })

    // Starts new game

    random_tile()
    random_tile()
    update_game()
})