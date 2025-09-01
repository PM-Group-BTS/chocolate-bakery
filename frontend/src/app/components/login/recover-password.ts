import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  templateUrl: './recover-password.html',
  styleUrls: ['./recover-password.scss'],
  imports: [CommonModule, FormsModule]
})
export class RecoverPasswordComponent {
  username: string = '';
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  recoverInProgress: boolean = false;

  @Output() recoveryRequested = new EventEmitter<{username: string, email: string}>();

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.recoverInProgress = true;
    // Here you would call your API to send the recovery email
    // For now, just emit the event and show a success message
    this.recoveryRequested.emit({ username: this.username, email: this.email });
    this.successMessage = 'If the username and email are correct, a recovery email has been sent.';
    this.recoverInProgress = false;
  }
}
