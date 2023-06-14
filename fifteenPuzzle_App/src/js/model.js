import { Storage } from '@ionic/storage';

export class Model {
    static  emptyCellValue = 99;

    #board;
    #emptyCellIndex;
    #rowsSolved;
    #movesCounter;
    #activatedAi;
    #policy = null;
    #statsDB = null;

    constructor() {
        this.#board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, Model.emptyCellValue];
        this.#emptyCellIndex = 15;
        this.#rowsSolved = 4;
        this.#movesCounter = 0;
        this.activatedAi = false;
        this.#statsDB = new Storage();
        
        this.#statsDB.create();

        this.#generateRandomBoard();
    }

    setPolicy(policy) {
        this.#policy = policy;
    }

    #generateRandomBoard() {
        for (let i = 0; i < 500; i++) {
            let rowEmptyCell = Math.floor(this.#emptyCellIndex / 4);
            let colEmptyCell = this.#emptyCellIndex - rowEmptyCell * 4;

            let possibleActions = [];

            if (rowEmptyCell - 1 >= 0)
                possibleActions.push((rowEmptyCell - 1) * 4 + colEmptyCell);
            
            if (rowEmptyCell + 1 < 4)
                possibleActions.push((rowEmptyCell + 1) * 4 + colEmptyCell);
            
            if (colEmptyCell - 1 >= 0)
                possibleActions.push(rowEmptyCell * 4 + colEmptyCell - 1);

            if (colEmptyCell + 1 < 4)
                possibleActions.push(rowEmptyCell * 4 + colEmptyCell + 1);
            
            let action = possibleActions[(Math.floor(Math.random() * possibleActions.length))];

            this.#board[this.#emptyCellIndex] = this.#board[action];
            this.#board[action] = Model.emptyCellValue;
            this.#emptyCellIndex = action;
        }
        this.#rowsSolved = this.#getRowsSolved();
    }

    #getCurrentStateHash() {
        let hash = "";
        let bound = this.#board.length;

