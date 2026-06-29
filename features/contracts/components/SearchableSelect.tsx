import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchableSelectProps {
	label: string;
	name: string;
	value: string;
	options: string[];
	placeholder: string;
	onChange: (name: string, value: string) => void;
	required?: boolean;
	error?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
	label,
	name,
	value,
	options,
	placeholder,
	onChange,
	required,
	error,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);

	const filteredOptions = options.filter((opt) =>
		opt.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSelect = (opt: string) => {
		onChange(name, opt);
		setSearchTerm('');
		setIsOpen(false);
	};

	// Fechar ao clicar fora
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="relative space-y-2" ref={containerRef}>
			<label className="block text-sm font-semibold text-slate-700">
				{label}
			</label>
			<div className="relative">
				<input
					type="text"
					value={isOpen ? searchTerm : value}
					onChange={(e) => {
						if (!isOpen) setIsOpen(true);
						setSearchTerm(e.target.value);
						onChange(name, e.target.value);
					}}
					onFocus={() => setIsOpen(true)}
					placeholder={placeholder}
					className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-slate-700 placeholder:text-slate-400 pr-10 ${
						error
							? 'border-red-500 bg-red-50 focus:ring-red-500/10'
							: 'border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
					}`}
					required={required}
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
					{isOpen ? <Search size={18} /> : <ChevronDown size={18} />}
				</div>
			</div>

			{isOpen && filteredOptions.length > 0 && (
				<div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
					{filteredOptions.map((opt) => (
						<button
							key={opt}
							type="button"
							onClick={() => handleSelect(opt)}
							className="w-full px-4 py-3 text-left text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-50 last:border-0"
						>
							{opt}
						</button>
					))}
				</div>
			)}

			{error && (
				<p className="text-xs font-medium text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
					{error}
				</p>
			)}
		</div>
	);
};
export default SearchableSelect;
