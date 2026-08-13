import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MngnotificationsComponent } from './mngnotifications/mngnotifications.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'notification',
                component: MngnotificationsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationRoutingModule { }
