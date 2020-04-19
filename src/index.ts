import 'typeface-roboto';
import './style.css';

import 'promise-polyfill/src/polyfill';
import { convertAllImages } from './convert';

const input = document.querySelector('#input') as HTMLInputElement;
input.onchange = () => {
   if (input.files !== null) {
      convertAllImages(input.files);
   }
};

const label = document.querySelector('#label') as HTMLDivElement;
label.ondragover = event => event.preventDefault();
label.ondrop = event => {
   event.preventDefault();
   if (event.dataTransfer !== null) {
      convertAllImages(event.dataTransfer.files);
   }
};
