import { supabase } from './supabaseClient.js';

const { data, error } = await supabase
  .from('workout_exercises')
  .select('*')

  if (error) {
  console.error(error)
} else {
  console.log(data)
}

const exerciseId = 2

const { data: exerciseData } = await supabase
  .from('exercises')
  .select('name')
  .eq('id', exerciseId)
  .single()

const exerciseName = exerciseData.name

const filtered = data
  .filter(row => row.exercise_id === exerciseId)
  .sort((a, b) => a.workout_id - b.workout_id)

const labels = filtered.map(d => `Workout ${d.workout_id}`)
const weights = filtered.map(d => d.weight)

const ctx = document.getElementById('chart')

new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Weight lifted',
      data: weights,
      tension: 0.3,          // smooth line
      fill: false            // no area fill
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: exerciseName
      }
    }
  }
})