import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  username = '';
  role = 'worker';

  upcomingShiftDate: string = 'No upcoming shifts scheduled.';
  pastWeekShiftCount: number = 0;
  highestEarningMonth: string = 'Data not available yet.';

  workerOfMonth: string = 'Loading...';
  pastWeekShiftsAll: any[] = []; 
  highestCompanyPayout: string = '$0.00';

  ngOnInit() {
    const session = localStorage.getItem('shiftly_session');
    if (session) {
      const data = JSON.parse(session);
      this.username = data.username;
      this.role = data.role || 'worker';
    }

    this.calculateStatistics();
  }

  calculateStatistics() {
    const allShifts = JSON.parse(localStorage.getItem('shiftly_shifts') || '[]');

    if (this.role === 'worker') {
      const myShifts = allShifts.filter((shift: any) => shift.username === this.username);
      
      if (myShifts.length > 0) {
        this.upcomingShiftDate = 'Calculation logic pending...';
      }
    } 
    else if (this.role === 'admin') {
      if (allShifts.length > 0) {
        this.workerOfMonth = 'Calculation logic pending...';
      } else {
        this.workerOfMonth = 'No shifts found.';
      }
    }
  }
}