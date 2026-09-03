

async function displayMessage(message, type = 'good'){
    const element = type === 'bad' ? badMessageElement : loadingScreenMessageElement;
    element.textContent = message;
    display(element);
    await new Promise(wait => setTimeout(wait, 3000))
    hide(element);
}

function hideSurveyElements() {
    hide(retakeSurveyElement);
    hide(retakeSurveyDivElement);
    retakeSurveyAdditionalElements.forEach(element => {
        hide(element);
    });
}

function displaySurveyElements() {
    display(retakeSurveyElement);
    display(retakeSurveyDivElement);
    retakeSurveyAdditionalElements.forEach(element => {
        display(element);
    });
}

function hide(element) {
    element.style.display = 'none';
}

function display(element) {
    element.style.display = 'block';
}

// real big time saver, huh?
// the problem is that console.log() masquerades as an important function--
// when it literally just prints to the console. Having a single word makes you cynical of its importance;
// making log expressions easier to skip over.
function log(message) {
    console.log(message);
}

function getTime() {
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    return `${hours}:${minutes}`;
}

function clearAxiomEditor() {
    document.getElementById('axiom-editor-interface').value = '';
    document.getElementById('axiom-editor-title').value = '';
}