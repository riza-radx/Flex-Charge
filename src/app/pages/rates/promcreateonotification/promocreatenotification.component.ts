import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoService } from 'src/app/services/promoService/promo.service';

@Component({
    selector: 'app-promo-create-notification',
    templateUrl: './promocreatenotification.component.html'
})
export class PromoCreateNotificationComponent implements OnInit {
    errorMessage: string = '';
    successMessage: string = '';
    promoId!: number;
    steps: number[] = [];
    maxSteps: number;
    notificationForm!: FormGroup;
    constructor(
        private fb: FormBuilder,
        private promoService: PromoService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.notificationForm = this.fb.group({
            promoId: [null, Validators.required],
            title: ['', Validators.required],
            message: ['', Validators.required],
            isActive: [true]
        });
    }

    ngOnInit(): void {
        this.promoId = Number(this.route.snapshot.paramMap.get('id'));
        this.getPromoById(this.promoId);



        this.notificationForm = this.fb.group({
            notifications: this.fb.array([
                this.createNotificationGroup()
            ])
        });
    }

    get notifications(): FormArray {
        return this.notificationForm.get('notifications') as FormArray;
    }

    createNotificationGroup(): FormGroup {
        return this.fb.group({
            step_count: [''],
            title: ['', Validators.required],
            body: ['', Validators.required],
            notification_type: ['offer_progress'],
            is_active: [true]
        });
    }

    getPromoById(id: number): void {
        this.promoService.getPromo(id).subscribe({
            next: (response) => {
                logger.log('ID:', id);
                logger.log('API response:', response);

                const promo = response.promo;
                this.maxSteps = response.promo.offer_charging_count
                this.steps = Array.from({ length: this.maxSteps }, (_, i) => i + 1);

            },
            error: (error) => {
                logger.error('❌ Error fetching promo details:', error);
            }
        });
    }
    addNotification(): void {
        this.notifications.push(this.createNotificationGroup());
    }

    removeNotification(index: number): void {
        this.notifications.removeAt(index);
    }

    
    onSubmit(): void {
        if (this.notificationForm.invalid) {
            this.notificationForm.markAllAsTouched();
            return;
        }

        // Filtron njoftimet bosh (kur s’ka as step, as title, as body)
        const filledNotifications = this.notificationForm.value.notifications.filter((notif: any) =>
            notif.step_count || notif.title || notif.body
        );

        // Nëse asnjë s’është plotësuar, mund të japësh njoftim
        if (filledNotifications.length === 0) {
            alert('You have not added any notifications.');
            return;
        }

        const notificationsData = filledNotifications.map((notif: any) => ({
            ...notif,
            promo_id: this.promoId
        }));

        logger.log("notificationsData", notificationsData);
        this.promoService.createPromoNotification(notificationsData).subscribe({
            next: (res: any) => {
                logger.log('Notifications created:', res);

                if (res.success === false) {
                    alert(res.message || 'Failed to save notifications.'); // shfaq mesazhin nga backend
                    return;
                }

                alert('Promo notifications saved successfully!');
                this.router.navigate(['/rates/promo', this.promoId]); // redirect tek promo details
            },
            error: (err) => {
                logger.error('Error creating notifications:', err);
                alert('Failed to save notifications.');
            }
        });
    }

}
