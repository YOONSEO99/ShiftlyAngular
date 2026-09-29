import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  birthDate = '';
  password = '';
  passwordConfirm = '';

  errorMessage = '';
  isSaving = false;
  
  username = '';
  router = inject(Router);

  ngOnInit() {
    const session = localStorage.getItem('shiftly_session');
    if (session) {
      this.username = JSON.parse(session).username;
      this.loadUserData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserData() {
    const allUsers = JSON.parse(localStorage.getItem('shiftly_users') || '[]');
    const currentUser = allUsers.find((u: any) => u.username === this.username);

    if (currentUser) {
      this.firstName = currentUser.firstName || '';
      this.lastName = currentUser.lastName || '';
      this.email = currentUser.email || '';
      this.birthDate = currentUser.birthDate || '';
    } else {
      alert('User data not found!');
      this.router.navigate(['/home']);
    }
  }

  onUpdate(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.firstName || !this.lastName || !this.email || !this.birthDate) {
      this.errorMessage = 'Please fill out all required fields (First name, Last name, Email, Birth date).';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.password || this.passwordConfirm) {
      if (this.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters long.';
        return;
      }
      if (this.password !== this.passwordConfirm) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }
    }

    this.isSaving = true;

    setTimeout(() => {
      const allUsers = JSON.parse(localStorage.getItem('shiftly_users') || '[]');
      const userIndex = allUsers.findIndex((u: any) => u.username === this.username);

      if (userIndex !== -1) {
        allUsers[userIndex].firstName = this.firstName;
        allUsers[userIndex].lastName = this.lastName;
        allUsers[userIndex].email = this.email;
        allUsers[userIndex].birthDate = this.birthDate;
        
        if (this.password) {
          allUsers[userIndex].password = this.password;
        }

        localStorage.setItem('shiftly_users', JSON.stringify(allUsers));
        
        this.isSaving = false;
        alert('Profile updated successfully!');
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Error saving profile data.';
        this.isSaving = false;
      }
    }, 1500);
  }
}