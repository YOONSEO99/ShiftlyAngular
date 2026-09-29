import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shift-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './shift-form.html',
  styleUrl: './shift-form.css'
})
export class ShiftForm implements OnInit {
  date = '';
  startTime = '';
  endTime = '';
  hourlyWage: number | null = null;
  workplace = '';
  shiftName = '';
  comments = '';

  errorMessage = '';
  isSaving = false;
  username = '';
  
  workplaces = ['Main Office', 'Downtown Branch', 'Warehouse', 'Remote', 'Metrotown Branch'];
  
  router = inject(Router);
  route = inject(ActivatedRoute);

  isEditMode = false;
  originalShiftName = ''; 

  ngOnInit() {
    const session = localStorage.getItem('shiftly_session');
    if (session) {
      this.username = JSON.parse(session).username;
    } else {
      this.router.navigate(['/login']);
      return;
    }

    const paramShiftName = this.route.snapshot.paramMap.get('shiftName');
    if (paramShiftName) {
      this.isEditMode = true;
      this.originalShiftName = paramShiftName;
      this.loadShiftData(paramShiftName);
    }
  }

  loadShiftData(shiftNameToFind: string) {
    const allShifts = JSON.parse(localStorage.getItem('shiftly_shifts') || '[]');
    const shiftToEdit = allShifts.find((s: any) => s.shiftName === shiftNameToFind && s.username === this.username);

    if (shiftToEdit) {
      this.date = shiftToEdit.date;
      this.startTime = shiftToEdit.startTime;
      this.endTime = shiftToEdit.endTime;
      this.hourlyWage = shiftToEdit.hourlyWage;
      this.workplace = shiftToEdit.workplace;
      this.shiftName = shiftToEdit.shiftName;
      this.comments = shiftToEdit.comments || '';
    } else {
      alert('Shift not found!');
      this.router.navigate(['/my-shifts']);
    }
  }

  onSave(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.date || !this.startTime || !this.endTime || !this.hourlyWage || !this.workplace || !this.shiftName) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    const allShifts = JSON.parse(localStorage.getItem('shiftly_shifts') || '[]');

    const nameExists = allShifts.some((shift: any) => 
      shift.shiftName === this.shiftName && 
      shift.shiftName !== this.originalShiftName 
    );

    if (nameExists) {
      this.errorMessage = 'This shift name already exists. Please choose a new name.';
      return;
    }

    this.isSaving = true;

    setTimeout(() => {
      const newShiftData = {
        username: this.username,
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
        hourlyWage: this.hourlyWage,
        workplace: this.workplace,
        shiftName: this.shiftName,
        comments: this.comments
      };

      if (this.isEditMode) {
        const index = allShifts.findIndex((s: any) => s.shiftName === this.originalShiftName && s.username === this.username);
        if (index !== -1) allShifts[index] = newShiftData;
      } else {
        allShifts.push(newShiftData);
      }

      localStorage.setItem('shiftly_shifts', JSON.stringify(allShifts));

      this.isSaving = false;
      alert(this.isEditMode ? 'Shift updated successfully!' : 'Shift saved successfully!');
      this.router.navigate(['/my-shifts']);
    }, 1500);
  }
}