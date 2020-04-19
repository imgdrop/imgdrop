import 'typeface-roboto';
import './style.css';
import { convertAllImages } from './convert';

const input = document.querySelector('#input') as HTMLInputElement;
input.onchange = () => {
   if (input.files !== null) {
      convertAllImages(input.files);
   }
   input.value = '';
};

const label = document.querySelector('#label') as HTMLDivElement;
label.ondragover = event => event.preventDefault();
label.ondrop = event => {
   event.preventDefault();
   if (event.dataTransfer !== null) {
      convertAllImages(event.dataTransfer.files);
   }
};
