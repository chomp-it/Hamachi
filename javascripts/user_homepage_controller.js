const createProjectButton = document.getElementById('create-project');
const submitProjectFieldsButton = document.getElementById('submit-project-fields');

let canSubmit = false;

// returns a dictionary of creation data; a key value field of the field name and the entry
function getAllCreationData() {
    const projectTitleField = document.getElementById('project-title');
    const projectGoalField = document.getElementById('project-goal');
    return {
        title: projectTitleField.value,
        goal: projectGoalField.value
    };
}

function verifyGivenData(givenData) {
    if (givenData.title === '' || givenData.goal === '') {
        alert('One or more fields are empty; please fill them out.');
        return false;
    }
    if (givenData.title.length > 20) {
        alert('Your project title is too long; please shorten it.');
        return false;
    }
    if (givenData.goal.length > 150) {
        alert('Your project goal is too long; please shorten it.');
        return false;
    }
    return givenData;
}

const organizeCreationData = (givenData) => { return JSON.stringify(givenData) }

function createProject(withData) {
    // replace this with the real logic once the backend is fully set up:

    // this part is actually universal:
    localStorage.setItem('current_project', withData.title);
    localStorage.setItem(`${withData.title}_creation_data`, withData);

    window.location.href = '../views/research_project.html';
}

createProjectButton.addEventListener('click', () => {
    const projectCreatorElement = document.querySelector('.project-creation');
    projectCreatorElement.style.display = 'block';
    canSubmit = true;
});


submitProjectFieldsButton.addEventListener('click', () => {
    if (canSubmit === false) {
        alert('You cannot submit a project without filling out the fields. How did you even get here?');
        return;
    }

    const allCreationData = getAllCreationData();
    if (verifyGivenData(allCreationData)) {
        createProject(allCreationData);
    }

    const projectCreatorElement = document.querySelector('.project-creation');
    projectCreatorElement.style.display = 'none';

    canSubmit = false;
});

