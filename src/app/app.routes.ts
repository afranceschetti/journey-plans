import { Routes } from '@angular/router';
import { PlansComponent } from './pages/plans/plans.component';
import { PlanComponent } from './pages/plan/plan.component';
import { PlanMetaComponent } from './components/plan-meta/plan-meta.component';

export const routes: Routes = [
    { path: '', component: PlansComponent },
    { path: 'plans/', component: PlansComponent },
    { path: 'plans/:planKey', component: PlanComponent },
    { path: 'plan-meta/:planKey', component: PlanMetaComponent },
];
