const addNoteElement                  = document.getElementById('jot-note');
const developIdeaElement              = document.getElementById('develop-idea');
const saveDataElement                 = document.getElementById('save-project');
const loadDataElement                 = document.getElementById('load-data');
const retakeSurveyElement             = document.getElementById('retake-survey-button');
const reviewPreSurveyElement          = document.getElementById('review-pre-survey');

const loadingScreenElement = document.getElementsByClassName('loading-screen');
const loadingScreenMessageElement     = document.getElementById('loading-screen-message');

const notesListElement                = document.getElementById('realizations-list');
const axiomsListElement               = document.getElementById('axioms-list');
const noNotesElement                  = document.getElementById('no-realizations');
const noAxiomsElement                 = document.getElementById('no-axioms');

const noteEditorElement               = document.getElementById('realization-editor');
const noteEditorSubmitElement         = document.getElementById('note-editor-submit');

const noteEditorInterfaceElement      = document.getElementById('note-editor-interface');
const noteEditorCancelElement         = document.getElementById('note-editor-cancel');

const axiomEditorElement              = document.getElementById('axiom-editor');
const axiomEditorSubmitElement        = document.getElementById('axiom-editor-submit');
const axiomEditorCancelElement        = document.getElementById('axiom-editor-cancel');

const missionStatementElement         = document.getElementById('mission-statement');
const projectTitleElement             = document.getElementById('project-title');

const noteEditorTitleElement          = document.getElementById('note-editor-title')

const preSurveyDivElement             = document.getElementById('pre-survey-div');

const retakeSurveyDivElement          = document.getElementById('retake-survey-div');


const projectData = {
    notes:  [],
    axioms: []
}

let ableToRetakeSurvey = false;
// so the user can only retake the survey once
let retookSurvey = false;

async function displayMessage(message){
    loadingScreenMessageElement.textContent = message;
    loadingScreenElement[0].style.display = 'block';
    await new Promise(wait => setTimeout(wait, 3000))
    loadingScreenElement[0].style.display = 'none';
}

function addContent(type, title, body, time) {
    console.log('triggered add content event');

    if (body === "") {
        alert('Yeli, your note is lacking a body. Kinda important, hombre.');
        return;
    }

    if (title === "") {
        alert('Your note is missing a title, broidi. You need that.');
        return;
    }

    if (time == null) {
        console.log('time is null');
    }

    const duplicateNote = projectData.notes.some(note => {
        if (note.title === title || note.body === body) {
            return true;
        }
    });

    const duplicateAxiom = projectData.axioms.some(axiom => {
        if (axiom.title === title || axiom.body === body) {
            return true;
        }
    });

    if (duplicateNote || duplicateAxiom) {
        console.log('duplicate detected');
        return;
    }

    if (type === 'note') {
        // refactor tämä
        notesListElement.innerHTML += `
        <li>
        <h3>${title} – added at ${time}</h3> <br>
        <p>${body}</p> <br>
        </li>
        `;
        projectData.notes.push({title: title, body: body, time: time});
        console.log('added a note');
    } else if (type === 'axiom') {
        // refactor tämä
        axiomsListElement.innerHTML += `
        <li>
            <h3>${title} – added at ${time}</h3> <br>
            <p>${body}</p> <br>
        </li>`;
        projectData.axioms.push({title: title, body: body, time: time});
        console.log('added an axiom');
    }

    const message = `Your ${type} titled ${title} has been added to the project!`;
    void displayMessage(message);
    console.log(message);
}

function saveNoteToProject(note, title) {
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const time = `${hours}:${minutes}`;
    addContent('note', title, note, time);

    // remove the "You haven't made any realizations yet" message
    noNotesElement.style.display = 'none';

    console.log('saved note to project');
}

function saveAxiomToProject(axiom, title) {
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const time = `${hours}:${minutes}`;
    addContent('axiom', title, axiom, time);

    // remove the "No axioms have been written yet" message
    noAxiomsElement.style.display = 'none';

    console.log('saved axiom to project')
}

function clearNoteEditor() {
    noteEditorInterfaceElement.value = '';
    noteEditorTitleElement.value = '';
}

// listener for the 'jot note' button
addNoteElement.addEventListener('click', () => {
    noteEditorElement.style.display = 'block';
});

// listener for the 'Add realization to project' button in the realization editor
noteEditorSubmitElement.addEventListener('click', () => {
    if (noteEditorInterfaceElement.value === '') {
        alert('Your axiom is empty; you cannot submit it.');
        return;
    }

    saveNoteToProject(
        noteEditorInterfaceElement.value,
        noteEditorTitleElement.value
    );

    noteEditorElement.style.display = 'none';
    clearNoteEditor(); // clear the fields

    console.log("submitted note");
});

// listener for the 'cancel' button in the realization editor
noteEditorCancelElement.addEventListener('click', () => {
    noteEditorElement.style.display = 'none';
    clearNoteEditor(); // clear the data in the fields
});

