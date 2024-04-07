import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('windowContainer') windowContainer!: ElementRef;
  isDrawing: boolean = false;
  intervalId: any; // Interval ID for drawing
  blobColor: string = 'red'; // Default blob color
  blobSize: number = 50;

  constructor() {}

  handleMouseDown(event: MouseEvent) {
    if (event.button === 0) { // Left mouse button
      this.isDrawing = true;
      this.intervalId = setInterval(() => {
        this.createBlobCopy(event); // Create blob copy at regular intervals
      }, 50); // Interval time (adjust as needed)
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      this.createBlobCopy(event); // Create blob copy continuously while drawing
    }
  }

  handleMouseUp() {
    if (this.isDrawing) {
      this.isDrawing = false;
      clearInterval(this.intervalId); // Stop drawing interval
    }
  }

  createBlobCopy(event: MouseEvent) {
    const windowContainer = this.windowContainer.nativeElement as HTMLElement;
    const blobElement = windowContainer.querySelector('.blob') as HTMLElement;

    // Clone the blob element
    const blobCopy = blobElement.cloneNode() as HTMLElement;

    // Calculate position relative to windowContainer bounds
    const containerRect = windowContainer.getBoundingClientRect();
    const x = event.clientX - containerRect.left - blobElement.offsetWidth / 2;
    const y = event.clientY - containerRect.top - blobElement.offsetHeight / 2;

    // Restrict position within windowContainer boundaries
    const posX = Math.max(0, Math.min(x, containerRect.width - blobElement.offsetWidth));
    const posY = Math.max(0, Math.min(y, containerRect.height - blobElement.offsetHeight));

    // Set blob copy styles
    blobCopy.style.position = 'absolute';
    blobCopy.style.left = `${posX}px`;
    blobCopy.style.top = `${posY}px`;
    blobCopy.style.backgroundColor = this.blobColor; // Set blob copy color

    // Append the blob copy to the windowContainer
    windowContainer.appendChild(blobCopy);
  }

  changeBlobColor(color: string) {
    this.blobColor = color; // Update my blob color
  }

  increaseBlobSize() {
    this.blobSize += 10; // Increase my blob size by 10 pixels
    this.updateBlobSize(); // Update my blob size in the DOM
  }

  decreaseBlobSize() {
    if (this.blobSize > 10) { // Set minimum size for blob at 10 pixels
      this.blobSize -= 10; // Decrease blob size by 10 pixels
      this.updateBlobSize(); // Update blob size in the DOM
    }
  }

  updateBlobSize() {
    const blobElement = document.querySelector('.blob') as HTMLElement;
    blobElement.style.width = `${this.blobSize}px`;
    blobElement.style.height = `${this.blobSize}px`;
  }

  refreshPage() {
    // Reload the current page
    window.location.reload();
  }

  downloadImage() {
    const windowContainer = this.windowContainer.nativeElement as HTMLElement;

      // Use html2canvas to capture the windowContainer and render it onto a canvas
      html2canvas(windowContainer).then(canvas => {
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png'); // Change 'image/png' to 'image/jpeg' for JPEG format

      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'my_drawing.png'; // Change 'my_drawing.png' to file name of specific student if they are takign app home
      link.click();
    });
  }
}
