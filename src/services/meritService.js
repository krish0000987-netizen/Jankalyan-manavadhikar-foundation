import { supabase } from '../api/supabase';

export const meritService = {
  async getMeritRules() {
    const { data, error } = await supabase.from('merit_rules').select('*');
    if (error) throw error;
    return data || [];
  },

  async getMeritLists() {
    const { data, error } = await supabase
      .from('merit_lists')
      .select('*, merit_rules(name), merit_list_entries(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async generateMeritList({ title, schemeId, ruleId = null }) {
    // 1. Fetch eligible applications
    const { data: apps } = await supabase
      .from('applications')
      .select('id, student_id, students(academic_records(prev_percentage), annual_income)')
      .in('status', ['APPROVED', 'UNDER_VERIFICATION', 'SCHOLARSHIP_RELEASED']);

    // 2. Score applicants based on percentage and income
    const ranked = (apps || []).map(app => {
      const pct = app.students?.academic_records?.[0]?.prev_percentage || 70;
      const income = app.students?.annual_income || 100000;
      // Weight 70% academic marks + 30% need-based (lower income = higher score)
      const academicScore = pct * 0.7;
      const needScore = Math.max(0, (300000 - income) / 10000) * 1.0;
      const totalScore = Math.min(100, academicScore + needScore);
      return {
        applicationId: app.id,
        score: parseFloat(totalScore.toFixed(2))
      };
    }).sort((a, b) => b.score - a.score);

    // 3. Create merit list record
    const { data: newList, error: listErr } = await supabase
      .from('merit_lists')
      .insert({
        title,
        scheme_id: schemeId,
        merit_rule_id: ruleId,
        total_candidates: ranked.length,
        status: 'DRAFT'
      })
      .select()
      .single();

    if (listErr) throw listErr;

    // 4. Insert entries
    for (let i = 0; i < ranked.length; i++) {
      await supabase.from('merit_list_entries').insert({
        merit_list_id: newList.id,
        application_id: ranked[i].applicationId,
        rank_number: i + 1,
        calculated_score: ranked[i].score,
        selection_status: i < 50 ? 'SELECTED' : 'WAITLISTED'
      });
    }

    return newList;
  },

  async publishMeritList(listId, publisherId = null) {
    const { data, error } = await supabase
      .from('merit_lists')
      .update({
        status: 'PUBLISHED',
        published_at: new Date().toISOString(),
        published_by: publisherId,
        updated_at: new Date().toISOString()
      })
      .eq('id', listId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
