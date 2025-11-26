import { supabase } from './supabaseClient';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

export const fetchGrantedAccess = async (ownerId) => {
  const { data, error } = await supabase
    .from('account_access')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching granted access:', error);
    throw error;
  }

  return data || [];
};

export const fetchAccessibleAccounts = async (email) => {
  const normalized = normalizeEmail(email);
  const { data, error } = await supabase
    .from('account_access')
    .select('*')
    .eq('shared_email', normalized)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching accessible accounts:', error);
    throw error;
  }

  return data || [];
};

export const addAccess = async ({ ownerId, ownerEmail, sharedEmail }) => {
  const normalized = normalizeEmail(sharedEmail);

  if (!normalized) {
    throw new Error('Please provide an email address.');
  }

  if (normalizeEmail(ownerEmail) === normalized) {
    throw new Error('You already own this account.');
  }

  const payload = {
    owner_id: ownerId,
    owner_email: ownerEmail,
    shared_email: normalized
  };

  const { data, error } = await supabase
    .from('account_access')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error adding access:', error);
    throw error;
  }

  return data;
};

export const removeAccess = async (accessId) => {
  const { error } = await supabase
    .from('account_access')
    .delete()
    .eq('id', accessId);

  if (error) {
    console.error('Error removing access:', error);
    throw error;
  }
};


