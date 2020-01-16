class Player {




    /**
     *Creates an instance of Player.
     * @param {*} id
     * @memberof Player
     */
    constructor(id, mode) {
        this.uuid = 'C4_' + faker.random.uuid()
        this.id = id;
        this.mode = mode;
        this.name = $(`#player${id}Name`).val() || faker.name.findName()
        this.color = $(`#player${id}Color`).val() || faker.commerce.color()
        this.gameWinned = 0
        this.roundWinned = 0
        // this.debug()
    }




    /**
     *Display Player data
     *
     * @memberof Player
     */
    debug() {
        console.table(this)
    }


}