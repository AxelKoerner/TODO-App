import {Component, OnInit} from '@angular/core';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.scss'],
  standalone: true,
  imports: [MatGridListModule, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule]
})

export class GridContainerComponent implements OnInit{
  registerForm: FormGroup;

  constructor(private http: HttpClient) {
    this.registerForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadTodos();
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
    const res = this.http.get<any>('http://localhost:3000/api/todo').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log('Error loading todos', error);
      }
    });
    console.log(res);
  }
}


