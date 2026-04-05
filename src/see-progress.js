import { supabase } from './supabaseClient.js';

const { data } = await supabase
  .from('workout_exercises')
  .select(`
    weight,
    workout_id,
    exercise_id,
    exercises ( name )
  `)
  .order('workout_id', { ascending: true })

const grouped = {}

data.forEach(row => {
  if (!grouped[row.exercise_id]) {
    grouped[row.exercise_id] = []
  }
  grouped[row.exercise_id].push(row)
})

const container = document.getElementById('charts')

container.style.display = 'flex'
container.style.flexWrap = 'wrap'
container.style.gap = '20px'

Object.entries(grouped).forEach(([exerciseId, rows]) => {
const wrapper = document.createElement('div')
wrapper.style.width = '400px'
wrapper.style.height = '250px'
wrapper.style.marginBottom = '30px'

const canvas = document.createElement('canvas')

wrapper.appendChild(canvas)
container.appendChild(wrapper)

  // prepare data
  const labels = rows.map(r => `Workout ${r.workout_id}`)
  const weights = rows.map(r => r.weight)
  const name = rows[0].exercises.name

  // draw chart
  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Weight',
        data: weights,
        showLine: false,
        tension: 0.3,
        pointRadius: 6,
  pointHoverRadius: 8
      }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
      plugins: {
        legend: {
      display: false
    },
        title: {
          display: true,
          text: name
        }
      }
    }
  })
})