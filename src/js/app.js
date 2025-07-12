"use strict";


/* --- SETUP --- */



function check_setup_required() {

  if (user.name.first_name == null || user.name.last_name == null) {
    return true;
  } else {
    return false;
  }

}

function app_setup_slide_in(elmnt) {
  elmnt = document.querySelector(`#setup .${elmnt}`);
  elmnt.style.display = 'block';
  elmnt.style.animation = 'fade_in .35s ease-in-out both';
}

function app_setup_slide_out(elmnt) {
  elmnt = document.querySelector(`#setup .${elmnt}`);
  elmnt.style.animation = 'fade_out .35s ease-in-out both';
  setTimeout(() => {
    elmnt.style.display = 'none';
  }, 350);
}

function app_setup_steps(step) {

  let out_fade = null;
  let in_fade = null;

  if (step == 'start-setup') {

    in_fade = 'introduction';
    out_fade = 'onboarding';
    setTimeout(() => {
      document.querySelector('#setup .progress-bar').style.opacity = 1;
    }, 500);
    cache.setup.progress += 5;

  }

  if (step == 'introduction') {

    in_fade = 'functions';
    out_fade = 'introduction';
    cache.setup.progress += 25;

  }

  if (step == 'start-profile') {

    in_fade = 'start-profile';
    out_fade = 'functions';
    cache.setup.progress += 25;

  }

  if (step == 'set-profile') {

    in_fade = 'set-profile';
    out_fade = 'start-profile';
    cache.setup.progress += 25;

  }

  if (step == 'finishing') {

    let first_name = document.querySelector(`#setup .set-profile > article > div:first-of-type > input`).value;
    let last_name = document.querySelector(`#setup .set-profile > article > div:last-of-type > input`).value;

    if (remove_spaces(first_name) != '' && remove_spaces(last_name) != '') {

      cache.setup.progress += 25;

      in_fade = 'finishing';
      out_fade = 'set-profile';

      user.name.first_name = first_name;
      user.name.last_name = last_name;
      save_local_storage();

      document.querySelector(`#setup .finishing h1`).style.animation = 'fade_in 1.5s ease-in-out both';
      setTimeout(() => {
        window.location.reload();
      }, 3500);

      document.querySelector(`#setup .progress-bar`).style.animation = 'fade_out .25s ease-in-out both';
      setTimeout(() => {
        document.querySelector(`#setup .progress-bar`).style.display = 'none';
      }, 250);

    } else {

      alert_pup(
        {
          heading: 'Korrrekt?',
          text: 'Bitte fülle beide Felder aus.'
        }
      );

    }

  }

  setTimeout(() => {
    document.querySelector(`#setup .progress-bar > div`).style.width = `${cache.setup.progress}%`;
  }, 350);

  if (in_fade != null) {
    app_setup_slide_in(in_fade);
  }

  if (out_fade != null) {
    app_setup_slide_out(out_fade);
  }

}



/* --- APP OPENING --- */



function fast_opening() {

  document.querySelector('main').style.display = 'block';
  document.querySelector('#bottom-navigation').style.display = 'flex';
  document.querySelector('#app-opening').style.animation = 'fade_out 0s ease-in-out both';

  document.querySelector('#app-opening').style.display = 'none';

  document.querySelectorAll('main > section').forEach(slide => {
    slide.style.animation = 'slide_forward .35s ease-in-out both';
  })
}

function slow_opening() {

  setTimeout(() => {

    document.querySelector('#app-opening > img').style.display = 'block';
    document.querySelector('#app-opening > img').style.animation = 'fade_in .25s ease both';

  }, 300);

  setTimeout(() => {

    document.querySelector('main').style.display = 'block';
    document.querySelector('#bottom-navigation').style.display = 'flex';
    document.querySelector('#app-opening').style.animation = 'fade_out .35s ease-in-out both';

    setTimeout(() => {
      document.querySelector('#app-opening').style.display = 'none';
    }, 350);

    setTimeout(() => {

      document.querySelectorAll('main > section').forEach(slide => {
        slide.style.animation = 'slide_forward .3s ease-in-out both';
      })

    }, 50);


    auto_initialize_ui();

  }, 4000);

}

function app_opening(speed, destination_slide) {

  if (check_setup_required()) {
    destination_slide = 'setup';
    setTimeout(() => {
      document.querySelector('#setup').style.height = '100%';
      document.querySelector('#bottom-navigation').style.display = 'none';
    }, 4100);
  }

  if (speed == 'slow') {
    slow_opening();
  } else if (speed == 'fast') {
    fast_opening();
  }

  setTimeout(() => {
    slide(destination_slide);
  }, 300);

}



/* --- USER --- */



let user;

if (localStorage.getItem('user') != null) {
  user = JSON.parse(localStorage.getItem('user'));
} else {
  user = {
    name: {
      first_name: null,
      last_name: null
    },
    birthdate: null,
    gender: undefined,
    email: null,
    school: null,
    avatar: './src/img/account.png',
  }
}

app_opening('slow', 'home');



/* --- DATA MANAGEMENT --- */



// constants

const version = {
  build: '1.0',
  channel: 'beta'
};

const app_language = 'Deutsch';
const available_languages = ['Englisch', 'Französisch', 'Spanisch', 'Latein', 'Russisch'];

// cache

let cache = {
  vocab_list_context: null,
  dropdown_answers: { front: null, back: null, name: null },
  clickable_box_context: [],
  learn: {},
  time: {},
  pop_up: [],
  pop_up_interactions: [],
  edit_vocab: false,
  clickable_box_already_done: false,
  setup: {
    progress: 0
  }
};

// settings

let settings;

if (localStorage.getItem('settings') == null) {
  settings = {
    learn: {
      vocab_counter: 10,
      attention_low_upper_case: false,
      attention_spaces: false
    },
    daily_target: 10
  }
} else {
  settings = JSON.parse(localStorage.getItem('settings'));
}

// recent_list_opens

let recent_list_opens;

if (localStorage.getItem('recent_list_opens') != null) {
  recent_list_opens = JSON.parse(localStorage.getItem('recent_list_opens'));
} else {
  recent_list_opens = [];
}

// add -> recent

function add_to_recent(list_name) {

  let already_added = false;
  let count = 0;
  let arypos = null;

  recent_list_opens.forEach(list => {
    if (list == list_name) {
      already_added = true;
      arypos = count;
    } else {
      count++;
    }
  })

  if (!already_added) {
    recent_list_opens.unshift(list_name);
  } else {
    recent_list_opens.splice(arypos, 1);
    recent_list_opens.unshift(list_name);
  }

  save_local_storage();

}

// all_vocab_lists

let all_vocab_lists;

if (localStorage.getItem('all_vocab_lists') != null) {
  all_vocab_lists = JSON.parse(localStorage.getItem('all_vocab_lists'));
} else {
  all_vocab_lists = [];
}


// exams

let exams;

if (localStorage.getItem('exams') != null) {
  exams = JSON.parse(localStorage.getItem('exams'));
} else {
  exams = [];
}

// time_notation

let time_notation;

if (localStorage.getItem('time_notation') != null) {
  time_notation = JSON.parse(localStorage.getItem('time_notation'));
} else {
  time_notation = [];
}

// save_local_storage

function save_local_storage() {

  localStorage.setItem('all_vocab_lists', JSON.stringify(all_vocab_lists));
  localStorage.setItem('time_notation', JSON.stringify(time_notation))
  localStorage.setItem('exams', JSON.stringify(exams));
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('settings', JSON.stringify(settings));
  localStorage.setItem('recent_list_opens', JSON.stringify(recent_list_opens));

}



/* --- UNIVERSAL FUNCTIONS --- */


// crypto

async function sha256(message) {

  const msg_buffer = new TextEncoder().encode(message);
  const hash_buffer = await crypto.subtle.digest('SHA-256', msg_buffer);
  const hash_array = Array.from(new Uint8Array(hash_buffer));
  const hash_hex = hash_array.map(b => b.toString(16).padStart(2, '0')).join('');
  return hash_hex;

}

// time

let time_interval = null;

function count_action(action) {

  if (action == 'start') {

    cache.time.hours = 0;
    cache.time.minutes = 0;
    cache.time.seconds = 0;


    time_interval = setInterval('count()', 1000);

  }

  if (action == 'stop') {

    clearInterval(time_interval);

    let hours = cache.time.hours;
    let minutes = cache.time.minutes;
    let seconds = cache.time.seconds;

    let time_object = {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }

    let full_time_string = `${hours}:${minutes}:${seconds}`;

    let ui_time_string = '';

    if (hours > 0) {
      if (hours < 10) {
        ui_time_string += '0';
      }
      ui_time_string += `${hours}:`;
    }

    ui_time_string += `${minutes}:`;

    if (seconds < 10) {
      ui_time_string += '0';
    }
    ui_time_string += seconds;

    return {
      time_object: time_object,
      full_time_string: full_time_string,
      ui_time_string: ui_time_string
    }


  }

}

