const createProjectButton         = document.getElementById('create-project');
const submitProjectFieldsButton   = document.getElementById('project-submit');
const cancelProjectCreationButton = document.getElementById('project-creation-cancel');

const projectTitleField           = document.getElementById('project-title');
const projectGoalField            = document.getElementById('project-goal');

const surveyCheckbox              = document.getElementById('project-survey-checkbox');
const surveyFields                = document.getElementById('create-project-survey');
const surveyInfo                  = document.getElementById('survey-info');
const seeMoreInfoButton           = document.getElementById('more-project-survey-info');

const projectCreatorElement            = document.querySelector('.project-creation');

// this is definitely not the best way to do this
const surveyQuestion1              = document.getElementById('survey-question-1');
const surveyAnswer1                = document.getElementById('survey-answer-1');

const surveyQuestion2              = document.getElementById('survey-question-2');
const surveyAnswer2                = document.getElementById('survey-answer-2');

const surveyQuestion3              = document.getElementById('survey-question-3');
const surveyAnswer3                = document.getElementById('survey-answer-3');

const projectName                  = document.getElementById('project-name');
const openProjectButton            = document.getElementById('open-project-button');
const clearProjectButton           = document.getElementById('clear-project-button');

let displayingSurveyFields = false;
let displayingMoreSurveyInfo = false;

// this may need fixing
function getFilledSurveyFields() {
    let filledFields = [];
    // find fields that have both a question and an answer
    for (let i = 1; i <= 3; i++) {
        const question = document.getElementById(`survey-question-${i}`);
        const answer = document.getElementById(`survey-answer-${i}`);
        if (question.value !== '' && answer.value !== '') {
            filledFields.push([question.value, answer.value]);
        }
    }
    console.log('filled fields:');
    console.log(filledFields);
    return filledFields;
}

function getAllCreationData() {
    return {
        title: projectTitleField.value,
        goal: projectGoalField.value,
        survey: getFilledSurveyFields()
    };
}

// needs refactoring eventually
function verifySurveyFields() {
    if (surveyQuestion1.value === '' || surveyAnswer1.value === '') {
        alert("You must at least fill out and answer the first question.");
        return false;
    }
    if (surveyQuestion2.value === '' && surveyAnswer2.value !== '' || surveyQuestion2.value !== '' && surveyAnswer2.value === '') {
        alert("You only partially filled out the second question. Either answer it fully or leave it blank.");
        return false;
    }
    if (surveyQuestion3.value === '' && surveyAnswer3.value !== '' || surveyQuestion3.value !== '' && surveyAnswer3.value === '') {
        alert("You only partially filled out the third question. Either answer it fully or leave it blank.");
        return false;
    }
    return true;
}

function verifyGivenData(givenData) {
    if (givenData.title === '') {
        alert('You must fill out the title.');
        return false;
    }
    if (givenData.goal === '') {
        alert('You need to fill out the mission statement');
        return false;
    }
    if (displayingSurveyFields) {
        if (!verifySurveyFields()) {
            return false;
        }
    }
    return true;
}

function seeMoreInfo() {
    if (displayingMoreSurveyInfo) {
        surveyInfo.style.display = 'none';
        displayingMoreSurveyInfo = false;
        return;
    }
    surveyInfo.style.display = 'block';
    displayingMoreSurveyInfo = true;
}

function surveyCheckboxClicked() {
    if (displayingSurveyFields) {
        surveyFields.style.display = 'none';
        displayingSurveyFields = false
        return;
    }
    surveyFields.style.display = 'block';
    displayingSurveyFields = true;
}

function createProject(withData) {
    localStorage.setItem('config', JSON.stringify(withData));
    window.location.href = '../views/research_project.html';
}

function submitProject() {
    const allCreationData = getAllCreationData();
    if (verifyGivenData(allCreationData)) {
        createProject(allCreationData);
    }
    projectCreatorElement.style.display = 'none';
}

createProjectButton.addEventListener('click', () => {
    projectCreatorElement.style.display = 'block';
});

cancelProjectCreationButton.addEventListener('click', () => {
    projectCreatorElement.style.display = 'none';
});

submitProjectFieldsButton.addEventListener('click', () => {
    submitProject();
});

surveyCheckbox.addEventListener('change', () => {
    surveyCheckboxClicked();
});

seeMoreInfoButton.addEventListener('click', () => {
    seeMoreInfo();
});

openProjectButton.addEventListener('click', () => {
        window.location.href = './research_project.html';
});

clearProjectButton.addEventListener('click', () => {
   if (confirm("Are you sure you want to clear the project? This cannot be reversed.")) {
       localStorage.removeItem("save_file");
       console.log('eradicated save file');
   }
})

const data = localStorage.getItem('config');
const name = JSON.parse(data).title;
projectName.innerText = name;

console.log(name);

