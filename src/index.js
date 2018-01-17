const store = {
  users: [],
  notes: []
}


document.addEventListener('DOMContentLoaded', function(event){
  let vertical = document.getElementById('vertical-edit')
  let noteList = document.getElementById('note-list')
  let currentNote = document.getElementById('current-note')

  // let sqrl = new User('Squirrel')
  // new Note('I like nuts', 'These damn things are so damn good.  Now where the hell did I leave them?', sqrl)
  // new Note('I like knuts', 'These damn things are so damn valuable.  Now where the hell did I leave my gringots key?', sqrl)
  // new Note('I like seeds', 'These damn things are so damn crunchy.  Now where the hell did I leave that birdfeeder?', sqrl)
  //
  // sqrl.renderNotePreviews()
  // sqrl.notes()[0].render()


  // this should really be a function on the User class if we were building that functionality out
  fetch('http://localhost:3000/api/v1/users/3')
    .then( res => res.json() )
    .then( function(res) {
      new User(res)
      for (const note of res['notes']) {
        new Note(note).renderPreview(noteList)
      }
    })


  let list = document.querySelector('#note-list')
  list.addEventListener('click', handleNoteListClick)

  function handleNoteListClick(event) {
    let ident = parseInt(event.path.find( el => el.className === 'note-stub').id.slice(4))
    store.notes.find( note => note.id === ident).render()


  }

})
