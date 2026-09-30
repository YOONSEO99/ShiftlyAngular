import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-workers',
  imports: [CommonModule],
  templateUrl: './all-workers.html',
  styleUrl: './all-workers.css'
})
export class AllWorkers implements OnInit {
  workers: any[] = [];
  router = inject(Router);

  ngOnInit() {
    const sessionStr = localStorage.getItem('shiftly_session');
    if (!sessionStr) {
      this.router.navigate(['/login']);
      return;
    }

    const session = JSON.parse(sessionStr);
    
    if (session.role !== 'admin') {
      alert('Access denied. Administrators only.');
      this.router.navigate(['/home']);
      return;
    }

    this.loadWorkers();
  }

  loadWorkers() {
    const users = JSON.parse(localStorage.getItem('shiftly_users') || '[]');
    this.workers = users.filter((u: any) => u.role === 'worker' || !u.role);
  }

  editWorker(username: string) {
    this.router.navigate(['/edit-profile', username]);
  }
}