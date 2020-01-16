$(() => {

    // Remplissage des inputs avec des Fakers
    $('#boardColumns').val(getRandomInt(6, 18))
    $('#boardLines').val(getRandomInt(6, 18))
    $('#roundToWin').val(getRandomInt(2, 6))
    $('#player1Name').val(faker.name.findName())
    $('#player2Name').val(faker.name.findName())

    // Editer l'affichage on documentload & on change
    $('#boardColumns').on('change', () => { $('#boardColumnsValue').text('(' + $('#boardColumns').val() + ')') })
    $('#boardColumnsValue').text('(' + $('#boardColumns').val() + ')')

    $('#boardLines').on('change', () => { $('#boardLinesValue').text('(' + $('#boardLines').val() + ')') })
    $('#boardLinesValue').text('(' + $('#boardLines').val() + ')')

    $('#discNumberToWin').on('change', () => { $('#discNumberToWinValue').text('(' + $('#discNumberToWin').val() + ')') })
    $('#discNumberToWinValue').text('(' + $('#roundToWin').val() + ')')

    $('#roundToWin').on('change', () => { $('#roundToWinValue').text('(' + $('#roundToWin').val() + ')') })
    $('#roundToWinValue').text('(' + $('#roundToWin').val() + ')')

    // Lancer une partie rapide
    $('#goFast').on('click', () => {
        connect4 = new Game(7, 6, 4, 4, "medium", "Computer");
    })

    // Afficher les parametres pour une partie personnalisée
    $('#showSettings').on('click', () => {
        $('#gameSettings').slideToggle()
    })
    // Lancer une partie personnalisée
    $('#goCustom').on('click', () => {
        $('#gameSettings').slideToggle()
        boardColumns = $('#boardColumns').val()
        boardLines = $('#boardLines').val()
        discNumberToWin = $('#discNumberToWin').val()
        roundToWin = $('#roundToWin').val()
        roundDifficulty = $('#roundDifficulty').val()
        boardMode = $('#boardMode').val()

        connect4 = new Game(boardColumns, boardLines, discNumberToWin, roundToWin, roundDifficulty, boardMode);
    })


})

getRandomInt = (min, max) => { return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min); }