function count() {

  if (cache.time.seconds != 59) {
    cache.time.seconds++;
  } else {
    if (cache.time.minutes == 59) {
      cache.time.hours++;
      cache.time.minutes = 0;
      cache.time.seconds = 0;
    } else {
      cache.time.minutes++;
      cache.time.seconds = 0;
    }
  }

}

function sequence_convert(date_string) {

  let [year, month, day] = date_string.split("-");
  return `${day}-${month}-${year}`;

}

function sequence_convert_to_sys(date_string) {

  let [day, month, year] = date_string.split("-");
  return `${year}-${month}-${day}`;

}

function time_to_sec(time_object) {

  let hours = time_object.hours;
  let minutes = time_object.minutes;
  let seconds = time_object.seconds;

  let all_seconds = 0;

  all_seconds += seconds;
  minutes += hours * 60;
  all_seconds += minutes * 60;

  return all_seconds;

}

function get_sys_time() {

  let current_time = new Date();
  let hours = current_time.getHours().toString().padStart(2, '0');
  let minutes = current_time.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;

}

function get_system_date() {

  let date = new Date();
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();

  let formatted_date = `${day}-${month}-${year}`;
  return formatted_date;

}

function date_difference(date1, date2) {

  let [day1, month1, year1] = date1.split('-').map(Number);
  let [day2, month2, year2] = date2.split('-').map(Number);

  let first_date = new Date(year1, month1 - 1, day1);
  let second_date = new Date(year2, month2 - 1, day2);

  let time_difference = Math.abs(second_date - first_date);
  let day_difference = Math.ceil(time_difference / (1000 * 60 * 60 * 24));

  return day_difference;

}

function convert_sys_date(date) {

  return date.replace(/-/g, '.');

}

function convert_new_date_type(date_string) {

  let date = new Date(date_string);
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();

  return `${day}-${month}-${year}`;

}

const month_names = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

function get_month_name(date_string) {

  let month_pos = date_string.split("-")[1];
  return month_names[month_pos - 1];

}

function is_date_past(date1, date2) {

  return new Date(date2.split("-").reverse().join("-")) < new Date(date1.split("-").reverse().join("-"));

}

function get_time_list(list_name) {

  let duration_counter = 0;
  time_notation.forEach(data => {
    if (data.refered_list == list_name) {
      duration_counter += data.duration;
    }
  })

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  minutes = Math.round(duration_counter /= 60);
  duration_counter = Math.round(duration_counter /= 60);
  seconds = duration_counter;
  while (minutes > 59) {
    minutes -= 60;
    hours++;
  }

  let time_object = {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }

  return time_object;

}

// input procssing

function remove_spaces(string) {

  return string.replace(/\s+/g, "");

}

// save profile

function update_profile() {

  let first_name = document.querySelector('#settings .profile > div:first-of-type > input').value;
  let last_name = document.querySelector('#settings .profile > div:nth-of-type(2) > input').value;
  let email = document.querySelector('#settings .profile > div:last-of-type > input').value;

  if (remove_spaces(first_name) != '' && remove_spaces(last_name) != '') {

    user.name.first_name = first_name;
    user.name.last_name = last_name;
    user.email = email;

    save_local_storage();
    document.querySelector('#settings .profile > button').style.backgroundColor = 'var(--clr-agree)';

    setTimeout(() => {
      window.location.reload();
    }, 500);

  } else {
    alert_pup(
      {
        heading: 'Korrrekt?',
        text: 'Bitte fülle alle Felder aus.'
      }
    );
  }

}

// avatar management

function upload_new_avatar() {

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {
          const targetSize = 256;
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');

          ctx.drawImage(
            img,
            0, 0,
            img.width, img.height,
            0, 0,
            targetSize, targetSize
          );

          const squareImageContent = canvas.toDataURL('image/png', 0.7);

          user.avatar = squareImageContent;
          save_local_storage();
          auto_initialize_ui();

        };
      };

      reader.readAsDataURL(file);
    } else {
      alert_pup(
        {
          heading: 'Dateityp Err',
          text: 'Bitte lade eine Bilddatei hoch. 🖼'
        }
      );
    }

  });

  input.click();
}


/* --- CLICKABLE BOX --- */



function clean_clickable_box_cache() {
  cache.clickable_box_context = [];
}

function reset_my_active_elmnts(parent) {

  document.querySelectorAll(`${parent} > div`).forEach(e => {
    e.style.outline = '3px solid var(--clr-grey)';
  });

}

function clickable_box(parent, pos, one_option, bg_style) {

  let enabled = false;
  let array_pos = null;
  let count = 0;

  cache.clickable_box_context.forEach(item => {
    if (item == pos) {
      enabled = true;
      array_pos = count;
    } else {
      count++;
    }
  })

  if (enabled == true) {
    if (bg_style == null || bg_style == false) {
      document.querySelector(`${parent} > div:nth-of-type(${pos})`).style.outline = '3px solid var(--clr-grey)';
    } else {
      document.querySelector(`${parent} > div:nth-of-type(${pos})`).style.backgroundColor = 'var(--clr-grey)';
      document.querySelectorAll(`${parent} > div:nth-of-type(${pos}) *`).forEach(elmnt => {
        elmnt.style.color = '#000';
        elmnt.style.stroke = '#000';
      })
    }

    cache.clickable_box_context.splice(array_pos, 1);
  } else {
    if (bg_style == null || bg_style == false) {
      document.querySelector(`${parent} > div:nth-of-type(${pos})`).style.outline = '3px solid var(--clr-primary)';
    } else {
      document.querySelector(`${parent} > div:nth-of-type(${pos})`).style.backgroundColor = 'var(--clr-primary)';
      document.querySelectorAll(`${parent} > div:nth-of-type(${pos}) *`).forEach(elmnt => {
        elmnt.style.color = '#fff';
        elmnt.style.stroke = '#fff';
      })
    }
    if (one_option) {
      if (bg_style == null || bg_style == false) {
        cache.clickable_box_context.forEach(item => {
          document.querySelector(`${parent} > div:nth-of-type(${item})`).style.outline = '3px solid var(--clr-grey)';
        })
      } else {
        cache.clickable_box_context.forEach(item => {
          document.querySelector(`${parent} > div:nth-of-type(${item})`).style.backgroundColor = 'var(--clr-grey)';
          document.querySelectorAll(`${parent} > div:nth-of-type(${item}) *`).forEach(elmnt => {
            elmnt.style.color = '#000';
            elmnt.style.stroke = '#000';
          })
        })
      }
      cache.clickable_box_context = [pos];
    } else {
      cache.clickable_box_context.push(pos);
    }
  }

  // custom operations

  if (parent == '#edit-list .text-accuracy section') {
    if (cache.clickable_box_context[0] == 3) {
      document.querySelector(':root').style = '--clr-svg-change: #fff';
    } else {
      document.querySelector(':root').style = '--clr-svg-change: #000';
    }
  }

}



/* --- SLIDE SYSTEM --- */



var active_slide = null;
var recent_slide;
var bottom_nav_inclusions = ['home', 'library', 'statistic'];

function set_progress_bars_to_0() {

  document.querySelectorAll('.progress-bar > div').forEach(pb => {
    pb.style.width = 0;
  })

}

function slide(destination, manual_command_follows) {

  if (active_slide != destination) {

    set_progress_bars_to_0();


    document.querySelector('main').style.animation = 'slide_back .175s ease-in-out both';
    document.querySelectorAll(`main > section`).forEach((slide) => {
      slide.style.overflow = 'hidden';
    })

    setTimeout(() => {
      document.querySelector('main').style.animation = 'slide_forward .175s ease-in-out both';
      document.querySelectorAll(`main > section`).forEach((slide) => {
        slide.style.overflow = 'scroll';
      })
    }, 175);

    if (active_slide != null) {

      let active_slide_elmnt = document.getElementById(active_slide);
      active_slide_elmnt.style.animation = 'fade_out .175s ease-in-out both';

      setTimeout(() => {
        active_slide_elmnt.style.display = 'none';
      }, 175);

    }

    let destination_slide = document.getElementById(destination);

    destination_slide.style.display = 'block';
    destination_slide.style.animation = 'fade_in .175s ease-in-out .175s both';

    if (active_slide == null) {
      recent_slide = destination;
    } else {
      recent_slide = active_slide;
    }
    active_slide = destination;

    if (manual_command_follows == null) {
      if (destination == 'list-detail') {
        change_bn('library');
      } else {
        change_bn(null, slide);
      }
    }


    setTimeout(() => {
      document.querySelectorAll('*').forEach(scroll_elmnt => {
        scroll_elmnt.scrollTo(0, 0);
      })
    }, 175);

    auto_initialize_ui();



  }

}

