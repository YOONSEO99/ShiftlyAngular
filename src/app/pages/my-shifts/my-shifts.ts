import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-shifts',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-shifts.html',
  styleUrl: './my-shifts.css',
})
export class MyShifts implements OnInit{
  myShifts: any[] = [];
  username = '';
  router = inject(Router);

  ngOnInit(): void {
    const session = localStorage.getItem('shiftly_session');
    if(session){
      this.username = JSON.parse(session).username;
      this.loadMyShifts();
    }else{
      this.router.navigate(['/login']);
    }
  }

  loadMyShifts(){
    const allShifts = JSON.parse(localStorage.getItem('shiftly_shifts')||'[]');
    this.myShifts = allShifts.filter((shift:any)=> shift.username === this.username);
    this.myShifts.sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime());
  }

  editShift(shiftName:string){
    alert(`'${shiftName}' move to the Edit Page`);
  }
}
