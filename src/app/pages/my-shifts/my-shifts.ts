import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-shifts',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './my-shifts.html',
  styleUrl: './my-shifts.css'
})
export class MyShifts implements OnInit {
  myShifts: any[] = [];         
  filteredShifts: any[] = [];   

  searchPlace: string = '';
  searchStartDate: string = '';
  searchEndDate: string = '';
  
  username = '';
  router = inject(Router);

  ngOnInit() {
    const session = localStorage.getItem('shiftly_session');
    if (session) {
      this.username = JSON.parse(session).username;
      this.loadMyShifts();
    } else {
      this.router.navigate(['/login']);
    }
  }

  getBadgeStyle(place: string) {
    let hash = 0;
    for (let i = 0; i < place.length; i++) {
      hash = place.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    
    return {
      'background-color': `hsl(${hue}, 70%, 85%)`, 
      'color': `hsl(${hue}, 80%, 30%)`          
    };
  }

  loadMyShifts() {
    const allShifts = JSON.parse(localStorage.getItem('shiftly_shifts') || '[]');
    const userShifts = allShifts.filter((shift: any) => shift.username === this.username);
    
    this.myShifts = userShifts.map((shift: any) => {
      const start = new Date(`1970-01-01T${shift.startTime}:00`);
      const end = new Date(`1970-01-01T${shift.endTime}:00`);
      let diffMs = end.getTime() - start.getTime();
      
      if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
      
      const hours = diffMs / (1000 * 60 * 60);
      const profit = hours * Number(shift.hourlyWage);
      
      return {
        ...shift,
        totalProfit: profit.toFixed(2)
      };
    });

    this.myShifts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.filteredShifts = [...this.myShifts];
  }

  onSearch() {
    this.filteredShifts = this.myShifts.filter(shift => {
      let matchPlace = true;
      let matchDate = true;

      if (this.searchPlace.trim()) {
        matchPlace = shift.workplace.toLowerCase().includes(this.searchPlace.toLowerCase());
      }

      const shiftDate = new Date(shift.date);
      if (this.searchStartDate) {
        matchDate = matchDate && (shiftDate >= new Date(this.searchStartDate));
      }
      if (this.searchEndDate) {
        matchDate = matchDate && (shiftDate <= new Date(this.searchEndDate));
      }

      return matchPlace && matchDate;
    });
  }

  resetSearch() {
    this.searchPlace = '';
    this.searchStartDate = '';
    this.searchEndDate = '';
    this.filteredShifts = [...this.myShifts];
  }

  editShift(shiftName: string) {
    this.router.navigate(['/edit-shift', shiftName]);
  }
}