// bottom navigation

function change_bn(activation, source) {

  if (document.querySelector(`#bottom-navigation > .active`) != null) {
    document.querySelector(`#bottom-navigation > .active > div:first-of-type`).style.animation = 'fade_in .35s both';
    document.querySelector(`#bottom-navigation > .active > div:last-of-type`).style.animation = 'fade_out .35s both';
    document.querySelector(`#bottom-navigation > .active`).classList.remove('active');
  }

  if (source == slide) {

    if (bottom_nav_inclusions.includes(active_slide)) {
      activation = active_slide;
    }

  }

  if (activation != null) {
    document.querySelector(`#bottom-navigation > .${activation}`).setAttribute('class', `${activation} active`);
    document.querySelector(`#bottom-navigation > .${activation} > div:first-of-type`).style.animation = 'fade_out .35s both';
    document.querySelector(`#bottom-navigation > .${activation} > div:last-of-type`).style.animation = 'fade_in .35s both';
  }

}



/* --- VOCAB & LIST --- */



// add vocab

function add_vocab() {

  let native_language = document.querySelector(`#add-vocab > article:first-of-type > input`).value;
  let translation = document.querySelector(`#add-vocab > article:last-of-type > input`).value;
  let note = '';

  if (cache.add_note_required) {

    note = cache.add_note_content;
    let count = 0;
    let arypos = null;
    cache.pop_up_interactions.forEach(data => {
      if (data.name == 'note') {
        arypos = count;
      }
      count++;
    })

    cache.pop_up_interactions.splice(arypos, 1);

  }

  if (remove_spaces(native_language) != '' && remove_spaces(translation)) {

    pop_up('add-vocab', false);

    cache.vocab_list_context.vocabularys.unshift(
      {
        lang1: native_language,
        lang2: translation,
        note: note,
        weight: 4,
        answer_protocol: []
      },
    );

    save_local_storage();
    open_list_detail(cache.vocab_list_context.name);

    cache.add_note_required = false;

  } else {
    alert_pup(
      {
        heading: 'Korrrekt?',
        text: 'Bitte fülle beide Felder aus.'
      }
    );
  }

}

// add note

function add_note() {

  let content = document.querySelector('#add-note textarea').value;

  if (cache.edit_vocab) {
    cache.vocab_list_context.vocabularys[cache.vocab_context_count].note = content;
    back_to_pop_up('edit-vocab');
  } else {
    back_to_pop_up('add-vocab');
    cache.add_note_required = true;
    cache.add_note_content = content;
  }

  let count = 0;
  let arypos = null;
  cache.pop_up_interactions.forEach(data => {
    if (data.name == 'note') {
      arypos = count;
    }
    count++;
  })

  if (cache.edit_vocab) {
    cache.pop_up_interactions.splice(arypos, 1);
  }

}

// display note

function display_note() {

  let note_content = '';

  if (cache.edit_vocab) {
    note_content = cache.vocab_list_context.vocabularys[cache.vocab_context_count].note;
  } else {
    cache.pop_up_interactions.forEach(data => {
      if (data.name == 'note') {
        note_content = data.content;
      }
    });
  }

  document.querySelector(`#add-note textarea`).value = note_content;

}

// edit_vocab

function edit_vocab_initialize(array_pos) {

  pop_up('edit-vocab', true);

  delete_vocab_preperation(array_pos);

  let vocab = cache.vocab_list_context.vocabularys[array_pos];
  cache.vocab_context_count = array_pos;

  document.querySelector('#edit-vocab > article:first-of-type > input').value = vocab.lang1;
  document.querySelector('#edit-vocab > article:last-of-type > input').value = vocab.lang2;


}

function add_update_exam() {

  let date = document.querySelector('#add-exam input').value;

  if ((date && !isNaN(new Date(date).getTime()))) {

    if (cache.vocab_list_context.exam) {

      let count = 0;
      let arypos = null;
      while (exams[count] != null) {
        if (exams[count].name == cache.vocab_list_context.name) {
          arypos = count;
          break;
        }
        count++;
      }

      exams.splice(arypos, 1);

    }

    exams.unshift(
      {
        date: sequence_convert(date),
        language: cache.vocab_list_context.language,
        refered_list: cache.vocab_list_context.name
      }
    );

    cache.vocab_list_context.exam = true;

    save_local_storage();
    pop_up('add-exam', false);
    open_list_detail(cache.vocab_list_context.name);

  } else {

    alert_pup(
      {
        heading: 'Kein Datum',
        text: 'Bitte gib ein vollständiges Datum ein.'
      }
    );

  }

}

function update_vocab() {

  cache.edit_vocab = false;

  let lang1 = document.querySelector('#edit-vocab > article:first-of-type > input').value;
  let lang2 = document.querySelector('#edit-vocab > article:last-of-type > input').value;

  if (remove_spaces(lang1) == '' || remove_spaces(lang2) == '') {

    alert_pup(
      {
        heading: 'Korrrekt?',
        text: 'Bitte fülle beide Felder aus.'
      }
    );

  } else {

    let vocab = cache.vocab_list_context.vocabularys[cache.vocab_context_count];
    vocab.lang1 = lang1;
    vocab.lang2 = lang2;

    pop_up('edit-vocab', false);
    small_pop_up('verify-delete-vocab', false);
    open_list_detail(cache.vocab_list_context.name);
    save_local_storage();

  }

}

// update_list

function update_vocab_list() {

  let name = document.querySelector('#edit-list .name input').value;
  let text_accuracy_config = cache.clickable_box_context[0];

  if (remove_spaces(name) == '' || text_accuracy_config == null) {
    alert_pup(
      {
        heading: 'Korrrekt?',
        text: 'Bitte fülle beide Felder aus.'
      }
    );
  } else {

    cache.vocab_list_context.name = name;
    cache.vocab_list_context.accuracy_text_config = text_accuracy_config;
    save_local_storage();

    pop_up('edit-list', false);
    open_list_detail(cache.vocab_list_context.name);

  }

}

// delete exam

function delete_exam() {

  let refered_list_name = cache.vocab_list_context.name;
  let count = 0;
  let arypos = 0;

  exams.forEach(e => {
    if (e.refered_list == refered_list_name) {
      arypos = count;
    }
    count++;
  })

  exams.splice(arypos, 1);
  cache.vocab_list_context.exam = false;
  save_local_storage();

  small_pop_up('verify-delete-exam', false);
  pop_up('add-exam', false);
  open_list_detail(cache.vocab_list_context.name);

}

// delete list

function delete_vocab_list() {

  let name = cache.vocab_list_context.name;
  let count = 0;
  let arypos = 0;

  all_vocab_lists.forEach(vl => {
    if (vl.name == name) {
      arypos = count;
    }
    count++;
  })

  all_vocab_lists.splice(arypos, 1);

  count = 0;
  arypos = null;

  exams.forEach(e => {
    if (e.refered_list === name) {
      arypos = count;
    } else {
      count++;
    }
  })

  if (arypos != null) {
    exams.splice(arypos, 1);
  }

  count = 0;
  arypos = null;

  recent_list_opens.forEach(o => {
    if (o == name) {
      arypos = count;
    }
    count++;
  });

  if (arypos != null) {
    recent_list_opens.splice(arypos, 1);
  }

  save_local_storage();

  small_pop_up('verify-delete-list', false);
  pop_up('edit-list', false);
  slide('library');

}

// delete vocab

function delete_vocab_preperation(array_pos) {

  small_pop_up('verify-delete-vocab', false);
  document.querySelector(`#small-pop-up-area > .verify-delete-vocab > form > button:last-of-type`).setAttribute('onclick', `delete_vocab(${array_pos})`)

}

function delete_vocab(arypos) {

  cache.vocab_list_context.vocabularys.splice(arypos, 1);

  pop_up('edit-vocab', false);
  small_pop_up('verify-delete-vocab', false);
  open_list_detail(cache.vocab_list_context.name);
  save_local_storage();


}

// add list

let new_vocab_list = {
  name: null,
  language: null,
  accuracy_text_config: null
};

function add_list(data) {

  all_vocab_lists.unshift({
    name: data.name,
    language: data.language,
    notifications: false,
    exam: false,
    progress: 5,
    accuracy_text_config: data.accuracy_text_config,
    vocabularys: [],
    version: version,
    source: 'local_created',
    creator: {
      first_name: user.name.first_name,
      last_name: user.name.last_name,
      avatar: user.avatar
    }
  });

  auto_initialize_ui();
  let name_save = data.name;

  setTimeout(() => {
    open_list_detail(name_save);
  }, 350);

  save_local_storage();

}

