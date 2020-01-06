import $ from 'jquery';

export const fieldClick = ($element) => {
  const infos = $element.data('info');

  infos.alive = !infos.alive;

  $element.addClass(`field--${infos.alive ? 'alive' : 'dead'}`);
  $element.removeClass(`field--${!infos.alive ? 'alive' : 'dead'}`);

  $element.data('info', infos);
};

export const generation = (fields) => {
  const aliveArray = fields.map(row => row.map(field => field.alive));

  fields.forEach((row, rowIndex) => {
    row.forEach((field, fieldIndex) => {
      let { alive } = field.data('info');
      let count = 0;

      for (let i = -1; i < 2; i += 1) {
        for (let o = -1; o < 2; o += 1) {
          if (i !== 0 || o !== 0) {
            if (rowIndex - i > 0 && fieldIndex - o > 0 && rowIndex - i < 99 && fieldIndex - o < 99) {
              if (fields[rowIndex - i][fieldIndex - o].data('info').alive) {
                count += 1;
              }
            }
          }
        }
      }

      switch (count) {
        case (0):
        case (1):
        case (4):
        case (5):
        case (6):
        case (7):
        case (8):
          alive = false;
          break;

        case (2):
        case (3):
          if (alive === false && count === 2) {
            alive = false;
            break;
          }

          alive = true;
          break;

        default:
          console.error('errorrrrrrrrrrrrrrrrrrrrrrr');
          break;
      }

      aliveArray[rowIndex][fieldIndex] = alive;
    });
  });


  aliveArray.forEach((row, rowIndex) => {
    row.forEach((field, fieldIndex) => {
      const data = fields[rowIndex][fieldIndex].data('info');

      data.alive = field;

      fields[rowIndex][fieldIndex].addClass(`field--${data.alive ? 'alive' : 'dead'}`);
      fields[rowIndex][fieldIndex].removeClass(`field--${!data.alive ? 'alive' : 'dead'}`);

      fields[rowIndex][fieldIndex].data('info', data);
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
