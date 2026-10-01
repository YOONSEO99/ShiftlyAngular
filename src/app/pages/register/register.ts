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
  firstName = '';
  lastName = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  birthDate = '';
  role = 'worker';
  adminCode = '';
  errorMessage = '';

  router = inject(Router);

  onRegister(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.firstName || !this.lastName || !this.email || !this.username || !this.password || !this.confirmPassword || !this.birthDate) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    if (this.firstName.length < 2 || this.lastName.length < 2) {
      this.errorMessage = 'First name and Last name must be at least 2 characters long.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.username.length < 6 || this.password.length < 6) {
      this.errorMessage = 'Username and password must be at least 6 characters long.';
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(this.password);
    const hasNumber = /[0-9]/.test(this.password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(this.password);
    
    if (!hasLetter || !hasNumber || !hasSpecial) {
      this.errorMessage = 'A password must contain letters, numbers and a character that is neither a letter nor a number.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.role === 'admin' && this.adminCode !== 'shiftly_admin_2026') {
      this.errorMessage = 'Invalid Administrator Secret Code.';
      return;
    }

    const today = new Date();
    const birth = new Date(this.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 6 || age > 130) {
      this.errorMessage = 'Birth Date derived age must be between 6 and 130.';
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('shiftly_users') || '[]');

    const userExists = existingUsers.some((u: any) => u.username === this.username);
    if (userExists) {
      this.errorMessage = 'Username already exists.';
      return;
    }

    const newUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      birthDate: this.birthDate,
      username: this.username,
      password: this.password, 
      role: this.role
    };

    existingUsers.push(newUser);
    localStorage.setItem('shiftly_users', JSON.stringify(existingUsers));

    const expiresIn = 60 * 60 * 1000;
    const expirationTime = new Date().getTime() + expiresIn;
    const sessionData = { 
      username: this.username, 
      role: this.role, 
      expiry: expirationTime 
    };
    localStorage.setItem('shiftly_session', JSON.stringify(sessionData));

    this.router.navigate(['/home']);
  } 
}