// listener for the 'Develop an idea' button
developIdeaElement.addEventListener('click', () => {
    console.log('develop idea button clicked');
    axiomEditorElement.style.display = 'block';
    console.log('displayed axiom editor');
});

retakeSurveyElement.addEventListener('click', () => {
    if (!ableToRetakeSurvey) {
        return; // the button shouldn't even be visible if this is the case
    }

    if (retookSurvey) {
        alert("" +
            "You've already retaken the survey. " +
            "You can see your results somewhere. " +
            "I don't know where, but somewhere."
        );
    }

    const confirmRetake = confirm("" +
        "Are you sure you want to retake the survey?" +
        "You can only retake this once; make sure you believe you are ready." +
        "You can still review your pre-survey"
    );
    if (!confirmRetake) {
        return;
    }

    if (retakeSurveyDivElement.style.display === 'block') {
        retakeSurveyDivElement.style.display = 'none';
    } else if (retakeSurveyDivElement.style.display === 'none') {
        retakeSurveyDivElement.style.display = 'block';
        populateSurveyFields(config.survey); // should probably just call this once
    }
});

function populateSurveyFields(surveyData) {
    if (surveyData == null) {
        console.log('survey data is null');
        return;
    }

    const pairs = surveyData[0];

    pairs.forEach(pair => {
        const question = pair[0];
        const identifier = `answer-${question}`;
        retakeSurveyDivElement.innerHTML += `
        <h4>question:</h4> <br>
        <p>${question}</p> <br>
        <h4>answer:</h4> <br>
        <textarea id="${identifier}"></textarea> <br>
        `;
    });
    console.log('survey fields populated');
}



function clearAxiomEditor() {
    document.getElementById('axiom-editor-interface').value = '';
    document.getElementById('axiom-editor-title').value = '';
}

// only works for yksi project mutta that's fine for now.
function saveData() {
    const data = JSON.stringify(projectData);
    localStorage.setItem('save_file', data);
    console.log('saved data to localStorage');

    console.log('data saved:');
    console.log(data);
}

function loadData() {
    const data = localStorage.getItem('save_file');
    if (data === null) {
        console.log('no data found to load');
        return;
    }
    return JSON.parse(data);
}

// listener for the 'Add axiom to project' button in the axiom editor

axiomEditorSubmitElement.addEventListener('click', () => {
    if (document.getElementById('axiom-editor-interface').value === '') {
        alert('Your axiom is empty; you cannot submit it.');
        return;
    }

    saveAxiomToProject(
        document.getElementById('axiom-editor-interface').value,
        document.getElementById('axiom-editor-title').value
    );

    document.getElementById('axiom-editor').style.display = 'none';
    clearAxiomEditor();
});

// listener for the 'cancel' button in the axiom editor
axiomEditorCancelElement.addEventListener('click', () => {
    axiomEditorElement.style.display = 'none';
    clearAxiomEditor(); // clear the text fields
});

saveDataElement.addEventListener('click', () => {
   saveData();
});

loadDataElement.addEventListener('click', () => {
    restoreAxiomsAndNotes();
});

reviewPreSurveyElement.addEventListener('click', () => {
    console.log('review pre survey button clicked');
    if (preSurveyDivElement.style.display === 'block') {
        preSurveyDivElement.style.display = 'none';
        console.log('hidden pre survey div');
    } else {
        preSurveyDivElement.style.display = 'block';
        console.log('displayed pre survey div');
    }
});


function restoreAxiomsAndNotes() {
    const projectContent = loadData();

    if (projectContent == null) {
        console.log('found nothing to restore');
        return;
    }

    projectContent.notes.forEach(piece => {
        addContent('note', piece.title, piece.body, piece.time);
    });
    projectContent.axioms.forEach(piece => {
        addContent('axiom', piece.title, piece.body, piece.time);
    });
}

function restoreSurvey(surveyData) {
    retakeSurveyElement.style.display = 'block';
    ableToRetakeSurvey = true;

    if (surveyData == null) {
        console.log('no survey data found to restore');
        return;
    }

    const pairs = surveyData[0];

    pairs.forEach(pair => {
        const question = pair[0];
        const answer   = pair[1];
        preSurveyDivElement.innerHTML += `
        <h4>question:</h4> <br>
        <p>${question}</p> <br>
        <h4>answer:</h4> <br>
        <p>${answer}</p> <br>
        `;
    });
}

// restore the mission statement and project title data
function populateWithData(config) {
    if (config == null) {
        // this page would be broken and (mostly) unusable otherwise.
        // consider adding a warning message like alert()
        window.location.href = '../views/user_homepage.html';
        return;
    }

    missionStatementElement.textContent = config.goal;
    projectTitleElement.textContent     = config.title;

    restoreAxiomsAndNotes();

    if (config.survey != null && config.survey.length > 0) {
        restoreSurvey(config.survey);
    } else {
        console.log('no survey data found to restore');
    }
}

const config = JSON.parse(localStorage.getItem('config'));
populateWithData(config);

