
// listener for the 'Add realization to project' button in the realization editor
noteEditorSubmitElement.addEventListener('click', () => {
    handleNoteEditorSubmit();
});

submitSurveyRetake.addEventListener('click', () => {
    handleSurveyRetakeSubmission();
});

// listener for the 'cancel' button in the realization editor
noteEditorCancelElement.addEventListener('click', () => {
    noteEditorElement.style.display = 'none';
    clearNoteEditor(); // clear the data in the fields
});

// listener for the 'Develop an idea' button
developIdeaElement.addEventListener('click', () => {
    display(axiomEditorElement);
});

retakeSurveyElement.addEventListener('click', () => {
    handleRetakeSurveyElementClick()
});

// listener for the 'Add axiom to project' button in the axiom editor
axiomEditorSubmitElement.addEventListener('click', () => {
    handleAxiomEditorSubmit()
});

// listener for the 'cancel' button in the axiom editor
axiomEditorCancelElement.addEventListener('click', () => {
    hide(axiomEditorElement);
    clearAxiomEditor(); // clear the text fields
});

saveDataElement.addEventListener('click', () => {
    saveData();
});

loadDataElement.addEventListener('click', () => {
    log('load data button clicked');
    restoreAxiomsAndNotes();
});

reviewPreSurveyElement.addEventListener('click', () => {
    handlePreSurveyReview();
});

// listener for the 'jot note' button
addNoteElement.addEventListener('click', () => {
    display(noteEditorElement);
});

reviewPostSurveyElement.addEventListener('click', () => {
    handlePostSurveyReview();
})