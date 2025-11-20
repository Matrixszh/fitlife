import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { getUserProfile } from '../../services/authService';
import type { User } from '../../types';
import './Profile.css';

export default function Profile() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userProfile = await getUserProfile(user.uid);
      if (userProfile) {
        setProfile(userProfile);
        setDisplayName(userProfile.displayName || '');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      await updateFirebaseProfile(user, { displayName: displayName || undefined });
      setMessage('Profile updated successfully!');
      loadProfile();
    } catch (error: any) {
      setMessage('Failed to update profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Your Profile</h2>

        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}

        <div className="profile-info">
          <div className="info-item">
            <label>Email</label>
            <div className="info-value">{user?.email}</div>
          </div>

          <div className="info-item">
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {profile && (
            <div className="info-item">
              <label>Member Since</label>
              <div className="info-value">
                {new Date(profile.createdAt).toLocaleDateString()}
              </div>
            </div>
          )}

          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

