import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { PlanCardComponent } from "../../components/plan-card/plan-card.component";
import { Plan, Points } from '../../model/Plan';
import { faIdBadge } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'plan',
  imports: [CommonModule, PlanCardComponent, HttpClientModule, FontAwesomeModule, RouterModule],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.sass'
})
export class PlanComponent {

  @Input() onlyCard: boolean = false;
  @Input() showDetail: boolean = true;
  @Input() planKey: string;

  faHome = faHome;
  faIdBadge = faIdBadge;

  plan: Plan;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    if (!this.planKey)
      this.route.params.subscribe(params => {
        this.planKey = params['planKey'];
        this.loadPlan();
      });
    else
      this.loadPlan();
  }

  loadPlan() {
    this.httpClient.get<Plan>("data/" + this.planKey + "/" + this.planKey + ".json?t=" + (new Date().getTime())).subscribe(data => {
      console.log(data);
      this.plan = data;
      this.plan.totalDuration = this.calcDaysDiff(new Date(data.outboundTravel.landing.time), new Date(data.returnTravel.takeoff.time));

      this.plan.costs = Plan.calcCosts(data);

      if (this.plan.program) {
        this.plan.program.forEach((day, dIndex) => {
          day.date = new Date(new Date(this.plan.start).getTime() + (1000 * 60 * 60 * 24) * dIndex);
        });
      }

      if (this.plan.points) {
        this.plan.points = new Points(data.points.culture.value, data.points.wheater.value, data.points.nature.value, data.points.price.value)
      }
    });
  }

  calcDaysDiff(first: Date, second: Date) {
    console.log("first", first);
    console.log("second", second);
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

}