// steps

function check_if_list_name_is_available(list_name) {

  let all_list_names = [];
  all_vocab_lists.forEach(vl => {
    all_list_names.push(vl.name);
  });

  if (all_list_names.includes(list_name)) {
    return false;
  } else {
    return true
  }

}

function create_vocab_list_steps(step_name) {

  let active_slide_context = null;
  let next_slide_context = null;

  if (step_name == 'language' && cache.clickable_box_context.length == 1) {
    new_vocab_list.language = document.querySelector(`#add-list > .choose-language > div:nth-of-type(${cache.clickable_box_context[0]}) > span`).innerHTML;
    clean_clickable_box_cache();
    active_slide_context = 'choose-language';
    next_slide_context = 'enter-list-name';
  }

  if (step_name == 'enter-list-name') {
    new_vocab_list.name = document.querySelector(`#add-list > .enter-list-name > input`).value;
    if (remove_spaces(new_vocab_list.name) != '') {
      if (check_if_list_name_is_available(new_vocab_list.name)) {
        active_slide_context = 'enter-list-name';
        next_slide_context = 'accuracy-test-config';
      } else {
        alert_pup(
          {
            heading: 'Nicht möglich',
            text: 'Bitte verwende einen neuen Listennamen. ✏'
          }
        );
      }
    }
  }

  if (step_name == 'accuracy-test-config' && cache.clickable_box_context.length == 1) {
    new_vocab_list.accuracy_text_config = cache.clickable_box_context[0];
    pop_up('add-list', false);
    add_list(new_vocab_list);
    new_vocab_list.name = null;
    new_vocab_list.language = null;
    new_vocab_list.accuracy_text_config = null;
  }

  if (active_slide_context != null) {

    document.querySelector(`#add-list > .${active_slide_context}`).style.animation = 'fade_out .25s ease-in-out both';
    setTimeout(() => {
      document.querySelector(`#add-list > .${active_slide_context}`).style.display = 'none';
    }, 250);

  }

  if (next_slide_context != null) {

    document.querySelector(`#add-list > .${next_slide_context}`).style.animation = 'fade_in .25s ease-in-out .25s both';
    document.querySelector(`#add-list > .${next_slide_context}`).style.display = 'block';
    document.querySelector(`#add-list > section > button`).setAttribute('onclick', `create_vocab_list_steps('${next_slide_context}')`);

  }


}



/* --- DROPDOWN --- */



let dropdown_objects = [
  {
    name: 'set-vocab-counter',
    emoji: '🔢',
    headline: 'Vokabeln pro Lerndurchgang',
    options: [
      {
        front: '5 Vokabeln',
        back: 5
      },
      {
        front: '10 Vokabeln',
        back: 10
      },
      {
        front: '15 Vokabeln',
        back: 15
      },
      {
        front: '20 Vokabeln',
        back: 20
      }
    ]
  },
  {
    name: 'attention_low_upper_case',
    emoji: '🔤',
    headline: 'Groß-/ Kleinschreibung berücksichtigen',
    options: [
      {
        front: 'Ja',
        back: true
      },
      {
        front: 'Nein (empfohlen)',
        back: false
      }
    ]
  },
  {
    name: 'attention_spaces',
    emoji: '📄',
    headline: 'Leerzeichen berücksichtigen',
    options: [
      {
        front: 'Ja',
        back: true
      },
      {
        front: 'Nein (empfohlen)',
        back: false
      }
    ]
  }
];

function dropdown_display(objct_name, destination_state) {

  if (destination_state == true || destination_state == null) {

    document.querySelector('#dropdown').style.display = 'flex';
    document.querySelector('#dropdown').style.animation = 'fade_in .25s ease-in-out both';

  }

  if (destination_state == false) {

    setTimeout(() => {
      document.querySelector('#dropdown').style.display = 'none';
    }, 250);
    document.querySelector('#dropdown').style.animation = 'fade_out .25s ease-in-out both';

  }

  if (objct_name != null) {

    let dropdown_elmnt;

    dropdown_objects.forEach(object => {
      if (object.name == objct_name) {
        dropdown_elmnt = object;
      }
    });

    cache.dropdown_answers.name = dropdown_elmnt.name;

    document.querySelector('.choose-area .choose-btn').innerHTML = 'Auswählen';
    document.querySelector('.choose-area .emoji').innerHTML = dropdown_elmnt.emoji;
    document.querySelector('.choose-area .headline').innerHTML = dropdown_elmnt.headline;
    document.querySelector('#dropdown .options').innerHTML = '';

    dropdown_elmnt.options.forEach(o => {

      document.querySelector('#dropdown .options').innerHTML += `
         <button type="button" onclick="dropdown_choose('${o.front}', '${o.back}')">${o.front}</button>
      `;

    });

  }

}

function options_display(destination_state) {

  if (destination_state == true) {

    setTimeout(() => {

      document.querySelector('#dropdown .choose-area').style.display = 'none';
      document.querySelector('#dropdown .options').style.display = 'block';
      document.querySelector('#dropdown .options').style.animation = 'fade_in .175s ease-in-out both';

    }, 175);

    document.querySelector('#dropdown .choose-area').style.animation = 'fade_out .175s ease-in-out both';

  } else {

    setTimeout(() => {

      document.querySelector('#dropdown .options').style.display = 'none';
      document.querySelector('#dropdown .choose-area').style.display = 'block';
      document.querySelector('#dropdown .choose-area').style.animation = 'fade_in .175s ease-in-out both';

    }, 175);

    document.querySelector('#dropdown .options').style.animation = 'fade_out .175s ease-in-out both';


  }

}

function dropdown_choose(front, back) {

  options_display(false);

  cache.dropdown_answers.front = front;
  cache.dropdown_answers.back = back;

  document.querySelector(`#dropdown .choose-btn`).innerHTML = front;

}

function dropdown_custom_command() {

  let name = cache.dropdown_answers.name;
  let front = cache.dropdown_answers.front;
  let back = cache.dropdown_answers.back;

  if (front == null || back == null) {
    return undefined;
  }

  if (name == 'set-vocab-counter') {
    settings.learn.vocab_counter = parseInt(back);
  }

  if (name == 'attention_low_upper_case') {
    settings.learn.attention_low_upper_case = back === 'true' ? true : false;;
  }

  if (name == 'attention_spaces') {
    settings.learn.attention_spaces = back === 'true' ? true : false;;
  }

  save_local_storage();
  auto_initialize_ui();

}

function continue_dropdown() {

  dropdown_display(null, false);
  dropdown_custom_command();

  cache.dropdown_answers = {
    front: null,
    back: null,
    name: null
  };


}



/* --- POP UP & SMALL POP UP --- */



// pop_up_system

function delete_already_existing_user_input(name) {
  document.querySelectorAll(`#pop-up-area > #${name} input, #pop-up-area > #${name} textarea`).forEach(input => {
    input.value = null;
  })
}

function request_continue_processing_pop_up(action) {

  let continue_processing = true;

  if (cache.pop_up.length > 0) {
    continue_processing = false;
  }

  if (cache.pop_up.length == 1 && !action) {
    continue_processing = true;
  }

  return continue_processing;

}

function pop_up_adjustment(name, action) {

  if (action) {
    cache.pop_up.forEach(item => {
      pop_up_display(item, false);
      pop_up_cache_manager(item, false);
    })
    setTimeout(() => {
      pop_up(name, action);
    }, 500);
  }

}

function pop_up_cache_manager(name, action) {

  if (action == true) {
    cache.pop_up.push(name);
  } else {
    let counter = {
      count: 0,
      arypos: null
    }
    cache.pop_up.forEach(item => {
      if (item == name) {
        counter.arypos = counter.count;
      } else {
        counter.count++;
      }
    })
    cache.pop_up.splice(counter.arypos, 1);
  }

}

function pop_up_display(name, action) {

  if (action == true) {

    document.querySelector('#pop-up-area').style.display = 'block';
    document.querySelector(`#pop-up-area`).style.animation = 'slide_in .25s ease-in-out both';
    document.querySelector(`#pop-up-area > #${name}`).style.display = 'block';

  } else {

    document.querySelector(`#pop-up-area`).style.animation = 'slide_out .25s ease-in-out both';

    setTimeout(() => {
      document.querySelector('#pop-up-area').style.display = 'none';
      document.querySelector(`#pop-up-area > #${name}`).style.display = 'none';
    }, 250);

    // save interaction values

    if (!action) {
      save_pop_up_interaction_values(name);
    }

  }

}

// save_pop_up_interaction_values

