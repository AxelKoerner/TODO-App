import {Component, OnInit} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';

interface Todo {
  _id: string;
  title: string;
  description: string;
}

interface editableNotes {
  [key: string]: boolean;
}

@Component({
  selector: 'app-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.scss'],
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgForOf,
    MatDividerModule,
    MatIconModule,
    NgIf,
  ]
})

export class GridContainerComponent implements OnInit{
  registerForm: FormGroup;
  editForm: FormGroup;
  notesData: Todo[] = [];
  addNotesVisibly: boolean = false;
  editableNotes: editableNotes[] = [];

  constructor(private http: HttpClient) {
    this.registerForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
    this.editForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadTodos();
  }

  toggleEdit(title: string) {
    const ind = this.editableNotes.findIndex(obj => obj.hasOwnProperty(title))
    this.editableNotes[ind][title] = !this.editableNotes[ind][title];
  }

  loadEditable() {
    for(let todo in this.notesData) {
      this.editableNotes.push({[this.notesData[todo].title]: false});
    }
  }

  checkEditable(title: string) {
    const result = this.editableNotes.find(obj => obj.hasOwnProperty(title));
    return result ? result[title] : false;
  }

  toggleAddNoteVisibility() {
    this.addNotesVisibly  = !this.addNotesVisibly;
  }

  deleteTodo(title: any) {
    this.http.delete('http://localhost:3000/api/todo', {params: {title}}).subscribe({
      //problem is here because title is not being given over correctly
      next: (response) => {
        console.log('todo deleted successfully:', response)
        this.loadTodos();
      },
      error: (error) => {
        console.log('error deleting todo', error)
      }
    })
  }

  submitTodo() {
    const formData = this.registerForm.value;
    this.http.post<any>('http://localhost:3000/api/todo', formData)
      .subscribe(
        {
          next: (response) => {
            console.log('todo created successfully:', response)
            this.findTodo(formData.title)
            this.registerForm.reset();
            this.addNotesVisibly = false;
          },
          error: (error) => {
            console.log('error creating todo', error)
          }
        })
  }

  editTodo(title: string) {
    this.editForm.value.title = title;
    const formData = this.editForm.value;
    console.log(formData);
    this.toggleEdit(formData.title);
    this.http.put<any>('http://localhost:3000/api/todo', formData)
      .subscribe({
      next: (response) => {
        console.log('todo edited successfully:', response);
        this.loadTodos();
        this.editForm.reset()
      },
      error: (error) => {
        console.log('error editing todo:', error);
      }
    })
  }

  findTodo(title: string) {
    this.http.get<any>('http://localhost:3000/api/todo/find', {params: {title}}).subscribe({
      next: (response) => {
        console.log(response.todo)
        this.notesData.unshift(response.todo);
        console.log(this.notesData)
      },
      error: (error) => {
        console.log('Error finding todo', error);
      }
    })
  }

  loadTodos() {
    this.http.get<any>('http://localhost:3000/api/todo').subscribe({
      next: (response) => {
        this.notesData = response.todo;
        this.loadEditable();
      },
      error: (error) => {
        console.log('Error loading todos', error);
      }
    });
  }
}


