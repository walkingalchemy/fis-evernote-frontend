let test = ['hello shahin']
const store = {
  users: [],
  notes: []
}



document.addEventListener('DOMContentLoaded', function(event){
  let vertical = document.getElementById('vertical-edit')
  let noteList = document.getElementById('note-list')
  let currentNote = document.getElementById('current-note')

  let sqrl = new User('Squirrel')
  new Note('I like nuts', 'These damn things are so damn good.  Now where the hell did I leave them?', sqrl)
  new Note('I like knuts', 'These damn things are so damn valuable.  Now where the hell did I leave my gringots key?', sqrl)
  new Note('I like seeds', 'These damn things are so damn crunchy.  Now where the hell did I leave that birdfeeder?', sqrl)

  sqrl.renderNoteList()
  sqrl.notes()[0].render()

  // document.getQuerySelectorAll('.note-stub').forEach(function(note) {
  //   note.addEventListener('click', function(){
  // })

})