function save_pop_up_interaction_values(name) {

  document.querySelectorAll(`#${name} input, #${name} textarea`).forEach(elmnt => {

    let already_added = false;
    let count = 0;
    let arypos = null;

    cache.pop_up_interactions.forEach(item => {
      if (item.pop_up == name && item.name == elmnt.getAttribute('name')) {
        already_added = true;
        arypos = count;
      } else {
        count++;
      }
    })

    if (already_added) {
      cache.pop_up_interactions.splice(arypos, 1);
    }

    cache.pop_up_interactions.push(
      {
        name: elmnt.getAttribute('name'),
        content: elmnt.value,
        pop_up: name,
        type: elmnt.tagName.toLocaleLowerCase
      }
    );

  })

}

function back_to_pop_up(destination) {

  pop_up(destination, true);

  setTimeout(() => {

    document.querySelectorAll(`#${destination} textarea, #${destination} input`).forEach(elmnt => {

      let name = elmnt.getAttribute('name');
      let content = null;

      cache.pop_up_interactions.forEach(data => {
        if (data.name == name) {
          content = data.content;
        }
      })

      elmnt.value = content;

    });

  }, 500);

}

function pop_up_custom_command(name, action) {

  if (name == 'add-vocab') {

    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).setAttribute('onclick', `add_vocab()`);

    document.querySelector(`#add-vocab > article:first-of-type > header > img`).setAttribute('src', `./src/img/languages/${app_language}.svg`);
    document.querySelector(`#add-vocab > article:first-of-type > header > span`).innerHTML = app_language;

    document.querySelector(`#add-vocab > article:last-of-type > header > img`).setAttribute('src', `./src/img/languages/${cache.vocab_list_context.language}.svg`);
    document.querySelector(`#add-vocab > article:last-of-type > header > span`).innerHTML = cache.vocab_list_context.language;

    if (!action) {
      let count = 0;
      let arypos = null;
      cache.pop_up_interactions.forEach(data => {
        if (data.name == 'note') {
          arypos = count;
        }
        count++;
      })

      cache.pop_up_interactions.splice(arypos, 1);
    }
  }

  if (name == 'edit-vocab' && action == true) {

    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).innerHTML = `Update ✍`;

    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).setAttribute('onclick', `update_vocab()`);

    document.querySelector(`#edit-vocab > article:first-of-type > header > img`).setAttribute('src', `./src/img/languages/${app_language}.svg`);
    document.querySelector(`#edit-vocab > article:first-of-type > header > span`).innerHTML = app_language;

    document.querySelector(`#edit-vocab > article:last-of-type > header > img`).setAttribute('src', `./src/img/languages/${cache.vocab_list_context.language}.svg`);
    document.querySelector(`#edit-vocab > article:last-of-type > header > span`).innerHTML = cache.vocab_list_context.language;

    cache.edit_vocab = true;

  }

  if (name == 'edit-vocab' && action == false) {
    cache.edit_vocab = false;
  }

  if (name == 'add-note') {

    setTimeout('display_note()', 50);

  }

  if (name == 'add-list') {

    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).innerHTML = 'Weiter 👉';
    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).setAttribute('onclick', 'create_vocab_list_steps("language")');
    document.querySelector('#add-list > article:first-of-type').style.display = 'block';
    document.querySelector('#add-list > article:first-of-type').style.animation = 'fade_in .25s ease-in-out both';
    document.querySelectorAll('#add-list > article:not(:first-of-type)').forEach(e => {
      e.style.display = 'none';
    })
    add_list_language_initialize();
    clean_clickable_box_cache();
    reset_my_active_elmnts('#add-list .choose-language');
    reset_my_active_elmnts('#add-list .accuracy-test-config');

  }

  if (name == 'edit-list') {

    if (!cache.clickable_box_already_done) {
      cache.clickable_box_already_done = true;
      clickable_box('#edit-list .text-accuracy section', cache.vocab_list_context.accuracy_text_config, true, true);
    } else {
      cache.clickable_box_already_done = false;
    }

    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).innerHTML = 'Update ✍';
    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).setAttribute('onclick', 'update_vocab_list()');

    document.querySelector('#edit-list .name input').value = cache.vocab_list_context.name;

  }

  if (name == 'add-exam') {

    if (!cache.vocab_list_context.exam) {
      document.querySelector('#add-exam h1:first-of-type').innerHTML = 'Prüfungstermin hinzufügen';
      document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).innerHTML = 'Hinzufügen 📅';
    } else {
      let value = null;
      exams.forEach(exam => {
        if (exam.refered_list == cache.vocab_list_context.name) {
          value = exam;
        }
      })
      document.querySelector('#add-exam input').value = sequence_convert_to_sys(value.date);
      document.querySelector('#add-exam h1:first-of-type').innerHTML = 'Prüfungstermin bearbeiten';
      document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).innerHTML = 'Update 📅';
    }

    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).setAttribute('onclick', 'add_update_exam()');

  }

}

function pop_up(name, action, vlx) {

  // custom commands

  pop_up_custom_command(name, action);

  let continue_processing = request_continue_processing_pop_up(action);

  if (!continue_processing) {
    pop_up_adjustment(name, action);
    return;
  } else {

    // display

    pop_up_display(name, action);

    // delete already existing user input

    if (action) {
      delete_already_existing_user_input(name);
    }

    if (vlx != null || vlx != false) {
      all_vocab_lists.forEach(vl => {
        if (vl.name == vlx) {
          cache.vocab_list_context = vl;
        }
      })
    }

    // cache

    pop_up_cache_manager(name, action);

    // system elements initialize

    document.querySelector(`#pop-up-area > #${name} > button:first-of-type`).setAttribute('onclick', `pop_up('${name}', false)`);
    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).innerHTML = 'Fertig ✅';

    // scroll -> top

    document.querySelector(`#pop-up-area > #${name}`).scrollTo(0, 0);

    // custom command

    pop_up_custom_command(name, action);

  }


}

// small_pop_up_system

function small_pop_up(name, action) {

  // action small pop up

  let small_pop_up = document.querySelector(`#small-pop-up-area > div.${name}`);

  if (action == null || action == true) {

    document.querySelector(`#small-pop-up-area`).style.display = 'flex';
    document.querySelector(`#small-pop-up-area`).style.animation = 'fade_in .25s ease-in-out both';
    small_pop_up.style.display = 'block';

    small_pop_up.style.animation = 'fade_in .25s ease-in-out both';

  } else {

    small_pop_up.style.animation = 'fade_out .25s ease-in-out both';

    setTimeout(() => {
      document.querySelector(`#small-pop-up-area`).style.display = 'none';
      document.querySelectorAll(`#small-pop-up-area > div`).forEach(small_pup => {
        small_pup.style.display = 'none';
      })
    }, 250);
    document.querySelector(`#small-pop-up-area`).style.animation = 'fade_out .25s ease-in-out both';

  }

}

// alert pop_up

function alert_pup(data) {

  small_pop_up('alert');

  document.querySelector('.alert > header > h1').innerHTML = data.heading;
  document.querySelector('.alert > p').innerHTML = data.text;
  document.querySelector('.alert > header > div').setAttribute('class', 'set-icon');

  if (data.icon != null) {
    document.querySelector('.alert > header > div').innerHTML = data.icon;
  } else {
    document.querySelector('.alert > header > div').innerHTML = 'cancel';
  }

  auto_initialize_ui();

}



/* ---  OPEN LIST DETAIL --- */



function calculate_list_progress(vocab_list) {

  let total_weight = vocab_list.reduce((sum, vocab) => sum + (5 - vocab.weight), 0);
  let max_weight = vocab_list.length * 4;

  return Math.max(0, (total_weight / max_weight) * 10);

}

