


/* --- AUTO COLORIZE LANGUAGE --- */



function auto_colorize(elements) {

  document.querySelectorAll(elements).forEach((colorless) => {
    colorless.style.backgroundColor = `var(--clr-${colorless.getAttribute('class')})`;
  })

}



/* --- AUTO SCALE RECENT --- */



function auto_scale_recent() {

  let section = document.querySelector(`#recent > section`);
  let width;
  let count = 0;

  document.querySelectorAll(`#recent > section > div`).forEach((box => {
    count++;
  }))

  width = `calc(260px * ${count} + .5rem * ${count} + 7.5% + 1.5rem`;
  section.style.width = width;

}



/* --- HEIGHT LIST DETAIL VOCABULARYS --- */



function height_list_detail_vl() {

  let vocab_list = document.querySelector('#list-detail > .vocab-list');
  let height = 0;
  let height_rem = 0;
  let height_string;

  height += document.querySelector(`#list-detail > .progress-bar`).scrollHeight;
  height += document.querySelector(`#list-detail > header`).scrollHeight;
  height += document.querySelector(`#list-detail > .info`).scrollHeight;
  height += document.querySelector(`#list-detail > .widget-row`).scrollHeight;

  height_rem += 7.8;

  height_string = `calc(${height}px + ${height_rem}rem)`;
  vocab_list.style.top = height_string;

  height += document.querySelector('#list-detail > .learn-btn').scrollHeight;

  height_rem += 1;

  height_string = `calc(100% - ${height}px - ${height_rem}rem)`;
  vocab_list.style.height = height_string;

}