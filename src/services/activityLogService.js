import { supabase } from './supabaseClient';

export const logActivity = async ({
  ownerId,
  actorId,
  actorEmail,
  action,
  entityType,
  entityId,
  details = {}
}) => {
  try {
    const payload = {
      owner_id: ownerId,
      actor_id: actorId,
      actor_email: actorEmail,
      action,
      entity_type: entityType,
      entity_id: entityId?.toString(),
      details
    };

    const { error } = await supabase
      .from('activity_logs')
      .insert([payload]);

    if (error) throw error;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const fetchActivityLogs = async (ownerIds, limit = 100) => {
  const ids = Array.isArray(ownerIds) ? ownerIds : [ownerIds];

  const query = supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (ids.length === 1) {
    query.eq('owner_id', ids[0]);
  } else {
    query.in('owner_id', ids);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }

  return data || [];
};


