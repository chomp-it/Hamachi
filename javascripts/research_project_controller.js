const addNoteElement = document.getElementById('jot-note');
const developIdeaElement = document.getElementById('develop-idea');
const publishFindingsElement = document.getElementById('publish-findings');
const moreOptionsElement = document.getElementById('more-options');

let ableToSubmit = false;

const loadingScreenElement = document.getElementsByClassName('loading-screen');
const loadingScreenMessageElement = document.getElementById('loading-screen-message');
async function displayMessage(message){
    loadingScreenMessageElement.textContent = message;
    loadingScreenElement[0].style.display = 'block';
    await new Promise(wait => setTimeout(wait, 3000))
    loadingScreenElement[0].style.display = 'none';
}

function addContent(type, title, body) {
    console.log('triggered add content event');

    if (body === "") {
        alert('Broh. Your note is lacking a body. Kinda important, hombre.');
        return;
    }

    if (title === "") {
        alert('Your note is missing a title, chief. You need that.');
        return;
    }

    if (type === 'note') {
        const notesListElement = document.getElementById('realizations-list');
        if (title === '' || body === '') {
            alert("Something was wrong with the data in your post; failed to add it to the project.");
            return;
        }
        notesListElement.innerHTML += `
        <li>
        <h3>${title}</h3> <br>
        <p>${body}</p> <br>
        </li>
        `;
        console.log('added a note');
    } else if (type === 'axiom') {
        const axiomsListElement = document.getElementById('axioms-list');
        axiomsListElement.innerHTML += `
        <li>
            <h3>${title}</h3> <br>
            <p>${body}</p> <br>
        </li>`;
        console.log('added an axiom');
    }
    void displayMessage(`Your ${type} titled ${title} has been added to the project!`);
    console.log(`added ${type} ${title} to the project`);
}

function sendJsonToBackend(json) {
    // connect to the backend and pass JSON through a POST request
    console.log('send json to backend placeholder');
}

// create a JSON object and then send it to the database
function saveNoteToProject(note, title) {
    sendJsonToBackend({
        timestamp: Date.now(),
        type: 'note',
        title: title,
        content: note,
        belongs_to: document.getElementById('project-title').textContent
    });
    console.log('saved note to project');

    addContent('note', title, note);
}

function saveAxiomToProject(axiom, title) {
    sendJsonToBackend({
        timestamp: Date.now(),
        type: 'axiom',
        title: title,
        content: axiom
    });
    console.log('saved axiom to project');

    addContent('axiom', title, axiom);
    console.log('saved axiom to project')
}

clearNoteEditor = () => {
    document.getElementById('note-editor-interface').value = '';
    document.getElementById('note-editor-title').value = '';
}

// listener for the 'jot note' button
addNoteElement.addEventListener('click', () => {
    const noteEditorElement = document.getElementById('realization-editor');
    noteEditorElement.style.display = 'block';
    ableToSubmit = true;
});

// listener for the 'Add realization to project' button in the realization editor
const noteEditorSubmitElement = document.getElementById('note-editor-submit');
noteEditorSubmitElement.addEventListener('click', () => {
    if (ableToSubmit === false) {
        alert('You cannot submit a note without adding a note. How did you even get here?');
        return;
    }

    if (document.getElementById('note-editor-interface').value === '') {
        alert('Your axiom is empty; you cannot submit it.');
        return;
    }

    saveNoteToProject(
        document.getElementById('note-editor-interface').value,
        document.getElementById('note-editor-title').value
    )

    document.getElementById('realization-editor').style.display = 'none';

    ableToSubmit = false;
    clearNoteEditor();
    console.log("submitted note");
});



// listener for the 'cancel' button in the realization editor
const noteEditorCancelElement = document.getElementById('note-editor-cancel');
noteEditorCancelElement.addEventListener('click', () => {
    const noteEditorElement = document.getElementById('realization-editor');
    noteEditorElement.style.display = 'none';
    ableToSubmit = false;
    clearNoteEditor();
});

// listener for the 'Develop an idea' button
developIdeaElement.addEventListener('click', () => {
    console.log('develop idea button clicked');
    const axiomEditorElement = document.getElementById('axiom-editor');
    axiomEditorElement.style.display = 'block';
    ableToSubmit = true;
    console.log('displayed axiom editor');
});

clearAxiomEditor = () => {
    document.getElementById('axiom-editor-interface').value = '';
    document.getElementById('axiom-editor-title').value = '';
};

// listener for the 'Add axiom to project' button in the axiom editor
const axiomEditorSubmitElement = document.getElementById('axiom-editor-submit');

axiomEditorSubmitElement.addEventListener('click', () => {
    if (ableToSubmit === false) {
        alert('You cannot submit a note without adding a note. How did you even get here?');
        return;
    }

    if (document.getElementById('axiom-editor-interface').value === '') {
        alert('Your axiom is empty; you cannot submit it.');
        return;
    }

    saveAxiomToProject(
        document.getElementById('axiom-editor-interface').value,
        document.getElementById('axiom-editor-title').value
    );

    document.getElementById('axiom-editor').style.display = 'none';
    ableToSubmit = false;
    clearAxiomEditor();
});

// listener for the 'cancel' button in the axiom editor
const axiomEditorCancelElement = document.getElementById('axiom-editor-cancel');
axiomEditorCancelElement.addEventListener('click', () => {
    const axiomEditorElement = document.getElementById('axiom-editor');
    axiomEditorElement.style.display = 'none';
    ableToSubmit = false;
    clearAxiomEditor();
});



// listener for the 'Publish your findings' button
publishFindingsElement.addEventListener('click', () => {
    alert('Sorry! This feature is not yet implemented.');
})

// listener for the 'See other choices' button
moreOptionsElement.addEventListener('click', () => {
    alert('Sorry! This feature is not yet implemented.');
})


const populateWithData = (projectData) => {
    let missionStatementElement = document.getElementById('mission-statement');
    missionStatementElement.textContent = projectData.goal;

    let projectTitleElement = document.getElementById('project-title');
    projectTitleElement.textContent = projectData.title;
}

const currentProject = localStorage.getItem('current_project');
const currentProjectData = JSON.parse(localStorage.getItem(`${currentProject}_creation_data`));

populateWithData(currentProjectData);
