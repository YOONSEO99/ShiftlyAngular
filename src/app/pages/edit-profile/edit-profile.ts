import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 

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
  
  loggedInUser = ''; 
  targetUsername = ''; 
  isAdmin = false;

  router = inject(Router);
  route = inject(ActivatedRoute); 

  ngOnInit() {
    const sessionStr = localStorage.getItem('shiftly_session');
    if (!sessionStr) {
      this.router.navigate(['/login']);
      return;
    }

    const session = JSON.parse(sessionStr);
    this.loggedInUser = session.username;
    this.isAdmin = session.role === 'admin';

    const paramUsername = this.route.snapshot.paramMap.get('username');

    if (paramUsername) {
      if (this.isAdmin) {
        this.targetUsername = paramUsername; 
      } else {
        alert('Access denied. You can only edit your own profile.');
        this.router.navigate(['/edit-profile']);
        return;
      }
    } else {
      this.targetUsername = this.loggedInUser; 
    }

    this.loadUserData();
  }

  loadUserData() {
    const allUsers = JSON.parse(localStorage.getItem('shiftly_users') || '[]');
    const currentUser = allUsers.find((u: any) => u.username === this.targetUsername);

    if (currentUser) {
      this.firstName = currentUser.firstName || '';
      this.lastName = currentUser.lastName || '';
      this.email = currentUser.email || '';
      this.birthDate = currentUser.birthDate || '';
    } else {
      alert('User data not found!');
      this.router.navigate(this.isAdmin ? ['/all-workers'] : ['/home']);
    }
  }

  onUpdate(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.firstName || !this.lastName || !this.email || !this.birthDate) {
      this.errorMessage = 'Please fill out all required fields (First name, Last name, Email, Birth date).';
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

    if (this.password || this.passwordConfirm) {
      if (this.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters long.';
        return;
      }

      const hasLetter = /[a-zA-Z]/.test(this.password);
      const hasNumber = /[0-9]/.test(this.password);
      const hasSpecial = /[^a-zA-Z0-9]/.test(this.password);
      
      if (!hasLetter || !hasNumber || !hasSpecial) {
        this.errorMessage = 'A password must contain letters, numbers and a character that is neither a letter nor a number.';
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
      const userIndex = allUsers.findIndex((u: any) => u.username === this.targetUsername);

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

  goToFilterShifts() {
    this.router.navigate(['/all-shifts'], { queryParams: { worker: this.targetUsername } });
  }

  deleteWorker() {
    if (confirm('Are you sure you want to delete this worker?')) {
      const allUsers = JSON.parse(localStorage.getItem('shiftly_users') || '[]');
      const updatedUsers = allUsers.filter((u: any) => u.username !== this.targetUsername);
      localStorage.setItem('shiftly_users', JSON.stringify(updatedUsers));
      
      const allShifts = JSON.parse(localStorage.getItem('shiftly_shifts') || '[]');
      const updatedShifts = allShifts.filter((s: any) => s.username !== this.targetUsername);
      localStorage.setItem('shiftly_shifts', JSON.stringify(updatedShifts));
      
      alert('Worker deleted successfully!');
      this.router.navigate(['/home']);
    }
  }
}