import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRef } from 'pdf-lib';
import fs from 'fs';

async function inspectPdf(filePath: string) {
	const pdfBytes = fs.readFileSync(filePath);
	const pdfDoc = await PDFDocument.load(pdfBytes);

	console.log('--- Inspecting PDF Structure ---');

	// 1. Check Catalog
	const catalog = pdfDoc.catalog;
	console.log('Catalog exists:', !!catalog);

	// 2. Check AcroForm
	let acroForm = catalog.lookup(PDFName.of('AcroForm'));
	if (!acroForm) {
		console.log('No AcroForm found in Catalog.');
		return;
	}

	if (acroForm instanceof PDFRef) {
		console.log('AcroForm is a Reference, looking it up...');
		acroForm = pdfDoc.context.lookup(acroForm);
	}

	if (!acroForm || !(acroForm instanceof PDFDict)) {
		console.log(
			'AcroForm is not a Dictionary:',
			acroForm?.constructor.name,
		);
		return;
	}
	console.log('AcroForm found.');

	// 3. Check Fields
	const fieldsRef = acroForm.get(PDFName.of('Fields'));
	console.log('Fields entry in AcroForm:', fieldsRef?.constructor.name);

	const fields = acroForm.lookup(PDFName.of('Fields'));
	if (!fields || !(fields instanceof PDFArray)) {
		console.log('No Fields array found.');
		return;
	}

	console.log(`Found ${fields.size()} top-level fields.`);

	// 4. Recursive inspection function
	const inspectFields = (fieldArray: PDFArray, depth = 0) => {
		const indent = '  '.repeat(depth);
		for (let i = 0; i < fieldArray.size(); i++) {
			const fieldRef = fieldArray.get(i);
			const field = pdfDoc.context.lookup(fieldRef);

			if (field instanceof PDFDict) {
				const ft = field.lookup(PDFName.of('FT'));
				const t = field.lookup(PDFName.of('T')); // Partial Name
				const v = field.lookup(PDFName.of('V')); // Value
				const kids = field.lookup(PDFName.of('Kids'));

				const typeStr =
					ft instanceof PDFName ? ft.asString() : 'unknown';
				const nameStr = t instanceof String ? t.valueOf() : 'unnamed';

				console.log(
					`${indent}- Field ${i}: Type=${typeStr}, Name=${nameStr}`,
				);

				if (typeStr === '/Sig') {
					console.log(`${indent}  *** FOUND SIGNATURE ***`);
					if (v instanceof PDFDict) {
						const contents = v.lookup(PDFName.of('Contents'));
						const byteRange = v.lookup(PDFName.of('ByteRange'));
						console.log(`${indent}  - Has Contents: ${!!contents}`);
						console.log(
							`${indent}  - Has ByteRange: ${!!byteRange}`,
						);
					} else {
						console.log(
							`${indent}  - No signature value dict (unsigned field)`,
						);
					}
				}

				// Recurse into Kids
				if (kids instanceof PDFArray) {
					console.log(`${indent}  > Inspecting Kids...`);
					inspectFields(kids, depth + 1);
				}
			}
		}
	};

	inspectFields(fields);
}

// Check if a file path was provided
const args = process.argv.slice(2);
if (args.length > 0) {
	inspectPdf(args[0]).catch(console.error);
} else {
	console.log('Please provide a path to a PDF file.');
}
