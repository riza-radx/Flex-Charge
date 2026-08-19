import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoService } from 'src/app/services/promoService/promo.service';

@Component({
    selector: 'app-updatepromonotification',
    templateUrl: './updatepromonotification.component.html'
})
export class UpdatePromoNotificationComponent implements OnInit {
    notificationForm!: FormGroup;
    promoNotificationId!: number;
    promoId!: number;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private promoService: PromoService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.promoNotificationId = Number(this.route.snapshot.paramMap.get('id'));

        // Form initialization
        this.notificationForm = this.fb.group({
            step_count: ['', Validators.required],
            title: ['', Validators.required],
            body: ['', Validators.required],
            notification_type: ['offer_progress'],
            is_active: [true]
        });

        this.loadNotification();
    }

    loadNotification(): void {
        this.promoService.getPromoNotificationById(this.promoNotificationId)
            .subscribe({
                next: (res: any) => {
                    if (res.success && res.promoNotification) {
                        this.notificationForm.patchValue(res.promoNotification);
                        this.promoId = res.promoNotification.promo_id;
                    } else {
                        this.errorMessage = res.message || 'Failed to load notification';
                    }
                },
                error: (err) => {
                    logger.error(err);
                    this.errorMessage = 'Failed to load notification';
                }
            });
    }

    onSubmit(): void {
        if (this.notificationForm.invalid) {
            this.notificationForm.markAllAsTouched();
            return;
        }

        const body = this.notificationForm.value;

        this.promoService.updatePromoNotification(this.promoNotificationId, body)
            .subscribe({
                next: (res: any) => {
                    if (res.success) {
                        // alert('Promo notification updated successfully!');
                        this.router.navigate(['/rates/promo', this.promoId]); // redirect tek promo details
                    } else {
                        this.errorMessage = res.message || 'Failed to update notification';
                    }
                },
                error: (err) => {
                    logger.error('Error updating notification:', err);
                    this.errorMessage = 'Failed to update notification';
                }
            });
    }
}
