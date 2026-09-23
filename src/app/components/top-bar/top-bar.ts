import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs'; // 💡 rxjs에서 filter 추가

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, CommonModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar implements OnInit {
  username: string | null = null;
  role: string | null = null;
  showTopBar: boolean = false; 
  
  router = inject(Router);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkSession();
      
      const url = event.urlAfterRedirects || event.url;
      if (url.includes('/login') || url.includes('/register')) {
        this.showTopBar = false;
      } else {
        this.showTopBar = true;
      }
    });

    this.checkSession();
  }

  checkSession() {
    const session = localStorage.getItem('shiftly_session');
    if (session) {
      const data = JSON.parse(session);
      this.username = data.username;
      this.role = data.role;
    } else {
      this.username = null;
      this.role = null;
    }
  }

  logout(event: Event) {
    event.preventDefault(); 
    localStorage.removeItem('shiftly_session');
    this.username = null;
    this.role = null;
    this.showTopBar = false; 
    this.router.navigate(['/login']);
  }
}