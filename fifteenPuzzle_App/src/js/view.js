import { Model } from "./model.js";

export class View {
    constructor() {
        this.controller = null;
    }

    setController(controller) {
        this.controller = controller;

        // Add event listeners

        for (let i = 0; i < 16; i++) {
            document.getElementById(i).addEventListener("click", (e) => {  
                this.controller.doAction(parseInt(e.target.id));
            });
        }

        document.getElementById("restart_game_button").addEventListener("click", (e) => {
            this.controller.restartGame();
        });

        document.getElementById("ai_action_button").addEventListener("click", (e) => {
            this.controller.doAiAction();
        });

        document.getElementById("ai_autoplay_toggle").addEventListener("ionChange", (e) => {
            this.controller.setAiAutoplay(e.detail.checked);
        });

        document.getElementById("victory_toast").addEventListener("didDismiss", () => {
            document.getElementById("victory_toast").isOpen = false;
        });
    }

    showBoard(board) {
        for (let i=0; i < board.length; i++) {
            if (board[i] !== Model.emptyCellValue) {
                document.getElementById(i).innerHTML = board[i];
                document.getElementById(i).setAttribute("class", "cell");
            }
            else {
                document.getElementById(i).innerHTML = "";
                document.getElementById(i).setAttribute("class", "emptyCell");
            }
        }
    }

    setAiAutoplayToggleToFalse() {
        document.getElementById("ai_autoplay_toggle").checked = false;
    }

    showMovesCounter(counter) {
        document.getElementById("moves_counter").innerHTML = counter;
    }

    showVictory() {
        document.getElementById("victory_toast").isOpen = true;
    }

    showAiModuleLoading() {
        document.getElementById("loading_ai_module_toast").isOpen = true;
    }

    showAiButtons() {
        document.getElementById("ai_action_button").style.visibility = "visible";
        document.getElementById("ai_autoplay_toggle").style.visibility = "visible";
        
        document.getElementById("loading_ai_module_toast").isOpen = false;
    }
}