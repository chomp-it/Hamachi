// main buttons
const addNoteElement                  = document.getElementById('jot-note');
const developIdeaElement              = document.getElementById('develop-idea');
const saveDataElement                 = document.getElementById('save-project');
const loadDataElement                 = document.getElementById('load-data');
const retakeSurveyElement             = document.getElementById('retake-survey-button');
const reviewPreSurveyElement          = document.getElementById('review-pre-survey');
const reviewPostSurveyElement         = document.getElementById('review-post-survey');


const loadingScreenMessageElement     = document.getElementById('loading-screen-message');
const badMessageElement               = document.getElementById('bad-message-content');

const notesListElement                = document.getElementById('realizations-list');
const axiomsListElement               = document.getElementById('axioms-list');

// the messages that appear when there are no notes or axioms
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

const retakeSurveyAdditionalElements = document.querySelectorAll(
    '.retake-survey-additionals'
);

const submitSurveyRetake              = document.getElementById('submit-survey-retake');

const postSurveyDivElement            = document.getElementById('review-post-survey-div');


const projectData = {
    notes:  [],
    axioms: [],
    retook_survey: false,
    survey_questions: [],
    post_survey_answers: []
}

let ableToRetakeSurvey = false;

function addContent(type, title, body, time) {
    if (body === "") {
        alert('Yeli, your note is lacking a body. Kinda important, hombre.');
        return;
    }
    if (title === "") {
        alert('Your note is missing a title, broidi. You need that.');
        return;
    }
    if (time == null) {
        log('time is null');
    }
    // ^^^ this is the price of considerate error messages.
    // I could pull a Google and wrap all of these checks in a two-line conditional, but that would be inconsiderate

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
        log('duplicate detected');
        return;
    }

    if (type === 'note') {
        // refactor tämä.
        // For now it's fine koska we have ei listeners
        notesListElement.innerHTML += `
        <li>
        <h3>${title} – added at ${time}</h3> <br>
        <p>${body}</p> <br>
        </li>
        `;
        projectData.notes.push({title: title, body: body, time: time});
        log('added a note');
    } else if (type === 'axiom') {
        // refactor tämä
        axiomsListElement.innerHTML += `
        <li>
            <h3>${title} – added at ${time}</h3> <br>
            <p>${body}</p> <br>
        </li>`;
        projectData.axioms.push({title: title, body: body, time: time});
        log('added an axiom');
    }
    void displayMessage(`Your ${type} titled ${title} has been added to the project!`);
}

function saveNoteToProject(note, title) {
    const time = getTime();
    addContent('note', title, note, time);

    // remove the "You haven't made any realizations yet" message
    hide(noNotesElement);

    log('saved note to project');
}

function saveAxiomToProject(axiom, title) {
    const time = getTime();
    addContent('axiom', title, axiom, time);

    // remove the "No axioms have been written yet" message
    hide(noAxiomsElement);

    log('saved axiom to project')
}

function clearNoteEditor() {
    noteEditorInterfaceElement.value = '';
    noteEditorTitleElement.value = '';
}



function verifySurveyFields() {
    let answers = [];
    identifiersForLater.forEach(identifier => {
        const element = document.getElementById(identifier);
        if (element.value === '') {
            alert('You failed to answer question: ' + identifier);
            return;
        }
        answers.push(element.value);
    });
    return answers;
}

// this is used to lookup the textareas for the submit logic.
// this is quite sloppy, but otherwise I'd need to essentially write a parser in this already monolithic file
let identifiersForLater = [];
let populatedSurveyFields = false;

function populateSurveyFields(surveyData) {
    console.log('populateSurveyFields called');
    if (populatedSurveyFields) {
        log('aborted populateSurveyFields due to the fields already being populated.');
        return;
    }

    if (surveyData == null) {
        log('survey data is null');
        return;
    }

    surveyData.forEach(pair => {
        const question = pair[0];
        const identifier = `answer-${question}`;
        identifiersForLater.push(identifier);
        retakeSurveyDivElement.innerHTML += `
        <h4>question:</h4> <br>
        <p>${question}</p> <br>
        <h4>answer:</h4> <br>
        <textarea id="${identifier}"></textarea> <br>
        `;
    });
    log('survey fields populated');
    populatedSurveyFields = true;
}

// only works for yksi project mutta on fine for now.
function saveData() {
    const data = JSON.stringify(projectData);
    localStorage.setItem('save_file', data);
    log('saved data to localStorage');

    log('data saved:');
    log(data);
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('save_file'));
    if (data == null) {
        log('no data found to load');
        return;
    }
    if (data.retook_survey === true) {
        display(reviewPostSurveyElement);
    }
    return data;
}

