import { Model } from "./model.js";
import Chart from 'chart.js/auto';

export class View {
    #controller = null;
    #normalStatisticsChart = null;
    #aiStatisticsChart = null;

    setController(controller) {
        this.#controller = controller;

        for (let i = 0; i < 16; i++) {
            document.getElementById(i).addEventListener("click", (e) => {  
                this.#controller.doAction(parseInt(e.target.id));
            });
        }

        document.getElementById("info_button").addEventListener("click", () => {
            document.getElementById("info_modal").isOpen = true;
        });

        document.getElementById("close_info_modal_button").addEventListener("click", () => {
            document.getElementById("info_modal").isOpen = false;
        });

        document.getElementById("restart_game_button").addEventListener("click", (e) => {
            this.#controller.restartGame();
        });

        document.getElementById("ai_action_button").addEventListener("click", (e) => {
            this.#controller.doAiAction();
        });

        document.getElementById("ai_autoplay_toggle").addEventListener("ionChange", (e) => {
            this.#controller.setAiAutoplay(e.detail.checked);
        });

        document.getElementById("victory_toast").addEventListener("didDismiss", () => {
            document.getElementById("victory_toast").isOpen = false;
        });

        document.getElementById("clear_stats_button").addEventListener("click", () => {
            this.#controller.clearNormalStatistics();
        });

        document.getElementById("clear_ai_stats_button").addEventListener("click", () => {
            this.#controller.clearAiStatistics();
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

    updateStatistics(stats) {
        document.getElementById("games_played_span").innerHTML = stats["gamesPlayed"];
        document.getElementById("average_moves_span").innerHTML = stats["averageMoves"];
        document.getElementById("record_span").innerHTML = stats["record"];

        if (stats["gamesMoves"].length > 0) {
            this.#showNormalStatisticsChart(stats["gamesMoves"]);
            document.getElementById("normal_statistics").style.display = "block";
        }
        else {
            document.getElementById("normal_statistics").style.display = "none";
        }

        document.getElementById("ai_games_played_span").innerHTML = stats["aiGamesPlayed"];
        document.getElementById("ai_average_moves_span").innerHTML = stats["aiAverageMoves"];
        document.getElementById("ai_record_span").innerHTML = stats["aiRecord"];

        if (stats["aiGamesMoves"].length > 0) {
            this.#showAiStatisticsChart(stats["aiGamesMoves"]);
            document.getElementById("ai_statistics").style.display = "block";
        }
        else {
            document.getElementById("ai_statistics").style.display = "none";
        }
    }

    #showNormalStatisticsChart(data) {
        if (this.#normalStatisticsChart != null) {
            this.#normalStatisticsChart.destroy();
        }        

        const ctx = document.getElementById("normal_statistics_chart");
        
        this.#normalStatisticsChart = new Chart(ctx, {
            type: 'bar',
            data: {
            labels: data,
            datasets: [{
                label: 'Number of Moves',
                data: data,
                borderWidth: 1,
                maxBarThickness: 20
            }]
            },
            options: {
                scales: {
                    y: {
                        display: false
                    }
                }
            }
        });
    }

    #showAiStatisticsChart(data) {
        if (this.#aiStatisticsChart != null)
            this.#aiStatisticsChart.destroy();

        const ctx = document.getElementById("ai_statistics_chart");
        
        this.#aiStatisticsChart = new Chart(ctx, {
            type: 'bar',
            data: {
            labels: data,
            datasets: [{
                label: 'Number of Moves',
                data: data,
                borderWidth: 1,
                maxBarThickness: 20
            }]
            },
            options: {
                scales: {
                    y: {
                        display: false
                    }
                }
            }
        });
    }
}