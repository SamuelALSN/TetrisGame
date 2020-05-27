document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div')) // squares is made by small div contains in a grid div
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        '#FF6392',
        '#F9F9F9',
        '#FFE45E',
        '#ff6b6b',
        '#c4452e',
    ]
//     The Tetrominoes with all of their shape when we rotate bundled in array of array

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
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }


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

    // freeze the tetromino when it get to the bottom or at edge of a blockage
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            // when the previous tetrominoes hit the bottom of hit another tetrominoes start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
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

    // rotate a  tetromino
    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) { // if the current rotation gets to 4 (because 4 is the length of a specific tetrominoes) move it back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }


    // show up next Tetromino in mini-gid display

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
    // The Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    // display the shape in the mini-grid display
    function displayShape() {
        // remove any trace  of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })

        // adding tetrominoes in the mini grid
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[random]
        })
    }

    // add functinnality to the button
    startBtn.addEventListener('click', () => {

        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            // make the tetromino move down every second
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    // add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            // i + every square that makes up a row
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squareRemoved = squares.splice(i, width)
               // console.log(squareRemoved)
                squares = squareRemoved.concat(squares)
                squares.forEach( cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }

    }
})