function restoreAxiomsAndNotes() {
    log('restoring axioms and notes');
    const projectContent = loadData();

    if (projectContent == null) {
        log('found nothing to restore');
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
    display(retakeSurveyDivElement);
    ableToRetakeSurvey = true;

    if (surveyData == null) {
        log('no survey data found to restore');
        return;
    }

    surveyData.forEach(pair => {
        preSurveyDivElement.innerHTML += `
        <h4>question:</h4> <br>
        <p>${pair[0]}</p> <br>
        <h4>answer:</h4> <br>
        <p>${pair[1]}</p> <br>
        `;
    });
}

function restoreSurveyRetake(data) {
    if (data.retook_survey === false) {
        ableToRetakeSurvey = true;
        return;
    }
    ableToRetakeSurvey = false;
    hideSurveyElements();
}

// restore the mission statement and project title data
function populateWithData(config) {
    if (config == null) {
        // this page would be broken and (mostly) unusable otherwise.
        // consider adding a warning message like alert()
        window.location.href = "../views/user_homepage.html";
        return;
    }

    missionStatementElement.textContent = config.goal;
    projectTitleElement.textContent     = config.title;

    restoreAxiomsAndNotes();
    if (config.survey != null && config.survey.length > 0) {

        restoreSurvey(config.survey);
        const data = loadData();
        if (data != null) {
            restoreSurveyRetake(data);
        } else {
            log('no data found to restore');
        }
    } else {
        log('no survey data found to restore');
    }
}

function handleNoteEditorSubmit() {
    if (noteEditorInterfaceElement.value === '') {
        alert('Your axiom is empty; you cannot submit it.');
        return;
    }

    saveNoteToProject(
        noteEditorInterfaceElement.value,
        noteEditorTitleElement.value
    );

    hide(noteEditorElement);
    clearNoteEditor(); // clear the fields

    log("submitted note");
}

function handleSurveyRetakeSubmission() {
    const answers = verifySurveyFields();
    const confirmSubmission = confirm("Are you sure you want to submit?");

    if (!confirmSubmission) {
        return;
    }

    projectData.retook_survey = true;
    projectData.post_survey_answers.push(answers);

    log('survey retake submitted');

    hideSurveyElements();
    saveData();
    display(reviewPostSurveyElement);
}

function handleRetakeSurveyElementClick() {
    if (!ableToRetakeSurvey) {
        return; // the button shouldn't even be visible if this is the case
    } else {
        displaySurveyElements();
    }

    if (projectData.retook_survey === true) {
        alert("" +
            "You've already retaken the survey. " +
            "You can see your results somewhere. " +
            "I don't know where, but somewhere."
        );
        return;
    }

    if (retakeSurveyDivElement.style.display === 'block') {
        hideSurveyElements()
    }

    if (retakeSurveyDivElement.style.display === 'none') {
        const confirmRetake = confirm("" +
            "Are you sure you want to retake the survey? " +
            "You can only retake this once; make sure you believe you are ready." +
            " You can still review your pre-survey. " +
            "You will not be able to cancel this attempt."
        );
        if (!confirmRetake) {
            return;
        }
        displaySurveyElements();
        populateSurveyFields(config.survey);
    }
}

function handleAxiomEditorSubmit() {
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
}

function handlePreSurveyReview() {
    log('review pre survey button clicked');
    if (preSurveyDivElement.style.display === 'block') {
        hide(preSurveyDivElement);
        log('hid pre survey div');
    } else {
        display(preSurveyDivElement);
        log('displayed pre survey div');
    }
}

let populatedPostSurvey = false;
function handlePostSurveyReview() {
    if (postSurveyDivElement.style.display === 'block') {
        hide(postSurveyDivElement);
    } else {
        display(postSurveyDivElement);
    }

    if (populatedPostSurvey) {
        return;
    }

    const data           = loadData();

    const postSurveyData = data.post_survey_answers[0];
    const questions      = config.survey;

    let increment = 0;
    let questionAndAnswerIncrement = 1;

    postSurveyData.forEach(answer => {
        const question = questions[increment][0];
        console.log('question:');
        console.log(question);
        postSurveyDivElement.innerHTML += `
        <b>question ${questionAndAnswerIncrement}:</b> <br>
        ${question} <br>
        answer ${questionAndAnswerIncrement}: <br>
        ${answer} <br>
        <br>
        `;
        increment++;
        questionAndAnswerIncrement++;
    });
    populatedPostSurvey = true;
}

const config = JSON.parse(localStorage.getItem('config'));
projectData.survey_questions = config.survey;
populateWithData(config);

if (config.survey.length === 0) {
    hide(retakeSurveyElement);
    hide(reviewPreSurveyElement);
    hide(reviewPostSurveyElement);
}


