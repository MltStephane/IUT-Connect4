

class Game {





    /**
     *Creates an instance of Game.
     * @param {*} boardColumns
     * @param {*} boardLines
     * @param {*} discNumberToWin
     * @param {*} roundNumber
     * @param {*} roundDifficulty
     * @param {*} boardMode
     * @memberof Game
     */
    constructor(boardColumns, boardLines, discNumberToWin, roundNumber, roundDifficulty, boardMode) {
        this.boardColumns = boardColumns || 7
        this.boardLines = boardLines || 6
        this.discNumberToWin = discNumberToWin || 4
        this.roundNumber = roundNumber || 4
        this.roundDifficulty = roundDifficulty || 'medium'
        this.boardMode = boardMode || 'Computer'

        this.gamePlayer1 = new Player(1, this, 'Player')
        this.gamePlayer2 = new Player(2, this, this.boardMode == 'Computer' ? 'Computer' : 'Player')

        this.DB_players = []
        this.DB_games = []

        this.board = new Array()

        this.roundActual = 1
        this.playerActual = 1



        this.debug()

        $('#more').show(300)
        $('#header').slideUp()
        this.displayBoard()
        this.attachEvent(true)
        this.displayInformations('reinit')
        this.displayInformations('playerTurn')
    }



    DB_getPlayers() {
        if (JSON.parse(sessionStorage.getItem("players"))) {
            return JSON.parse(sessionStorage.getItem("players"))
        }
    }

    DB_setPlayer(player) {
        var data = JSON.parse(sessionStorage.getItem("players"))
        data.push([player]);
        sessionStorage.setItem("players", JSON.stringify(data))
    }

    DB_getGames() {
        if (JSON.parse(sessionStorage.getItem("games"))) {
            return JSON.parse(sessionStorage.getItem("games"))
        }
    }

    DB_setGame(winner, loser) {
        var data = JSON.parse(sessionStorage.getItem("games"))
        data.push([{ 'winner': winner, 'loser': loser }]);
        sessionStorage.setItem("games", JSON.stringify(data))
    }

    DB_displayHistoric() {
        this.DB_getGames().foreach(e => { console.log(e) })
    }




    /**
     *Affiche la classe - DEBUG
     *
     * @memberof Game
     */
    debug() {
        console.table(this)
    }


    /**
     *Crée le tableau dynamiquement
     *
     * @memberof Game
     */
    displayBoard() {

        // Suppression du texte initial
        $('#board').html(null)
        $('#informations').html(null)
        $('#player1Win').html(this.gamePlayer1.name + ' : ' + this.gamePlayer1.roundWinned)
        $('#player2Win').html(this.gamePlayer2.name + ' : ' + this.gamePlayer2.roundWinned)
        $('#roundNumber').html('Round : ' + this.roundActual)


        this.board = new Array()

        // Création du tableau qui fait office de plateau
        let a = $(document.createElement('table'))
        for (let i = 0; i < this.boardLines; i++) {
            this.board[i] = new Array()
            let b = $(document.createElement('tr'))
            b.id = 'L' + i
            for (let j = 0; j < this.boardColumns; j++) {
                this.board[i][j] = 0
                let c = $(document.createElement('td'))
                c.attr('id', 'L' + i + 'C' + j)
                b.append(c)
            }
            a.append(b)
        }
        $('#board').append(a)
    }




    /**
     *Lie un evenement aux clics sur les cellules des tableaux
     *
     * @param {*} state
     * @memberof Game
     */
    attachEvent(state) {
        for (let i = 0; i < this.boardLines; i++)
            for (let j = 0; j < this.boardColumns; j++)
                if (state) {
                    $('#L' + i + 'C' + j).on('click', () => { this.makeMove(this.boardLines - 1, j) })
                } else {
                    $('#L' + i + 'C' + j).off('click')
                }
    }



