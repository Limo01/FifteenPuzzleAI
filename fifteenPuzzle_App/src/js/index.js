import { Model } from "./model.js";
import { View } from "./view.js";
import { Controller } from "./controller.js";
import { SplashScreen } from '@capacitor/splash-screen';

async function loadPolicy(model, view) {
    let promise = new Promise(function(resolve) {
        import("./rl_policy.js").then((module) => {
            model.setPolicy(module.getPolicy());
            resolve();
        });
    });
    await promise;
    view.showAiButtons();
}

window.onload = function() {
    let model = new Model();
    let view = new View();
    
    let controller = new Controller();
    controller.setModel(model);
    controller.setView(view);

    view.setController(controller);

    SplashScreen.hide();

    setTimeout(() => {
        view.showAiModuleLoading();
    }, 500);
    
    loadPolicy(model, view);
}