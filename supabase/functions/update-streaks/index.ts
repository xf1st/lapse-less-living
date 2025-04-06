
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { calculateCurrentStreak } from '../_shared/habitUtils.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get all habits
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('*')
    
    if (habitsError) throw habitsError

    // Get all habit entries
    const { data: entries, error: entriesError } = await supabase
      .from('habit_entries')
      .select('*')
    
    if (entriesError) throw entriesError

    // Function to get the last relapse date for a habit
    const getLastRelapseDate = (habitId: string): string | null => {
      const relapseEntries = entries.filter(
        entry => entry.habit_id === habitId && entry.is_relapse
      )
      
      if (relapseEntries.length === 0) return null
      
      relapseEntries.sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      )
      
      return relapseEntries[0].completed_at
    }

    const updates = []
    
    // Update each habit's streaks
    for (const habit of habits) {
      if (!habit.start_date) continue
      
      const lastRelapseDate = getLastRelapseDate(habit.id)
      const currentStreak = calculateCurrentStreak(habit.start_date, lastRelapseDate)
      const longestStreak = Math.max(habit.longest_streak || 0, currentStreak)
      
      // Only update if the values have changed
      if (habit.current_streak !== currentStreak || habit.longest_streak !== longestStreak) {
        const { error: updateError } = await supabase
          .from('habits')
          .update({
            current_streak: currentStreak,
            longest_streak: longestStreak,
            updated_at: new Date().toISOString()
          })
          .eq('id', habit.id)
        
        if (updateError) {
          console.error(`Error updating habit ${habit.id}:`, updateError.message)
        } else {
          updates.push(habit.id)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        updatedHabits: updates.length,
        message: `Updated streaks for ${updates.length} habits`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
