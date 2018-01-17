const User = (function(){
  userId = 0

  return class User {
    constructor(name){
      this.id = ++userId
      this.name = name
      store.users.push(this)
    }

    notes() {
      return store.notes.filter(note => { return note.user === this})
    }

    renderNoteList(){
      let notes = this.notes()
      let mainDiv = document.getElementById('note-list')
      let head = document.createElement('h2')
      head.innerText = this.name + "'s Notes"
      mainDiv.appendChild(head)
      for (const note of notes) {
        let noteDiv = document.createElement('div')
        noteDiv.id = 'note' + note.id
        noteDiv.className = 'note-stub'
        let title = document.createElement('h4')
        title.innerText = note.title
        let body = document.createElement('p')
        body.innerText = note.body.slice(0,75) + '...'
        noteDiv.appendChild(title)
        noteDiv.appendChild(body)
        mainDiv.appendChild(noteDiv)
      }
    }


  }
})()
