import { useState, useRef, useEffect } from 'react';

export const useCamera = () => {
	const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
	const [attachedDocument, setAttachedDocument] = useState<string | null>(null);
	const [activeCamera, setActiveCamera] = useState<'doc' | 'face' | null>(null);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [docCaptureMode, setDocCaptureMode] = useState<'upload' | 'camera'>('upload');

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Garante que o stream da câmera seja desligado se o componente desmontar
	useEffect(() => {
		return () => {
			if (videoRef.current && videoRef.current.srcObject) {
				const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
				tracks.forEach((track) => track.stop());
			}
		};
	}, []);

	const startCamera = async (target: 'doc' | 'face') => {
		setActiveCamera(target);
		setCameraError(null);
		try {
			// Se já houver uma câmera aberta, para ela primeiro antes de abrir outra
			if (videoRef.current && videoRef.current.srcObject) {
				const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
				tracks.forEach((track) => track.stop());
				videoRef.current.srcObject = null;
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: target === 'doc' ? 'environment' : 'user',
				},
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (err) {
			console.error('Erro ao acessar câmera:', err);
			setCameraError(
				'Não foi possível acessar a câmera. Verifique as permissões do navegador.'
			);
			setActiveCamera(null);
		}
	};

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
			tracks.forEach((track) => track.stop());
			videoRef.current.srcObject = null;
		}
		setActiveCamera(null);
	};

	const takePhoto = (target: 'doc' | 'face') => {
		if (videoRef.current && canvasRef.current) {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const dataUrl = canvas.toDataURL('image/jpeg');
				if (target === 'doc') {
					setAttachedDocument(dataUrl);
				} else {
					setCapturedPhoto(dataUrl);
				}
				stopCamera();
			}
		}
	};

	const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.onloadend = () => {
				setAttachedDocument(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return {
		capturedPhoto,
		attachedDocument,
		activeCamera,
		cameraError,
		docCaptureMode,
		videoRef,
		canvasRef,
		setAttachedDocument,
		setCapturedPhoto,
		setDocCaptureMode,
		startCamera,
		stopCamera,
		takePhoto,
		handleDocumentUpload,
	};
};
