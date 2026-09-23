import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  role = 'worker';
  errorMessage = '';

  router = inject(Router);

  onLogin(event: Event){
    event.preventDefault();
    this.errorMessage='';

    if(this.username.length <6 || this.password.length<6){
      this.errorMessage = 'Username and password must be at least character long.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('shiftly_users') || '[]');
    const foundUser = users.find((u: any) => u.username === this.username && u.password === this.password);

    if (!foundUser) {
      this.errorMessage = 'Invalid username or password.';
      return; 
    }

    const expiresIn = 60 * 60 * 1000;
    const expirationTime = new Date().getTime() + expiresIn;

    const sessionData = { 
      username: foundUser.username, 
      role: foundUser.role, 
      expiry: expirationTime 
    };

    localStorage.setItem('shiftly_session',JSON.stringify(sessionData));

    this.router.navigate(['home']);
  }

}
