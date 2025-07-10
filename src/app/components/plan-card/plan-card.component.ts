import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFaceDizzy, faFaceFrown, faFaceGrinStars, faFaceMeh, faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { faCloudSun, faPlane, faTemperatureHalf } from '@fortawesome/free-solid-svg-icons';
import { Plan } from '../../model/Plan';
import { PlanMetaComponent } from "../plan-meta/plan-meta.component";


@Component({
  selector: 'plan-card',
  imports: [CommonModule, FontAwesomeModule, FormsModule, PlanMetaComponent],
  templateUrl: './plan-card.component.html',
  styleUrl: './plan-card.component.sass'
})
export class PlanCardComponent {


  faPlane = faPlane;
  faCloudSun = faCloudSun;
  faFaceGrinStars = faFaceGrinStars;
  faFaceSmile = faFaceSmile;
  faFaceMeh = faFaceMeh;
  faFaceFrown = faFaceFrown;
  faFaceDizzy = faFaceDizzy;
  faTemperature = faTemperatureHalf;

  @Input()
  plan: Plan;

  @Input()
  showDetail: boolean = false;

  constructor() { }


  ngOnInit(): void {
    console.log("plan", this.plan)
  }

  refreshCost() {
    this.plan.costs = Plan.calcCosts(this.plan);
  }
}
