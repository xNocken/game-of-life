import $ from 'jquery';
import { generateFields, generation } from './js/renderer';

import './scss/main.scss';

$(() => {
  const fields = generateFields(100);
  $('#start-form').on('submit', (event) => {
    event.preventDefault();
    generation(fields);
  });
});
