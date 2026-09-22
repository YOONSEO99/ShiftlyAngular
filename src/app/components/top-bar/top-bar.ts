import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, CommonModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar implements OnInit {
  username: string | null = null;
  router = inject(Router);
  ngOnInit(): void {
      const session = localStorage.getItem('shiftly_session');
      if(session){
        this.username = JSON.parse(session).username;
      }
  }

  logout(event:Event){
    event.preventDefault();
    localStorage.removeItem('shiftly_session');
    this.username = null;
    this.router.navigate(['/login']);
  }
}