    /**
     *Place un jeton etc..
     *
     * @param {*} boardLine
     * @param {*} boardColumn
     * @memberof Game
     */
    makeMove(boardLine, boardColumn) {
        if (this.playerActual == 2 && this.boardMode == 'Computer') {
            for (let i = this.boardLines - 1; i >= 0; i--) {
                if (this.board[i].includes(0)) {
                    var k = i
                    break
                }
            }
            var l = Math.floor(Math.random() * (Math.floor(this.boardColumns - 1) - Math.ceil(0) + 1)) + Math.ceil(0);
            if   (this.board[k][l] == 0) {

                let caseNow = $('#L' + k + 'C' + l)

                let newDiv = $(document.createElement('div'))
                newDiv.addClass('player')

                caseNow.append(newDiv)

                let newDivBackground = this.playerActual == 1 ? this.gamePlayer1.color : this.gamePlayer2.color
                newDiv.css('background-color', newDivBackground)

                this.board[k][l] = this.playerActual

                console.log(this.checkVictory(k, l))

                this.playerActual = this.playerActual == 1 ? 2 : 1

                this.displayInformations('playerTurn')

                boardLine = -1

            } else {
                this.makeMove(k, l)
            }
        } else {
            while (boardLine > -1) {
                if (this.board[boardLine][boardColumn] == 0) {

                    let caseNow = $('#L' + boardLine + 'C' + boardColumn)

                    let newDiv = $(document.createElement('div'))
                    newDiv.addClass('player')

                    caseNow.append(newDiv)

                    let newDivBackground = this.playerActual == 1 ? this.gamePlayer1.color : this.gamePlayer2.color
                    newDiv.css('background-color', newDivBackground)

                    this.board[boardLine][boardColumn] = this.playerActual

                    console.log(this.checkVictory(boardLine, boardColumn))

                    this.playerActual = this.playerActual == 1 ? 2 : 1

                    this.displayInformations('playerTurn')

                    boardLine = -1
                    setTimeout(() => { this.makeMove(0, 0) }, 250)


                } else {
                    boardLine--
                }
            }
        }
    }



    /**
     *TODO
     *
     * @memberof Game
     */
    computerTurn() {
        let boardLine = this.boardLines
        for (let i = 0; i < this.boardColumns; i++) {
            while (boardLine > -1) {
                if (this.board[boardLine][i] == 0) {

                    console.log(this.checkVictory())

                } else {
                }
            }
        }
    }



