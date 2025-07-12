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



"use strict";

let dt_open;
let dt_done;

/* --- DAILY TARGET 1 --- */

const daily_target_mini = document.getElementById('daily-goal');

let daily_goal_data = {
  labels: [
    'Erledigt',
    'Offen',
  ],
  datasets: [{
    label: 'Fortschritt',
    data: [dt_done, dt_open],
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

/* DAILY TARGET (STATISTIC MAIN) */

const daily_target = document.getElementById('daily-target');

let daily_target_chart = new Chart(daily_target, {
  'type': 'doughnut',
  'data': {
    'labels': ['Erledigt', 'Offen'],
    'datasets': [{
      label: 'Fortschritt',
      data: [dt_open, dt_done],
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


