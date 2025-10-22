/*



*** VERY IMPORTANT 👇 ***



* 🚀 Projekt: Memory Shift - Learn smarter
* 📜 Urheberrecht © 2024 WebByte Studio (Timon Schroth). Alle Rechte vorbehalten.
* 🌐 Website: https://memoryshift.app
*
* ❗ Dieses Programm ist urheberrechtlich geschützt. Es darf ohne ausdrückliche schriftliche
* Genehmigung von WebByte Studio weder kopiert, vervielfältigt, verbreitet noch in
* irgendeiner Weise verwendet oder verändert werden.
*
* ❗ Jede unautorisierte Nutzung, einschließlich des Kopierens, Veränderns, oder des
* Vertriebs, ist untersagt und kann zivil- und strafrechtlich verfolgt werden.
*
* 📬 Kontakt: hey@timonschroth.de



*/



"use strict";



/* --- UI APP OPENING --- */



function fast_opening() {

  document.querySelector('main').style.display = 'block';
  document.querySelector('#bottom-navigation').style.display = 'flex';
  document.querySelector('#app-opening').style.animation = 'fade_out 0s ease-in-out both';

  document.querySelector('#app-opening').style.display = 'none';

  document.querySelectorAll('main > section').forEach(slide => {
    slide.style.animation = 'slide_forward .35s ease-in-out both';
  });

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

  }, 2850);

}


function app_opening(speed, destination_slide) {

  if (check_setup_required()) {
    destination_slide = 'setup';
    setTimeout(() => {
      document.querySelector('#setup').style.height = '100%';
      document.querySelector('#bottom-navigation').style.display = 'none';
    }, 3000);
  }

  let slide_delay = 3000;

  if (speed == 'slow') {
    slow_opening();
  } else if (speed == 'fast') {
    slide_delay = 500;
    fast_opening();
  }

  setTimeout(() => {
    slide(destination_slide);
    document.querySelectorAll('#app-opening *').forEach(ao => {
      ao.style.animation = 'fade_out .25s ease-in-out both';
      setTimeout(() => {
        ao.remove();
      }, 250);
    })
  }, slide_delay);

}



/* --- STARTUP CONFIGURATION & ADJUSTMENTS --- */



// auto set -> 0 if not defined


function set_shop_and_money_to_zero() {

  localStorage.setItem('shift_coins', 0);
  localStorage.setItem('shift_coins_comparison', safe_sha_256(0));

  localStorage.setItem('owned_shop_items', JSON.stringify([]))
  localStorage.setItem('owned_shop_items_comparison', safe_sha_256([]));

}


function adjust_slide_height() {

  document.querySelectorAll('main > section').forEach(slide => {
    slide.innerHTML += `
      <div style="width: 100%; height: 80px; display: block;"></div>
    `;
  })

}

adjust_slide_height();


function deactivate_autocomplete_input() {

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("input").forEach(input => {
      input.setAttribute("autocomplete", "off");
    });
  });

}

deactivate_autocomplete_input();


document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.requestFullscreen();
});


function ignore_user_actions(duration) {

  let blocker = true

  const block_event = (event) => {
    if (blocker) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  const events = ['click', 'touchstart', 'mousedown', 'keydown']
  events.forEach((event) => document.addEventListener(event, block_event, true))

  setTimeout(() => {
    blocker = false
    events.forEach((event) => document.removeEventListener(event, block_event, true))
  }, duration)

}



/* --- DATA CENTER --- */



const version = {
  build: '4e',
  channel: 'stable',
  title: 'AURORA edge',
  subtitle: "Glow through the Winter",
  emoji: '❄'
};


localStorage.setItem('version', JSON.stringify(version));


let user = JSON.parse(localStorage.getItem('user')) || {

  name: {
    first_name: null,
    last_name: null
  },
  birthdate: null,
  gender: undefined,
  email: null,
  school: null,
  avatar: './src/img/account.png'

};


const ms_watermark_hash = "MShift|WBStudio2024";

const app_language = 'Deutsch';
const available_languages = ['Englisch', 'Französisch', 'Spanisch', 'Latein', 'Griechisch', 'Russisch'];


let app_open_counter = parseInt(localStorage.getItem('app_open_counter')) || 0;
app_open_counter++;
localStorage.setItem('app_open_counter', app_open_counter);


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
  auto_theme_change: true,
  shop: {
    category: null,
    name: null,
    shift_coins_required: null
  },
  secret_console_activation_count: 0,
  setup: {
    progress: 0
  }

};


let settings = JSON.parse(localStorage.getItem('settings')) || {

  learn: {
    vocab_counter: 10,
    attention_low_upper_case: false,
    attention_spaces: false
  },
  daily_target: 5

};


let all_vocab_lists = JSON.parse(localStorage.getItem('all_vocab_lists')) || [];
let exams = JSON.parse(localStorage.getItem('exams')) || [];
let time_notation = JSON.parse(localStorage.getItem('time_notation')) || [];
let recent_list_opens = JSON.parse(localStorage.getItem('recent_list_opens')) || [];



/* --- MOTION CONTROL ENGINE --- */



// slide


let active_slide = null;
let recent_slide;
let bottom_nav_inclusions = ['home', 'library', 'statistic', 'shop'];


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


// pop up


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

    if (!action) {
      save_pop_up_interaction_values(name);
    }

  }

}


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
      clickable_box('#edit-list .accuracy-test section', cache.vocab_list_context.accuracy_text_config, true);
    } else {
      cache.clickable_box_already_done = false;
    }

    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).innerHTML = 'Update ✍';
    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).setAttribute('onclick', 'update_vocab_list()');

    document.querySelector('#edit-list .name input').value = cache.vocab_list_context.name;

    edit_list_dropdown_ini();

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

  pop_up_custom_command(name, action);

  let continue_processing = request_continue_processing_pop_up(action);

  if (!continue_processing) {
    pop_up_adjustment(name, action);
    return;
  } else {

    pop_up_display(name, action);

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

    pop_up_cache_manager(name, action);

    document.querySelector(`#pop-up-area > #${name} > button:first-of-type`).setAttribute('onclick', `pop_up('${name}', false)`);
    document.querySelector(`#pop-up-area > #${name} > section:last-of-type > button`).innerHTML = 'Fertig ✅';

    document.querySelector(`#pop-up-area > #${name}`).scrollTo(0, 0);

    pop_up_custom_command(name, action);

  }

}


// small pop up


function small_pop_up(name, action) {

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

  auto_set_icons();

}


// alert pop up


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

  auto_set_icons();

}


// info


function throw_info(data) {

  document.querySelector('#info-area').style.display = 'flex';
  document.querySelector('#info').style.display = 'block';
  document.querySelector('#info').style.animation = 'slide_in .175s ease-out both';

  document.querySelectorAll('main, #additional-theme-item').forEach(e => {
    e.style.filter = 'brightness(20%)';
    e.style.opacity = '0.2';
  })

  document.querySelector('#bottom-navigation').style.animation = 'slide_out .25s ease-in-out both';

  document.querySelector('#info div span').innerHTML = data.emoji;
  document.querySelector('#info div h1').innerHTML = data.headline;
  document.querySelector('#info p').innerHTML = data.text;

  document.querySelector('#info article > button:last-of-type').setAttribute('onclick', data.onclick);

  if (data.custom_btn_text != null) {
    document.querySelector('#info article > button:last-of-type').innerHTML = data.custom_btn_text;
  } else {
    document.querySelector('#info article > button:last-of-type').innerHTML = 'Okay ✅';
  }

}


