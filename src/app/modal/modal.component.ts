import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  public ModalIsVisible: boolean;

  constructor() { }

  showModal() { this.ModalIsVisible = true; }
  hideModal() { this.ModalIsVisible = false; }

}
