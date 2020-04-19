import 'typeface-roboto';
import './style.css';

import 'promise-polyfill/src/polyfill';
import { convertImage } from './convert';

const input = document.querySelector('#input') as HTMLInputElement;

function inputChange(): void {
   if (input.files === null || input.files.length < 1) {
      return;
   }
   convertImage(input.files[0]);
   input.value = '';
}

input.onchange = inputChange;
inputChange();
