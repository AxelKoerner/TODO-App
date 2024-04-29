import {Component, OnInit} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {HttpClient} from "@angular/common/http";
import {NgForOf} from "@angular/common";

interface Todo {
  _id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.scss'],
  standalone: true,
  imports: [MatGridListModule, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, NgForOf]
})

export class GridContainerComponent implements OnInit{
  registerForm: FormGroup;
  notesData: Todo[] = [];

  constructor(private http: HttpClient) {
    this.registerForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadTodos();
    console.log(this.notesData)
  }

  submitTodo() {
    const formData = this.registerForm.value;
    this.http.post<any>('http://localhost:3000/api/todo', formData)
      .subscribe(
        {
          next: (response) => {
            console.log('todo created successfully:', response)
            this.registerForm.reset()
          },
          error: (error) => {
            console.log('error creating todo', error)
          }
        })
  }

  loadTodos() {
    this.http.get<any>('http://localhost:3000/api/todo').subscribe({
      next: (response) => {
        this.notesData = response.todo;
        console.log(this.notesData)
      },
      error: (error) => {
        console.log('Error loading todos', error);
      }
    });
  }
}


