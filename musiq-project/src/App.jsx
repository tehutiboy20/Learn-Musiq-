import { useEffect, useRef, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'


function App () {

const audioContextRef = useRef(null);
const activeOscillatorsRef = useRef(new Map())
const [pressedKeys, setPressedKeys] = useState(new Set());
const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);
const [darkMode, setDarkMode] = useState(true); 
const [currentSong, setCurrentSong] = useState(null);
const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
const [isTutorialActive, setIsTutorialActive] = useState(false);
const [nextNote, setNextNote] = useState(null); 
const [showCompletion, setShowCompletion] = useState(false);

const noteData = [
  // Lowest octave - E3 to B3 (QWERT row - white keys)
  {note: "E3", frequency:164.81, key: 'q', isBlack:false},
  {note: "F3", frequency:174.61, key: 'w', isBlack:false},
  {note: "F#3", frequency:185.00, key: '3', isBlack:true},
  {note: "G3", frequency:196.00, key: 'e', isBlack:false},
  {note: "G#3", frequency:207.65, key: '4', isBlack:true},
  {note: "A3", frequency:220.00, key: 'r', isBlack:false},
  {note: "A#3", frequency:233.08, key: '5', isBlack:true},
  {note: "B3", frequency:246.94, key: 't', isBlack:false},
  
  // Middle octave - C4 to C5 (YUIOP[]\ row - white keys)
  {note: "C4", frequency:261.63, key: 'y', isBlack:false}, 
  {note: 'C#4', frequency:277.18, key: '7', isBlack:true},
  {note: "D4", frequency:293.66, key: 'u', isBlack:false},
  {note: "D#4", frequency:311.13, key: '8', isBlack:true},
  {note: "E4", frequency:329.63, key: 'i', isBlack:false},
  {note: "F4", frequency:349.23, key: 'o', isBlack:false},
  {note: "F#4", frequency:369.99, key: '0', isBlack:true}, 
  {note: "G4", frequency:392.00, key: 'p', isBlack:false}, 
  {note: "G#4", frequency:415.30, key: '-', isBlack:true},
  {note: "A4", frequency:440.00, key: '[', isBlack:false},
  {note: "A#4", frequency:466.16, key: '=', isBlack:true},
  {note: "B4", frequency:493.88, key: ']', isBlack:false},
  {note: "C5", frequency:523.25, key: '\\', isBlack:false},
]


function startNote(frequency, noteName) {
  // Step 1: Check if already playing (prevent duplicates)
  if (activeOscillatorsRef.current.has(noteName)) {
    return; // Don't create another one
  }
  
  // Check if this is the correct note in tutorial
  checkNote(noteName);
  
  // Step 2: Create/get audio context
  if (audioContextRef.current === null) {
    audioContextRef.current = new AudioContext();
  }
  const audioContext = audioContextRef.current;
  
  // Step 3: Create oscillator
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = 'sine';
  
  // Step 4: Create gain node (for volume control)
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // 30% volume
  
  // Step 5: Connect the chain: oscillator → gainNode → destination
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Step 6: Start the oscillator
  oscillator.start();
  
  // Step 7: Store in Map for later
  activeOscillatorsRef.current.set(noteName, { oscillator, gainNode });
  
  // Step 8: Visual feedback
 setPressedKeys(prev => new Set(prev).add(noteName));
}



function stopNote(noteName) {
  if (!activeOscillatorsRef.current.has(noteName)) {
    return;
  }
  
  const { oscillator, gainNode } = activeOscillatorsRef.current.get(noteName);
  
  try {
    oscillator.stop();
    gainNode.disconnect();
    oscillator.disconnect();
  } catch (error) {
    // Silently handle if already stopped
    console.log(`Note ${noteName} already stopped`);
  }
  
  activeOscillatorsRef.current.delete(noteName);
   
  setPressedKeys(prev => {
    const newSet = new Set(prev);
    newSet.delete(noteName);
    return newSet;
  });
}



function handleKeyPress(event) {
  // Prevent auto-repeat
  if (event.repeat) return;
  
  const pressedKey = event.key;
  const matchedNote = noteData.find((note) => note.key === pressedKey);
  
  if (matchedNote) {
    startNote(matchedNote.frequency, matchedNote.note);
  }
}

function handleKeyRelease(event) {
  const releasedKey = event.key;
  const matchedNote = noteData.find((note) => note.key === releasedKey);
  
  if (matchedNote) {
    stopNote(matchedNote.note);
  }
}

useEffect(() => {
  window.addEventListener('keydown', handleKeyPress);
  window.addEventListener('keyup', handleKeyRelease);
  
  return () => {
    window.removeEventListener('keydown', handleKeyPress);
    window.removeEventListener('keyup', handleKeyRelease);
  };
}, [noteData]); 

useEffect(() => {
  if (darkMode) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
}, [darkMode]);

  // instrument tone generation 
// function handlePlayTone (frequency, duration, noteName) {

//   setPressedKey(noteName);

//   setTimeout(() => {
//     setPressedKey(null);
//   }, duration * 1000);

//  // check if the audiocontext box is empty  
// if (audioContextRef.current === null) {
//   audioContextRef.current = new AudioContext()
// } 

// // now use whats in the box 
// const audioContext = audioContextRef.current

// const oscillator = audioContext.createOscillator()

// //  
// oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
// oscillator.type = 'sine';

// oscillator.connect (audioContext.destination);

// oscillator.start(0)

// oscillator.stop(audioContext.currentTime + duration); 



// }
const songs = {
  maryHadALittleLamb: {
    name: "Mary Had a Little Lamb",
    notes: [
      { note: "E4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "C4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "E4", duration: 1000 },
      { note: "D4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "D4", duration: 1000 },
      { note: "E4", duration: 500 },
      { note: "G4", duration: 500 },
      { note: "G4", duration: 1000 },
      { note: "E4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "C4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "C4", duration: 1500 },
    ]
  },
  twinkleTwinkle: {
    name: "Twinkle Twinkle Little Star",
    notes: [
      { note: "C4", duration: 500 },
      { note: "C4", duration: 500 },
      { note: "G4", duration: 500 },
      { note: "G4", duration: 500 },
      { note: "A4", duration: 500 },
      { note: "A4", duration: 500 },
      { note: "G4", duration: 1000 },
      { note: "F4", duration: 500 },
      { note: "F4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "C4", duration: 1000 },
      { note: "G4", duration: 500 },
      { note: "G4", duration: 500 },
      { note: "F4", duration: 500 },
      { note: "F4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "D4", duration: 1000 },
      { note: "G4", duration: 500 },
      { note: "G4", duration: 500 },
      { note: "F4", duration: 500 },
      { note: "F4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "D4", duration: 1000 },
      { note: "C4", duration: 500 },
      { note: "C4", duration: 500 },
      { note: "G4", duration: 500 },
      { note: "G4", duration: 500 },
      { note: "A4", duration: 500 },
      { note: "A4", duration: 500 },
      { note: "G4", duration: 1000 },
      { note: "F4", duration: 500 },
      { note: "F4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "E4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "D4", duration: 500 },
      { note: "C4", duration: 1500 },
    ]
  }
};

function startTutorial() {
  if (!currentSong) return;
  
  setIsTutorialActive(true);
  setCurrentNoteIndex(0);
  
  // Show the first note to press
  const firstNote = songs[currentSong].notes[0];
  setNextNote(firstNote.note);
}

// Check if user pressed the correct key
function checkNote(pressedNoteName) {
  if (!isTutorialActive || !nextNote) return;
  
  if (pressedNoteName === nextNote) {
    const newIndex = currentNoteIndex + 1;
    
    if (newIndex >= songs[currentSong].notes.length) {
      // Song finished!
      setTimeout(() => {
        setIsTutorialActive(false);
        setNextNote(null);
        setCurrentNoteIndex(0);
        setShowCompletion(true); // Show completion message
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setShowCompletion(false);
        }, 3000);
      }, 1000);
    } else {
      setCurrentNoteIndex(newIndex);
      setNextNote(songs[currentSong].notes[newIndex].note);
    }
  }
}

return (
  <div>
    {/* Header */}
    <header className="app-header">
      <h1 className="app-title">
        <span className="emoji">🎹</span>
        <span className="title-text">Learn Musiq</span>
        <span className="emoji">🎵</span>
      </h1>
      <p className="app-subtitle">Master the piano and more with interactive tutorials</p>
    </header>

    <div className="button-container">
      <button 
        className="toggle-guide-btn"
        onClick={() => setShowKeyboardGuide(!showKeyboardGuide)}
      >
        {showKeyboardGuide ? 'Hide' : 'Show'} Keyboard Guide
      </button>
      
      <button 
        className="theme-toggle-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'} Mode
      </button>

      {/* Song Tutorial Buttons */}
      <select 
        className="song-select"
        onChange={(e) => setCurrentSong(e.target.value)}
        value={currentSong || ''}
      >
        <option value="">Select a Song</option>
        <option value="maryHadALittleLamb">Mary Had a Little Lamb</option>
        <option value="twinkleTwinkle">Twinkle Twinkle Little Star</option>
      </select>

      {currentSong && (
        <button 
          className="tutorial-btn"
          onClick={() => startTutorial()}
        >
          {isTutorialActive ? '⏸️ Pause' : '▶️ Start'} Tutorial
        </button>
      )}
    </div>

    {/* Completion Message */}
    {showCompletion && (
      <div className="completion-message">
        <div className="completion-content">
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You completed {songs[currentSong]?.name}!</p>
        </div>
      </div>
    )}

    {/* Piano */}
    <div className='piano-container'>
      {noteData.map((note) => {
      return <button 
        className={
          `${note.isBlack ? 'black-key' : 'white-key'} 
           ${pressedKeys.has(note.note) ? 
             (note.isBlack ? 'black-key-pressed' : 'white-key-pressed') 
             : ''}
           ${nextNote === note.note ? 'next-note-highlight' : ''}`
        }
        key={note.note} 
        onMouseDown={() => startNote(note.frequency, note.note)}
        onMouseUp={() => stopNote(note.note)}
        onMouseLeave={() => stopNote(note.note)} 
      >
        {note.note}
      </button>
      })}
    </div>

    {/* Keyboard Guide (only shows if toggled on) */}
    {showKeyboardGuide && (
      <div className="keyboard-guide">
        {/* Top row - Numbers (black keys) */}
        <div className="keyboard-row">
          {noteData
            .filter(note => ['3', '4', '5', '7', '8', '0', '-', '='].includes(note.key))
            .map((note) => (
              <div 
                key={note.note}
                className={`guide-key 
                  ${note.note.includes('#') ? 'guide-key-sharp' : ''} 
                  ${pressedKeys.has(note.note) ? 'guide-key-active' : ''}
                  ${nextNote === note.note ? 'next-note-pulse' : ''}`}
              >
                <div className="guide-keyboard-key">{note.key}</div>
                <div className="guide-note-name">{note.note}</div>
              </div>
            ))}
        </div>

        {/* Second row - QWERTYUIOP[]\  (all white keys in one row) */}
        <div className="keyboard-row">
          {noteData
            .filter(note => ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'].includes(note.key))
            .map((note) => (
              <div 
                key={note.note}
                className={`guide-key 
                  ${note.note.includes('#') ? 'guide-key-sharp' : ''} 
                  ${pressedKeys.has(note.note) ? 'guide-key-active' : ''}
                  ${nextNote === note.note ? 'next-note-pulse' : ''}`}
              >
                <div className="guide-keyboard-key">{note.key}</div>
                <div className="guide-note-name">{note.note}</div>
              </div>
            ))}
        </div>
      </div>
    )}
  </div>
)
}
export default App
