import { useState, useRef, useCallback } from 'react'
import { NavMenu } from '../../../shared/ui-components/NavMenu'

// Character sets for different ASCII art styles
const CHARACTER_SETS = {
  standard: ' .:-=+*#%@',
  blocks: ' ░▒▓█',
  detailed: ' .",:;!~+-<>i?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  simple: ' .-+*#@',
}

type CharSetKey = keyof typeof CHARACTER_SETS

function App() {
  const [image, setImage] = useState<string | null>(null)
  const [asciiArt, setAsciiArt] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [width, setWidth] = useState<number>(100)
  const [charSet, setCharSet] = useState<CharSetKey>('standard')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setAsciiArt('') // Clear previous output
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const convertToAscii = useCallback(() => {
    if (!image) return

    setIsProcessing(true)
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Calculate height maintaining aspect ratio
        const aspectRatio = img.height / img.width
        const height = Math.floor(width * aspectRatio * 0.5) // 0.5 to account for character height/width ratio

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        const imageData = ctx.getImageData(0, 0, width, height)
        const pixels = imageData.data
        const chars = CHARACTER_SETS[charSet]

        let ascii = ''
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4
            const r = pixels[i]
            const g = pixels[i + 1]
            const b = pixels[i + 2]
            
            // Calculate brightness
            const brightness = (r + g + b) / 3
            
            // Map brightness to character
            const charIndex = Math.floor((brightness / 255) * (chars.length - 1))
            ascii += chars[charIndex]
          }
          ascii += '\n'
        }

        setAsciiArt(ascii)
        setIsProcessing(false)
      }
      img.src = image
    }, 10)
  }, [image, width, charSet])

  const copyToClipboard = useCallback(() => {
    if (asciiArt) {
      navigator.clipboard.writeText(asciiArt)
      alert('ASCII art copied to clipboard!')
    }
  }, [asciiArt])

  const downloadAscii = useCallback(() => {
    if (asciiArt) {
      const blob = new Blob([asciiArt], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ascii-${fileName || 'art'}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [asciiArt, fileName])

  return (
    <div className="terminal">
      <NavMenu />
      <div className="terminal-header">
        <div className="terminal-title">ASCII-FY v1.0</div>
        <div className="terminal-subtitle">Image to ASCII Art Converter</div>
      </div>

      <div className="terminal-content">
        <div className="controls-section">
          <div className="control-group">
            <label className="control-label">► SELECT IMAGE FILE:</label>
            <div className="file-input-wrapper">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <button
                className="file-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </button>
              {fileName && <span className="file-name">{fileName}</span>}
            </div>
            {image && (
              <img src={image} alt="Preview" className="preview-image" />
            )}
          </div>

          <div className="control-group">
            <label className="control-label">► OUTPUT WIDTH: {width} chars</label>
            <div className="slider-group">
              <input
                type="range"
                min="40"
                max="200"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="slider"
              />
              <span className="slider-value">{width}</span>
            </div>
            <div className="info-text">
              Adjust the width to control detail level (40-200 characters)
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">► CHARACTER SET:</label>
            <div className="charset-buttons">
              {(Object.keys(CHARACTER_SETS) as CharSetKey[]).map((key) => (
                <button
                  key={key}
                  className={`charset-button ${charSet === key ? 'active' : ''}`}
                  onClick={() => setCharSet(key)}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="info-text">
              Preview: {CHARACTER_SETS[charSet]}
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="action-button"
              onClick={convertToAscii}
              disabled={!image || isProcessing}
            >
              {isProcessing ? 'Processing...' : '► Generate ASCII Art'}
            </button>
            <button
              className="action-button"
              onClick={copyToClipboard}
              disabled={!asciiArt}
            >
              Copy to Clipboard
            </button>
            <button
              className="action-button"
              onClick={downloadAscii}
              disabled={!asciiArt}
            >
              Download .TXT
            </button>
          </div>
        </div>

        {isProcessing && (
          <div className="loading">
            ░░░ PROCESSING IMAGE ░░░
          </div>
        )}

        {asciiArt && !isProcessing && (
          <div className="output-section">
            <div className="output-header">► OUTPUT:</div>
            <div className="ascii-output">{asciiArt}</div>
            <div className="info-text">
              Lines: {asciiArt.split('\n').length - 1} | Characters: {asciiArt.length}
            </div>
          </div>
        )}

        {!image && !isProcessing && (
          <div className="output-section">
            <div className="output-header">► INSTRUCTIONS:</div>
            <div className="ascii-output">
{`
╔═══════════════════════════════════════════════════════════╗
║                   ASCII-FY v1.0                           ║
║              Image to ASCII Art Converter                 ║
╚═══════════════════════════════════════════════════════════╝

SYSTEM READY

1. Click "BROWSE FILES" to select an image
2. Adjust OUTPUT WIDTH for desired detail level
3. Choose a CHARACTER SET:
   - STANDARD: Classic ASCII art style
   - BLOCKS: Use block characters for solid look
   - DETAILED: Maximum detail with extended charset
   - SIMPLE: Minimalist 6-character set
4. Click "GENERATE ASCII ART" to convert
5. Copy to clipboard or download as .TXT file

TIPS:
• Smaller images work better (< 1MB recommended)
• High contrast images produce clearer results
• Larger width = more detail but harder to view
• Try different character sets for various effects

Ready for input_
`}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
