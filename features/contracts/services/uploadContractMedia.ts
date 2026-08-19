import {
	BIXS_API_ROUTES,
	BIXS_MEDIA_UPLOAD_FIELDS,
	buildPublicMediaUrl,
} from '../constants/bixsApi';
import { parseBixsApiError } from './parseBixsApiError';

type BixsMediaUploadResponse = {
	id?: string;
	media_id?: string;
	media_url?: string;
	url?: string;
	status?: string;
};

const UUID_IN_PATH =
	/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function isInternalStorageUrl(url: string): boolean {
	return url.includes('media-minio') || url.includes('X-Amz-Signature');
}

function extractMediaIdFromStorageUrl(url: string): string | null {
	return url.match(UUID_IN_PATH)?.[0] ?? null;
}

function resolvePublicMediaUrl(uploadData: BixsMediaUploadResponse): string {
	const declaredId = uploadData.id ?? uploadData.media_id;
	if (typeof declaredId === 'string' && declaredId.length > 0) {
		return buildPublicMediaUrl(declaredId);
	}
	const storageUrl = uploadData.url ?? uploadData.media_url;
	if (storageUrl && !isInternalStorageUrl(storageUrl)) {
		return storageUrl;
	}
	if (storageUrl) {
		const extractedId = extractMediaIdFromStorageUrl(storageUrl);
		if (extractedId) return buildPublicMediaUrl(extractedId);
	}
	throw new Error(
		'Upload ok, mas a API não devolveu id público da mídia (só URL interna do storage).',
	);
}

export async function uploadContractPdf(input: {
	token: string;
	ownerId: string;
	pdfBlob: Blob;
	fileName: string;
}): Promise<string> {
	const pdfFile = new File([input.pdfBlob], input.fileName, {
		type: 'application/pdf',
	});

	const uploadFormData = new FormData();
	uploadFormData.append('file', pdfFile, input.fileName);
	uploadFormData.append('module', BIXS_MEDIA_UPLOAD_FIELDS.module);
	uploadFormData.append('purpose', BIXS_MEDIA_UPLOAD_FIELDS.purpose);
	uploadFormData.append('owner_type', BIXS_MEDIA_UPLOAD_FIELDS.ownerType);
	uploadFormData.append('owner_id', input.ownerId);
	uploadFormData.append('visibility', BIXS_MEDIA_UPLOAD_FIELDS.visibility);

	console.log('2. [TENTATIVA] Upload do PDF do contrato:', BIXS_API_ROUTES.uploadMedia);

	let uploadResponse: Response;
	try {
		uploadResponse = await fetch(BIXS_API_ROUTES.uploadMedia, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${input.token}`,
				accept: 'application/json',
			},
			body: uploadFormData,
		});
	} catch (err) {
		console.error('2. [FALHA] Erro de rede na requisição de upload:', err);
		throw new Error('Falha de rede no upload da mídia do contrato.');
	}

	if (!uploadResponse.ok) {
		const rawBody = await uploadResponse.text();
		const apiMessage = parseBixsApiError(uploadResponse.status, rawBody);
		console.error(
			`2. [FALHA] Upload do contrato falhou. Status HTTP: ${uploadResponse.status}`,
			apiMessage,
		);
		throw new Error(`Falha no upload do contrato. ${apiMessage}`);
	}

	const uploadData = (await uploadResponse.json()) as BixsMediaUploadResponse;
	const publicMediaUrl = resolvePublicMediaUrl(uploadData);
	console.log('2. [SUCESSO] Upload realizado. Stream público:', publicMediaUrl, {
		id: uploadData.id,
		media_id: uploadData.media_id,
		status: uploadData.status,
	});
	return publicMediaUrl;
}
