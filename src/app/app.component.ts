import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-transceiver';
  selectedImage: any = null;
  base64: string = "";
  noisyBase64: string = "";
  predictedBase64: string = "";
  BASE_IP = 'https://color-img-denoise.herokuapp.com/';
  // BASE_IP = 'http://127.0.0.1:5000/';
  url = 'post_image';
  totalReward: any = 0;
  status = 'Working.....';


  constructor(private http: HttpClient) {

  }

  uploadImage(){
    var inp: HTMLInputElement = document.getElementsByTagName("input")[0];
    inp.click();
  }

  previewImage($event: any){
    this.selectedImage=$event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.selectedImage);
    reader.onload =this.handleReaderLoaded.bind(this);
  }

  handleReaderLoaded(readerEvt: any){
    this.base64= readerEvt.target.result;
    this.http.post(this.BASE_IP+this.url, {data: this.base64}).subscribe(data =>{
      // console.log(data);
      if((data as any).Error != undefined){
        this.status = "Error! Invalid image or image too big"
        return;
      }

      var nb64 = (data as any).noisy.toString();
      var pb64 = (data as any).prediction.toString()
      this.noisyBase64 = 'data:image/jpeg;base64,' + nb64.substring(2,nb64.length-1);
      this.predictedBase64 = 'data:image/jpeg;base64,' + pb64.substring(2,pb64.length-1);
      this.totalReward = (data as any).total_reward;
    })
  }



}
