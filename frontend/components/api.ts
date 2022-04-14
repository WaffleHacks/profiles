const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

type ProfileCreate = Omit<Profile, 'id'>;

type ProfileUpdate = Partial<ProfileCreate>;

const handleError = (r: Response) => {
  if (!r.ok) {
    if (r.status === 400) throw new Error('You must provide a first and last name');
    else if (r.status === 401) throw new Error('Your token has expired. Please go back and login again');
    else throw new Error('An unexpected error occurred, please try again later');
  }
};

/**
 * Create the user's initial profile
 * @param token an authentication token
 * @param profile the initial profile values
 */
export const create = async (token: string, profile: ProfileCreate) => {
  const response = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  handleError(response);
};

/**
 * Fetch the user's profile
 * @param token an authentication token
 */
export const get = async (token: string): Promise<Profile> => {
  const response = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  handleError(response);

  return await response.json();
};

/**
 * Update the user's profile
 * @param token an authentication token
 * @param update the fields to update
 */
export const update = async (token: string, update: ProfileUpdate) => {
  const response = await fetch(`${API_BASE}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(update),
  });
  handleError(response);
};
