module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { code, options } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'No code provided' 
      });
    }

    // Advanced Obfuscation Engine
    const obfuscated = await advancedObfuscate(code, options);

    return res.status(200).json({
      success: true,
      obfuscated: obfuscated,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Obfuscation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Advanced Obfuscation Engine (KuramaMods Style)
async function advancedObfuscate(code, options = {}) {
  const {
    stringEncode = true,
    varMangle = true,
    controlFlow = true,
    antiTamper = true,
    deadCode = true,
    constantFold = true
  } = options;

  let processed = code;

  // Step 1: Variable Mangling
  if (varMangle) {
    processed = mangleVariables(processed);
  }

  // Step 2: String Encoding
  const stringTable = [];
  if (stringEncode) {
    let counter = 0;
    processed = processed.replace(/["']([^"'\\]*(\\.[^"'\\]*)*)["']/g, (match, str) => {
      if (str.length === 0) return match;
      const encoded = Buffer.from(str).toString('base64');
      stringTable.push(`"${encoded}"`);
      return `GQ0yu[${counter++}]`;
    });
  }

  // Step 3: Number Obfuscation
  if (constantFold) {
    processed = obfuscateNumbers(processed);
  }

  // Step 4: Control Flow Obfuscation
  if (controlFlow) {
    processed = addControlFlow(processed);
  }

  // Step 5: Dead Code Injection
  if (deadCode) {
    processed = injectDeadCode(processed);
  }

  // Step 6: Build final wrapper
  const wrapper = buildWrapper(processed, stringTable, antiTamper);

  return wrapper;
}

// Variable Mangling
function mangleVariables(code) {
  const keywords = [
    'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 
    'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 
    'return', 'then', 'true', 'until', 'while', 'print', 'type',
    'pairs', 'ipairs', 'tostring', 'tonumber', 'table', 'string', 'math'
  ];

  const varMap = new Map();
  const varPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
  
  const matches = [...code.matchAll(varPattern)];
  matches.forEach(match => {
    const varName = match[1];
    if (!keywords.includes(varName) && !varMap.has(varName)) {
      varMap.set(varName, generateVarName());
    }
  });

  let result = code;
  varMap.forEach((newName, oldName) => {
    const regex = new RegExp(`\\b${oldName}\\b`, 'g');
    result = result.replace(regex, newName);
  });

  return result;
}

// Number Obfuscation
function obfuscateNumbers(code) {
  return code.replace(/\b(\d+)\b/g, (match, num) => {
    const n = parseInt(num);
    if (n === 0) return '(0)';
    if (n === 1) return '(1)';
    
    const ops = [
      `(${n + 100}-100)`,
      `(${n * 2}/2)`,
      `(${n + 1}-1)`,
      `(${Math.floor(n / 2)}+${n - Math.floor(n / 2)})`,
    ];
    return ops[Math.floor(Math.random() * ops.length)];
  });
}

// Control Flow Obfuscation
function addControlFlow(code) {
  const lines = code.split('\n');
  const obfuscated = lines.map(line => {
    if (line.trim() && !line.trim().startsWith('--') && !line.includes('local function')) {
      return `do ${line} end`;
    }
    return line;
  });
  return obfuscated.join('\n');
}

// Dead Code Injection
function injectDeadCode(code) {
  const deadCodeSnippets = [
    'local _=function()return nil end;',
    'local __=0;if __ then return end;',
    'local ___={};___[1]=nil;',
    'local ____=false;while ____ do break end;'
  ];
  
  const snippet = deadCodeSnippets[Math.floor(Math.random() * deadCodeSnippets.length)];
  return snippet + '\n' + code;
}

// Build Final Wrapper
function buildWrapper(code, stringTable, antiTamper) {
  const vars = {
    main: generateVarName(),
    loader: generateVarName(),
    decoder: generateVarName(),
    checker: generateVarName()
  };

  const stringTableStr = stringTable.length > 0 
    ? `local GQ0yu={${stringTable.join(',')}};` 
    : '';

  const decoder = stringTable.length > 0 ? `
for xQ0yu,RQ0yu in ipairs({{1,${stringTable.length}}})do 
  while RQ0yu[1]<RQ0yu[2]do 
    GQ0yu[RQ0yu[2]],GQ0yu[RQ0yu[1]],RQ0yu[1],RQ0yu[2]=GQ0yu[RQ0yu[1]],GQ0yu[RQ0yu[2]],RQ0yu[1]+1,RQ0yu[2]-1 
  end 
end

local function CQ0yu(xQ0yu)
  return GQ0yu[xQ0yu]
end

do 
  local xQ0yu=string.len
  local RQ0yu={${Array.from({length: 64}, (_, i) => `${String.fromCharCode(65 + (i % 26))}=${i}`).join(',')}}
  for GQ0yu=1,#GQ0yu,1 do
    local vQ0yu=GQ0yu[GQ0yu]
    if type(vQ0yu)=="string" then
      local decoded=''
      for i=1,#vQ0yu do
        decoded=decoded..string.char(vQ0yu:byte(i))
      end
      GQ0yu[GQ0yu]=decoded
    end
  end
end` : '';

  const antiTamperCode = antiTamper ? `
local ${vars.checker}={${Array.from({length: 20}, () => Math.floor(Math.random() * 255)).join(',')}}
local ${vars.loader}=function()
  for i=1,#${vars.checker} do
    if type(${vars.checker}[i])~="number" then
      return error("Tamper detected!")
    end
  end
  return true
end
${vars.loader}()` : '';

  const wrapper = `--[[ Lua  ]]
return(function(...)
${stringTableStr}
${decoder}
${antiTamperCode}

local ${vars.main}=(function(DQ0yu,OQ0yu,cQ0yu,uQ0yu,HQ0yu,hQ0yu,vQ0yu)
  ${code}
  return OQ0yu
end)

return ${vars.main}(...)
end)(...)`;

  return wrapper;
}

// Generate Random Variable Name
function generateVarName() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result + 'Q0yu';
}

// Generate Random Hex
function generateHex(length = 8) {
  return Array.from({length}, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}
