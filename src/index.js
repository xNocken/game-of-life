import $ from 'jquery';
import { rules, saveSettings } from './config';
import { generateFields, generation } from './js/renderer';

import './scss/main.scss';

$(() => {
  const fields = generateFields(rules.length);
  let intervall = 0;

  $('#generation').on('click', () => {
    generation(fields);
  });

  $('#settings').on('submit', (event) => {
    event.preventDefault();
    saveSettings();
  });

  $('#start-form').on('submit', (event) => {
    event.preventDefault();
    let count = 0;

    if (!intervall) {
      intervall = setInterval(() => {
        generation(fields);
        count += 1;
        if (count === rules.modes[rules.mode].stopAfter) {
          clearInterval(intervall);
          intervall = 0;
          count = 0;
        }
      }, rules.delay);
    } else {
      clearInterval(intervall);
      intervall = 0;
    }
  });
});
