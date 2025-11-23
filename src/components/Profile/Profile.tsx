import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { getUserProfile, updateUserProfile } from '../../services/authService';
import type { User } from '../../types';
import './Profile.css';

export default function Profile() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
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
        setWeight(userProfile.weight || '');
        setHeight(userProfile.height || '');
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
      await updateUserProfile(user.uid, {
        displayName: displayName || undefined,
        weight: weight !== '' ? Number(weight) : undefined,
        height: height !== '' ? Number(height) : undefined,
      });
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

          <div className="info-item">
            <label>Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Enter your weight in kg"
              min="0"
              step="0.1"
            />
          </div>

          <div className="info-item">
            <label>Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Enter your height in cm"
              min="0"
              step="0.1"
            />
          </div>

          {profile && profile.weight && profile.height && (
            <div className="info-item">
              <label>BMI (Body Mass Index)</label>
              <div className="info-value">
                {((profile.weight / ((profile.height / 100) ** 2))).toFixed(1)}
                <span style={{ fontSize: '0.9em', color: '#666', marginLeft: '8px' }}>
                  {(() => {
                    const bmi = profile.weight / ((profile.height / 100) ** 2);
                    if (bmi < 18.5) return '(Underweight)';
                    if (bmi < 25) return '(Normal)';
                    if (bmi < 30) return '(Overweight)';
                    return '(Obese)';
                  })()}
                </span>
              </div>
            </div>
          )}

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

