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

    }

  }
})()
