import { supabase } from '../api/supabase.js';

export const meritService = {
  /**
   * Fetch all merit lists (for Admin)
   */
  async getMeritLists() {
    const { data, error } = await supabase
      .from('merit_lists')
      .select('*, scholarship_schemes(name, code)')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching merit lists:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Fetch public published merit lists
   */
  async getPublishedMeritLists() {
    const { data, error } = await supabase
      .from('merit_lists')
      .select('*, scholarship_schemes(name, code)')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching published merit lists:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Fetch detailed entries for a specific merit list
   */
  async getMeritListEntries(listId) {
    const { data, error } = await supabase
      .from('merit_list_entries')
      .select(`
        *,
        applications (
          id,
          status,
          submission_date,
          approval_date,
          students (
            full_name,
            father_name,
            mobile,
            category,
            annual_income,
            gender,
            samagra_id,
            academic_records (
              prev_percentage,
              class_course,
              institution_name
            )
          )
        )
      `)
      .eq('merit_list_id', listId)
      .order('rank_number', { ascending: true });

    if (error) {
      console.error('Error fetching merit list entries:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Automated Merit Algorithm:
   * Generates a ranked candidate list based on 70% Academic Marks % + 30% Economic Need.
   */
  async generateMeritList({ 
    title, 
    schemeId = 'd0000000-0000-0000-0000-000000000001', 
    cutoffMarks = 50, 
    maxIncome = 300000, 
    quota = 50,
    roundNumber = 1 
  }) {
    // 1. Fetch applications
    const { data: apps, error: fetchErr } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        students (
          full_name,
          father_name,
          category,
          annual_income,
          academic_records (
            prev_percentage,
            class_course
          )
        )
      `)
      .in('status', ['APPROVED', 'SCHOLARSHIP_RELEASED', 'UNDER_VERIFICATION', 'SUBMITTED']);

    if (fetchErr) throw fetchErr;

    // 2. Score and rank applicants
    const scoredApplicants = (apps || [])
      .map(app => {
        const student = app.students || {};
        const records = student.academic_records || [];
        const pct = Number(records[0]?.prev_percentage) || 72.0;
        const income = Number(student.annual_income) || 120000;

        // Eligibility check
        if (pct < cutoffMarks || income > maxIncome) {
          return null;
        }

        // Composite scoring formula:
        // Academic Score = 70% weight
        // Economic Need Score = 30% weight (lower income receives higher financial aid priority)
        const academicScore = pct * 0.7;
        const needScore = Math.max(0, Math.min(30, ((maxIncome - income) / maxIncome) * 30));
        const totalScore = parseFloat((academicScore + needScore).toFixed(2));

        return {
          applicationId: app.id,
          name: student.full_name || 'Applicant',
          category: student.category || 'General',
          marksPercentage: pct,
          annualIncome: income,
          score: totalScore
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        // Primary sort: Composite score descending
        if (b.score !== a.score) return b.score - a.score;
        // Secondary tie-breaker: Academic Marks % descending
        return b.marksPercentage - a.marksPercentage;
      });

    // 3. Create merit list record in database
    const { data: newList, error: listErr } = await supabase
      .from('merit_lists')
      .insert({
        title: title || `Merit Selection List Round ${roundNumber} - 2026-27`,
        scheme_id: schemeId || 'd0000000-0000-0000-0000-000000000001',
        round_number: roundNumber || 1,
        total_candidates: scoredApplicants.length,
        status: 'DRAFT',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (listErr) throw listErr;

    // 4. Batch insert ranked entries
    const entriesToInsert = scoredApplicants.map((applicant, index) => {
      const rank = index + 1;
      const isSelected = quota ? rank <= quota : rank <= 50;
      return {
        merit_list_id: newList.id,
        application_id: applicant.applicationId,
        rank_number: rank,
        calculated_score: applicant.score,
        selection_status: isSelected ? 'SELECTED' : 'WAITLISTED'
      };
    });

    if (entriesToInsert.length > 0) {
      const { error: entriesErr } = await supabase
        .from('merit_list_entries')
        .insert(entriesToInsert);
      if (entriesErr) {
        console.error('Error inserting merit entries:', entriesErr);
      }
    }

    return newList;
  },

  /**
   * Publish a Merit List to make it visible on the public portal
   */
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
  },

  /**
   * Unpublish a Merit List (revert to DRAFT)
   */
  async unpublishMeritList(listId) {
    const { data, error } = await supabase
      .from('merit_lists')
      .update({
        status: 'DRAFT',
        published_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', listId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a Merit List and all its entries
   */
  async deleteMeritList(listId) {
    await supabase.from('merit_list_entries').delete().eq('merit_list_id', listId);
    const { error } = await supabase.from('merit_lists').delete().eq('id', listId);
    if (error) throw error;
    return true;
  },

  /**
   * Update candidate selection status manually
   */
  async updateEntryStatus(entryId, newStatus) {
    const { data, error } = await supabase
      .from('merit_list_entries')
      .update({ selection_status: newStatus })
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
