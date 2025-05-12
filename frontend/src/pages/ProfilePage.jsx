import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Upload, Edit2, Save, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { axiosInstanace } from '../lib/axios';

// Define a direct fallback URL
const FALLBACK_AVATAR = "/avatar.png";

// Component for image with fallback
const ProfileImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_AVATAR);
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc(FALLBACK_AVATAR);
      }}
    />
  );
};

function ProfilePage() {
  const { authUser, checkAuth, isCheckingAuth, updateProfilePic, isUpdatingProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullname: authUser?.fullname || 'John Doe',
    email: authUser?.email || 'john.doe@example.com',
    bio: authUser?.bio || 'No bio available'
  });
  
  const fileInputRef = useRef(null);
  
  // Use state for profile image with fallback
  const [profileImage, setProfileImage] = useState(
    authUser?.profilePic || FALLBACK_AVATAR
  );
  
  // Update profile image when authUser changes
  useEffect(() => {
    if (authUser && authUser.profilePic) {
      console.log("Setting profile image from authUser:", authUser.profilePic);
      setProfileImage(authUser.profilePic);
    }
  }, [authUser]);
  
  // Call checkAuth when the component mounts if authUser is null
  useEffect(() => {
    if (!authUser) {
      checkAuth();
    }
  }, []);
  
  // Show loading state if checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const handleImageClick = () => {
    if (isUpdatingProfile) return;
    fileInputRef.current.click();
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleProfilePicUpload(file);
    }
  };
  
  const handleProfilePicUpload = async (file) => {
    // Max size check (3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 3MB.');
      return;
    }
    
    // Valid file type check
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file format. Please upload JPG, PNG, GIF or WEBP.');
      return;
    }
    
    const loadingToast = toast.loading('Uploading profile picture...');
    
    try {
      // Convert the file to base64 string
      const base64 = await convertFileToBase64(file);
      
      // Use the updateProfilePic function from auth store
      const response = await updateProfilePic(base64);
      
      // Log the response to see its structure
      console.log("Profile update response:", response);
      
      // Correctly extract the profilePic URL from the response
      if (response && response.profilePic) {
        // Force update the image with a cache-busting parameter
        const cacheBuster = `?t=${new Date().getTime()}`;
        setProfileImage(response.profilePic + cacheBuster);
        console.log("Profile image set to:", response.profilePic + cacheBuster);
        toast.success('Profile picture updated successfully', { id: loadingToast });
      } else {
        throw new Error('Could not get profile picture URL from response');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      
      // Show appropriate error message
      const errorMessage = error.response?.data?.message || 'Failed to update profile picture. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
      
      // If upload fails, revert to previous image
      if (authUser?.profilePic) {
        setProfileImage(authUser.profilePic);
      } else {
        setProfileImage(FALLBACK_AVATAR);
      }
    }
  };
  
  // Helper function to convert File to base64 string
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      toast.success('Profile updated successfully');
    }
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const createdDate = authUser?.createdAt 
    ? new Date(authUser.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'January 1, 2023';

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 lg:py-12 px-2 sm:px-4 md:px-6 lg:px-8" >
      <Toaster position="top-right" />
      
      <div className="max-w-3xl w-full space-y-6 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-4 sm:px-6 py-6 sm:py-8 text-white relative">
          <button 
            onClick={handleEditToggle}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white text-indigo-600 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isEditing ? "Save changes" : "Edit profile"}
          >
            {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-center">My Profile</h1>
          <p className="text-center text-sm sm:text-base opacity-80">Manage your personal information</p>
        </div>
        
        {/* Profile Content */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:items-center md:items-start md:flex-row gap-6 md:gap-8">
            {/* Left Column - Profile Picture */}
            <div className="flex flex-col items-center space-y-3 mx-auto sm:mx-0">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-indigo-100">
                  {profileImage ? (
                    <img 
                      src={profileImage}
                      alt="Profile" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        console.log("Image load error, using fallback for:", profileImage);
                        e.target.onerror = null; // Prevent infinite error loop
                        e.target.src = FALLBACK_AVATAR;
                      }}
                    />
                  ) : (
                    <img 
                      src={FALLBACK_AVATAR}
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                
                {/* Image Upload Overlay */}
                <div 
                  className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center ${isUpdatingProfile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity cursor-pointer`}
                  onClick={handleImageClick}
                >
                  {isUpdatingProfile ? (
                    <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Camera size={28} color="white" />
                  )}
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              
              <button 
                className="flex items-center text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleImageClick}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <>
                    <div className="animate-spin h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full mr-1"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={14} className="mr-1" />
                    Upload New Picture
                  </>
                )}
              </button>
            </div>
            
            {/* Right Column - User Details */}
            <div className="flex-grow space-y-5 sm:space-y-6 w-full md:w-auto">
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullname"
                        value={userData.fullname}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900 text-sm sm:text-base">{userData.fullname}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900 text-sm sm:text-base break-all">{userData.email}</div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900 text-sm sm:text-base">{userData.bio}</div>
                    )}
                  </div>
                </div>
              </section>
              
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">Account Information</h2>
                
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="text-gray-500">Member since</span>
                    <span className="font-medium">{createdDate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="text-gray-500">Account type</span>
                    <span className="font-medium">Standard</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="text-gray-500">Account status</span>
                    <span className="font-medium px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                  </div>
        </div>
              </section>
        </div>
          </div>
        </div>
        
        {/* Footer */}
        {isEditing && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex justify-end space-x-3 sm:space-x-4">
            <button 
              onClick={() => setIsEditing(false)} 
              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <X size={14} className="mr-1" />
              Cancel
            </button>
            
            <button 
              onClick={handleEditToggle} 
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 border border-transparent rounded-md text-sm text-white hover:bg-indigo-700 flex items-center"
            >
              <Save size={14} className="mr-1" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage; 