        if (this.#rowsSolved < 2)
            bound = (this.#rowsSolved + 1) * 4;

        for (let i = 0; i < this.#board.length; i++) {
            if (this.#board[i] <= bound || this.#board[i] === Model.emptyCellValue)
                hash += this.#board[i] + "_";
            else
                hash += "0" + "_";
        }

        return hash;
    }

    #getRowsSolved() {
        let count = 0;

        for (let i = 0; i < this.#board.length - 1 && this.#board[i] === i + 1; i++) {
            count++;
        }
        
        if (count === this.#board.length - 1)
            count++;
        
        return Math.floor(count / 4);
    }

    getBoard() {
        return this.#board;
    }

    getPossibleActions() {
        if (this.#rowsSolved === 4)
            return [];

        let rowEmptyCell = Math.floor(this.#emptyCellIndex / 4);
        let colEmptyCell = this.#emptyCellIndex - rowEmptyCell * 4;

        let possibleActions = [];
        
        if ((this.#rowsSolved <= 2 && rowEmptyCell - 1 >= this.#rowsSolved) || (this.#rowsSolved == 3 && rowEmptyCell - 1 >= 2))
            possibleActions.push((rowEmptyCell - 1) * 4 + colEmptyCell);
        
        if (rowEmptyCell + 1 < 4)
            possibleActions.push((rowEmptyCell + 1) * 4 + colEmptyCell);
        
        if (colEmptyCell - 1 >= 0)
            possibleActions.push(rowEmptyCell * 4 + colEmptyCell - 1);
        
        if (colEmptyCell + 1 < 4)
            possibleActions.push(rowEmptyCell * 4 + colEmptyCell + 1);

        return possibleActions;
    }

    getMovesCounter() {
        return this.#movesCounter;
    }

    getEmptyCellIndex() {
        return this.#emptyCellIndex;
    }

    async doAction(action) {
        if (this.getPossibleActions().indexOf(action) !== -1) {
            this.#board[this.#emptyCellIndex] = this.#board[action];
            this.#board[action] = Model.emptyCellValue;

            this.#emptyCellIndex = action;

            this.#rowsSolved = this.#getRowsSolved();
            this.#movesCounter++;

            if (this.isGameFinished()) {
                if (this.#activatedAi) {
                    let aiGamesPlayed = await this.#statsDB.get("aiGamesPlayed");
                    await this.#statsDB.set("aiGamesPlayed", (aiGamesPlayed != null ? aiGamesPlayed : 0) + 1);

                    let aiAverageMoves =  await this.#statsDB.get("aiAverageMoves");
                    await this.#statsDB.set("aiAverageMoves", (aiAverageMoves != null ? ((aiAverageMoves * aiGamesPlayed + this.getMovesCounter()) / (aiGamesPlayed + 1)) : this.getMovesCounter()));

                    let aiRecord = await this.#statsDB.get("aiRecord");
                    await this.#statsDB.set("aiRecord", ((aiRecord == null || this.getMovesCounter() < aiRecord) ? this.getMovesCounter() : aiRecord));

                    let aiGamesMoves = await this.#statsDB.get("aiGamesMoves");
                    aiGamesMoves = (aiGamesMoves != null ? JSON.parse(aiGamesMoves) : []);
                    aiGamesMoves.push(this.getMovesCounter());

                    if (aiGamesMoves.length > 10)
                        aiGamesMoves.shift();

                    await this.#statsDB.set("aiGamesMoves", JSON.stringify(aiGamesMoves));
                }
                else {
                    let gamesPlayed = await this.#statsDB.get("gamesPlayed");
                    await this.#statsDB.set("gamesPlayed", (gamesPlayed != null ? gamesPlayed : 0) + 1);

                    let averageMoves =  await this.#statsDB.get("averageMoves");
                    await this.#statsDB.set("averageMoves", (averageMoves != null ? ((averageMoves * gamesPlayed + this.getMovesCounter()) / (gamesPlayed + 1)) : this.getMovesCounter()));

                    let record = await this.#statsDB.get("record");
                    await this.#statsDB.set("record", ((record == null || this.getMovesCounter() < record) ? this.getMovesCounter() : record));

                    let gamesMoves = await this.#statsDB.get("gamesMoves");
                    gamesMoves = (gamesMoves != null ? JSON.parse(gamesMoves) : []);
                    gamesMoves.push(this.getMovesCounter());

                    if (gamesMoves.length > 10)
                        gamesMoves.shift();

                    await this.#statsDB.set("gamesMoves", JSON.stringify(gamesMoves));                
                }  
            }
        }
    }

    async doAiAction() { 
        if (this.#policy != null && !this.isGameFinished()) {
            let possibleActions = this.getPossibleActions();
            let bestAction = possibleActions[0];
            this.#activatedAi = true;

            for (let i = 1; i < possibleActions.length; i++) {
                if (this.#policy.get(JSON.stringify([this.#getCurrentStateHash(), possibleActions[i]])) > this.#policy.get(JSON.stringify([this.#getCurrentStateHash(), bestAction])))
                    bestAction = possibleActions[i];
            }

            await this.doAction(bestAction);
        }
    }
    
    restartGame() {
        this.#movesCounter = 0;
        this.#generateRandomBoard();
        this.#activatedAi = false;
    }

    isGameFinished() {
        return JSON.stringify(this.#board) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, Model.emptyCellValue])
    }

    async getStatistics() {
        let gamesPlayed = await this.#statsDB.get("gamesPlayed");        
        let averageMoves = await this.#statsDB.get("averageMoves");
        let record = await (this.#statsDB.get("record"));
        let gamesMoves = await this.#statsDB.get("gamesMoves");

        let aiGamesPlayed = await this.#statsDB.get("aiGamesPlayed");
        let aiAverageMoves = await this.#statsDB.get("aiAverageMoves");
        let aiRecord = await (this.#statsDB.get("aiRecord"));
        let aiGamesMoves = await this.#statsDB.get("aiGamesMoves");

        return {
            "gamesPlayed" : (gamesPlayed != null ? gamesPlayed : 0), 
            "averageMoves" : (averageMoves != null ? parseInt(averageMoves) : 0),
            "record" : (record != null ? record : "Not available"),
            "gamesMoves" : (gamesMoves != null ? JSON.parse(gamesMoves) : []),
            "aiGamesPlayed" : (aiGamesPlayed != null ? aiGamesPlayed : 0), 
            "aiAverageMoves" : (aiAverageMoves != null ? parseInt(aiAverageMoves) : 0),
            "aiRecord" : (aiRecord != null ? aiRecord : "Not available"),
            "aiGamesMoves" : (aiGamesMoves != null ? JSON.parse(aiGamesMoves) : []),
        };
    }

    async clearNormalStatistics() {
        await this.#statsDB.set("gamesPlayed", 0);
        await this.#statsDB.set("averageMoves", 0);
        await (this.#statsDB.set("record", null));
        await this.#statsDB.set("gamesMoves", JSON.stringify([]));
    }

    async clearAiStatistics() {
        await this.#statsDB.set("aiGamesPlayed", 0);
        await this.#statsDB.set("aiAverageMoves", 0);
        await (this.#statsDB.set("aiRecord", null));
        await this.#statsDB.set("aiGamesMoves", JSON.stringify([]));
    }
}