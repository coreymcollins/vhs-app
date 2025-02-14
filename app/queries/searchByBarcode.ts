'use server'

import { createClient } from '@/utils/supabase/server';

export async function searchByBarcode(barcode: string) {
    const supabase = createClient()

    const { data: tape, error } = await supabase.rpc( 'get_tape_by_barcode', { barcodequery: barcode });

    if (error) {
        console.error(`Error searching for tape by barcode: ${barcode}`)
        throw error
    } else {
        return tape;
    }
}