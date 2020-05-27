document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div')) // squares is made by small div contains in a grid div
    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')
    const width = 10

//     The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    let currentPosition = 4
    let currentRotation = 0
    // select a tetrominoes randomly and it's first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length)

    // the tetrominoes shape drawing at realtime
    let current = theTetrominoes[random][currentRotation]

    // draw the first rotation in the first tetromino
    function draw() {
        current.forEach(index => {
            // start drawing shape at the currentPosition (fourth) div incremented by values present in the tetrominoes array
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    // make the tetromino move down every second
    timerId = setInterval(moveDown, 1000)

    // assign function to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }

    // event happens when we press key
    document.addEventListener('keyup', control)

    // the Tetrominoes is moving from up to bottom
    function moveDown() {
        undraw() // undraw the shape from it's current position
        currentPosition += width // add a whole width
        draw() // draw it again in a new position
        freeze()
    }

    // freeze the tetromino when it get to the bottom
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            // when the previous tetrominoes hit the bottom of hit another tetrominoes start a new tetromino falling

            random = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
        }
    }

    // move the tetromino left,  unless (à moins que) is at the edge or there is a blockage
    function moveLeft() {
        undraw()
        // if one of the theTrominoes square is in a square that has index of 10 (don't forget that tetrominoes are moving in along small square formed by div in html )
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1
        // we want our tetrominoes to stop if there is another tetromino already there that has been frozen , we want to do that for every index in our tetrominoes shape

        // current.forEach(index => console.log(index,squares[currentPosition+index]))
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    // move the tetromino right , unless is at the edge or there is a blockage
    function moveRight() {
        undraw() // to undraw previous shape when pressing on the right key to move the shape
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

})