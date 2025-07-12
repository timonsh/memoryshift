


/* --- LIBRARY --- */



function library() {

    document.querySelector('#library > section').innerHTML = null;

    all_vocab_lists.forEach(vl => {

        let avatar = user.avatar;
        if (vl.source == 'imported') {
            avatar = vl.creator.avatar;
        }

        document.querySelector('#library > section').innerHTML += `
        <div class="${vl.language}" onclick="open_list_detail('${vl.name}')">
          <img src="./src/img/languages/${vl.language}.svg" alt="${vl.language}">
          <h1>${vl.name}</h1>
          <img src="${avatar}" alt="${vl.creator.first_name} ${vl.creator.last_name}">
         </div>
  
      `;

    })

    if (all_vocab_lists.length == 0) {
        document.querySelector('#library > span').style.display = 'block';
    } else {
        document.querySelector('#library > span').style.display = 'none';
    }

    auto_colorize('#library > section > div');

}



/* --- EXAM VIEW --- */



function exam_view() {

    document.querySelectorAll(`#exam-view > div`).forEach(exam => {
        exam.remove();
    })

    exams.forEach(exam => {

        if (is_date_past(get_system_date(), exam.date) == false) {

            let date_string = exam.date;
            date_string = date_string.split("-")[0];
            if (date_string[0] === '0') {
                date_string = date_string.slice(1);
            }

            let date_information = null;

            if (date_difference(get_system_date(), exam.date) == 1) {
                date_information = '<b>Morgen</b>';
            } else if (date_difference(get_system_date(), exam.date) == 0) {
                date_information = '<b>Heute</b>';
            } else {
                date_information = `<span><b>${date_string}. ${get_month_name(exam.date)}</b> / ${date_difference(get_system_date(), exam.date)} Tage</span>`;
            }

            document.querySelector(`#exam-view`).innerHTML += `
         <div class="pointer" onclick="open_list_detail('${exam.refered_list}')">
           <img src="./src/img/languages/${exam.language}.svg" alt="${exam.language}">
           <span>${date_information}</span>
         </div>
      `;

        }

    })

    if (document.querySelector('#exam-view > div:first-of-type') == null) {
        document.querySelector(`#exam-view > h2`).style.display = 'block';
    } else {
        document.querySelector(`#exam-view > h2`).style.display = 'none';
    }

    auto_set_icons();

}



/* --- SLIDE HEADER INITIALIZE --- */



function slide_header_initialize() {

    if (user.avatar != null) {
        document.querySelectorAll('main > section > header.slide-intro img').forEach(elmnt => {
            elmnt.setAttribute('src', user.avatar);
        })
        document.querySelectorAll('.slide-intro button').forEach(e => {
            e.setAttribute('onclick', "slide('settings')");
        });
    } else {
        document.querySelectorAll('main > section > header.slide-intro img').forEach(elmnt => {
            elmnt.remove();
        })
        document.querySelectorAll('main > section > header.slide-intro button').forEach(btn => {
            btn.setAttribute('class', 'set-icon filled');
            btn.setAttribute('onclick', 'slide("settings")')
        })
        document.querySelectorAll('main > section > header.slide-intro button').forEach(btn => {
            btn.innerHTML = 'account_circle';
        })
    }

}



/* --- RECENT LIST --- */



function recent_list() {

    document.querySelector(`#recent > section`).innerHTML = null;

    while (recent_list_opens.length > 3) {
        recent_list_opens.pop();
    }

    recent_list_opens.forEach(rl => {

        let existing = false;
        let list_cache = null;
        all_vocab_lists.forEach((vl => {
            if (vl.name == rl) {
                existing = true;
                list_cache = vl;
            }
        }))

        if (existing) {

            let avatar = user.avatar;
            if (list_cache.source == 'imported') {
                avatar = list_cache.creator.avatar;
            }

            document.querySelector('#recent > section').innerHTML += `
         <div class="${list_cache.language}" onclick="open_list_detail('${list_cache.name}')">
            <img src="./src/img/languages/${list_cache.language}.svg" alt="${list_cache.language}">
  
               <article>
                  <h1>${list_cache.name}</h1>
                  <span>${list_cache.language}</span>
                  <img src="${avatar}" alt="${list_cache.creator.first_name} ${list_cache.creator.last_name}">
               </article>
  
         </div>
        `;

        }

    });

    auto_colorize('#recent > section > div');

    // if no lists

    if (recent_list_opens.length == 0) {

        document.querySelector(`#recent > section`).innerHTML += `
        <div class="no-lists-ui-elmnt" onclick="pop_up('add-list', true)">
        <header>
        <button type="button" class="set-icon">add</button>
            <h1>Liste erstellen</h1>
            <span>Noch sind keine Listen vorhanden. 🗃</span>
        </header>
         </div>
        `;

    }

    auto_scale_recent();

}



/* --- STANDARD HEADER --- */



function standard_header() {

    let sizes = [];

    document.querySelectorAll(`.standard-header > h1`).forEach((headline) => {
        sizes.push(headline.scrollWidth);
    })

    let count = 0;

    document.querySelectorAll(`.standard-header > div`).forEach((label) => {
        label.style.left = sizes[count] + 10 + 'px';
        count++;
    })

}



/* --- ADD LIST LANGUAGE INITIALIZE --- */



function add_list_language_initialize() {

    document.querySelector('#add-list > article.choose-language').innerHTML = null;
    let count = 1;
    available_languages.forEach(lang => {
        document.querySelector('#add-list > article.choose-language').innerHTML += `
             <div class="clickable_box" onclick="clickable_box('#add-list > article.choose-language', ${count}, true)">
                 <img src="./src/img/languages/${lang}.svg" alt="${lang}">
                 <span>${lang}</span>
             </div>
        `;
        count++;
    })

}



/* --- HOME OVERVIEW --- */

function home_overview() {

    let display_format = 'Minute';
    if (daily_target_data().done > 1) {
        display_format += 'n'
    }
    if (daily_target_data().done == 0) {
        display_format = 'Minuten'
    }
    let display_format_2 = 'Tag';
    if (get_streak() > 1) {
        display_format_2 += 'e';
    }
    document.querySelector('#overview > .widgets > button:first-of-type > div > span').innerHTML = `${daily_target_data().done} ${display_format}`;
    document.querySelector('#overview > .widgets > button:last-of-type > div > span').innerHTML = `${get_streak()} ${display_format_2}`;

}



/* --- STATISTIC --- */



function statistic() {

    // streak
    document.querySelector('#statistic .streak > h1').innerHTML = get_streak();

    // time
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

    document.querySelector(`#statistic .time div:nth-of-type(1) > h2`).innerHTML = time_today;

    let time_7_days = 0;
    let past_comparison_sys_date = new Date(new Date().setDate(new Date().getDate() - 7));
    let past_comparison_date = convert_new_date_type(past_comparison_sys_date);
    count = 0;

    while (time_notation[count] != null) {

        if (is_date_past(past_comparison_date, time_notation[count].time.date)) {
            break;
        } else {
            time_7_days += time_notation[count].duration;
            count++;
        }

    }

    time_7_days /= 60;
    time_7_days = Math.round(time_7_days);

    document.querySelector(`#statistic .time div:nth-of-type(2) > h2`).innerHTML = time_7_days;

    let time_30_days = 0;
    past_comparison_sys_date = new Date(new Date().setDate(new Date().getDate() - 30));
    past_comparison_date = convert_new_date_type(past_comparison_sys_date);
    count = 0;

    while (time_notation[count] != null) {

        if (is_date_past(past_comparison_date, time_notation[count].time.date)) {
            break;
        } else {
            time_30_days += time_notation[count].duration;
            count++;
        }

    }

    time_30_days /= 60;
    time_30_days = Math.round(time_30_days);

    document.querySelector(`#statistic .time div:nth-of-type(3) > h2`).innerHTML = time_30_days;

    dt_open = daily_target_data().open;
    dt_done = daily_target_data().done;
    update_dt_chart(dt_open, dt_done);
    document.querySelector(`#statistic .daily-target h1`).innerHTML = `${dt_done}<span>m</span>`;


}



/* --- SETTINGS --- */



function settings_ini() {

    // profile box
    document.querySelector(`#settings .profile-box img`).setAttribute('src', user.avatar);
    document.querySelector(`#settings .profile-box h1`).innerHTML = user.name.first_name;

    if (user.email != null && user.email != '') {
        document.querySelector(`#settings span:first-of-type`).innerHTML = `📬 ${user.email}`;
    }

    if (user.school != null) {
        document.querySelector(`#settings span:last-of-type`).innerHTML = `🏫 ${user.school}`;
    }

    // articles
    document.querySelector(`#settings .profile > div:first-of-type input`).value = user.name.first_name;
    document.querySelector(`#settings .profile > div:nth-of-type(2) input`).value = user.name.last_name;
    document.querySelector(`#settings .profile > div:last-of-type input`).value = user.email;

    let content = null;

    if (settings.learn.attention_low_upper_case) {
        content = 'Ja';
    } else {
        content = 'Nein <i>(empfohlen)</i>';
    }
    document.querySelector(`#settings .learn > div:first-of-type button`).innerHTML = content;


    if (settings.learn.attention_spaces) {
        content = 'Ja';
    } else {
        content = 'Nein <i>(empfohlen)</i>';
    }
    document.querySelector(`#settings .learn > div:nth-of-type(2) button`).innerHTML = content;

    document.querySelector(`#settings .learn > div:nth-of-type(3) button`).innerHTML = `${settings.learn.vocab_counter} Vokabeln`;

}



/* --- SETUP --- */



function setup_ini() {

    if (user.avatar != './src/img/account.png') {
        document.querySelector(`#setup .set-profile button img`).setAttribute('src', user.avatar);
        document.querySelector(`#setup .set-profile button img`).style.display = 'block';
        document.querySelector(`#setup .set-profile button img`).style.animation = 'fade_in .5s ease-in-out both';
    }

}



/* --- FINAL FUNCTION --- */



function auto_initialize_ui() {

    home_overview();
    library();
    statistic();
    exam_view();
    settings_ini();
    slide_header_initialize();
    recent_list();
    standard_header();
    auto_scale_recent();
    setup_ini();

    auto_set_icons();
}