function open_list_detail(name) {

  slide('list-detail');

  // find list

  let count = 0;

  while (all_vocab_lists[count] != null) {

    let list_name_active_search = all_vocab_lists[count].name;
    if (list_name_active_search == name) {
      break;
    } else {
      count++;
    }

  }

  add_to_recent(name);
  let vl_ary = all_vocab_lists[count];
  all_vocab_lists.splice(count, 1);
  all_vocab_lists.unshift(vl_ary);

  let vocab_list = all_vocab_lists[0];
  cache.vocab_list_context = vocab_list;

  // initialize

  //header - title & img
  document.querySelector('#list-detail > header > h2').innerHTML = vocab_list.name;
  document.querySelector('#list-detail > header > img').setAttribute('src', `./src/img/languages/${vocab_list.language}.svg`);

  // vocabularys
  document.querySelector('#list-detail > .vocab-list').innerHTML = null;
  let vocab_counter_parameter = 0;
  vocab_list.vocabularys.forEach(vocab => {
    document.querySelector('#list-detail > .vocab-list').innerHTML += `<button type="button" onclick="edit_vocab_initialize(${vocab_counter_parameter})">${vocab.lang2}</button>`;
    vocab_counter_parameter++;
  })

  // progress
  document.querySelector('#list-detail .progress-bar > div').style.width = `${vocab_list.progress}%`;

  // learned time
  let time_learned = get_time_list(name);
  let time_string = '';
  if (time_learned.hours != 0) {
    time_string += `${time_learned.hours} Stunden und `;
  }
  let minute_format = 'Minute';
  if (time_learned.minutes > 1) {
    minute_format += 'n';
  }
  time_string += `${time_learned.minutes} ${minute_format} gelernt`;
  document.querySelector('#list-detail > .info > div:nth-of-type(2) > h3').innerHTML = time_string;

  // exam information

  let exam_information_string = '';
  let get_exam = null;
  let day_difference = null;
  let is_date_past_var = null;

  exams.forEach(e => {
    if (e.refered_list == vocab_list.name) {
      get_exam = e;
      day_difference = date_difference(get_system_date(), get_exam.date);
      is_date_past_var = is_date_past(get_system_date(), get_exam.date);
    }
  })

  if (get_exam == null) {
    exam_information_string = `<i>keine Prüfung</i>`;
  } else {

    if (is_date_past_var) {
      exam_information_string = '<i>Prüfung abgeschlossen</i>';
    } else {

      if (day_difference == 0) {
        exam_information_string = 'Prüfung heute';
      }
      if (day_difference == 1) {
        exam_information_string = 'Prüfung morgen';
      }
      if (day_difference > 1) {
        exam_information_string = `Prüfung am ${convert_sys_date(get_exam.date)}`;
      }

    }

  }

  document.querySelector('#list-detail > .info > div:first-of-type > h3').innerHTML = exam_information_string;

  // add vocab btn
  document.querySelector(`#list-detail > .widget-row > button:first-of-type`).setAttribute('onclick', `pop_up('add-vocab', true, '${vocab_list.name}')`);

  // learn-btn
  if (vocab_list.vocabularys.length >= 5) {
    document.querySelector('#list-detail > .learn-btn > button').setAttribute('onclick', `learn('${vocab_list.name}')`);
    document.querySelector('.learn-btn > button').style.backgroundColor = 'var(--clr-primary)';
  } else {
    document.querySelector('#list-detail > .learn-btn > button').setAttribute('onclick', null);
    document.querySelector('.learn-btn > button').style.backgroundColor = 'var(--clr-primary-light)';
  }

  height_list_detail_vl();

}



/* --- LEARN --- */



// algorithm & choose vocab

function choose_vocab() {

  while (cache.learn.last_vocabs.length > 3) {
    cache.learn.last_vocabs.shift();
  }

  let choosen = false;
  while (!choosen) {

    // vars / data
    let vocab_list = cache.vocab_list_context.vocabularys;

    // total weights
    let total_weight = 0;

    vocab_list.forEach(function (vocab) {
      total_weight += vocab.weight;
    });

    // random number
    let random_num = Math.random() * total_weight;

    let current_sum = 0;
    let selected_vocab = null;

    vocab_list.forEach(function (vocab) {

      current_sum += vocab.weight;

      if (random_num <= current_sum && selected_vocab === null) {
        selected_vocab = vocab;
      }

    });

    if (!cache.learn.last_vocabs.includes(selected_vocab.lang1)) {
      return selected_vocab;
    }

  }

}

// set next vocab

function set_next_vocab(first_vocab) {

  user_answer_available = false;
  let next_vocab = choose_vocab();

  let requested_site = Math.floor(Math.random() * 2) + 1;
  cache.learn.requested_site = requested_site;
  cache.learn.vocab = next_vocab;

  if (requested_site == 1) {
    if (!first_vocab) {
      document.querySelector(`#learn > .flashcard > div`).style.animation = 'rotate_flashcard_1 .75s ease-in-out';
    }
    active_site = 2;
  } else {
    if (!first_vocab) {
      document.querySelector(`#learn > .flashcard > div`).style.animation = 'rotate_flashcard_2 .75s ease-in-out';
    }
    active_site = 1;
  }

  setTimeout(() => {
    document.querySelector(`#learn > .flashcard > div`).style.animation = 'none';
  }, 750);

  let wait_time = 0;
  if (!first_vocab) { wait_time += 375 }

  setTimeout(() => {

    if (requested_site == 1) {
      document.querySelector('#learn > .flashcard > span').innerHTML = next_vocab.lang2;
      cache.learn.solution = next_vocab.lang1;
    } else if (requested_site == 2) {
      document.querySelector('#learn > .flashcard > span').innerHTML = next_vocab.lang1;
      cache.learn.solution = next_vocab.lang2;
    }

    document.querySelector('#learn > .flashcard > p').innerHTML = next_vocab.note;

  }, wait_time);

  if (first_vocab == true) {
    document.querySelector('#learn > .turn-flashcard').style.display = 'flex';
    document.querySelector('#learn > .turn-flashcard > button').style.animation = 'fade_in .375s ease-in-out .125s both';
    document.querySelector('#learn > .flashcard > span').style.animation = 'fade_in .375s ease-in-out .125s both';
  } else {
    document.querySelector('#learn > .answer').style.animation = 'fade_out .375s ease-in-out both';
    document.querySelector('#learn > .flashcard > span').style.animation = 'fade_out .375s ease-in-out both';
    document.querySelector('#learn > .flashcard > button').style.animation = 'fade_out .375s ease-in-out both';
    setTimeout(() => {
      document.querySelector('#learn > .answer').style.display = 'none';
      document.querySelector('#learn > .turn-flashcard').style.display = 'flex';
      document.querySelector('#learn > .turn-flashcard > button').style.animation = 'fade_in .375s ease-in-out both';
      document.querySelector('#learn > .flashcard > span').style.animation = 'fade_in .375s ease-in-out both';
      document.querySelector('#learn > .flashcard > button').style.animation = 'fade_in .375s ease-in-out both';
    }, 375);
  }

  // text_accuracy


  if (cache.learn.text_accuracy_config == cache.learn.text_accuracy_counter) {
    text_accuracy_initialize();
    cache.learn.text_accuracy_counter = 0;
  } else {
    cache.learn.text_accuracy_counter++;
  }

  // show note button

  setTimeout(() => {

    if (cache.learn.note_on) {
      show_note();
    }

  }, 175);

  if (first_vocab) {
    decide_show_note_button(true);
  } else {
    decide_show_note_button();
  }

}

// rotate flashcard

let active_site;
let user_answer_available;

function rotate_flashcard() {

  document.querySelector('#learn > .flashcard > span').style.animation = 'fade_out .375s ease-in-out both';
  document.querySelector('#learn > .flashcard > button').style.animation = 'fade_out .375s ease-in-out both';

  setTimeout(() => {
    document.querySelector('#learn > .flashcard > span').style.animation = 'fade_in .375s ease-in-out both';
    document.querySelector('#learn > .flashcard > button').style.animation = 'fade_in .375s ease-in-out both';
  }, 375);

  let new_flashcard_text = null;

  if (active_site == 1) {

    document.querySelector(`#learn > .flashcard > div`).style.animation = 'rotate_flashcard_1 .75s ease-in-out';
    new_flashcard_text = cache.learn.vocab.lang2;
    active_site = 2;
  } else {
    document.querySelector(`#learn > .flashcard > div`).style.animation = 'rotate_flashcard_2 .75s ease-in-out';
    new_flashcard_text = cache.learn.vocab.lang1;
    active_site = 1;
  }

  setTimeout(() => {
    document.querySelector(`#learn > .flashcard > div`).style.animation = 'none';
  }, 750);

  setTimeout(() => {
    document.querySelector(`#learn > .flashcard > span`).innerHTML = new_flashcard_text;
  }, 375);

  if (user_answer_available == false) {

    user_answer_available = true;
    document.querySelector(`#learn > .turn-flashcard > button`).style.animation = 'fade_out .375s ease-in-out both';
    setTimeout(() => {
      document.querySelector(`#learn > .turn-flashcard`).style.display = 'none';
      document.querySelector(`#learn > .answer`).style.display = 'block';
    }, 375);

    document.querySelector(`#learn > .answer`).style.animation = 'fade_in .375s ease-in-out both';

  }

  setTimeout(() => {

    if (cache.learn.note_on) {
      show_note();
    }

  }, 175);

}

// answer vocab

