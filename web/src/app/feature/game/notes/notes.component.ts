import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Note, NotePrivacy } from 'src/app/core/model/note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent {
  shared: NotePrivacy = NotePrivacy.Public;
  dm: NotePrivacy = NotePrivacy.DM;
  private: NotePrivacy = NotePrivacy.Private;
  filtersListControl = new FormControl('filters');
  notes: Note[] = [
    {
      id: '1',
      title: 'Note shared by DM',
      author: 'me',
      privacy: NotePrivacy.DM,
      content: 'some test note from dm',
    },
    {
      id: '2',
      title: 'Super Private',
      author: 'definitely not me',
      privacy: NotePrivacy.Private,
      content: 'Private note of some player',
    },
    {
      id: '3',
      title: 'Hear Ye, Hear Ye',
      author: 'also not me',
      privacy: NotePrivacy.Public,
      content: 'Someones public note',
    },
  ];

  filterNotes(note: Note): Boolean {
    return this.filtersListControl.get('filters')?.value.includes(note.privacy);
  }

  addNote(): void {
    console.error('addNote not implemented');
    throw new Error('addNote not implemented');
  }
}
