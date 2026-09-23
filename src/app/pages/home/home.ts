import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  username = '';
  role = 'worker';

  ngOnInit(): void {
      const session = localStorage.getItem('shiftly_session');
      if (session){
        const data = JSON.parse(session);
        this.username = data.username;
        this.role= data.role || 'worker';
      }
  }
}
