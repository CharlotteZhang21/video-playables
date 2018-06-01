/*
===Video Playable Variables Controller===
Keeps video playable script variables.
Handles their value, increases and decreases them accordingly when consequences are applied.
If the variable is displayed on the hub, talk to the video-playable-hud-controller to change.
Also evaluates conditions applied to them.
Works with a specific syntax, extremely similar to normal javascript variable setting/boolean syntax.
*/
class VideoPlayableVariablesController {

    constructor(variablesConfig) {

        this.initSignals();
        this.variables = [];
        for (var key in variablesConfig) {
            this.variables[key] = variablesConfig[key];
        }
    }

    initSignals() {
        this.onInitVariables = new Phaser.Signal();
        this.onConsequencesChange = new Phaser.Signal();
    }


    /* when the hud is created, 
    video-playable-collectible-controller tells the hud through it and change the variable,
    it's called from video-playable-state-controller
    */

    initVariables(tag, object) {
        console.log('initVariables in variables');
        console.log(tag);
        console.log(object);
        var key = tag.replace('-counter','');
        if(!this.variables[key]){
           
            this.variables[key] = {};    
            this.variables[key].value = object.currentValue;
            this.variables[key].updateHud = tag;

            this.onInitVariables.dispatch(tag, object); // received in hud controller
        }
    }

    /*
    ==Apply Consequences==
    Applies consequences (given by a string) to variables.
    Params:
     + consequences : string that specifies consequences to apply. Syntax is as follows
     	projectileSuccess=true;anotherVariable+=2;anotherAnotherVariable=5
     	- separate variables by ;
     	- can set values with '=true' or '=3'
     	- can increase/decrease values with '++', '+=', '--', '-='
    */
    applyConsequences(consequences) {
    	console.log("Applying consequences");
    	console.log(consequences);
        if (consequences !== undefined) {
            var consequencesArray = consequences.split(';');
            console.log(consequencesArray);
            for (var i = 0; i < consequencesArray.length; i++) {
            	var consequence = consequencesArray[i];
            	console.log(consequence);
            	console.log(consequence.includes("="));
                if (consequence.includes("--")) {
                    this.decreaseVariable(consequence.split("--")[0], 1);
                } else if (consequence.includes("-=")) {
                    this.decreaseVariable(consequence.split("-=")[0], consequence.split("-=")[1]);
                } else if (consequence.includes("++")) {
                    this.increaseVariable(consequence.split("++")[0], 1);
                } else if (consequence.includes("+=")) {
                    this.increaseVariable(consequence.split("+=")[0], consequence.split("+=")[1]);
                } else if (consequence.includes("=")) {
                    this.setVariable(consequence.split("=")[0], consequence.split("=")[1]);
                }
            }
        }
        console.log("VARIABLES");
        console.log(this.variables);
    }

    increaseVariable(variableName, value) {
        if (this.variables[variableName] != null) {
            var num = parseFloat(this.variables[variableName].value) + parseFloat(value);
            this.variables[variableName].value = num;

            var tag = this.variables[variableName].updateHud;
            if(tag !== undefined)   
                this.onConsequencesChange.dispatch(tag, num);

        }
    }

    decreaseVariable(variableName, value) {
        if (this.variables[variableName] != null) {
            var num = parseFloat(this.variables[variableName].value) - parseFloat(value);
            var tag = this.variables[variableName].updateHud;
            if(tag !== undefined)   
                this.onConsequencesChange.dispatch(tag, num);
        }
    }

    setVariable(variableName, value) {

        console.log("set variables" + variableName);
            console.log(this.variables[variableName]);
        if (this.variables[variableName] != null) {
            this.variables[variableName].value = value;

            

            var tag = this.variables[variableName].updateHud;
            if(tag !== undefined)   
                this.onConsequencesChange.dispatch(tag, value);
        }
    }


    /*
    ==Evaluate Conditions==
    Evaluates a set of conditions (given by a string) depending the values the variables have.
    Params:
     + conditions : string that specifies conditions to evaluate. Syntax is as follows
     	projectileSuccess==true&&anotherVariable>=2&&anotherAnotherVariable<5
     	- separate variables by && (acts as an AND)
     	- can use normal boolean operators '==', '>=', '<=', '<', '>'
    */
    evaluateConditions(conditions) {

        var evaluation = true;
        if (conditions !== undefined) {
            var conditionsArray = conditions.split("&&");
            for (var i = 0; i < conditionsArray.length; i++) {
            	var condition = conditionsArray[i];
                if (condition.includes("==")) {
                    evaluation &= this.variableEqualTo(condition.split("==")[0], condition.split("==")[1]);
                } else if (condition.includes(">=")) {
                    evaluation &= this.variableBiggerThanOrEqualTo(condition.split(">=")[0], condition.split(">=")[1]);
                } else if (condition.includes("<=")) {
                    evaluation &= this.variableSmallerThanOrEqualTo(condition.split("<=")[0], condition.split("<=")[1]);
                } else if (condition.includes(">")) {
                    evaluation &= this.variableBiggerThan(condition.split(">")[0], condition.split(">")[1]);
                } else if (condition.includes("<")) {
                    evaluation &= this.variableSmallerThan(condition.split("<")[0], condition.split("<")[1]);
                }
            }
        }
        return evaluation;
    }

    variableBiggerThan(variableName, value) {
        return this.variables[variableName].value > value;
    }

    variableBiggerThanOrEqualTo(variableName, value) {
        return this.variables[variableName].value >= value;
    }

    variableSmallerThan(variableName, value) {
        return this.variables[variableName].value < value;
    }

    variableSmallerThanOrEqualTo(variableName, value) {
        return this.variables[variableName].value <= value;
    }

    variableEqualTo(variableName, value) {
        return this.variables[variableName].value == value;
    }

}

export default VideoPlayableVariablesController;