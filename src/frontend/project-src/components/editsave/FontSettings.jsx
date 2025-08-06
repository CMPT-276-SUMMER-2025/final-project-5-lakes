import { Edit3 } from 'lucide-react';

const notoFonts = [
    { name: "Noto Sans", value: "Noto Sans" },
    { name: "Noto Serif", value: "Noto Serif" },
    { name: "Noto Sans Display", value: "Noto Sans Display" },
    { name: "Noto Color Emoji", value: "Noto Color Emoji" }
];

const FontSettings = ({ 
    activeFontFamily, 
    fontSize, 
    onFontChange, 
    onFontSizeChange 
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Edit3 size={18} className="text-black" strokeWidth={2.5} />
                <p className="text-lg font-semibold text-gray-800">Edit Text</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <select
                        id="fontFamilyDropdown"
                        value={activeFontFamily}
                        onChange={onFontChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        style={{ fontFamily: activeFontFamily }}
                    >
                        {notoFonts.map((font) => (
                            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                {font.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">  
                    <select
                        id="fontSizeDropdown"
                        value={fontSize}
                        onChange={onFontSizeChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        {[6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FontSettings; 