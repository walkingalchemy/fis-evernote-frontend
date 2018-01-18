const store = {
  users: [],
  notes: []
}


class App {
  static init() {

    App.loadNotes()

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


  // SUBMIT HANDLERS

  static handleNoteSubmit(event) {
    // prevent default behavior on form submit
    event.preventDefault()
    // get form values
    const noteTitle = document.getElementById('new-note-title').value
    const noteBody = document.getElementById('new-note-body').value
    // get list container
    let noteList = document.getElementById('note-list')
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



}


document.addEventListener('DOMContentLoaded', App.init)


document.addEventListener('DOMContentLoaded', function(event){
  let vertical = document.getElementById('vertical-edit')
  let noteList = document.getElementById('note-list')
  let currentNote = document.getElementById('current-note')

  // fetch('http://localhost:3000/api/v1/users/1')
  //   .then( res => res.json() )
  //   .then( function(res) {
  //     new User(res)
  //     for (const note of res['notes']) {
  //       new Note(note).renderPreview(noteList)
  //     }
  //     store.notes[`${store.notes.length -1}`].render()
  //   })


  //set event listeners

  // let plus = document.getElementById('new-note')
  // plus.addEventListener('click', handlePlusClick)
  //
  // let editor = document.getElementById('edit-note')
  // editor.addEventListener('click', handleEditorClick)
  //
  // let list = document.querySelector('#note-list')
  // list.addEventListener('click', handleNoteListClick)
  //
  // let deletor = document.getElementById('delete-note')
  // deletor.addEventListener('click', handleDeletorClick)


  //click handlers
  // function handleNoteListClick(event) {
  //   let ident = parseInt(event.path.find( el => el.className === 'note-stub').id.slice(4))
  //   store.notes.find( note => note.id === ident).render()
  //   let tilda = document.getElementById('edit-note')
  //   tilda.style.display = 'inherit'
  //   let minus = document.getElementById('delete-note')
  //   minus.style.display = 'inherit'
  // }

  // function handlePlusClick(event) {
  //   let tilda = document.getElementById('edit-note')
  //   tilda.style.display = 'none'
  //   let minus = document.getElementById('delete-note')
  //   minus.style.display = 'none'
  //   currentNote.innerHTML = ''
  //   let div = document.createElement('div')
  //   div.className = 'note-card'
  //   let newNoteForm = document.createElement('form')
  //   newNoteForm.innerHTML = `
  //     <label for="new-note-title">Title:</label>
  //     <input type="text" id="new-note-title" name="new-note-title" placeholder="Title">
  //     <label for="new-note-body">Note:</label>
  //     <input type="text" id="new-note-body" name="new-note-body" placeholder="Type here...">
  //     <input type="submit" value="Create New Note" id="note-submit">`
  //   div.appendChild(newNoteForm)
  //   currentNote.appendChild(div)
  //   newNoteForm.addEventListener('submit', handleNoteSubmit)
  // }

  function handleEditorClick() {
    let tilda = document.getElementById('edit-note')
    tilda.style.display = 'none'
    let minus = document.getElementById('delete-note')
    minus.style.display = 'none'

    let placeholderTitle = document.querySelector('.note-card').firstChild
    let placeholderBody = placeholderTitle.nextSibling
    let currentNoteId = document.querySelector('.note-card').id

    currentNote.innerHTML = ''
    let div = document.createElement('div')
    div.className = 'note-card'
    let editNoteForm = document.createElement('form')
    editNoteForm.innerHTML = `
      <label for="edit-note-title">Title:</label>
      <input type="text" id="edit-note-title" name="edit-note-title" placeholder=${placeholderTitle.innerText}>
      <label for="edit-note-body">Note:</label>
      <input type="text" id="edit-note-body" name="edit-note-body" placeholder=${placeholderBody.innerText}>
      <input type="hidden" id="edit-noteId" value=${currentNoteId}>
      <input type="submit" value="Edit Note" id="note-submit">`
    div.appendChild(editNoteForm)
    currentNote.appendChild(div)
    editNoteForm.addEventListener('submit', handleEditSubmit)
  }

  function handleDeletorClick() {
    let currentNoteId = document.querySelector('.note-card').id.slice(7)
    let URL = "http://localhost:3000/api/v1/notes/" + currentNoteId

    fetch(URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
    .then(res => res.json())
    .then(json => {
      const note = store.notes.find(n => n.id === json.noteId)
      store.notes.splice(store.notes.indexOf(note), 1)
      document.getElementById('note' + json.noteId).remove()
      currentNote.innerHTML = "<h2> Successfully Deleted!</h2>"
    })
  }


  //submit handlers

  // function handleNoteSubmit(event) {
  //   event.preventDefault()
  //   const inputTitle = document.getElementById('new-note-title')
  //   let noteTitle = inputTitle.value
  //   const inputBody = document.getElementById('new-note-body')
  //   let noteBody = inputBody.value
  //
  //   fetch('http://localhost:3000/api/v1/notes', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       title: noteTitle,
  //       body: noteBody,
  //       user_id: 1
  //     })
  //   })
  //   .then(res => res.json())
  //   .then(json => {
  //     const note = new Note(json)
  //     note.render()
  //     note.renderPreview(noteList)
  //   })
  // }

  function handleEditSubmit(event) {
    event.preventDefault()
    const inputNoteId = document.getElementById('edit-noteId')
    let noteId = inputNoteId.value.slice(7)
    const inputTitle = document.getElementById('edit-note-title')
    let noteTitle = inputTitle.value
    const inputBody = document.getElementById('edit-note-body')
    let noteBody = inputBody.value

    let URL = "http://localhost:3000/api/v1/notes/" + noteId

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
      const note = store.notes.find(n => n.id === json.id)
      note['title'] = json.title
      note['body'] = json.body
      note.render()
      note.renderPreview(noteList)
    })
  }

})
