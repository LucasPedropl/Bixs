import React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { RotateCcw } from 'lucide-react';

interface SignaturePadProps {
	sigCanvasRef: React.RefObject<SignatureCanvas | null>;
	sigContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
	sigCanvasRef,
	sigContainerRef,
}) => {
	return (
		<div className="space-y-4 relative">
			<p className="text-sm text-slate-500">
				Utilize o mouse ou o dedo para desenhar sua assinatura no quadro abaixo:
			</p>

			<div
				ref={sigContainerRef}
				className="border-2 border-slate-200 rounded-2xl bg-slate-50 overflow-hidden h-48 relative"
			>
				<div className="flex-1 w-full h-full relative">
					<SignatureCanvas
						ref={sigCanvasRef}
						penColor="black"
						canvasProps={{
							className: 'w-full h-full cursor-crosshair touch-none',
						}}
					/>
				</div>
			</div>

			<button
				type="button"
				onClick={() => sigCanvasRef.current?.clear()}
				className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 outline-none"
			>
				<RotateCcw size={14} />
				Limpar Assinatura
			</button>
		</div>
	);
};
export default SignaturePad;
