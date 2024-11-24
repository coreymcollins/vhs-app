'use client'

import { createClient } from '@/utils/supabase/client';

const DownloadButton = () => {
	const handleDownload = async () => {
		const supabase = createClient()
		
		const { data, error } = await supabase
			.from('tapes')
			.select('*')
			.order('title', { ascending: true })
			.csv();
		
		if (error) {
			console.error('Error fetching CSV:', error.message);
			return;
		}
		
		if (data) {
			const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'tapes.csv');
			document.body.appendChild(link);
			link.click();
			
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}
	};
	
	return (
		<div>
			<button className="button block" onClick={handleDownload}>Download CSV</button>
		</div>
	);
};

export default DownloadButton;