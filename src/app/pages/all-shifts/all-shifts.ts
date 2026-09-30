import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-shifts',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-shifts.html',
  styleUrl: './all-shifts.css'
})
export class AllShifts implements OnInit {
  allShifts: any[] = [];
  filteredShifts: any[] = [];

  searchName = '';
  searchPlace = '';
  searchStartDate = '';
  searchEndDate = '';

  isSingleWorkerMode = false;

  router = inject(Router);
  route = inject(ActivatedRoute);

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

    this.loadAllShifts();

    this.route.queryParams.subscribe(params => {
      if (params['worker']) {
        this.searchName = params['worker'];
        this.isSingleWorkerMode = true; 
        this.onSearch();
      }
    });
  }

  loadAllShifts() {
    const shifts = JSON.parse(localStorage.getItem('shiftly_shifts') || '[]');
    
    this.allShifts = shifts.map((shift: any) => {
      const start = new Date(`1970-01-01T${shift.startTime}:00`);
      const end = new Date(`1970-01-01T${shift.endTime}:00`);
      let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (diff < 0) diff += 24; 

      return {
        ...shift,
        totalProfit: (diff * shift.hourlyWage).toFixed(2)
      };
    });

    this.filteredShifts = [...this.allShifts];
  }

  onSearch() {
    this.filteredShifts = this.allShifts.filter(shift => {
      const matchName = !this.searchName || shift.username.toLowerCase().includes(this.searchName.toLowerCase());
      const matchPlace = !this.searchPlace || shift.workplace.toLowerCase().includes(this.searchPlace.toLowerCase());
      const matchStart = !this.searchStartDate || shift.date >= this.searchStartDate;
      const matchEnd = !this.searchEndDate || shift.date <= this.searchEndDate;
      
      return matchName && matchPlace && matchStart && matchEnd;
    });
  }

  resetSearch() {
    if (!this.isSingleWorkerMode) {
      this.searchName = '';
    }
    this.searchPlace = '';
    this.searchStartDate = '';
    this.searchEndDate = '';
    this.onSearch(); 
  }

  editShift(shiftName: string) {
    this.router.navigate(['/edit-shift', shiftName]);
  }

  getBadgeStyle(workplace: string) {
    switch(workplace) {
      case 'Main Office': return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'Downtown Branch': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'Warehouse': return { backgroundColor: '#fee2e2', color: '#b91c1c' };
      case 'Remote': return { backgroundColor: '#e0e7ff', color: '#4338ca' };
      case 'Metrotown Branch': return { backgroundColor: '#d1fae5', color: '#065f46' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  }
}