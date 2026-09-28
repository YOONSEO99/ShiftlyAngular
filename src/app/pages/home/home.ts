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
  pastWeekShiftsList: any[] = [];
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
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    if (this.role === 'worker') {
      const myShifts = allShifts.filter((shift: any) => shift.username === this.username);
      
      if (myShifts.length === 0) return;

      const upcomingShifts = myShifts.filter((s: any) => new Date(s.date) >= today);
      upcomingShifts.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      if (upcomingShifts.length > 0) {
        this.upcomingShiftDate = `${upcomingShifts[0].date} (${upcomingShifts[0].workplace})`;
      }

      this.pastWeekShiftsList = myShifts.filter((s: any) => {
        const d = new Date(s.date);
        return d >= oneWeekAgo && d < today;
      });

      const monthlyEarnings: { [key: string]: number } = {};

      myShifts.forEach((shift: any) => {
        const monthYear = shift.date.substring(0, 7); 
        
        const start = new Date(`1970-01-01T${shift.startTime}:00`);
        const end = new Date(`1970-01-01T${shift.endTime}:00`);
        let diffMs = end.getTime() - start.getTime();
        
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; 
        
        const hours = diffMs / (1000 * 60 * 60);
        const earnings = hours * Number(shift.hourlyWage);

        monthlyEarnings[monthYear] = (monthlyEarnings[monthYear] || 0) + earnings;
      });

      let maxMonth = 'Data not available yet.';
      let maxEarnings = 0;

      for (const [month, earnings] of Object.entries(monthlyEarnings)) {
        if (earnings > maxEarnings) {
          maxEarnings = earnings;
          maxMonth = `${month} ($${earnings.toFixed(2)})`;
        }
      }
      this.highestEarningMonth = maxMonth;
    } 
    else if (this.role === 'admin') {
      if (allShifts.length === 0) {
        this.workerOfMonth = 'No shifts found.';
        return;
      }

      const workerCounts: { [key: string]: number } = {};
      allShifts.forEach((s: any) => {
        workerCounts[s.username] = (workerCounts[s.username] || 0) + 1;
      });

      let topWorker = '';
      let maxShifts = 0;
      for (const [user, count] of Object.entries(workerCounts)) {
        if (count > maxShifts) {
          maxShifts = count;
          topWorker = `${user} (${maxShifts} shifts)`;
        }
      }
      this.workerOfMonth = topWorker;

      this.pastWeekShiftsAll = allShifts.filter((s: any) => {
        const d = new Date(s.date);
        return d >= oneWeekAgo && d < today;
      });

      const monthlyPayout: { [key: string]: number } = {};

      allShifts.forEach((shift: any) => {
        const monthYear = shift.date.substring(0, 7);
        const start = new Date(`1970-01-01T${shift.startTime}:00`);
        const end = new Date(`1970-01-01T${shift.endTime}:00`);
        let diffMs = end.getTime() - start.getTime();
        
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
        
        const hours = diffMs / (1000 * 60 * 60);
        const earnings = hours * Number(shift.hourlyWage);

        monthlyPayout[monthYear] = (monthlyPayout[monthYear] || 0) + earnings;
      });

      let maxCompanyMonth = '';
      let maxCompanyEarn = 0;

      for (const [month, earn] of Object.entries(monthlyPayout)) {
        if (earn > maxCompanyEarn) {
          maxCompanyEarn = earn;
          maxCompanyMonth = `${month} ($${maxCompanyEarn.toFixed(2)})`;
        }
      }
      this.highestCompanyPayout = maxCompanyMonth || '$0.00';
    }
  }
}