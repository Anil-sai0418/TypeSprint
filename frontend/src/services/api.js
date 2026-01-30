// Use environment variable or deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://typevex-1.onrender.com';

// ==================== TEXT GENERATION ====================

export const fetchRandomText = async (wordLimit = 50, includePunctuation = false, includeNumbers = false) => {
  try {
    const params = new URLSearchParams();
    if (wordLimit) params.append('wordLimit', wordLimit);
    params.append('includePunctuation', includePunctuation === true || includePunctuation === 'true');
    params.append('includeNumbers', includeNumbers === true || includeNumbers === 'true');

    const response = await fetch(`${API_BASE_URL}/random-text?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch text');
    return await response.json();
  } catch (error) {
    console.error('Error fetching random text:', error);
    throw error;
  }
};

// ==================== AUTHENTICATION ====================

export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// ==================== PROFILE ENDPOINTS ====================

export const getFullUserProfile = async (email, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateProfileData = async (email, data, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const getUserStats = async (email, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${email}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

export const getUserActivity = async (email, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${email}/activity`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch activity');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw error;
  }
};

// ==================== TYPING TEST ENDPOINTS ====================

export const saveTestResult = async (testData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/typing-test/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: testData.email,
        wpm: testData.wpm,
        accuracy: testData.accuracy,
        duration: testData.duration,
        raw: testData.rawWpm || testData.raw,
      }),
    });
    if (!response.ok) throw new Error('Failed to save test result');
    return await response.json();
  } catch (error) {
    console.error('Error saving test result:', error);
    throw error;
  }
};

export const getTypingStats = async (email, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/typing-test/stats/${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch typing stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching typing stats:', error);
    throw error;
  }
};

// ==================== LEADERBOARD ENDPOINTS ====================

export const getLeaderboard = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/leaderboard/global/top?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};
