import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlanComponent } from "../plan/plan.component";

@Component({
  selector: 'app-plans',
  imports: [CommonModule, HttpClientModule, RouterModule, PlanComponent],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.sass'
})
export class PlansComponent implements OnInit {

  plans: Array<{ country: string, plans: string[] }>;
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get<Array<{ country: string, plans: string[] }>>("data/plans.json?t=" + (new Date().getTime())).subscribe(data => {
      console.log(data);
      this.plans = data;
    });

  }
}

