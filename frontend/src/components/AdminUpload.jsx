// import { useParams,useNavigate } from 'react-router';
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import axiosClient from '../utils/axiosClient'

// function AdminUpload(){
    
//     const {problemId}  = useParams();
//     const navigate=useNavigate();
//     const [uploading, setUploading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploadedVideo, setUploadedVideo] = useState(null);
    
//       const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors },
//         reset,
//         setError,
//         clearErrors
//       } = useForm();
    
//       const selectedFile = watch('videoFile')?.[0];
    
//       // Upload video to Cloudinary
//       const onSubmit = async (data) => {
//         const file = data.videoFile[0];
        
//         setUploading(true);
//         setUploadProgress(0);
//         clearErrors();
    
//         try {
//           // Step 1: Get upload signature from backend
//           const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
//           const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;
    
//           // Step 2: Create FormData for Cloudinary upload
//           const formData = new FormData();
//           formData.append('file', file);
//           formData.append('signature', signature);
//           formData.append('timestamp', timestamp);
//           formData.append('public_id', public_id);
//           formData.append('api_key', api_key);
    
//           // Step 3: Upload directly to Cloudinary
//           const uploadResponse = await axios.post(upload_url, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//             onUploadProgress: (progressEvent) => {
//               const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               setUploadProgress(progress);
//             },
//           });
    
//           const cloudinaryResult = uploadResponse.data;
    
//           // Step 4: Save video metadata to backend
//           const metadataResponse = await axiosClient.post('/video/save', {
//             problemId:problemId,
//             cloudinaryPublicId: cloudinaryResult.public_id,
//             secureUrl: cloudinaryResult.secure_url,
//             duration: cloudinaryResult.duration,
//           });
    
//           setUploadedVideo(metadataResponse.data.videoSolution);
//           reset(); // Reset form after successful upload
          
//         } catch (err) {
//           console.error('Upload error:', err);
//           setError('root', {
//             type: 'manual',
//             message: err.response?.data?.message || 'Upload failed. Please try again.'
//           });
//         } finally {
//           setUploading(false);
//           setUploadProgress(0);
//         }
//       };
    
//       // Format file size
//       const formatFileSize = (bytes) => {
//         if (bytes === 0) return '0 Bytes';
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//       };
    
//       // Format duration
//       const formatDuration = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins}:${secs.toString().padStart(2, '0')}`;
//       };
    
//       return (
//         <div className="max-w-md mx-auto p-6">
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//               <h2 className="card-title">Upload Video</h2>
//                 {/* Back Button */}
//                 <button
//                 type="button"
//                 className="btn btn-secondary mb-4"
//                 onClick={() => navigate('/admin/video')}
//                 disabled={uploading}
//                 >
//                 Back
//                 </button>
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 {/* File Input */}
//                 <div className="form-control w-full">
//                   <label className="label">
//                     <span className="label-text">Choose video file</span>
//                   </label>
//                   <input
//                     type="file"
//                     accept="video/*"
//                     {...register('videoFile', {
//                       required: 'Please select a video file',
//                       validate: {
//                         isVideo: (files) => {
//                           if (!files || !files[0]) return 'Please select a video file';
//                           const file = files[0];
//                           return file.type.startsWith('video/') || 'Please select a valid video file';
//                         },
//                         fileSize: (files) => {
//                           if (!files || !files[0]) return true;
//                           const file = files[0];
//                           const maxSize = 100 * 1024 * 1024; // 100MB
//                           return file.size <= maxSize || 'File size must be less than 100MB';
//                         }
//                       }
//                     })}
//                     className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
//                     disabled={uploading}
//                   />
//                   {errors.videoFile && (
//                     <label className="label">
//                       <span className="label-text-alt text-error">{errors.videoFile.message}</span>
//                     </label>
//                   )}
//                 </div>
    
//                 {/* Selected File Info */}
//                 {selectedFile && (
//                   <div className="alert alert-info">
//                     <div>
//                       <h3 className="font-bold">Selected File:</h3>
//                       <p className="text-sm">{selectedFile.name}</p>
//                       <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>
//                     </div>
//                   </div>
//                 )}
    
//                 {/* Upload Progress */}
//                 {uploading && (
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span>Uploading...</span>
//                       <span>{uploadProgress}%</span>
//                     </div>
//                     <progress 
//                       className="progress progress-primary w-full" 
//                       value={uploadProgress} 
//                       max="100"
//                     ></progress>
//                   </div>
//                 )}
    
//                 {/* Error Message */}
//                 {errors.root && (
//                   <div className="alert alert-error">
//                     <span>{errors.root.message}</span>
//                   </div>
//                 )}
    
//                 {/* Success Message */}
//                 {uploadedVideo && (
//                   <div className="alert alert-success">
//                     <div>
//                       <h3 className="font-bold">Upload Successful!</h3>
//                       <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
//                       <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 )}
    
//                 {/* Upload Button */}
//                 <div className="card-actions justify-end">
//                   <button
//                     type="submit"
//                     disabled={uploading}
//                     className={`btn btn-primary ${uploading ? 'loading' : ''}`}
//                   >
//                     {uploading ? 'Uploading...' : 'Upload Video'}
//                   </button>
//                 </div>
//               </form>
            
//             </div>
//           </div>
//         </div>
//     );
// }


// export default AdminUpload;


import { useParams, useNavigate } from 'react-router';
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { ArrowLeft, UploadCloud, Trash2, Video, CheckCircle } from 'lucide-react';

