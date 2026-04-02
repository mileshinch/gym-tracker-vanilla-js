import { supabase } from './supabaseClient.js';

console.log('app running')

const form = document.getElementById('workout-form');

let workoutId = localStorage.getItem('workoutId');
console.log('workout id',workoutId)

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const formDataForDebugging = Object.fromEntries(formData.entries());

  // 👉 STEP 1: Create workout if needed
  if (!workoutId) {
    const today = new Date().toISOString();

    const { data, error: workoutError } = await supabase
      .from('workouts')
      .insert([{ date: today }])
      .select();

    if (workoutError) {
      console.error('Error creating workout:', workoutError);
      return;
    }

    workoutId = data[0].id;
    localStorage.setItem('workoutId', workoutId);
  }

  // 👉 STEP 2: Add exercise
  const exerciseName = formData.get('exercise');

  // 1️⃣ Try to find the exercise
const { data: existingExercise, error: fetchError } = await supabase
  .from('exercises')
  .select('id')
  .eq('name', exerciseName)
  .maybeSingle();

if (fetchError) {
  console.error('Error fetching exercise:', fetchError);
  return;
}

let exerciseId;

// 2️⃣ If it exists, use it
if (existingExercise) {
  exerciseId = existingExercise.id;
} else {
  // 3️⃣ Otherwise, create it
  const { data: newExercise, error: insertError } = await supabase
    .from('exercises')
    .insert([{ name: exerciseName }])
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting exercise:', insertError);
    return;
  }

  exerciseId = newExercise.id;
}

  // 👉 STEP 3: Add weight
  const weight = formData.get('weight');

    // 3️⃣ Insert into workout_exercises
  const { error: joinError } = await supabase
    .from('workout_exercises')
    .insert([{
      workout_id: workoutId,
      exercise_id: exerciseId,
      weight: weight,
    }]);

  if (joinError) {
    console.error(joinError);
    return;
  }

  form.reset();
});

document.getElementById('finishWorkoutBtn').addEventListener('click', () => {
  workoutId = null;
  console.log('workout id',workoutId)
  localStorage.removeItem('workoutId');

  alert('Workout saved!');
});