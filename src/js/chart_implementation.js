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