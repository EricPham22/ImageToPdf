import { Component, OnInit } from '@angular/core';
import jsPDF, { ImageOptions } from 'jspdf';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public uploadedFiles: any[] = [];
  
  constructor() { }

  ngOnInit(): void {

  }

  public onFileUpload($event: any) {
    const files: FileList = $event.target.files;
    const pdf = new jsPDF({orientation: 'landscape'});
    new Promise<void>((resolve) => {
      Array.from(files).forEach((file: File) => {
        this.readFileAsADataURL(file).then((result) => {
         const width = pdf.internal.pageSize.getWidth();
         const height = pdf.internal.pageSize.getHeight();
         pdf.addImage({imageData: result, format:'JPEG', x: 0, y:0, width: width, height: height} as ImageOptions);
         this.uploadedFiles.push(result);
         (file === files.item(files.length - 1)) ? resolve() : pdf.addPage();
       });
     });
    }).then(() => {0 
      pdf.save("merge.pdf");
    });
  }

  public async readFileAsADataURL(file: File) {
      let result = await new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      return result;
  }
}
