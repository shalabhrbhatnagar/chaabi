import React, { useState, useEffect } from 'react';
import './TypingBox.css';

const TypingBox = () => {
  const [inputValue, setInputValue] = useState('');
  const [keysPressed, setKeysPressed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(5 * 60);
  const [keysToType, setKeysToType] = useState('');
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [totalKeysTyped, setTotalKeysTyped] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);

  const numKeysToType = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setKeysToType(generateKeysToType(numKeysToType));
  }, [numKeysToType]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);

    const inputLength = value.length;
    const numMistakes = calculateMistakes(value);
    setKeysPressed(inputLength);
    setAccuracy(calculateAccuracy(inputLength, numMistakes));

    if (inputLength === keysToType.length) {
      setInputValue('');
      setSetsCompleted((prevSetsCompleted) => prevSetsCompleted + 1);
      setTotalKeysTyped((prevTotalKeysTyped) => prevTotalKeysTyped + keysToType.length);
      setTotalMistakes((prevTotalMistakes) => prevTotalMistakes + numMistakes);
    }
  };

  useEffect(() => {
    setKeysToType(generateKeysToType(numKeysToType));
  }, [setsCompleted, numKeysToType]);

  const calculateMistakes = (value) => {
    let mistakes = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== keysToType[i]) {
        mistakes++;
      }
    }
    return mistakes;
  };

  const calculateAccuracy = (inputLength, numMistakes) => {
    if (inputLength === 0) return 100;
    return ((inputLength - numMistakes) / inputLength) * 100;
  };

  const calculateOverallAccuracy = () => {
    if (totalKeysTyped === 0) return 100;
    return ((totalKeysTyped - totalMistakes) / totalKeysTyped) * 100;
  };

  const generateKeysToType = (numKeys) => {
    let randomKeys = '';
    const allowedChars = 'asdfjkli';
    for (let i = 0; i < numKeys; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      randomKeys += allowedChars[randomIndex];
    }
    return randomKeys;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="typing-box">
      <div className="timer">Time remaining: {formatTime(timer)}</div>
      <div className="keys-to-type">
        {keysToType.split('').map((key, index) => (
          <span
            key={index}
            className={`key ${index < inputValue.length ? 'pressed' : ''} ${index === inputValue.length ? 'next-key' : ''}`}
          >
            {key}
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="input-field"
      />
      <div className="keys-pressed">Keys pressed: {keysPressed}</div>
      <div className="accuracy">Accuracy: {accuracy.toFixed(2)}%</div>
      <div className="overall-accuracy">Overall Accuracy: {calculateOverallAccuracy().toFixed(2)}%</div>
    </div>
  );
};

export default TypingBox;
