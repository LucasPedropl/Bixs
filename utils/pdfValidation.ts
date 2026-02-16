import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRef } from 'pdf-lib';

/**
 * Verifica se um arquivo PDF possui campos de assinatura digital preenchidos.
 * Esta versão utiliza busca recursiva e helpers para lidar com referências indiretas (PDFRef),
 * comuns em PDFs complexos como os do assinador .GOV.BR.
 */
export const checkForDigitalSignature = async (
	file: File,
): Promise<boolean> => {
	try {
		const arrayBuffer = await file.arrayBuffer();
		// Carrega ignorando criptografia para leitura
		const pdfDoc = await PDFDocument.load(arrayBuffer, {
			ignoreEncryption: true,
		});

		// Função auxiliar para resolver referências (PDFRef -> PDFObject)
		// O método 'lookup' do contexto do documento faz isso automaticamente,
		// mas precisamos garantir que estamos trabalhando com o dicionário correto.
		const lookup = (ref: any) => pdfDoc.context.lookup(ref);

		// 1. Acessa o Catálogo
		const catalog = pdfDoc.catalog;

		// 2. Acessa o AcroForm (pode ser uma referência)
		const acroFormRef = catalog.get(PDFName.of('AcroForm'));
		const acroForm = lookup(acroFormRef);

		if (!acroForm || !(acroForm instanceof PDFDict)) {
			console.log('PDF não possui formulários (AcroForm).');
			return false;
		}

		// 3. Acessa os campos (Fields) do formulário
		const fieldsRef = acroForm.get(PDFName.of('Fields'));
		const fields = lookup(fieldsRef);

		if (!fields || !(fields instanceof PDFArray)) {
			console.log('PDF não possui campos de formulário (Fields).');
			return false;
		}

		// 4. Função recursiva para buscar assinaturas
		// Necessária pois campos podem estar aninhados em 'Kids' ou em árvores de widgets
		const findSignatureInFields = (fieldArray: PDFArray): boolean => {
			for (let i = 0; i < fieldArray.size(); i++) {
				const fieldRef = fieldArray.get(i);
				const field = lookup(fieldRef);

				if (field instanceof PDFDict) {
					// Verifica o tipo do campo
					const type = lookup(field.get(PDFName.of('FT'))); // Field Type

					// Se for campo de assinatura ('Sig')
					if (type === PDFName.of('Sig')) {
						// Verifica o valor ('V') que contém o dicionário da assinatura
						const valueRef = field.get(PDFName.of('V'));
						const value = lookup(valueRef);

						if (value instanceof PDFDict) {
							const contents = value.get(PDFName.of('Contents')); // Assinatura binária (PKCS#7)
							const byteRange = value.get(
								PDFName.of('ByteRange'),
							); // Intervalo de bytes assinados

							// Se tiver assinatura binária e intervalo, consideramos assinado
							if (contents && byteRange) {
								return true;
							}
						}
					}

					// Se não for assinatura ou se não estiver assinado, verifica se tem filhos (Kids)
					// Campos de formulário podem ser hierárquicos
					const kidsRef = field.get(PDFName.of('Kids'));
					const kids = lookup(kidsRef);

					if (kids instanceof PDFArray) {
						if (findSignatureInFields(kids)) {
							return true;
						}
					}
				}
			}
			return false;
		};

		return findSignatureInFields(fields);
	} catch (error) {
		console.error('Erro ao validar assinatura do PDF:', error);
		return false;
	}
};
