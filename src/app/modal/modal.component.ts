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
      this.visNetworkOptions = {interaction:{hover:true}};
   }

  showModal(data) {
    this.visNetworkData = data;
    this.ModalIsVisible = true;
  }
  hideModal() { this.ModalIsVisible = false; }

  public networkInitialized(): void {
    this.visNetworkService.on(this.visNetwork, 'click');
    this.visNetworkService.click.subscribe((eventData: any[]) => {
      if (eventData[0] === this.visNetwork) {
        console.log(eventData[1]);
        let url = this.findInfoById(eventData[1].nodes[0])[0];
        (url.indexOf('http') !== -1) ? window.open(url, '_blank') : console.log('this is the root or cluster center');
      }
    });
    this.visNetworkService.on(this.visNetwork, 'showPopup');
    this.visNetworkService.showPopup.subscribe((eventData: any[]) => {
      if (eventData[0] === this.visNetwork) {
        console.log('showPopup', eventData);
      }
    });
    this.visNetworkService.on(this.visNetwork, 'hoverNode');
    this.visNetworkService.hoverNode.subscribe((eventData: any[]) => {
      if (eventData[0] === this.visNetwork) {
        console.log('hoverNode', eventData);
      }
    });
  }
  findInfoById(id) {
    let nodes = this.visNetworkData.nodes;
    let i = (nodes as Array<any>).map((n) => { return n.id; }).indexOf(id);
    return nodes[i].title;
  }
}
