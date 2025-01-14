import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

// Expanded database of embodied energy values (MJ/kg)
const EMBODIED_ENERGY_DATABASE = {
    // Structural Materials
    'concrete': 0.95,
    'steel': 20.1,
    'timber': 10.0,
    'brick': 3.0,
    'reinforced concrete': 2.5,
    'precast concrete': 2.0,
    'structural steel': 25.4,
    'stainless steel': 56.7,
    'glulam timber': 12.0,
    
    // Metals
    'aluminum': 155.0,
    'copper': 70.6,
    'zinc': 51.0,
    'brass': 62.0,
    'lead': 25.2,
    'galvanized steel': 34.8,
    
    // Building Envelope
    'glass': 15.9,
    'double glazing': 24.5,
    'triple glazing': 30.0,
    'fiber cement': 9.5,
    'ceramic tiles': 12.0,
    'roof tiles': 6.5,
    
    // Insulation Materials
    'mineral wool': 16.6,
    'glass wool': 28.0,
    'polystyrene': 88.6,
    'polyurethane': 101.5,
    'cork': 4.0,
    'cellulose': 2.9,
    
    // Finishes
    'plaster': 1.8,
    'gypsum board': 6.1,
    'paint': 70.0,
    'wallpaper': 36.4,
    'carpet': 74.4,
    'linoleum': 25.0,
    
    // Others
    'plastic': 80.5,
    'stone': 1.0,
    'asphalt': 51.0,
    'mortar': 1.4,
    'sand': 0.1,
    'gravel': 0.1
};

const UNIT_CONVERSIONS = {
    'm3': 1,
    'ft3': 0.028317,
    'L': 0.001,
    'gal': 0.003785
};

const EmbodiedEnergyCalculator = () => {
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('m3');

    const processExcel = async (e) => {
        const file = e.target.files[0];
        setError('');
        
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { 
                type: 'array',
                cellDates: true,
                cellNF: true,
                cellStyles: true
            });
            
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            // Process the data
            const processedData = jsonData.map(row => {
                const material = row.material?.toLowerCase() || row.Material?.toLowerCase();
                const volume = parseFloat(row.volume || row.Volume);
                
                if (!material || isNaN(volume)) {
                    throw new Error('Invalid data format. Please ensure your Excel file has "material" and "volume" columns.');
                }
                
                const embodiedEnergy = EMBODIED_ENERGY_DATABASE[material];
                const convertedVolume = volume * UNIT_CONVERSIONS[selectedUnit];
                
                if (embodiedEnergy === undefined) {
                    return {
                        material,
                        volume,
                        volumeUnit: selectedUnit,
                        embodiedEnergy: 'Not found',
                        totalEnergy: 'N/A',
                        error: true
                    };
                }
                
                return {
                    material,
                    volume,
                    volumeUnit: selectedUnit,
                    embodiedEnergy,
                    totalEnergy: convertedVolume * embodiedEnergy,
                    error: false
                };
            });
            
            // Calculate total
            const totalEnergy = processedData
                .filter(item => !item.error)
                .reduce((sum, item) => sum + item.totalEnergy, 0);
            
            setResults({
                items: processedData,
                total: totalEnergy
            });
            
        } catch (err) {
            setError(err.message);
        }
    };

    const exportToExcel = () => {
        if (!results) return;
        
        const exportData = results.items.map(item => ({
            Material: item.material,
            Volume: item.volume,
            'Volume Unit': item.volumeUnit,
            'Embodied Energy (MJ/kg)': item.embodiedEnergy,
            'Total Energy (MJ)': item.error ? 'N/A' : item.totalEnergy.toFixed(2)
        }));
        
        // Add total row
        exportData.push({
            Material: 'TOTAL',
            Volume: '',
            'Volume Unit': '',
            'Embodied Energy (MJ/kg)': '',
            'Total Energy (MJ)': results.total.toFixed(2)
        });
        
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Embodied Energy Results');
        XLSX.writeFile(wb, 'embodied_energy_results.xlsx');
    };

    return (
        <Card className="w-full max-w-6xl">
            <CardHeader>
                <CardTitle>Embodied Energy Calculator</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium block mb-2">
                                Upload Excel File:
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={processExcel}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="w-32">
                            <label className="text-sm font-medium block mb-2">
                                Volume Unit:
                            </label>
                            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="m3">Cubic Meters (m³)</SelectItem>
                                    <SelectItem value="ft3">Cubic Feet (ft³)</SelectItem>
                                    <SelectItem value="L">Liters (L)</SelectItem>
                                    <SelectItem value="gal">Gallons (gal)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {results && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={exportToExcel}
                                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    <Download size={16} />
                                    Export Results
                                </button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Material</TableHead>
                                        <TableHead>Volume ({selectedUnit})</TableHead>
                                        <TableHead>Embodied Energy (MJ/kg)</TableHead>
                                        <TableHead>Total Energy (MJ)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="capitalize">
                                                {item.material}
                                            </TableCell>
                                            <TableCell>{item.volume}</TableCell>
                                            <TableCell>
                                                {item.error ? (
                                                    <span className="text-red-500">Not found</span>
                                                ) : (
                                                    item.embodiedEnergy
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.error ? 'N/A' : item.totalEnergy.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            
                            <div className="pt-4 border-t">
                                <p className="text-lg font-semibold">
                                    Total Embodied Energy: {results.total.toFixed(2)} MJ
                                </p>
                            </div>

                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={results.items.filter(item => !item.error)}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 60
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="material"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis label={{ value: 'Total Energy (MJ)', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip />
                                        <Bar dataKey="totalEnergy" fill="#3b82f6" name="Total Energy (MJ)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default EmbodiedEnergyCalculator;