import { PDFDocument, PDFName, PDFDict, PDFArray } from 'pdf-lib';

/**
 * Verifica se um arquivo PDF possui campos de assinatura digital preenchidos.
 * Esta verificação é estrutural: detecta se existem campos do tipo 'Sig' (Signature)
 * com conteúdo preenchido (dicionário de assinatura com ByteRange e Contents).
 *
 * NÃO valida a cadeia de certificação (ICP-Brasil), revogação ou integridade criptográfica completa,
 * mas impede o envio de documentos não assinados ou corrompidos.
 */
export const checkForDigitalSignature = async (
	file: File,
): Promise<boolean> => {
	try {
		// 1. Converter o File para ArrayBuffer
		const arrayBuffer = await file.arrayBuffer();

		// 2. Carregar o documento ignorando encriptação se possível (apenas leitura)
		const pdfDoc = await PDFDocument.load(arrayBuffer, {
			ignoreEncryption: true,
		});

		// 3. Acessar o formulário do PDF (AcroForm)
		const form = pdfDoc.catalog.get(PDFName.of('AcroForm'));

		if (!form || !(form instanceof PDFDict)) {
			console.log('PDF não possui formulários (AcroForm).');
			return false;
		}

		// 4. Acessar os campos do formulário
		const fields = form.get(PDFName.of('Fields'));

		if (!fields || !(fields instanceof PDFArray)) {
			console.log('PDF não possui campos de formulário.');
			return false;
		}

		// 5. Iterar sobre os campos procurando por assinaturas
		// O PDF armazena assinaturas como campos de formulário do tipo 'Sig'
		let hasSignature = false;

		// Percorre os campos de formulário (array de referências)
		for (let i = 0; i < fields.size(); i++) {
			const fieldRef = fields.get(i);
			const field = pdfDoc.context.lookup(fieldRef);

			if (field instanceof PDFDict) {
				const type = field.get(PDFName.of('FT')); // Field Type
				const value = field.get(PDFName.of('V')); // Value (dicionário da assinatura)

				// Verifica se é do tipo Sig (Signature)
				if (type === PDFName.of('Sig')) {
					// Se tem um valor (V), significa que está assinado
					if (value instanceof PDFDict) {
						const contents = value.get(PDFName.of('Contents'));
						const byteRange = value.get(PDFName.of('ByteRange'));

						// Validação extra: verificar se o dicionário da assinatura tem conteúdo
						if (contents && byteRange) {
							hasSignature = true;
							break; // Encontrou assinatura válida, pode parar
						}
					}
				}
			}
		}

		return hasSignature;
	} catch (error) {
		console.error('Erro ao validar assinatura do PDF:', error);
		// Em caso de erro na leitura, assume inválido para segurança
		return false;
	}
};
