import $ from 'jquery';

export const fieldClick = ($element) => {
  const infos = $element.data('info');

  infos.alive = !infos.alive;

  $element.addClass(`field--${infos.alive ? 'alive' : 'dead'}`);
  $element.removeClass(`field--${!infos.alive ? 'alive' : 'dead'}`);

  $element.data('info', infos);
};

export const generation = (fields) => {
  fields.forEach((row, index) => {
    row.forEach((field, index2) => {
      const { alive } = field.data('info');
      let count = 0;

      if (alive) {
        for (let i = -1; i < 1; i += 1) {
          for (let o = -1; o < 1; o += 1) {
            console.log(index - i, index2 - o);
            if (i !== 0 || o !== 0) {
              if (fields[index - i][index2 - o].data('info').alive) {
                count += 1;
              }
            }
          }
        }
        console.log(count);
      }
    });
  });
};

export const generateFields = (length) => {
  const fields = Array.from({ length })
    .map((_, xIndex) => Array.from({ length })
      .map((__, yIndex) => {
        const $field = $('<div class="field field--dead"></div>');

        $field.data('info', {
          x: xIndex,
          y: yIndex,
          alive: false,
        });

        return $field;
      }));

  $('#fields').empty();

  fields.forEach((row) => {
    const $row = $('<div class="row"></div>');

    row.forEach(($field) => {
      $field.on('click', () => fieldClick($field));

      $row.append($field);
    });

    $('#fields').append($row);
  });

  return fields;
};
