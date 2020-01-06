import $ from 'jquery';
import { generateFields, generation } from './js/renderer';

import './scss/main.scss';

$(() => {
  const fields = generateFields(100);

  let intervall = 0;

  $('#start-form').on('submit', (event) => {
    event.preventDefault();

    if (!intervall) {
      intervall = setInterval(() => {
        generation(fields);
      }, 100);
    } else {
      clearInterval(intervall);
      intervall = 0;
    }
  });
});