function answer_vocab(weight) {

  if (cache.learn.vocab) {

    cache.learn.vocab.weight = weight;
    cache.learn.vocab.answer_protocol.push(weight);
    cache.learn.last_vocabs.push(cache.learn.vocab.lang1);
    cache.learn.vocab_counter++;
    cache.learn.progress += cache.learn.progress_per_vocab;
    document.querySelector(`#learn > .progress-bar > div`).style.width = cache.learn.progress + '%';
    cache.learn.answer_log.push(weight);
    save_local_storage();

    if (cache.learn.vocab_counter == settings.learn.vocab_counter) {
      enable_summary();
    } else {
      set_next_vocab();
    }

  }

}

// text accuracy

function text_accuracy_initialize() {

  document.querySelectorAll('.answer, .turn-flashcard').forEach(elmnt => {
    elmnt.style.animation = 'fade_out .375s ease-in-out both';
    setTimeout(() => {
      elmnt.style.display = 'none';
    }, 375);
  })

  document.querySelector('#learn > .text-accuracy > input').value = '';

  document.querySelector('#learn > .text-accuracy').style.display = 'block';
  document.querySelector('#learn > .text-accuracy').style.animation = 'fade_in .375s ease-in-out .375s both';
  document.querySelector('#learn> .text-accuracy > input').style.border = '3.5px solid var(--clr-primary)';

  document.querySelector('#learn > .flashcard').style.height = '300px';

}

function next_vocab_text_accuracy(weight) {

  answer_vocab(weight);

  setTimeout(() => {
    document.querySelector('#learn > .text-accuracy').style.display = 'none';
  }, 250);
  document.querySelector('#learn > .text-accuracy').style.animation = 'fade_out .25s ease-in-out .375s both';

  document.querySelector('#learn > .flashcard').style.height = '425px';

  document.querySelector(`#learn > .turn-flashcard`).style.display = 'flex';
  document.querySelector(`#learn > .turn-flashcard`).style.animation = 'fade_in .5s ease-in-out both';

  // active normal text accuracy useability

  setTimeout(() => {
    document.querySelector('#learn > .text-accuracy > button').innerHTML = `Überprüfen 🗃`;
    document.querySelector('#learn > .text-accuracy > button').setAttribute('onclick', 'check_text_accuracy()');
  }, 500);

}

function check_text_accuracy() {

  let requested_vocab = cache.learn.solution;
  let entered_solution = document.querySelector('#learn > .text-accuracy > input').value;

  if (settings.learn.attention_low_upper_case == false) {
    requested_vocab = requested_vocab.toUpperCase();
    entered_solution = entered_solution.toUpperCase();
  }

  if (settings.learn.attention_spaces == false) {
    requested_vocab = remove_spaces(requested_vocab);
    entered_solution = remove_spaces(entered_solution);
  }


  if (requested_vocab === entered_solution) {

    document.querySelector('#learn > .text-accuracy > input').style.border = 'solid 3.5px var(--clr-agree)';
    setTimeout(() => {
      next_vocab_text_accuracy(1);
    }, 1250);

  } else {

    document.querySelector('#learn > .text-accuracy > input').style.border = 'solid 3.5px var(--clr-warning)';
    document.querySelector('#learn > .text-accuracy > button').innerHTML = `Ok, verstanden. 👉`;
    document.querySelector('#learn > .text-accuracy > button').setAttribute('onclick', 'next_vocab_text_accuracy(4)');

  }

  user_answer_available = true;
  rotate_flashcard();

}

function show_note() {

  if (!cache.learn.note_on) {

    cache.learn.note_on = true;

    document.querySelector('#learn > .flashcard > p').style.animation = 'fade_in .25s ease-in-out .25s both';
    document.querySelector('#learn > .flashcard span').style.animation = 'fade_out .25s ease-in-out both';

  } else {

    cache.learn.note_on = false;

    document.querySelector('#learn > .flashcard > p').style.animation = 'fade_out .25s ease-in-out both';
    document.querySelector('#learn > .flashcard span').style.animation = 'fade_in .25s ease-in-out .25s both';

  }

}

function decide_show_note_button(instant) {

  let note = cache.learn.vocab.note;
  let visibility_state;
  let time = 0;
  if (instant == null) {
    time += 375;
  }

  if (note == '') {
    visibility_state = 'hidden';
    time = 250;
    document.querySelector('#learn > .flashcard > button').style.animation = `fade_out .${time} ease-in-out both !important`;
  } else {
    visibility_state = 'visible';
    document.querySelector('#learn > .flashcard > button').style.animation = `fade_in .${time} ease-in-out both !important`;
  }

  setTimeout(() => {
    document.querySelector('#learn > .flashcard > button').style.visibility = visibility_state
  }, time);

}

// start learning

function learn(vl) {

  // slide

  slide('learn');

  // set ui -> new learn start

  document.querySelector('#learn .summary').style.display = 'none';
  document.querySelector('#learn .turn-flashcard').style.display = 'flex';
  document.querySelector('#learn .turn-flashcard').style.animation = 'fade_in .25s ease-in-out both';
  document.querySelector('#learn .cancel-learn').style.display = 'flex';
  document.querySelector('#learn .cancel-learn').style.animation = 'fade_in .25s ease-in-out both';
  document.querySelector('#learn .flashcard').style.display = 'flex';
  document.querySelector('#learn .flashcard').style.animation = 'fade_in .25s ease-in-out both';
  document.querySelector('#learn .answer').style.display = 'none';
  document.querySelector('#learn .flashcard span').style.opacity = 0;
  document.querySelector('#learn .flashcard span').style.animation = 'fade_in .25s ease-in-out 5s ease-in-out';

  document.querySelector('#learn > .text-accuracy').style.display = 'none';
  document.querySelector('#learn > .flashcard').style.height = '425px';

  // disable bottom nav

  document.querySelector('#bottom-navigation').style.animation = 'slide_out .5s .25s both';
  setTimeout(() => {
    document.querySelector('#bottom-navigation').style.display = 'none';
  }, 750);

  document.querySelectorAll('main > section').forEach(slide => {
    slide.style.height = '100%';
  })

  // identify list

  let vocab_list;

  all_vocab_lists.forEach((list => {
    if (list.name == vl) {
      vocab_list = list;
    }
  }))

  cache.vocab_list_context = vocab_list;

  // initialize

  document.querySelector('#learn > .progress-bar > div').style.width = `${vocab_list.progress}%`;
  document.querySelector('#learn > header > img').setAttribute('src', `./src/img/languages/${vocab_list.language}.svg`);
  document.querySelector('#learn > header > img').setAttribute('alt', vocab_list.language);
  document.querySelector('#learn > header > span').innerHTML = vocab_list.name;
  document.querySelector('#learn > .flashcard > span').innerHTML = '';

  // set first / next vocab

  cache.learn.last_vocabs = [];
  cache.learn.vocab_counter = 0;
  cache.learn.text_accuracy_counter = 0;
  cache.learn.answer_log = [];
  cache.learn.note_on = false;

  // text accuracy config

  if (vocab_list.accuracy_text_config == 1) {
    cache.learn.text_accuracy_config = Infinity;
  }

  if (vocab_list.accuracy_text_config == 2) {
    cache.learn.text_accuracy_config = 3;
  }

  if (vocab_list.accuracy_text_config == 3) {
    cache.learn.text_accuracy_config = 1;
  }

  set_next_vocab(true);

  // start timer

  count_action('start');

  // proress

  cache.learn.progress = 5;
  cache.learn.progress_per_vocab = 100 / settings.learn.vocab_counter;

  document.querySelector(`#learn > .progress-bar > div`).style.width = cache.learn.progress + '%';

  // add to recent

  add_to_recent(vocab_list.name);

}

// cancel learn

function cancel_learn() {

  // stop timer

  let get_time = count_action('stop');
  time_notation.unshift(
    {
      time: {
        date: get_system_date(),
        time: get_sys_time()
      },
      duration: time_to_sec(get_time.time_object),
      refered_list: cache.vocab_list_context.name,
    }
  );

  save_local_storage();

  open_list_detail(cache.vocab_list_context.name);
  small_pop_up('verify-cancel-learning', false);

  // bottom nav reactivation

  document.querySelector('#bottom-navigation').style.animation = 'slide_in .35s .5s both';
  document.querySelector('#bottom-navigation').style.display = 'flex';

  // set progress -> 5

  cache.learn.progress = 5;
  document.querySelector(`#learn > .progress-bar > div`).style.width = cache.learn.progress + '%';

  setTimeout(() => {
    document.querySelectorAll('main > section').forEach(slide => {
      slide.style.height = 'calc(100% - 70px)';
    })
  }, 850);


}

// calculate accuracy

function calculate_accuracy(specific_values) {

  let ratings;

  if (specific_values == null) {
    ratings = cache.learn.answer_log;
  } else {
    ratings = specific_values;
  }

  let total = ratings.reduce((sum, rating) => sum + (4 - rating), 0);
  let accuracy = Math.round((total / (ratings.length * 3)) * 100);

  return Math.round(accuracy);

}

