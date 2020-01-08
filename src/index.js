import $ from 'jquery';
import rules from './config';
import { generateFields, generation } from './js/renderer';

import './scss/main.scss';

$(() => {
  const fields = generateFields(100);

  let intervall = 0;

  $('#start-form').on('submit', (event) => {
    event.preventDefault();
    let count = 0;

    if (!intervall) {
      intervall = setInterval(() => {
        generation(fields);
        count += 1;
        if (count === rules[rules.mode].stopAfter) {
          clearInterval(intervall);
          intervall = 0;
          count = 0;
        }
      });
    } else {
      clearInterval(intervall);
      intervall = 0;
    }

  });
});
