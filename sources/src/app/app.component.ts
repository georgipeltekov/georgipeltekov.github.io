import { Component, ChangeDetectorRef } from '@angular/core';
import { UploadFile, UploadEvent, FileSystemFileEntry } from 'ngx-file-drop';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  public files: UploadFile[] = [];
  public data: Array<any> = [];
  public columns: Array<any> = [
    { title: 'Name', name: 'name' },
    { title: 'Size', name: 'size' },
    { title: 'Last Modified Date', name: 'modified' },
  ];
  public config: any = {
    paging: true,
    className: ['table-striped', 'table-bordered']
  };

  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public rows: Array<any> = [];

  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  constructor(private ref: ChangeDetectorRef) {
  }

  public dropped(event: UploadEvent) {
    this.files = event.files;
    this.data = [];
    this.rows = [];
    this.length = this.files.length;
    let index = 0;
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(fileData => {
          console.log(fileData);
          this.data.push({ name: this.files[index].relativePath, size: this.transform(fileData.size), modified: fileData.lastModifiedDate.toLocaleString() });
          index++;
          if (index == this.files.length || index == this.itemsPerPage) {
            this.rows = this.data.slice(0, this.itemsPerPage);
            this.length = this.files.length;
            this.ref.markForCheck();
            this.ref.detectChanges();
          }
        });
      } else {
        index++;
      }
    }
  }

  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
    // let filteredData = this.changeFilter(this.files, this.config);
    this.rows = page && config.paging ? this.changePage(page, this.data) : this.data;
    this.length = this.files.length;
  }

  public changePage(page: any, data: Array<any>): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  transform(bytes: number = 0, precision: number = 2): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) return '?';

    let unit = 0;

    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }

    return bytes.toFixed(+ precision) + ' ' + this.units[unit];
  }

}