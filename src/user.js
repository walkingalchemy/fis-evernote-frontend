class User {
    constructor({id,name}){
      this.id = id
      this.name = name
      store.users.push(this)
    }

    notes() {
      return store.notes.filter(note => { return note.user === this})
    }

    renderNotePreviews(){
      let notes = this.notes()
      let noteListDiv = document.getElementById('note-list')
      let head = document.createElement('h2')
      head.innerText = this.name + "'s Notes"
      noteListDiv.appendChild(head)
      for (const note of notes) {
        note.renderPreview(noteListDiv)
      }
    }


  }
