const createProjectButton = document.getElementById('create-project');
const submitProjectFieldsButton = document.getElementById('project-submit');

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
    let thisProjectName = `${withData.title}_creation_data`;
    localStorage.setItem('current_project', withData.title);

    const organizedData = organizeCreationData(withData);

    localStorage.setItem(thisProjectName, organizedData);

    console.log('deposited data in localStorage:')
    console.log(organizedData);

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

    const hasSpecialCharacters = (title) => {return /[a-zA-Z]/.test(title)}

    if (hasSpecialCharacters(allCreationData.title)) {
        alert('Your project title contains special characters; please remove them.');
        return;
    }

    const projectCreatorElement = document.querySelector('.project-creation');
    projectCreatorElement.style.display = 'none';

    canSubmit = false;

    console.log('created project');
});



// populating homepage with projects
function populateProjectsList() {
    const projectsListElement = document.getElementById('projects-list');
    const globalJson = localStorage.getItem('current_project');
    if (globalJson === null) {
        console.log('Failed to locate the current_project file in localStorage.');
        return;
    }

    let parsedJson = JSON.parse(globalJson);
    let projectsList = parsedJson.projects;
    if (projectsList !== null && projectsList !== undefined) {
        const noProjectsElement = document.getElementById('no-projects');
        noProjectsElement.style.display = 'none';
    }

    projectsList.forEach(project => {
        projectsListElement.innerHTML += `
   <li>
   <p>Project name: ${project.name}</p>
   <p>Project goal: ${project.goal}</p>
   </li>`;
    });
}

