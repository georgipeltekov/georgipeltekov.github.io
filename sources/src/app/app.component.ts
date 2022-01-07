import { Component } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public files: NgxFileDropEntry[] = [];
  public data: Array<{ name: string, size: string, modified: string }> = [];

  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  public dropped(files: NgxFileDropEntry[]) {
    console.log('dropped', files)
    this.files = files;
    this.data = [];
    let index = 0;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(fileData => {
          console.log(fileData);
          let modifiedDate = fileData.lastModified.toLocaleString();

          this.data.push({ name: this.files[index].relativePath, size: this.transform(fileData.size), modified: modifiedDate });
        });
      } else {
        index++;
      }
    }
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
