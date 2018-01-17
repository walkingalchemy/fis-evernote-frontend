const Note = (function(){
  noteId = 0

  return class Note {
    constructor(title, body, user = false){
      this.id = ++noteId
      this.title = title
      this.body = body
      if (user) {this.user = user}
      store.notes.push(this)
    }


    render(){
      let container = document.getElementById('current-note')
      let div = document.createElement('div')
      div.className = 'note-card'
      let title = document.createElement('h3')
      title.innerText = this.title
      let body = document.createElement('p')
      body.innerText = this.body
      div.appendChild(title)
      div.appendChild(body)
      container.appendChild(div)
    }

  }
})()
