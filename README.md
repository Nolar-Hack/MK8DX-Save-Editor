# 🏁 Mario Kart 8 Deluxe - Web Save Editor

A modern and secure web interface for modifying Mario Kart 8 Deluxe save files on Nintendo Switch.

## 🏗️ Modular Architecture

This project uses a **modular architecture** with small specialized files for better maintainability and scalability.

## ✨ Features

- 🔒 **Secure**: Uses official Nintendo checksum algorithm
- 🎯 **Precise**: Modification of 16 different statistics
- 🌐 **Local**: No data sent over the internet
- 📱 **Responsive**: Interface adapted to all screens
- ⚡ **Real-time**: Instant value validation
- 💾 **Save**: Automatic download of modified files

## 🎮 Modifiable Statistics

### 💰 Currency & Items
- **Coins**

### 🏎️ Racing Techniques
- **Drifts**
- **Mini-Turbos**
- **Super Mini-Turbo**
- **Ultra Mini-Turbo**
- **Jump Sync**
- **Lakitu Rescue**

### 🏆 Points & Rankings
- **Race Points**
- **Battle Points**

## 🚀 Usage

### 1. Open the editor
Open the [`index.html`](index.html) file in your modern web browser.

### 2. Load your save
1. Click on "Select userdata.dat"
2. Choose your Mario Kart 8 Deluxe save file
3. The editor automatically validates file integrity

### 3. Modify statistics
1. Current values are displayed automatically
2. Modify desired values in the fields
3. Validation is done in real-time

### 4. Save
1. Click on "Save modifications"
2. The editor automatically recalculates the checksum
3. Download the modified file

### 5. Install on your Switch
1. Copy the modified file to your Switch
2. Replace the old save file
3. Enjoy your new statistics!

## 🛠️ Technical Architecture

### File Structure

```
MK8D-Editors/
├── index.html              # Main user interface
├── css/                    # Modular styles
│   ├── variables.css       # CSS Variables (16 lines)
│   ├── base.css           # Reset and base (42 lines)
│   ├── header.css         # Header (35 lines)
│   ├── cards.css          # Cards (46 lines)
│   ├── forms.css          # Forms (71 lines)
│   ├── buttons.css        # Buttons (42 lines)
│   ├── layout.css         # Layout (54 lines)
│   ├── messages.css       # Messages (49 lines)
│   └── responsive.css     # Responsive (40 lines)
├── js/                    # Modular JavaScript
│   ├── crypto.js          # Cryptography (38 lines)
│   ├── binary.js          # Binary (50 lines)
│   ├── fileUtils.js       # Files (49 lines)
│   ├── formatters.js      # Formatting (55 lines)
│   ├── validation.js      # Validation (113 lines)
│   ├── ui.js              # Interface (105 lines)
│   ├── offsets.js         # Offsets (52 lines)
│   ├── saveEditorCore.js  # Main class (162 lines)
│   ├── saveEditorUtils.js # Extensions (120 lines)
│   └── main.js            # Main script (367 lines)
└── README.md               # Documentation
```

### Technologies Used
- **HTML5**: Modern semantic structure
- **CSS3**: Responsive design with CSS variables and animations
- **JavaScript ES6+**: Business logic and binary manipulation
- **Web APIs**: FileReader, Blob, URL for file management
- **Modular architecture**: Separation of concerns and maintainability

### Modular Architecture Benefits
- 🎯 **Maintainability**: Each file has a unique responsibility
- 🚀 **Performance**: Selective loading and optimized cache
- 👥 **Collaboration**: Parallel development facilitated
- 🔧 **Scalability**: Simplified feature addition
- 🧪 **Testing**: Unit testing per module possible

### Nintendo Checksum Algorithm
```javascript
function calculateNintendoChecksum(data) {
    const crc32 = calculateCRC32(data);
    return (crc32 ^ 0xb33778cd) >>> 0;
}
```

## 🔧 Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Local Installation
```bash
# Clone or download files
git clone <repository>

# Simple local server (optional)
python -m http.server 8000
# or
npx serve .
```

