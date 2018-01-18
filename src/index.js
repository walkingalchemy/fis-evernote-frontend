const store = {
  users: [],
  notes: []
}


class App {
  static init() {
    // load notes from db on page load
    App.loadNotes()
    // set event listeners on page load
    let creator = document.getElementById('new-note')
    creator.addEventListener('click', App.handleCreatorClick)

    let editor = document.getElementById('edit-note')
    editor.addEventListener('click', App.handleEditorClick)

    let list = document.querySelector('#note-list')
    list.addEventListener('click', App.handleNoteListClick)

    let deletor = document.getElementById('delete-note')
    deletor.addEventListener('click', App.handleDeletorClick)

  }

  static loadNotes() {
    //get note list container
    let noteList = document.getElementById('note-list')
    // request all of a user's notes from backend
    fetch('http://localhost:3000/api/v1/users/1')
      .then( res => res.json() )
      .then( function(res) {
        // instantiate each note returned from backend into a frontend note and
        // render to list container
        for (const note of res['notes']) {
          new Note(note).renderPreview(noteList)
        }
        // render latest note to current note container
        store.notes[`${store.notes.length -1}`].render()
      })
  }


  // CLICK HANDLERS

  // SELECT FROM LIST
  static handleNoteListClick(event) {
    //find the note that was clicked and render it to the current note
    let ident = event.path.find( el => el.className === 'note-stub').dataset.id
    store.notes.find( note => note.id === parseInt(ident)).render()
    // hide the elements that are not currently available
    let tilda = document.getElementById('edit-note')
    tilda.style.display = 'inherit'
    let minus = document.getElementById('delete-note')
    minus.style.display = 'inherit'
  }

  // CREATE NEW
  static handleCreatorClick(event) {
    // hide the elements that are not currently available
    let tilda = document.getElementById('edit-note')
    tilda.style.display = 'none'
    let minus = document.getElementById('delete-note')
    minus.style.display = 'none'
    // render new note form
    let div = document.createElement('div')
    div.className = 'note-card'
    let newNoteForm = document.createElement('form')
    newNoteForm.innerHTML = `
      <label for="new-note-title">Title:</label>
      <input type="text" id="new-note-title" name="new-note-title" placeholder="Title">
      <label for="new-note-body">Note:</label>
      <input type="text" id="new-note-body" name="new-note-body" placeholder="Type here...">
      <input type="submit" value="Create New Note" id="note-submit">`
    div.appendChild(newNoteForm)
    // clear current note container
    const currentNote = document.getElementById('current-note')
    currentNote.innerHTML = ''
    // add new note form to current note container
    currentNote.appendChild(div)
    // add event listener to new note form on submit
    newNoteForm.addEventListener('submit', App.handleNoteSubmit)
  }

  static handleNoteSubmit(event) {
    // get list container
    let noteList = document.getElementById('note-list')
    // prevent default behavior on form submit
    event.preventDefault()
    // get form values
    const noteTitle = document.getElementById('new-note-title').value
    const noteBody = document.getElementById('new-note-body').value
    // post form contents to new note route
    fetch('http://localhost:3000/api/v1/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: noteTitle,
        body: noteBody,
        user_id: 1
      })
    })
    // parse json return
    .then(res => res.json())
    // use json to create a new note and display it in the current note and list
    .then(json => {
      const note = new Note(json)
      note.render()
      note.renderPreview(noteList)
    })
  }

  // EDIT
  static handleEditorClick(event) {
    // hide elements that are not currently available
    let tilda = document.getElementById('edit-note')
    tilda.style.display = 'none'
    let minus = document.getElementById('delete-note')
    minus.style.display = 'none'
    // get current note id and find it in store
    const editNoteId = document.querySelector('.note-card').dataset.id
    const editNote = store.notes.find( note => note.id === parseInt(editNoteId))

    // render editor form with values containing current data
    let div = document.createElement('div')
    div.className = 'note-card'
    let editNoteForm = document.createElement('form')
    editNoteForm.innerHTML = `
      <label for="edit-note-title">Title:</label>
      <input type="text" id="edit-note-title" name="edit-note-title" value=${editNote.title}>
      <label for="edit-note-body">Note:</label>
      <input type="text" id="edit-note-body" name="edit-note-body" value=${editNote.body}>
      <input type="hidden" id="edit-noteId" value=${editNoteId}>
      <input type="submit" value="Edit Note" id="note-submit">`
    div.appendChild(editNoteForm)
    // clear current note container
    const currentNote = document.getElementById('current-note')
    currentNote.innerHTML = ''
    // add edit form to current note container
    currentNote.appendChild(div)
    // add submit listener for edit form
    editNoteForm.addEventListener('submit', App.handleEditSubmit)
  }

  static handleEditSubmit(event) {
    // get list container
    const noteList = document.getElementById('note-list')
    // prevent default behavior of edit submit button
    event.preventDefault()
    // get form values from edit note form
    const noteId = document.getElementById('edit-noteId').value
    const noteTitle = document.getElementById('edit-note-title').value
    const noteBody = document.getElementById('edit-note-body').value
    // set edit url with current note id
    let URL = "http://localhost:3000/api/v1/notes/" + noteId
    // patch request with current note id and edit form values
    fetch(URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: noteTitle,
        body: noteBody
      })
    })
    .then(res => res.json())
    .then(json => {
      // edit store note with values returned from patch request
      const note = store.notes.find(note => note.id === json.id)
      note['title'] = json.title
      note['body'] = json.body
      // render edited note to current note container and list
      note.render()
      note.renderPreview(noteList)
    })
  }

  // DELETE

  static handleDeletorClick() {
    // get selected note id and add it into the api url
    let currentNoteId = document.querySelector('.note-card').dataset.id
    let URL = "http://localhost:3000/api/v1/notes/" + currentNoteId
    // send delete request to backend
    fetch(URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
    .then(res => res.json())
    .then(json => {
      // use response note id to find and delete the note from the store
      const note = store.notes.find(n => n.id === json.noteId)
      store.notes.splice(store.notes.indexOf(note), 1)
      // remove deleted note from all places in dom
      for (let node of document.querySelectorAll(`[data-id='${json.noteId}']`)){
        node.remove()
      }
      const currentNote = document.getElementById('current-note')
      currentNote.innerHTML = "<h2> Successfully Deleted!</h2>"
    })
  }




}


document.addEventListener('DOMContentLoaded', App.init)
