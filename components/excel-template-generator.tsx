import React from 'react';
import * as XLSX from 'xlsx';

const ExcelTemplateGenerator = () => {
    const generateTemplate = () => {
        // Sample data
        const data = [
            { material: 'concrete', volume: 150 },
            { material: 'steel', volume: 75 },
            { material: 'glass', volume: 25 },
            { material: 'timber', volume: 45 },
            { material: 'aluminum', volume: 15 }
        ];

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(data);

        // Add column headers explanation
        XLSX.utils.sheet_add_aoa(ws, [
            ['Instructions:'],
            ['1. Enter material names in lowercase'],
            ['2. Enter volume in cubic meters (m³)'],
            ['3. Do not modify column headers'],
            [''],
            ['Supported materials include: concrete, steel, timber, brick, glass, aluminum, etc.'],
            [''],
            ['Example data:']
        ], { origin: 'A1' });

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template');

        // Save file
        XLSX.writeFile(wb, 'embodied_energy_template.xlsx');
    };

    return (
        <button
            onClick={generateTemplate}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
            Download Excel Template
        </button>
    );
};

export default ExcelTemplateGenerator;