function AdminUpload() {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedVideo, setUploadedVideo] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setError,
        clearErrors,
        setValue
    } = useForm();

    const selectedFile = watch('videoFile')?.[0];

    // Generate preview for selected file
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }
        
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        
        // Clean up
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    // Upload video to Cloudinary
    const onSubmit = async (data) => {
        const file = data.videoFile[0];
        
        setUploading(true);
        setUploadProgress(0);
        clearErrors();

        try {
            // Step 1: Get upload signature from backend
            const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
            const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

            // Step 2: Create FormData for Cloudinary upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('public_id', public_id);
            formData.append('api_key', api_key);

            // Step 3: Upload directly to Cloudinary
            const uploadResponse = await axios.post(upload_url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });

            const cloudinaryResult = uploadResponse.data;

            // Step 4: Save video metadata to backend
            const metadataResponse = await axiosClient.post('/video/save', {
                problemId: problemId,
                cloudinaryPublicId: cloudinaryResult.public_id,
                secureUrl: cloudinaryResult.secure_url,
                duration: cloudinaryResult.duration,
            });

            setUploadedVideo(metadataResponse.data.videoSolution);
            reset(); // Reset form after successful upload
            
        } catch (err) {
            console.error('Upload error:', err);
            setError('root', {
                type: 'manual',
                message: err.response?.data?.message || 'Upload failed. Please try again.'
            });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Format duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Clear selected file
    const clearSelection = () => {
        reset({ videoFile: null });
        setPreviewUrl(null);
        clearErrors('videoFile');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/admin/video')}
                        className="btn btn-ghost text-gray-300 hover:bg-gray-800 mb-4"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Videos
                    </button>
                    <h1 className="text-2xl font-bold text-white">Upload Video Solution</h1>
                    <p className="text-gray-400 mt-2">
                        For Problem ID: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{problemId}</span>
                    </p>
                </div>

                <div className="card bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700">
                    <div className="card-body p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* File Upload Area */}
                            <div 
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                                    ${errors.videoFile ? 'border-red-500 bg-red-900/20' : 'border-gray-600'} 
                                    ${previewUrl ? 'border-blue-500' : ''}
                                    hover:border-blue-500 hover:bg-gray-700/50`}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    accept="video/*"
                                    {...register('videoFile', {
                                        required: 'Please select a video file',
                                        validate: {
                                            isVideo: (files) => {
                                                if (!files || !files[0]) return 'Please select a video file';
                                                const file = files[0];
                                                return file.type.startsWith('video/') || 'Please select a valid video file';
                                            },
                                            fileSize: (files) => {
                                                if (!files || !files[0]) return true;
                                                const file = files[0];
                                                const maxSize = 100 * 1024 * 1024; // 100MB
                                                return file.size <= maxSize || 'File size must be less than 100MB';
                                            }
                                        }
                                    })}
                                    className="hidden"
                                    ref={fileInputRef}
                                    disabled={uploading}
                                />
                                
                                {previewUrl ? (
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <video 
                                                src={previewUrl} 
                                                className="w-full max-w-xs rounded-lg mb-4"
                                                controls
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearSelection();
                                                }}
                                                className="btn btn-error btn-circle btn-sm absolute -top-2 -right-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium text-white truncate max-w-xs">{selectedFile.name}</p>
                                            <p className="text-sm text-gray-400">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-4">
                                        <UploadCloud className="h-10 w-10 text-gray-500 mb-3" />
                                        <p className="font-medium text-gray-300">
                                            Select a video file
                                        </p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Click to browse or drag & drop
                                        </p>
                                        <p className="text-xs text-gray-500 mt-3">
                                            Max file size: 100MB • Supported: MP4, MOV, AVI
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {/* File Validation Error */}
                            {errors.videoFile && (
                                <div className="alert bg-red-900/40 text-red-200 p-3 rounded-lg border border-red-800">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 mt-0.5" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="ml-2">{errors.videoFile.message}</span>
                                    </div>
                                </div>
                            )}

                            {/* Upload Progress */}
                            {uploading && (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Uploading...</span>
                                        <span className="font-medium text-white">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {errors.root && (
                                <div className="alert bg-red-900/40 text-red-200 p-3 rounded-lg border border-red-800">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 mt-0.5" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="ml-2">{errors.root.message}</span>
                                    </div>
                                </div>
                            )}

                            {/* Success Message */}
                            {uploadedVideo && (
                                <div className="alert bg-green-900/30 text-green-200 p-3 rounded-lg border border-green-800">
                                    <div className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                                        <div className="ml-2">
                                            <h3 className="font-bold">Upload Successful!</h3>
                                            <div className="flex flex-col mt-2 text-sm">
                                                <div className="flex items-center mt-1">
                                                    <Video className="h-4 w-4 mr-2 text-green-400" />
                                                    <span>Duration: {formatDuration(uploadedVideo.duration)}</span>
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <span>Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Upload Button */}
                            <div className="flex flex-col space-y-3">
                                <button
                                    type="submit"
                                    disabled={uploading || !selectedFile}
                                    className={`btn btn-primary w-full ${uploading ? 'opacity-75' : ''}`}
                                >
                                    {uploading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-5 w-5 mr-2" />
                                            Upload Video
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/video')}
                                    className="btn btn-ghost text-gray-300 hover:bg-red-700 w-full"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUpload;