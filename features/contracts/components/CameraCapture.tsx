import React from 'react';
import { Camera, Upload, Trash2, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
	docCaptureMode: 'upload' | 'camera';
	setDocCaptureMode: (mode: 'upload' | 'camera') => void;
	attachedDocument: string | null;
	setAttachedDocument: (doc: string | null) => void;
	capturedPhoto: string | null;
	setCapturedPhoto: (photo: string | null) => void;
	activeCamera: 'doc' | 'face' | null;
	cameraError: string | null;
	videoRef: React.RefObject<HTMLVideoElement | null>;
	startCamera: (target: 'doc' | 'face') => Promise<void>;
	stopCamera: () => void;
	takePhoto: (target: 'doc' | 'face') => void;
	handleDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
	docCaptureMode,
	setDocCaptureMode,
	attachedDocument,
	setAttachedDocument,
	capturedPhoto,
	setCapturedPhoto,
	activeCamera,
	cameraError,
	videoRef,
	startCamera,
	stopCamera,
	takePhoto,
	handleDocumentUpload,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			{/* Anexar Documento */}
			<div className="space-y-0">
				<div className="flex items-center justify-between h-10 mb-3">
					<label className="block text-sm font-semibold text-slate-700">
						Anexar Documento (RG/CNH)
					</label>
					{!attachedDocument && !activeCamera && (
						<div className="flex bg-slate-100 p-1 rounded-lg">
							<button
								type="button"
								onClick={() => setDocCaptureMode('upload')}
								className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${docCaptureMode === 'upload' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
							>
								Upload
							</button>
							<button
								type="button"
								onClick={() => setDocCaptureMode('camera')}
								className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${docCaptureMode === 'camera' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
							>
								Câmera
							</button>
						</div>
					)}
				</div>
				<div
					className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all ${attachedDocument ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-primary-400 hover:bg-white'}`}
				>
					{attachedDocument ? (
						<div className="relative w-full h-full p-2">
							<img
								src={attachedDocument}
								alt="Documento"
								className="w-full h-full object-contain rounded-lg"
							/>
							<button
								type="button"
								onClick={() => setAttachedDocument(null)}
								className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
							>
								<Trash2 size={16} />
							</button>
						</div>
					) : activeCamera === 'doc' ? (
						<div className="relative w-full h-full overflow-hidden rounded-2xl">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								className="w-full h-full object-cover"
							/>
							<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
								<button
									type="button"
									onClick={() => takePhoto('doc')}
									className="p-3 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700"
								>
									<Camera size={24} />
								</button>
								<button
									type="button"
									onClick={stopCamera}
									className="p-3 bg-slate-800 text-white rounded-full shadow-xl hover:bg-slate-900"
								>
									<RotateCcw size={24} />
								</button>
							</div>
						</div>
					) : docCaptureMode === 'camera' ? (
						<button
							type="button"
							onClick={() => startCamera('doc')}
							className="flex flex-col items-center justify-center w-full h-full cursor-pointer outline-none"
						>
							<Camera className="w-10 h-10 text-slate-400 mb-2" />
							<span className="text-sm text-slate-500 font-medium">
								Clique para abrir a câmera
							</span>
						</button>
					) : (
						<label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
							<Upload className="w-10 h-10 text-slate-400 mb-2" />
							<span className="text-sm text-slate-500 font-medium">
								Clique para anexar foto do documento
							</span>
							<input
								type="file"
								accept="image/*"
								onChange={handleDocumentUpload}
								className="hidden"
							/>
						</label>
					)}
				</div>
			</div>

			{/* Tirar Foto */}
			<div className="space-y-0">
				<div className="flex items-center h-10 mb-3">
					<label className="block text-sm font-semibold text-slate-700">
						Tirar Foto do Rosto
					</label>
				</div>
				<div
					className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all ${capturedPhoto ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-primary-400 hover:bg-white'}`}
				>
					{capturedPhoto ? (
						<div className="relative w-full h-full p-2">
							<img
								src={capturedPhoto}
								alt="Foto"
								className="w-full h-full object-contain rounded-lg"
							/>
							<button
								type="button"
								onClick={() => setCapturedPhoto(null)}
								className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
							>
								<Trash2 size={16} />
							</button>
						</div>
					) : activeCamera === 'face' ? (
						<div className="relative w-full h-full overflow-hidden rounded-2xl">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								className="w-full h-full object-cover"
							/>
							<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
								<button
									type="button"
									onClick={() => takePhoto('face')}
									className="p-3 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700"
								>
									<Camera size={24} />
								</button>
								<button
									type="button"
									onClick={stopCamera}
									className="p-3 bg-slate-800 text-white rounded-full shadow-xl hover:bg-slate-900"
								>
									<RotateCcw size={24} />
								</button>
							</div>
						</div>
					) : (
						<button
							type="button"
							onClick={() => startCamera('face')}
							className="flex flex-col items-center justify-center w-full h-full cursor-pointer outline-none"
						>
							<Camera className="w-10 h-10 text-slate-400 mb-2" />
							<span className="text-sm text-slate-500 font-medium">
								Clique para abrir a câmera
							</span>
						</button>
					)}
					{cameraError && (
						<p className="text-xs text-red-500 mt-2 px-4 text-center">
							{cameraError}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
export default CameraCapture;