### Code Structure

- **[`js/crypto.js`](js/crypto.js)**: CRC32 and Nintendo checksum (38 lines)
- **[`js/binary.js`](js/binary.js)**: Binary read/write (50 lines)
- **[`js/fileUtils.js`](js/fileUtils.js)**: File management (49 lines)
- **[`js/formatters.js`](js/formatters.js)**: Formatting and utilities (55 lines)
- **[`js/validation.js`](js/validation.js)**: Data validation (113 lines)
- **[`js/ui.js`](js/ui.js)**: User interface (105 lines)
- **[`js/offsets.js`](js/offsets.js)**: Statistics offsets (52 lines)
- **[`js/saveEditorCore.js`](js/saveEditorCore.js)**: Main class (162 lines)
- **[`js/saveEditorUtils.js`](js/saveEditorUtils.js)**: Class extensions (120 lines)
- **[`js/main.js`](js/main.js)**: Main script (367 lines)

## 📊 Statistics Offsets

| Statistic | Offset | Type | Size |
|-----------|--------|------|------|
| Coins | 0x195c | uint32 | 4 bytes |
| Drifts | 0x1968 | uint32 | 4 bytes |
| Mini-Turbos | 0x1970 | uint32 | 4 bytes |
| Super Mini-Turbo | 0x1974 | uint32 | 4 bytes |
| Ultra Mini-Turbo | 0x1978 | uint32 | 4 bytes |
| Jump Sync | 0x1964 | uint32 | 4 bytes |
| Race Points | 0x1e94 | uint32 | 4 bytes |
| Battle Points | 0x1e98 | uint32 | 4 bytes |

## ⚠️ Important Warnings

1. **Backup**: Always make a copy of your original file
2. **Validation**: The editor checks integrity but test on a backup
3. **Limits**: Respect maximum values to avoid bugs
4. **Compatibility**: Tested with Mario Kart 8 Deluxe v3.0.1

## 🐛 Troubleshooting

### File won't load
- Check that it's a `userdata.dat` file
- Check the size (must be exactly 80,736 bytes)
- Make sure the file is not corrupted

### Modifications don't apply
- Check that values are within allowed limits
- Make sure you clicked "Save modifications"
- Check browser console for errors

### Modified file doesn't work on Switch
- Check that checksum was recalculated (displayed in interface)
- Make sure you replaced the correct file
- Test first with small modifications

## 📝 Changelog

### v1.1.2 (2025-06-24)
- 🐛 **Critical fix**: Checksum calculation is now correct. The error came from constant regeneration of the CRC32 table, which has been optimized to be calculated only once.
- ✨ **Improvement**: Counter modification logic has been centralized in a `setCounter` method for more robustness.
- 🧹 **Refactoring**: Duplicate code and erroneous logic have been removed from `main.js` and `saveEditorUtils.js`.

### v1.1.1 (2025-01-24)
- 🐛 **Critical fix**: `validateCurrentFile()` function corrected
- 🔧 **Offset corrected**: Lakitu Rescue moved from 0x1e98 to 0x197c
- 🧹 **Optimization**: Removal of offset duplicates
- ✅ **Validation**: Complete code consistency check
- 📚 **Documentation**: README updated with corrections

### v1.1.0 (2025-01-22)
- ✨ Modular architecture added
- 📦 Specialized CSS files (9 modules)
- 🧩 Modular JavaScript files (10 modules)
- 🎯 Improved maintainability
- 🚀 Optimized performance
- 👥 Facilitated collaboration

### v1.0.0 (2025-01-22)
- ✨ Complete web interface
- 🔒 Integrated Nintendo checksum algorithm
- 🎨 Modern and responsive design
- ⚡ Real-time validation
- 💾 Automatic download

## 🤝 Contribution

This project is based on reverse engineering of the Mario Kart 8 Deluxe save format. Contributions are welcome for:

- Adding new statistics
- Improving user interface
- Optimizing performance
- Fixing bugs