    /**
     *Vérifie la victoire
     *
     * @param {*} boardLine
     * @param {*} boardColumn
     * @returns
     * @memberof Game
     */
    checkVictory(boardLine, boardColumn) {

        // Check if it's even possible to play
        for (let i = this.boardLine - 1; i >= 0; i--) {
            if (!this.board[boardLine].includes(0)) {
                return 'GameCantContinue'
            }
        }

        // Check if someone win on a horizontal direction 
        let countLine = 0
        let OOR_H = 0
        while (OOR_H < this.boardColumns) {
            if (this.board[boardLine][OOR_H] === this.playerActual) {
                countLine++
                OOR_H++
            } else if (this.board[boardLine][OOR_H] !== this.playerActual && countLine == this.discNumberToWin) {
                OOR_H++
            } else {
                countLine = 0
                OOR_H++
            }
        }

        // Check if someone win on a vertical direction 
        let countColumn = 0
        let OOR_V = 0
        while (OOR_V < this.boardLines) {
            if (this.board[OOR_V][boardColumn] === this.playerActual) {
                countColumn++
                OOR_V++
            } else if (this.board[OOR_V][boardColumn] !== this.playerActual && countColumn == this.discNumberToWin) {
                OOR_V++
            } else {
                countColumn = 0
                OOR_V++
            }
        }

        // Check if someone win on a diagonal direction 
        let countDiag = 0
        let OOR_D = -Math.min(boardLine, boardColumn)
        while (boardLine + OOR_D < this.boardLines && boardColumn + OOR_D < this.boardColumns && boardLine + OOR_D >= 0 && boardColumn + OOR_D >= 0) {
            if (this.board[boardLine + OOR_D][boardColumn + OOR_D] === this.playerActual) {
                countDiag++
                OOR_D++
            } else if (this.board[boardLine + OOR_D][boardColumn + OOR_D] !== this.playerActual && countDiag == this.discNumberToWin) {
                OOR_D++
            } else {
                countDiag = 0
                OOR_D++
            }
        }

        // Check if someone win on a anti-diagonal direction 
        let countAntiDiag = 0
        let OOR_AD = -Math.min(boardLine, this.boardColumns - 1 - boardColumn)
        while (boardLine + OOR_AD < this.boardLines && boardColumn - OOR_AD < this.boardColumns && boardLine + OOR_AD >= 0 && boardColumn - OOR_AD >= 0) {
            if (this.board[boardLine + OOR_AD][boardColumn - OOR_AD] === this.playerActual) {
                countAntiDiag++
                OOR_AD++
            } else if (this.board[boardLine + OOR_AD][boardColumn - OOR_AD] !== this.playerActual && countAntiDiag == this.discNumberToWin) {
                OOR_AD++
            } else {
                countAntiDiag = 0
                OOR_AD++
            }
        }


        // Return the winner
        if (countLine >= this.discNumberToWin ||// [-] 
            countColumn >= this.discNumberToWin ||
            countDiag >= this.discNumberToWin ||
            countAntiDiag >= this.discNumberToWin) {
            this.attachEvent(false)

            this.displayVictory(this.playerActual)

            return this.playerActual
        } else {
            return false
        }
    }


    /**
     *Affiche la victoire du joueur ou effectue un changement de round
     *
     * @param {*} winnerName
     * @memberof Game
     */
    displayVictory(winnerName) {

        console.log('this.roundActual - ' + this.roundActual)
        console.log('this.roundNumber - ' + this.roundNumber)

        this.getPlayer(this.playerActual).roundWinned++

        if (this.roundActual < this.roundNumber) {
            this.displayInformations('round')
            setTimeout(() => {
                this.displayBoard()
                this.attachEvent(true)
            }, 3000)

            this.roundActual++
        } else {
            this.displayInformations('winner')
            this.gamePlayer1.win < this.gamePlayer2.win ? this.gamePlayer1.gameWinned++ : this.gamePlayer2.gameWinned++

            this.DB_setPlayer(this.gamePlayer1)
            this.DB_setPlayer(this.gamePlayer2)

            let winner = this.gamePlayer1.win > this.gamePlayer2.win ? this.gamePlayer1 : this.gamePlayer2
            let loser = this.gamePlayer1.win < this.gamePlayer2.win ? this.gamePlayer1 : this.gamePlayer2

            this.DB_setGame(winner, loser)
        }

    }


    /**
     *Facilite l'affichage d'information
     *
     * @param {*} info
     * @memberof Game
     */
    displayInformations(info) {
        switch (info) {
            case 'reinit':
                $('#playerTurn').text(null)
                $('#informations').text(null)
                break
            case 'winner':
                $('#winner').html('Le vainqueur de la partie est : <b>' + this.gamePlayer1.win < this.gamePlayer2.win ? this.gamePlayer1.name : this.gamePlayer2.name + '</b>')
                $('#playerTurn').text("")
                break
            case 'playerTurn':
                $('#playerTurn').text("")
                $('#playerTurn').text('C\'est au tour de : ' + this.getPlayer(this.playerActual).name)
                break
            case 'round':
                $('#informations').text('Le prochain round commence bientot...')
                break
        }
    }


    /**
     *Renvoi le joueur actuel
     *
     * @param {*} id
     * @returns
     * @memberof Game
     */
    getPlayer(id) {
        return id == 1 ? this.gamePlayer1 : this.gamePlayer2
    }

}