function close_info() {

  document.querySelector('#info').style.animation = 'slide_out .175s ease-out both';
  setTimeout(() => {
    document.querySelector('#info').style.display = 'block';
    document.querySelector('#info-area').style.display = 'none';
  }, 175);

  document.querySelectorAll('main, #additional-theme-item').forEach(e => {
    e.style.filter = 'unset';
    e.style.opacity = '1';
  })

  document.querySelector('#bottom-navigation').style.animation = 'slide_in .25s ease-in-out both';

}


// flexible area


function throw_flexible_area(id) {

  document.querySelectorAll('main, #additional-theme-item').forEach(e => {
    e.style.filter = 'brightness(20%)';
    e.style.opacity = '0.2';
  })

  document.querySelectorAll(`#${id} input, #${id} textarea`).forEach(i => {
    i.value = null;
  })

  document.querySelector('#bottom-navigation').style.animation = 'slide_out .25s ease-in-out both';

  document.querySelector('#flexible-area').style.display = 'flex';
  document.querySelector(`#flexible-area > #${id}`).style.display = 'block';
  document.querySelector(`#flexible-area > #${id}`).style.animation = 'fade_in .25s ease-in-out both';

}


function close_flexible_area() {

  document.querySelectorAll('main, #additional-theme-item').forEach(e => {
    e.style.filter = 'brightness(100%)';
    e.style.opacity = '1';
  })

  document.querySelector('#bottom-navigation').style.animation = 'slide_in .25s ease-in-out both';

  setTimeout(() => {
    document.querySelector('#flexible-area').style.display = 'none';
    document.querySelectorAll('#flexible-area > div').forEach(e => { e.style.display = 'none'; })
  }, 250);

  document.querySelectorAll('#flexible-area > div').forEach(e => { e.style.animation = 'fade_out .25s ease-in-out both'; })

}


// overlay animation


function overlay_animation(path, overlay, duration_out) {

  document.querySelector('#overlay-animation > img').setAttribute('src', null);

  if (overlay === 1) {
    document.querySelector('#overlay-animation').style.zIndex = 1;
  } else {
    document.querySelector('#overlay-animation').style.zIndex = 'unset';
  }

  let duration = duration_out || 2700;

  document.querySelector('#overlay-animation').style.display = 'flex';
  document.querySelector('#overlay-animation').style.animation = 'fade_in .25s';
  document.querySelector('#overlay-animation > img').setAttribute('src', path);
  setTimeout(() => {
    document.querySelector('#overlay-animation').style.animation = 'fade_out 1s';
    setTimeout(() => {
      document.querySelector('#overlay-animation').style.display = 'none';
    }, 250);
  }, duration);

}



/* --- USER INPUT OPERATION --- */



// clickable box


function clean_clickable_box_cache() {
  cache.clickable_box_context = [];
}


function reset_my_active_elmnts(parent) {

  document.querySelectorAll(`${parent} > div`).forEach(e => {
    e.style.outline = '3px solid var(--clr-deviation)';
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
      document.querySelector(`${parent} > div:nth-of-type(${pos})`).style.outline = '3px solid var(--clr-deviation)';
    } else {
      document.querySelector(`${parent} > div:nth-of-type(${pos})`).style.backgroundColor = 'var(--clr-deviation)';
      document.querySelectorAll(`${parent} > div:nth-of-type(${pos}) *`).forEach(elmnt => {
        elmnt.style.color = 'var(--clr-font)';
        elmnt.style.stroke = 'var(--clr-font)';
      })
    }

    cache.clickable_box_context.splice(array_pos, 1);
  } else {
    if (bg_style == null || bg_style == false) {
      document.querySelector(`${parent} > div:nth-of-type(${pos})`).style.outline = '3px solid var(--clr-primary)';
    } else {
      document.querySelector(`${parent} > div:nth-of-type(${pos})`).style.backgroundColor = 'var(--clr-primary)';
      document.querySelectorAll(`${parent} > div:nth-of-type(${pos}) *`).forEach(elmnt => {
        elmnt.style.color = 'var(--clr-font-opposite)';
        elmnt.style.stroke = 'var(--clr-font-opposite)';
      })
    }
    if (one_option) {
      if (bg_style == null || bg_style == false) {
        cache.clickable_box_context.forEach(item => {
          document.querySelector(`${parent} > div:nth-of-type(${item})`).style.outline = '3px solid var(--clr-deviation)';
        })
      } else {
        cache.clickable_box_context.forEach(item => {
          document.querySelector(`${parent} > div:nth-of-type(${item})`).style.backgroundColor = 'var(--clr-deviation)';
          document.querySelectorAll(`${parent} > div:nth-of-type(${item}) *`).forEach(elmnt => {
            elmnt.style.color = 'var(--clr-font)';
            elmnt.style.stroke = 'var(--clr-font)';
          })
        })
      }
      cache.clickable_box_context = [pos];
    } else {
      cache.clickable_box_context.push(pos);
    }
  }

}


// dropdown


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
  },
  {
    name: 'daily_target',
    emoji: '🎯',
    headline: 'Tägliches Ziel',
    options: [
      {
        front: '5 Minuten (empfohlen)',
        back: 5
      },
      {
        front: '10 Minuten',
        back: 10
      },
      {
        front: '15 Minuten',
        back: 15
      },
      {
        front: '20 Minuten',
        back: 20
      }
    ]
  },
  {
    name: 'site-focus',
    emoji: '🗃',
    headline: 'Sprachfokus',
    options: [
      {
        front: 'Automatisch (empfohlen)',
        back: null
      },
      {
        front: 'App-Sprache',
        back: 2
      },
      {
        front: 'Fremdsprache',
        back: 1
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

  if (name == 'daily_target') {
    settings.daily_target = parseInt(back);
  }

  if (name == 'site-focus') {
    cache.vocab_list_context.site_focus = parseInt(back);
    edit_list_dropdown_ini();
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



/* --- MEMORY SHIFT FRAMEWORK --- */



// list detail


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
  if (vocab_list.vocabularys.length == 0) {
    document.querySelector('#list-detail > .vocab-list').innerHTML = `<span>Keine Vokabeln 🗃</span>`;
  }

  // progress
  document.querySelector('#list-detail .progress-bar > div').style.width = `${vocab_list.progress}%`;

  // learned time
  let time_learned = get_time_list(name);
  let time_string = '';
  if (time_learned.hours != 0) {
    time_string += `${time_learned.hours} Stunden und `;
  }
  let minute_format = 'Minute';
  if (time_learned.minutes > 1 || time_learned.minutes == 0) {
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
    document.querySelector('.learn-btn > button').setAttribute('onclick', `learn('${vocab_list.name}')`);
    document.querySelector('.learn-btn > button').style.backgroundColor = 'var(--clr-primary)';

  } else {
    document.querySelector('.learn-btn > button').setAttribute('onclick', `alert_pup({
      heading: '5 Vokabeln',
      text: 'Ab 5 Vokabeln kannst du lernen. 🗃'
      })`);
    document.querySelector('.learn-btn > button').style.backgroundColor = 'var(--clr-primary-light)';

  }

  height_list_detail_vl();

}


// create vocabulary list


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
    site_focus: null,
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

      if (new_vocab_list.name.length <= 20) {

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

      } else {

        alert_pup(
          {
            heading: 'Zu lang',
            text: 'Bitte verwenden Sie einen kürzeren Titel. 🔤'
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


// edit vocabulary list


function update_vocab_list() {

  let continue_processing = true;

  let name = document.querySelector('#edit-list .name input').value;
  let accuracy_test_config = cache.clickable_box_context[0];

  if (remove_spaces(name) == '' || accuracy_test_config == null) {

    alert_pup(
      {
        heading: 'Korrrekt?',
        text: 'Bitte fülle beide Felder aus.'
      }
    );

  } else {

    let all_vocab_list_names = [];
    all_vocab_lists.forEach(vl => { all_vocab_list_names.push(vl.name); });

    if (name.length <= 20) {

      if (all_vocab_list_names.includes(name)) {

        if (cache.vocab_list_context.name != name) {

          let new_name = name;
          let count = 1;

          while (all_vocab_list_names.includes(new_name)) {
            new_name = `${name} (${count})`;
            count++;
          }

          name = new_name;

        }

      }

    } else {

      continue_processing = false;
      alert_pup(
        {
          heading: 'Zu lang',
          text: 'Bitte verwenden Sie einen kürzeren Titel. 🔤'
        }
      );

    }

    if (continue_processing) {

      cache.vocab_list_context.name = name;
      cache.vocab_list_context.accuracy_text_config = accuracy_test_config;
      save_local_storage();

      pop_up('edit-list', false);
      open_list_detail(cache.vocab_list_context.name);

    }

  }

}


// delete vocabulary list


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


// create vocabulary


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

    let all_l1_vocabs_in_vl = [];
    cache.vocab_list_context.vocabularys.forEach(v => {
      all_l1_vocabs_in_vl.push(v.lang1);
    })

    if (!all_l1_vocabs_in_vl.includes(native_language)) {

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
          heading: 'Nicht möglich.',
          text: `Das Feld ${app_language} muss verändert werden. ✍`
        }
      );

    }

  } else {
    alert_pup(
      {
        heading: 'Korrrekt?',
        text: 'Bitte fülle beide Felder aus.'
      }
    );
  }

}


// edit vocabulary


function edit_vocab_initialize(array_pos) {

  pop_up('edit-vocab', true);

  delete_vocab_preperation(array_pos);

  let vocab = cache.vocab_list_context.vocabularys[array_pos];
  cache.vocab_context_count = array_pos;

  document.querySelector('#edit-vocab > article:first-of-type > input').value = vocab.lang1;
  document.querySelector('#edit-vocab > article:last-of-type > input').value = vocab.lang2;


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


// delete vocabulary


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


// add & update exam


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


// create note


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



/* --- LEARNING --- */



// algorithm

function choose_vocab() {

  while (cache.learn.last_vocabs.length > 3) {
    cache.learn.last_vocabs.shift();
  }

  let choosen = false;
  let count = 0;

  while (!choosen) {

    count++;

    let vocab_list = cache.vocab_list_context.vocabularys;

    if (count > 1000) {
      selected_vocab = vocab_list[Math.floor(Math.random() * vocab_list.length)];
    }

    let total_weight = 0;

    vocab_list.forEach(function (vocab) {
      total_weight += vocab.weight;
    });

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

  ignore_user_actions(500);

  user_answer_available = false;
  let next_vocab = choose_vocab();

  let requested_site = null;

  if (cache.vocab_list_context.site_focus != null) {
    requested_site = cache.vocab_list_context.site_focus;
  } else {
    requested_site = Math.floor(Math.random() * 2) + 1;
  }

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

  if (cache.learn.accuracy_test_config == cache.learn.accuracy_test_counter) {
    accuracy_test_initialize();
    cache.learn.accuracy_test_counter = 0;
  } else {
    cache.learn.accuracy_test_counter++;
  }

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

  apply_correct_font_site_learn();

}


// rotate flashcard


let active_site;
let user_answer_available;

function rotate_flashcard() {

  ignore_user_actions(500);

  if (!cache.learn.disable_rotate) {

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

    apply_correct_font_site_learn();

  }

}


// apply correct font site learn


function apply_correct_font_site_learn() {

  setTimeout(() => {

    if (cache.learn.vocab.lang1.length > 50 || cache.learn.vocab.lang2.length > 50) {
      document.querySelector('#learn .flashcard > span').style.fontSize = '2rem';
    } else {
      document.querySelector('#learn .flashcard > span').style.fontSize = '2.5rem';
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


function accuracy_test_initialize() {

  document.querySelectorAll('.answer, .turn-flashcard').forEach(elmnt => {
    elmnt.style.animation = 'fade_out .375s ease-in-out both';
    setTimeout(() => {
      elmnt.style.display = 'none';
    }, 375);
  })

  document.querySelector('#learn .cancel-learn').style.animation = 'fade_out .25s both';
  setTimeout(() => {
    document.querySelector('#learn .cancel-learn').style.visibility = 'hidden';
  }, 250);

  document.querySelector('#learn > .accuracy-test > input').value = '';

  document.querySelector('#learn > .accuracy-test').style.display = 'block';
  document.querySelector('#learn > .accuracy-test').style.animation = 'fade_in .375s ease-in-out .375s both';
  document.querySelector('#learn> .accuracy-test > input').style.border = '3.5px solid var(--clr-primary)';

  document.querySelector('#learn > .flashcard').style.height = '300px';

  cache.learn.disable_rotate = true;

}


function next_vocab_accuracy_test(weight) {

  answer_vocab(weight);

  setTimeout(() => {
    document.querySelector('#learn > .accuracy-test').style.display = 'none';
  }, 250);

  document.querySelector('#learn .cancel-learn').style.animation = 'fade_in .25s both';
  document.querySelector('#learn .cancel-learn').style.visibility = 'visible';

  document.querySelector('#learn > .accuracy-test').style.animation = 'fade_out .25s ease-in-out .375s both';

  document.querySelector('#learn > .flashcard').style.height = '425px';

  document.querySelector(`#learn > .turn-flashcard`).style.display = 'flex';
  document.querySelector(`#learn > .turn-flashcard`).style.animation = 'fade_in .5s ease-in-out both';

  setTimeout(() => {
    document.querySelector('#learn > .accuracy-test > button').innerHTML = `Überprüfen 🗃`;
    document.querySelector('#learn > .accuracy-test > button').setAttribute('onclick', 'check_accuracy_test()');
  }, 500);

}


function check_accuracy_test() {

  cache.learn.disable_rotate = false;

  let requested_vocab = cache.learn.solution;
  let entered_solution = document.querySelector('#learn > .accuracy-test > input').value;

  if (settings.learn.attention_low_upper_case == false) {
    requested_vocab = requested_vocab.toUpperCase();
    entered_solution = entered_solution.toUpperCase();
  }

  if (settings.learn.attention_spaces == false) {
    requested_vocab = remove_spaces(requested_vocab);
    entered_solution = remove_spaces(entered_solution);
  }

  if (requested_vocab === entered_solution) {

    document.querySelector('#learn > .accuracy-test > input').style.border = 'solid 3.5px var(--clr-agree)';
    setTimeout(() => {
      next_vocab_accuracy_test(1);
    }, 1250);

  } else {

    document.querySelector('#learn > .accuracy-test > input').style.border = 'solid 3.5px var(--clr-warning)';
    document.querySelector('#learn > .accuracy-test > button').innerHTML = `Ok, verstanden. 👉`;
    document.querySelector('#learn > .accuracy-test > button').setAttribute('onclick', 'next_vocab_accuracy_test(4)');

  }

  user_answer_available = true;
  rotate_flashcard();

}


// note


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

  slide('learn');

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

  document.querySelector('#learn > .accuracy-test').style.display = 'none';
  document.querySelector('#learn > .flashcard').style.height = '425px';


  document.querySelector('#learn .summary img').style.width = 0;
  document.querySelector('#learn .summary img').style.height = 0;


  document.querySelector('#bottom-navigation').style.animation = 'slide_out .5s .25s both';
  setTimeout(() => {
    document.querySelector('#bottom-navigation').style.display = 'none';
  }, 750);

  document.querySelectorAll('main > section').forEach(slide => {
    slide.style.height = '100%';
  })


  let vocab_list;

  all_vocab_lists.forEach((list => {
    if (list.name == vl) {
      vocab_list = list;
    }
  }))

  cache.vocab_list_context = vocab_list;


  document.querySelector('#learn > .progress-bar > div').style.width = `${vocab_list.progress}%`;
  document.querySelector('#learn > header > img').setAttribute('src', `./src/img/languages/${vocab_list.language}.svg`);
  document.querySelector('#learn > header > img').setAttribute('alt', vocab_list.language);
  document.querySelector('#learn > header > span').innerHTML = vocab_list.name;
  document.querySelector('#learn > .flashcard > span').innerHTML = '';


  cache.learn.last_vocabs = [];
  cache.learn.vocab_counter = 0;
  cache.learn.accuracy_test_counter = 0;
  cache.learn.answer_log = [];
  cache.learn.note_on = false;
  cache.learn.disable_rotate = false;


  if (vocab_list.accuracy_text_config == 1) {
    cache.learn.accuracy_test_config = Infinity;
  }

  if (vocab_list.accuracy_text_config == 2) {
    cache.learn.accuracy_test_config = 3;
  }

  if (vocab_list.accuracy_text_config == 3) {
    cache.learn.accuracy_test_config = 1;
  }

  set_next_vocab(true);


  count_action('start');


  cache.learn.progress = 5;
  cache.learn.progress_per_vocab = 100 / settings.learn.vocab_counter;

  document.querySelector(`#learn > .progress-bar > div`).style.width = cache.learn.progress + '%';


  add_to_recent(vocab_list.name);

}


// cancel learn


function cancel_learn() {

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

  document.querySelector('#bottom-navigation').style.animation = 'slide_in .35s .5s both';
  document.querySelector('#bottom-navigation').style.display = 'flex';

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

  added_shift_coins += vocab_counter / 2;
  added_shift_coins += accuracy / 4;
  added_shift_coins += time_to_sec(time.time_object) / 6;
  added_shift_coins = Math.round(added_shift_coins);


  added_shift_coins /= 1.5;
  added_shift_coins = Math.round(added_shift_coins);

  if (time_to_sec(time.time_object) <= vocab_counter * 1.5) {
    added_shift_coins = 3;
  }

  if (added_shift_coins > 25) {
    added_shift_coins = 25;
  }

  return added_shift_coins;

}


// enable summary


function enable_summary() {

  let get_time = count_action('stop');

  document.querySelectorAll('.answer, .flashcard, .turn-flashcard, #learn > button:last-of-type').forEach(elmnt => {
    elmnt.style.animation = 'fade_out .5s ease-in-out both';
    setTimeout(() => {
      elmnt.style.display = 'none';
    }, 500);
  })

  document.querySelector('#learn > .summary').style.display = 'block';
  document.querySelector('#learn > .summary').style.animation = 'fade_in .375s ease-in-out .375s both';

  let accuracy = calculate_accuracy();

  cache.vocab_list_context.progress += calculate_list_progress(cache.vocab_list_context.vocabularys);

  document.querySelector('#learn .summary img').style.animation = 'sizing_in_summary_stars 1s .175s both'

  if (accuracy < 50) {
    document.querySelector(`#learn > .summary > img`).setAttribute('src', './src/img/stars/one_star.svg');
  }

  if (accuracy >= 50 && accuracy < 85) {
    document.querySelector(`#learn > .summary > img`).setAttribute('src', './src/img/stars/two_stars.svg');
  }

  if (accuracy >= 85) {
    document.querySelector(`#learn > .summary > img`).setAttribute('src', './src/img/stars/three_stars.svg');
  }

  let added_shift_coins = calculate_shift_coins(accuracy, settings.learn.vocab_counter, get_time);

  wallet('add', added_shift_coins);

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

  document.querySelector('#learn > .summary article:nth-of-type(1) span').innerHTML = accuracy + '%';
  document.querySelector('#learn > .summary article:nth-of-type(2) span').innerHTML = get_time.ui_time_string + 'm';
  document.querySelector('#learn > .summary article:nth-of-type(3) span').innerHTML = added_shift_coins;

  save_local_storage();

}


// finish learning


function finish_learning() {

  document.querySelector('#bottom-navigation').style.display = 'flex';
  document.querySelector('#bottom-navigation').style.animation = 'slide_in .5s .25s both';

  document.querySelectorAll('main > section').forEach(slide => {
    slide.style.height = 'calc(100% - 70px)';
  })

  document.querySelector(`#learn > .progress-bar > div`).style.width = '5%';

  open_list_detail(cache.vocab_list_context.name);

  if (localStorage.getItem('latest_dt_reward') != get_system_date() && get_time_today() >= settings.daily_target) {
    open_daily_target();
    localStorage.setItem('latest_dt_reward', get_system_date());
  }

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


// save highest streak


function streak_checkup() {

  let streak_now = get_streak();

  if (user.highest_streak == null) {
    user.highest_streak = streak_now;
  } else {

    if (user.highest_streak < streak_now) {
      user.highest_streak = streak_now;
    }

  }

  save_local_storage();

}

streak_checkup();


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


function open_daily_target() {

  document.querySelector('#reach-daily-goal').style.display = 'block';
  document.querySelector('#reach-daily-goal').style.animation = 'fade_in .25s ease-in-out both';
  document.querySelector('#bottom-navigation').style.animation = 'slide_out .25s ease-in-out both';

  setTimeout(() => {
    document.querySelector('#reach-daily-goal > img').style.animation = 'fade_out .25s ease-in-out both';
    setTimeout(() => {
      document.querySelector('#reach-daily-goal > img').style.display = 'none';
    }, 250);
  }, 3000);

  document.querySelector('#reach-daily-goal article h1').innerHTML = settings.daily_target * 20;

  wallet('add', settings.daily_target * 20);

}


function close_rdg() {

  document.querySelector('#reach-daily-goal').style.animation = 'fade_out .25s ease-in-out both';
  setTimeout(() => {
    document.querySelector('#reach-daily-goal').style.display = 'none';
  }, 250);

  document.querySelector('#bottom-navigation').style.animation = 'slide_in .25s ease-in-out both';

}



/* --- CHARTS --- */



let daily_target_open;
let daily_target_done;


// daily target mini


const daily_target_mini = document.getElementById('daily-goal');

let daily_goal_data = {
  labels: [
    'Erledigt',
    'Offen',
  ],
  datasets: [{
    label: 'Fortschritt',
    data: [daily_target_done, daily_target_open],
    backgroundColor: [
      '#ECECEC',
      '#000',
    ],
  }]
};

let daily_target_mini_chart = new Chart(daily_target_mini, {
  type: 'doughnut',
  data: daily_goal_data,
  options: {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    title: {
      display: false
    }
  }
});


// daily target main


const daily_target = document.getElementById('daily-target');

let daily_target_chart = new Chart(daily_target, {
  'type': 'doughnut',
  'data': {
    'labels': ['Erledigt', 'Offen'],
    'datasets': [{
      label: 'Fortschritt',
      data: [daily_target_open, daily_target_done],
      backgroundColor: [
        '#1a73e8',
        '#69cac5',
      ],
      borderWidth: 0
    }]
  },
  options: {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    title: {
      display: false
    }
  }
})


function update_dt_chart(new_open, new_done) {

  daily_target_chart.data.datasets[0].data = [new_open, new_done];
  daily_target_chart.update();

  daily_target_mini_chart.data.datasets[0].data = [new_open, new_done];
  daily_target_mini_chart.update();

}



/* --- SHOP / PAYMENT / WALLET / LOGIC --- */



// wallet


function wallet(request, amount) {

  const shift_coins = parseInt(localStorage.getItem('shift_coins')) || 0;

  let new_shift_coins_value = shift_coins;
  let continue_processing = false;

  let shift_coins_value_to_sha256 = safe_sha_256(shift_coins);

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

    if (request === 'set') {
      new_shift_coins_value = amount;
    }

    localStorage.setItem('shift_coins', new_shift_coins_value);
    let new_shift_coins_value_to_sha256 = safe_sha_256(new_shift_coins_value);
    localStorage.setItem('shift_coins_comparison', new_shift_coins_value_to_sha256);

  } else {

    if (
      localStorage.getItem('shift_coins') == null ||
      localStorage.getItem('shift_coins_comparison') == null ||
      localStorage.getItem('owned_shop_items') == null ||
      localStorage.getItem('owned_shop_items_comparison') == null
    ) {
      set_shop_and_money_to_zero();
    } else {
      hacking_retribution();
    }

    return 'HACKING';

  }

}


// hacking


function hacking_retribution() {

  alert_pup({
    heading: 'HACKING! 👮',
    text: 'Deine ShiftCoins wurden zurück auf 0 gesetzt. 🪙',
    icon: 'alarm'
  });

  document.querySelector('#small-pop-up-area .alert button').setAttribute('onclick', 'window.location.reload()');
  set_shop_and_money_to_zero();

  wallet('get');

}


// owned shop items


function owned_shop_items(request, name) {

  const owned_items = JSON.parse(localStorage.getItem('owned_shop_items')) || [];

  const hash = safe_sha_256(owned_items);
  const comparison = localStorage.getItem('owned_shop_items_comparison') || null;

  if (hash === comparison || comparison === null) {

    let new_owned_items = owned_items;

    if (request === 'get') {
      return owned_items;
    }

    if (request === 'add') {
      new_owned_items.push(name);
    }

    if (request === 'set') {
      new_owned_items = [];
      name.forEach(item => {
        new_owned_items.push(item);
      })
    }

    let hash = safe_sha_256(new_owned_items);
    localStorage.setItem('owned_shop_items', JSON.stringify(new_owned_items));
    localStorage.setItem('owned_shop_items_comparison', hash);

  } else {
    hacking_retribution();
    return 'HACKING';
  }

}


owned_shop_items('get');


// purchase


function buy_item_preparation(category, name) {

  document.querySelector('#bottom-navigation').style.animation = 'fade_out .25s ease-in-out both';
  setTimeout(() => {
    document.querySelector('#bottom-navigation').style.visibility = 'hidden';
  }, 350);

  document.querySelector('.buy-item-area').style.display = 'flex';
  document.querySelector('.buy-item-area').style.animation = 'fade_in .25s ease-in-out both';

  let shop_elmnt;

  if (category == 'theme') {
    shop_items.themes.forEach(theme => {
      if (theme.name === name) {
        shop_elmnt = theme;
      }
    })
  }

  cache.shop.category = category;
  cache.shop.name = name;
  cache.shop.shift_coins_required = shop_elmnt.price;

  document.querySelector('.buy-item > h1').innerHTML = shop_elmnt.ui_name;
  document.querySelector('.buy-item > .amount > span').innerHTML = shop_elmnt.price;
  document.querySelector('.buy-item > .theme-preview').style.background = `radial-gradient(circle, ${shop_elmnt.display_data.backgroundColor} 0%, ${shop_elmnt.display_data.child_elmnt_bg} 75%)`;

}

function complete_transaction() {

  let shop_item = null;

  if (cache.shop.category === 'theme') {

    shop_items.themes.forEach(t => {
      if (t.name === cache.shop.name && t.price === cache.shop.shift_coins_required) {
        shop_item = t;
      }
    })

  }

  const amount = wallet("get");

  if (amount >= shop_item.price) {

    shop_item.owned = true;
    apply_any_theme(shop_item.name, false);

    owned_shop_items('add', shop_item.name);

    wallet('remove', parseInt(shop_item.price));
    auto_initialize_ui();

    cancel_transaction();

  } else {

    cancel_transaction();
    alert_pup(
      {
        heading: 'Fail',
        text: 'Leider hast du zu wenig ShiftCoins. 🪙',
        icon: 'paid'
      }
    );

  }

}


// cancel transaction


function cancel_transaction() {

  document.querySelector('#bottom-navigation').style.animation = 'fade_in .25s ease-in-out both';
  document.querySelector('#bottom-navigation').style.visibility = 'visible';

  setTimeout(() => {
    document.querySelector('.buy-item-area').style.display = 'none';
  }, 250);
  document.querySelector('.buy-item-area').style.animation = 'fade_out .25s ease-in-out both';

}


// code license activation


if (localStorage.getItem('already_used_codes') == null || localStorage.getItem('already_used_codes_comparison') == null) {

  if (localStorage.getItem('auto_null_codes') == null) {

    localStorage.setItem('already_used_codes', JSON.stringify([]));
    localStorage.setItem('already_used_codes_comparison', safe_sha_256('[]'));
    localStorage.setItem('auto_null_codes', true);

  } else {
    hacking_retribution();
  }

}


function already_used_codes_agent(request, value) {

  let already_used_codes = JSON.parse(localStorage.getItem('already_used_codes')) || [];
  let already_used_codes_comparison = localStorage.getItem('already_used_codes_comparison') || null;

  let continue_processing = false;

  if (safe_sha_256(JSON.stringify(already_used_codes)) === already_used_codes_comparison) {
    continue_processing = true;
  }

  if (!continue_processing) {
    return 'rejected';
  }

  if (request === 'get') {
    return already_used_codes;
  }

  if (request === 'add') {
    already_used_codes.unshift(value);
  }

  if (request === 'verify') {
    if (already_used_codes.includes(value)) {
      return false;
    } else {
      return true;
    }
  }

  localStorage.setItem('already_used_codes', JSON.stringify(already_used_codes));
  localStorage.setItem('already_used_codes_comparison', safe_sha_256(JSON.stringify(already_used_codes)));

}


function activate_license() {

  const code = safe_sha_256(document.querySelector('#code-license input').value);
  const code_already_used = already_used_codes_agent('verify', code);

  if (code_already_used == 'rejected') {
    hacking_retribution();
    return 'HACKING';
  }

  let continue_processing = false;
  let found_object_from_library = null;

  license_codes.forEach(lc => {
    if (lc.sha256 === code) {
      found_object_from_library = lc;
    }
  })

  if (found_object_from_library == null) {
    document.querySelector('#code-license article button').style.animation = 'btn_shake .25s ease-in-out 3';
    setTimeout(() => {
      document.querySelector('#code-license article button').style.animation = 'none';
    }, 750);
    return 'NOT_FOUND';
  } else {

    if (code_already_used || found_object_from_library.source == 'VIP') {

      already_used_codes_agent('add', code);

      if (found_object_from_library.reward.action_type === 'VIP_STATUS_REQUEST') {

        if (found_object_from_library.reward.content.access) {
          if (found_object_from_library.reward.content.duration === 'lifetime') {
            continue_processing = true;
            document.querySelector('#code-license .reward > div > h1').innerHTML = `VIP-Lizenz aktiviert! 💎👑🎫`;
            document.querySelector('#code-license .reward > div > span').innerHTML = `Willkommen, ${user.name.first_name}`;
            localStorage.setItem('vip_status', `true_VIP_${ms_watermark_hash}`);
          } else if (found_object_from_library.reward.content.duration === 1) {
            close_flexible_area();
            slide('vip-dashboard');
          }
        } else {
          continue_processing = true;
          document.querySelector('#code-license .reward > div > h1').innerHTML = `VIP-Lizenz entzogen! ⛔`;
          document.querySelector('#code-license .reward > div > span').innerHTML = `Du bist nun kein VIP mehr.`;
          localStorage.removeItem('vip_status');
        }

      } else if (found_object_from_library.reward.action_type === 'SHIFT_COIN_CHANGE') {
        document.querySelector('#code-license .reward > div > h1').innerHTML = `${found_object_from_library.reward.content.amount} 🪙`;
        document.querySelector('#code-license .reward > div > span').innerHTML = 'Vielen Dank für den Support! 🎉';
        if (found_object_from_library.reward.content.type === 'add') {
          wallet('add', parseInt(found_object_from_library.reward.content.amount));
        } else if (found_object_from_library.reward.content.type === 'set') {
          wallet('set', parseInt(found_object_from_library.reward.content.amount));
        }
        continue_processing = true;
      }

    } else {

      alert_pup({
        heading: 'Abgelehnt',
        text: 'Du kannst den Code nur einmal verwenden. 🔒',
        icon: 'key'
      });

    }

    if (continue_processing) {

      document.querySelector('#code-license .reward').style.display = 'flex';
      document.querySelector('#code-license .reward').style.animation = 'fade_in .25s both';

      setTimeout(() => {

        setTimeout(() => {
          document.querySelector('#code-license .reward img').style.display = 'none';
        }, 500);
        document.querySelector('#code-license .reward img').style.animation = 'fade_out .5s both';

        document.querySelector('#code-license .reward > div').style.display = 'flex';
        document.querySelector('#code-license .reward > div').style.animation = 'fade_in .25s ease-in-out both';

      }, 3800);

    }

  }

}


function exit_reward() {

  save_local_storage();
  auto_initialize_ui();
  close_flexible_area();

  document.querySelector('#overlay').innerHTML = 'Fast fertig ☕';
  document.querySelector('#overlay').style.display = 'flex';
  document.querySelector('#overlay').style.animation = 'fade_in .75s ease-in-out both';

  setTimeout(() => {
    window.location.reload();
  }, 3000);

}



/* --- THEME SERVICE --- */



let active_theme;


if (localStorage.getItem('theme') == null) {
  localStorage.setItem('theme', 'auto');
}


if (localStorage.getItem('theme') != 'auto') {
  apply_any_theme(localStorage.getItem('theme'), false, 'auto');
} else {
  auto_apply_theme();
}


// auto apply sys theme


function check_system_theme() {

  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (isDarkMode) {
    return "dark";
  } else {
    return "light";
  }

}


function auto_apply_theme() {

  if (cache.auto_theme_change == true || active_theme == null) {

    let sys_mode = check_system_theme();
    let mode_change;

    if (sys_mode == 'light') {
      mode_change = 'day';
    } else {
      mode_change = 'night';
    }

    let new_theme = `primary-${mode_change}`;

    if (active_theme === new_theme) {
      return false;
    } else {
      apply_any_theme(new_theme, null, 'auto');
    }

  } else {
    return false;
  }

}

setInterval('auto_apply_theme()', 1500);


function start_auto_theme() {

  cache.auto_theme_change = true;
  localStorage.setItem('theme', 'auto');
  auto_apply_theme();
  shop();

}


/* apply any theme */


function apply_any_theme(requested_theme, auto_change, auto_activated) {

  let requested_object;

  const result = owned_shop_items('get');

  const owned_themes = result;

  shop_items.themes.forEach(theme => {
    if (theme.name === requested_theme) {
      requested_object = theme;
    }
  });

  let continue_processing = false;

  if (requested_object.owned == true || owned_themes.includes(requested_object.name)) {
    continue_processing = true;
  } else {
    return 'rejected';
  }

  if (continue_processing) {

    if (active_theme !== requested_object.name) {
      if (auto_activated != 'auto') {
        theme_transition(requested_object);
      }
      setTimeout(() => {

        document.getElementById('theme-import').innerHTML = `<link rel="stylesheet" type="text/css" href="${requested_object.path}">`;

        document.querySelector('#additional-theme-item').innerHTML = '';
        if (requested_object.additional_theme_item != null) {
          requested_object.additional_theme_item.forEach(i => {
            document.querySelector('#additional-theme-item').style.opacity = 1;
            if (i.type === 'img/gif') {
              document.querySelector('#additional-theme-item').innerHTML += `<img src="${i.path}" alt="Theme Animation">`;
            }
          })
        }

      }, 75);
    }
    active_theme = requested_object.name;
    if (auto_change == false) {
      cache.auto_theme_change = false;
      localStorage.setItem('theme', active_theme);
    } else if (auto_change == true) {
      cache.auto_theme_change = true;
      localStorage.setItem('theme', 'auto');
    }


  }

  if (!auto_activated || auto_activated == null) {

    auto_initialize_ui();

  }

}


function theme_transition(theme) {


  document.querySelector('.theme-transition').style.display = 'flex';
  document.querySelector('.theme-transition').style.animation = 'fade_in .5s ease-in-out both';
  document.querySelector('#bottom-navigation').style.animation = 'slide_out .25s ease-in-out both';

  document.querySelector('.theme-transition > div > h1').innerHTML = theme.ui_name;
  document.querySelector('.theme-transition').style.background = `linear-gradient(0deg, ${theme.display_data.backgroundColor} 0%, ${theme.display_data.child_elmnt_bg} 52%)`;
  document.querySelector('.theme-transition > div > span').innerHTML = theme.emoji;

  setTimeout(() => {
    setTimeout(() => {
      document.querySelector('.theme-transition').style.display = 'none';
    }, 500);
    document.querySelector('.theme-transition').style.animation = 'fade_out .5s ease-in-out both';
    document.querySelector('#bottom-navigation').style.animation = 'slide_in .25s ease-in-out .5s both';
  }, 1500);

}



/* --- DATA SHARING CENTER --- */



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

  let config_data = {
    type: 'vocab-list',
    crypto_data: encrypt(JSON.stringify(vocab_list), 'MS_VL_91224')
  };

  let export_data = JSON.stringify(config_data);
  let file_name = `${vocab_list.name}.mshift`;

  const blob = new Blob([export_data], { type: 'application/octet-stream' });
  saveAs(blob, file_name);

}


// import vocab list


function import_vocab_list() {

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.vocab, .mshift';

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type !== 'application/octet-stream' && !file.name.endsWith('.vocab') && !file.name.endsWith('.mshift')) {
        alert_pup(
          {
            heading: 'Upload-Fehler',
            text: 'Bitte wähle eine gültige MSHIFT-Datei aus. 📁'
          }
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const vocab_list = JSON.parse(content);
        if (file.name.endsWith('.vocab')) {
          add_imported_list(vocab_list, '.vocab');
        }
        if (file.name.endsWith('.mshift')) {
          add_imported_list(vocab_list, '.mshift');
        }
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


function add_imported_list(file_data, import_method) {

  let vocab_list = file_data;
  let accepted_builds = ['1.0', '2.0', '2.1', '2.2', '2.4', '2.5', '3.0', '4.0', '4e'];

  if (import_method === '.mshift') {
    try {
      vocab_list = JSON.parse(decrypt(file_data.crypto_data, 'MS_VL_91224'));
    } catch {
      alert_pup(
        {
          heading: 'Ungültig',
          text: 'Die Datei wurde manuell beschädigt. 📁'
        }
      );
    }
  }

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

    if (vocab_list.exam == true && vocab_list.added_exam != null) {

      let all_exam_names = [];
      exams.forEach(e => { all_exam_names.push(e.refered_list) })

      vocab_list.added_exam.refered_list = vocab_list.name;

      if (!all_exam_names.includes(vocab_list.added_exam.refered_list)) {
        exams.push(vocab_list.added_exam);
      }

    }

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


// export account


function export_account() {

  close_info();

  let data = {
    user: user,
    settings: settings,
    all_vocab_lists: all_vocab_lists,
    exams: exams,
    time_notation: time_notation,
    version: version,
    app_open_counter: app_open_counter,
    shift_coins: wallet('get'),
    additional_shop_items: owned_shop_items('get'),
    recent_list_opens: recent_list_opens,
    already_used_codes: already_used_codes_agent('get')
  };

  data = `'${JSON.stringify(data)}'`;

  let crypto_data = encrypt(data, `MS_ACC_61224`);
  let verification_hash = safe_sha_256(crypto_data + 'MS');

  let file_content = {
    type: 'account',
    crypto_data: crypto_data,
    verification_hash: verification_hash
  }

  let export_data = JSON.stringify(file_content);
  let file_name = `Dein Account.mshift`;

  const blob = new Blob([export_data], { type: 'application/octet-stream' });
  saveAs(blob, file_name);

}


// import account


function import_account() {

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.mshift';

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type !== 'application/octet-stream' && !file.name.endsWith('.mshift')) {
        console.error('Bitte wähle eine gültige .mshift-Datei aus.');
        alert_pup(
          {
            heading: 'Upload-Fehler',
            text: 'Die Datei muss auf .MSHIFT enden. 📁'
          }
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        insert_uploaded_account(content);
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


function insert_uploaded_account(file_content) {

  const content = JSON.parse(file_content);

  if (content.type != 'account') {

    alert_pup(
      {
        heading: 'Ungültig',
        text: 'Die Datei wurde manuell bearbeitet und kann nicht verwertet werden. 📂'
      }
    );

  } else {

    let original_data = null;

    try {
      original_data = decrypt(content.crypto_data, 'MS_ACC_61224');
    } catch {
      hacking_retribution();
    }

    original_data = JSON.parse(original_data.slice(1, -1));

    let required_hash = content.verification_hash;
    let created_hash = safe_sha_256(content.crypto_data + 'MS');

    let continue_processing = false;

    if (required_hash === created_hash) {
      continue_processing = true;
    } else {
      hacking_retribution();
    }

    if (continue_processing) {

      let accepted_builds = ['4.0', '4e'];

      if (accepted_builds.includes(original_data.version.build)) {

        user = original_data.user;
        settings = original_data.settings;
        time_notation = original_data.time_notation;
        all_vocab_lists = original_data.all_vocab_lists;
        exams = original_data.exams;
        recent_list_opens = original_data.recent_list_opens;
        localStorage.setItem('app_open_counter', parseInt(original_data.app_open_counter));
        localStorage.setItem('already_used_codes', JSON.stringify(original_data.already_used_codes));
        localStorage.setItem('already_used_codes_comparison', safe_sha_256(JSON.stringify(original_data.already_used_codes)));

        wallet('set', original_data.shift_coins);
        owned_shop_items('set', original_data.additional_shop_items);

        save_local_storage();

        document.querySelector('#overlay').innerHTML = 'Import ✅';
        document.querySelector('#overlay').style.display = 'flex';
        document.querySelector('#overlay').style.animation = 'fade_in 2s ease-in-out both';

        setTimeout(() => {
          window.location.reload();
        }, 3750);

      } else {

        alert_pup(
          {
            heading: 'App-Version Err',
            text: 'Exportierte Accounts aus dieser App-Version werden nicht unterstützt. ⛔'
          }
        );

      }

    }

  }

}



/* --- GENERAL FUNCTIONS --- */



// save ls


function save_local_storage() {

  localStorage.setItem('all_vocab_lists', JSON.stringify(all_vocab_lists));
  localStorage.setItem('time_notation', JSON.stringify(time_notation))
  localStorage.setItem('exams', JSON.stringify(exams));
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('settings', JSON.stringify(settings));
  localStorage.setItem('recent_list_opens', JSON.stringify(recent_list_opens));

}


// save json


function save_JSON(jsonData) {

  const jsonString = JSON.stringify(jsonData);
  const blob = new Blob([jsonString], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.json";
  link.click();

}


// crypto


function safe_sha_256(input) {

  input = input.toString();
  return sha256(input);

}


function encrypt(input, key) {

  const utf8Input = unescape(encodeURIComponent(input + key));
  return btoa(utf8Input);


}


function decrypt(encrypted, key) {

  const decoded = decodeURIComponent(escape(atob(encrypted)));
  if (decoded.endsWith(key)) {
    return decoded.slice(0, -key.length);
  }
  throw "Invalid key";

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


function get_time_today() {

  let time_today = 0;
  let count = 0;

  while (time_notation[count] != null) {

    if (time_notation[count].time.date != get_system_date()) {
      break;
    } else {
      time_today += time_notation[count].duration;
      count++;
    }

  }

  time_today /= 60;
  time_today = Math.round(time_today);

  return time_today;

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


// add to recent


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


// set progress bars to 0


function set_progress_bars_to_0() {

  document.querySelectorAll('.progress-bar > div').forEach(pb => {
    pb.style.width = 0;
  })

}



/* --- SETTINGS --- */



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



/* --- SETUP --- */



function check_setup_required() {

  if (user.name.first_name == null || user.name.last_name == null) {
    let img_selector = './src/img/introduction-';
    if (check_system_theme() == 'light') {
      img_selector += 'day';
    } else {
      img_selector += 'night';
    }
    img_selector += '.svg';

    document.querySelector(`#setup .introduction > img`).setAttribute('src', img_selector);

    localStorage.clear();
    localStorage.setItem('theme', 'auto');

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

    setTimeout(() => {
      document.querySelector('#setup > button:last-of-type').style.display = 'block';
    }, 175);

    let img_selector = './src/img/introduction-';
    if (check_system_theme() == 'light') {
      img_selector += 'day';
    } else {
      img_selector += 'night';
    }
    img_selector += '.svg';

    document.querySelector(`#setup .introduction > img`).setAttribute('src', img_selector);

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

  if (step == 'functions') {

    in_fade = 'start-profile';
    out_fade = 'functions';
    document.querySelector('#setup').style.background = ' var(--clr-setup-accent-1)';
    document.querySelector('#setup .start-profile').style.background = ' var(--clr-setup-accent-1)';
    document.querySelector('#setup > button:last-of-type').style.background = '#273259';
    cache.setup.progress += 25;

  }

  if (step == 'start-profile') {

    in_fade = 'set-profile';
    out_fade = 'start-profile';
    document.querySelector('#setup').style.background = ' var(--clr-background)';
    document.querySelector('#setup > button:last-of-type').style.background = 'var(--clr-primary)';
    cache.setup.progress += 25;

  }

  if (step == 'set-profile') {

    let first_name = document.querySelector(`#setup .set-profile > article > div:first-of-type > input`).value;
    let last_name = document.querySelector(`#setup .set-profile > article > div:last-of-type > input`).value;

    if (remove_spaces(first_name) != '' && remove_spaces(last_name) != '') {

      document.querySelector('#setup').style.background = ' var(--clr-primary)';

      cache.setup.progress += 25;

      setTimeout(() => {
        document.querySelector('#setup > button:last-of-type').remove();
      }, 175);

      in_fade = 'finishing';
      out_fade = 'set-profile';

      user.name.first_name = first_name;
      user.name.last_name = last_name;
      save_local_storage();

      wallet('add', 25);

      document.querySelector(`#setup .finishing h1`).style.animation = 'fade_in 1.5s ease-in-out both';
      setTimeout(() => {
        window.location.reload();
      }, 3500);

      document.querySelector(`#setup .progress-bar`).style.animation = 'fade_out .25s ease-in-out both';
      setTimeout(() => {
        document.querySelector(`#setup .progress-bar`).style.display = 'none';
      }, 250);

      wallet('get');

      auto_initialize_ui();

    } else {

      in_fade = null;

      alert_pup(
        {
          heading: 'Korrrekt?',
          text: 'Bitte fülle beide Felder aus.'
        }
      );

    }

  }

  if (in_fade != null) {

    setTimeout(() => {
      document.querySelector(`#setup .progress-bar > div`).style.width = `${cache.setup.progress}%`;
    }, 350);

    document.querySelector(`#setup > button:last-of-type`).setAttribute('onclick', `app_setup_steps('${in_fade}')`);

    app_setup_slide_in(in_fade);

    if (out_fade != null) {
      app_setup_slide_out(out_fade);
    }

  }

}



/* --- VIP ACCESS & COMMAND-LINE --- */



function check_vip_status() {

  let vip_status = false;

  if (localStorage.getItem('vip_status') != null && localStorage.getItem('vip_status') === `true_VIP_${ms_watermark_hash}`) {
    vip_status = true;
  }

  return vip_status;

}


function go_to_settings() {

  if (cache.secret_console_activation_count == 4) {
    cache.secret_console_activation_count = 0;
    hidden_console_launch();
  } else {
    slide('settings');
    cache.secret_console_activation_count++;
    setTimeout(() => {
      cache.secret_console_activation_count = 0;
    }, 4000);

  }

}


function hidden_console_launch() {

  let enter_code = prompt(`VIP-Autorisierungscode eingeben 👑`);

  if (enter_code != null) {

    enter_code = enter_code.toUpperCase();

    if (safe_sha_256(enter_code) === 'e01036b9697a292572be7582a1391de4be9225701f98b5abd3c3bcc91c0b741e') {
      localStorage.setItem('vip_status', `true_VIP_${ms_watermark_hash}`);
      alert('Du bist jetzt VIP! 👑🆙🚀');
      window.location.reload();
    } else if (safe_sha_256(enter_code) === 'e61724301840bf8ec384b4a74f649e81f322a581584170d4e140d98a3742f15c') {
      slide('vip-dashboard');
      alert('1-Time-Access ✅');
    } else {
      alert(`Zugriff abgelehnt 🔴`);
    }

  }

}


// vip


function vip(request) {

  if (request === 'set-shift-coins') {

    const new_value = parseInt(prompt('Neuer Wert 🪙'));

    if (!isNaN(new_value)) {
      wallet('set', new_value);
      alert('Done! ✅');
    } else {
      alert('Fehlgeschlagen! 🔴');
    }

  }

  if (request === 'get-every-theme') {

    const continue_processing = confirm('Möchtest du sofort alle Themes erhalten? 🎨');

    if (continue_processing) {
      vip('get-every-theme-instant');
    } else {
      alert('Abgebrochen! 😅');
    }

  }

  if (request === 'get-every-theme-instant') {

    let theme_string = [];
    let theme_hash = null;

    shop_items.themes.forEach(t => {
      if (!t.owned) {
        theme_string.unshift(t.name);
      }
    })

    theme_hash = safe_sha_256(theme_string.toString());

    localStorage.setItem('owned_shop_items', JSON.stringify(theme_string));
    localStorage.setItem('owned_shop_items_comparison', theme_hash);

    alert('Done! ✅');

  }

  if (request === 'get-specific-theme') {

    let user_input = prompt('Theme-Name 🔤');
    let found_theme = null;

    shop_items.themes.forEach(t => {
      if (t.name == user_input || t.ui_name == user_input) {
        found_theme = t.name;
      }
    })

    if (found_theme == null) {

      alert('Existiert nicht! 🔴');
    } else {
      let already_existing_themes = owned_shop_items('get');
      if (!already_existing_themes.includes(found_theme)) {
        owned_shop_items('add', found_theme);
      }
      alert('Done! ✅');
      setTimeout(() => {
        apply_any_theme(found_theme, false, false);
      }, 500);

    }

  }

  if (request == 'app-reset') {

    const continue_processing = confirm('VORSICHT! Möchtest du die App zurücksetzen? 🔙');

    if (!continue_processing) {
      alert('Vorgang abgebrochen. 😅');
    } else {
      localStorage.clear();
      alert('Reset done! ✅');
      window.location.reload();
    }

  }

}


// command


function command() {

  let user_request = prompt('DEV-Terminal: Was möchten Sie tun? 🧑‍💻');

  if (user_request != null) {
    user_request = remove_spaces(user_request).toLowerCase();
  }


  if (user_request === 'app-reset') {
    vip('app-reset');
  }

  if (user_request === 'shift-coins') {
    vip('set-shift-coins');
  }

  if (user_request === 'get-every-theme') {
    vip('get-every-theme');
  }

  if (user_request === 'get-specific-theme') {
    vip('get-specific-theme');
  }

  if (user_request === 'cancel-vip') {
    localStorage.setItem('vip_status', false);
    alert('Du bist nun kein VIP mehr! 🛑');
    window.location.reload();
  }

  if (user_request === 'get') {

    const what = prompt('💬 Gib den Variablennamen ein:');

    if (what === 'time_notation') {
      alert(`👉 ${time_notation}`);
    } else if (what === 'all_vocab_lists') {
      alert(`👉 ${JSON.stringify(all_vocab_lists, null, 2)}`);
    } else if (what === 'user') {
      alert(`👉 ${JSON.stringify(user, null, 2)}`);
    } else if (what === 'settings') {
      alert(`👉 ${JSON.stringify(settings, null, 2)}`);
    } else if (what === 'exams') {
      alert(`👉 ${JSON.stringify(exams, null, 2)}`);
    } else if (what === 'owned_shop_items') {
      alert(`👉 ${owned_shop_items('get')}`);
    } else if (what === 'app_open_counter') {
      alert(`👉 ${app_open_counter}`);
    } else if (what === 'version') {
      alert(`👉 ${JSON.stringify(version)}`);
    }


    else {
      alert('❌ Unbekannte Variable!');
    }

  }


}



/* --- APP OPEN TRIGGER --- */



// donate


function lead_to_donate() {

  close_info();

  slide('settings');

  setTimeout(() => {

    const container = document.getElementById('settings');
    const target = document.querySelector('.support');

    container.scrollTo({
      top: target.offsetTop,
      behavior: 'smooth'
    });

    overlay_animation('./src/vid/heart.gif');

  }, 500);

}


let possible_opens_donation = [25, 125, 225, 325, 425];

if (possible_opens_donation.includes(app_open_counter)) {

  setTimeout(() => {
    throw_info(support_project_info);
  }, 4000);

}


// discord


let possible_opens_discord = [75, 175, 275, 375, 475];

if (possible_opens_discord.includes(app_open_counter)) {

  setTimeout(() => {
    throw_info(join_discord);
  }, 4000);

}



app_opening('slow', 'home');



/* ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨ */
/*
/*
/*    🔥💻 Powered by WebByte Studio 💻🔥
/*                                        
/*    💬 Join the Discord: https://discord.gg/53SverZQtV
/*    📹 Follow on Instagram: instagram.com/webbytestudio
/*    📞 Connect on WhatsApp: https://whatsapp.com/channel/0029Vasl8IAAInPl5pZifL1E
/*
/*
/* ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨ */


