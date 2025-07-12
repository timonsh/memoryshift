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
* 📬 Kontakt: service@webbyte.studio



*/



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
        document.querySelectorAll('main > section > header.slide-intro > button:last-of-type img').forEach(elmnt => {
            elmnt.setAttribute('src', user.avatar);
        })
        document.querySelectorAll('.slide-intro button:last-of-type').forEach(e => {
            e.setAttribute('onclick', "go_to_settings()");
        });
    } else {
        document.querySelectorAll('main > section > header.slide-intro img').forEach(elmnt => {
            elmnt.remove();
        })
        document.querySelectorAll('main > section > header.slide-intro button:last-of-type').forEach(btn => {
            btn.setAttribute('class', 'set-icon filled');
            btn.setAttribute('onclick', 'slide("settings")')
        })
        document.querySelectorAll('main > section > header.slide-intro button:last-of-type').forEach(btn => {
            btn.innerHTML = 'account_circle';
        })
    }

    if (check_vip_status()) {
        document.querySelectorAll('main > section > header.slide-intro button:first-of-type').forEach(e => {
            e.style.visibility = 'visible';
        })
    } else {
        document.querySelectorAll('main > section > header.slide-intro button:first-of-type').forEach(e => {
            e.style.visibility = 'hidden';
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

    if (recent_list_opens.length == 0 || all_vocab_lists.length == 0) {

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
    if (get_streak() > 1 || get_streak() == 0) {
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

    let all_time = 0;
    time_notation.forEach(item => {
        all_time += item.duration;
    });

    all_time = Math.round(all_time / 60);
    let all_time_indicator = 'minute';
    if (all_time == 0 || all_time > 1) {
        all_time_indicator += 'n';
    }

    document.querySelector('#statistic .all-time h1').innerHTML = `${all_time} ${all_time_indicator}`;

    // daily target done

    if (daily_target_data().open == 0) {
        document.querySelector('#statistic .daily-target > div > div').style.display = 'block';
        document.querySelector('#statistic .daily-target > div > div').style.animation = 'slide_in 1s ease-in-out .25s both';
        document.querySelector('#statistic .daily-target canvas').style.display = 'none';
    } else {
        document.querySelector('#statistic .daily-target > div > div').style.display = 'none';
        document.querySelector('#statistic .daily-target > div > div').style.animation = 'none';
        document.querySelector('#statistic .daily-target canvas').style.display = 'block';
    }


}



/* --- SETTINGS --- */



function settings_ini() {

    // profile box
    document.querySelector(`#settings .profile-box img`).setAttribute('src', user.avatar);
    document.querySelector(`#settings .profile-box h1`).innerHTML = user.name.first_name;

    if (user.email != null && user.email != '') {
        document.querySelector(`#settings .profile-box span:first-of-type`).innerHTML = `📬 ${user.email}`;
    }

    if (user.school != null) {
        document.querySelector(`#settings .profile-box span:nth-of-type(2)`).innerHTML = `🏫 ${user.school}`;
    }

    document.querySelector(`#settings .profile-box span:nth-of-type(3)`).innerHTML = `🔥 Beste Streak: ${user.highest_streak}`;

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

    // daily target
    document.querySelector('#settings .daily-target > div:first-of-type > button').innerHTML = `${settings.daily_target} Minuten`;
}



/* --- SETUP --- */



function setup_ini() {

    if (user.avatar != './src/img/account.png') {
        document.querySelector(`#setup .set-profile button img`).setAttribute('src', user.avatar);
        document.querySelector(`#setup .set-profile button img`).style.display = 'block';
        document.querySelector(`#setup .set-profile button img`).style.animation = 'fade_in .5s ease-in-out both';
    }

}



/* --- SHOP --- */



function shop() {

    // shift_coins

    let shift_coins;

    const result = wallet('get');

    shift_coins = result;
    document.querySelector('#shop .payment-method-list .shift-coins span').innerHTML = shift_coins;

    // item

    shop_item_ini();

}



/* --- SHOP ITEM INI --- */

function shop_item_ini() {

    const additional_items = owned_shop_items('get');

    // reset

    document.querySelector('#shop .limited article').innerHTML = '';
    document.querySelector('#shop .available article').innerHTML = '';

    let border = 'none';

    if (localStorage.getItem('theme') == 'auto') {
        border = '5px solid var(--clr-agree)';
    }

    // auto theme & owned reset

    document.querySelector('#shop .owned article').innerHTML = `
        <div style="background-color: var(--clr-deviation); outline: ${border}" onclick="start_auto_theme()">
            <div style="background-color: var(--clr-primary-light)">
                <span>Auto</span>
            </div>
        </div>
    `;

    shop_items.themes.forEach(t => {


        border = 'none';
        if (active_theme === t.name && localStorage.getItem('theme') != 'auto') {
            border = '5px solid var(--clr-agree)';
        }

        if (t.owned || additional_items.includes(t.name)) {

            document.querySelector('#shop .owned article').innerHTML += `
            <div style="background-color: ${t.display_data.backgroundColor}; border: ${border};" onclick="apply_any_theme('${t.name}', false)">
                 <div style="background-color: ${t.display_data.child_elmnt_bg};">
                     <span>${t.ui_name}</span>
                 </div>
             </div>
            `;

        } else {

            if (t.active != false) {

                if (t.limited != true) {

                    document.querySelector('#shop .available article').innerHTML += `
                    <div style="background-color: ${t.display_data.backgroundColor}; border: ${border};" onclick="buy_item_preparation('theme', '${t.name}')">
                         <button type="button" onclick="buy_theme_preparation">
                          <div class="set-icon">paid</div>
                          <span>${t.price}</span>
                        </button>
                    <div style="background-color: ${t.display_data.child_elmnt_bg};">
                        <span>${t.ui_name}</span>
                    </div>
                    </div>

                     `;

                }

            }

        }

        if (t.limited && t.active) {

            if (!additional_items.includes(t.name)) {

                document.querySelector('#shop .limited article').innerHTML += `
            <div style="background-color: ${t.display_data.backgroundColor}; border: ${border};" onclick="buy_item_preparation('theme', '${t.name}')">
                 <button type="button" onclick="buy_theme_preparation">
                    <div class="set-icon">paid</div>
                    <span>${t.price}</span>
                </button>
                <div style="background-color: ${t.display_data.child_elmnt_bg};">
                    <span>${t.ui_name}</span>
                </div>
            </div>

            `;
            } else {

                document.querySelector('#shop .limited article').innerHTML += `
            <div style="background-color: ${t.display_data.backgroundColor}; border: ${border};" onclick="apply_any_theme('${t.name}', false)">
                 <div style="background-color: ${t.display_data.child_elmnt_bg};">
                     <span>${t.ui_name}</span>
                 </div>
             </div>
            `;

            }

        }




    })

    // nothing available

    let nothing_available = true;
    let not_owned_items = [];
    shop_items.themes.forEach(t => {
        if (!t.owned) {
            not_owned_items.push(t.name);
        }
    })

    not_owned_items.forEach(i => {
        if (!additional_items.includes(i)) {
            nothing_available = false;
        }
    })

    if (nothing_available) {
        document.querySelector('#shop .available').style.animation = 'fade_out .25s both';
        setTimeout(() => {
            document.querySelector('#shop .available').style.display = 'none';
        }, 250);
    }

    ;


    auto_set_icons();


}



function shop_item_ini1() {

    const result = owned_shop_items('get');
    const additional_items = result;

    // owned

    let border = 'none';

    if (localStorage.getItem('theme') == 'auto') {
        border = '5px solid var(--clr-agree)';
    }

    document.querySelector('#shop .owned article').innerHTML = `
         <div style="background-color: var(--clr-deviation); outline: ${border}" onclick="start_auto_theme()">
             <div style="background-color: var(--clr-primary-light)">
                <span>Auto</span>
             </div>
         </div>
    `;

    document.querySelector('#shop .available > article').innerHTML = '';

    shop_items.themes.forEach(theme => {

        if (theme.owned || additional_items.includes(theme.name)) {

            border = 'none';
            if (active_theme === theme.name && localStorage.getItem('theme') != 'auto') {
                border = '5px solid var(--clr-agree)';
            }

            document.querySelector('#shop .owned article').innerHTML += `
                <div style="background-color: ${theme.display_data.backgroundColor}; border: ${border};" onclick="apply_any_theme('${theme.name}', false)">
                     <div style="background-color: ${theme.display_data.child_elmnt_bg};">
                         <span>${theme.ui_name}</span>
                     </div>
                 </div>

            `;

        } else {

            // available

            border = 'none';
            if (active_theme === theme.name && localStorage.getItem('theme') != 'auto') {
                border = '5px solid var(--clr-agree)';
            }

            document.querySelector('#shop .available > article').innerHTML += `
                <div style="background-color: ${theme.display_data.backgroundColor}; border: ${border};" onclick="buy_item_preparation('theme', '${theme.name}')">
                    <button type="button" onclick="buy_theme_preparation">
                        <div class="set-icon">paid</div>
                        <span>${theme.price}</span>
                    </button>
                     <div style="background-color: ${theme.display_data.child_elmnt_bg};">
                         <span>${theme.ui_name}</span>
                     </div>
                 </div>

            `;

            auto_set_icons();

        }

        document.querySelector(`#shop .limited article`).innerHTML = '';

        shop_items.themes.forEach(theme => {

            if (theme.limited && theme.active) {
                document.querySelector(`#shop .limited article`).innerHTML += `
                <div style="background-color: ${theme.display_data.backgroundColor}; border: ${border};" onclick="buy_item_preparation('theme', '${theme.name}')">
                    <button type="button" onclick="buy_theme_preparation">
                        <div class="set-icon">paid</div>
                        <span>${theme.price}</span>
                    </button>
                     <div style="background-color: ${theme.display_data.child_elmnt_bg};">
                         <span>${theme.ui_name}</span>
                     </div>
                 </div>

                `;
            }

        })

        // nothing available

        let nothing_available = true;
        let not_owned_items = [];
        shop_items.themes.forEach(t => {
            if (!t.owned) {
                not_owned_items.push(t.name);
            }
        })

        not_owned_items.forEach(i => {
            if (!additional_items.includes(i)) {
                nothing_available = false;
            }
        })

        if (nothing_available) {
            document.querySelector('#shop .available').style.animation = 'fade_out .25s both';
            setTimeout(() => {
                document.querySelector('#shop .available').style.display = 'none';
            }, 250);
        }

    });

}



/* --- EDIT LIST DROPDOWN INI --- */



function edit_list_dropdown_ini() {

    let ih = 'Automatisch';
    if (cache.vocab_list_context.site_focus != null) {
        if (cache.vocab_list_context.site_focus == 2) {
            ih = 'App-Sprache';
        } else if (cache.vocab_list_context.site_focus == 1) {
            ih = 'Fremdsprache';
        }
    }
    document.querySelector('#edit-list .site-focus > button').innerHTML = ih;

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
    shop();
    streak_checkup();
    setup_ini();

    auto_set_icons();

}




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


