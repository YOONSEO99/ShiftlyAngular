import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  username = '';
  password = '';
  confirmPassword = '';
  birthDate = '';
  role = 'worker';
  adminCode = '';
  errorMessage = '';

  router = inject(Router);

  onRegister(event:Event){
    event.preventDefault();
    this.errorMessage = '';

    if (this.username.length<6 || this.password.length <6){
      this.errorMessage = 'Username and password must be at least 6 characters long.';
      return;
    }

    if(this.password!==this.confirmPassword){
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if(this.role === 'admin' && this.adminCode !== 'shiftly_admin_2026'){
      this.errorMessage = 'Invalid Administrator Secret Code.';
      return;
    }

    if(!this.birthDate){
      this.errorMessage = 'Please enter your birth date.';
      return;
    }

    const today = new Date();
    const birth = new Date(this.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if(m<0 || (m===0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if(age<18){
      this.errorMessage = 'You must be at least 18 years old to register.';
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('shiftly_usres') || '[]');

    const userExists = existingUsers.some((u: any) => u.username === this.username);
    if (userExists) {
      this.errorMessage = 'Username already exists.';
      return;
    }

    const newUser = {
      username: this.username,
      password: this.password, 
      role: this.role
    };

    existingUsers.push(newUser);
    localStorage.setItem('shiftly_users', JSON.stringify(existingUsers));

    alert('Registration successful! Please login.');
    this.router.navigate(['/login']);
  } 
}
