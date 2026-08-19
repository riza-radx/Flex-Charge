import { logger } from '@core/logger';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-companydeleteuser',
  templateUrl: './companydeleteuser.component.html'
})
export class CompanydeleteuserComponent implements OnInit {
  userId: number;
  userName: string = '';
  isPopupVisible: boolean = true;
  @Output() closePopup = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.getUserDetails(this.userId);
    logger.log('Charger ID:', this.userId);
    logger.log('Charger Name:', this.userName);  // Debugging line
  }

  openDeletePopup(row: any): void {
    this.userId = row.id;
    this.userName = row.userName;
    this.isPopupVisible = true;
  }

  confirmDelete(): void {
    this.userService.deleteUser(this.userId).subscribe({
      next: (response) => {
        logger.log('User deleted successfully:', response);
        this.closePopupHandler();
        // this.router.navigate(['/users/user']);
      },
      error: (error) => {
        logger.error('Error deleting user:', error);
      }
    });
  }

  getUserDetails(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.userName = response.user.name;
        logger.log('response:', response);
        logger.log('userName:', this.userName);
      },
      error: (error) => {
        logger.error('Error fetching User details:', error);
      }
    });
  }


  // closePopupHandler(): void {
  //   this.isPopupVisible = false;
  //   this.router.navigate(['/users/user']); 
  // }
  closePopupHandler(): void {
    this.isPopupVisible = false; // Hide the popup
    setTimeout(() => {
      this.router.navigate(['/users/user']); // Ensure navigation happens after the popup is closed
    }, 300);
  }
}
