import { Component } from '@angular/core';
import * as Vis from 'vis';
import { VisNetworkService } from 'ng2-vis/components/network';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  public ModalIsVisible: boolean;
  public visNetwork: string = 'networkId1';
  public visNetworkData: Vis.IData;
  public visNetworkOptions: Vis.IOptions;
  public visNetworkService: VisNetworkService;

  constructor(vns: VisNetworkService) {
      this.visNetworkService = vns;
      this.visNetworkOptions = {};
   }

  showModal(data) {
    this.visNetworkData = data;
    this.ModalIsVisible = true;
  }
  hideModal() { this.ModalIsVisible = false; }

}
