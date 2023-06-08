export class Controller {
    constructor() {
        this.model = null;
        this.view = null;
        this.autoplayInterval = null;
    }

    setModel(model) {
        this.model = model;
    }

    setView(view) {
        this.view = view;

        this.view.showBoard(this.model.getBoard());
        this.view.showMovesCounter(this.model.getMovesCounter());
    }

    doAction(action) {
        this.model.doAction(action);
            
        this.view.showBoard(this.model.getBoard());
        this.view.showMovesCounter(this.model.getMovesCounter());
        
        if (this.model.isGameFinished())
            this.view.showVictory();
    }

    doAiAction() {
        this.model.doAiAction();

        this.view.showBoard(this.model.getBoard());
        this.view.showMovesCounter(this.model.getMovesCounter());
        
        if (this.model.isGameFinished())
            this.view.showVictory();
    }

    setAiAutoplay(mode) {
        if (mode && !this.model.isGameFinished()) {
            this.autoplayInterval = setInterval(() => {
                if (this.model.isGameFinished()) {
                    this.setAiAutoplay(false);
                    this.view.setAiAutoplayToggleToFalse();
                    this.view.showVictory();
                }
                else {
                    this.doAiAction();
                }
            }, 500);
        }
        else if (this.autoplayInterval !== null) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    restartGame() {
        this.model.restartGame();

        this.view.showBoard(this.model.getBoard());
        this.view.showMovesCounter(this.model.getMovesCounter());
        
        this.setAiAutoplay(false);
        this.view.setAiAutoplayToggleToFalse();
    }
}