// calculate shift_coins

function calculate_shift_coins(accuracy, vocab_counter, time) {

  let added_shift_coins = 0;

  added_shift_coins += accuracy / 3;
  added_shift_coins += vocab_counter;
  added_shift_coins += time.time_object.seconds / 3;

  if (time.time_object.minutes == 0 && time.time_object.seconds < 20) {
    added_shift_coins /= 10;
  }

  added_shift_coins = Math.round(added_shift_coins);

  return added_shift_coins;

}

// enable summary

function enable_summary() {

  // stop timer

  let get_time = count_action('stop');

  document.querySelectorAll('.answer, .flashcard, .turn-flashcard, #learn > button:last-of-type').forEach(elmnt => {
    elmnt.style.animation = 'fade_out .5s ease-in-out both';
    setTimeout(() => {
      elmnt.style.display = 'none';
    }, 500);
  })

  document.querySelector('#learn > .summary').style.display = 'block';
  document.querySelector('#learn > .summary').style.animation = 'fade_in .375s ease-in-out .375s both';

  // create important data

  let accuracy = calculate_accuracy();

  // list progress initialize

  cache.vocab_list_context.progress += calculate_list_progress(cache.vocab_list_context.vocabularys);

  // apply star graphic

  if (accuracy < 50) {
    document.querySelector(`#learn > .summary > img`).setAttribute('src', './src/img/stars/one_star.svg');
  }

  if (accuracy >= 50 && accuracy < 85) {
    document.querySelector(`#learn > .summary > img`).setAttribute('src', './src/img/stars/two_stars.svg');
  }

  if (accuracy >= 85) {
    document.querySelector(`#learn > .summary > img`).setAttribute('src', './src/img/stars/three_stars.svg');
  }

  // add shift coins

  let added_shift_coins = calculate_shift_coins(accuracy, settings.learn.vocab_counter, get_time);

  (async () => {
    let returned_value = await wallet('add', added_shift_coins);
  })();

  // add time -> time_notation

  time_notation.unshift(
    {
      time: {
        date: get_system_date(),
        time: get_sys_time()
      },
      duration: time_to_sec(get_time.time_object),
      refered_list: cache.vocab_list_context.name,
    }
  );

  // intialize ui

  document.querySelector('#learn > .summary article:nth-of-type(1) span').innerHTML = accuracy + '%';
  document.querySelector('#learn > .summary article:nth-of-type(2) span').innerHTML = get_time.ui_time_string + 'm';
  document.querySelector('#learn > .summary article:nth-of-type(3) span').innerHTML = added_shift_coins;

  save_local_storage();

}

// finish learning

function finish_learning() {

  // enable bottom nav

  document.querySelector('#bottom-navigation').style.display = 'flex';
  document.querySelector('#bottom-navigation').style.animation = 'slide_in .5s .25s both';

  document.querySelectorAll('main > section').forEach(slide => {
    slide.style.height = 'calc(100% - 70px)';
  })

  // progress restart
  document.querySelector(`#learn > .progress-bar > div`).style.width = '5%';

  // slide

  open_list_detail(cache.vocab_list_context.name);

}



/* --- WALLET & PAYMENT --- */



async function wallet(request, amount) {

  const shift_coins = parseInt(localStorage.getItem('shift_coins')) || 0;

  let new_shift_coins_value = shift_coins;
  let continue_processing = false;

  let shift_coins_value_to_sha256 = await sha256(shift_coins);

  if (shift_coins_value_to_sha256 === localStorage.getItem('shift_coins_comparison')) {
    continue_processing = true;
  }

  if (continue_processing) {

    if (request === 'get') {
      return shift_coins;
    }

    if (request === 'add') {
      new_shift_coins_value += amount;
    }

    if (request === 'remove') {
      new_shift_coins_value -= amount;
    }

    localStorage.setItem('shift_coins', new_shift_coins_value);
    let new_shift_coins_value_to_sha256 = await sha256(new_shift_coins_value);
    localStorage.setItem('shift_coins_comparison', new_shift_coins_value_to_sha256);

  } else {

    hacking_retribution();
    return 'HACKING';

  }

}

// auto set -> 0 if not defined

if (localStorage.getItem('shift_coins') == null) {

  localStorage.setItem('shift_coins', 0);
  localStorage.setItem('shift_coins_comparison', '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9');

}

// verify shift_coins

(async () => {
  let returned_value = await wallet('get');
})();

// hacking

function hacking_retribution() {

  alert_pup({
    heading: 'HACKING! 👮',
    text: 'Deine ShiftCoins wurden zurück auf 0 gesetzt. 🪙',
    icon: 'alarm'
  });

  localStorage.setItem('shift_coins', 0);
  localStorage.setItem('shift_coins_comparison', '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9');

  (async () => {
    let returned_value = await wallet('get');
  })();

}



/* --- STATISTIC --- */



// streak

function get_streak() {

  if (time_notation.length == 0) {
    return 0;
  }

  let streak = 0;
  let day_count = 1;

  if (time_notation[0].time.date == get_system_date()) {
    streak++;
  }

  while (true) {

    let requested_date = new Date(new Date().setDate(new Date().getDate() - day_count));
    requested_date = convert_new_date_type(requested_date);
    let request_date_there = false;
    let count = 0;
    while (time_notation[count] != null) {
      if (time_notation[count].time.date == requested_date) {
        day_count++;
        streak++;
        request_date_there = true;
        break;
      }
      count++;
    }

    if (!request_date_there) {
      break;
    }

  }

  return streak;

}

// daily target

function daily_target_data() {

  let today_minutes = 0;
  let count = 0;

  while (time_notation[count] != null) {

    if (time_notation[count].time.date != get_system_date()) {
      break;
    } else {
      today_minutes += time_notation[count].duration;
      count++;
    }

  }

  today_minutes /= 60;
  today_minutes = Math.round(today_minutes);

  let done = today_minutes;
  let open = settings.daily_target - done;
  if (open < 0) {
    open = 0;
  }

  return { open: open, done: done };

}



/* --- IMPORT & EXPORT --- */



// export vocab list

function export_vocab_list() {

  let vocab_list = JSON.parse(JSON.stringify(cache.vocab_list_context));
  vocab_list.notifications = false;
  vocab_list.progress = 5;

  if (vocab_list.exam == true) {
    exams.forEach(e => {
      if (e.refered_list == vocab_list.name) {
        vocab_list.added_exam = e;
      }
    });
  }

  let export_data = JSON.stringify(vocab_list);
  let file_name = `${vocab_list.name}.vocab`;

  const blob = new Blob([export_data], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = file_name;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

}

// import vocab list

function import_vocab_list() {

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.vocab';

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type !== 'application/octet-stream' && !file.name.endsWith('.vocab')) {
        console.error('Bitte wähle eine gültige .vocab-Datei aus.');
        alert_pup(
          {
            heading: 'Upload-Fehler',
            text: 'Die Datei muss auf .VOCAB enden. 📁'
          }
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const vocab_list = JSON.parse(content);
        add_imported_list(vocab_list);
      };

      reader.onerror = () => {
        console.error('Fehler beim Lesen der Datei.');
        window.location.reload();
      };

      reader.readAsText(file);
    }
  });

  input.click();

}

function add_imported_list(file_data) {

  let vocab_list = file_data;
  let accepted_builds = ['1.0'];

  if (accepted_builds.includes(vocab_list.version.build)) {

    vocab_list.progress = 5;
    vocab_list.source = 'imported';
    vocab_list.vocabularys.forEach(v => {
      v.weight = 4;
    });

    let all_vocab_list_names = [];
    all_vocab_lists.forEach(vl => { all_vocab_list_names.push(vl.name); });

    if (all_vocab_list_names.includes(vocab_list.name)) {

      let new_name = vocab_list.name;
      let count = 1;

      while (all_vocab_list_names.includes(new_name)) {
        new_name = `${vocab_list.name} (${count})`;
        count++;
      }

      vocab_list.name = new_name;

    }

    if (vocab_list.exam == true) {
      exams.push(vocab_list.added_exam);
    }

    delete vocab_list.added_exam;

    all_vocab_lists.unshift(vocab_list);
    add_to_recent(vocab_list.name);

    save_local_storage();
    auto_initialize_ui();
    setTimeout(() => {
      open_list_detail(vocab_list.name);
    }, 250);

  } else {

    alert_pup(
      {
        heading: 'App-Version Err',
        text: 'Exportierte Listen aus dieser App-Version werden nicht unterstützt. ⛔'
      }
    );

    return;

  }

}