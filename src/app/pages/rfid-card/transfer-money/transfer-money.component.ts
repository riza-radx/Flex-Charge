import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';
import { CardService } from 'src/app/services/cardService/card.service';
import { ChargingHistoryService } from 'src/app/services/chargingHistoryService/charging-history.service';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { RechargeService } from 'src/app/services/rechargeService/recharge.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserService } from 'src/app/services/userService/user.service';

type TransferDirection = 'to_user' | 'from_user';

@Component({
    selector: 'app-transfer-money',
    templateUrl: './transfer-money.component.html',
})
export class TransferMoneyComponent implements OnInit {
    rechargeForm: FormGroup;
    isLoading = false;

    userId!: number;                 // target user id (nga query params)
    userName: string = '';           // emri i adminit (i loguar)
    userUserName: string = '';       // emri i target user-it
    userBalance: number = 0;         // balanca e target user-it
    userDebitBalance: number = 0;    // borxhi i target user-it
    adminBalance: number = 0;        // balanca e adminit (pool)
    userGroupId!: number;
    transferAmount: number | null = null;
    allowTransfer: boolean = false;

    direction: TransferDirection = 'to_user';

    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private cardService: CardService,
        private chargingHistoryService: ChargingHistoryService,
        private router: Router,
        private route: ActivatedRoute,
        private userGroupMemberService: UserGroupMembersService,
        private userGroupService: UserGroupService,
        private companyMemberService: CompanyMemberService,
        private rechargeService: RechargeService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.userId = +params['userId'];
            if (this.userId) {
                this.getUserDetails(this.userId);
                this.getCurrentUserDetail();
            }
        });
        this.rechargeForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(0.01)]]
        });
    }

    getUserDetails(id: number): void {
        this.userService.getUserById(id).subscribe({
            next: (response) => {
                this.userUserName = response.user.name;
                this.userBalance = parseFloat(response.user.balance);
                this.userDebitBalance = parseFloat(response.user.debit_balance || 0);
            },
            error: (error) => {
                console.error('Error fetching User details:', error);
            }
        });
    }

    getCurrentUserDetail() {
        this.authService.getCurrentUserDetails().subscribe(
            (response) => {
                this.userName = response.user.name;
                this.adminBalance = parseFloat(response.user.balance);
                this.allowTransfer = response.user.allow_money_transfert;
                this.userGroupId = response.user.usergr_id;
            },
            error => {
                console.log(error);
            }
        );
    }

    onDirectionChange(dir: TransferDirection) {
        this.direction = dir;
        this.errorMessage = '';
        this.successMessage = '';
    }

    get maxAmount(): number {
        return this.direction === 'to_user' ? this.adminBalance : this.userBalance;
    }

    get adminPreviewBalance(): number {
        const amt = parseFloat(String(this.transferAmount || 0));
        if (!amt) return this.adminBalance;
        return this.direction === 'to_user'
            ? this.adminBalance - amt
            : this.adminBalance + amt;
    }

    // Sa nga shuma shkon te debit-settlement (vetem per 'to_user')
    get debitSettlementAmount(): number {
        const amt = parseFloat(String(this.transferAmount || 0));
        if (!amt || this.direction !== 'to_user') return 0;
        return Math.min(amt, this.userDebitBalance);
    }

    // Pjesa qe i mbetet user-it ne balance (pas pageses se debit-it)
    get balanceCreditAmount(): number {
        const amt = parseFloat(String(this.transferAmount || 0));
        if (!amt || this.direction !== 'to_user') return 0;
        return Math.max(0, amt - this.userDebitBalance);
    }

    get userPreviewBalance(): number {
        const amt = parseFloat(String(this.transferAmount || 0));
        if (!amt) return this.userBalance;
        if (this.direction === 'to_user') {
            // debit settle se pari, pjesa qe mbetet shtohet ne balance
            return this.userBalance + this.balanceCreditAmount;
        }
        return this.userBalance - amt;
    }

    get userPreviewDebitBalance(): number {
        const amt = parseFloat(String(this.transferAmount || 0));
        if (!amt || this.direction !== 'to_user') return this.userDebitBalance;
        return Math.max(0, this.userDebitBalance - amt);
    }

    get isPreviewInvalid(): boolean {
        return this.adminPreviewBalance < 0 || this.userPreviewBalance < 0;
    }

    submitTransfer() {
        this.errorMessage = '';
        this.successMessage = '';

        const amt = parseFloat(String(this.transferAmount || 0));
        if (!amt || amt <= 0) {
            this.errorMessage = 'Please enter a valid amount.';
            return;
        }

        if (this.direction === 'to_user' && amt > this.adminBalance) {
            this.errorMessage = `Amount exceeds your balance (${this.adminBalance}).`;
            return;
        }
        if (this.direction === 'from_user' && amt > this.userBalance) {
            this.errorMessage = `Amount exceeds user balance (${this.userBalance}).`;
            return;
        }

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        this.isLoading = true;
        this.rechargeService.transferMoney({
            userId: this.userId,
            receiverId: this.userId, // back-compat me backend-in e vjetër
            amount: amt,
            direction: this.direction,
            timezone
        }).subscribe(
            (res: any) => {
                this.successMessage = this.direction === 'to_user'
                    ? 'Transfer completed successfully!'
                    : 'Withdraw completed successfully!';
                this.errorMessage = '';

                if (this.direction === 'to_user') {
                    this.adminBalance -= amt;
                    // Settle debit first, remainder shtohet ne balance
                    const settled = Math.min(amt, this.userDebitBalance);
                    this.userDebitBalance -= settled;
                    this.userBalance += (amt - settled);
                } else {
                    this.adminBalance += amt;
                    this.userBalance -= amt;
                }

                this.transferAmount = null;
                this.isLoading = false;

                setTimeout(() => {
                    this.router.navigate(['/users/user', this.userId]);
                }, 800);
            },
            (err: any) => {
                this.errorMessage = err.error?.message || 'Error during transfer';
                this.successMessage = '';
                this.isLoading = false;
            }
        );
    }
}
