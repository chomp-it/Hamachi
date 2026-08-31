const addNoteElement                  = document.getElementById('jot-note');
const developIdeaElement              = document.getElementById('develop-idea');
const saveDataElement                 = document.getElementById('save-project');
const loadDataElement                 = document.getElementById('load-data');
const retakeSurveyElement             = document.getElementById('retake-survey');


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

const retakeSurveyDivElement          = document.getElementById('retake-survey-div');

const projectData = {
    notes:  [],
    axioms: []
}

let ableToRetakeSurvey = false;


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

})


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

    surveyData.forEach(pair => {
        const question = pair[0];
        const answer = pair[1];

        retakeSurveyDivElement.innerHTML += `
        question: <br>
        ${question} <br>
        answer: <br>
        ${answer} <br>
        `;
    });
}

// restore the mission statement and project title data
function populateWithData(config) {
    if (config == null) {
        // the page would be broken and (mostly) unusable otherwise
        window.location.href = '../views/user_homepage.html';
        return;
    }

    missionStatementElement.textContent = config.goal;
    projectTitleElement.textContent     = config.title;

    restoreAxiomsAndNotes();

    if (projectData.survey != null && projectData.survey.length > 0) {
        restoreSurvey(projectData.survey);
    } else {
        console.log('no survey data found to restore');
    }
}


const config = JSON.parse(localStorage.getItem('config'));
populateWithData(config);

