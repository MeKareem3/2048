// Interval

var bot_interval = {active: false}

function interval(action, time) {
    var i = function(time) {
        return function() {
            try {
                action()
            }
            catch (error) {
                throw error
            }
            if (bot_interval && bot_interval.active) {
                setTimeout(i, time)
            }
        }
    }(time)
    setTimeout(i, time)
}

// Loaded

document.addEventListener("DOMContentLoaded", function() {
    // Variables

    var random
    var depth

    // Elements

    const config_button = document.getElementById("bot_config")

    const bot_window = document.getElementById("bot_window")
    const rand_word = document.getElementById("rand_word")
    const rand_toggle = document.getElementById("rand_toggle")
    const rand_check = document.getElementById("r_check")

    const randbot_word = document.getElementById("rand_bot")
    const randbot_toggle = document.getElementById("randbot_toggle")
    const randbot_check = document.getElementById("b_check")

    const depth_control = document.getElementById("depth")
    const depth_input = document.getElementById("depth_input")

    const start_bot = document.getElementById("start_bot")

    // Bot config listeners

    config_button.addEventListener("click", function(event) {
        if (event.isTrusted) {
            if (bot_window.style.display == "block") {
                bot_window.style.display = "none"
            } else {
                bot_window.style.display = "block"
            }
        }
    })

    rand_check.addEventListener("change", function(event) {
        if (event.isTrusted) {
            if (rand_check.checked) {
                // Deactivates stuff

                depth_control.style.opacity = 0.5
                depth_control.style.pointerEvents = "none"

                randbot_word.style.opacity = 0.5
                randbot_toggle.style.opacity = 0.5
                randbot_toggle.style.pointerEvents = "none"
            } else {
                // Activates stuff

                depth_control.style.opacity = 1
                depth_control.style.pointerEvents = "auto"

                randbot_word.style.opacity = 1
                randbot_toggle.style.opacity = 1
                randbot_toggle.style.pointerEvents = "auto"
            }
        }
    })

    randbot_check.addEventListener("change", function(event) {
        if (event.isTrusted) {
            if (randbot_check.checked) {
                // Deactivates stuff

                depth_control.style.opacity = 0.5
                depth_control.style.pointerEvents = "none"

                rand_word.style.opacity = 0.5
                rand_toggle.style.opacity = 0.5
                rand_toggle.style.pointerEvents = "none"
            } else {
                // Activates stuff

                depth_control.style.opacity = 1
                depth_control.style.pointerEvents = "auto"

                rand_word.style.opacity = 1
                rand_toggle.style.opacity = 1
                rand_toggle.style.pointerEvents = "auto"
            }
        }
    })

    depth_input.addEventListener("keypress", function(event) {
        if (!/[1-5]/.test(event.key) || depth_input.value.length >= 1) {
            event.preventDefault()
        }
    })

    start_bot.addEventListener("click", function(event) {
        if (event.isTrusted) {
            // Gets data

            const random = rand_check.checked
            const randbot = randbot_check.checked
            const depth = parseInt(depth_input.value)

            if (random || randbot || depth) {
                // Hides bot control

                config_button.style.display = "none"
                config_button.style.pointerEvents = "none"
                bot_window.style.display = "none"

                // Turns off player controls

                control = false

                // Starts bot

                bot(random, randbot, depth)
            }
        }
    })
})

function bot(random, randbot, depth) {
    bot_interval.active = true
    if (random) {
        // Random moves (150 ms)

        interval(function() {
            move(Math.floor(Math.random() * 4))
        }, 150)
    } else if (randbot) {
        // Randbot algorithm (200 ms)

        interval(function() {
            move(rand_bot(game_state))
        }, 200)
    } else {
        // Tree search (200 ms)

        interval(function() {
            move(calc_move(game_state, depth))
        }, 200)
    }
}