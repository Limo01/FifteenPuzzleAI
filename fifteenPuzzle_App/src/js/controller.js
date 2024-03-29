export class Controller {
    #model = null;
    #view = null;
    #autoplayInterval = null;

    setModel(model) {
        this.#model = model;
    }

    async setView(view) {
        this.#view = view;

        this.#view.showBoard(this.#model.getBoard());
        this.#view.showMovesCounter(this.#model.getMovesCounter());

        this.#view.updateStatistics(await this.#model.getStatistics());
    }

    async doAction(action) {
        await this.#model.doAction(action);
            
        this.#view.showBoard(this.#model.getBoard());
        this.#view.showMovesCounter(this.#model.getMovesCounter());
        
        if (this.#model.isGameFinished()) {
            this.#view.showVictory();
            this.#view.updateStatistics(await this.#model.getStatistics());
        }
    }

    async doAiAction() {
        await this.#model.doAiAction();

        this.#view.showBoard(this.#model.getBoard());
        this.#view.showMovesCounter(this.#model.getMovesCounter());
        
        if (this.#model.isGameFinished()) {
            this.#view.showVictory();
            this.#view.updateStatistics(await this.#model.getStatistics());
        }
    }

    setAiAutoplay(mode) {
        if (mode && !this.#model.isGameFinished()) {
            this.#autoplayInterval = setInterval(() => {
                if (this.#model.isGameFinished()) {
                    this.setAiAutoplay(false);
                    this.#view.setAiAutoplayToggleToFalse();
                }
                else {
                    this.doAiAction();
                }
            }, 500);
        }
        else if (this.#autoplayInterval !== null) {
            clearInterval(this.#autoplayInterval);
            this.#autoplayInterval = null;
        }
    }

    restartGame() {
        this.#model.restartGame();

        this.#view.showBoard(this.#model.getBoard());
        this.#view.showMovesCounter(this.#model.getMovesCounter());
        
        this.setAiAutoplay(false);
        this.#view.setAiAutoplayToggleToFalse();
    }

    async clearNormalStatistics() {
        await this.#model.clearNormalStatistics();

        this.#view.updateStatistics(await this.#model.getStatistics());
    }

    async clearAiStatistics() {
        await this.#model.clearAiStatistics();

        this.#view.updateStatistics(await this.#model.getStatistics());
    }
}