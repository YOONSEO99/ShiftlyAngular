import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shift-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './shift-form.html',
  styleUrl: './shift-form.css',
})
export class ShiftForm  implements OnInit{
  date ='';
  startTime='';
  endTime='';
  hourlyWage: number | null=null;
  workplace ='';
  shiftName='';
  comments='';
  
  errorMessage='';
  isSaving = false;
  username='';

  workplaces = ['Main Office', 'Metrotown Branch', 'Remote', 'Warehouse'];

  router = inject(Router);

  ngOnInit(): void {
      const session = localStorage.getItem('shiftly_session');
      if(session){
        this.username = JSON.parse(session).username;
      }else{
        this.router.navigate(['/login']);
      }
  }

  onSave(event:Event){
    event.preventDefault();
    this.errorMessage='';

    if (!this.date || !this.startTime || !this.endTime || !this.hourlyWage || !this.workplace || !this.shiftName) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    const allShifts = JSON.parse(localStorage.getItem('shiftly_shifts')|| '[]');

    const nameExists = allShifts.some((shift: any) => shift.shiftName === this.shiftName);
    if (nameExists) {
      this.errorMessage = 'This shift name already exists. Please choose a new name.';
      return;
    }

    this.isSaving = true;

    setTimeout(()=>{
      const newShift = {
        username: this.username,
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
        hourlyWage: this.hourlyWage,
        workplace: this.workplace,
        shiftName: this.shiftName,
        comments: this.comments
      };

      allShifts.push(newShift);
      localStorage.setItem('shiftly_shifts', JSON.stringify(allShifts));

      this.isSaving = false;
      alert('Shift saved successfully!');
      this.router.navigate(['/home']);
    },1500);
  }
  
}
