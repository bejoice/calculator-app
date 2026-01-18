// YOUR CALCULATOR CODE FROM ARTIFACT
// Copy the entire Calculator.jsx code from the "Basic Calculator" artifact
// Paste it here
import { useState, useEffect } from 'react';

const themes = {
  dark: {
    bg: 'from-gray-900 to-gray-800',
    calculator: 'bg-gray-900',
    display: 'bg-gray-800',
    number: 'bg-gray-700 hover:bg-gray-600',
    function: 'bg-gray-600 hover:bg-gray-500',
    operation: 'bg-orange-500 hover:bg-orange-600',
    operationActive: 'bg-orange-600',
    text: 'text-white',
    historyBg: 'bg-gray-800',
    historyItem: 'hover:bg-gray-700'
  },
  light: {
    bg: 'from-gray-100 to-gray-200',
    calculator: 'bg-white',
    display: 'bg-gray-100',
    number: 'bg-gray-200 hover:bg-gray-300',
    function: 'bg-gray-300 hover:bg-gray-400',
    operation: 'bg-blue-500 hover:bg-blue-600',
    operationActive: 'bg-blue-600',
    text: 'text-gray-900',
    historyBg: 'bg-gray-100',
    historyItem: 'hover:bg-gray-200'
  },
  purple: {
    bg: 'from-purple-900 to-indigo-900',
    calculator: 'bg-purple-950',
    display: 'bg-purple-900',
    number: 'bg-purple-800 hover:bg-purple-700',
    function: 'bg-purple-700 hover:bg-purple-600',
    operation: 'bg-pink-500 hover:bg-pink-600',
    operationActive: 'bg-pink-600',
    text: 'text-white',
    historyBg: 'bg-purple-900',
    historyItem: 'hover:bg-purple-800'
  },
  green: {
    bg: 'from-green-900 to-teal-900',
    calculator: 'bg-green-950',
    display: 'bg-green-900',
    number: 'bg-green-800 hover:bg-green-700',
    function: 'bg-green-700 hover:bg-green-600',
    operation: 'bg-teal-500 hover:bg-teal-600',
    operationActive: 'bg-teal-600',
    text: 'text-white',
    historyBg: 'bg-green-900',
    historyItem: 'hover:bg-green-800'
  },
  ocean: {
    bg: 'from-blue-900 to-cyan-900',
    calculator: 'bg-blue-950',
    display: 'bg-blue-900',
    number: 'bg-blue-800 hover:bg-blue-700',
    function: 'bg-blue-700 hover:bg-blue-600',
    operation: 'bg-cyan-500 hover:bg-cyan-600',
    operationActive: 'bg-cyan-600',
    text: 'text-white',
    historyBg: 'bg-blue-900',
    historyItem: 'hover:bg-blue-800'
  }
};

