---
name: security_audit
description: Automates security vulnerability scanning for Python and Go codebases.
---

# Security Audit Skill

This skill allows the agent to perform an automated security audit on a specific module or directory using industry-standard tools.

## Supported Tools
- **Python**: `bandit` (scans for common security issues in Python code).
- **Go**: `gosec` (Go Security Checker).

## Instructions

### 1. Identify the Module
Scan the directory structure to identify the target module (e.g., `inventory-api` or `customer-api`).

### 2. Run the Audit
Depending on the language, execute the corresponding command:

#### Python Audit
```bash
# Example for customer-api
bandit -r customer-api/ -ll
```

#### Go Audit
```bash
# Example for inventory-api
# Note: Requires gosec to be installed on the system
gosec ./inventory-api/...
```

### 3. Analyze and Report
- Parse the output for "High" or "Medium" severity issues.
- Compare findings against `security_governance.md`.
- Report vulnerabilities to the user and suggest specific fixes.

### 4. Continuous Governance
Apply this skill whenever a new feature is implemented or a dependency is updated.
