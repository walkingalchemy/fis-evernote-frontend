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
      let ul = document.getElementById('note-list')
      for (const note of notes) {
        let title = document.createElement('li')
        title.innerText = note.title
        let body = document.createElement('p')
        body.innerText = note.body.slice(0,75) + '...'
        title.appendChild(body)
        ul.appendChild(title)
      }
    }


  }
})()