const conversions = {
  volume: {
    name: 'Volume',
    units: {
      'Milliliters': 1,
      'Liters': 1000,
      'Gallons (US)': 3785.41,
      'Cups': 236.588,
      'Fluid Ounces': 29.5735,
      'Tablespoons': 14.7868,
      'Teaspoons': 4.92892
    }
  },
  mass: {
    name: 'Mass',
    units: {
      'Milligrams': 1,
      'Grams': 1000,
      'Kilograms': 1000000,
      'Pounds': 453592,
      'Ounces': 28349.5,
      'Tons': 1000000000
    }
  },
  data: {
    name: 'Data',
    units: {
      'Bytes': 1,
      'Kilobytes': 1024,
      'Megabytes': 1048576,
      'Gigabytes': 1073741824,
      'Terabytes': 1099511627776
    }
  },
  speed: {
    name: 'Speed',
    units: {
      'm/s': 1,
      'km/h': 0.277778,
      'mph': 0.44704,
      'knots': 0.514444,
      'ft/s': 0.3048
    }
  },
  time: {
    name: 'Time',
    units: {
      'Seconds': 1,
      'Minutes': 60,
      'Hours': 3600,
      'Days': 86400,
      'Weeks': 604800,
      'Months': 2628000,
      'Years': 31536000
    }
  }
};

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState('basic');
  const [theme, setTheme] = useState('dark');
  const [memory, setMemory] = useState(0);
  const [parenthesesStack, setParenthesesStack] = useState([]);
  const [converterCategory, setConverterCategory] = useState('volume');
  const [fromUnit, setFromUnit] = useState('Liters');
  const [toUnit, setToUnit] = useState('Milliliters');
  const [converterValue, setConverterValue] = useState('1');

  const currentTheme = themes[theme];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (mode === 'converter') return;
      e.preventDefault();
      
      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperation('+');
      } else if (e.key === '-') {
        handleOperation('-');
      } else if (e.key === '*') {
        handleOperation('×');
      } else if (e.key === '/') {
        handleOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === '%') {
        handlePercentage();
      } else if (e.key === '(' || e.key === ')') {
        handleParenthesis(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, previousValue, operation, newNumber, mode]);

  const addToHistory = (calculation, result) => {
    const entry = {
      calculation,
      result,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [entry, ...prev].slice(0, 100));
  };

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(String(num));
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleParenthesis = (paren) => {
    if (paren === '(') {
      setDisplay(display + '(');
      setParenthesesStack([...parenthesesStack, '(']);
    } else if (paren === ')' && parenthesesStack.length > 0) {
      setDisplay(display + ')');
      setParenthesesStack(parenthesesStack.slice(0, -1));
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return current !== 0 ? prev / current : 'Error';
      case '^':
        return Math.pow(prev, current);
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      const calculation = `${previousValue} ${operation} ${currentValue}`;
      addToHistory(calculation, result);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
    setParenthesesStack([]);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      const lastChar = display[display.length - 1];
      if (lastChar === ')') {
        setParenthesesStack([...parenthesesStack, '(']);
      } else if (lastChar === '(') {
        setParenthesesStack(parenthesesStack.slice(0, -1));
      }
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
    setNewNumber(true);
  };

  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const handleScientific = (func) => {
    const value = parseFloat(display);
    let result;
    
    switch(func) {
      case 'sqrt':
        result = Math.sqrt(value);
        addToHistory(`√${value}`, result);
        break;
      case 'square':
        result = value * value;
        addToHistory(`${value}²`, result);
        break;
      case 'sin':
        result = Math.sin(value);
        addToHistory(`sin(${value})`, result);
        break;
      case 'cos':
        result = Math.cos(value);
        addToHistory(`cos(${value})`, result);
        break;
      case 'tan':
        result = Math.tan(value);
        addToHistory(`tan(${value})`, result);
        break;
      case 'ln':
        result = Math.log(value);
        addToHistory(`ln(${value})`, result);
        break;
      case 'log':
        result = Math.log10(value);
        addToHistory(`log(${value})`, result);
        break;
      case '1/x':
        result = 1 / value;
        addToHistory(`1/${value}`, result);
        break;
      case 'exp':
        result = Math.exp(value);
        addToHistory(`e^${value}`, result);
        break;
      case 'pi':
        result = Math.PI;
        addToHistory('π', result);
        break;
      case 'e':
        result = Math.E;
        addToHistory('e', result);
        break;
      default:
        result = value;
    }
    
    setDisplay(String(result));
    setNewNumber(true);
  };

  const handleMemory = (action) => {
    const value = parseFloat(display);
    switch(action) {
      case 'mc':
        setMemory(0);
        break;
      case 'mr':
        setDisplay(String(memory));
        setNewNumber(true);
        break;
      case 'm+':
        setMemory(memory + value);
        setNewNumber(true);
        break;
      case 'm-':
        setMemory(memory - value);
        setNewNumber(true);
        break;
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const loadHistoryValue = (result) => {
    setDisplay(String(result));
    setNewNumber(true);
    setShowHistory(false);
  };

  const convertValue = () => {
    const value = parseFloat(converterValue);
    if (isNaN(value)) return '0';
    
    const category = conversions[converterCategory];
    const fromFactor = category.units[fromUnit];
    const toFactor = category.units[toUnit];
    
    const result = (value * fromFactor) / toFactor;
    return result.toFixed(6).replace(/\.?0+$/, '');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} flex items-center justify-center p-4`}>
      <div className="flex gap-4 w-full max-w-6xl">
        <div className={`${currentTheme.calculator} rounded-3xl shadow-2xl p-6 ${mode === 'scientific' ? 'w-full max-w-2xl' : mode === 'converter' ? 'w-full max-w-md' : 'w-full max-w-sm'}`}>
          <div className="flex gap-2 mb-4 justify-center">
            {Object.keys(themes).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-8 h-8 rounded-full ${themes[t].operation} ${theme === t ? 'ring-2 ring-white' : ''}`}
                title={t}
              />
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('basic')}
              className={`flex-1 py-2 rounded-xl ${mode === 'basic' ? currentTheme.operation : currentTheme.function} ${currentTheme.text} text-sm transition-colors`}
            >
              Basic
            </button>
            <button
              onClick={() => setMode('scientific')}
              className={`flex-1 py-2 rounded-xl ${mode === 'scientific' ? currentTheme.operation : currentTheme.function} ${currentTheme.text} text-sm transition-colors`}
            >
              Scientific
            </button>
            <button
              onClick={() => setMode('converter')}
              className={`flex-1 py-2 rounded-xl ${mode === 'converter' ? currentTheme.operation : currentTheme.function} ${currentTheme.text} text-sm transition-colors`}
            >
              Convert
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-4 py-2 rounded-xl ${showHistory ? currentTheme.operation : currentTheme.function} ${currentTheme.text} transition-colors`}
            >
              📜
            </button>
          </div>

          {mode === 'converter' ? (
            <div>
              <div className={`${currentTheme.display} rounded-2xl p-6 mb-6`}>
                <h3 className={`${currentTheme.text} text-xl font-semibold mb-4`}>Unit Converter</h3>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Object.keys(conversions).map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setConverterCategory(cat);
                        const units = Object.keys(conversions[cat].units);
                        setFromUnit(units[0]);
                        setToUnit(units[1] || units[0]);
                      }}
                      className={`py-2 px-3 rounded-lg text-sm ${converterCategory === cat ? currentTheme.operation : currentTheme.function} ${currentTheme.text} transition-colors`}
                    >
                      {conversions[cat].name}
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <label className={`${currentTheme.text} text-sm mb-2 block`}>From:</label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className={`w-full p-3 rounded-lg ${currentTheme.number} ${currentTheme.text} border-0 outline-none mb-2`}
                  >
                    {Object.keys(conversions[converterCategory].units).map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={converterValue}
                    onChange={(e) => setConverterValue(e.target.value)}
                    className={`w-full p-3 rounded-lg ${currentTheme.number} ${currentTheme.text} border-0 outline-none text-2xl`}
                    placeholder="Enter value"
                  />
                </div>

                <div className="mb-4">
                  <label className={`${currentTheme.text} text-sm mb-2 block`}>To:</label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className={`w-full p-3 rounded-lg ${currentTheme.number} ${currentTheme.text} border-0 outline-none mb-2`}
                  >
                    {Object.keys(conversions[converterCategory].units).map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <div className={`w-full p-3 rounded-lg ${currentTheme.display} ${currentTheme.text} text-2xl font-semibold`}>
                    {convertValue()}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const temp = fromUnit;
                    setFromUnit(toUnit);
                    setToUnit(temp);
                  }}
                  className={`w-full py-3 rounded-lg ${currentTheme.operation} ${currentTheme.text} font-semibold transition-colors`}
                >
                  ⇅ Swap Units
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={`${currentTheme.display} rounded-2xl p-6 mb-6 min-h-[100px] flex items-end justify-end`}>
                <div className="text-right w-full">
                  {operation && previousValue !== null && (
                    <div className="text-gray-500 text-sm mb-1">
                      {previousValue} {operation}
                    </div>
                  )}
                  {memory !== 0 && (
                    <div className="text-gray-500 text-xs mb-1">
                      M: {memory}
                    </div>
                  )}
                  <div className={`${currentTheme.text} text-5xl font-light overflow-hidden text-ellipsis`}>
                    {display.length > 12 ? parseFloat(display).toExponential(6) : display}
                  </div>
                </div>
              </div>

              {mode === 'scientific' ? (
                <div className="grid grid-cols-5 gap-2">
                  <button onClick={handleClear} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>AC</button>
                  <button onClick={handleToggleSign} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>+/−</button>
                  <button onClick={handlePercentage} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>%</button>
                  <button onClick={() => handleParenthesis('(')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-lg font-semibold transition-colors`}>(</button>
                  <button onClick={() => handleParenthesis(')')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-lg font-semibold transition-colors`}>)</button>

                  <button onClick={() => handleMemory('mc')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>MC</button>
                  <button onClick={() => handleMemory('mr')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>MR</button>
                  <button onClick={() => handleMemory('m+')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>M+</button>
                  <button onClick={() => handleMemory('m-')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>M−</button>
                  <button onClick={handleBackspace} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-lg font-semibold transition-colors`}>⌫</button>

                  <button onClick={() => handleScientific('sin')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>sin</button>
                  <button onClick={() => handleScientific('cos')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>cos</button>
                  <button onClick={() => handleScientific('tan')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>tan</button>
                  <button onClick={() => handleScientific('pi')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>π</button>
                  <button onClick={() => handleScientific('e')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>e</button>

                  <button onClick={() => handleScientific('ln')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>ln</button>
                  <button onClick={() => handleScientific('log')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>log</button>
                  <button onClick={() => handleScientific('sqrt')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>√x</button>
                  <button onClick={() => handleScientific('square')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>x²</button>
                  <button onClick={() => handleOperation('^')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>xʸ</button>

                  <button onClick={() => handleScientific('exp')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>eˣ</button>
                  <button onClick={() => handleScientific('1/x')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>1/x</button>
                  <button onClick={() => handleScientific('factorial')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>x!</button>
                  <button onClick={() => handleScientific('abs')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>|x|</button>
                  <button onClick={() => handleScientific('mod')} className={`${currentTheme.function} ${currentTheme.text} rounded-xl p-3 text-sm font-semibold transition-colors`}>mod</button>

                  <button onClick={() => handleNumber(7)} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>7</button>
                  <button onClick={() => handleNumber(8)} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>8</button>
                  <button onClick={() => handleNumber(9)} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>9</button>
                  <button onClick={() => handleOperation('÷')} className={`${operation === '÷' ? currentTheme.operationActive : currentTheme.operation} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors col-span-2`}>÷</button>

                  <button onClick={() => handleNumber(4)} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>4</button>
                  <button onClick={() => handleNumber(5)} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>5</button>
                  <button onClick={() => handleNumber(6)} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>6</button>
                  <button onClick={() => handleOperation('×')} className={`${operation === '×' ? currentTheme.operationActive : currentTheme.operation} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors col-span-2`}>×</button>

                  <button onClick={() => handleNumber(1)} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>1</button>
                  <button onClick={() => handleNumber(2)} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>2</button>
                  <button onClick={() => handleNumber(3)} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>3</button>
                  <button onClick={() => handleOperation('-')} className={`${operation === '-' ? currentTheme.operationActive : currentTheme.operation} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors col-span-2`}>−</button>

                  <button onClick={() => handleNumber(0)} className={`col-span-2 ${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>0</button>
                  <button onClick={handleDecimal} className={`${currentTheme.number} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>.</button>
                  <button onClick={() => handleOperation('+')} className={`${operation === '+' ? currentTheme.operationActive : currentTheme.operation} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>+</button>
                  <button onClick={handleEquals} className={`${currentTheme.operation} ${currentTheme.text} rounded-xl p-4 text-xl font-semibold transition-colors`}>=</button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  <button onClick={handleClear} className={`${currentTheme.function} ${currentTheme.text} rounded-2xl p-6 text-xl font-semibold transition-colors`}>AC</button>
                  <button onClick={handleToggleSign} className={`${currentTheme.function} ${currentTheme.text} rounded-2xl p-6 text-xl font-semibold transition-colors`}>+/−</button>
                  <button onClick={handlePercentage} className={`${currentTheme.function} ${currentTheme.text} rounded-2xl p-6 text-xl font-semibold transition-colors`}>%</button>
                  <button onClick={() => handleOperation('÷')} className={`${operation === '÷' ? currentTheme.operationActive : currentTheme.operation} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>÷</button>

                  <button onClick={() => handleNumber(7)} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>7</button>
                  <button onClick={() => handleNumber(8)} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>8</button>
                  <button onClick={() => handleNumber(9)} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>9</button>
                  <button onClick={() => handleOperation('×')} className={`${operation === '×' ? currentTheme.operationActive : currentTheme.operation} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>×</button>

                  <button onClick={() => handleNumber(4)} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>4</button>
                  <button onClick={() => handleNumber(5)} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>5</button>
                  <button onClick={() => handleNumber(6)} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>6</button>
                  <button onClick={() => handleOperation('-')} className={`${operation === '-' ? currentTheme.operationActive : currentTheme.operation} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>−</button>

                  <button onClick={() => handleNumber(1)} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>1</button>
                  <button onClick={() => handleNumber(2)} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>2</button>
                  <button onClick={() => handleNumber(3)} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>3</button>
                  <button onClick={() => handleOperation('+')} className={`${operation === '+' ? currentTheme.operationActive : currentTheme.operation} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>+</button>

                  <button onClick={() => handleNumber(0)} className={`col-span-2 ${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>0</button>
                  <button onClick={handleDecimal} className={`${currentTheme.number} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>.</button>
                  <button onClick={handleEquals} className={`${currentTheme.operation} ${currentTheme.text} rounded-2xl p-6 text-2xl font-semibold transition-colors`}>=</button>
                </div>
              )}

              <div className={`mt-4 text-xs ${currentTheme.text} opacity-50 text-center`}>
                Keyboard: Numbers, +, -, *, /, (, ), Enter, Esc, Backspace
              </div>
            </>
          )}
        </div>

        {showHistory && (
          <div className={`${currentTheme.calculator} rounded-3xl shadow-2xl p-6 w-80 max-h-[600px] flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${currentTheme.text} text-xl font-semibold`}>History</h3>
              <button onClick={clearHistory} className={`${currentTheme.function} ${currentTheme.text} px-3 py-1 rounded-lg text-sm`}>
                Clear
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {history.length === 0 ? (
                <p className={`${currentTheme.text} opacity-50 text-center mt-8`}>No history yet</p>
              ) : (
                history.map((entry, index) => (
                  <div
                    key={index}
                    onClick={() => loadHistoryValue(entry.result)}
                    className={`${currentTheme.historyBg} ${currentTheme.historyItem} rounded-lg p-3 mb-2 cursor-pointer transition-colors`}
                  >
                    <div className={`${currentTheme.text} text-sm opacity-70`}>{entry.calculation}</div>
                    <div className={`${currentTheme.text} text-lg font-semibold`}>= {entry.result}</div>
                    <div className={`${currentTheme.text} text-xs opacity-50`}>{entry.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
